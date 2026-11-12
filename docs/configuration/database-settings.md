---
sidebar_position: 5
---

# 数据库配置管理

SSPanel-UIM 使用数据库存储系统配置，所有配置项都保存在 `config` 表中。本文档介绍如何管理和使用这些配置。

## 数据表结构

`config` 表包含以下字段：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `id` | bigint(20) unsigned | 主键，自增 |
| `item` | varchar(255) | 配置项名称（使用下划线命名） |
| `value` | varchar(2048) | 配置项的值 |
| `class` | varchar(16) | 配置分类（默认为空字符串） |
| `is_public` | tinyint(1) unsigned | 是否为公开参数（0或1） |
| `type` | varchar(16) | 值类型：'string'、'int'、'bool'、'array' |
| `default` | varchar(2048) | 默认值 |
| `mark` | varchar(255) | 备注说明 |

### 索引说明
- 主键：`id`
- 普通索引：`item`、`class`、`is_public`

## 配置管理方法

### 获取单个配置项

```php
use App\Models\Config;

// 获取单个配置值，自动进行类型转换
$app_id = Config::obtain('f2f_pay_app_id'); // 返回 string
$enabled = Config::obtain('enable_checkin'); // 返回 bool
$limit = Config::obtain('ticket_limit'); // 返回 int
$gateways = Config::obtain('payment_gateway'); // 返回 array
```

配置项不存在时，`obtain()` 返回空字符串 `''`。

### 获取分类下的所有配置

```php
// 获取 billing 分类下的所有配置
$configs = Config::getClass('billing');
$f2f_pay_app_id = $configs['f2f_pay_app_id'];

// 所有配置值都已自动转换为正确的类型
foreach ($configs as $key => $value) {
    echo "$key: " . gettype($value) . "\n";
}
```

### 获取分类下的配置项列表

```php
// 仅获取配置项名称列表，不包含值
$items = Config::getItemListByClass('billing');
// 返回: ['f2f_pay_app_id', 'f2f_pay_public_key', ...]
```

### 获取所有公开配置

```php
// 获取所有标记为公开的配置项（is_public = 1）
$publicConfigs = Config::getPublicConfig();
```

### 设置配置项

```php
// 设置单个配置（字符串、整数、布尔值）
Config::set('reg_mode', 'close');
Config::set('ticket_limit', 5);
Config::set('enable_checkin', true);

// 设置数组类型的配置（自动 JSON 编码）
Config::set('payment_gateway', ['stripe', 'paypal']);
```

`set()` 只更新已存在的配置项，不会新建。配置项不存在时不报错，同样返回 `true`。

### 检查配置是否存在

```php
// 使用标准的 Eloquent 查询方法
$exists = Config::where('item', 'example_config')->exists();

if ($exists) {
    $value = Config::obtain('example_config');
}
```

## 类型系统

Config 模型会根据 `type` 字段自动进行类型转换：

| type 值 | 存储格式 | 返回类型 | 示例 |
|---------|----------|----------|------|
| `string` | 原始字符串 | string | `"SSPanel"` |
| `int` | 数字字符串 | int | `1000` |
| `bool` | "0" 或 "1" | bool | `true` 或 `false` |
| `array` | JSON 字符串 | array | `["stripe", "paypal"]` |

### 重要提示
- **数组自动处理**：使用 `set()` 方法时，数组会自动进行 JSON 编码；使用 `obtain()` 时用 `json_decode()` 解码，JSON 数组得到 PHP 数组。存成 JSON 对象的值会解码为 stdClass，而 `obtain()` 的返回类型不包含对象，读取时会抛出 `TypeError`，因此 `array` 类型只存 JSON 数组
- **布尔值存储**：布尔值在数据库中存储为字符串 "0" 或 "1"
- **类型转换**：配置项存在时按 `type` 字段转换；不存在时返回 `''`

## 配置分类

SSPanel 使用 `class` 字段对配置进行分类管理，常见的分类包括：

- `billing`: 计费相关配置
- `captcha`: 验证码相关配置  
- `cron`: 定时任务配置
- `db`: 数据库相关配置
- `email`: 邮件相关配置
- `feature`: 功能开关配置
- `im`: 即时通讯配置
- `llm`: AI模型配置
- `ref`: 推荐系统配置
- `reg`: 注册相关配置
- `subscribe`: 订阅相关配置
- `support`: 客服支持配置

## 安全建议

1. **敏感配置保护**：密钥、密码等敏感配置必须设置 `is_public` 为 0
2. **输入验证**：在设置配置前进行适当的验证
3. **权限控制**：仅管理员可以修改配置
4. **审计日志**：建议记录配置变更历史

## 示例：添加新配置项

数据库中的配置项以 `config/settings.json` 为准。`php xcat Tool importSetting` 会添加文件中新增的配置项、按文件更新已有配置项的 `class`，并删除文件中没有的配置项。直接用 SQL 插入的配置项会在下次运行该命令时被删除，每次升级都会运行这个命令。

新增配置项时，在 `config/settings.json` 中加入一项：

```json
{
    "item": "custom_feature_enabled",
    "value": "0",
    "class": "feature",
    "is_public": 0,
    "type": "bool",
    "default": "0",
    "mark": "自定义功能开关"
}
```

然后运行：

```bash
php xcat Tool importSetting
```

## 常见问题

### 1. value 字段长度限制

`value` 和 `default` 字段最大长度为 2048 字符。如需存储更大的配置，考虑：
- 将配置拆分为多个项
- 使用文件存储，配置中仅保存文件路径
- 修改数据库字段类型为 TEXT

### 2. 配置不生效

数据库配置每次读取都直接查询数据库，修改后立即生效。`config/.config.php` 中的配置会被 OPcache 缓存，按[系统优化](../optimization/system-optimization)设置了 `opcache.validate_timestamps=0` 时，修改后需要重启 PHP-FPM。

### 3. 类型错误

确保 `type` 字段与实际存储的值匹配。如果类型不匹配，可能导致意外的行为。

## 注意事项

1. 数据库配置修改后立即生效；`config/.config.php` 修改后是否需要重启 PHP-FPM 见上文
2. 对于重要配置的修改，建议先备份数据库
3. 避免直接修改数据库，尽量通过管理面板或 API 进行配置管理
4. 定期检查未使用的配置项，保持配置表的整洁
5. 大型数组配置要注意 2048 字符的限制