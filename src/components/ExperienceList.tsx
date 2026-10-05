import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import type { Job } from "@/content/experience";

export default function ExperienceList({ jobs }: { jobs: Job[] }) {
  const fullTime = jobs.filter((job) => !job.partTime);
  const partTime = jobs.filter((job) => job.partTime);

  return (
    <Bounded id="experience" className="scroll-mt-8">
      <Heading as="h2" size="md" className="mb-8">
        Experience
      </Heading>
      <Heading as="h3" size="sm" className="mb-4">
        Full-time
      </Heading>
      <JobList jobs={fullTime} />
      {partTime.length > 0 && (
        <>
          <Heading as="h3" size="sm" className="mb-4 mt-12">
            Part-time
          </Heading>
          <JobList jobs={partTime} />
        </>
      )}
    </Bounded>
  );
}

function JobList({ jobs }: { jobs: Job[] }) {
  return (
    <ul className="border-b border-b-slate-700">
      {jobs.map((job) => {
        const href = job.slug ? `/experience/${job.slug}` : job.relatedHref;
        const body = (
          <div className="grid gap-x-8 gap-y-2 md:grid-cols-[1fr_auto]">
            <div>
              <h4 className="text-2xl font-bold text-slate-100">{job.role}</h4>
              <p className="text-lg font-semibold text-green-500">{job.company}</p>
              <p className="mt-2 max-w-prose text-slate-300">{job.summary}</p>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm font-bold text-green-600">
                {job.stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              {href && (
                <span className="mt-3 inline-flex items-center gap-1 font-medium text-slate-100 group-hover:text-green-500">
                  {job.slug ? "Read more" : "See the project"} <MdArrowOutward />
                </span>
              )}
            </div>
            <div className="text-sm text-slate-400 md:text-right">
              {job.partTime && <p className="font-semibold text-slate-300">Part-time</p>}
              <p>{job.dates}</p>
              <p>{job.location}</p>
            </div>
          </div>
        );

        return (
          <li key={job.role + job.company} className="border-t border-t-slate-700">
            {href ? (
              <Link
                href={href}
                className="group -mx-4 block rounded-lg px-4 py-8 transition-colors hover:bg-white/5"
              >
                {body}
              </Link>
            ) : (
              <div className="py-8">{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
