import { type Metadata } from "next";

import Hero from "@/components/Hero";
import ExperienceList from "@/components/ExperienceList";
import ProjectsSection from "@/components/ProjectsSection";
import Skills from "@/components/Skills";
import { hero, skills } from "@/content/site";
import { jobs } from "@/content/experience";
import { getEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Aly Ahmed | Mechatronics Engineer",
  description: hero.intro,
};

export default async function Page() {
  const projects = await getEntries("projects");

  return (
    <>
      <Hero {...hero} />
      <ExperienceList jobs={jobs} />
      <ProjectsSection projects={projects} />
      <Skills skills={skills} />
    </>
  );
}
