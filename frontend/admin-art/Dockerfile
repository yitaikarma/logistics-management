# 指定容器的基础镜像（固定到特定 digest）
FROM node:23-slim@sha256:dfb18d8011c0b3a112214a32e772d9c6752131ffee512e974e59367e46fcee52 AS base

# 指定容器内的工作空间
WORKDIR /app

# 将项目复制到容器内
COPY ./frontend/admin-art .

# 安装依赖&构建前端项目
RUN npm install -g pnpm && pnpm install && pnpm build

# 指定 nginx 镜像作为基础镜像（固定到特定 digest）
FROM nginx:alpine-slim@sha256:b05aceb5ec1844435cae920267ff9949887df5b88f70e11d8b2871651a596612

# 创建目录并清理默认配置
RUN mkdir /usr/share/nginx/html/dist && rm -rf /etc/nginx/nginx.conf

# 复制自定义 nginx 配置文件
COPY --from=base /app/nginx.conf /etc/nginx/nginx.conf

# 复制前端构建产物
COPY --from=base /app/dist /usr/share/nginx/html/dist

# 暴露端口
EXPOSE 80

# 启动 nginx，并以前台模式运行（-g "daemon off;" 表示在前台运行）
CMD ["nginx", "-g", "daemon off;"]
