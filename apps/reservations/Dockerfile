FROM node:20.16.0-alpine as development

WORKDIR /usr/src/app

COPY package.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json 

COPY apps/reservations apps/reservations
COPY libs libs

RUN npm install -g pnpm
RUN pnpm install 

RUN pnpm run build reservations

FROM node:20.16.0-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install -g pnpm
RUN pnpm install --prod

COPY --from=development /usr/src/app/dist/ ./dist

CMD ["node", "dist/apps/reservations/main"]