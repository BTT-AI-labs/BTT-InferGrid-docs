---
title: 安全与运维
sidebar_label: 安全与运维
---

# 安全与运维

V1 矿工侧栈较简单，但会处理节点私钥、钱包私钥、API token、模型 token 和本地控制端点。

## 持久化并保护身份

`miner-agent` 身份文件：

```text
${MINER_HOME}/config.json
```

该文件包含私钥。请放在持久化存储上，并限制宿主机账号和容器访问权限。

推荐挂载：

```yaml
volumes:
  - /data/minerhome:/root/.miner
environment:
  MINER_HOME: /root/.miner
```

agent 会尽力把目录权限设为 `0700`，文件权限设为 `0600`。

## 保护 Token

敏感变量包括：

- `MINER_TOKEN`
- `HF_TOKEN`
- 运行时 `api_key`
- Docker registry 凭证

避免把生产密钥提交到部署 YAML。优先使用环境注入或部署环境的 secret 管理。

## 不要公开暴露 Agent 本地 API

本地 API 包含手动注册、心跳、挑战、状态和身份检查端点。

除非已有网络控制，否则保持 `MINER_HTTP_HOST=127.0.0.1`。如果通过 Docker 发布端口，应在防火墙或反向代理层限制访问。

## 固定运行时镜像

浮动 `latest` 标签可能改变 CUDA、驱动和 entrypoint 行为。

生产建议显式设置镜像 tag：

```yaml
image: vllm/vllm-openai:<pinned-version>
```

并验证：

```bash
uv run miner-cli runtime prepare --engine vllm -f qwen72b.yaml --smoke-test
```

## 按职责运行检查

| 命令 | 职责 |
| --- | --- |
| `doctor` | 轻量主机检查和可选配置适配检查。 |
| `toolkit verify --smoke-test` | Docker GPU runtime 就绪。 |
| `runtime prepare` | Engine 镜像和运行时就绪。 |
| `up` | 最终部署和启动就绪。 |

这样更容易定位失败，不会把运行时镜像问题误判为主机驱动问题。
