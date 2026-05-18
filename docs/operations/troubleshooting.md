---
title: Troubleshooting
sidebar_label: Troubleshooting
---

# Troubleshooting

This document describes diagnosis and resolution for common issues.

:::tip Check Next Steps First
When `doctor`, `toolkit verify`, `runtime prepare`, or `up` fails, `miner-cli` prints a `Next steps` block. Treat that as the first remediation path.
:::

## Host GPU Issues

### `nvidia-smi: not found`

**Meaning**: The host NVIDIA driver is not installed, or `nvidia-smi` is not on `PATH`.

**Resolution**:

1. Fix the host driver first
2. Verify:

```bash
nvidia-smi
uv run miner-cli toolkit verify
```

### `NVIDIA-SMI has failed because it couldn't communicate with the NVIDIA driver`

**Meaning**: The driver package may exist, but the kernel module or driver state is broken.

**Resolution**: Repair the driver or module state, confirm `nvidia-smi` works, then retry.

### `gpu inventory: no GPUs detected`

**Meaning**: The driver is running, but no GPU is visible to the host.

**Resolution**: Check PCI visibility, VM passthrough, cloud GPU attachment, or container host configuration.

## Docker GPU Runtime Issues

### `docker nvidia runtime: not configured`

**Meaning**: Docker is installed, but GPU runtime wiring is incomplete.

```bash
uv run miner-cli toolkit install
uv run miner-cli toolkit verify --smoke-test
```

### GPU container smoke test fails

Common errors include `driver version is insufficient` or CUDA version errors.

**Resolution**: Upgrade the host driver, pin an older runtime image, or repair Docker GPU runtime wiring.

## Runtime Issues

### Image Pull Failed

**Meaning**: The image tag may not exist, registry access may be broken, or authentication may be missing.

```bash
uv run miner-cli runtime prepare --engine vllm -f qwen72b.yaml
```

Verify the configured `image:` and registry credentials.

### Engine Container Smoke Test Fails

**Meaning**: The image can be pulled, but the engine container cannot start correctly with GPU access.

```bash
uv run miner-cli runtime prepare --engine vllm -f qwen72b.yaml --smoke-test
```

Check CUDA/driver compatibility, entrypoint behavior, and model access permissions.

### Container Startup Failed

**Meaning**: Compose created the deployment, but the workload container failed to start.

```bash
uv run miner-cli logs qwen72b -f
uv run miner-cli runtime prepare --engine vllm -f qwen72b.yaml --smoke-test
```

### Readiness Timeout

**Meaning**: The container is running, but `/v1/models` did not become healthy within the timeout.

**Resolution**: Check logs for model download progress, GPU memory, model path errors, or authentication failures.

## Agent Issues

### `/readyz` returns `503`

Check the response body:

- `registered=false`: Registration has not succeeded
- `verified=false`: The control plane has not verified this node
- `last_error` is set: Inspect the latest registration or heartbeat failure

```bash
curl http://127.0.0.1:8080/v1/miner/status
curl http://127.0.0.1:8080/v1/miner/identity
```

### Identity changes after restart

**Meaning**: `${MINER_HOME}/config.json` was not persisted.

**Resolution**: Mount a stable host directory into the agent container:

```yaml
volumes:
  - /data/minerhome:/root/.miner
environment:
  MINER_HOME: /root/.miner
```

### Runtime probe errors

Verify that `MINER_VLLM_BASE_URL` points to the runtime service inside the Compose network. Default when deployed through `miner-cli`:

```text
http://<deployment-name>:<port>
```

If DCGM is enabled, verify that `MINER_DCGM_METRICS_URL` points to:

```text
http://dcgm-exporter:9400/metrics
```

## Related Documentation

- [Security and Operations](./security)
- [Miner Agent Local API](../miner-agent/local-api)
- [Miner CLI Commands](../miner-cli/commands)
