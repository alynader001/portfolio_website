"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { FiDownload, FiImage, FiSliders, FiUpload } from "react-icons/fi";
import { detectThermalLeaks, Detection } from "./detector";

type LoadedImage = {
  fileName: string;
  url: string;
  width: number;
  height: number;
};

const formatKind = (kind: Detection["kind"]) => (kind === "warm_horizontal_line" ? "Horizontal seam" : "Vertical seam");

export default function ThermalLeakDetector() {
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [minScore, setMinScore] = useState(0.48);
  const [maxDetections, setMaxDetections] = useState(10);
  const [ignoreUi, setIgnoreUi] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const strongestScore = useMemo(() => detections[0]?.score ?? 0, [detections]);

  useEffect(() => {
    return () => {
      if (image?.url) URL.revokeObjectURL(image.url);
    };
  }, [image?.url]);

  useEffect(() => {
    if (!image) return;

    const sourceCanvas = sourceCanvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!sourceCanvas || !overlayCanvas) return;

    const img = new Image();
    img.onload = () => {
      setIsProcessing(true);
      const maxWidth = 1100;
      const scale = Math.min(1, maxWidth / img.naturalWidth);
      const width = Math.round(img.naturalWidth * scale);
      const height = Math.round(img.naturalHeight * scale);

      sourceCanvas.width = width;
      sourceCanvas.height = height;
      overlayCanvas.width = width;
      overlayCanvas.height = height;

      const sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
      const overlayContext = overlayCanvas.getContext("2d");
      if (!sourceContext || !overlayContext) return;

      sourceContext.drawImage(img, 0, 0, width, height);
      const imageData = sourceContext.getImageData(0, 0, width, height);
      const result = detectThermalLeaks(imageData, { ignoreUi, minScore, maxDetections });

      overlayContext.clearRect(0, 0, width, height);
      overlayContext.drawImage(sourceCanvas, 0, 0);
      drawOverlay(overlayContext, result.detections);
      setDetections(result.detections);
      setIsProcessing(false);
    };
    img.src = image.url;
  }, [image, ignoreUi, maxDetections, minScore]);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (image?.url) URL.revokeObjectURL(image.url);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImage({
        fileName: file.name,
        url,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.src = url;
  }

  function downloadOverlay() {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${image?.fileName ?? "thermal-image"}-overlay.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8">
      <section className="grid gap-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">Classical CV</p>
        <div className="grid gap-4 lg:grid-cols-[1fr_20rem] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-4xl font-semibold text-white md:text-6xl">Thermal leak detector</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Upload a thermal image and the page highlights warm horizontal and vertical seam contours that may indicate
              leakage around doors, windows, and envelope edges.
            </p>
          </div>

          <label className="group flex cursor-pointer items-center justify-center gap-3 rounded-md border border-cyan-300/30 bg-cyan-300/10 px-5 py-4 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/70 hover:bg-cyan-300/15">
            <FiUpload aria-hidden="true" className="h-5 w-5" />
            <span>Choose thermal image</span>
            <input className="sr-only" type="file" accept="image/*" onChange={handleFile} />
          </label>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/70">
          <div className="flex min-h-[26rem] items-center justify-center bg-black/40">
            {image ? (
              <canvas ref={overlayCanvasRef} className="h-auto max-h-[72vh] w-full object-contain" />
            ) : (
              <div className="grid justify-items-center gap-3 px-6 py-24 text-center text-slate-400">
                <FiImage aria-hidden="true" className="h-10 w-10 text-cyan-200/70" />
                <p className="max-w-md text-sm leading-6">Select a FLIR-style thermal image to generate an overlay.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="grid content-start gap-4">
          <div className="rounded-lg border border-white/10 bg-slate-950/75 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <FiSliders aria-hidden="true" className="h-4 w-4 text-cyan-200" />
              Detector controls
            </div>

            <label className="mt-5 grid gap-2 text-sm text-slate-300">
              Minimum score
              <input
                type="range"
                min="0.25"
                max="0.85"
                step="0.01"
                value={minScore}
                onChange={(event) => setMinScore(Number(event.target.value))}
                className="accent-cyan-300"
              />
              <span className="text-xs text-slate-500">{minScore.toFixed(2)}</span>
            </label>

            <label className="mt-5 grid gap-2 text-sm text-slate-300">
              Max detections
              <input
                type="number"
                min="1"
                max="30"
                value={maxDetections}
                onChange={(event) => setMaxDetections(Number(event.target.value))}
                className="rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-cyan-300/70"
              />
            </label>

            <label className="mt-5 flex items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={ignoreUi}
                onChange={(event) => setIgnoreUi(event.target.checked)}
                className="h-4 w-4 accent-cyan-300"
              />
              Ignore FLIR overlay borders
            </label>

            <button
              type="button"
              onClick={downloadOverlay}
              disabled={!image}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiDownload aria-hidden="true" className="h-4 w-4" />
              Download overlay
            </button>
          </div>

          <div className="rounded-lg border border-white/10 bg-slate-950/75 p-5">
            <h2 className="text-sm font-semibold text-white">Result</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Metric label="Detections" value={detections.length.toString()} />
              <Metric label="Strongest" value={strongestScore.toFixed(2)} />
            </div>
            {image && (
              <p className="mt-4 text-xs leading-5 text-slate-500">
                {image.fileName} · {image.width} x {image.height}
              </p>
            )}
            {isProcessing && <p className="mt-4 text-sm text-cyan-200">Processing image...</p>}
          </div>

          {detections.length > 0 && (
            <div className="rounded-lg border border-white/10 bg-slate-950/75 p-5">
              <h2 className="text-sm font-semibold text-white">Detections</h2>
              <ol className="mt-4 grid gap-3">
                {detections.map((detection, index) => (
                  <li key={`${detection.kind}-${detection.bbox.join("-")}`} className="rounded-md bg-white/5 p-3">
                    <div className="flex items-center justify-between gap-3 text-sm text-white">
                      <span>{formatKind(detection.kind)}</span>
                      <span className="font-semibold text-cyan-200">{detection.score.toFixed(2)}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      #{index + 1} · box {detection.width} x {detection.height}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </aside>
      </section>

      <canvas ref={sourceCanvasRef} className="hidden" />
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/5 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function drawOverlay(context: CanvasRenderingContext2D, detections: Detection[]) {
  context.lineWidth = 3;
  context.font = "13px sans-serif";
  context.textBaseline = "top";

  detections.forEach((detection) => {
    const [x1, y1, x2, y2] = detection.bbox;
    const highConfidence = detection.score >= 0.58;
    const color = highConfidence ? "rgb(255, 42, 24)" : "rgb(255, 190, 20)";
    const label = `${detection.kind === "warm_horizontal_line" ? "H" : "V"} ${detection.score.toFixed(2)}`;

    context.strokeStyle = color;
    context.fillStyle = color;
    context.strokeRect(x1, y1, x2 - x1 + 1, y2 - y1 + 1);
    context.fillText(label, x1 + 4, Math.max(4, y1 - 16));
  });
}
