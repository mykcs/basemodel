import './ExternalBrandMark.css';
import { externalBrandAssetProvenance, externalLinkBrand } from '../../lib/externalLinkBrand';

type Props = {
  href?: string | null;
  className?: string;
};

export default function ExternalBrandMark({ href, className = '' }: Props) {
  const brand = externalLinkBrand(href);
  if (!brand) return null;

  const meta = externalBrandAssetProvenance[brand];
  const classes = ['external-brand-mark', `external-brand-mark--${brand}`, className].filter(Boolean).join(' ');

  return (
    <span className={classes} data-external-brand={brand} aria-hidden="true">
      <img src={meta.asset} alt="" width="16" height="16" />
    </span>
  );
}
