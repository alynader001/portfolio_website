import clsx from "clsx";
import { FaEnvelope, FaFileLines, FaGithub, FaLinkedin } from "react-icons/fa6";
import { site } from "@/content/site";

const iconLinks = [
  { label: "Email", href: site.email.href, Icon: FaEnvelope },
  { label: "GitHub", href: site.github, Icon: FaGithub },
  { label: "LinkedIn", href: site.linkedin, Icon: FaLinkedin },
];

const variants = {
  // On the light nav bar
  nav: {
    pill: "border-slate-900 px-3 py-1 text-sm text-slate-900",
    icon: "text-xl text-slate-800",
  },
  // On the dark footer
  footer: {
    pill: "border-slate-400 px-4 py-1.5 text-base text-slate-100",
    icon: "text-2xl text-slate-300",
  },
};

/** Resume (labelled, since it's the link recruiters look for) plus email, GitHub, and LinkedIn icons */
export default function SocialLinks({
  variant,
  className,
}: {
  variant: keyof typeof variants;
  className?: string;
}) {
  const styles = variants[variant];

  return (
    <div className={clsx("flex items-center", className)}>
      <a
        href={site.resume.href}
        target="_blank"
        rel="noreferrer"
        title="Resume (PDF)"
        className={clsx(
          "mr-1 flex items-center gap-2 rounded-full border-2 font-bold transition-colors duration-150 hover:border-green-600 hover:text-green-600",
          styles.pill,
        )}
      >
        <FaFileLines aria-hidden="true" />
        Resume
      </a>
      {iconLinks.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          title={label}
          aria-label={label}
          className={clsx(
            "p-2 transition-all duration-150 hover:scale-125 hover:text-green-600",
            styles.icon,
          )}
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
