---
title: 快速开始
description: 完成第一次 BTT InferGrid 请求。
---

# 快速开始

本指南展示 InferGrid 首次接入的大致形态。请把示例里的 endpoint 和 API key 替换成 BTT InferGrid 账户中的正式信息。

## 前置条件

- 一个 BTT InferGrid 账户
- 拥有推理权限的 API key
- 可以发送 HTTPS 请求的运行环境

## 配置环境变量

```bash
export INFERGRID_API_KEY="your_api_key"
export INFERGRID_BASE_URL="https://api.example.com/v1"
```

## 发送请求

```bash
curl "$INFERGRID_BASE_URL/inference" \
  -H "Authorization: Bearer $INFERGRID_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "example-model",
    "input": "用一句话解释分布式 AI 推理。"
  }'
```

## 下一步

:::tip
- 设计生产接入前，先阅读[架构说明](./architecture.md)
- 在应用里加入重试、超时和用量日志
- API key 应保存在服务端，避免暴露在浏览器或移动端客户端里
:::

## 相关文档

- [架构说明](./architecture.md)
- [API 参考](./api-reference.md)
