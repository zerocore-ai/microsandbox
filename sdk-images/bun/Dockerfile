# First stage: Build the portal binary with Bun feature enabled
FROM rust:slim AS builder

# Install dependencies and build the portal binary
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    pkg-config \
    libssl-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /usr/src/microsandbox

WORKDIR /usr/src/microsandbox
COPY . .
RUN cargo build --release --bin portal --features bun

# Second stage: Create the Bun image
FROM oven/bun:latest

# Set environment variables
ENV NODE_ENV=development

# Install system dependencies, set up directories, and install global npm packages in one layer
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates \
    build-essential \
    python3 \
    && apt-get clean && rm -rf /var/lib/apt/lists/* \
    # Create a non-root user named "bun"
    && useradd --create-home --shell /bin/bash bun \
    # Set up working directory for the bun user
    && mkdir -p /home/bun/work \
    && chown -R bun:bun /home/bun \
    && mkdir -p /etc/microsandbox/portal \
    && chown -R bun:bun /etc/microsandbox \
    # Install global npm packages
    && bun install -g \
       typescript \
       ts-node \
       nodemon \
       eslint \
       prettier

# Copy the portal binary from the builder stage and set permissions
COPY --from=builder /usr/src/microsandbox/target/release/portal /usr/local/bin/
RUN chmod +x /usr/local/bin/portal

# Switch to the non-root bun user
USER bun
WORKDIR /home/bun/work

# Set a command that starts portal and keeps the container running
CMD ["bash", "-c", "echo 'Bun environment with microsandbox-portal ready' && RUST_LOG=debug portal & tail -f /dev/null"]
