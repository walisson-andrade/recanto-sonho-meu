FROM node:24-alpine
WORKDIR /app
ENV HOST=0.0.0.0
EXPOSE 4322
CMD ["npm", "run", "dev"]
