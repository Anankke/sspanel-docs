---
sidebar_position: 1
title: 常见问题
description: SSPanel-UIM 常见问题解决方案
---

# 常见问题解决

本文档收集了 SSPanel-UIM 使用过程中的常见问题及解决方案。

## 安装问题

### Composer 安装依赖失败

**错误信息：**
```
Your requirements could not be resolved to an installable set of packages.
```

**解决方案：**

```bash
# 1. 确保 PHP 版本正确
php -v  # 需要 PHP 8.2+

# 2. 清理 Composer 缓存
composer clear-cache

# 3. 更新 Composer
composer self-update

# 4. 如果下载缓慢，可以使用镜像加速
# composer config -g repo.packagist composer https://mirrors.aliyun.com/composer/

# 5. 重新安装
composer install --no-dev --optimize-autoloader
```

**PHP 版本升级导致的兼容性问题：**

如果升级 PHP 版本后出现依赖包版本不兼容错误，删除 composer.lock 文件重新安装：

```bash
rm composer.lock
composer install --no-dev --optimize-autoloader
```

### 数据库连接失败

**错误信息：**
```
SQLSTATE[HY000] [2002] No such file or directory
```

**解决方案：**

修改配置文件，使用 127.0.0.1 替代 localhost：

```php
// config/.config.php
$_ENV['db_host'] = '127.0.0.1';
```

**其他检查项：**
```bash
# 检查 MariaDB 是否运行
systemctl status mariadb

# 测试数据库连接
mariadb -u sspanel -p -h 127.0.0.1 sspanel

# 检查用户权限
mariadb -u root -p
SHOW GRANTS FOR 'sspanel'@'localhost';
```

### 目录权限问题

**错误信息：**
```
Failed to open stream: Permission denied
```

**解决方案：**

请参考[手动安装文档](../installation/manual-install#设置目录权限)中的权限设置部分，确保正确设置文件所有者和权限。

## 配置问题

### 站点无法访问

**检查步骤：**

```bash
# 1. 检查 Nginx 配置
nginx -t
systemctl status nginx

# 2. 检查 PHP-FPM
systemctl status php8.4-fpm

# 3. 检查端口监听
netstat -tlnp | grep -E ':80|:443'

# 4. 检查防火墙
ufw status  # Ubuntu
```

### 500 内部服务器错误

**调试步骤：**

1. **开启调试模式**
```php
// config/.config.php
$_ENV['debug'] = true;
```

2. **查看错误日志**
```bash
# PHP 错误日志
tail -f /var/log/php8.4-fpm.log

# Nginx 错误日志
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# 系统日志
journalctl -xe
```

3. **常见原因**
- PHP 扩展缺失
- 配置文件语法错误
- 数据库连接问题
- Redis 连接问题

### 邮件发送失败

邮件配置通过管理面板进行：

1. 登录管理后台
2. 进入 **设置** → **邮件**
3. 选择邮件驱动为 "SMTP"
4. 填写 SMTP 配置
5. 使用"发送测试邮件"功能验证

## 节点问题

### 节点离线

**检查步骤：**

1. **验证节点配置**
```bash
# 在节点服务器上测试 WebAPI
curl -v https://sspanel.example.com/mod_mu/nodes/{node_id}/info?key={muKey}
```

2. **检查节点日志**
```bash
# XrayR 日志
journalctl -u XrayR -f

# V2Ray 日志
journalctl -u v2ray -f
```

### 用户无法连接

**排查流程：**

1. 检查用户状态（是否被禁用或流量用尽）
2. 检查节点状态（是否在线）
3. 检查订阅链接（是否过期）
4. 检查客户端配置

### 流量统计异常

**可能原因：**
- 节点时间不同步
- WebAPI 认证失败
- 数据库写入延迟

**解决方案：**
```bash
# 同步时间
ntpdate -u ntp.aliyun.com

# 查看节点最后上报时间
# 在管理面板查看节点列表
```

## 性能问题

### 网站加载缓慢

**优化建议：**

1. **启用 PHP OPcache**
```ini
; /etc/php/8.4/fpm/conf.d/10-opcache.ini
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
```

2. **配置 Redis 缓存**
```bash
redis-cli
CONFIG SET maxmemory 512mb
CONFIG SET maxmemory-policy allkeys-lru
```

### 数据库查询慢

**优化步骤：**

```sql
-- 分析表
ANALYZE TABLE user;
ANALYZE TABLE user_traffic_log;

-- 优化表
OPTIMIZE TABLE user;
OPTIMIZE TABLE node_online_log;
```

## GeoIP2 配置

**问题描述：**
系统提示 "GeoIP2 服务未配置" 或无法显示用户地理位置信息。

**解决方案：**

请参考[基础配置文档](../configuration/basic#geoip2-配置)中的 GeoIP2 配置部分。

## 支付问题

### 支付回调失败

**检查项：**
- 回调 URL 是否正确
- HTTPS 证书是否有效
- 支付密钥是否正确
- IP 白名单设置

**调试方法：**
- 在管理面板查看支付记录
- 检查数据库中的 `paylist` 和 `invoice` 表
- 查看 Nginx 访问日志中的回调请求

### 订单未到账

**处理流程：**

1. 在管理面板查看订单状态
2. 检查支付网关配置
3. 确认定时任务正常运行：
   ```bash
   crontab -l
   # 确保有 SSPanel 定时任务
   ```

:::tip 提示
遇到问题时，首先开启调试模式并查看相关日志。大部分问题都有明确的错误提示。
:::