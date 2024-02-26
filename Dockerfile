FROM docker.io/oven/bun:alpine as site

# Install dependencies
RUN apk update
RUN apk --no-cache add git vips

# Clone the project
ARG APP_REPO_URL=https://github.com/GaspardCulis/pepe
RUN git clone "${APP_REPO_URL}" .

# Install project dependencies
RUN bun install

# Copy env variables
COPY .env .

# Run the project
EXPOSE 4321
CMD ["sh", "-c", "bunx tinacms build && bunx astro build && bunx astro preview --host"]
