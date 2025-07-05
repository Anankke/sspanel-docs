// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  docs: [
    'intro',
    {
      type: 'category',
      label: '安装部署',
      items: [
        'installation/quick-install',
        'installation/manual-install',
      ],
    },
    {
      type: 'category',
      label: '配置指南',
      items: [
        'configuration/basic',
        'configuration/email',
        'configuration/nodes',
        'configuration/shop',
        'configuration/subscription',
        'configuration/im',
      ],
    },
    {
      type: 'category',
      label: '性能优化',
      items: [
        'optimization/system-optimization',
      ],
    },
    {
      type: 'category',
      label: '故障排除',
      items: [
        'troubleshooting/common-issues',
      ],
    },
  ],
};

export default sidebars;
