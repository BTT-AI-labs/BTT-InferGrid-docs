---
title: API 参考
description: BTT InferGrid 首版 API 参考占位。
---

# API 参考

本页定义 BTT InferGrid API 文档的格式。正式 endpoint 确认后，可以用真实接口替换当前占位内容。

## 鉴权

请求需要包含 bearer token：

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
| `model` | string | 是 | 模型或路由标识。 |
| `input` | string or object | 是 | 推理输入内容。 |
| `metadata` | object | 否 | 可选请求元数据。 |

### 示例

```json
{
  "model": "example-model",
  "input": "Summarize this message.",
  "metadata": {
    "request_id": "demo-001"
  }
}
```

### 响应

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

```json
{
  "error": {
    "code": "invalid_request",
    "message": "The request payload is invalid."
  }
}
```
