import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Bounded from "@/components/Bounded";
import Shapes from "./Shapes"
import Button from "@/components/Button";
import { PrismicNextImage } from "@prismicio/next";
/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero: FC<HeroProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-center">
        <PrismicNextImage
        field={slice.primary.portrait}
        className="col-start-1 md:col-start-2 md:row-start-1"
        >
        </PrismicNextImage>
        <div className="col-start-1 md:row-start-1">
          <h1 className="mb-8 text-[clamp(3rem,15vmin,20rem)] font-extrabold leading-none
            tracking-tighter" aria-label={
              slice.primary.first_name + " " + slice.primary.last_name
              }>
            <span className="text-slate-300">{slice.primary.first_name}</span>
            <span className="-mt-[.2em] block text-slate-300">{slice.primary.last_name}</span>
            <span className="block bg-gradient-to-tr from-green-600 via-green-200
           to-green-600 bg-clip-text text-2xl font-bold uppercase tracking-[.2em]
            text-transparent opacity-100 md:text-4xl">{slice.primary.tag_line}</span>
          </h1>
          <Button linkField={slice.primary.projects_button} label={slice.primary.projects_label} className="text-black mb-2"/>
          <Button linkField={slice.primary.resume_button} label={slice.primary.resume_label} className="text-black"/>
        </div>
      </div>
    </Bounded>
  );
};

export default Hero;
