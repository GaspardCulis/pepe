FROM docker.io/oven/bun:alpine
LABEL maintainer="gasdev.lp@gmail.com" \
      version="1.0" \
      description="Docker image for deploying self-hosted TinaCMS backend" \
      name="GaspardCulis/pepe"


RUN apk update

# Install dependencies
RUN apk --no-cache add git vips

# Clone the project
ARG APP_REPO_URL=https://github.com/GaspardCulis/pepe
RUN git clone --depth=1 "${APP_REPO_URL}" .

# Install project dependencies
RUN bun install
RUN bun install sharp

# Copy env variables
COPY .env .

CMD ["sh", "-c", "bunx tinacms build && bun run tina/backend/index.ts"]
