---
title: 快速开始
sidebar_label: 快速开始
---

# 快速开始

这个流程从 `miner-cli` 开始，并通过部署 YAML 把 `miner-agent` 作为 sidecar 加入。

## 1. 生成部署配置

```bash
uv run miner-cli init qwen72b \
  --engine vllm \
  --model Qwen/Qwen2.5-72B-Instruct \
  --tp 8 \
  --port 8000
```

生成文件为 `qwen72b.yaml`。当前 `vllm` 默认镜像是 `vllm/vllm-openai:latest`。CLI 会对浮动 `latest` 标签给出警告，因为上游 CUDA 或驱动要求可能变化。

## 2. 检查主机

```bash
uv run miner-cli doctor
```

如果 Docker 或 NVIDIA 容器支持缺失：

```bash
uv run miner-cli toolkit install
uv run miner-cli toolkit verify --smoke-test
```

## 3. 准备运行时

私有 Hugging Face 模型需要先设置 token：

```bash
export HF_TOKEN=hf_xxx
```

然后验证运行时：

```bash
uv run miner-cli runtime prepare --engine vllm -f qwen72b.yaml --smoke-test
```

## 4. 启用指标和 Agent Sidecar

编辑 YAML，启用 `dcgm_exporter` 和 `miner_client`：

```yaml
dcgm_exporter:
  enabled: true
  gpus: all

miner_client:
  enabled: true
  image: your-registry/miner-agent:latest
  listen_host: 127.0.0.1
  listen_port: 8080
  public_ip: ${your public ip}
  gpus: all
  volumes:
    - /data/minerhome:/root/.miner
  environment:
    LOG_LEVEL: info
    MAIN_API_BASE_URL: https://main-api.example.com
    MINER_TOKEN: replace-me
    MINER_TARGET_MODEL: Qwen/Qwen2.5-72B-Instruct
    MINER_HOME: /root/.miner
    MINER_RUNTIME_TYPE: vllm
```

`/root/.miner` 挂载卷用于持久化节点身份和钱包身份。

## 5. 启动部署

```bash
uv run miner-cli up -f qwen72b.yaml
```

已验证 Docker GPU 访问时可跳过部署阶段 smoke test：

```bash
uv run miner-cli up -f qwen72b.yaml --skip-smoke-test
```

运行时端点：

```text
http://127.0.0.1:8000/v1
```

## 6. 运维命令

```bash
uv run miner-cli status qwen72b
uv run miner-cli logs qwen72b -f
uv run miner-cli stop qwen72b
uv run miner-cli rm qwen72b --purge-files
```

渲染后的部署文件位于：

```text
~/.miner-cli/deployments/<deployment-name>/
```
