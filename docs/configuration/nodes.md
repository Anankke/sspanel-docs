---
sidebar_position: 3
title: "节点配置"
description: "SSPanel-UIM 节点配置指南，支持 Shadowsocks、V2Ray、Trojan 等多种协议"
keywords: [SSPanel, 节点配置, Shadowsocks, V2Ray, Trojan, 节点管理]
tags: [configuration, nodes, proxy, protocols]
---

# 节点配置

SSPanel-UIM 支持多种代理协议的节点配置。本文将详细介绍如何添加和配置各类节点。

## 支持的节点类型

SSPanel-UIM 当前支持以下节点类型：

| 类型值 | 协议名称 | 说明 |
|-------|---------|------|
| 0 | Shadowsocks | 传统 Shadowsocks 协议 |
| 1 | Shadowsocks2022 | 新版 Shadowsocks 协议 |
| 2 | TUIC | 基于 QUIC 的新协议 |
| 11 | Vmess | V2Ray 的 VMess 协议 |
| 14 | Trojan | Trojan 协议 |
| 15 | Hysteria 2 | 基于 QUIC 的 Hysteria 2 协议 |

VLESS 不是单独的节点类型。在 VMess 节点的自定义配置中开启 `enable_vless` 后，订阅按 VLESS 输出，见下文「VLESS」。

## 添加节点

### 进入节点管理

1. 登录管理后台
2. 导航到 **节点管理** → **节点列表**
3. 点击 **添加节点**

### 基础信息

| 字段 | 说明 | 示例 |
|-----|------|------|
| 名称 | 显示给用户的名称 | 香港节点-01 |
| 连接地址 | 节点域名或 IP | node.example.com |
| 流量倍率 | 流量计算倍率 | 1.0 |
| 接入类型 | 选择协议类型 | Trojan |
| 显示此节点 | 是否向用户显示 | ✓ |

### 自定义配置

每个节点都有一个"自定义配置"字段，使用 JSON 格式配置节点的特定参数。不同的协议类型有不同的配置选项，具体配置参见下方各协议详解部分。

:::info 提示
自定义配置使用可视化 JSON 编辑器，支持代码模式和树形模式切换。
:::

### 动态倍率设置

启用动态流量倍率后，可以配置以下参数：

| 字段 | 说明 | 示例 |
|-----|------|------|
| 启用动态流量倍率 | 开关选项 | ✓ |
| 计算方式 | Logistic 或 Linear | Logistic |
| 最大倍率 | 高峰时段的流量倍率 | 2.0 |
| 最大倍率时间 | 达到最大倍率的时间点（24小时制） | 23 |
| 最小倍率 | 低谷时段的流量倍率 | 0.5 |
| 最小倍率时间 | 达到最小倍率的时间点（24小时制） | 7 |

:::tip 动态倍率说明
- 最大倍率时间不能早于最小倍率时间
- Logistic：使用逻辑斯蒂曲线平滑过渡
- Linear：使用线性计算
:::

### 其他信息

#### 权限设置

| 字段 | 说明 | 示例 |
|-----|------|------|
| 等级 | 限制访问的用户等级（同时影响排序） | 0 |
| 组别 | 节点所属分组 ID | 0 |

#### 流量设置

| 字段 | 说明 | 示例 |
|-----|------|------|
| 可用流量 | 节点总流量限制（GB），0 为不限制 | 0 |
| 流量重置日 | 每月流量重置日期（1-31） | 1 |
| 速率限制 | 节点限速（Mbps），0 为不限制 | 0 |

:::info 节点显示顺序
用户订阅中的节点按以下规则排序：
1. 首先按节点等级（node_class）从小到大排序
2. 同等级节点按名称（name）字母顺序排序
:::

## 端口偏移配置

端口偏移用于实现端口转发场景，让用户连接的端口与节点实际监听的端口不同。

### 工作原理

