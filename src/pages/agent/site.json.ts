import { readerIndex } from "../../lib/agentReader";
export const prerender = true;
export const GET = () => new Response(JSON.stringify(readerIndex,null,2)+"\n", { headers: { "Content-Type": "application/json; charset=utf-8" } });
