---
title: Security and Operations
sidebar_label: Security and Operations
---

# Security and Operations

This document describes security best practices and operations checks for the miner-side stack.

:::danger Sensitive Information
The miner-side stack handles private node keys, wallet keys, API tokens, model tokens, and local control endpoints. Special care is required to protect these assets.
:::

## Persist and Protect Identity

`miner-agent` identity file: `${MINER_HOME}/config.json`

This file contains private keys. It must be on persistent storage with access limited to the operator account and agent container.

**Recommended Docker mount**:

```yaml
volumes:
  - /data/minerhome:/root/.miner
environment:
  MINER_HOME: /root/.miner
```

:::note
The agent attempts to write the directory with `0700` permissions and the file with `0600` permissions.
:::

## Protect Tokens

Sensitive variables that need protection:

- `MINER_TOKEN`
- `HF_TOKEN`
- Runtime `api_key`
- Docker registry credentials

:::warning
Avoid committing deployment YAML files with production secrets. Prefer environment injection or secret management in the deployment environment.
:::

## Do Not Publicly Expose Agent Local APIs

The local agent API includes manual registration, heartbeat, challenge, status, and identity inspection endpoints.

Keep `MINER_HTTP_HOST=127.0.0.1` unless you have network controls. If you publish the port through Docker, restrict access at the firewall or reverse proxy layer.

## Pin Runtime Images

Floating `latest` tags can change CUDA, driver, and entrypoint behavior.

For production, explicitly set the image tag:

```yaml
image: vllm/vllm-openai:<pinned-version>
```

Then validate:

```bash
uv run miner-cli runtime prepare --engine vllm -f qwen72b.yaml --smoke-test
```

## Run Checks by Responsibility

| Command | Responsibility |
| --- | --- |
| `doctor` | Lightweight host checks and optional config fit checks |
| `toolkit verify --smoke-test` | Docker GPU runtime readiness |
| `runtime prepare` | Engine image and runtime readiness |
| `up` | Final deployment and startup readiness |

:::tip
Layered responsibility checks make it easier to locate failures and avoid misdiagnosing runtime image issues as host driver problems.
:::

## Related Documentation

- [Troubleshooting](./troubleshooting.md)
- [Miner Agent Configuration](../miner-agent/configuration.md)
- [Miner CLI Configuration](../miner-cli/configuration.md)
