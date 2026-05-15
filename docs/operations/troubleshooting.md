---
title: Troubleshooting
sidebar_label: Troubleshooting
---

# Troubleshooting

`miner-cli` prints a `Next steps` block when `doctor`, `toolkit verify`, `runtime prepare`, or `up` fails. Treat that block as the first remediation path.

## Host GPU Issues

### `nvidia-smi: not found`

Meaning: the host NVIDIA driver is not installed or `nvidia-smi` is not on `PATH`.

Action: repair the host driver first, then run:

```bash
nvidia-smi
uv run miner-cli toolkit verify
```

### `NVIDIA-SMI has failed because it couldn't communicate with the NVIDIA driver`

Meaning: the driver package may exist, but the kernel module or driver state is broken.

Action: repair the host driver or module state, confirm `nvidia-smi` works, then retry.

### `gpu inventory: no GPUs detected`

Meaning: the driver is running, but no GPU is visible to the host.

Action: check PCI visibility, VM passthrough, cloud GPU attachment, or container host configuration.

## Docker GPU Runtime Issues

### `docker nvidia runtime: not configured`

Meaning: Docker is installed, but GPU runtime wiring is incomplete.

```bash
uv run miner-cli toolkit install
uv run miner-cli toolkit verify --smoke-test
```

### GPU container smoke test fails

Common messages include `driver version is insufficient` or CUDA version errors.

Action: upgrade the host driver, pin an older runtime image, or repair Docker GPU runtime wiring.

## Runtime Issues

### Image Pull Failed

Meaning: the configured image tag may not exist, registry access may be broken, or authentication may be missing.

```bash
uv run miner-cli runtime prepare --engine vllm -f qwen72b.yaml
```

Verify the configured `image:` and registry credentials.

### Engine Container Smoke Test Fails

Meaning: the image can be pulled, but the engine container cannot start correctly with GPU access.

```bash
uv run miner-cli runtime prepare --engine vllm -f qwen72b.yaml --smoke-test
```

Check CUDA and driver compatibility, engine entrypoint behavior, and model access.

### Container Startup Failed

Meaning: Compose created the deployment, but the workload container did not boot successfully.

```bash
uv run miner-cli logs qwen72b -f
uv run miner-cli runtime prepare --engine vllm -f qwen72b.yaml --smoke-test
```

### Readiness Timeout

Meaning: the container is running, but `/v1/models` did not become healthy within the timeout.

Action: inspect logs for model download progress, GPU memory pressure, model path errors, or authentication failures.

## Agent Issues

### `/readyz` returns `503`

Check the body:

- `registered=false`: registration has not succeeded.
- `verified=false`: the control plane has not verified this node.
- `last_error` set: inspect the latest registration or heartbeat failure.

```bash
curl http://127.0.0.1:8080/v1/miner/status
curl http://127.0.0.1:8080/v1/miner/identity
```

### Identity changes after restart

Meaning: `${MINER_HOME}/config.json` was not persisted.

Action: mount a stable host directory into the agent container:

```yaml
volumes:
  - /data/minerhome:/root/.miner
environment:
  MINER_HOME: /root/.miner
```

### Runtime probe errors

Check that `MINER_VLLM_BASE_URL` points to the runtime service inside the Compose network. When deployed through `miner-cli`, the default is:

```text
http://<deployment-name>:<port>
```

If `dcgm-exporter` is enabled, check that `MINER_DCGM_METRICS_URL` points to:

```text
http://dcgm-exporter:9400/metrics
```
