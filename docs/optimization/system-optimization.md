---
sidebar_position: 1
title: 系统优化指南
description: SSPanel-UIM 系统性能优化和配置调优
---

# 系统优化指南

本指南帮助您优化 SSPanel-UIM 的运行性能，包括 PHP、数据库、缓存和系统级优化。

:::tip 提示
这些优化配置是可选的，但强烈建议在生产环境中应用以获得最佳性能。
:::

:::warning 重要说明
本文档示例基于 PHP 8.4 版本。请根据您实际安装的 PHP 版本调整路径和服务名称中的版本号。

pm.max_children 的值取决于您的服务器内存。建议的计算公式：`(总内存 - 其他服务占用) / 30MB`。请根据实际情况调整。
:::

## PHP 优化

优化 PHP-FPM 以提高性能和稳定性：

```bash
# 设置 PHP 版本变量（根据实际安装的版本调整）
PHP_VERSION="8.4"  # 请根据您的实际 PHP 版本调整

# 配置 PHP-FPM（使用更通用的正则表达式）
sed -i -E 's/^(;?pm\s*=\s*).*/pm = static/' /etc/php/${PHP_VERSION}/fpm/pool.d/www.conf
sed -i -E 's/^(;?pm.max_children\s*=\s*).*/pm.max_children = 50/' /etc/php/${PHP_VERSION}/fpm/pool.d/www.conf
sed -i -E 's/^;?(pm.max_requests\s*=\s*).*/pm.max_requests = 500/' /etc/php/${PHP_VERSION}/fpm/pool.d/www.conf

# 配置 PHP
sed -i -E 's/^(memory_limit\s*=\s*).*/memory_limit = 256M/' /etc/php/${PHP_VERSION}/fpm/php.ini
sed -i -E 's/^(upload_max_filesize\s*=\s*).*/upload_max_filesize = 50M/' /etc/php/${PHP_VERSION}/fpm/php.ini
sed -i -E 's/^(post_max_size\s*=\s*).*/post_max_size = 50M/' /etc/php/${PHP_VERSION}/fpm/php.ini
sed -i -E 's/^(max_execution_time\s*=\s*).*/max_execution_time = 300/' /etc/php/${PHP_VERSION}/fpm/php.ini

# 启用 OPcache
sed -i -E 's/^;?(opcache.enable\s*=\s*).*/opcache.enable=1/' /etc/php/${PHP_VERSION}/fpm/php.ini
sed -i -E 's/^;?(opcache.memory_consumption\s*=\s*).*/opcache.memory_consumption=256/' /etc/php/${PHP_VERSION}/fpm/php.ini
sed -i -E 's/^;?(opcache.interned_strings_buffer\s*=\s*).*/opcache.interned_strings_buffer=16/' /etc/php/${PHP_VERSION}/fpm/php.ini
sed -i -E 's/^;?(opcache.max_accelerated_files\s*=\s*).*/opcache.max_accelerated_files=20000/' /etc/php/${PHP_VERSION}/fpm/php.ini
sed -i -E 's/^;?(opcache.validate_timestamps\s*=\s*).*/opcache.validate_timestamps=0/' /etc/php/${PHP_VERSION}/fpm/php.ini

# 注意：设置 validate_timestamps=0 后，代码更改需要重启 PHP-FPM 才能生效
systemctl restart php${PHP_VERSION}-fpm
```

## MariaDB 优化

优化数据库配置以提高查询性能：

```bash
# 创建优化配置
cat > /etc/mysql/mariadb.conf.d/99-sspanel.cnf <<EOF
[mysqld]
# 基础优化
# 最大连接数（根据 PHP-FPM 的 max_children 和服务器内存调整）
# 建议值：略高于 PHP-FPM 的 pm.max_children
max_connections = 500
connect_timeout = 10
wait_timeout = 600
interactive_timeout = 600

# 字符集
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# SQL模式设置（根据应用需求调整）
# 注意：只有在 SSPanel-UIM 明确要求时才禁用严格模式
# sql_mode = 'NO_ENGINE_SUBSTITUTION'  # 不推荐：会允许无效数据
sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'
EOF

systemctl restart mariadb
```

