export type Detection = {
  bbox: [number, number, number, number];
  area: number;
  width: number;
  height: number;
  aspectRatio: number;
  fillRatio: number;
  meanWarmth: number;
  score: number;
  kind: "warm_horizontal_line" | "warm_vertical_line";
};

export type DetectorOptions = {
  ignoreUi: boolean;
  minScore: number;
  maxDetections: number;
};

type MutableBox = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  orientation: "horizontal" | "vertical";
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function rgbToHsvDegrees(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let hue = 0;

  if (delta > 0.000001) {
    if (max === rn) hue = 60 * (((gn - bn) / delta) % 6);
    else if (max === gn) hue = 60 * ((bn - rn) / delta + 2);
    else hue = 60 * ((rn - gn) / delta + 4);
  }

  if (hue < 0) hue += 360;
  const saturation = max === 0 ? 0 : delta / max;
  return { hue, saturation, value: max };
}

function dilate(mask: Uint8Array, width: number, height: number, radius: number) {
  const out = new Uint8Array(mask.length);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let found = 0;
      for (let dy = -radius; dy <= radius && !found; dy += 1) {
        const yy = y + dy;
        if (yy < 0 || yy >= height) continue;
        for (let dx = -radius; dx <= radius; dx += 1) {
          const xx = x + dx;
          if (xx >= 0 && xx < width && mask[yy * width + xx]) {
            found = 1;
            break;
          }
        }
      }
      out[y * width + x] = found;
    }
  }
  return out;
}

function erode(mask: Uint8Array, width: number, height: number, radius: number) {
  const out = new Uint8Array(mask.length);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let keep = 1;
      for (let dy = -radius; dy <= radius && keep; dy += 1) {
        const yy = y + dy;
        for (let dx = -radius; dx <= radius; dx += 1) {
          const xx = x + dx;
          if (yy < 0 || yy >= height || xx < 0 || xx >= width || !mask[yy * width + xx]) {
            keep = 0;
            break;
          }
        }
      }
      out[y * width + x] = keep;
    }
  }
  return out;
}

function removeSmallComponents(mask: Uint8Array, width: number, height: number, minArea: number) {
  const seen = new Uint8Array(mask.length);
  const out = new Uint8Array(mask.length);
  const queue: number[] = [];

  for (let i = 0; i < mask.length; i += 1) {
    if (!mask[i] || seen[i]) continue;

    const component: number[] = [];
    queue.length = 0;
    queue.push(i);
    seen[i] = 1;

    for (let head = 0; head < queue.length; head += 1) {
      const current = queue[head];
      component.push(current);
      const x = current % width;
      const y = Math.floor(current / width);

      for (let dy = -1; dy <= 1; dy += 1) {
        const yy = y + dy;
        if (yy < 0 || yy >= height) continue;
        for (let dx = -1; dx <= 1; dx += 1) {
          const xx = x + dx;
          if (xx < 0 || xx >= width) continue;
          const next = yy * width + xx;
          if (mask[next] && !seen[next]) {
            seen[next] = 1;
            queue.push(next);
          }
        }
      }
    }

    if (component.length >= minArea) {
      for (const index of component) out[index] = 1;
    }
  }

  return out;
}

function makeWarmMask(imageData: ImageData, options: DetectorOptions) {
  const { width, height, data } = imageData;
  let mask = new Uint8Array(width * height);
  const warmth = new Float32Array(width * height);

  for (let i = 0; i < width * height; i += 1) {
    const offset = i * 4;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    const { hue, saturation, value } = rgbToHsvDegrees(r, g, b);
    const warmHue = hue <= 70 || hue >= 340;
    const warmPixel = warmHue && saturation > 0.28 && value > 0.32 && r > 105 && r > b + 25;
    mask[i] = warmPixel ? 1 : 0;
    warmth[i] = clamp((r - b) / 255, 0, 1);
  }

  if (options.ignoreUi) {
    const top = Math.floor(height * 0.08);
    const bottom = Math.floor(height * 0.91);
    const left = Math.floor(width * 0.035);
    const right = Math.floor(width * 0.88);

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (y < top || y >= bottom || x < left || x >= right) mask[y * width + x] = 0;
      }
    }
  }

  mask = erode(dilate(mask, width, height, 1), width, height, 1);
  mask = dilate(erode(mask, width, height, 1), width, height, 1);
  mask = removeSmallComponents(mask, width, height, Math.max(12, Math.floor(width * height * 0.00008)));

  return { mask, warmth };
}

function contourMask(mask: Uint8Array, width: number, height: number) {
  const eroded = erode(mask, width, height, 1);
  const boundary = new Uint8Array(mask.length);
  for (let i = 0; i < mask.length; i += 1) boundary[i] = mask[i] && !eroded[i] ? 1 : 0;
  return dilate(boundary, width, height, 1);
}

function mergeLineBox(boxes: MutableBox[], next: MutableBox, maxDistance = 5) {
  for (const box of boxes) {
    if (box.orientation !== next.orientation) continue;
    const closeY = next.y1 <= box.y2 + maxDistance && next.y2 >= box.y1 - maxDistance;
    const closeX = next.x1 <= box.x2 + maxDistance && next.x2 >= box.x1 - maxDistance;
    if (closeX && closeY) {
      box.x1 = Math.min(box.x1, next.x1);
      box.y1 = Math.min(box.y1, next.y1);
      box.x2 = Math.max(box.x2, next.x2);
      box.y2 = Math.max(box.y2, next.y2);
      return;
    }
  }
  boxes.push(next);
}

