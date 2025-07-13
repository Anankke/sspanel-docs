---
sidebar_position: 2
title: 手动安装
description: 在 Debian、Ubuntu、CentOS/RHEL 上手动安装 SSPanel-UIM 的详细步骤
keywords: [SSPanel, 手动安装, Debian, Ubuntu, CentOS, RHEL, 部署, 配置]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 手动安装

本指南提供在 Debian、Ubuntu 和 CentOS/RHEL 系统上手动安装 SSPanel-UIM 的详细步骤。您可以根据自己的系统选择相应的命令。

## 系统要求

### 硬件要求
- **最低配置**：1 核 CPU、1GB RAM、10GB 存储
- **推荐配置**：2 核 CPU、2GB RAM、20GB SSD

### 软件要求
- **操作系统**：
  - Debian 12 (Bookworm)
  - Ubuntu 20.04/22.04 LTS
  - CentOS 7/8/Stream 9
  - RHEL 8/9
- **架构**：x86_64
- **软件版本**：
  - PHP 8.2+（本文档使用 8.4，推荐用于更好的性能）
    - 必需扩展：bcmath、curl、fileinfo、gmp、json、mbstring、mysqli、openssl、pdo、posix、redis、sodium、xml、yaml、zip
    - 性能优化扩展：opcache（强烈推荐，提升 PHP 性能）
  - MariaDB 10.11+（本文档使用 11.8 LTS，推荐的长期支持版本）
  - Redis 7.0+
  - Nginx 1.24+（必须支持 HTTPS）

## 安装前准备

<Tabs groupId="os">
<TabItem value="debian" label="Debian 12" default>

```bash
# 更新系统
apt update && apt upgrade -y

# 安装基础工具
apt install -y curl wget git unzip software-properties-common \
  apt-transport-https ca-certificates gnupg2 lsb-release

# 设置时区
timedatectl set-timezone Asia/Shanghai

# 禁用防火墙（如果启用）
systemctl stop ufw
systemctl disable ufw
```

</TabItem>
<TabItem value="ubuntu" label="Ubuntu 20.04/22.04">

```bash
# 更新系统
apt update && apt upgrade -y

# 安装基础工具
apt install -y curl wget git unzip software-properties-common \
  apt-transport-https ca-certificates gnupg lsb-release

# 设置时区
timedatectl set-timezone Asia/Shanghai

# 禁用防火墙（如果启用）
ufw disable
```

</TabItem>
<TabItem value="centos" label="CentOS/RHEL">

```bash
# 更新系统
dnf update -y

# 安装基础工具
dnf install -y epel-release
dnf install -y curl wget git unzip tar

# 设置时区
timedatectl set-timezone Asia/Shanghai

# 禁用防火墙（可选）
systemctl stop firewalld
systemctl disable firewalld

# 禁用 SELinux（可选）
setenforce 0
sed -i 's/^SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
```

</TabItem>
<TabItem value="arch" label="Arch Linux">

```bash
# 更新系统
pacman -Syu

# 安装基础工具
pacman -S base-devel git wget curl unzip

# 设置时区
timedatectl set-timezone Asia/Shanghai
```

</TabItem>
</Tabs>

## 步骤 1：安装 Nginx

<Tabs groupId="os">
<TabItem value="debian" label="Debian 12" default>

```bash
# 添加 Nginx 官方仓库
curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
  | tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null

echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
  http://nginx.org/packages/mainline/debian bookworm nginx" \
  | tee /etc/apt/sources.list.d/nginx.list

# 设置仓库优先级
echo -e "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" \
  | tee /etc/apt/preferences.d/99nginx

# 安装 Nginx
apt update && apt install -y nginx

# 修改用户为 www-data
sed -i 's/^user.*/user www-data;/' /etc/nginx/nginx.conf

# 启动服务
systemctl start nginx && systemctl enable nginx
```

</TabItem>
<TabItem value="ubuntu" label="Ubuntu 20.04/22.04">

```bash
# 添加 Nginx 官方仓库
curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
  | tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null

echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
  http://nginx.org/packages/mainline/ubuntu `lsb_release -cs` nginx" \
  | tee /etc/apt/sources.list.d/nginx.list

# 设置仓库优先级
echo -e "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" \
  | tee /etc/apt/preferences.d/99nginx

# 安装 Nginx
apt update && apt install -y nginx

# 修改用户为 www-data
sed -i 's/^user.*/user www-data;/' /etc/nginx/nginx.conf

# 启动服务
systemctl start nginx && systemctl enable nginx
```

</TabItem>
<TabItem value="centos" label="CentOS/RHEL">

