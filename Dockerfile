FROM node:16-alpine as build-deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN echo "Iniciando install..." && npm install && echo "Install concluído."

COPY src/ ./src/
COPY public/ ./public/

RUN echo "Iniciando build..." && npm run build && echo "Build concluído."

FROM nginx:alpine

ENV PUBLIC_HTML=/usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY .docker/nginx.conf /etc/nginx/conf.d/

COPY .docker/start.sh /

COPY --from=build-deps /usr/src/app/build ${PUBLIC_HTML}

EXPOSE 80

ENTRYPOINT [ "/bin/sh", "/start.sh" ]
