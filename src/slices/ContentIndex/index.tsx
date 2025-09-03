import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import ContentList from "./ContentList";
import { createClient } from "@/prismicio";

/**
 * Props for `ContentIndex`.
 */
export type ContentIndexProps = SliceComponentProps<Content.ContentIndexSlice>;

/**
 * Component for "ContentIndex" Slices..
 */
const ContentIndex: FC<ContentIndexProps> = async ({ slice }) => {
  const client = createClient();
  const blogPosts = await client.getAllByType("blog_post");
  const projects = await client.getAllByType("project_page",
    {
      orderings: [
        {
          field: 'my.project_page.order',
          direction: 'asc'
        }
      ]
    }
  );

  const contentType = slice.primary.content_type;
  if(!contentType) return null;
  
  // add content types here
  const items = (() => {
    switch (contentType) {
      case "Blog":
        return blogPosts;
      case "Project":
        return projects;
      default:
       return null;
    }
  }) ();
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Heading size="xl" className="mb-8">
        {slice.primary.heading}
      </Heading>
      {isFilled.richText(slice.primary.description) && (
        <div className="prose prose-xl prose-invert mb-10">
          <PrismicRichText field={slice.primary.description}/>
        </div>
      )}
      <ContentList
        //@ts-expect-error: items error
        items={items}   
        contentType={contentType}
        fallbackItemImage={slice.primary.fallback_item_image}
        viewMoreText={slice.primary.view_more_text}
      />
    </Bounded>
  );
};

export default ContentIndex;
