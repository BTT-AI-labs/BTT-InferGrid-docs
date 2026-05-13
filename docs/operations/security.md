---
title: Security and Operations
sidebar_label: Security and Operations
---

# Security and Operations

The V1 miner-side stack is operationally simple, but it handles private node keys, wallet keys, API tokens, model tokens, and local control endpoints.

## Persist and Protect Identity

`miner-agent` stores identity at:

```text
${MINER_HOME}/config.json
```

This file contains private keys. Mount it on persistent storage and limit access to the operator account and the agent container.

Recommended Docker mount:

```yaml
volumes:
  - /data/minerhome:/root/.miner
environment:
  MINER_HOME: /root/.miner
```

The agent attempts to write the directory with `0700` permissions and the file with `0600` permissions.

## Protect Tokens

Sensitive variables include:

- `MINER_TOKEN`
- `HF_TOKEN`
- any runtime `api_key`
- registry credentials used by Docker

Avoid committing deployment YAML files with production secrets. Prefer environment injection or secret management in the deployment environment.

## Do Not Publicly Expose Local Agent APIs

The local agent API includes manual registration, heartbeat, challenge, status, and identity inspection endpoints.

Keep `MINER_HTTP_HOST` bound to `127.0.0.1` unless you have network controls. If you publish the port through Docker, restrict access at the firewall or reverse proxy layer.

## Pin Runtime Images for Reproducibility

Floating `latest` tags can change CUDA, driver, and entrypoint behavior.

For production, set an explicit image tag:

```yaml
image: vllm/vllm-openai:<pinned-version>
```

Then validate with:

```bash
uv run miner-cli runtime prepare --engine vllm -f qwen72b.yaml --smoke-test
```

## Keep Heavy Checks in the Right Place

Use the commands for their intended responsibilities:

| Command | Responsibility |
| --- | --- |
| `doctor` | Lightweight host checks and optional config fit checks. |
| `toolkit verify --smoke-test` | Docker GPU runtime readiness. |
| `runtime prepare` | Engine image and runtime readiness. |
| `up` | Final deployment and startup readiness. |

This keeps failures easier to interpret and avoids treating runtime image issues as host driver issues.
