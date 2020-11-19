FROM land007/node:latest

MAINTAINER Jia Yiqiu <yiqiujia@hotmail.com>

RUN . $HOME/.nvm/nvm.sh && cd / && npm install body-parser express http-proxy basic-auth

ADD nwjs-sdk-v0.43.5-win-x64/public /node_/public
ADD api-server/routes /node_/routes
ADD api-server/server.js /node_/
ADD api-server/proxy.js /node_/

ENV username=land007
ENV password=fcea920f7412b5da7be0cf42b8c93759

RUN sed -i 's/\r$//' /*.sh ; chmod +x /*.sh && \
	echo $(date "+%Y-%m-%d_%H:%M:%S") >> /.image_times && \
	echo $(date "+%Y-%m-%d_%H:%M:%S") > /.image_time && \
	echo "land007/ytlm" >> /.image_names && \
	echo "land007/ytlm" > /.image_name

RUN echo 'nohup node /node/proxy.js > /tmp/proxy.out 2>&1 &' >> /task.sh && \
	echo 'node /node/src-gen/backend/main.js /home/project --hostname=0.0.0.0 --startup-timeout=-1 --inspect=0.0.0.0:9229' >> /start.sh

#docker build -t "land007/ytlm:latest" .
#> docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t land007/ytlm --push .mingan
#docker rm -f ytlm
#docker run -it -p 3000:3001 -p 20022:20022 -e "username=gjxt" --restart=always --name ytlm land007/ytlm:latest
#http://127.0.0.1:3000/index.html.html?name=abc
