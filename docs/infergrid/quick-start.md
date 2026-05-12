---
title: Quick Start
description: Make your first BTT InferGrid request.
---

# Quick Start

This guide shows the intended shape of a first InferGrid integration. Replace the placeholder endpoint and API key values with the official values from your BTT InferGrid account.

## Prerequisites

- A BTT InferGrid account
- An API key with inference permissions
- A runtime that can send HTTPS requests

## Configure Your Environment

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

- Review the architecture guide before designing a production integration.
- Add retries, request timeouts, and usage logging in your application.
- Keep API keys on the server side and avoid exposing them in browsers or mobile clients.
