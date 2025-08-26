import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";

/**
 * Props for `Experience`.
 */
export type ExperienceProps = SliceComponentProps<Content.ExperienceSlice>;

/**
 * Component for "Experience" Slices.
 */
const Experience: FC<ExperienceProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Heading as="h2" size="md">
        {slice.primary.heading}
      </Heading>
        {slice.primary.repeatable.map((item, index)=>(
          <div key={index} className="ml-6 mt-8 max-w-prose md:ml-12 md:mt-16">
            <Heading as="h3" size="sm">
              {item.title}
            </Heading>
            <div className="mt-1 flex w-fit items-center gap-1 text-2xl font-semibold tracking-tight text-slate-300">
              {item.institution}
            </div>
            <div className="flex w-fit items-center gap-w text-sm font-medium tracking-tight text-slate-300">
              {item.location}
            </div>
            <div className="flex w-fit items-center gap-w text-sm font-medium tracking-tight text-slate-300">
              {item.time_period}
            </div>
            <div className="prose prose-lg prose-invert mt-4">
              <PrismicRichText field={item.description} />
            </div>
          </div>
        ))}
      
    </Bounded>  
  );
};

export default Experience;
