# Usa Yarn para build local
FROM node:20-alpine

WORKDIR /app

# Copia APENAS os arquivos já compilados
COPY package*.json ./
COPY yarn.lock ./
COPY build/ ./

# Instala dependências de produção com Yarn
RUN yarn install --frozen-lockfile

EXPOSE 3333

CMD ["node", "bin/server.js"]