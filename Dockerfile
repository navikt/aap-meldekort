FROM gcr.io/distroless/nodejs22-debian12@sha256:881157f8399d3ab71c54068f148c25296f7f9bee6d36279febad5a6f46f41c2b


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
