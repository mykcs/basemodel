export type ExternalLinkBrand = 'github' | 'huggingface' | 'arxiv';

const isHostOrSubdomain = (hostname: string, root: string) => hostname === root || hostname.endsWith(`.${root}`);

export function externalLinkBrand(href: string | undefined | null): ExternalLinkBrand | null {
  if (!href) return null;
  try {
    const url = new URL(href);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    const hostname = url.hostname.toLowerCase();
    if (isHostOrSubdomain(hostname, 'github.com')) return 'github';
    if (isHostOrSubdomain(hostname, 'huggingface.co')) return 'huggingface';
    if (isHostOrSubdomain(hostname, 'arxiv.org')) return 'arxiv';
    return null;
  } catch {
    return null;
  }
}

export const externalBrandAssetProvenance = {
  github: {
    label: 'GitHub',
    asset: '/brands/github-mark.svg',
    upstream: 'https://github.com/primer/octicons/blob/0e21a4c2d8449102f10e533d241f04797af0914c/icons/mark-github-16.svg',
    sha256: '7421820090b50ac79d7c2bf7c951a433d7098a8a9c474809207bdd45f62d9d46',
  },
  huggingface: {
    label: 'Hugging Face',
    asset: '/brands/hugging-face-mark.svg',
    upstream: 'https://huggingface.co/datasets/huggingface/brand-assets/blob/f0f32c486dede7d548c2f02cb7efb62f655de595/hf-logo.svg',
    sha256: '942cad1ccda905ac5a659dfd2d78b344fccfb84a8a3ac3721e08f488205638a0',
  },
  arxiv: {
    label: 'arXiv',
    asset: '/brands/arxiv-mark.png',
    upstream: 'https://arxiv.org/static/browse/0.3.4/images/icons/favicon-32x32.png',
    sha256: '5add8f07a3a7268c6690dfbfa3bd8cf84f527074b92eb3936d4bb8e010f9e60d',
  },
} as const;
