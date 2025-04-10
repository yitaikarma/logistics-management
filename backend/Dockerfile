# 指定容器的基础镜像（固定到特定 digest）
FROM node:23-slim@sha256:dfb18d8011c0b3a112214a32e772d9c6752131ffee512e974e59367e46fcee52 AS base

# 指定容器内的工作空间
WORKDIR /app

# 将你项目内的所有文件复制到容器内 .表示所有
COPY . .

RUN apt-get update -y && apt-get install -y openssl

# 安装依赖&构建
RUN npm install -g pnpm && pnpm install && pnpm prisma:generate && pnpm build

# 暴露端口
EXPOSE 3000

# 启动后端项目
CMD ["pnpm", "start"]
