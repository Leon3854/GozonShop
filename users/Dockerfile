FROM node:20-alpine

WORKDIR /app

# Установка зависимостей
COPY package*.json ./
RUN npm install

# Копирование исходников
COPY . .

# Для разработки (по умолчанию)
CMD ["npm", "run", "start:dev"]

# Для продакшна (используйте --target):
# docker build --target production -t my-app .