```json
{
  "offset_port_user": 443,   // 用户连接的端口（订阅中下发）
  "offset_port_node": 8443   // 节点实际监听的端口（WebAPI 告知节点）
}
```

- **offset_port_user**：订阅中告诉用户连接的端口
- **offset_port_node**：通过 WebAPI 告诉节点后端监听的端口；未填 `offset_port_user` 时订阅也使用这个端口，两者都未填时订阅端口为 443
- **中间的端口转发**：需要自行实现（如 iptables、nginx stream 等）

### 协议支持

:::warning 注意
- **Shadowsocks**：不支持端口偏移，始终使用用户分配的端口
- **其他协议**（Shadowsocks2022、TUIC、Vmess、Trojan）：支持端口偏移
:::

### 典型使用场景

**中转机端口转发**
```
用户 → 中转机(443) → 落地机(8443)
配置：offset_port_user: 443, offset_port_node: 8443

实现示例（中转机上）：
iptables -t nat -A PREROUTING -p tcp --dport 443 -j DNAT --to-destination 落地机IP:8443
```

:::tip 实现方式
端口转发可通过以下方式实现：
- **iptables**：适合 Linux 服务器
- **nginx stream**：支持 TCP/UDP 转发
- **socat**：简单的端口转发工具
- **gost**：功能强大的转发工具
:::

## 协议特定配置

不同协议支持不同的自定义配置选项，以下是各协议的详细配置说明。

### Shadowsocks 节点配置

#### 基础 Shadowsocks

自定义配置 JSON：

```json
{
  "plugin": "",           // 插件名称，如 "obfs-server"
  "plugin_option": "",    // 插件参数
  "udp": true            // 是否启用 UDP
}
```

#### Shadowsocks2022

自定义配置 JSON：

```json
{
  "offset_port_user": 443,  // 用户连接端口（可选）
  "offset_port_node": 8443,  // 备用端口（可选）
  "method": "2022-blake3-aes-256-gcm",  // 加密方法
  "server_key": "base64_encoded_key",   // 服务器密钥
  "udp": true,           // 是否启用 UDP
  "uot": false           // UDP over TCP
}
```

生成服务器密钥：
```bash
# 根据加密方法选择密钥长度
openssl rand -base64 16  # 用于 aes-128-gcm
openssl rand -base64 32  # 用于 aes-256-gcm
```

### Vmess 节点配置

自定义配置 JSON：

```json
{
  "offset_port_user": 443,  // 用户连接端口（可选）
  "offset_port_node": 8443,  // 节点监听端口（可选）
  "security": "none",        // 传输层加密：none, tls
  "encryption": "auto",      // 加密方式：auto, aes-128-gcm, chacha20-poly1305
  "network": "tcp",          // 传输协议：tcp, ws, h2, http, grpc, httpupgrade
  "host": "",               // 伪装域名/SNI
  "allow_insecure": false,  // 是否允许不安全连接（TLS 时有效）
  "udp": true               // 是否启用 UDP，仅 Clash 订阅使用
}
```

#### WebSocket 配置

当 `network` 为 `ws` 时，Clash 订阅读取 `ws-opts` 或 `ws_opts`，sing-box、V2Ray JSON 和 V2Ray 订阅读取顶层的 `path`，两处都要填写：

```json
{
  "network": "ws",
  "security": "tls",  // 可选，启用 TLS
  "host": "cdn.example.com",  // SNI（当使用 TLS 时）
  "path": "/ray",
  "ws-opts": {
    "path": "/ray",
    "headers": {
      "Host": "cdn.example.com"
    }
  }
}
```

:::info 注意
`ws-opts`、`h2-opts`、`grpc-opts` 只会原样写入 Clash 订阅，请按 Clash 的格式填写。
:::

#### HTTP/2 配置

当 `network` 为 `h2` 时，可以添加 `h2-opts` 或 `h2_opts`：

```json
{
  "network": "h2",
  "security": "tls",  // H2 需要 TLS
  "host": "cdn.example.com",
  "h2-opts": {
    "host": ["cdn.example.com"],
    "path": "/ray"
  }
}
```