```bash
# 添加 Nginx 官方仓库
cat > /etc/yum.repos.d/nginx.repo <<EOF
[nginx-mainline]
name=nginx mainline repo
baseurl=http://nginx.org/packages/mainline/rhel/\$releasever/\$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true
priority=9
EOF

# 安装 Nginx
dnf install -y nginx

# 启动服务
systemctl start nginx && systemctl enable nginx
```

</TabItem>
<TabItem value="arch" label="Arch Linux">

```bash
# 安装 Nginx
pacman -S nginx

# 启动服务
systemctl start nginx && systemctl enable nginx
```

:::note 注意
Arch Linux 的 Nginx 默认用户是 `http`，不是 `www-data`。后续配置中需要注意这个差异。
:::

</TabItem>
</Tabs>

## 步骤 2：安装 PHP

:::tip PHP 版本说明
SSPanel-UIM 要求 PHP 8.2 以上版本。本文档使用 PHP 8.4，它提供了：
- 更好的性能（特别是 JIT 编译器优化）
- 最新的安全特性
- 更长的官方支持周期

如需使用其他版本，请将下面命令中的 `8.4` 替换为所需版本号（如 `8.2` 或 `8.3`）。
:::

<Tabs groupId="os">
<TabItem value="debian" label="Debian 12" default>

```bash
# 添加 PHP 仓库
curl -sSLo /tmp/php.gpg https://packages.sury.org/php/apt.gpg
gpg --dearmor < /tmp/php.gpg > /usr/share/keyrings/php-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/php-archive-keyring.gpg] \
  https://packages.sury.org/php/ bookworm main" > /etc/apt/sources.list.d/php.list

# 安装 PHP 8.4 及必需扩展
apt update && apt install -y php8.4-{bcmath,bz2,cli,common,curl,fpm,gd,gmp,igbinary,intl,mbstring,mysql,opcache,readline,redis,soap,xml,yaml,zip}

# 注意：posix 和 sodium 扩展是必需的
# 大多数系统会通过 php8.4-common 自动安装，如果没有，请运行：
# apt install -y php8.4-posix php8.4-sodium

# 配置 PHP
sed -i 's/^max_execution_time.*/max_execution_time = 300/' /etc/php/8.4/fpm/php.ini
sed -i 's/^memory_limit.*/memory_limit = 256M/' /etc/php/8.4/fpm/php.ini
sed -i 's/^post_max_size.*/post_max_size = 50M/' /etc/php/8.4/fpm/php.ini
sed -i 's/^upload_max_filesize.*/upload_max_filesize = 50M/' /etc/php/8.4/fpm/php.ini
sed -i 's/^;date.timezone.*/date.timezone = Asia\/Shanghai/' /etc/php/8.4/fpm/php.ini

# 配置 PHP-FPM
sed -i 's/^;listen.owner.*/listen.owner = www-data/' /etc/php/8.4/fpm/pool.d/www.conf
sed -i 's/^;listen.group.*/listen.group = www-data/' /etc/php/8.4/fpm/pool.d/www.conf
sed -i 's/^;listen.mode.*/listen.mode = 0660/' /etc/php/8.4/fpm/pool.d/www.conf

# 启动服务
systemctl restart php8.4-fpm && systemctl enable php8.4-fpm
```

</TabItem>
<TabItem value="ubuntu" label="Ubuntu 20.04/22.04">

```bash
# 添加 PHP PPA
add-apt-repository ppa:ondrej/php -y
apt update

# 安装 PHP 8.4 及必需扩展
apt install -y php8.4-{bcmath,bz2,cli,common,curl,fpm,gd,gmp,intl,mbstring,mysql,opcache,readline,redis,soap,xml,yaml,zip}

# 注意：某些系统可能需要单独安装 posix 和 sodium 扩展
# 如果上面的命令没有安装这些扩展，请运行：
# apt install -y php8.4-posix php8.4-sodium

# 配置 PHP
sed -i 's/^max_execution_time.*/max_execution_time = 300/' /etc/php/8.4/fpm/php.ini
sed -i 's/^memory_limit.*/memory_limit = 256M/' /etc/php/8.4/fpm/php.ini
sed -i 's/^post_max_size.*/post_max_size = 50M/' /etc/php/8.4/fpm/php.ini
sed -i 's/^upload_max_filesize.*/upload_max_filesize = 50M/' /etc/php/8.4/fpm/php.ini
sed -i 's/^;date.timezone.*/date.timezone = Asia\/Shanghai/' /etc/php/8.4/fpm/php.ini

# 配置 PHP-FPM
sed -i 's/^;listen.owner.*/listen.owner = www-data/' /etc/php/8.4/fpm/pool.d/www.conf
sed -i 's/^;listen.group.*/listen.group = www-data/' /etc/php/8.4/fpm/pool.d/www.conf
sed -i 's/^;listen.mode.*/listen.mode = 0660/' /etc/php/8.4/fpm/pool.d/www.conf

# 启动服务
systemctl restart php8.4-fpm && systemctl enable php8.4-fpm
```

