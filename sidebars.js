/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'BTT InferGrid',
      collapsed: false,
      items: [
        { type: 'doc', id: 'infergrid/introduction', label: 'Introduction' },
        { type: 'doc', id: 'infergrid/quick-start', label: 'Quick Start' },
        { type: 'doc', id: 'infergrid/architecture', label: 'Architecture' },
        { type: 'doc', id: 'infergrid/api-reference', label: 'API Reference' },
      ],
    },
  ],
}

module.exports = sidebars
