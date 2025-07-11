# 商店系统配置

本文档介绍如何配置 SSPanel-UIM 的商店系统，包括商品类型、支付配置、优惠券等功能。

## 商品类型

SSPanel-UIM 支持三种主要的商品类型，每种类型都有其特定的使用场景和行为。

### 1. 时间流量包（tabp）

时间流量包是最常用的商品类型，同时提供账户有效期和流量。

**特性：**
- 包含固定等级、有效期和流量
- 每个用户同时只能有一个生效的时间流量包订单
- 多个订单按购买顺序依次激活
- 每个 Cron 周期（5分钟）激活一个订单

**配置示例：**
```
商品名称: 月度套餐
商品类型: 时间流量包 (tabp)
有效期: 30 天
流量: 100 GB
价格: 10.00
重复购买: 允许
库存: -1 (无限制)
```

:::info 商品内容字段
时间流量包包含以下参数：
- time: 有效期（天数）
- bandwidth: 流量（GB）  
- class: 用户等级
- class_time: 等级有效期
- node_group: 节点组
- speed_limit: 速率限制（Mbps）
- ip_limit: 设备数限制
:::

### 2. 流量包（bandwidth）

纯流量包只增加用户的可用流量，不延长账户有效期。

**特性：**
- 仅包含流量（GB）
- 可同时购买多个流量包
- 流量累加到用户账户
- 按购买顺序激活

**配置示例：**
```
商品名称: 流量补充包
商品类型: 流量包 (bandwidth)
流量: 50 GB
价格: 5.00
重复购买: 允许
库存: -1 (无限制)
```

### 3. 时间包（time）

时间包用于分离等级时长和流量，提供更灵活的套餐组合。

**特性：**
- 可设置用户等级和等级时长
- 对免费用户和付费用户行为不同
- 仅对当前等级相同的订单激活（免费用户除外）
- 可延长当前等级时长
- 会覆盖用户的速率、设备数等参数

**配置示例：**
```
商品名称: 续期包
商品类型: 时间包 (time)
有效期: 30 天
价格: 3.00
重复购买: 允许
库存: -1 (无限制)
```

## 商品叠加规则

### 商品类型对比

| 特性 | 时间流量包 (tabp) | 流量包 (bandwidth) | 时间包 (time) |
|-----|------------------|-------------------|---------------|
| 重复购买 | 支持 | 支持 | 支持 |
| 套餐叠加 | 排队激活 | 流量累加 | 时长累加 |
| 同时激活 | 1个 | 1个 | 1个 |
| 激活速度 | 每5分钟1个 | 每5分钟1个 | 每5分钟1个 |
| 覆盖参数 | 全部 | 不覆盖 | 部分覆盖 |
| 适用场景 | 主要套餐 | 流量补充 | 灵活组合 |

### 商品叠加行为详解

1. **时间流量包（tabp）**
   - 同时只能有一个生效订单
   - 多个订单按顺序排队激活
   - 每个 Cron 周期（5分钟）激活一个
   - 过期后自动激活下一个排队订单

2. **流量包（bandwidth）**
   - 可同时购买多个
   - 每次 Cron 激活一个订单
   - 流量累加到用户账户
   - 按订单ID顺序激活

3. **时间包（time）**
   - 仅当用户当前等级与时间包等级相同时激活
   - 免费用户（等级0）可直接激活任何时间包
   - 每次 Cron 激活一个订单
   - 延长等级有效期并覆盖速率、设备数等参数

### 商品购买限制

商品可设置以下购买限制：

- **用户等级要求**：指定只有特定等级的用户可购买
- **节点组要求**：限制特定节点组的用户购买
- **新用户限制**：仅允许新注册用户购买

:::tip 使用建议
合理设置购买限制可以实现精细化运营，如新用户专享优惠等。
:::

## 支付网关配置

:::info 重要说明
支付网关配置通过管理面板进行管理，而不是修改配置文件。SSPanel-UIM 通过插件化方式支持多种支付网关。
:::

### 支付网关说明

SSPanel-UIM 通过插件系统支持多种支付网关。具体可用的支付网关请在管理面板的支付设置页面查看。

常见的支付类型包括：
- 传统支付（支付宝、微信等）
- 国际支付（信用卡、PayPal等）
- 加密货币支付
- 聚合支付平台

### 配置方式

1. 登录管理后台
2. 导航到支付设置页面
3. 选择要启用的支付网关
4. 填写相应的配置参数
5. 保存并测试

每个支付网关都有其特定的配置要求，请参考相应支付服务商的文档获取必要的密钥和参数。

## 优惠券系统

### 优惠券类型

系统支持两种优惠券类型：

1. **百分比折扣**
   - 类型选择：百分比
   - 额度填写：20（代表8折）

2. **固定金额折扣**
   - 类型选择：固定金额
   - 额度填写：5.00（减免5元）

### 创建优惠券

在管理面板创建优惠券时，需要填写以下字段：

#### 基本信息
- **优惠码**：唯一识别码（如 SAVE20）
- **优惠码类型**：选择“百分比”或“固定金额”
- **优惠码额度**：折扣数值（百分比或金额）

#### 使用限制
- **可用商品ID**：留空为全部商品，或填写指定商品ID（逗号分隔）
- **每用户使用次数**：负数为不限，正数为具体次数
- **累计使用次数**：负数为不限，正数为具体次数
- **仅限新用户**：选择“启用”或“禁用”

#### 生成方式
- **指定字符**：使用填写的优惠码
- **随机字符**：系统生成随机优惠码
- **指定+随机**：在指定前缀后添加随机字符

