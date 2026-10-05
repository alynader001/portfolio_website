import { type Metadata } from "next";

import ContentIndex from "@/components/ContentIndex";

export const metadata: Metadata = {
  title: "Blog Page",
};

export default function Page() {
  return <ContentIndex heading="Blog" kind="blog" viewMoreText="Read More" />;
}
