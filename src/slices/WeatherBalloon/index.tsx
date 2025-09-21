import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Bounded from "@/components/Bounded";
import WeatherBalloonInfo from "./WeatherBalloonInfo";

/**
 * Props for `WeatherBalloon`.
 */
export type WeatherBalloonProps =
  SliceComponentProps<Content.WeatherBalloonSlice>;

/**
 * Component for "WeatherBalloon" Slices.
 */
const WeatherBalloon: FC<WeatherBalloonProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div>
        <WeatherBalloonInfo/>
      </div>
    </Bounded>
  );
};

export default WeatherBalloon;