</TabItem>
<TabItem value="centos" label="CentOS/RHEL">

```bash
# 启用必要的仓库
dnf config-manager --set-enabled crb  # RHEL 9 / Rocky 9
# dnf config-manager --set-enabled powertools  # CentOS 8

# 安装 EPEL 和 Remi 仓库
dnf install -y epel-release
dnf install -y https://rpms.remirepo.net/enterprise/remi-release-9.rpm  # For EL9
# dnf install -y https://rpms.remirepo.net/enterprise/remi-release-8.rpm  # For EL8

# 安装 PHP 8.4 及必需扩展
dnf module reset php -y
dnf module install php:remi-8.4 -y
dnf install -y php-{bcmath,cli,common,fpm,gd,gmp,intl,json,mbstring,mysqlnd,opcache,pdo,pecl-redis5,pecl-yaml,process,soap,sodium,xml,zip}

# 注意：process 包提供 posix 扩展，sodium 包提供加密功能
# 如果批量安装失败，可以单独安装必需的扩展：
# dnf install -y php-process php-sodium php-gmp
# 或者使用 yum（旧版本系统）：
# yum install -y php-posix php-sodium php-gmp

# 配置 PHP
sed -i 's/^max_execution_time.*/max_execution_time = 300/' /etc/php.ini
sed -i 's/^memory_limit.*/memory_limit = 256M/' /etc/php.ini
sed -i 's/^post_max_size.*/post_max_size = 50M/' /etc/php.ini
sed -i 's/^upload_max_filesize.*/upload_max_filesize = 50M/' /etc/php.ini
sed -i 's/^;date.timezone.*/date.timezone = Asia\/Shanghai/' /etc/php.ini

# 配置 PHP-FPM
sed -i 's/^user = apache/user = nginx/' /etc/php-fpm.d/www.conf
sed -i 's/^group = apache/group = nginx/' /etc/php-fpm.d/www.conf
sed -i 's/^listen.owner = nobody/listen.owner = nginx/' /etc/php-fpm.d/www.conf
sed -i 's/^listen.group = nobody/listen.group = nginx/' /etc/php-fpm.d/www.conf

# 启动服务
systemctl start php-fpm && systemctl enable php-fpm
```

</TabItem>
<TabItem value="arch" label="Arch Linux">

```bash
# 安装 PHP 和必要扩展
pacman -S php php-fpm php-intl php-gd php-sqlite php-redis php-sodium php-gmp

# 注意：Arch Linux 的 PHP 包默认包含了 posix 扩展

# 配置 PHP
sed -i 's/^max_execution_time.*/max_execution_time = 300/' /etc/php/php.ini
sed -i 's/^memory_limit.*/memory_limit = 256M/' /etc/php/php.ini
sed -i 's/^post_max_size.*/post_max_size = 50M/' /etc/php/php.ini
sed -i 's/^upload_max_filesize.*/upload_max_filesize = 50M/' /etc/php/php.ini
sed -i 's/^;date.timezone.*/date.timezone = Asia\/Shanghai/' /etc/php/php.ini

# 启动服务
systemctl start php-fpm && systemctl enable php-fpm
```

:::note Arch Linux 特别说明
- PHP-FPM 在 Arch 上默认使用 `http` 用户
- Socket 路径为 `/run/php-fpm/php-fpm.sock`
- 某些扩展可能需要从 AUR 安装
:::

</TabItem>
</Tabs>

## 步骤 3：安装 MariaDB

:::info MariaDB 11.8 LTS
本文档使用 MariaDB 11.8，这是我们推荐的长期支持版本，提供了：
- 最新的查询优化器，显著提升性能
- 增强的并行复制和备份功能
- 改进的 JSON 和地理空间功能
- 长期支持保障，适合生产环境
:::

<Tabs groupId="os">
<TabItem value="debian" label="Debian 12" default>

