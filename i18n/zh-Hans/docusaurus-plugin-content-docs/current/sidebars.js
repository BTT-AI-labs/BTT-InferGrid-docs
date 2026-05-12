/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'BTT InferGrid',
      collapsed: false,
      items: [
        { type: 'doc', id: 'infergrid/introduction', label: '产品介绍' },
        { type: 'doc', id: 'infergrid/quick-start', label: '快速开始' },
        { type: 'doc', id: 'infergrid/architecture', label: '架构说明' },
        { type: 'doc', id: 'infergrid/api-reference', label: 'API 参考' },
      ],
    },
  ],
}

module.exports = sidebars
