import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";

export type EntryKind = "projects" | "blog";

/** The `export const metadata` object at the top of each .mdx file */
export type EntryMetadata = {
  title: string;
  date?: string;
  tags: string[];
  /** Projects only: position on the homepage (ascending), so put your strongest work first */
  order?: number;
  metaTitle?: string;
  metaDescription?: string;
  /** Projects only: one-line summary and cover image for the project cards */
  summary?: string;
  image?: string;
};

export type Entry = {
  slug: string;
  metadata: EntryMetadata;
  Content: ComponentType;
};

export function getSlugs(kind: EntryKind) {
  return fs
    .readdirSync(path.join(process.cwd(), "src/content", kind))
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export async function getEntry(kind: EntryKind, slug: string): Promise<Entry | null> {
  if (!getSlugs(kind).includes(slug)) return null;

  const mod =
    kind === "projects"
      ? await import(`@/content/projects/${slug}.mdx`)
      : await import(`@/content/blog/${slug}.mdx`);

  return { slug, metadata: mod.metadata, Content: mod.default };
}

export async function getEntries(kind: EntryKind) {
  const entries = (await Promise.all(getSlugs(kind).map((slug) => getEntry(kind, slug)))).filter(
    (entry): entry is Entry => entry !== null,
  );

  return kind === "projects"
    ? entries.sort((a, b) => (a.metadata.order ?? Infinity) - (b.metadata.order ?? Infinity))
    : entries.sort((a, b) => (b.metadata.date ?? "").localeCompare(a.metadata.date ?? ""));
}

export function formatDate(date?: string) {
  if (!date) return undefined;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
