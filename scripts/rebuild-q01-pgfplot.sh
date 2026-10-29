#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
command -v xelatex >/dev/null || { echo 'xelatex required for authoring' >&2; exit 2; }
command -v inkscape >/dev/null || { echo 'inkscape required for authoring' >&2; exit 2; }
tmp="$(mktemp -d)"
trap 'rm -rf "${tmp}"' EXIT
for name in q01-three-way-pgfplots q01-three-way-mobile-pgfplots; do
  source="${root}/figures/latex/${name}.tex"
  asset="${root}/public/research/seed-openevo/figures/${name}.svg"
  xelatex -halt-on-error -interaction=nonstopmode -jobname="${name}" \
    -output-directory="${tmp}" "${source}" > "${tmp}/${name}.log"
  inkscape "${tmp}/${name}.pdf" --export-type=svg --export-text-to-path -o "${asset}"
  echo "Review the ${name} PNG/PDF layout and verify all 33 frozen CSV rows before hash changes:"
  sha256sum "${source}" "${asset}"
done
node "${root}/scripts/verify-q01-pgfplot.mjs"
