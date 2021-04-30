FROM node:lts-alpine as builder

WORKDIR /app

COPY ./package.json ./

# Install dependence
RUN yarn config  set registry https://registry.npm.taobao.org
RUN yarn 

COPY . .

RUN yarn run docs:build

FROM nginx:stable-alpine

EXPOSE 80

COPY --from=builder /app/docs-dist /usr/share/nginx/html