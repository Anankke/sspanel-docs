---
sidebar_position: 1
title: "SSPanel-UIM 安装指南"
description: "SSPanel-UIM 完整安装部署指南，支持多种协议的代理服务管理面板"
keywords: [SSPanel, 安装, 部署, 代理, 面板]
tags: [installation, deployment, proxy, panel]
---

# SSPanel-UIM 安装指南

欢迎使用 **SSPanel-UIM**！这是一个强大的代理服务管理面板，支持多种协议和完善的用户管理功能。

## 概述

SSPanel-UIM 是一个基于 PHP 的代理服务管理面板，具有以下特点：

- **多协议支持**：支持 Shadowsocks、Shadowsocks 2022、VMess、VLESS、Trojan、TUIC、Hysteria2 协议
- **用户管理**：完善的用户注册、订阅、流量统计系统
- **节点管理**：按用户等级和分组分配节点，统计节点流量与在线状态
- **财务系统**：支持多种支付方式、套餐管理、佣金系统
- **运营工具**：工单系统、邮件通知、数据统计等

## 系统要求

在开始安装前，请确保您的服务器满足以下要求：

### 最低配置
- **CPU**: 1核心
- **内存**: 1GB RAM
- **存储**: 10GB 可用空间
- **网络**: 稳定的网络连接

### 推荐配置
- **CPU**: 2核心或以上
- **内存**: 2GB RAM 或以上
- **存储**: 20GB SSD
- **网络**: 高质量网络连接

### 软件环境
- **操作系统**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **Web服务器**: Nginx
- **PHP**: 8.2 或以上版本
- **数据库**: MySQL 8.0+ 或 MariaDB 10.11+
- **缓存**: Redis 7.0+

## 安装方式

目前 SSPanel-UIM 只能手动安装，步骤见[手动安装指南](./installation/manual-install)，覆盖 Ubuntu、Debian、CentOS、Arch Linux 等系统。
