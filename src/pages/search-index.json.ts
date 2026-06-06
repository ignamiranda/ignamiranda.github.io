import { generateSearchIndex } from "../lib/backlinks";

export async function GET() {
  const index = generateSearchIndex();
  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json" },
  });
}
