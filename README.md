# Welcome To My Portfolio Website!
Check it out: https://www.alynader.com

## Editing content

All content lives in this repo:

- **Homepage intro, nav, email and social links, skills:** `src/content/site.ts`
- **Work experience (homepage list):** `src/content/experience.ts`, newest first. Give a job a `slug` and add `src/content/experience/<slug>.mdx` to give it a full write-up page at `/experience/<slug>`.
- **Projects / blog posts:** one `.mdx` file each in `src/content/projects/` and `src/content/blog/`. The file name is the URL slug. The `metadata` object at the top sets the title, date, tags and (for projects) `order` in the list. Projects also need a one-line `summary` and a cover `image` for their card on the homepage. Write the body in Markdown; `<Image>`, `<TextBlock>` and `<VideoEmbed>` are available without importing.
- **Images:** `public/images/<projects|blog>/<slug>/`, referenced as `/images/...`.
- **Resume:** edit `resume/resume.tex` and compile it in place (LaTeX Workshop's default output) so `resume/resume.pdf` is updated, then commit both. The site serves it at `/resume.pdf`. When you change a role, dates or skills, update `src/content/experience.ts` / `site.ts` to match.
