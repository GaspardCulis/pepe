FROM docker.io/oven/bun:alpine as base
LABEL maintainer="gasdev.lp@gmail.com" \
      version="1.0" \
      description="Docker image for deploying Astro static website coupled with TinaCMS backend" \
      name="GaspardCulis/pepe"


RUN apk update

FROM base as data

# Install dependencies
RUN apk --no-cache add git vips

# Clone the project
ARG APP_REPO_URL=https://github.com/GaspardCulis/pepe
RUN git clone "${APP_REPO_URL}" .

# Install project dependencies
RUN bun install
RUN bun add sharp

# Copy env variables
COPY .env .

VOLUME /home/bun/app
HEALTHCHECK CMD pidof -x "sleep"
CMD ["sh", "-c", "bunx tinacms build && bunx astro build && sleep infinity"]

FROM base as frontend

# Disable astro telemetry
RUN bunx astro telemetry disable

CMD ["bunx", "astro", "preview"]

FROM base as backend

CMD ["bun", "run", "tina/backend/index.ts"]
