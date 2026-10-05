"use client";

import clsx from "clsx";
import React, { useState } from "react";
import Image from "next/image";
import { MdMenu, MdClose } from "react-icons/md";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import SiteLink from "./SiteLink";
import SocialLinks from "./SocialLinks";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="md:-mx-4">
      <div className="flex flex-col justify-between rounded-b-lg bg-slate-50 px-4 py-2 md:m-4 md:flex-row md:items-center md:rounded-xl">
        <div className="flex items-center justify-between">
          <NameLogo />
          <button
            type="button"
            aria-expanded={open}
            aria-label="Open menu"
            className="block p-2 text-2xl text-slate-800 md:hidden"
            onClick={() => setOpen(true)}
          >
            <MdMenu />
          </button>
        </div>
        <div
          className={clsx(
            "fixed bottom-0 left-0 right-0 top-0 z-50 flex flex-col items-end bg-slate-50 pr-4 pt-14 transition-transform duration-300 ease-in-out md:hidden",
            open ? "translate-x-0" : "translate-x-[100%]",
          )}
        >
          <button
            type="button"
            aria-label="Close menu"
            aria-expanded={open}
            className="fixed right-4 top-3 block p-2 text-2xl text-slate-800 md:hidden "
            onClick={() => setOpen(false)}
          >
            <MdClose />
          </button>
          <ul className="flex flex-col items-end gap-4">
            {site.nav.map(({ href, label, activePrefix }) => (
              <li key={label}>
                <SiteLink
                  className={clsx(
                    "group relative block overflow-hidden rounded px-3 text-3xl font-bold text-slate-900 ",
                  )}
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname.startsWith(activePrefix) ? "page" : undefined}
                >
                  <span
                    className={clsx(
                      "absolute inset-0 z-0 h-full rounded bg-green-600 transition-transform duration-300 ease-in-out group-hover:translate-y-0",
                      pathname.startsWith(activePrefix)
                        ? "translate-y-6"
                        : "translate-y-18",
                    )}
                  />
                  <span className="relative">{label}</span>
                </SiteLink>
              </li>
            ))}
            <li className="mt-4">
              <SocialLinks variant="nav" />
            </li>
          </ul>
        </div>
        <DesktopMenu pathname={pathname} />
      </div>
    </nav>
  );
}

function NameLogo() {
  return (
    <SiteLink
      href="/"
      aria-label="Home page"
      className="flex items-center gap-2 text-xl font-extrabold tracking-tighter text-slate-900"
    >
      <Image
        {...site.logo}
        alt=""
        sizes="32px"
        className="h-8 w-auto"
      />
      <span>{site.name}</span>
    </SiteLink>
  );
}

function DesktopMenu({ pathname }: { pathname: string }) {
  return (
    <ul className="relative z-50 hidden flex-row items-center gap-1 bg-transparent py-0 md:flex">
      {site.nav.map(({ href, label, activePrefix }, index) => (
        <React.Fragment key={label}>
          <li>
            <SiteLink
              className={clsx(
                "group relative block overflow-hidden rounded px-3 py-1 text-base font-bold text-slate-900",
              )}
              href={href}
              aria-current={pathname.startsWith(activePrefix) ? "page" : undefined}
            >
              <span
                className={clsx(
                  "absolute inset-0 z-0 h-full rounded bg-green-600 transition-transform  duration-300 ease-in-out group-hover:translate-y-0",
                  pathname.startsWith(activePrefix)
                    ? "translate-y-6"
                    : "translate-y-8",
                )}
              />
              <span className="relative">{label}</span>
            </SiteLink>
          </li>
          {index < site.nav.length - 1 && (
            <li
              className="text-4xl font-thin leading-[0] text-slate-400"
              aria-hidden="true"
            >
              /
            </li>
          )}
        </React.Fragment>
      ))}
      <li className="ml-4">
        <SocialLinks variant="nav" />
      </li>
    </ul>
  );
}