#### gRPC 配置

当 `network` 为 `grpc` 时，Clash 订阅读取 `grpc-opts` 或 `grpc_opts`，其他订阅格式读取顶层的 `servicename`：

```json
{
  "network": "grpc",
  "security": "tls",  // 通常需要 TLS
  "host": "cdn.example.com",
  "servicename": "grpc",
  "grpc-opts": {
    "grpc-service-name": "grpc"  // gRPC 服务名
  }
}
```

### Trojan 节点配置

自定义配置 JSON：

```json
{
  "offset_port_user": 443,  // 用户连接端口（可选）
  "offset_port_node": 8443,  // 节点监听端口（可选）
  "network": "tcp",         // 传输协议：tcp, ws, grpc, httpupgrade
  "host": "cdn.example.com",    // SNI
  "allow_insecure": false,  // 是否允许不安全连接
  "mux": false,            // 是否启用多路复用，仅 Trojan 订阅链接使用
  "udp": true              // 是否启用 UDP，仅 Clash 订阅使用
}
```

#### Trojan WebSocket 配置

当 `network` 为 `ws` 时，`ws-opts` 供 Clash 订阅使用，`path` 供其他订阅格式使用：

```json
{
  "network": "ws",
  "host": "cdn.example.com",
  "path": "/trojan",
  "ws-opts": {
    "path": "/trojan",
    "headers": {
      "Host": "cdn.example.com"
    }
  }
}
```

#### Trojan gRPC 配置

当 `network` 为 `grpc` 时，`grpc-opts` 供 Clash 订阅使用，`servicename` 供其他订阅格式使用：

```json
{
  "network": "grpc",
  "host": "cdn.example.com",
  "servicename": "trojan-grpc",
  "grpc-opts": {
    "grpc-service-name": "trojan-grpc"
  }
}
```

### TUIC 节点配置

自定义配置 JSON：

```json
{
  "offset_port_user": 443,  // 用户连接端口（可选）
  "offset_port_node": 8443,  // 节点监听端口（可选）
  "host": "cdn.example.com",              // SNI
  "congestion_control": "bbr",        // 拥塞控制算法
  "allow_insecure": false             // 是否允许不安全连接，仅 sing-box 订阅使用
}
```

:::info TUIC 支持
TUIC 节点只出现在 sing-box 订阅和 Clash 订阅中，Clash 需要使用 Clash.Meta 内核。两者都按 TUIC v5 生成。
:::

### VLESS

在 VMess 节点的自定义配置中加入：

```json
{
  "enable_vless": "1",          // 写字符串 "1"，面板和 XrayR 都认
  "flow": "",                   // 可选，如 xtls-rprx-vision
  "enable_reality": true,       // 可选，开启 REALITY
  "reality-opts": {
    "private_key": "节点的 X25519 私钥",
    "server_names": ["www.example.com"],
    "short_ids": [""]
  }
}
```

- 开启 REALITY 时，面板从私钥推出公钥写进订阅，需要 PHP 的 sodium 扩展，缺少时该节点不出现在订阅中
- `enable_reality` 与 `security` 互相矛盾的组合在保存时会被拒绝
- 节点后端是 Xray-core 26.9 及以上版本时，在自定义配置中加 `"reality_x25519mlkem768": true`，Clash 订阅才能连上；旧版本后端不要加
- 2026 年 11 月实测：同一个 Xray-core 26.10 后端、同一份节点配置，mihomo v1.19.34 能连通，sing-box 1.14.4 的 REALITY 连接不通；sing-box 1.14.4 连 XrayR v0.9.4 能通。面板没有对应的配置项
- V2Ray JSON 订阅不包含 VLESS 节点；`network` 为 `xhttp` 的节点不进 sing-box 订阅

### Hysteria2 节点配置

节点类型选 Hysteria 2 后，自定义配置会自动填入以下模板：

