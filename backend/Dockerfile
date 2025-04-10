# 指定容器的基础镜像（固定到特定 digest）
FROM node:23-slim@sha256:dfb18d8011c0b3a112214a32e772d9c6752131ffee512e974e59367e46fcee52

# 指定容器内的工作空间
WORKDIR /app

# 将项目复制到容器内
COPY . .

# 安装环境依赖
RUN apt-get update -y && apt-get install -y openssl

# 设置环境变量
ENV NODE_ENV=production
# 安装依赖
RUN npm install -g pnpm && pnpm install
# 生成 Prisma 客户端并迁移数据库
# RUN pnpm prisma:generate--prod && pnpm prisma:migrate:redo--prod && prisma:migrate:deploy--prod
RUN pnpm prisma:generate
# 构建项目
RUN pnpm build

# 暴露端口
EXPOSE 3000

# 启动后端项目
CMD ["pnpm", "start"]
