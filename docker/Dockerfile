ARG DEBIAN_VERSION=13.2-slim
FROM debian:${DEBIAN_VERSION}

ARG DEBIAN_FRONTEND=noninteractive
ARG MICROSANDBOX_VERSION=latest
ARG TARGETARCH

RUN apt update && \
    apt install -y --no-install-recommends \
    ca-certificates \
    curl && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

# Download and install microsandbox binary
RUN VERSION ="${MICROSANDBOX_VERSION:-}" \
    curl -fsSL https://raw.githubusercontent.com/zerocore-ai/microsandbox/refs/heads/main/scripts/install_microsandbox.sh | sh

# Set up environment variables
ENV PATH="/root/.local/bin:/usr/local/bin:${PATH:-/bin:/usr/bin}"
ENV LD_LIBRARY_PATH="/root/.local/lib:/usr/local/lib:${LD_LIBRARY_PATH:-/usr/local/lib:/usr/lib}"
ENV HOME="/root"

WORKDIR /root

ARG MICROSANDBOX_AUTO_PULL_IMAGES=true
RUN if [ "${MICROSANDBOX_AUTO_PULL_IMAGES}" = "true" ]; then \
        msb pull microsandbox/python && \
        msb pull microsandbox/node; \
    fi

VOLUME [ "/root/.microsandbox/namespaces" ]

# Default to microsandbox CLI
ENTRYPOINT ["msb"]
CMD ["server", "start", "--host", "0.0.0.0", "--port", "5555"]