## Redis 优化

配置 Redis 持久化和性能优化：

```bash
# 添加持久化和优化配置（先检查是否已配置）
if ! grep -q "appendonly yes" /etc/redis/redis.conf; then
    cat >> /etc/redis/redis.conf <<EOF

# 持久化配置
save 900 1
save 300 10
save 60 10000
appendonly yes
appendfsync everysec

# 性能优化
tcp-keepalive 60
timeout 300
EOF
fi

systemctl restart redis-server
```

## 系统级优化

### 文件描述符限制

增加系统文件描述符限制以支持高并发：

```bash
# 配置系统限制（先检查是否已存在）
if ! grep -q "www-data.*nofile" /etc/security/limits.conf; then
    cat >> /etc/security/limits.conf <<EOF
www-data soft nofile 65535
www-data hard nofile 65535
www-data soft nproc 65535
www-data hard nproc 65535
EOF
fi
```

### 内核参数优化

优化网络和文件系统相关的内核参数：

```bash
# 配置内核参数（先检查是否已存在）
if ! grep -q "net.core.somaxconn" /etc/sysctl.conf; then
    cat >> /etc/sysctl.conf <<EOF

# 网络优化
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_time = 1200
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.ip_local_port_range = 10000 65000
net.ipv4.tcp_max_tw_buckets = 5000
net.core.somaxconn = 65535
net.core.netdev_max_backlog = 262144

# 文件系统
fs.file-max = 65535
EOF
fi

# 应用配置
sysctl -p
```

### 日志轮转

:::info 说明
SSPanel-UIM 主要使用数据库存储日志（如用户日志、订阅日志、审计日志等），而不是传统的文件日志。以下配置主要针对 PHP-FPM 和 Nginx 的系统日志。
:::

配置系统日志轮转：

```bash
# 配置 PHP-FPM 日志轮转
cat > /etc/logrotate.d/php-fpm <<EOF
/var/log/php*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        # 使用通配符匹配所有 PHP-FPM 版本
        if systemctl is-active --quiet 'php*-fpm'; then
            systemctl reload 'php*-fpm' > /dev/null 2>&1 || true
        fi
    endscript
}
EOF

# 配置 Nginx 日志轮转（如果尚未配置）
cat > /etc/logrotate.d/nginx <<EOF
/var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        nginx -s reopen > /dev/null 2>&1 || true
    endscript
}
EOF
```

## 性能监控

### 系统监控工具

安装和配置监控工具：

```bash
# 安装监控工具
apt install -y htop iotop iftop nethogs

# 监控命令示例
htop  # CPU和内存监控
iotop  # IO监控
iftop  # 网络流量监控
nethogs  # 进程网络使用监控
```

## 故障排除

### 性能问题诊断

如果遇到性能问题，按以下步骤诊断：

1. **检查系统资源**
   ```bash
   # CPU和内存使用
   top -b -n 1 | head -20
   
   # 磁盘IO
   iostat -x 1 5
   
   # 网络连接数
   netstat -an | grep ESTABLISHED | wc -l
   ```

2. **检查慢查询**
   ```bash
   # 查看 MariaDB 慢查询日志
   tail -f /var/log/mysql/mysql-slow.log
   ```

3. **检查 PHP-FPM 状态**
   ```bash
   # 查看 PHP-FPM 进程数
   ps aux | grep php-fpm | wc -l
   
   # 查看 PHP-FPM 日志
   tail -f /var/log/php8.4-fpm.log
   ```

### 常见优化建议

- **使用 CDN**：静态资源使用 CDN 加速
- **启用 Gzip**：在 Nginx 中启用 Gzip 压缩
- **数据库索引**：为常用查询添加索引
- **定期清理**：定期清理日志和临时文件
- **监控告警**：设置监控和告警机制

## 下一步

完成系统优化后，您可以：

- 查看[基础配置](../configuration/basic.md)了解系统配置
- 查看[邮件配置](../configuration/email.md)配置邮件服务
- 查看[节点配置](../configuration/nodes.md)添加和管理节点