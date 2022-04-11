FROM node:14
ENV NODE_ENV deployment
WORKDIR /home/sunyar-server-master
COPY .   .
RUN npm install 
COPY . .
EXPOSE 8080
CMD ["npm","run","bash" ]
