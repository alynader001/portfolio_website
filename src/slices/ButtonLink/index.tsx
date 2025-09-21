import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Bounded from "@/components/Bounded";
import Button from "@/components/Button";

/**
 * Props for `ButtonLink`.
 */
export type ButtonLinkProps = SliceComponentProps<Content.ButtonLinkSlice>;

/**
 * Component for "ButtonLink" Slices.
 */
const ButtonLink: FC<ButtonLinkProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Button linkField={slice.primary.linkbutton} label={slice.primary.linklabel} className="text-black no-underline"/>
    </Bounded>
  );
};

export default ButtonLink;
