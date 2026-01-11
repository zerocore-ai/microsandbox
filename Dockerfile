ARG DEBIAN_VERSION=13.2-slim
FROM debian:${DEBIAN_VERSION}

ARG DEBIAN_FRONTEND=noninteractive
ARG MICROSANDBOX_VERSION=0.2.6
ARG TARGETARCH

RUN apt update && \
    apt install -y --no-install-recommends \
    ca-certificates \
    curl && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

# Download and install microsandbox binary based on architecture
RUN ARCH=${TARGETARCH:-amd64} && \
    case "${ARCH}" in \
        amd64) MICROSANDBOX_ARCH="x86_64" ;; \
        arm64) MICROSANDBOX_ARCH="aarch64" ;; \
        *) echo "Unsupported architecture: ${ARCH}" && exit 1 ;; \
    esac && \
    curl -fsSL "https://github.com/zerocore-ai/microsandbox/releases/download/microsandbox-v${MICROSANDBOX_VERSION}/microsandbox-${MICROSANDBOX_VERSION}-linux-${MICROSANDBOX_ARCH}.tar.gz" \
    -o /tmp/microsandbox.tar.gz && \
    mkdir -p /usr/local/bin /usr/local/lib && \
    tar -xzf /tmp/microsandbox.tar.gz -C /tmp && \
    cd /tmp/microsandbox-${MICROSANDBOX_VERSION}-linux-${MICROSANDBOX_ARCH} && \
    mv ms* /usr/local/bin/ && \
    mv *.so.* /usr/local/lib/ && \
    chmod +x /usr/local/bin/ms* && \
    rm -rf /tmp/microsandbox*

# Setup directories for root user
RUN mkdir -p /root/.local/bin /root/.local/lib /root/.microsandbox

# Set up environment variables (based on setup_env.sh)
ENV PATH="/root/.local/bin:/usr/local/bin:${PATH}"
ENV LD_LIBRARY_PATH="/root/.local/lib:/usr/local/lib:${LD_LIBRARY_PATH}"
ENV HOME="/root"

WORKDIR /root

ARG MICROSANDBOX_AUTO_PULL_IMAGES=true
RUN if [ "${MICROSANDBOX_AUTO_PULL_IMAGES}" = "true" ]; then \
        msb pull microsandbox/python && \
        msb pull microsandbox/node; \
    fi

VOLUME [ "/root/.microsandbox/namespaces" ]

# Default to microsandbox CLI
ENTRYPOINT ["/usr/local/bin/msb"]
CMD ["server", "start", "--host", "0.0.0.0", "--port", "5555"]
