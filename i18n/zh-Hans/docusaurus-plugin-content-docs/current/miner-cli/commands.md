---
title: Miner CLI 命令
sidebar_label: 命令
---

# Miner CLI 命令

本文档描述 `miner-cli` 的所有可用命令。

## 准备命令

### doctor

检查主机是否适合 Docker 化模型部署：

```bash
miner-cli doctor
miner-cli doctor -f qwen72b.yaml
```

- 不带配置：执行轻量主机检查
- 带 `-f`：还会检查端口、GPU 数与配置适配等内容

### toolkit install

安装工具允许管理的主机依赖：

```bash
miner-cli toolkit install
```

支持 Debian、RHEL、Arch 风格发行版后端。不支持的发行版会提前停止并打印手动安装指引。

### toolkit verify

验证容器化 GPU 推理的主机依赖：

```bash
miner-cli toolkit verify
miner-cli toolkit verify --smoke-test
```

`--smoke-test` 会运行 GPU 容器 smoke test。

### runtime prepare

准备并验证 engine 运行时环境：

```bash
miner-cli runtime prepare --engine vllm -f qwen72b.yaml
miner-cli runtime prepare --engine vllm -f qwen72b.yaml --smoke-test
miner-cli runtime prepare --engine vllm -f qwen72b.yaml --require-hf-token
```

**常用选项**：

| 选项 | 用途 |
| --- | --- |
| `--engine` | 要准备的运行时 engine |
| `-f, --file` | 部署配置文件 |
| `--pull / --no-pull` | 是否拉取运行时镜像 |
| `--smoke-test` | 运行更重的运行时检查 |
| `--require-hf-token` | 配置指定的 Hugging Face token 未设置时失败 |

## 部署命令

### init

生成起步 YAML 配置：

```bash
miner-cli init qwen72b \
  --engine vllm \
  --model Qwen/Qwen2.5-72B-Instruct \
  --tp 8 \
  --port 8000
```

可选参数包括 `--image`、`--image-policy` 和 `--output`。

### render

只渲染 Compose 文件，不启动部署：

```bash
miner-cli render -f qwen72b.yaml
```

### up

创建或更新部署并启动容器：

```bash
miner-cli up -f qwen72b.yaml
miner-cli up -f qwen72b.yaml --skip-smoke-test
miner-cli up -f qwen72b.yaml --no-wait
```

默认情况下，`up` 会检查端口、运行 GPU smoke test、运行 engine 镜像启动检查、写入部署文件、拉取镜像、启动 Compose，并等待 `/v1/models` 就绪。

## 生命周期命令

| 命令 | 用途 |
| --- | --- |
| `miner-cli status <name>` | 查看部署状态 |
| `miner-cli logs <name> -f` | 实时查看日志 |
| `miner-cli stop <name>` | 停止部署 |
| `miner-cli restart <name>` | 重启部署 |
| `miner-cli rm <name>` | 删除部署容器 |
| `miner-cli rm <name> --purge-files` | 删除部署并清理渲染文件 |
| `miner-cli list` | 列出所有部署 |

:::tip
`rm --purge-files` 会在 Compose 停止部署后删除渲染出的部署目录。
:::

## 相关文档

- [miner-cli 配置](./configuration.md)
- [miner-cli 概览](./overview.md)
- [故障排查](../operations/troubleshooting.md)
