FROM node:20-alpine
RUN apk add --no-cache openssl
RUN npm config set strict-ssl false

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/simple-pbx-agi/package.json ./packages/simple-pbx-agi/

# 2. Install all dependencies from the root
RUN npm install

# 3. Copy the prisma folder and generate
COPY prisma/ ./prisma/
RUN npx prisma generate

# 4. Copy the AGI source code
COPY packages/simple-pbx-agi/ ./packages/simple-pbx-agi/

# 5. Set the working directory to the app to run it
WORKDIR /app/packages/simple-pbx-agi

CMD ["npx", "tsx", "agi-server.ts"]