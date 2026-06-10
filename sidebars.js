/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
module.exports = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/prerequisites',
        'getting-started/quick-start',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
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
      label: 'Operations',
      items: [
        'operations/troubleshooting',
        'operations/security',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/control-plane-contract',
      ],
    },
  ],
};
