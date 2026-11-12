---
sidebar_position: 3
title: Docker 部署
description: 用官方镜像和 docker compose 部署 SSPanel-UIM
keywords: [SSPanel, Docker, docker compose, 部署]
---

# Docker 部署

官方镜像 `ghcr.io/anankke/sspanel-uim` 包含面板代码、PHP 8.4 和 FrankenPHP。FrankenPHP 内置 Caddy，自动签发与续期 HTTPS 证书。镜像支持 amd64 与 arm64。

支持的部署形态是单机 `docker compose`，多个 `web` 副本同时首次启动不在支持范围内。

## 安装

域名需先解析到本机，80 与 443 端口需可从公网访问，证书在首次启动时申请。

```bash
mkdir sspanel && cd sspanel
curl -fsSLO https://raw.githubusercontent.com/Anankke/SSPanel-UIM/master/docker/compose.yaml
cat > .env <<EOF
SSPANEL_BASE_URL=https://panel.example.com
SSPANEL_DB_PASSWORD=$(openssl rand -hex 24)
EOF
docker compose up -d
```

`.env` 中必须有这两行，`SSPANEL_BASE_URL` 以 `https://` 开头且不以 `/` 结尾。

其余可选变量见仓库中的 `docker/.env.example` 和[官方 README](https://github.com/Anankke/SSPanel-UIM/blob/master/docker/README.md)。

首次启动由 `init` 服务建库、运行迁移并导入默认设置，完成后才启动 `web` 与 `cron`。

## 创建管理员

用下面的命令创建管理员账号：

```bash
docker compose exec web php xcat Tool createAdmin admin@example.com 'your-password'
```

## 升级

```bash
docker compose pull
docker compose up -d
```

固定版本时，修改 `.env` 中的 `SSPANEL_VERSION` 后执行 `docker compose up -d`。

每次 `docker compose up` 时 `init` 用新镜像运行一次迁移。

迁移失败时 `docker compose up -d` 报错，`web` 与 `cron` 保持停止，站点无法访问，直到问题解决。

失败原因用 `docker compose logs init` 查看。

升级前先备份：

```bash
docker compose exec mariadb sh -c 'mariadb-dump -usspanel -p"$MARIADB_PASSWORD" sspanel' > sspanel-$(date +%F).sql
docker run --rm -v "$(basename "$PWD")_data:/data" -v "$PWD:/backup" alpine tar czf /backup/data-$(date +%F).tgz -C /data .
```

迁移运行后不支持换回旧版本镜像。

不要在容器中运行 `php xcat Update`。

## 反向代理

前面有 Nginx、Cloudflare 等负责证书时，让容器只提供 HTTP。

`.env` 中增加：

```bash
SERVER_NAME=:80
SSPANEL_HTTP_PORT=127.0.0.1:8080   # 代理在本机时
```

在 `compose.yaml` 的 `web` 服务下增加：

```yaml
    environment:
      CADDY_GLOBAL_OPTIONS: |
        servers {
          trusted_proxies static 127.0.0.1/32 172.16.0.0/12
          trusted_proxies_strict
          client_ip_headers X-Forwarded-For
        }
```

`trusted_proxies` 填前置代理的地址段。

本机 Nginx 填 Docker 网桥网段，如上例。

Cloudflare 填其公布的 [IP 段](https://www.cloudflare.com/ips/)，并把 `client_ip_headers` 设为 `CF-Connecting-IP`。
