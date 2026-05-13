---
title: 故障排查
sidebar_label: 故障排查
---

# 故障排查

当 `doctor`、`toolkit verify`、`runtime prepare` 或 `up` 失败时，`miner-cli` 会打印 `Next steps`。优先按该区块处理。

## 主机 GPU 问题

### `nvidia-smi: not found`

含义：主机未安装 NVIDIA 驱动，或 `nvidia-smi` 不在 `PATH`。

处理：先修复主机驱动，再运行：

```bash
nvidia-smi
uv run miner-cli toolkit verify
```

### `NVIDIA-SMI has failed because it couldn't communicate with the NVIDIA driver`

含义：驱动包可能存在，但内核模块或驱动状态异常。

处理：修复驱动或模块状态，确认 `nvidia-smi` 可用后重试。

### `gpu inventory: no GPUs detected`

含义：驱动运行中，但主机看不到 GPU。

处理：检查 PCI 可见性、虚拟机透传、云 GPU 挂载或宿主机配置。

## Docker GPU Runtime 问题

### `docker nvidia runtime: not configured`

含义：Docker 已安装，但 GPU runtime wiring 未完成。

```bash
uv run miner-cli toolkit install
uv run miner-cli toolkit verify --smoke-test
```

### GPU 容器 smoke test 失败

常见错误包括 `driver version is insufficient` 或 CUDA 版本错误。

处理：升级主机驱动、固定更旧的运行时镜像，或修复 Docker GPU runtime 配置。

## 运行时问题

### Image Pull Failed

含义：镜像 tag 可能不存在、registry 访问失败或鉴权缺失。

```bash
uv run miner-cli runtime prepare --engine vllm -f qwen72b.yaml
```

检查 `image:` 和 registry 凭证。

### Engine Container Smoke Test 失败

含义：镜像可拉取，但 engine 容器无法用 GPU 正常启动。

```bash
uv run miner-cli runtime prepare --engine vllm -f qwen72b.yaml --smoke-test
```

检查 CUDA/驱动兼容性、entrypoint 和模型访问权限。

### Container Startup Failed

含义：Compose 创建了部署，但 workload 容器启动失败。

```bash
uv run miner-cli logs qwen72b -f
uv run miner-cli runtime prepare --engine vllm -f qwen72b.yaml --smoke-test
```

### Readiness Timeout

含义：容器在运行，但 `/v1/models` 没有在超时时间内健康。

处理：检查日志中的模型下载进度、GPU 显存、模型路径和鉴权问题。

## Agent 问题

### `/readyz` 返回 `503`

查看响应体：

- `registered=false`：注册尚未成功。
- `verified=false`：控制面尚未验证该节点。
- `last_error` 非空：检查最近一次注册或心跳失败。

```bash
curl http://127.0.0.1:8080/v1/miner/status
curl http://127.0.0.1:8080/v1/miner/identity
```

### 重启后身份变化

含义：`${MINER_HOME}/config.json` 未持久化。

处理：将稳定宿主机目录挂载到 agent 容器：

```yaml
volumes:
  - /data/minerhome:/root/.miner
environment:
  MINER_HOME: /root/.miner
```

### Runtime Probe 错误

确认 `MINER_VLLM_BASE_URL` 指向 Compose 网络内的 runtime service。通过 `miner-cli` 部署时默认是：

```text
http://<deployment-name>:<port>
```

启用 DCGM 时，确认 `MINER_DCGM_METRICS_URL` 指向：

```text
http://dcgm-exporter:9400/metrics
```
