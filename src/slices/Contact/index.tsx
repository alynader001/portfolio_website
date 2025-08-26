import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { PrismicNextLink } from "@prismicio/next";

/**
 * Props for `Contact`.
 */
export type ContactProps = SliceComponentProps<Content.ContactSlice>;

/**
 * Component for "Contact" Slices.
 */
const Contact: FC<ContactProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Heading as="h2" size="lg">
        {slice.primary.heading}
      </Heading>
      <div className="ml-6 mt-4 max-w-prose md:ml-12 flex text-xl font-bold flex-col gap-2">
        <PrismicNextLink
        field={slice.primary.email}
        >
        {slice.primary.email.text} 
        </PrismicNextLink>
        <PrismicNextLink
        field={slice.primary.phone_number}
        >
          {slice.primary.phone_number.text}
        </PrismicNextLink>
      </div>
    </Bounded>
  );
};

export default Contact;
