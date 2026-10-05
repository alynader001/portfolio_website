"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isPageHref } from "@/lib/links";

type SiteLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** next/link for pages on this site; a plain link in a new tab for files like /resume.pdf */
export default function SiteLink({ href, onClick, ...props }: SiteLinkProps) {
  const pathname = usePathname();

  if (!isPageHref(href)) {
    return <a href={href} target="_blank" rel="noreferrer" onClick={onClick} {...props} />;
  }

  // Links to the page you're already on: Next.js doesn't scroll for a repeat click on the same
  // hash ("/#experience") or for "/" while scrolled down, so scroll ourselves every time.
  // With a hash, scroll to that section; without one, scroll to the top.
  const [path, hash] = href.split("#");
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (path !== pathname || event.defaultPrevented) return;
    const target = hash ? document.getElementById(hash) : null;
    if (hash && !target) return;
    event.preventDefault();
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    if (target) target.scrollIntoView({ behavior });
    else window.scrollTo({ top: 0, behavior });
    window.history.replaceState(window.history.state, "", href);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
