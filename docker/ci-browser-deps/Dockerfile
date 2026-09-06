FROM node:24-bookworm-slim@sha256:ba849c60be29959425b8734d57b8b4b7d56f98edd9504c9af091d5281095a71e

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends git openssh-client ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN npx -y playwright@1.62.1 install-deps chromium \
    && rm -rf /root/.npm/_npx /root/.npm/_logs /var/lib/apt/lists/*

LABEL org.opencontainers.image.source="https://github.com/mykcs/basemodel" \
      org.opencontainers.image.description="BaseModel Debian 12 browser CI dependencies for Playwright 1.62.1"
