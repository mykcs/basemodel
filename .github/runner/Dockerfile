FROM node:24-bookworm-slim

ARG RUNNER_VERSION=2.337.0
ARG TARGETARCH

ENV PLAYWRIGHT_BROWSERS_PATH=/home/runner/.cache/ms-playwright

USER root
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git jq xz-utils zstd \
    && npm install --global @playwright/test@1.62.1 \
    && npx playwright install-deps chromium \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN useradd --create-home --uid 1001 --shell /bin/bash runner \
    && mkdir -p /home/runner/actions-runner /home/runner/.cache/ms-playwright \
    && chown -R runner:runner /home/runner

WORKDIR /home/runner/actions-runner
RUN case "$TARGETARCH" in \
      arm64) runner_arch=arm64 ;; \
      amd64) runner_arch=x64 ;; \
      *) echo "unsupported Docker architecture: $TARGETARCH" >&2; exit 1 ;; \
    esac \
    && curl -fsSL "https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-${runner_arch}-${RUNNER_VERSION}.tar.gz" \
      | tar -xz \
    && ./bin/installdependencies.sh \
    && chown -R runner:runner /home/runner/actions-runner

USER runner
ENV HOME=/home/runner
CMD ["sleep", "infinity"]
