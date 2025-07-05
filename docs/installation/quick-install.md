---
sidebar_position: 1
title: 一键安装
description: 使用 Docker 快速部署 SSPanel-UIM
keywords: [SSPanel, 一键安装, Docker, 容器化部署]
---

# 一键安装

SSPanel-UIM 的一键安装方案正在开发中，我们将提供基于 Docker 的容器化部署方案，让您能够在几分钟内完成整个系统的部署。

## 即将推出

我们正在开发全新的 Docker 部署方案，它将提供：

### 🚀 核心特性

- **一键部署**：使用 Docker Compose 一键启动所有服务
- **自动配置**：自动化配置数据库、缓存和 Web 服务
- **环境隔离**：容器化运行，与主机系统完全隔离
- **易于升级**：简单的容器更新即可完成系统升级
- **跨平台支持**：支持 Linux、macOS 和 Windows

### 📦 包含组件

- **PHP-FPM 8.4**：最新版本的 PHP 运行环境
- **Nginx**：高性能 Web 服务器
- **MariaDB 10.11**：数据库服务
- **Redis 7.0**：高速缓存服务
- **Supervisor**：进程管理工具

### 🛠️ 计划功能

- 支持环境变量配置
- 内置 SSL 证书自动申请
- 自动备份和恢复功能
- 健康检查和自动重启
- 日志集中管理

## 当前替代方案

在 Docker 方案正式发布前，您可以：

1. **使用手动安装**：查看[手动安装指南](./manual-install)进行传统方式部署
2. **关注项目更新**：访问 [GitHub 仓库](https://github.com/Anankke/SSPanel-UIM)获取最新进展

## 预计发布时间

Docker 一键安装方案预计将在未来几个月内发布。我们将在以下渠道发布更新：

- [SSPanel-UIM GitHub](https://github.com/Anankke/SSPanel-UIM)
- [官方 Telegram 群组](https://t.me/sspanel)
- [本文档站点](https://docs.sspanel.io)

## 参与贡献

如果您有 Docker 部署经验并愿意参与开发，欢迎：

- 提交 Pull Request
- 分享部署经验
- 反馈需求建议

:::info 提示
Docker 部署方案将作为独立项目维护，敬请期待！
:::

## 系统要求（预览）

### 最低配置
- **CPU**: 1 核心
- **内存**: 2GB RAM
- **硬盘**: 20GB 可用空间
- **系统**: 支持 Docker 的任意 Linux 发行版

### 推荐配置
- **CPU**: 2 核心或以上
- **内存**: 4GB RAM 或以上
- **硬盘**: 40GB SSD
- **系统**: Ubuntu 22.04 LTS / Debian 12

### 前置要求
- Docker Engine 20.10+
- Docker Compose 2.0+
- 基本的 Linux 操作知识

---

更多信息即将发布，敬请关注！