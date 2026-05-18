---
title: Quick Start
description: Complete your first BTT InferGrid request.
---

# Quick Start

This guide shows the general shape of first-time InferGrid integration. Replace the example endpoint and API key with actual information from your BTT InferGrid account.

## Prerequisites

- A BTT InferGrid account
- An API key with inference permissions
- An environment that can send HTTPS requests

## Configure Environment Variables

```bash
export INFERGRID_API_KEY="your_api_key"
export INFERGRID_BASE_URL="https://api.example.com/v1"
```

## Send a Request

```bash
curl "$INFERGRID_BASE_URL/inference" \
  -H "Authorization: Bearer $INFERGRID_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "example-model",
    "input": "Explain distributed AI inference in one sentence."
  }'
```

## Next Steps

:::tip
- Before designing production integration, read the [Architecture](./architecture) guide
- Add retry, timeout, and usage logging to your application
- Store API keys on the server side; avoid exposing them in browser or mobile clients
:::

## Related Documentation

- [Architecture](./architecture)
- [API Reference](./api-reference)