function lineBoxes(mask: Uint8Array, width: number, height: number, minLength: number) {
  const boxes: MutableBox[] = [];
  const maxGap = Math.max(4, Math.floor(minLength / 7));
  const minSupport = 0.34;

  for (let y = 0; y < height; y += 1) {
    let start = -1;
    let previous = -1;
    let support = 0;
    for (let x = 0; x <= width; x += 1) {
      const active = x < width && mask[y * width + x] === 1;
      if (active && start === -1) {
        start = x;
        previous = x;
        support = 1;
      } else if (active && x - previous <= maxGap) {
        previous = x;
        support += 1;
      } else if (start !== -1) {
        const length = previous - start + 1;
        if (length >= minLength && support / length >= minSupport) {
          mergeLineBox(boxes, { x1: start, y1: y, x2: previous, y2: y, orientation: "horizontal" });
        }
        start = active ? x : -1;
        previous = active ? x : -1;
        support = active ? 1 : 0;
      }
    }
  }

  for (let x = 0; x < width; x += 1) {
    let start = -1;
    let previous = -1;
    let support = 0;
    for (let y = 0; y <= height; y += 1) {
      const active = y < height && mask[y * width + x] === 1;
      if (active && start === -1) {
        start = y;
        previous = y;
        support = 1;
      } else if (active && y - previous <= maxGap) {
        previous = y;
        support += 1;
      } else if (start !== -1) {
        const length = previous - start + 1;
        if (length >= minLength && support / length >= minSupport) {
          mergeLineBox(boxes, { x1: x, y1: start, x2: x, y2: previous, orientation: "vertical" });
        }
        start = active ? y : -1;
        previous = active ? y : -1;
        support = active ? 1 : 0;
      }
    }
  }

  return boxes;
}

function detectionFromBox(box: MutableBox, mask: Uint8Array, warmth: Float32Array, width: number) {
  const boxWidth = box.x2 - box.x1 + 1;
  const boxHeight = box.y2 - box.y1 + 1;
  let area = 0;
  let warmthSum = 0;

  for (let y = box.y1; y <= box.y2; y += 1) {
    for (let x = box.x1; x <= box.x2; x += 1) {
      const index = y * width + x;
      if (mask[index]) {
        area += 1;
        warmthSum += warmth[index];
      }
    }
  }

  if (!area) return null;
  const fillRatio = area / (boxWidth * boxHeight);
  const aspectRatio = Math.max(boxWidth / Math.max(boxHeight, 1), boxHeight / Math.max(boxWidth, 1));
  const meanWarmth = warmthSum / area;
  const length = Math.max(boxWidth, boxHeight);
  const score = clamp(
    0.36 * Math.min(length / 180, 1) +
      0.24 * Math.min(aspectRatio / 20, 1) +
      0.25 * meanWarmth +
      0.15 * Math.min(fillRatio / 0.55, 1),
    0,
    1,
  );

  return {
    bbox: [box.x1, box.y1, box.x2, box.y2] as [number, number, number, number],
    area,
    width: boxWidth,
    height: boxHeight,
    aspectRatio,
    fillRatio,
    meanWarmth,
    score,
    kind: box.orientation === "horizontal" ? "warm_horizontal_line" : "warm_vertical_line",
  } satisfies Detection;
}

function boxIou(a: Detection, b: Detection) {
  const [ax1, ay1, ax2, ay2] = a.bbox;
  const [bx1, by1, bx2, by2] = b.bbox;
  const ix1 = Math.max(ax1, bx1);
  const iy1 = Math.max(ay1, by1);
  const ix2 = Math.min(ax2, bx2);
  const iy2 = Math.min(ay2, by2);
  if (ix2 < ix1 || iy2 < iy1) return 0;
  const intersection = (ix2 - ix1 + 1) * (iy2 - iy1 + 1);
  const areaA = (ax2 - ax1 + 1) * (ay2 - ay1 + 1);
  const areaB = (bx2 - bx1 + 1) * (by2 - by1 + 1);
  return intersection / (areaA + areaB - intersection);
}

export function detectThermalLeaks(imageData: ImageData, options: DetectorOptions) {
  const { width, height } = imageData;
  const { mask: warmMask, warmth } = makeWarmMask(imageData, options);
  const contours = contourMask(warmMask, width, height);
  const candidates = dilate(contours, width, height, 1);
  const minLength = Math.max(18, Math.floor(Math.min(width, height) * 0.08));

  const detections = lineBoxes(candidates, width, height, minLength)
    .map((box) => detectionFromBox(box, candidates, warmth, width))
    .filter((item): item is Detection => item !== null && item.score >= options.minScore)
    .sort((a, b) => b.score - a.score);

  const kept: Detection[] = [];
  for (const detection of detections) {
    if (kept.every((existing) => boxIou(detection, existing) <= 0.2)) kept.push(detection);
    if (kept.length >= options.maxDetections) break;
  }

  return { detections: kept, warmMask, contours, candidates };
}
