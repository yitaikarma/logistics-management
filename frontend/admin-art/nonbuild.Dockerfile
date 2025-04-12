# 指定 nginx 镜像作为基础镜像（固定到特定 digest）
FROM nginx:alpine@sha256:4ff102c5d78d254a6f0da062b3cf39eaf07f01eec0927fd21e219d0af8bc0591

# 指定容器内的工作空间
WORKDIR /app

# 创建目录并清理默认配置
RUN mkdir /usr/share/nginx/html/dist && rm -rf /etc/nginx/nginx.conf

# 复制自定义 nginx 配置文件
COPY nginx.conf /etc/nginx/nginx.conf

# 复制前端构建产物
COPY dist /usr/share/nginx/html/dist

# 暴露端口
EXPOSE 80

# 启动 nginx，并以前台模式运行（-g "daemon off;" 表示在前台运行）
CMD ["nginx", "-g", "daemon off;"]
