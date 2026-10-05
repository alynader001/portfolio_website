/** True for pages on this site, which can use client-side navigation (not files like /resume.pdf, or mailto: links) */
export function isPageHref(href: string) {
  return href.startsWith("/") && !/\.\w+($|#|\?)/.test(href);
}
