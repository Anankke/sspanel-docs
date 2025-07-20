---
sidebar_position: 1
title: Docker 一键安装
description: 使用 Docker 快速部署 SSPanel-UIM
keywords: [SSPanel, 一键安装, Docker, 容器化部署]
---

# 一键安装

SSPanel-UIM 提供基于 Docker 的容器化部署方案，让您能够在几分钟内完成整个系统的部署、备份、迁移。

## 系统要求

### 最低配置
- **硬件要求**: CPU、内存、硬盘要求与[手动安装方式](./manual-install)相同。
- **系统**: 支持 Docker 的任意 Linux 发行版

### 前置要求
- Docker Engine 20.10+
- Docker Compose 2.0+
- 基本的 Linux 操作知识

## 开始部署

要完成 SSPanel-UIM 部署，需要完成以下步骤：

1. **下载和修改配置**：配置文件包含所有 SSPanel-UIM 运行所需信息，包括域名、SSL证书配置、节点对接密钥等。
2. **启动服务**：通过 docker compose 管理服务启停。

### 步骤1：下载和修改配置

我们提供两种方式下载配置，您可以根据使用习惯 **选择其中一种** 适合自己的下载方式：

1. **一键脚本下载**：
```bash
bash <(curl -sL https://raw.githubusercontent.com/Anankke/SSPanel-UIM/refs/heads/master/infra/quick-install.sh)
```

执行命令后，请根据提示完成配置。**如果遇到问题**，可以尝试下方手动配置。


2. **手动下载**：
手动下载与上述一键脚本的目的一致，仅需选择其中一种配置下载方式。
```bash
curl -O https://raw.githubusercontent.com/Anankke/SSPanel-UIM/main/infra/docker-compose.yml # 下载 docker-compose
curl -O https://github.com/Anankke/SSPanel-UIM/releases/download/latest/docker-configs.zip && unzip docker-configs.zip # 下载 Docker 配置文件
mv .env.example .env
```

解压完成后，目录中将出现 `.env` 文件和 `config/` 目录，请首先修改 .env 文件起始的以下部分

```ini
# 是否自动申请 Let's Encrypt SSL 证书（通过 HTTP-01 在 80 端口验证）
DISABLE_LETSENCRYPT=false

# 基础站点配置 **请修改**
DOMAIN=example.com
SSPANEL_APP_NAME=SSPanel-UIM

# 初始化管理员配置 **请修改**
SSPANEL_ADMIN_EMAIL=test@example.com
SSPANEL_ADMIN_PASSWORD=changeme

# 站点 Key 配置 **请修改为随机字符串**
#  > 可用 `openssl rand -hex 16` 生成
SSPANEL_KEY=ChangeMeToRandomString
SSPANEL_MUKEY=ChangeMeToAnotherRandomString
```


### 步骤2：启动服务

使用下方命令启动服务。依照 `docker-compose.yml` 中的定义，服务将默认在系统的 `:80` 和 `:443` 端口分别监听 HTTP 和 HTTPS 协议。
```bash
docker compose up -d
```

如无法访问，推荐查看容器状态和日志。

```bash
docker compose ps # 查看容器状态是否都为 Up
docker compose logs -f # 查看容器日志，进一步确认错误信息
```

正常状态下会启动 5 个容器，分别为：
- `sspanel-db`：数据库容器
- `sspanel-redis`：Redis 容器
- `sspanel-app`：应用容器，运行 SSPanel-UIM 应用
- `sspanel-caddy`：反向代理
- `sspanel-cron`：定时任务容器


## 遇到问题

如果遇到问题，您可以参考以下链接来尝试解决或联系我们

- [SSPanel-UIM GitHub](https://github.com/Anankke/SSPanel-UIM)
- [官方 Telegram 群组](https://t.me/sspanel)
- [本文档站点](https://docs.sspanel.io)

### 🛠️ 计划功能路线

- [ ] 自动备份和恢复功能
- [ ] 健康检查和自动重启
- [ ] 日志集中管理

---

更多信息即将发布，敬请关注！