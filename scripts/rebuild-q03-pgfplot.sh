#!/usr/bin/env bash
# Offline reproduction only; DO NOT install TeX or Inkscape into the Vercel build.
set -euo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source="${root}/figures/latex/q03-stage2-pgfplots.tex"
asset="${root}/public/research/seed-openevo/figures/q03-stage2-pgfplots.svg"
command -v xelatex >/dev/null || { echo 'xelatex missing' >&2; exit 2; }
command -v inkscape >/dev/null || { echo 'inkscape missing' >&2; exit 2; }
tmp="$(mktemp -d)"
trap 'rm -rf "${tmp}"' EXIT
xelatex -halt-on-error -interaction=nonstopmode -jobname=q03-stage2 \
  -output-directory="${tmp}" "${source}" >"${tmp}/build.log"
inkscape "${tmp}/q03-stage2.pdf" --export-type=svg --export-text-to-path \
  -o "${asset}"
printf 'Review the generated SVG visually against the TeX PDF, then compare:\n'
sha256sum "${source}" "${asset}"
node "${root}/scripts/verify-q03-pgfplot.mjs"
