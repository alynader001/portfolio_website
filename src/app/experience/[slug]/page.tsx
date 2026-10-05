import { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";

import ContentBody from "@/components/ContentBody";
import { jobs } from "@/content/experience";

type Params = { slug: string };

export const dynamicParams = false;

function getJob(slug: string) {
  return jobs.find((job) => job.slug === slug);
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) notFound();

  const { default: Content }: { default: ComponentType } = await import(
    `@/content/experience/${slug}.mdx`
  );

  return (
    <ContentBody
      title={`${job.role}, ${job.company}`}
      tags={job.stack}
      meta={`${job.dates} · ${job.location}`}
    >
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
  const job = getJob(slug);
  if (!job) notFound();

  return {
    title: `${job.role} at ${job.company}`,
    description: job.summary,
  };
}

export function generateStaticParams() {
  return jobs.filter((job) => job.slug).map((job) => ({ slug: job.slug! }));
}
