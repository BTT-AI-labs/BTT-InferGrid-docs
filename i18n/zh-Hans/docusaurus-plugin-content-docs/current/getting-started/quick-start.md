---
title: 快速开始
sidebar_label: 快速开始
---

# 快速开始

本文档展示从 `miner-cli` 开始到完成部署的完整流程。

## 流程概览

1. 生成部署配置
2. 检查主机
3. 准备运行时
4. 启用指标和 Agent Sidecar
5. 启动部署
6. 运维命令

## 1. 生成部署配置

```bash
uv run miner-cli init qwen72b \
  --engine vllm \
  --model Qwen/Qwen2.5-72B-Instruct \
  --tp 8 \
  --port 8000
```

生成文件为 `qwen72b.yaml`。当前 `vllm` 默认镜像是 `vllm/vllm-openai:latest`。

:::warning 浮动标签
CLI 会对浮动 `latest` 标签给出警告，因为上游 CUDA 或驱动要求可能变化。生产环境建议固定镜像版本。
:::

## 2. 检查主机

```bash
uv run miner-cli doctor
```

如果 Docker 或 NVIDIA 容器支持缺失：

```bash
# 安装工具
uv run miner-cli toolkit install

# 验证安装
uv run miner-cli toolkit verify --smoke-test
```

## 3. 准备运行时

私有 Hugging Face 模型需要先设置 token：

```bash
export HF_TOKEN=hf_xxx
```

验证运行时：

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

:::tip
`/root/.miner` 挂载卷用于持久化节点身份和钱包身份。
:::

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

| 命令 | 用途 |
| --- | --- |
| `miner-cli status qwen72b` | 查看部署状态 |
| `miner-cli logs qwen72b -f` | 实时查看日志 |
| `miner-cli stop qwen72b` | 停止部署 |
| `miner-cli rm qwen72b --purge-files` | 删除部署并清理文件 |

渲染后的部署文件位于：

```text
~/.miner-cli/deployments/<deployment-name>/
```

## 相关文档

- [miner-cli 命令参考](../miner-cli/commands)
- [miner-cli 配置参考](../miner-cli/configuration)
- [故障排查](../operations/troubleshooting)
