#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source="${root}/figures/latex/q01-three-way-pgfplots.tex"
asset="${root}/public/research/seed-openevo/figures/q01-three-way-pgfplots.svg"
command -v xelatex >/dev/null || { echo 'xelatex required for authoring' >&2; exit 2; }
command -v inkscape >/dev/null || { echo 'inkscape required for authoring' >&2; exit 2; }
tmp="$(mktemp -d)"
trap 'rm -rf "${tmp}"' EXIT
xelatex -halt-on-error -interaction=nonstopmode -jobname=q01-three-way-pgfplots \
  -output-directory="${tmp}" "${source}" > "${tmp}/build.log"
inkscape "${tmp}/q01-three-way-pgfplots.pdf" --export-type=svg --export-text-to-path \
  -o "${asset}"
echo "Review compiled PDF and vector image against the same 33 frozen CSV rows:"
sha256sum "${source}" "${asset}"
node "${root}/scripts/verify-q01-pgfplot.mjs"
