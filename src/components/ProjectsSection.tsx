import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import ProjectGrid from "@/components/ProjectGrid";
import type { Entry } from "@/lib/content";

export default function ProjectsSection({ projects }: { projects: Entry[] }) {
  return (
    <Bounded id="projects" className="scroll-mt-8">
      <Heading as="h2" size="md" className="mb-8">
        Projects
      </Heading>
      <ProjectGrid projects={projects} />
    </Bounded>
  );
}
