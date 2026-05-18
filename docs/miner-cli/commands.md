---
title: Miner CLI Commands
sidebar_label: Commands
---

# Miner CLI Commands

This document describes all available `miner-cli` commands.

## Preparation Commands

### doctor

Checks whether the host is ready for Docker-based model deployment:

```bash
miner-cli doctor
miner-cli doctor -f qwen72b.yaml
```

- Without config: performs lightweight host checks
- With `-f`: also validates config-specific fit such as ports and GPU count

### toolkit install

Installs supported host dependencies:

```bash
miner-cli toolkit install
```

Supports Debian, RHEL, and Arch style distribution backends. Unsupported distributions stop early and print manual installation guidance.

### toolkit verify

Verifies host prerequisites for containerized GPU inference:

```bash
miner-cli toolkit verify
miner-cli toolkit verify --smoke-test
```

`--smoke-test` runs a GPU container smoke test.

### runtime prepare

Prepares and validates the engine-specific runtime environment:

```bash
miner-cli runtime prepare --engine vllm -f qwen72b.yaml
miner-cli runtime prepare --engine vllm -f qwen72b.yaml --smoke-test
miner-cli runtime prepare --engine vllm -f qwen72b.yaml --require-hf-token
```

**Common options**:

| Option | Purpose |
| --- | --- |
| `--engine` | Runtime engine to prepare |
| `-f, --file` | Deployment config file |
| `--pull / --no-pull` | Whether to pull the runtime image |
| `--smoke-test` | Run heavier runtime checks |
| `--require-hf-token` | Fail if the configured Hugging Face token is unset |

## Deployment Commands

### init

Generates a starter YAML config:

```bash
miner-cli init qwen72b \
  --engine vllm \
  --model Qwen/Qwen2.5-72B-Instruct \
  --tp 8 \
  --port 8000
```

Optional arguments include `--image`, `--image-policy`, and `--output`.

### render

Renders Compose artifacts without starting the deployment:

```bash
miner-cli render -f qwen72b.yaml
```

### up

Creates or updates a deployment and starts containers:

```bash
miner-cli up -f qwen72b.yaml
miner-cli up -f qwen72b.yaml --skip-smoke-test
miner-cli up -f qwen72b.yaml --no-wait
```

By default, `up` validates ports, runs GPU smoke tests, runs engine image startup checks, writes deployment files, pulls images, starts Compose, and waits for `/v1/models` readiness.

## Lifecycle Commands

| Command | Purpose |
| --- | --- |
| `miner-cli status <name>` | View deployment status |
| `miner-cli logs <name> -f` | View logs in real-time |
| `miner-cli stop <name>` | Stop deployment |
| `miner-cli restart <name>` | Restart deployment |
| `miner-cli rm <name>` | Remove deployment containers |
| `miner-cli rm <name> --purge-files` | Remove deployment and clean rendered files |
| `miner-cli list` | List all deployments |

:::tip
`rm --purge-files` removes the rendered deployment directory after Docker Compose shuts down the deployment.
:::

## Related Documentation

- [miner-cli Configuration](./configuration)
- [miner-cli Overview](./overview)
- [Troubleshooting](../operations/troubleshooting)
