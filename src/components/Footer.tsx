import clsx from "clsx";
import React from "react";
import Image from "next/image";
import Bounded from "@/components/Bounded";
import { site } from "@/content/site";
import SiteLink from "./SiteLink";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  const links = site.nav;

  return (
    <Bounded as="footer" className="text-slate-600">
      <div className="container mx-auto mb-10 flex flex-col items-center justify-between gap-6 sm:flex-row ">
        <div className="name flex flex-col items-center justify-center gap-x-4 gap-y-2 sm:flex-row sm:justify-self-start">
          <SiteLink
            href="/"
            className="flex items-center gap-2 text-xl font-extrabold tracking-tighter text-slate-100 transition-colors duration-150 hover:text-green-600"
          >
            <Image
              {...site.logo}
              alt=""
              sizes="48px"
              className="h-12 w-auto filter invert"
            />
            {site.name}
          </SiteLink>
          <span
            className="hidden text-5xl font-extralight leading-[0] text-slate-400 sm:inline"
            aria-hidden="true"
          >
            /
          </span>
          <p className=" text-sm text-slate-300 ">
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
        <nav className="navigation" aria-label="Footer Navigation">
          <ul className="flex flex-wrap items-center justify-center gap-1">
            {links.map(({ href, label }, index) => (
              <React.Fragment key={label}>
                <li>
                  <SiteLink
                    className={clsx(
                      "group relative block overflow-hidden  rounded px-3 py-1 text-base font-bold text-slate-100 transition-colors duration-150 hover:text-green-600",
                    )}
                    href={href}
                  >
                    {label}
                  </SiteLink>
                </li>
                {index < links.length - 1 && (
                  <li
                    className="text-4xl font-thin leading-[0] text-slate-400"
                    aria-hidden="true"
                  >
                    /
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>
        <SocialLinks variant="footer" className="socials justify-center sm:justify-end" />
      </div>
    </Bounded>
  );
}
