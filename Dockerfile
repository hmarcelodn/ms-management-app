FROM node:carbon

WORKDIR /app

ENV TYPEORM_CONNECTION postgres
ENV TYPEORM_HOST postgres
ENV TYPEORM_USERNAME postgres
ENV TYPEORM_PASSWORD postgres
ENV TYPEORM_DATABASE universo_app
ENV TYPEORM_PORT 5432
ENV TYPEORM_SYNCHRONIZE true
ENV TYPEORM_LOGGING true
ENV TYPEORM_ENTITIES src/entity/**/*.ts
ENV TYPEORM_MIGRATIONS_DIR src/migration/**/*.ts
ENV TYPEORM_SUBSCRIBERS_DIR src/subscriber/**/*.ts

COPY . .

RUN rm ormconfig.json
RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]