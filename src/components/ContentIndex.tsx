import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import ContentList from "./ContentList";
import { getEntries, type EntryKind } from "@/lib/content";

type ContentIndexProps = {
  heading: string;
  kind: EntryKind;
  viewMoreText: string;
};

export default async function ContentIndex({ heading, kind, viewMoreText }: ContentIndexProps) {
  const entries = await getEntries(kind);
  const items = entries.map(({ slug, metadata }) => ({
    slug,
    title: metadata.title,
    tags: metadata.tags,
  }));

  return (
    <Bounded>
      <Heading size="xl" className="mb-8">
        {heading}
      </Heading>
      <ContentList
        items={items}
        urlPrefix={`/${kind}`}
        viewMoreText={viewMoreText}
      />
    </Bounded>
  );
}
