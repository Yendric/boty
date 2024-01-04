FROM node:20-alpine as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY prisma ./

COPY . . 

FROM base as production

ENV NODE_ENV=production

RUN pnpm build

CMD ["pnpm", "start"]

FROM base as development

ENV NODE_ENV=development

CMD [ "pnpm", "dev" ]