```bash
# 添加 MariaDB 仓库
mkdir -p /etc/apt/keyrings
curl -o /etc/apt/keyrings/mariadb-keyring.pgp \
  'https://mariadb.org/mariadb_release_signing_key.pgp'

cat > /etc/apt/sources.list.d/mariadb.sources <<EOF
X-RepoLib-Name: MariaDB
Types: deb
URIs: https://deb.mariadb.org/11.8/debian
Suites: bookworm
Components: main
Signed-By: /etc/apt/keyrings/mariadb-keyring.pgp
EOF

# 安装 MariaDB
apt update && apt install -y mariadb-server mariadb-client

# 启动服务
systemctl start mariadb && systemctl enable mariadb

# 安全初始化
mariadb-secure-installation
```

</TabItem>
<TabItem value="ubuntu" label="Ubuntu 20.04/22.04">

```bash
# 添加 MariaDB 仓库
curl -o /tmp/mariadb_repo_setup.sh \
  https://downloads.mariadb.com/MariaDB/mariadb_repo_setup
bash /tmp/mariadb_repo_setup.sh --mariadb-server-version="mariadb-11.8"

# 安装 MariaDB
apt update && apt install -y mariadb-server mariadb-client

# 启动服务
systemctl start mariadb && systemctl enable mariadb

# 安全初始化
mariadb-secure-installation
```

</TabItem>
<TabItem value="centos" label="CentOS/RHEL">

```bash
# 添加 MariaDB 仓库
cat > /etc/yum.repos.d/MariaDB.repo <<EOF
[mariadb]
name = MariaDB
baseurl = https://rpm.mariadb.org/11.8/rhel/\$releasever/\$basearch
module_hotfixes = 1
gpgkey = https://rpm.mariadb.org/RPM-GPG-KEY-MariaDB
gpgcheck = 1
EOF

# 安装 MariaDB
dnf install -y MariaDB-server MariaDB-client

# 启动服务
systemctl start mariadb && systemctl enable mariadb

# 安全初始化
mariadb-secure-installation
```

</TabItem>
<TabItem value="arch" label="Arch Linux">

```bash
# 安装 MariaDB
pacman -S mariadb

# 初始化数据库
mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql

# 启动服务
systemctl start mariadb && systemctl enable mariadb

# 安全初始化
mariadb-secure-installation
```

</TabItem>
</Tabs>

运行 `mariadb-secure-installation` 时，系统会询问以下问题：

- **Enter current password for root (enter for none)**: 直接按回车（首次安装没有密码）
- **Switch to unix_socket authentication [Y/n]**: 输入 `n`（保持密码认证）
- **Change the root password? [Y/n]**: 输入 `n`（不用设置 root 密码）
- **Remove anonymous users? [Y/n]**: 输入 `Y`（删除匿名用户）
- **Disallow root login remotely? [Y/n]**: 输入 `Y`（禁止 root 远程登录）
- **Remove test database and access to it? [Y/n]**: 输入 `Y`（删除测试数据库）
- **Reload privilege tables now? [Y/n]**: 输入 `Y`（立即生效）

### 创建数据库

所有系统通用：

```bash
# 生成安全密码
DB_PASSWORD=$(openssl rand -base64 16)
echo "数据库密码: $DB_PASSWORD"

# 创建数据库和用户（使用 mariadb 命令，避免弃用警告）
mariadb -u root -p <<EOF
CREATE DATABASE sspanel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'sspanel'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON sspanel.* TO 'sspanel'@'localhost';
FLUSH PRIVILEGES;
EOF
```

## 步骤 4：安装 Redis

<Tabs groupId="os">
<TabItem value="debian" label="Debian 12" default>

```bash
# 添加 Redis 仓库
curl -fsSL https://packages.redis.io/gpg | gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] \
  https://packages.redis.io/deb bookworm main" | tee /etc/apt/sources.list.d/redis.list

# 安装 Redis
apt update && apt install -y redis

# 配置 Redis
sed -i 's/^# bind 127.0.0.1 ::1/bind 127.0.0.1 ::1/' /etc/redis/redis.conf
sed -i 's/^# maxmemory <bytes>/maxmemory 256mb/' /etc/redis/redis.conf
sed -i 's/^# maxmemory-policy noeviction/maxmemory-policy allkeys-lru/' /etc/redis/redis.conf

# 启动服务
systemctl restart redis-server && systemctl enable redis-server
```

</TabItem>
<TabItem value="ubuntu" label="Ubuntu 20.04/22.04">

```bash
# 添加 Redis 仓库
curl -fsSL https://packages.redis.io/gpg | gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] \
  https://packages.redis.io/deb $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/redis.list

# 安装 Redis
apt update && apt install -y redis

# 配置 Redis
sed -i 's/^# bind 127.0.0.1/bind 127.0.0.1/' /etc/redis/redis.conf
echo "maxmemory 256mb" >> /etc/redis/redis.conf
echo "maxmemory-policy allkeys-lru" >> /etc/redis/redis.conf

# 启动服务
systemctl restart redis-server && systemctl enable redis-server
```

