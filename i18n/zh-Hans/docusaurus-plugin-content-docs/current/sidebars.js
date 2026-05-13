/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
module.exports = {
  docs: [
    'intro',
    {
      type: 'category',
      label: '快速上手',
      collapsed: false,
      items: [
        'getting-started/prerequisites',
        'getting-started/quick-start',
      ],
    },
    {
      type: 'category',
      label: '架构',
      items: [
        'architecture/topology-and-flows',
      ],
    },
    {
      type: 'category',
      label: 'Miner CLI',
      items: [
        'miner-cli/overview',
        'miner-cli/commands',
        'miner-cli/configuration',
      ],
    },
    {
      type: 'category',
      label: 'Miner Agent',
      items: [
        'miner-agent/overview',
        'miner-agent/configuration',
        'miner-agent/local-api',
      ],
    },
    {
      type: 'category',
      label: '参考',
      items: [
        'reference/control-plane-contract',
      ],
    },
    {
      type: 'category',
      label: '运维',
      items: [
        'operations/troubleshooting',
        'operations/security',
      ],
    },
  ],
};
