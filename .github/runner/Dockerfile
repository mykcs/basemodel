FROM node:24-bookworm-slim@sha256:ba849c60be29959425b8734d57b8b4b7d56f98edd9504c9af091d5281095a71e

ARG RUNNER_VERSION=2.337.0
ARG RUNNER_CONFIG_SHA256=unknown
ARG TARGETARCH

LABEL com.mykcs.basemodel.runner-config-sha256="$RUNNER_CONFIG_SHA256" \
      com.mykcs.basemodel.runner-version="$RUNNER_VERSION"

ENV PLAYWRIGHT_BROWSERS_PATH=/home/runner/.cache/ms-playwright \
    ACTIONS_RUNNER_HOOK_JOB_STARTED=/usr/local/bin/runner-job-completed \
    ACTIONS_RUNNER_HOOK_JOB_COMPLETED=/usr/local/bin/runner-job-completed \
    RUNNER_MANUALLY_TRAP_SIG=1 \
    ACTIONS_RUNNER_PRINT_LOG_TO_STDOUT=1

USER root
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git jq procps xz-utils zstd \
    && npm install --global @playwright/test@1.62.1 \
    && npx playwright install-deps chromium \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN useradd --create-home --uid 1001 --shell /bin/bash runner \
    && mkdir -p /home/runner/actions-runner /home/runner/.cache/ms-playwright \
    && chown -R runner:runner /home/runner

WORKDIR /home/runner/actions-runner
RUN case "$TARGETARCH" in \
      arm64) runner_arch=arm64; runner_sha256=9b1dc70626422526e3c94767cf024896beb15da5342a3f4819bf2feac13e0393 ;; \
      amd64) runner_arch=x64; runner_sha256=70920811a4f8ad4328818682bca5c6469c1c942fab52448868071d0063816613 ;; \
      *) echo "unsupported Docker architecture: $TARGETARCH" >&2; exit 1 ;; \
    esac \
    && curl -fsSL -o /tmp/actions-runner.tar.gz \
      "https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-${runner_arch}-${RUNNER_VERSION}.tar.gz" \
    && echo "${runner_sha256}  /tmp/actions-runner.tar.gz" | sha256sum -c - \
    && tar -xzf /tmp/actions-runner.tar.gz \
    && rm /tmp/actions-runner.tar.gz \
    && ./bin/installdependencies.sh \
    && chown -R runner:runner /home/runner/actions-runner

COPY --chown=runner:runner entrypoint.sh /usr/local/bin/runner-entrypoint
COPY --chown=runner:runner job-completed.sh /usr/local/bin/runner-job-completed
RUN chmod 0755 /usr/local/bin/runner-entrypoint /usr/local/bin/runner-job-completed

USER runner
ENV HOME=/home/runner
HEALTHCHECK --interval=30s --timeout=5s --start-period=120s --retries=3 \
  CMD pgrep -f '[R]unner.Listener run' >/dev/null || exit 1
ENTRYPOINT ["/usr/local/bin/runner-entrypoint"]