```json
{
  "offset_port_node": "443",
  "offset_port_user": "443",
  "host": "",
  "allow_insecure": false,
  "hysteria2": {
    "version": 2,
    "udpIdleTimeout": 60,
    "masquerade": {"type": "404"},
    "finalmask": {
      "udp": [],
      "quicParams": {"congestion": "bbr"}
    },
    "portHopping": {"enabled": false, "autoConfigureFirewall": false, "ports": ""}
  }
}
```

- 用户以自己的 UUID 作为 Hysteria2 密码
- 端口跳跃由 `portHopping.enabled` 开关，必须写布尔值；面板不接受旧写法 `enable`，`ports` 非空也不会自动开启
- 在 `finalmask.udp` 中加入 `{"type": "salamander", "settings": {"password": "混淆密码"}}` 即开启 salamander 混淆
- `finalmask.quicParams` 中的 `brutalUp`、`brutalDown` 作为带宽写进订阅
- 自定义配置缺少 `hysteria2` 对象时，该节点不出现在订阅中
- Hysteria2 节点出现在 Clash、sing-box、V2Ray 订阅和 `/hysteria2` 订阅中，不出现在 V2Ray JSON 订阅中

## 节点监控

### 在线状态检测

SSPanel-UIM 通过心跳机制检测节点状态：
- 心跳超过 600 秒判定为离线
- 节点后端每次成功请求 `GET /mod_mu/users` 时，面板更新该节点的心跳时间

### 离线检测配置

在 `config/.config.php` 中：

```php
// 启用离线检测
$_ENV['enable_detect_offline'] = true;
```

## 节点管理功能

### 批量操作

- **复制节点**：快速创建相似配置的节点
- **重置密码**：重新生成 32 位随机字符的节点密码，当前 WebAPI 认证不使用节点密码
- **重置流量**：清零节点已使用流量

### 节点通知

进行以下操作时，系统会向已配置的 Telegram、Discord、Slack 群组发送通知，每项可在后台 IM 设置中单独开关，默认只开启创建节点的通知：
- 创建新节点
- 更新节点信息
- 删除节点

### IP 自动更新

系统会自动通过 DNS 解析更新节点 IP 地址，确保域名变更时节点配置保持正确。

## 节点后端配置

### 节点后端

面板不包含节点后端。节点服务器上要运行一个支持 SSPanel-UIM WebAPI 的后端程序，WebAPI 即面板的 `/mod_mu` 接口：

- **XrayR**：面板类型选 `SSpanel`。XrayR 上游仓库已于 2026 年 7 月清空并标注「项目已废弃」，最后一个发行版是 2024 年 7 月的 v0.9.4，不支持 Hysteria2。Hysteria2 节点需要 HoshinoNeko/XrayR 分支的 v0.9.6 及以上版本。上游 v0.9.4 要求自定义配置里的 `allow_insecure`、`offset_port_node` 写成字符串，例如 `"allow_insecure": "1"`、`"offset_port_node": "8443"`，写成布尔值或数字会解析失败并继续使用旧配置，面板保存时不会提示。
- **soga**：闭源，对接类型选 `sspanel`。

V2bX、v2node、Xboard-Node、ppanel-node 只支持 V2Board、Xboard 或 PPanel 的接口，不能对接 SSPanel-UIM。

### WebAPI 认证

后端请求 `/mod_mu` 接口时用 `key` 参数携带 `muKey`。下列条件任一不满足，面板都返回 401 `Invalid request.`：

- `$_ENV['webAPI']` 为 `true`
- `key` 等于 `$_ENV['muKey']`
- `https://` 加上请求的 Host 头，与 `$_ENV['webAPIUrl']` 完全相同，`webAPIUrl` 默认等于 `baseUrl`。后端里填写的面板地址，域名和端口都要与 `webAPIUrl` 一致
- `checkNodeIp` 为 `true` 时，请求来源 IP 必须是某个节点的 IPv4 或 IPv6 地址，`127.0.0.1` 和 `::1` 不受此限制

