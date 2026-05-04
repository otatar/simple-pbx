FROM mcr.microsoft.com/devcontainers/typescript-node:20

# Install additional OS packages
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends mariadb-client \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install global node packages
RUN npm install -g prisma tsx
