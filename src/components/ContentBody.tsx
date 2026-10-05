import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";

type ContentBodyProps = {
  title: string;
  tags: string[];
  /** Line under the tags, e.g. a date */
  meta?: React.ReactNode;
  children: React.ReactNode;
};

export default function ContentBody({ title, tags, meta, children }: ContentBodyProps) {
  return (
    <Bounded as="article">
      <div className="rounded-2xl bg-white px-4 py-10 md:px-8 md:py-20">
        <Heading as="h1" className="!text-slate-700">
          {title}
        </Heading>
        <div className="flex gap-4 text-green-600 text-xl font-bold">
          {tags.map((tag)=>(
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <p className="mt-8 border-b border-slate-600 text-xl font-medium text-slate-600">
          {meta}
        </p>
        <div className="prose prose-lg mt-12 w-full max-w-none md:mt-20 ">
          {children}
        </div>
      </div>
    </Bounded>
  );
}