</TabItem>
<TabItem value="centos" label="CentOS/RHEL">

```bash
# 安装 Redis（从 EPEL）
dnf install -y redis

# 配置 Redis
sed -i 's/^bind 127.0.0.1/bind 127.0.0.1/' /etc/redis/redis.conf
echo "maxmemory 256mb" >> /etc/redis/redis.conf
echo "maxmemory-policy allkeys-lru" >> /etc/redis/redis.conf

# 启动服务
systemctl start redis && systemctl enable redis
```

</TabItem>
<TabItem value="arch" label="Arch Linux">

```bash
# 安装 Redis
pacman -S redis

# 配置 Redis
sed -i 's/^# bind 127.0.0.1/bind 127.0.0.1/' /etc/redis/redis.conf
echo "maxmemory 256mb" >> /etc/redis/redis.conf
echo "maxmemory-policy allkeys-lru" >> /etc/redis/redis.conf

# 启动服务
systemctl start redis && systemctl enable redis
```

</TabItem>
</Tabs>

## 步骤 5：安装 Composer

所有系统通用：

```bash
# 下载并安装 Composer
curl -sS https://getcomposer.org/installer -o /tmp/composer-setup.php
HASH=$(curl -sS https://composer.github.io/installer.sig)
php -r "if (hash_file('SHA384', '/tmp/composer-setup.php') === '$HASH') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('/tmp/composer-setup.php'); } echo PHP_EOL;"
php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer
rm /tmp/composer-setup.php

# 验证安装
composer --version
```

## 步骤 6：部署 SSPanel-UIM

所有系统通用：

```bash
# 创建网站目录
mkdir -p /var/www/sspanel
cd /var/www

# 克隆项目
git clone https://github.com/Anankke/SSPanel-UIM.git sspanel

cd sspanel

# 配置 Git 安全目录（必需）
# 因为后续会将目录权限改为 www-data，需要预先配置避免 Git 报错
git config --global --add safe.directory /var/www/sspanel

# 处理 PHP 扩展依赖（根据 PHP 版本选择）
# 如果使用 PHP 8.4，建议删除 composer.lock 以获得更好的兼容性
if php -v | grep -q "PHP 8.4"; then
    echo "检测到 PHP 8.4，将删除 composer.lock 以优化依赖兼容性"
    rm -f composer.lock
fi

# 安装依赖
echo "开始安装 Composer 依赖..."
composer install --no-dev --optimize-autoloader

# 注意：如果出现 gmp 扩展缺失错误，有两种解决方案：
# 方案1：安装 php-gmp 扩展（标准方案）
#   Debian/Ubuntu: apt install php8.4-gmp
#   CentOS/RHEL: dnf install php-gmp
# 方案2：对于 PHP 8.4，上面已经删除了 composer.lock 会自动跳过不必要的扩展

# 验证安装是否成功
if [ ! -f vendor/autoload.php ]; then
    echo "错误：Composer 依赖安装失败"
    echo "请检查错误信息并重新运行 composer install"
    exit 1
fi

# 复制配置文件
cp config/.config.example.php config/.config.php
cp config/appprofile.example.php config/appprofile.php
```

### 设置目录权限

:::tip 安全最佳实践
只给必要的目录写权限，避免使用 777 权限。以下设置遵循最小权限原则。
:::

<Tabs groupId="os">
<TabItem value="debian" label="Debian 12" default>

```bash
# 设置基础权限
chown -R www-data:www-data /var/www/sspanel
find /var/www/sspanel -type d -exec chmod 755 {} \;
find /var/www/sspanel -type f -exec chmod 644 {} \;

# 设置需要写权限的目录
chmod -R 777 /var/www/sspanel/storage
chmod 775 /var/www/sspanel/public/clients

# 确保 storage 子目录存在且可写
mkdir -p /var/www/sspanel/storage/framework/smarty/{cache,compile}
mkdir -p /var/www/sspanel/storage/framework/twig/cache
chmod -R 777 /var/www/sspanel/storage/framework

# 配置文件权限（初次安装）
chmod 664 /var/www/sspanel/config/.config.php
chmod 664 /var/www/sspanel/config/appprofile.php
```

</TabItem>
<TabItem value="ubuntu" label="Ubuntu 20.04/22.04">

