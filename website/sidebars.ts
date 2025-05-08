import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'getting-started',
      label: '시작하기',
    },
    {
      type: 'doc',
      id: 'core-concepts',
      label: '핵심 개념',
    },
    {
      type: 'doc',
      id: 'model-context-protocol',
      label: '모델 컨텍스트 프로토콜',
    },
    {
      type: 'doc',
      id: 'function-calling',
      label: '함수 호출',
    },
    {
      type: 'doc',
      id: 'providers',
      label: '프로바이더',
    },
    {
      type: 'doc',
      id: 'openapi-integration',
      label: 'OpenAPI 통합',
    },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
