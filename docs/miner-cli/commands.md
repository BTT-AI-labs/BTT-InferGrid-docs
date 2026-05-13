---
title: Miner CLI Commands
sidebar_label: Commands
---

# Miner CLI Commands

The CLI is exposed through the `miner-cli` console entrypoint.

## Host and Runtime Preparation

### `doctor`

Checks whether the host is ready for Docker-based model deployment.

```bash
miner-cli doctor
miner-cli doctor -f qwen72b.yaml
```

Without a config, it performs lightweight host checks. With `-f`, it also validates config-specific fit such as ports and GPU count.

### `toolkit install`

Installs supported host prerequisites that the tool is allowed to manage.

```bash
miner-cli toolkit install
```

It uses distro-family backends for Debian, RHEL, and Arch style systems. Unsupported distributions stop early and print manual installation guidance.

### `toolkit verify`

Verifies host prerequisites for containerized GPU inference.

```bash
miner-cli toolkit verify
miner-cli toolkit verify --smoke-test
```

Use `--smoke-test` to run a GPU container smoke test.

### `runtime prepare`

Prepares and validates the engine-specific runtime environment.

```bash
miner-cli runtime prepare --engine vllm -f qwen72b.yaml
miner-cli runtime prepare --engine vllm -f qwen72b.yaml --smoke-test
miner-cli runtime prepare --engine vllm -f qwen72b.yaml --require-hf-token
```

Useful options:

| Option | Purpose |
| --- | --- |
| `--engine` | Runtime engine to prepare. |
| `-f, --file` | Deployment config file. |
| `--pull / --no-pull` | Pull the runtime image during preparation. |
| `--smoke-test` | Run heavier runtime smoke checks. |
| `--require-hf-token` | Fail if the configured Hugging Face token variable is unset. |

## Deployment

### `init`

Generates a starter YAML config.

```bash
miner-cli init qwen72b \
  --engine vllm \
  --model Qwen/Qwen2.5-72B-Instruct \
  --tp 8 \
  --port 8000
```

Optional arguments include `--image`, `--image-policy`, and `--output`.

### `render`

Renders Compose artifacts without starting the deployment.

```bash
miner-cli render -f qwen72b.yaml
```

### `up`

Creates or updates a deployment and starts containers.

```bash
miner-cli up -f qwen72b.yaml
miner-cli up -f qwen72b.yaml --skip-smoke-test
miner-cli up -f qwen72b.yaml --no-wait
```

By default, `up`:

1. checks whether the configured port is already in use
2. runs a GPU container smoke test
3. runs an engine image startup smoke test
4. writes deployment files
5. pulls images
6. starts Docker Compose
7. waits for `/v1/models` readiness

## Lifecycle

```bash
miner-cli status qwen72b
miner-cli logs qwen72b -f
miner-cli stop qwen72b
miner-cli restart qwen72b
miner-cli rm qwen72b
miner-cli rm qwen72b --purge-files
miner-cli list
```

`rm --purge-files` removes the rendered deployment directory after Docker Compose shuts down the deployment.
