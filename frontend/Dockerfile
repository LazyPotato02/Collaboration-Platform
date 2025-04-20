FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
RUN npm install -g @angular/cli
COPY . .

CMD ["npm", "run", "start-docker"]
