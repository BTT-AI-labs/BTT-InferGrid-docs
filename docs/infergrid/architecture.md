---
title: Architecture
description: How BTT InferGrid is intended to fit into an application stack.
---

# Architecture

BTT InferGrid is intended to sit between applications and distributed inference capacity. Applications send authenticated inference requests to InferGrid, while InferGrid handles routing, execution, and response delivery through a stable API surface.

## Core Flow

1. The application sends an authenticated request to the InferGrid API.
2. InferGrid validates the request and selects the appropriate inference route.
3. The selected compute provider runs the workload.
4. InferGrid returns the normalized result to the application.
5. Usage data is recorded for observability, billing, and operational review.

## Integration Pattern

For production systems, keep InferGrid access inside trusted backend services. Client applications should call your own backend, and your backend should call InferGrid with server-held credentials.

```text
User App -> Your Backend -> BTT InferGrid -> Distributed Compute
```

## Operational Considerations

- Authentication: store API keys in a secret manager or server environment.
- Reliability: configure retries with backoff for transient failures.
- Observability: log request IDs, model names, latency, and error codes.
- Governance: separate development and production API keys.
- Cost control: set usage budgets and monitor consumption regularly.