```bash
# 设置基础权限
chown -R www-data:www-data /var/www/sspanel
find /var/www/sspanel -type d -exec chmod 755 {} \;
find /var/www/sspanel -type f -exec chmod 644 {} \;

# 设置需要写权限的目录
chmod -R 777 /var/www/sspanel/storage
chmod 775 /var/www/sspanel/public/clients

# 确保 storage 子目录存在且可写
mkdir -p /var/www/sspanel/storage/framework/smarty/{cache,compile}
mkdir -p /var/www/sspanel/storage/framework/twig/cache
chmod -R 777 /var/www/sspanel/storage/framework

# 配置文件权限（初次安装）
chmod 664 /var/www/sspanel/config/.config.php
chmod 664 /var/www/sspanel/config/appprofile.php
```

</TabItem>
<TabItem value="centos" label="CentOS/RHEL">

```bash
# 设置基础权限
chown -R nginx:nginx /var/www/sspanel
find /var/www/sspanel -type d -exec chmod 755 {} \;
find /var/www/sspanel -type f -exec chmod 644 {} \;

# 设置需要写权限的目录
chmod -R 777 /var/www/sspanel/storage
chmod 775 /var/www/sspanel/public/clients

# 确保 storage 子目录存在且可写
mkdir -p /var/www/sspanel/storage/framework/smarty/{cache,compile}
mkdir -p /var/www/sspanel/storage/framework/twig/cache
chmod -R 777 /var/www/sspanel/storage/framework

# 配置文件权限（初次安装）
chmod 664 /var/www/sspanel/config/.config.php
chmod 664 /var/www/sspanel/config/appprofile.php

```

</TabItem>
<TabItem value="arch" label="Arch Linux">

```bash
# 设置基础权限（注意 Arch 使用 http 用户）
chown -R http:http /var/www/sspanel
find /var/www/sspanel -type d -exec chmod 755 {} \;
find /var/www/sspanel -type f -exec chmod 644 {} \;

# 设置需要写权限的目录
chmod -R 777 /var/www/sspanel/storage
chmod 775 /var/www/sspanel/public/clients

# 确保 storage 子目录存在且可写
mkdir -p /var/www/sspanel/storage/framework/smarty/{cache,compile}
mkdir -p /var/www/sspanel/storage/framework/twig/cache
chmod -R 777 /var/www/sspanel/storage/framework

# 配置文件权限（初次安装）
chmod 664 /var/www/sspanel/config/.config.php
chmod 664 /var/www/sspanel/config/appprofile.php
```

</TabItem>
</Tabs>

