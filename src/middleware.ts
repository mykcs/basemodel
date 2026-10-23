import { defineMiddleware } from 'astro:middleware';
import { readerContractForRoute } from './data/siteReaderContracts';

// Starlight owns the document element. Adapt its static output to the same
// reader landmark/metadata contract as AppLayout, including no-JS consumers.
export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  if (!context.url.pathname.startsWith('/handbook/') || response.status !== 200) return response;
  const contract = readerContractForRoute(context.url.pathname);
  if (!contract) throw new Error(`Missing handbook reader contract: ${context.url.pathname}`);
  const html = await response.text();
  if ((html.match(/<body\b/g) ?? []).length !== 1 || (html.match(/<main\b/g) ?? []).length !== 1) {
    throw new Error('Handbook must retain one document body and primary main landmark');
  }
  const output = html.replace(/<body\b/, `<body data-reader-contract-id="${contract.id}" data-reader-attention-mode="${contract.attentionMode}"`)
    .replace(/<main\b/, '<main id="main-content"');
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(output, { status: response.status, statusText: response.statusText, headers });
});
