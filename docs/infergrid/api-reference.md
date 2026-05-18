---
title: API Reference
description: BTT InferGrid API reference documentation.
---

# API Reference

This document defines the request and response format for the BTT InferGrid API. Replace placeholder content with actual interfaces once confirmed.

:::note
Example endpoints and API keys are placeholders. Replace them with actual information from your BTT InferGrid account.
:::

## Authentication

All requests require a bearer token:

```http
Authorization: Bearer <INFERGRID_API_KEY>
```

## Create Inference Request

```http
POST /v1/inference
```

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `model` | string | Yes | Model or routing identifier |
| `input` | string or object | Yes | Inference input content |
| `metadata` | object | No | Optional request metadata |

### Request Example

```json
{
  "model": "example-model",
  "input": "Summarize this message.",
  "metadata": {
    "request_id": "demo-001"
  }
}
```

### Response Example

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

## Error Format

Error responses follow a unified format:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "The request payload is invalid."
  }
}
```

### Common Error Codes

| Error Code | Description |
| --- | --- |
| `invalid_request` | Request format error or missing required fields |
| `unauthorized` | Invalid or expired API key |
| `model_not_found` | Requested model does not exist |
| `rate_limit_exceeded` | Request rate exceeds limit |
| `internal_error` | Server internal error |

## Related Documentation

- [Architecture](./architecture)
- [Quick Start](./quick-start)