:::warning 权限说明
- **755/644**：标准的目录/文件权限，所有者可读写执行，其他用户只读
- **775/664**：组用户也可写，适用于需要 Web 服务器写入的目录/文件
- **777**：storage 目录需要此权限，因为 PHP 进程和定时任务可能以不同用户运行
- **storage/**：存储缓存、编译模板、日志等运行时文件
- **public/clients/**：存储客户端下载文件
- **config/**：仅在初次安装时需要写权限，之后可改为只读
:::


## 步骤 7：配置 SSPanel

编辑配置文件 `/var/www/sspanel/config/.config.php`：

```php
$_ENV['baseUrl'] = 'https://your-domain.com';     // 修改为你的域名

// 数据库配置
$_ENV['db_host'] = '127.0.0.1';
$_ENV['db_database'] = 'sspanel';
$_ENV['db_username'] = 'sspanel';
$_ENV['db_password'] = '上面生成的数据库密码';
```

## 步骤 8：配置 Nginx

<Tabs groupId="os">
<TabItem value="debian" label="Debian 12" default>

```bash
# 创建配置目录
mkdir -p /etc/nginx/conf.d

# 创建站点配置
cat > /etc/nginx/conf.d/sspanel.conf <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com;  # 修改为你的域名
    
    root /var/www/sspanel/public;
    index index.php;
    
    location / {
        try_files $uri /index.php$is_args$args;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
EOF

# 测试配置
nginx -t

# 重载 Nginx
systemctl reload nginx
```

</TabItem>
<TabItem value="ubuntu" label="Ubuntu 20.04/22.04">

```bash
# 创建配置目录
mkdir -p /etc/nginx/conf.d

# 创建站点配置
cat > /etc/nginx/conf.d/sspanel.conf <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com;  # 修改为你的域名
    
    root /var/www/sspanel/public;
    index index.php;
    
    location / {
        try_files $uri /index.php$is_args$args;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
EOF

# 测试配置
nginx -t

# 重载 Nginx
systemctl reload nginx
```

</TabItem>
<TabItem value="centos" label="CentOS/RHEL">

```bash
# 创建站点配置
cat > /etc/nginx/conf.d/sspanel.conf <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com;  # 修改为你的域名
    
    root /var/www/sspanel/public;
    index index.php;
    
    location / {
        try_files $uri /index.php$is_args$args;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/run/php-fpm/www.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
EOF

# 测试配置
nginx -t

# 重载 Nginx
systemctl reload nginx
```

</TabItem>
<TabItem value="arch" label="Arch Linux">

```bash
# 创建配置目录（如果不存在）
mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled

# 创建站点配置
cat > /etc/nginx/sites-available/sspanel <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com;  # 修改为你的域名
    
    root /var/www/sspanel/public;
    index index.php;
    
    location / {
        try_files $uri /index.php$is_args$args;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/run/php-fpm/php-fpm.sock;  # Arch 的 socket 路径
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
EOF

# 创建软链接
ln -sf /etc/nginx/sites-available/sspanel /etc/nginx/sites-enabled/

# 确保主配置文件包含 sites-enabled
grep -q "include /etc/nginx/sites-enabled" /etc/nginx/nginx.conf || \
  sed -i '/^http {/a\    include /etc/nginx/sites-enabled/*;' /etc/nginx/nginx.conf

# 测试配置
nginx -t

# 重载 Nginx
systemctl reload nginx
```

:::note Arch Linux Nginx 配置说明
- PHP-FPM socket 路径是 `/run/php-fpm/php-fpm.sock`
- Arch 的 Nginx 可能没有预设的 sites-available/enabled 目录结构
- 需要手动在 nginx.conf 中添加 include 指令
:::

</TabItem>
</Tabs>

## 步骤 9：初始化数据库

:::warning 重要提示
在执行数据库初始化前，请确保已经完成以下步骤：
1. 已执行 `composer install` 安装依赖
2. 已配置好 `.config.php` 中的数据库连接信息
3. 确保 `vendor/autoload.php` 文件存在

如果遇到 "Failed to open stream: No such file or directory" 错误，说明 Composer 依赖未安装。
:::

所有系统通用：

```bash
cd /var/www/sspanel

# 首先确认 vendor 目录存在
if [ ! -f vendor/autoload.php ]; then
    echo "错误：vendor/autoload.php 不存在，请先运行 composer install"
    composer install --no-dev --optimize-autoloader
fi

# 执行数据库迁移（初始化全新数据库）
php xcat Migration new

# 更新到最新数据库版本
php xcat Migration latest

# 导入配置项
php xcat Tool importSetting

# 创建管理员账户
php xcat Tool createAdmin
```

:::tip 数据库初始化说明
- `Migration new`：仅用于全新安装，要求数据库为空
- `Migration latest`：将数据库更新到最新版本
- `importSetting`：从 config/settings.json 导入所有配置项
- `createAdmin`：交互式创建管理员账户，需要输入邮箱和密码
:::

## 步骤 10：配置定时任务（必需）

SSPanel-UIM 依赖定时任务执行以下功能：
- 处理邮件队列
- 处理用户流量统计
- 清理过期数据
- 执行每日任务

:::warning 重要
不配置定时任务将导致邮件无法发送、流量统计不准确等问题。
:::

### 添加定时任务

```bash
# 编辑 crontab
crontab -e

# 添加以下行（每5分钟执行一次）
*/5 * * * * /usr/bin/php /var/www/sspanel/xcat Cron >> /var/log/sspanel-cron.log 2>&1
```

### 验证定时任务

```bash
# 查看当前定时任务
crontab -l

# 手动运行一次测试
cd /var/www/sspanel && php xcat Cron

# 查看日志输出（如果配置了日志）
tail -f /var/log/sspanel-cron.log
```

:::tip 建议
将定时任务输出重定向到日志文件，便于监控和排查问题。
:::

## 步骤 11：配置 SSL（强烈推荐）

为了保护用户数据安全，强烈建议配置 HTTPS：

<Tabs groupId="os">
<TabItem value="debian" label="Debian 12" default>

```bash
# 安装 Certbot
apt install -y certbot python3-certbot-nginx

# 获取证书
certbot --nginx -d your-domain.com

# 自动续期
systemctl enable certbot-renew.timer
```

</TabItem>
<TabItem value="ubuntu" label="Ubuntu 20.04/22.04">

```bash
# 安装 Certbot
apt install -y certbot python3-certbot-nginx

# 获取证书
certbot --nginx -d your-domain.com

# 自动续期
systemctl enable certbot-renew.timer
```

</TabItem>
<TabItem value="centos" label="CentOS/RHEL">

```bash
# 安装 Certbot
dnf install -y certbot python3-certbot-nginx

