# Bun SDK Image

This directory contains the Dockerfile for the Bun SDK image used with microsandbox.

## Features

- Bun (Latest version)
- Bun package manager
- TypeScript and ts-node
- Development tools (nodemon, eslint, prettier)
- microsandbox-portal service with JavaScript REPL support
- Built-in non-root 'bun' user for improved security

## Building the Image

To build the image, run the following command from the project root:

```bash
docker build -t bun -f sdk-images/bun/Dockerfile .
```

The Dockerfile uses a multi-stage build that automatically compiles the portal binary with Bun features enabled, so no separate build step is required.

Alternatively, you can use the provided build script:

```bash
./scripts/build_sdk_images.sh -s bun
```

## Running the Container

To run the container with the portal service accessible on port 4444:

```bash
docker run -it -p 4444:4444 -e RUST_LOG=info --name bun bun
```

### Options

- `-p 4444:4444`: Maps container port 4444 to host port 4444
- `-e RUST_LOG=info`: Sets logging level for better debugging
- `--name bun`: Names the container for easier reference

## Accessing the Container

To access a shell inside the running container:

```bash
docker exec -it bun bash
```

## Stopping and Cleaning Up

```bash
# Stop the container
docker stop bun

# Remove the container
docker rm bun

# Remove the image (optional)
docker rmi bun
```

## Customization

### Adding Additional NPM Packages

You can customize the Dockerfile to include additional NPM packages:

```dockerfile
# Add this to the Dockerfile
RUN bun install -g \
    jest \
    webpack \
    webpack-cli
```

### Mounting Local Files

To access your local files inside the container:

```bash
docker run -it -p 4444:4444 -v $(pwd)/your_code:/home/bun/work --name bun bun
```

## Troubleshooting

If you encounter connection issues to the portal:

1. Check the logs: `docker logs bun`
2. Verify the portal is running: `docker exec -it bun ps aux | grep portal`
3. Ensure port 4444 is available on your host machine
