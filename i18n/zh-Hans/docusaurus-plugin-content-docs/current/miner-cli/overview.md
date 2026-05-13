---
title: Miner CLI 概览
sidebar_label: 概览
---

# Miner CLI 概览

`miner-cli` 是面向单台 NVIDIA GPU Linux 主机的 Docker 化 LLM 部署助手。

它刻意保持较小范围：

- 不做调度器
- 不做集群控制面
- 不做多租户平台
- 只处理 config 到 Compose 到 container 到 health check 的链路

## 能力

`miner-cli` 可以：

- 检查机器是否具备 GPU 容器运行条件
- 生成起步 YAML 配置
- 渲染 Docker Compose 文件
- 启动 `vllm` 或 `sglang` 容器
- 运行 GPU 和运行时 smoke test
- 等待 `/v1/models` 就绪
- 管理 logs、status、stop、restart、remove、list
- 按配置加入 `dcgm-exporter` 和 `miner-agent` sidecar

## 部署文件位置

部署文件渲染到：

```text
~/.miner-cli/deployments/<name>/
```

| 文件 | 用途 |
| --- | --- |
| `config.yaml` | 源部署配置副本。 |
| `compose.yaml` | 渲染后的 Docker Compose 文件。 |
| `.env` | 包含配置指定的 Hugging Face token 变量。 |

## 支持的 Engine

配置解析接受：

- `vllm`
- `sglang`

README 中说明 V1 当前生产路径聚焦 `vllm`。代码和示例已有 `sglang` 命令渲染，但正式使用前应结合运行时镜像验证。

## 镜像标签策略

生成配置时支持 `stable` 和 `latest` 镜像策略。当前默认镜像：

| Engine | 默认镜像 |
| --- | --- |
| `vllm` | `vllm/vllm-openai:latest` |
| `sglang` | `lmsysorg/sglang:latest` |

当 `vllm` 镜像使用浮动 `latest` 标签时，`miner-cli` 会在 `init`、`runtime prepare` 和 `up` 中提示警告。生产部署建议显式固定 `image:`。