#### 过期时间
- 留空表示不限制，或选择具体日期时间

### 优惠券示例

**新用户注册优惠**：
- 优惠码：NEWUSER20
- 类型：百分比
- 额度：20（8折）
- 仅限新用户：启用
- 每用户使用次数：1

**限时减免优惠**：
- 优惠码：KFCVME50
- 类型：固定金额
- 额度：50元
- 累计使用次数：100
- 过期时间：月末

### 优惠券使用说明

1. **折扣计算**
   - 百分比折扣：填 20 表示 8 折（80% 价格）
   - 固定金额：直接减去指定金额

2. **使用限制**
   - 如果指定了商品ID，仅限这些商品使用
   - 新用户限制启用后，老用户无法使用
   - 超过使用次数限制后自动失效

3. **管理功能**
   - 可通过管理面板查看使用统计
   - 支持禁用/启用优惠券
   - 可查看每个优惠券的使用记录

## 订单管理

### 订单状态

订单状态说明：

- `pending_payment`: 等待支付
- `pending_activation`: 待激活（已支付但未处理）
- `activated`: 已激活（商品已发放）
- `expired`: 已过期
- `cancelled`: 已取消

:::tip 订单与账单的区别
- **订单（Order）**：记录商品信息和激活状态
- **账单（Invoice）**：处理支付和财务记录
- 一个订单对应一个账单，但状态独立管理
:::

### 订单处理流程

1. **创建订单**
   - 用户选择商品后生成订单
   - 订单状态为 `pending_payment`
   - 同时生成对应的支付账单

2. **支付处理**
   - 用户通过支付网关或余额支付
   - 账单状态变为 `paid_*`
   - 订单状态变为 `pending_activation`

3. **商品激活**
   - 系统每 5 分钟运行一次 Cron 任务
   - 时间流量包：每个用户每次激活 1 个，按订单ID顺序
   - 流量包：每个用户每次激活 1 个，按订单ID顺序
   - 时间包：每个用户每次激活 1 个，需满足等级条件

4. **超时处理**
   - 24小时未支付的订单自动取消
   - 订单和账单状态都变为 `cancelled`

:::info 账单状态
账单（Invoice）状态包括：
- `unpaid`: 未支付
- `paid_gateway`: 已支付（支付网关）
- `paid_balance`: 已支付（账户余额）
- `paid_admin`: 已支付（管理员）
- `cancelled`: 已取消
- `refunded_balance`: 已退款（账户余额）
:::

:::warning 激活处理说明
- 订单激活通过 Cron 任务自动处理（每5分钟运行）
- 每种商品类型的激活规则不同
- 时间包仅在等级匹配时激活，避免错误覆盖
- 管理员可通过面板手动激活订单
:::

## 库存管理

商品库存设置说明：

- **无限制**：设置为 -1（默认值）
- **限量商品**：设置具体数量
- **售罄**：库存为 0

示例配置：
```
库存: -1      # 无限量供应
库存: 100     # 限量 100 份
库存: 0       # 已售罄，无法购买
```

:::tip 库存管理
每次成功购买后库存自动减 1。可通过管理面板随时调整库存数量。
:::

## 商店页面定制

### 商品状态管理

商品的 `status` 字段控制是否上架：
- **1**：正常销售
- **0**：下架状态

### 销售统计

系统自动统计每个商品的：
- **sale_count**：累计销量
- **create_time**：创建时间
- **update_time**：更新时间

## 财务管理

### 账单类型

账单分为两种类型：
- **product**：商品购买账单
- **topup**：余额充值账单

### 支付方式

账单可通过以下方式支付：
1. **支付网关**：外部支付接口
2. **账户余额**：使用用户余额
3. **管理员**：手动标记支付

## 退款处理

### 退款机制

系统支持将账单退款到用户余额：

1. **可退款的账单状态**
   - 支付网关支付（paid_gateway）
   - 余额支付（paid_balance）  
   - 管理员标记支付（paid_admin）

2. **退款流程**
   - 退款金额返还到用户余额
   - 生成资金变动记录
   - 账单状态更新为 refunded_balance

:::warning 重要说明
- 退款仅支持退到账户余额
- 不支持原支付渠道退回
- 退款后订单状态不会自动变更
:::

## 故障排除

### 支付问题

1. **支付回调失败**
   - 检查回调 URL 是否正确
   - 确认 HTTPS 证书有效
   - 查看支付网关日志

2. **订单未激活**
   - 检查订单状态是否为 pending_activation
   - 确认 Cron 任务正常运行（每5分钟执行）
   - 时间流量包需等待下个 5 分钟周期
   - 时间包需确认用户等级是否匹配
   - 可通过管理面板手动激活

3. **优惠券无法使用**
   - 检查优惠券是否过期
   - 验证使用次数是否超限
   - 确认商品ID限制
   - 检查新用户限制设置

4. **订单超时取消**
   - 订单创建 24 小时后未支付会自动取消
   - 取消后需重新下单
   - 可考虑提醒用户尽快支付

5. **时间包无法激活**
   - 检查用户当前等级是否与时间包等级一致
   - 免费用户（等级0）可激活任何时间包
   - 等级不匹配的时间包订单会保持待激活状态

## 最佳实践

1. **商品设计**
   - 提供多种类型组合
   - 合理设置价格梯度
   - 注意库存管理

2. **支付配置**
   - 测试支付回调
   - 确保 HTTPS 证书有效
   - 设置合理的超时时间

3. **运营策略**
   - 定期推出优惠活动
   - 监控销售数据
   - 优化商品组合