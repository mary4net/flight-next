FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g dotenv-cli
RUN npm install lucide-react
RUN npm install pdf-lib
RUN npm install ts-node
RUN npm install pdfkit
RUN npm install -D tailwindcss @tailwindcss/postcss
RUN npm install tailwind-merge tw-animate-css class-variance-authority clsx
RUN npm install -D @types/react @types/react-dom @types/node


COPY . .

# Set Prisma generate for prod use
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/.next ./.next 
COPY --from=builder /app/public ./public 
COPY --from=builder /app/package.json ./
RUN npm install --only=production

EXPOSE 3000
ENV NODE_ENV=production

CMD ["npm", "run", "start"]