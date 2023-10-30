FROM node:lts-bullseye

WORKDIR /usr/src/app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
COPY tsconfig.json ./

RUN npm ci --omit dev

COPY . . 

RUN npm run build

CMD ["npm", "start"]