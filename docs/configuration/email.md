---
sidebar_position: 2
title: "邮件配置"
description: "SSPanel-UIM 邮件服务配置指南，支持 SMTP、SendGrid、Mailgun 等多种邮件服务"
keywords: [SSPanel, 邮件配置, SMTP, SendGrid, Mailgun, 邮件服务]
tags: [configuration, email, smtp, mail-service]
---

# 邮件配置

SSPanel-UIM 支持多种邮件发送方式，包括 SMTP、SendGrid、Mailgun、AWS SES 等。邮件配置通过管理面板进行管理。

## 邮件功能用途

在 SSPanel-UIM 中，邮件功能用于：

- 用户注册验证
- 密码重置
- 账单通知
- 流量提醒
- 系统公告
- 工单通知

## 配置方式

:::info 重要说明
邮件配置存储在数据库中，需要通过管理面板进行配置，而不是修改配置文件。
:::

### 进入邮件配置

1. 登录管理后台
2. 导航到 **设置** → **邮件**
3. 在邮件设置页面进行配置

### 配置位置说明

| 配置项 | 存储位置 | 配置方式 |
|--------|----------|----------|
| 邮件驱动（SMTP/SendGrid等） | 数据库 | 管理面板 |
| SMTP 服务器信息 | 数据库 | 管理面板 |
| API 密钥 | 数据库 | 管理面板 |
| 邮件过滤规则 | 配置文件 | config/.config.php |

## 邮件过滤设置

在 `config/.config.php` 中可以设置邮件过滤规则：

```php
// 邮件过滤模式
// 0: 关闭过滤
// 1: 白名单模式（只允许列表中的邮箱）
// 2: 黑名单模式（禁止列表中的邮箱）
$_ENV['mail_filter'] = 0;

// 过滤列表（邮箱域名）
$_ENV['mail_filter_list'] = [
    'gmail.com',       // 白名单示例
    'allowed.org',
];
```

## 支持的邮件服务

SSPanel-UIM 支持以下邮件服务（在管理面板的邮件设置中选择）：

### SMTP 配置

最通用的邮件发送方式，适合大多数场景。

**配置项说明：**
- **SMTP 主机**：邮件服务器地址
- **SMTP 端口**：通常为 25、465（SSL）或 587（TLS）
- **SMTP 用户名**：认证用户名
- **SMTP 密码**：认证密码
- **加密方式**：SSL 或 TLS
- **发件人邮箱**：发送邮件的地址
- **发件人名称**：显示的发件人名称

### SendGrid

专业的邮件发送服务，提供高送达率和详细统计。

**配置项说明：**
- **API Key**：SendGrid API 密钥
- **发件人邮箱**：已验证的发送邮箱
- **发件人名称**：显示名称

### Mailgun

功能强大的邮件 API 服务。

**配置项说明：**
- **API Key**：Mailgun API 密钥
- **域名**：Mailgun 验证的域名
- **发件人邮箱**：发送邮箱地址
- **发件人名称**：显示名称

### AWS SES

Amazon 提供的可扩展邮件服务。

**配置项说明：**
- **Access Key ID**：AWS 访问密钥 ID
- **Access Key Secret**：AWS 访问密钥
- **区域**：SES 服务区域（如 us-east-1）
- **发件人邮箱**：已验证的发送邮箱

### Mailchimp Transactional (Mandrill)

Mailchimp 的事务性邮件服务。

**配置项说明：**
- **API Key**：Mailchimp Transactional API 密钥
- **发件人邮箱**：发送邮箱地址
- **发件人名称**：显示名称

### Postal

开源的邮件投递平台。

**配置项说明：**
- **主机地址**：Postal 服务器地址
- **API Key**：Postal API 密钥
- **发件人邮箱**：发送邮箱地址
- **发件人名称**：显示名称

### Postmark

专注于事务性邮件的服务。

**配置项说明：**
- **API Key**：Postmark Server API Token
- **发件人邮箱**：Postmark Sender Signature
- **Message Stream**：消息流 ID（默认：outbound）

### 阿里云邮件推送

阿里云提供的邮件服务。

