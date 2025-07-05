---
sidebar_position: 1
title: "基础配置"
description: "SSPanel-UIM 基础配置详解，包括站点设置、数据库配置、Redis 配置等"
keywords: [SSPanel, 配置, 基础设置, 数据库, Redis]
tags: [configuration, basic, database, redis]
---

# 基础配置

本章节将详细介绍 SSPanel-UIM 的基础配置项。所有配置项都位于 `config/.config.php` 文件中。

## 配置文件位置

SSPanel-UIM 的主配置文件位于：
```
/path/to/sspanel/config/.config.php
```

首次安装时，需要从示例文件复制：
```bash
cp config/.config.example.php config/.config.php
```

## 核心配置

### 站点基本信息

```php
// 站点名称
$_ENV['appName'] = 'SSPanel-UIM';

// 站点地址（必须以 https:// 开头，不要以 / 结尾）
$_ENV['baseUrl'] = 'https://sspanel.example.com';

// Cookie 加密密钥（建议修改为随机字符串）
$_ENV['key'] = 'ChangeMe';

// 密码加密方式（推荐使用 bcrypt）
$_ENV['pwdMethod'] = 'bcrypt'; // 可选：bcrypt, argon2i, argon2id

// 盐值（bcrypt/argon2i/argon2id 会忽略此项）
$_ENV['salt'] = '';
```

### 调试模式

```php
// 调试模式开关（生产环境建议设置为 false）
$_ENV['debug'] = false;
```

## 数据库配置

SSPanel-UIM 支持 MySQL 8.0+ 或 MariaDB 10.11+。

### 基础数据库配置

```php
// 数据库连接方式（二选一）
// 使用主机名/IP
$_ENV['db_host'] = 'localhost';
// 或使用 Unix Socket
$_ENV['db_socket'] = '';

// 数据库名称
$_ENV['db_database'] = 'sspanel';

// 数据库用户名
$_ENV['db_username'] = 'sspanel';

// 数据库密码
$_ENV['db_password'] = 'your_password';

// 数据库端口
$_ENV['db_port'] = '3306';

// 字符集和排序规则（建议保持默认）
$_ENV['db_charset'] = 'utf8mb4';
$_ENV['db_collation'] = 'utf8mb4_unicode_ci';

// 表前缀（可选）
$_ENV['db_prefix'] = '';
```

### 读写分离配置

对于高负载场景，SSPanel-UIM 支持数据库读写分离：

```php
// 是否开启读写分离
$_ENV['enable_db_rw_split'] = false;

// 从库地址（可配置多个）
$_ENV['read_db_hosts'] = ['192.168.1.101', '192.168.1.102'];

// 主库地址
$_ENV['write_db_host'] = '192.168.1.100';
```

## Redis 配置

Redis 用于缓存和会话存储，推荐使用 Redis 7.0+。

```php
// Redis 地址（使用 Unix Socket 时填写文件路径）
$_ENV['redis_host'] = '127.0.0.1';

// Redis 端口（使用 Unix Socket 时填写 -1）
$_ENV['redis_port'] = 6379;

// 连接超时时间（秒）
$_ENV['redis_connect_timeout'] = 2.0;

// 读取超时时间（秒）
$_ENV['redis_read_timeout'] = 8.0;

// Redis 用户名（可选）
$_ENV['redis_username'] = '';

// Redis 密码（可选）
$_ENV['redis_password'] = '';

// 是否使用 SSL 连接
$_ENV['redis_ssl'] = false;

// SSL 上下文选项
$_ENV['redis_ssl_context'] = [];
```

## GeoIP2 配置

GeoIP2 用于识别用户的地理位置信息，需要 MaxMind 账户。

### 获取 MaxMind License Key

1. 访问 [MaxMind 官网](https://www.maxmind.com/en/geolite2/signup) 注册免费账户
2. 登录后进入 [My License Keys](https://www.maxmind.com/en/accounts/current/license-key)
3. 点击 "Generate new license key"
4. 输入描述，选择 "No" for "Will this key be used for GeoIP Update?"
5. 复制生成的 License Key

### 配置 GeoIP2

```php
// MaxMind License Key
$_ENV['maxmind_license_key'] = 'your_license_key_here';

// GeoIP 显示语言
$_ENV['geoip_locale'] = 'zh-CN'; // 可选：zh-CN, en, ja 等
```

:::info 说明
- 免费的 GeoLite2 数据库每周更新一次
- 首次配置后，系统会自动下载 GeoIP 数据库
- 数据库文件存储在 `storage/GeoLite2-City.mmdb`
:::

:::tip 更新数据库
使用以下命令手动更新 GeoIP 数据库：
```bash
php xcat Update downloadGeoIP
```
建议通过定时任务每周更新一次。
:::

## 安全配置

### 登录安全

```php
// 是否将登录线程和 IP 绑定
$_ENV['enable_login_bind_ip'] = true;

// 是否将登录线程和设备绑定
$_ENV['enable_login_bind_device'] = true;

// 记住登录时长（天）
$_ENV['rememberMeDuration'] = 7;
```

### HTTPS 强制

确保 Nginx 配置中强制使用 HTTPS：

```nginx
server {
    listen 80;
    server_name sspanel.example.com;
    return 301 https://$server_name$request_uri;
}
```


## 下一步

完成基础配置后，您可以继续配置：

- [邮件设置](./email) - 配置邮件发送服务
- [节点配置](./nodes) - 添加和管理节点