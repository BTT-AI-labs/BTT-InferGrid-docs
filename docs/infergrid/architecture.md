---
title: Architecture
description: How BTT InferGrid integrates into your application system.
---

# Architecture

This document describes the positioning and integration approach of BTT InferGrid in application systems.

## Core Positioning

BTT InferGrid sits between **applications** and **distributed inference compute**:

1. Application sends an authenticated inference request to InferGrid
2. InferGrid validates the request and selects the appropriate inference route
3. Selected compute resources execute the inference workload
4. InferGrid returns standardized results to the application
5. System records usage data for observability, billing, and operational analysis

## Integration Pattern

For production environments, place InferGrid access behind a trusted backend service. Client applications access your backend, which uses server credentials to call InferGrid:

```text
User Application -> Your Backend -> BTT InferGrid -> Distributed Compute
```

## Operations Considerations

:::warning Security Recommendations
- **Authentication**: API keys should be stored in a key management system or server environment variables
- **Access Governance**: Differentiate API keys between development and production environments
:::

:::tip Reliability Recommendations
- **Retry Strategy**: Configure retry with backoff for transient errors
- **Observability**: Log request ID, model name, latency, and error codes
- **Cost Control**: Set usage budgets and review spending regularly
:::

## Related Documentation

- [API Reference](./api-reference)
- [Quick Start](./quick-start)
