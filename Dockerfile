FROM gcr.io/distroless/nodejs22-debian12@sha256:4c6848a24760c190338d20c3fd2e987431f8fe05c4067a114801cb66ca0018a1


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
