FROM node:20-alpine
WORKDIR /app

# Установка зависимостей
COPY package*.json .
COPY tsconfig.json .
COPY jest.config.cjs .
COPY src/config/knex/knexfile.ts ./knexfile.ts
COPY src/database ./src/database


RUN npm set strict-ssl false
RUN npm config set registry https://registry.npmjs.org/

RUN npm install

# Копирование исходного кода
COPY . .

RUN mkdir -p /database && \
    ln -s /app/src/database/migrations /database/migrations && \
    ln -s /app/src/database/seeds /database/seeds
CMD ["node", "dist/src/app.js"]