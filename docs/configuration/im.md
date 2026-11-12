# 即时通讯（IM）配置

本文档介绍如何配置 SSPanel-UIM 支持的各种即时通讯平台，实现通知推送和用户交互功能。

## 概述

SSPanel-UIM 支持多种即时通讯平台：

- **Telegram** - 功能最完整，支持机器人交互、群组管理等
- **Discord** - 支持消息推送通知
- **Slack** - 支持消息推送通知

## 配置方式

:::info 重要说明
所有 IM 配置都存储在数据库中，需要通过管理面板进行配置，而不是修改配置文件。
:::

### 进入配置页面

1. 登录管理后台
2. 导航到 **设置** → **IM**
3. 在 IM 设置页面配置相应平台

## Telegram 配置

Telegram 是功能最完整的 IM 平台，支持双向交互。

### 功能特性

- 用户账号绑定验证
- 每日签到
- 查看账号信息和订阅
- 节点状态通知
- 群组管理（自动踢出未绑定用户）
- 系统通知推送

### 创建 Telegram 机器人

#### 1. 获取 Bot Token

1. 在 Telegram 中搜索 [@BotFather](https://t.me/botfather)
2. 发送 `/newbot` 创建新机器人
3. 按提示设置机器人名称和用户名
4. 获得 Bot Token，格式如：`123456789:AAFxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### 2. 获取 Chat ID

**个人 Chat ID：**
1. 向你的机器人发送任意消息
2. 访问：`https://api.telegram.org/bot<TOKEN>/getUpdates`
3. 在返回的 JSON 中找到 `"chat":{"id":123456789}`

**群组 Chat ID：**
1. 将机器人加入群组
2. 在群组中发送 `/start@YourBotName`
3. 访问上述 API 地址获取群组 ID（通常为负数）

### 配置项

#### 基础设置

- **Telegram Token**：机器人令牌 (`telegram_token`)，填写后机器人即开始处理消息
- **Telegram 群组 ID**：默认群组 ID (`telegram_chatid`)
- **Bot 用户名**：机器人的用户名，不含 @ (`telegram_bot`)
- **Webhook 验证令牌**：用于 Webhook 安全验证 (`telegram_webhook_token`)，不能手填，点击「Reset Webhook Token」生成
- **启用群组通知**：向群组发送下面的通知 (`enable_telegram_group_notify`)，默认关闭

#### 通知设置

以下通知同时发往已启用群组通知的 Telegram 群组、Discord 频道和 Slack 频道：

- **节点新增通知**：新增节点时发送通知 (`im_bot_group_notify_add_node`)
- **节点更新通知**：节点信息更新时发送通知 (`im_bot_group_notify_update_node`)
- **节点删除通知**：删除节点时发送通知 (`im_bot_group_notify_delete_node`)
- **节点离线通知**：节点离线时发送通知 (`im_bot_group_notify_node_offline`)
- **节点上线通知**：节点恢复时发送通知 (`im_bot_group_notify_node_online`)
- **节点被墙通知**：节点被 GFW 阻断时发送通知 (`im_bot_group_notify_node_gfwed`)
- **节点解封通知**：节点恢复可访问时发送通知 (`im_bot_group_notify_node_ungfwed`)
- **每日任务通知**：定时发送每日报告 (`im_bot_group_notify_daily_job`)
- **公告通知**：新建或更新公告时发送通知 (`im_bot_group_notify_ann_create`、`im_bot_group_notify_ann_update`)

#### 群组管理

- **群组静音模式**：群组内减少机器人回复 (`telegram_group_quiet`)
- **群组仅限绑定用户**：限制只有绑定账号的用户才能留在群组 (`telegram_group_bound_user`)

### Webhook 配置

#### 设置 Webhook URL

SSPanel-UIM 使用 Webhook 方式接收 Telegram 消息。

**Webhook URL 格式：**
```
https://your-domain.com/callback/telegram?token={telegram_webhook_token}
```

其中 `{telegram_webhook_token}` 是在管理面板中生成的 Webhook 验证令牌。

#### 配置说明

Webhook 请求会通过站点的正常路由处理，无需特殊的 Nginx 配置。确保：

1. 站点可以正常通过 HTTPS 访问
2. SSL 证书有效
3. 防火墙允许 Telegram 服务器访问

#### 注册 Webhook

系统不会自动注册 Webhook。依次完成以下步骤：

1. 点击「Reset Webhook Token」生成验证令牌
2. 填写并保存 Telegram Token
3. 点击「Set Webhook」，面板用 `baseUrl` 拼出上面的地址并向 Telegram 注册

也可以手动注册：

```bash
curl -F "url=https://your-domain.com/callback/telegram?token=your_token" \
     https://api.telegram.org/bot<TOKEN>/setWebhook
```

### 机器人命令

#### 用户可用命令

- `/start` - 开始使用机器人
- `/help` - 获取帮助信息
- `/ping` - 获取自己或群组的 ID
- `/menu` - 在私聊中显示功能菜单
- `/unbind` - 解除账号绑定，在私聊中以 `/unbind 邮箱地址` 的形式发送
- `/dc` - 在私聊中查看自己账号所在的 Telegram 数据中心
- `/my` - 查看账号信息
- `/checkin` - 每日签到

#### 绑定流程

1. 用户登录网站，在账号资料页选择 Telegram 并点击 Telegram 登录按钮
2. 在弹出的 Telegram 授权窗口中确认
3. 完成绑定后可以在机器人中使用各项功能

:::info 绑定说明
绑定通过 Telegram Login Widget 在网站上完成，需要先在 @BotFather 中用 `/setdomain` 把站点域名设置给机器人。机器人内的内联键盘只在绑定后使用。
:::

### 消息格式

Telegram 机器人支持 HTML 和 Markdown 格式的消息。

#### HTML 格式示例

```html
<b>粗体文本</b>
<i>斜体文本</i>
<code>代码</code>
<a href="https://sspanel.example.com">链接</a>
```

#### Markdown 格式示例

```markdown
*粗体文本*
_斜体文本_
`代码`
[链接](https://sspanel.example.com)
```

### 测试功能

在管理面板的 IM 设置页面，可以向指定的 Telegram 用户 ID 发送测试消息，验证配置是否正确。

### 故障排除

#### 常见问题

1. **Webhook 无响应**
   - 检查 Webhook URL 是否正确
   - 确认 HTTPS 证书有效
   - 验证 Webhook Token 是否匹配
   - 查看 Nginx 错误日志

2. **命令不工作**
   - 确认机器人已启用
   - 检查 Bot Token 是否正确
   - 查看系统日志中的错误信息

3. **无法绑定账号**
   - 确认机器人功能已启用
   - 检查用户是否已绑定其他账号
   - 查看内联键盘是否正常显示

4. **群组管理失效**
   - 确保机器人是群管理员
   - 检查群组 ID 是否正确
   - 验证机器人权限设置

#### 日志查看

```bash
# 查看 Webhook 请求日志
tail -f /var/log/nginx/access.log | grep callback/telegram
```

## Discord 配置

Discord 主要用于系统通知推送。

### 配置步骤

1. **创建 Discord Bot**
   - 访问 [Discord Developer Portal](https://discord.com/developers/applications)
   - 创建新应用程序
   - 在 Bot 部分创建机器人
   - 获取 Bot Token

2. **配置说明**
   - 在管理面板添加配置项 `discord_bot_token` 并填入 Bot Token

3. **使用方式**
   - 用户在网站上绑定 Discord 账号，并把偏好的联系方式设为 IM 后，通知以 Discord 私信发到这个账号

## Slack 配置

Slack 主要用于团队通知。

### 配置步骤

1. **创建 Slack App**
   - 访问 [Slack API](https://api.slack.com/apps)
   - 创建新的 App
   - 添加 OAuth 权限：`chat:write`
   - 安装到工作区
   - 获取 Bot User OAuth Token

2. **配置说明**
   - 在管理面板添加配置项 `slack_token` 并填入 Bot User OAuth Token

3. **使用方式**
   - 群组通知发到配置的 Slack 频道
   - 用户在网站上绑定 Slack 账号，并把偏好的联系方式设为 IM 后，通知发到这个账号

## 通知使用

### 系统通知

系统可以通过配置的 IM 平台发送以下通知：

- 节点新增、更新、删除通知
- 节点状态变化通知
- 公告通知
- 每日统计报告

### 用户通知

用户绑定了 Telegram、Discord 或 Slack 账号，并把偏好的联系方式设为 IM 时，以下通知发到绑定的账号，否则发到账户邮箱：

- 账户到期提醒
- 流量用尽提醒
- 重要系统公告

## 定时任务

IM 相关功能集成在系统的 Cron 任务中：

```bash
# 系统 Cron 任务（包含节点状态检查、每日通知等）
*/5 * * * * cd /path/to/sspanel && php xcat Cron
```

:::info Cron 任务说明
SSPanel-UIM 的 Cron 任务会自动处理：
- 节点在线状态检查（发送上线/离线通知）
- 每日任务通知（如果启用）
- 其他定期维护任务
:::

## 开发说明

### 通知服务调用

在代码中使用通知服务：

```php
use App\Services\Notification;

// 发送给管理员
Notification::notifyAdmin('标题', '内容');

// 发送给用户
Notification::notifyUser($user, '标题', '内容');
```

### 添加新的 IM 平台

如需支持新的 IM 平台：

1. 在 `src/Services/IM/` 目录创建新类
2. 继承 `Base` 类并实现 `send()` 方法
3. 在数据库配置中添加相应配置项

## 安全建议

1. **保护 Token**：不要在公开场合泄露任何平台的 Token
2. **设置强密码**：Webhook Token 使用随机生成的长字符串
3. **限制权限**：只授予机器人/应用必要的权限
4. **定期更换**：如发现异常及时更换 Token
5. **监控活动**：关注异常的使用模式

## 最佳实践

1. **选择合适的平台**
   - Telegram：适合需要用户交互的场景
   - Discord：适合游戏社区
   - Slack：适合企业团队

2. **通知频率控制**
   - 避免过于频繁的通知
   - 提供用户自主选择通知类型的选项

3. **用户体验**
   - 提供清晰的命令说明
   - 友好的错误提示
   - 快速的响应时间

4. **多平台策略**
   - 可以同时启用多个平台
   - 根据用户群体选择主要平台
   - 提供用户自选通知平台的功能