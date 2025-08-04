FROM gcr.io/distroless/nodejs22-debian12@sha256:8d54996fc549a9f6d8af41e0540ecf7ee75f31189e788a738cfcbf2f58903404


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