在 `config/.config.php` 中：

```php
$_ENV['webAPI'] = true;
$_ENV['webAPIUrl'] = $_ENV['baseUrl'];
// WebAPI 密钥，务必改成随机字符串
$_ENV['muKey'] = 'ChangeToRandomString';
// 是否验证节点 IP
$_ENV['checkNodeIp'] = true;
```


## 其他配置说明

### 通用配置项

#### UDP 支持

`udp` 只在 Clash 订阅的 Shadowsocks、Shadowsocks 2022、VMess、Trojan 节点中生效：

```json
{
  "udp": true  // 默认为 true
}
```

#### 多路复用（Mux）

`mux` 只作为 `trojan://` 链接的 `mux` 参数写入 Trojan 订阅，其他订阅格式不读取：

```json
{
  "mux": false  // 默认为 false，建议保持关闭
}
```

### 配置兼容性

:::tip 配置格式
- SSPanel-UIM 支持下划线和连字符两种格式：`ws_opts` 和 `ws-opts`
- `ws-opts`、`h2-opts`、`http-opts`、`grpc-opts` 原样写入 Clash 订阅；其他订阅格式只读取 `path`、`host`、`servicename` 等顶层字段
- 旧版格式（如 `header.type`）仍然兼容
:::

## 高级配置

### 传统配置格式兼容

SSPanel-UIM 兼容一些旧版配置格式：

```json
{
  "header": {
    "type": "ws",  // 等同于 network
    "request": {
      "headers": {
        "Host": ["example.com"]  // 等同于 host
      }
    }
  }
}
```

### 完整配置示例

#### Vmess + WebSocket + TLS

```json
{
  "offset_port_user": 443,
  "offset_port_node": 8443,
  "network": "ws",
  "security": "tls",
  "host": "cdn.example.com",
  "ws-opts": {
    "path": "/vmess",
    "headers": {
      "Host": "cdn.example.com"
    }
  },
  "allow_insecure": false,
  "udp": true
}
```

#### Trojan + gRPC + TLS

```json
{
  "offset_port_user": 443,
  "offset_port_node": 8443,
  "network": "grpc",
  "host": "cdn.example.com",
  "grpc-opts": {
    "grpc-service-name": "trojan"
  },
  "allow_insecure": false,
  "udp": true
}
```

## 性能优化建议

### 系统优化

编辑 `/etc/sysctl.conf`：

```bash
# TCP BBR
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr

# 开启 TCP Fast Open
net.ipv4.tcp_fastopen = 3

# 连接数优化
net.core.somaxconn = 32768
net.ipv4.tcp_max_syn_backlog = 8192
```

应用设置：
```bash
sysctl -p
```


## 故障排查

### 节点离线

1. 检查节点后端是否正常运行
2. 验证节点密码是否正确
3. 检查防火墙规则
4. 查看节点心跳时间

### 流量统计异常

1. 检查流量倍率设置
2. 验证动态倍率配置
3. 查看流量重置日期

### 用户无法连接

1. 确认用户等级满足节点要求
2. 检查节点分组权限
3. 验证节点状态（是否隐藏）
4. 查看速度限制设置
5. 检查端口偏移计算是否正确
6. 验证自定义配置 JSON 格式

### 配置不生效

1. **检查 JSON 格式**
   - 使用在线 JSON 验证工具
   - 确保没有语法错误
   
2. **重启节点服务**
   - 配置更改后需要重启节点后端
   
3. **查看日志**
   - 检查节点后端日志
   - 查看面板错误日志

## 最佳实践

1. **合理设置流量倍率**：根据节点成本和质量调整
2. **使用节点分组**：方便管理不同等级的节点
3. **定期监控节点状态**：及时发现和处理问题
4. **保护节点密码**：定期更换，避免泄露
5. **优化节点配置**：根据实际使用情况调整参数