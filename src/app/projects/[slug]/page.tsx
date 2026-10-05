import { Metadata } from "next";
import { notFound } from "next/navigation";

import ContentBody from "@/components/ContentBody";
import { formatDate, getEntry, getSlugs } from "@/lib/content";

type Params = { slug: string };

export const dynamicParams = false;

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const entry = await getEntry("projects", slug);
  if (!entry) notFound();

  const { metadata, Content } = entry;

  return (
    <ContentBody title={metadata.title} tags={metadata.tags} meta={formatDate(metadata.date)}>
      <Content />
    </ContentBody>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getEntry("projects", slug);
  if (!entry) notFound();

  return {
    title: entry.metadata.metaTitle,
    description: entry.metadata.metaDescription,
  };
}

export function generateStaticParams() {
  return getSlugs("projects").map((slug) => ({ slug }));
}
