// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'SSPanel-Docs',
  tagline: 'Across the Great Wall we can reach every corner in the world',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://docs.sspanel.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Anankke', // Usually your GitHub org/user name.
  projectName: 'sspanel-docs', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Anankke/sspanel-docs/tree/master/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Anankke/sspanel-docs/tree/master/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themes: [],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'SSPanel-Docs',
        logo: {
          alt: 'SSPanel Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docs',
            position: 'left',
            label: '文档',
          },
          {to: '/blog', label: '博客', position: 'left'},
          {
            href: 'https://github.com/Anankke/SSPanel-UIM',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '文档',
            items: [
              {
                label: '快速开始',
                to: '/docs/intro',
              },
              {
                label: '安装指南',
                to: '/docs/installation/quick-install',
              },
              {
                label: '配置文档',
                to: '/docs/configuration/basic',
              },
            ],
          },
          {
            title: '社区',
            items: [
              {
                label: 'Telegram 频道',
                href: 'https://t.me/sspanel_Uim',
              },
              {
                label: 'Telegram 交流群',
                href: 'https://t.me/SSUnion',
              },
              {
                label: 'GitHub Issues',
                href: 'https://github.com/Anankke/SSPanel-UIM/issues',
              },
            ],
          },
          {
            title: '更多',
            items: [
              {
                label: '博客',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Anankke/SSPanel-UIM',
              },
              {
                label: '文档源码',
                href: 'https://github.com/Anankke/sspanel-docs',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} <a href="https://github.com/Anankke/SSPanel-UIM" target="_blank" rel="noopener noreferrer">SSPanel-UIM</a>. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      // Algolia DocSearch 配置
      algolia: {
        appId: '221FUK8G7Y',
        apiKey: '6807944e17e5d51a3bd43f8743f1f5f0',
        indexName: 'SSPanel Docs',
        contextualSearch: true,
      },
    }),
};

export default config;
