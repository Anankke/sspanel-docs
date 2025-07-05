# 通用订阅配置

本文档介绍 SSPanel-UIM 的通用订阅系统，支持多种客户端格式和自定义规则。

## 订阅系统概述

SSPanel-UIM 提供了灵活的订阅系统，支持主流代理客户端的订阅格式，用户可以通过一个订阅链接在不同客户端中使用。

## 订阅链接格式

### 基础订阅链接

```
https://your-domain.com/sub/{token}/{subtype}
```

其中：
- `{token}`: 用户的唯一订阅令牌
- `{subtype}`: 客户端格式（clash、singbox、v2rayjson 等）

## 支持的订阅格式

SSPanel-UIM 支持多种订阅格式，满足不同客户端的需求。

:::warning 格式启用配置
部分订阅格式需要在配置中启用：
- Shadowsocks 格式需要启用 `$_ENV['enable_ss_sub']`
- V2Ray 格式需要启用 `$_ENV['enable_v2_sub']`
- Trojan 格式需要启用 `$_ENV['enable_trojan_sub']`
:::

### 1. JSON 格式

通用 JSON 格式，包含用户信息和节点列表。

**请求路径：** `/sub/{token}/json`

### 2. Clash 格式

适用于 Clash 系列客户端。

**请求路径：** `/sub/{token}/clash`

**特性：**
- YAML 格式输出
- 自动生成代理组
- 包含分流规则
- 支持故障转移

### 3. SingBox 格式

适用于 sing-box 核心的客户端。

**请求路径：** `/sub/{token}/singbox`

**特性：**
- JSON 格式输出
- 支持最新协议

### 4. V2Ray 格式

适用于 V2Ray 核心的客户端。

**请求路径：** `/sub/{token}/v2ray`

**特性：**
- Base64 编码的 vmess:// 链接
- 需要启用 `$_ENV['enable_v2_sub']`

### 5. V2RayJson 格式

V2Ray 的 JSON 配置格式。

**请求路径：** `/sub/{token}/v2rayjson`

**特性：**
- JSON 格式输出
- 完整的 V2Ray 配置

### 6. Shadowsocks 格式

传统的 Shadowsocks 订阅格式。

**请求路径：** `/sub/{token}/ss`

**特性：**
- Base64 编码的节点信息
- 需要启用 `$_ENV['enable_ss_sub']`

### 7. SIP002 格式

Shadowsocks SIP002 标准格式。

**请求路径：** `/sub/{token}/sip002`

**特性：**
- 符合 SIP002 标准的 ss:// 链接
- 需要启用 `$_ENV['enable_ss_sub']`

### 8. SIP008 格式

Shadowsocks SIP008 JSON 格式。

**请求路径：** `/sub/{token}/sip008`

**特性：**
- JSON 格式输出
- 包含额外节点信息

### 9. Trojan 格式

Trojan 协议订阅格式。

**请求路径：** `/sub/{token}/trojan`

**特性：**
- Base64 编码的 trojan:// 链接
- 需要启用 `$_ENV['enable_trojan_sub']`

## 订阅设置

### 基础配置

在 `config/.config.php` 中配置：

```php
// 订阅设置
$_ENV['Subscribe'] = true;          // 启用订阅功能
$_ENV['subUrl'] = $_ENV['baseUrl']; // 订阅地址
```

:::info 配置说明
- `Subscribe`：控制是否启用订阅功能
- `subUrl`：订阅服务的基础 URL，通常与站点主域名相同
:::

### 订阅令牌管理

用户可以在用户面板中：
1. 查看当前订阅链接
2. 重置订阅令牌
3. 复制订阅链接

## 订阅管理

### 订阅令牌

每个用户都有唯一的订阅令牌（token），可以在用户中心查看和重置。

- 令牌由系统自动生成
- 用户可以随时重置订阅令牌
- 重置后原令牌立即失效

### 节点筛选

订阅内容会根据以下条件自动筛选：

- 用户等级限制
- 节点分组权限
- 节点在线状态
- 流量限制状态

## 订阅响应信息

订阅响应会包含以下 HTTP 头部信息：

### Subscription-Userinfo

包含用户的流量和账户信息：
- `upload`: 已上传流量（字节）
- `download`: 已下载流量（字节）
- `total`: 总流量（字节）
- `expire`: 账户过期时间（Unix 时间戳）

### Content-Type

根据订阅格式返回相应的内容类型：
- Clash: `application/yaml`
- JSON 格式（json、sip008、singbox、v2rayjson）: `application/json`
- 其他格式: `text/plain`

## 访问限制

订阅链接的访问受到速率限制保护：

- 基于 IP 地址的限制（sub_ip）
- 基于订阅令牌的限制（sub_token）

:::info 速率限制
速率限制需要先启用 `$_ENV['enable_rate_limit']` 配置。具体的限制规则在速率限制配置中定义。
:::

## 客户端配置指南

### Clash 配置

1. 打开 Clash 客户端
2. 点击「配置」→「托管配置」
3. 添加订阅链接：`https://your-domain.com/sub/{token}/clash`
4. 设置更新间隔（建议 24 小时）

### V2Ray 配置

1. 打开 V2Ray 客户端
2. 选择「订阅设置」
3. 添加订阅链接：`https://your-domain.com/sub/{token}/v2rayjson`
4. 点击更新订阅

### 通用订阅导入

对于支持通用订阅的客户端：
1. 复制完整订阅链接
2. 在客户端中选择「从 URL 导入」
3. 粘贴链接并确认

## 故障排除

### 订阅无法更新

1. **检查订阅功能状态**
   - 确认 `$_ENV['Subscribe']` 已启用
   - 检查订阅 URL 配置是否正确

2. **验证订阅令牌**
   - 确认令牌有效
   - 尝试重置令牌

3. **域名匹配问题**
   - 订阅请求的 Host 必须与 `$_ENV['subUrl']` 匹配
   - 检查 HTTPS 证书是否有效

4. **速率限制**
   - 可能触发了 IP 或令牌的速率限制
   - 稍后再试

5. **格式不兼容**
   - 确认客户端支持的格式
   - 尝试其他订阅格式

### 节点显示不全

1. **用户权限**
   - 检查用户等级
   - 确认节点权限设置

2. **节点状态**
   - 检查节点是否在线
   - 查看节点配置

3. **流量限制**
   - 检查节点流量限制
   - 节点流量超限会被自动过滤

## 订阅日志

订阅日志功能可以在管理后台的"功能设置"中配置：

### 配置项

- **订阅日志**：启用后系统会记录所有订阅请求
- **订阅日志保留天数**：自动清理超过指定天数的日志（默认 7 天）

### 记录内容

启用订阅日志后，系统会记录：
- 用户 ID
- 订阅类型（clash、v2ray 等）
- 请求 IP 地址
- User-Agent
- 请求时间

### 查看日志

用户可以在用户面板查看自己的订阅日志，了解：
- 订阅被使用的设备和客户端
- 异常的访问记录
- 订阅使用频率

这有助于用户发现订阅链接是否被盗用。

## 最佳实践

1. **使用 HTTPS**：确保订阅链接使用 HTTPS 加密传输
2. **定期重置令牌**：建议用户定期重置订阅令牌以提高安全性
3. **监控异常访问**：通过订阅日志监控异常访问模式
4. **合理设置速率限制**：防止订阅链接被滥用
5. **提供多种格式**：满足不同客户端的需求