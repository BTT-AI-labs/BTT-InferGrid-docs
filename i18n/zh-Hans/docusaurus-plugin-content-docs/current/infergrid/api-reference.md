---
title: API 参考
description: BTT InferGrid API 参考文档。
---

# API 参考

本文档定义 BTT InferGrid API 的请求和响应格式。正式 endpoint 确认后，可以用真实接口替换当前占位内容。

:::note
示例中的 endpoint 和 API key 均为占位符，请替换为 BTT InferGrid 账户中的正式信息。
:::

## 鉴权

所有请求需要包含 bearer token：

```http
Authorization: Bearer <INFERGRID_API_KEY>
```

## 创建推理请求

```http
POST /v1/inference
```

### 请求体

| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `model` | string | 是 | 模型或路由标识 |
| `input` | string or object | 是 | 推理输入内容 |
| `metadata` | object | 否 | 可选请求元数据 |

### 请求示例

```json
{
  "model": "example-model",
  "input": "Summarize this message.",
  "metadata": {
    "request_id": "demo-001"
  }
}
```

### 响应示例

```json
{
  "id": "infer_123",
  "status": "completed",
  "output": "Example response.",
  "usage": {
    "input_tokens": 12,
    "output_tokens": 4
  }
}
```

## 错误格式

错误响应统一格式：

```json
{
  "error": {
    "code": "invalid_request",
    "message": "The request payload is invalid."
  }
}
```

### 常见错误码

| 错误码 | 说明 |
| --- | --- |
| `invalid_request` | 请求格式错误或缺少必填字段 |
| `unauthorized` | API key 无效或已过期 |
| `model_not_found` | 请求的模型不存在 |
| `rate_limit_exceeded` | 请求频率超出限制 |
| `internal_error` | 服务器内部错误 |

## 相关文档

- [架构说明](./architecture.md)
- [快速开始](./quick-start.md)
