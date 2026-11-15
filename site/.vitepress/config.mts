import { defineConfig } from 'vitepress'

const packages = [
  'core',
  'use-cors-headers',
  'use-log-request',
  'use-pagination-query-parameters',
  'config',
  'logger',
  'encrypt',
  'healthcheck',
  'utils',
  'assert-unreachable',
  'inactivity-timeout',
  'react-providers',
]

export default defineConfig({
  title: 'webframe beta',
  description: "Typed middleware for Node's HTTP server, and the helpers that go with it.",
  lang: 'en-GB',
  cleanUrls: true,
  lastUpdated: false,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&family=Syne:wght@700&display=swap' }],
  ],
  themeConfig: {
    logo: { light: '/icon.svg', dark: '/icon-dark.svg', alt: '' },
    // the name in Syne, and beta as a label beside it (custom.css)
    siteTitle: '<span class="wf-name">webframe</span><span class="wf-beta">beta</span>',
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Packages', link: '/packages/core' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'The server', link: '/guide/server' },
          { text: 'Routing', link: '/guide/routing' },
          { text: 'Middleware', link: '/guide/middleware' },
          { text: 'Requests and responses', link: '/guide/requests-and-responses' },
          { text: 'Errors and logging', link: '/guide/errors-and-logging' },
          { text: 'Workers', link: '/guide/workers' },
        ],
      },
      {
        text: 'Packages',
        items: packages.map((name) => ({ text: `@webframe/${name}`, link: `/packages/${name}` })),
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/tw050x/webframe' }],
    search: { provider: 'local' },
    outline: { level: [2, 3] },
    footer: { message: 'Released under the MIT Licence.' },
  },
})
