# --- STAGE 1: Build ---
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
RUN npm config set strict-ssl false

WORKDIR /simple-pbx

# 1. Install dependencies
COPY package.json package-lock.json ./
COPY packages/web/package.json packages/web/
RUN npm ci

# 2. Generate Prisma
COPY prisma/ ./prisma/
RUN npx prisma generate

# 3. Build the App
COPY . .
RUN npm run build --workspace packages/web

# 4. Prune for production (removes devDeps like Vite/TypeScript)
RUN npm prune --omit=dev

# --- STAGE 2: Runner ---
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /simple-pbx

ENV NODE_ENV=production

# 1. Copy root AND web manifests (REQUIRED for workspace resolution)
COPY package.json package-lock.json ./
COPY packages/web/package.json ./packages/web/

# 2. Install production dependencies for the SPECIFIC workspace
# The --workspace flag ensures npm looks inside packages/web/package.json
RUN npm config set strict-ssl false && \
    npm ci --omit=dev --workspace=web --include-workspace-root

# 3. Copy the built artifacts from the builder stage
COPY --from=builder /simple-pbx/packages/web/build ./packages/web/build
COPY --from=builder /simple-pbx/prisma ./prisma

# 4. Critical: Symlink the node_modules so the web package sees the root
RUN mkdir -p /simple-pbx/packages/web && \
    ln -s /simple-pbx/node_modules /simple-pbx/packages/web/node_modules

WORKDIR /simple-pbx/packages/web

# 5. Set paths so binaries like react-router-serve are found
ENV PATH="/simple-pbx/node_modules/.bin:${PATH}"

CMD ["npm", "run", "prod"]