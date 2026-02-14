# Docker Setup for Microsandbox

This directory contains Docker and Docker Compose configurations for running Microsandbox in a containerized environment.

## Quick Start

```bash
docker compose -f docker/docker-compose.yaml up -d
```

## Configuration

You can customize the deployment using environment variables:

- `MICROSANDBOX_VERSION`: Version tag (default: `latest`)
- `MICROSANDBOX_PORT`: Port to expose (default: `5555`)
- `MICROSANDBOX_DEV_MODE`: Enable development mode without API key (default: `true`)
- `MICROSANDBOX_CPU_LIMIT`: CPU limit (default: `4`)
- `MICROSANDBOX_MEMORY_LIMIT`: Memory limit (default: `8G`)
- `TZ`: Timezone (default: `UTC`)

## Security Considerations

### Privileged Container Mode

**Important**: This Docker configuration runs the container in **privileged mode** with **unconfined AppArmor and seccomp profiles**. This significantly reduces container security by disabling key isolation mechanisms.

### Why These Security Exceptions Are Required

Microsandbox requires these elevated privileges for the following reasons:

1. **KVM Device Access** (`/dev/kvm`): Enables hardware-accelerated virtualization for running secure VMs inside the container
2. **TUN/TAP Network Devices** (`/dev/net/tun`): Allows creation of network tunnels for VM networking
3. **Privileged Mode**: Required for proper device access and VM functionality

### Security Implications

While the container runs with reduced security isolation, the **purpose of Microsandbox is to provide secure, isolated VM environments** for executing untrusted code. The security model is:

- **Container layer**: Reduced isolation (privileged mode)
- **VM layer**: Strong isolation through hardware virtualization (KVM)

The VM-based isolation provides the actual security boundary for untrusted code execution.

### Recommendations

- **Do not run this container in untrusted environments** without additional security measures
- **Restrict network access** to the Microsandbox API endpoint
- **Use API keys in production** by setting `MICROSANDBOX_DEV_MODE=false`
- **Monitor container resource usage** to prevent DoS attacks
- **Keep the Microsandbox version up to date** for security patches

## Volumes

- `microsandbox_config`: Stores namespace configurations in `/root/.microsandbox/namespaces`
- `microsandbox_workspace`: Workspace directory for file operations

## Building the Image

```bash
cd docker
docker-compose build
```

Or build manually:

```bash
docker build -t ghcr.io/zerocore-ai/microsandbox:latest -f docker/Dockerfile .
```
