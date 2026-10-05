import fs from "node:fs/promises";
import path from "node:path";

// Serves the compiled resume/resume.pdf at /resume.pdf, baked in at build time
export const dynamic = "force-static";

export async function GET() {
  const pdf = await fs.readFile(path.join(process.cwd(), "resume/resume.pdf"));

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Aly-Ahmed-Resume.pdf"',
    },
  });
}
