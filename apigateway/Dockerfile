FROM mhart/alpine-node:8.9

RUN mkdir -p /app

WORKDIR /app

COPY package.json .

# RUN npm install
RUN yarn

COPY . .

CMD ["npm", "start"]
