---
layout: home

hero:
  name: '<span class="wf-name">webframe</span><span class="wf-beta">beta</span>'
  image:
    light: /icon.svg
    dark: /icon-dark.svg
    alt: ''
  text: Typed middleware for Node's HTTP server
  tagline: Build each route as a chain of small steps. Each step decorates the request's context, and TypeScript knows what every step after it can use.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: Packages
      link: /packages/core

features:
  - title: Context that's typed as it grows
    details: A middleware says how it decorates the context. The ones after it see its decorations as typed properties, and using something no middleware has decorated the context with is a compile error.
  - title: Stops when it has answered
    details: The chain ends as soon as a step sends a response, so a check that fails just responds. If nothing responds, or a step throws, the client gets a 500 and the error is logged.
  - title: Node's own server
    details: webframe runs on node:http or node:https, mutual TLS included. The request and response are Node's own objects, with helpers added.
  - title: Install only what you use
    details: One small package per middleware or helper. The core has no dependencies.
---
