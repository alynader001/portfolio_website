import Image from "next/image";
import Link from "next/link";
import type { Entry } from "@/lib/content";

/** Compact project cards: cover image, title, two-line summary, and tags */
export default function ProjectGrid({ projects }: { projects: Entry[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map(({ slug, metadata }) => (
        <li key={slug}>
          <Link
            href={`/projects/${slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-colors hover:border-green-600/60 hover:bg-white/10"
          >
            {metadata.image && (
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={metadata.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-4">
              <h3 className="text-lg font-bold leading-snug text-slate-100">{metadata.title}</h3>
              <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-300">{metadata.summary}</p>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold text-green-600">
                {metadata.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