**配置项说明：**
- **Access Key ID**：阿里云访问密钥 ID
- **Access Key Secret**：阿里云访问密钥
- **Endpoint**：服务端点（如 dm.ap-southeast-1.aliyuncs.com）
- **账户名称**：发信地址
- **发件人别名**：显示名称

## 邮件相关设置

除了邮件驱动配置外，还有以下相关设置：

### 验证码有效期

- **邮箱验证码有效期**：设置验证码的有效时间（分钟）
- **密码重置有效期**：密码重置链接的有效时间（分钟）

### 请求限制

- **IP 请求限制**：每个 IP 每小时的请求次数限制
- **邮箱请求限制**：每个邮箱每小时的请求次数限制

### 密件抄送

- **SMTP BCC**：所有邮件密送到指定地址（仅 SMTP 驱动支持）

## 测试邮件发送

配置完成后，可以在邮件设置页面使用"发送测试邮件"功能验证配置是否正确。

### 测试步骤

1. 完成邮件驱动配置
2. 点击"保存"按钮
3. 在"测试邮件"部分输入接收地址
4. 点击"发送测试邮件"
5. 检查是否收到测试邮件

:::tip 提示
配置保存后立即生效，无需重启服务。但如果启用了 PHP OPcache，`mail_filter` 配置的更改可能需要重启 PHP-FPM 才能生效。
:::

## 故障排除

### 常见问题

1. **连接超时**
   - 检查服务器是否能访问邮件服务器
   - 确认端口是否被防火墙阻止
   - 验证 SSL/TLS 设置是否正确

2. **认证失败**
   - 检查用户名和密码是否正确
   - Gmail 需要使用应用专用密码
   - 许多邮件服务商需要开启 SMTP 功能或使用授权码

3. **邮件进入垃圾箱**
   - 配置 SPF、DKIM 记录
   - 使用专业邮件服务（SendGrid、Mailgun）
   - 避免使用免费邮箱发送大量邮件

4. **发送频率限制**
   - 检查邮件服务商的发送限制
   - 考虑使用队列系统
   - 升级邮件服务套餐

### 邮件队列机制

SSPanel-UIM 使用数据库队列处理邮件发送：

1. **队列表结构**
   - 邮件先存储在 `email_queue` 表中
   - 包含收件人、主题、模板等信息

2. **定时处理**
   - 需要配置定时任务每5分钟运行一次
   - 队列处理器会批量发送待发邮件

3. **查看队列状态**
   ```sql
   -- 查看待发送邮件数量
   SELECT COUNT(*) FROM email_queue;
   
   -- 查看队列详情
   SELECT * FROM email_queue ORDER BY id DESC LIMIT 10;
   ```

### 日志查看

SSPanel-UIM 的邮件发送情况主要通过以下方式查看：

```bash
# 1. 查看定时任务输出（如果配置了日志重定向）
tail -f /path/to/cron.log

# 2. 查看 PHP 错误日志
tail -f /var/log/php8.4-fpm.log

# 3. 手动运行定时任务查看输出
cd /var/www/sspanel && php xcat Cron
```

:::warning 注意
SSPanel-UIM 默认没有应用级日志文件，邮件发送状态主要通过定时任务的控制台输出查看。建议在 crontab 中配置输出重定向来保存日志。
:::

## 定时任务配置

邮件队列需要配置定时任务才能正常工作：

```bash
# 编辑 crontab
crontab -e

# 添加以下行（每5分钟执行一次）
*/5 * * * * /usr/bin/php /var/www/sspanel/xcat Cron >> /var/log/sspanel-cron.log 2>&1
```

:::tip 建议
将定时任务输出重定向到日志文件，方便查看邮件发送情况和排查问题。
:::

## 最佳实践

1. **使用专业邮件服务**：生产环境建议使用 SendGrid、Mailgun 等专业服务
2. **配置 SPF 和 DKIM**：提高邮件送达率
3. **设置合理的发送频率**：避免被标记为垃圾邮件
4. **定期检查退信**：及时处理无效邮箱
5. **使用邮件模板**：保持邮件格式统一专业
6. **监控队列状态**：定期检查 `email_queue` 表，避免邮件积压
7. **配置日志记录**：在 crontab 中重定向输出到日志文件