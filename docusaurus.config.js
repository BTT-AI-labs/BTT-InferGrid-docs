const math = require('remark-math')
const katex = require('rehype-katex')
require('dotenv').config()

module.exports = {
  title: 'BTT InferGrid Docs',
  tagline: 'Bilingual documentation for BTT InferGrid.',
  url: 'https://docs.bttinfergrid.ai',
  baseUrl: '/',
  trailingSlash: true,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-Hans'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      'zh-Hans': {
        label: '中文',
      },
    },
  },
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.svg',
  markdown: {
    mermaid: true,
  },
  organizationName: 'BTT-AI-labs',
  projectName: 'BTT-InferGrid-docs',
  themeConfig: {
    image: 'img/social-preview.png',
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
      additionalLanguages: ['python', 'bash', 'json'],
    },
    navbar: {
      logo: {
        alt: 'BTT InferGrid',
        src: 'img/infergrid-logo.svg',
        srcDark: 'img/infergrid-logo-dark.svg',
        href: '/',
        height: 32,
        width: 213,
      },
      items: [
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          label: 'GitHub',
          href: 'https://github.com/BTT-AI-labs',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} BTT AI Labs.`,
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins: [math],
          rehypePlugins: [katex],
          includeCurrentVersion: true,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./static/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    function webpackFallbackPlugin() {
      return {
        name: 'custom-webpack-fallback-plugin',
        configureWebpack() {
          return {
            resolve: {
              fallback: {
                url: require.resolve('url/'),
              },
            },
          }
        },
      }
    },
  ],
  themes: ['@docusaurus/theme-mermaid'],
}
