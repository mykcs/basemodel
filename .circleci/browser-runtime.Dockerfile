FROM node:24-bookworm-slim@sha256:ba849c60be29959425b8734d57b8b4b7d56f98edd9504c9af091d5281095a71e

ARG SOURCE_SHA
LABEL org.opencontainers.image.source="https://github.com/mykcs/basemodel" \
      org.opencontainers.image.revision="$SOURCE_SHA" \
      com.mykcs.basemodel.playwright="1.62.1" \
      com.mykcs.basemodel.runtime="circleci-browser"

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

RUN apt-get update \
    && apt-get install -y --no-install-recommends git openssh-client ca-certificates \
    && npx -y playwright@1.62.1 install --with-deps chromium \
    && rm -rf /root/.npm /var/lib/apt/lists/*

RUN node -e "if (process.versions.node.split('.')[0] !== '24') process.exit(1)" \
    && git --version \
    && test -d /ms-playwright/chromium-1234 \
    && test -d /ms-playwright/chromium_headless_shell-1234 \
    && find /ms-playwright/chromium-1234 -type f -perm -111 | grep -q . \
    && find /ms-playwright/chromium_headless_shell-1234 -type f -perm -111 | grep -q .
