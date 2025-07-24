FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate
EXPOSE 5000
CMD ["node", "server.js"]
