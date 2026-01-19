# syntax=docker/dockerfile:1
FROM node:20-alpine

RUN npm config set strict-ssl false

WORKDIR /simple-pbx

# 1. Copy ONLY manifests first (cache-friendly)
COPY package.json package-lock.json ./
COPY /packages/web/package.json packages/web/

# 2. Install all deps in the monorepo (creates workspace symlinks)
RUN npm ci

# 3. Copy prisma schema BEFORE generation
COPY prisma/ ./prisma

# 4. Generate Prisma Client at root
RUN npx prisma generate

# 5. Copy the full source tree
COPY . .

# 6. Build the web workspace (React Router build)
RUN npm run build --workspace packages/web

# 7. Prune dev deps for smaller runtime image (optional)
RUN npm prune --omit=dev

# 8. Start the web workspace server
CMD ["npm", "run", "prod", "--workspace", "packages/web"]