# 获取证书
certbot --nginx -d your-domain.com

# 自动续期
systemctl enable certbot-renew.timer
```

</TabItem>
</Tabs>

## 完成安装

恭喜！SSPanel-UIM 已经安装完成。

### 安装检查清单

确保以下服务正常运行：

```bash
# 检查服务状态
systemctl status nginx
systemctl status php8.4-fpm  # 或 php-fpm
systemctl status mariadb
systemctl status redis

# 验证定时任务
crontab -l | grep xcat
```

### 下一步操作

1. **访问站点**：`https://your-domain.com`
2. **登录管理面板**：使用步骤9创建的管理员账户
3. **配置邮件服务**：进入"设置"→"邮件"配置邮件发送
4. **添加节点**：配置代理节点开始服务
5. **查看文档**：遇到问题请参考 [常见问题](/docs/troubleshooting/common-issues)

:::warning 安全提醒
- 请确保已配置 SSL 证书（步骤11）
- 定期备份数据库和配置文件
- 及时更新系统和 SSPanel-UIM
:::

## 故障排除

<details>
<summary>PHP-FPM 连接错误</summary>

检查 PHP-FPM socket 文件位置：

<Tabs groupId="os">
<TabItem value="debian" label="Debian/Ubuntu" default>

```bash
# 查找 socket 文件
ls -la /run/php/php*-fpm.sock

# 确认 PHP-FPM 运行状态
systemctl status php8.4-fpm
```

</TabItem>
<TabItem value="centos" label="CentOS/RHEL">

```bash
# 查找 socket 文件
ls -la /run/php-fpm/www.sock

# 确认 PHP-FPM 运行状态
systemctl status php-fpm
```

</TabItem>
</Tabs>

</details>

<details>
<summary>数据库连接失败</summary>

1. 确认使用 `127.0.0.1` 而不是 `localhost`
2. 检查数据库服务状态：`systemctl status mariadb`
3. 验证用户权限：`mysql -u sspanel -p -h 127.0.0.1 sspanel`

</details>

<details>
<summary>权限拒绝错误</summary>

<Tabs groupId="os">
<TabItem value="debian" label="Debian/Ubuntu" default>

```bash
# 检查当前权限
ls -la /var/www/sspanel/storage

# 重置权限
chown -R www-data:www-data /var/www/sspanel
find /var/www/sspanel -type d -exec chmod 755 {} \;
find /var/www/sspanel -type f -exec chmod 644 {} \;
chmod -R 777 /var/www/sspanel/storage
chmod 775 /var/www/sspanel/public/clients

# 确保 storage 子目录存在
mkdir -p /var/www/sspanel/storage/framework/smarty/{cache,compile}
mkdir -p /var/www/sspanel/storage/framework/twig/cache
chmod -R 777 /var/www/sspanel/storage/framework
```

</TabItem>
<TabItem value="centos" label="CentOS/RHEL">

```bash
# 检查当前权限
ls -la /var/www/sspanel/storage

# 重置权限
chown -R nginx:nginx /var/www/sspanel
find /var/www/sspanel -type d -exec chmod 755 {} \;
find /var/www/sspanel -type f -exec chmod 644 {} \;
chmod -R 777 /var/www/sspanel/storage
chmod 775 /var/www/sspanel/public/clients

# 确保 storage 子目录存在
mkdir -p /var/www/sspanel/storage/framework/smarty/{cache,compile}
mkdir -p /var/www/sspanel/storage/framework/twig/cache
chmod -R 777 /var/www/sspanel/storage/framework

# SELinux 相关
if getenforce | grep -q "Enforcing"; then
    # 设置正确的 SELinux 上下文
    chcon -R -t httpd_sys_rw_content_t /var/www/sspanel/storage
    chcon -t httpd_sys_rw_content_t /var/www/sspanel/public/clients
    chcon -R -t httpd_sys_content_t /var/www/sspanel
fi
```

</TabItem>
</Tabs>

:::info 权限错误原因
- storage 目录需要 777 权限，因为 PHP-FPM 和定时任务可能以不同用户运行
- SELinux 可能阻止写入，需要设置正确的上下文
- 某些子目录可能不存在，需要手动创建
:::

</details>

## 下一步

- [基础配置](../configuration/basic) - 配置站点基本信息
- [邮件配置](../configuration/email) - 设置邮件发送
- [节点配置](../configuration/nodes) - 添加你的第一个节点
- [商店系统](../configuration/shop) - 配置商品和支付

---

:::tip 专业提示
建议在生产环境部署前，先在测试环境完整走一遍流程，确保所有功能正常。
:::