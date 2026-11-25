import { readerSkill } from "../../lib/agentReader";
export const prerender = true;
export const GET = () => new Response(readerSkill, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
