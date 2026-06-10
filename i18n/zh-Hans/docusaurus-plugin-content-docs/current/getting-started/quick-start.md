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

启动部署前，检查生成的 YAML，并按第 4 步更新矿工侧字段。

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
  image: bttinfergrid/miner-client:latest
  listen_host: 127.0.0.1
  listen_port: 8080
  public_ip: miner.example.com
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

启动前需要重点修改这些值：

| YAML 字段 | 含义 | 参考值 |
| --- | --- | --- |
| `miner_client.enabled` | 启用带指标能力的 `miner-agent` sidecar。保持为 `true`，否则监控和 agent 服务不会随部署启动。 | `true` |
| `miner_client.image` | Docker Hub 上 `bttinfergrid` 账号下的 miner client 镜像。 | `bttinfergrid/miner-client:latest` |
| `miner_client.public_ip` | gateway 请求 Miner client 的公网访问地址。当前可以是矿工公网 IP，未来可以是矿工自己的域名。 | `203.0.113.10` 或 `miner.example.com` |
| `environment.MAIN_API_BASE_URL` | agent 访问 gateway 或控制面服务的 base URL，用于注册、心跳和挑战流程。 | `https://gateway.example.com` |
| `environment.MINER_TOKEN` | 预留的共享 token 字段。如果 gateway 要求鉴权，使用双方约定的一个值；否则先保留清晰占位值。 | `replace-me` |
| `volumes` | 矿工身份持久化挂载。左侧是宿主机路径，右侧是容器内路径。宿主机侧不要使用 `/root` 下的目录。 | `/data/minerhome:/root/.miner` |

:::warning 持久化身份
`/data/minerhome` 会保存 `${MINER_HOME}/config.json`，其中包含节点和钱包身份材料。宿主机路径不要放在 `/root` 下，并请做好备份和权限限制。
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

启动后检查 agent 状态和身份：

```bash
curl http://127.0.0.1:8080/v1/miner/status
curl http://127.0.0.1:8080/v1/miner/identity
```

identity 接口只返回公开字段。请妥善保存挂载的 miner home 目录，并阅读 [Miner Agent 概览](../miner-agent/overview.md) 了解身份和心跳流程。

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

- [miner-cli 命令参考](../miner-cli/commands.md)
- [miner-cli 配置参考](../miner-cli/configuration.md)
- [Miner Agent 概览](../miner-agent/overview.md)
- [故障排查](../operations/troubleshooting.md)
