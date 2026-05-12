---
title: API Reference
description: Initial API reference placeholder for BTT InferGrid.
---

# API Reference

This page defines the documentation format for BTT InferGrid APIs. Replace placeholder routes with the official API contract when endpoints are confirmed.

## Authentication

Requests should include a bearer token:

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
| `model` | string | Yes | Model or route identifier. |
| `input` | string or object | Yes | Input payload for inference. |
| `metadata` | object | No | Optional request metadata. |

### Example

```json
{
  "model": "example-model",
  "input": "Summarize this message.",
  "metadata": {
    "request_id": "demo-001"
  }
}
```

### Response

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

```json
{
  "error": {
    "code": "invalid_request",
    "message": "The request payload is invalid."
  }
}
```
