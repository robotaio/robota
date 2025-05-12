Replicate API / [Exports](modules)

# Robota

쉽게 Agentic AI를 만들 수 있는 JavaScript 라이브러리

[![NPM Version](https://img.shields.io/npm/v/robota.svg)](https://www.npmjs.com/package/robota)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![codecov](https://codecov.io/gh/username/robota/branch/main/graph/badge.svg)](https://codecov.io/gh/username/robota)
[![Docs](https://img.shields.io/badge/docs-online-brightgreen.svg)](https://robotaio.github.io/robota/)

<p align="center">
  <img src="https://robota.io/logo.png" alt="Robota Logo" width="200"/>
</p>

## 🚀 소개

Robota는 AI 에이전트를 쉽게, 직관적으로, 그리고 유연하게 구축할 수 있는 타입스크립트 라이브러리입니다. 다양한 AI 제공업체 (OpenAI, Anthropic 등)를 지원하며, 함수 호출, 도구 통합, 대화 관리 등 에이전트 구축에 필요한 모든 기능을 제공합니다.

Robota는 다음과 같은 환경에서 사용할 수 있습니다:
- Node.js 애플리케이션
- 브라우저 기반 웹 애플리케이션
- 서버리스 함수
- Edge 런타임

## ✨ 주요 특징

- **다양한 AI 제공업체 지원**
  - OpenAI (GPT-3.5, GPT-4)
  - Anthropic (Claude)
  - LangChain 통합
  - Replicate 모델
  - Model Context Protocol을 통한 통합 확장성
  
- **강력한 함수 호출 기능**
  - 다양한 모드 지원 (auto, force, disabled)
  - 함수 체이닝 및 컨텍스트 보존
  - 타입 안전한 함수 인터페이스
  
- **스마트 메모리 관리**
  - 다양한 메모리 전략 (simple, persistent, windowed)
  - 메모리 컨텍스트 제한 및 최적화
  
- **강력한 도구 시스템**
  - 선언적 도구 정의
  - 도구 레지스트리
  - 에러 핸들링 및 결과 검증
  
- **OpenAPI 통합**
  - OpenAPI/Swagger 스펙에서 자동 도구 생성
  - API 인증 관리
  
- **타입 안전성**
  - 전체 TypeScript 지원
  - 엄격한 타입 검사
  - IDE 자동완성 최적화

## 📦 설치

### 핵심 패키지 설치

```bash
# npm 사용
npm install @robota/core

# pnpm 사용
pnpm add @robota/core

# yarn 사용
yarn add @robota/core
```

### 필요한 제공업체 설치

```bash
# OpenAI 제공업체
npm install @robota/openai openai

# Anthropic 제공업체
npm install @robota/anthropic @anthropic-ai/sdk

# LangChain 통합
npm install @robota/langchain langchain

# Replicate 통합
npm install @robota/replicate replicate
```

## 🔍 간단한 사용 예시

### 기본 대화 에이전트

```typescript
import { Robota } from '@robota/core';
import { OpenAIProvider } from '@robota/openai';
import OpenAI from 'openai';

// OpenAI 클라이언트 생성
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Robota 인스턴스 생성
const robota = new Robota({
  provider: new OpenAIProvider({
    client: openai,
    model: 'gpt-4'
  }),
  systemPrompt: '당신은 유용한 AI 어시스턴트입니다. 질문에 정확하고 간결하게 대답하세요.'
});

// 실행
async function main() {
  const result = await robota.run('타입스크립트란 무엇인가요?');
  console.log(result);
}

main().catch(console.error);
```

### 함수 호출 사용

```typescript
import { Robota } from '@robota/core';
import { OpenAIProvider } from '@robota/openai';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const robota = new Robota({
  provider: new OpenAIProvider({
    client: openai,
    model: 'gpt-4'
  })
});

// 함수 등록
robota.registerFunction(
  {
    name: 'getWeather',
    description: '특정 위치의 날씨 정보를 가져옵니다',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: '위치 (도시명)'
        }
      },
      required: ['location']
    }
  },
  async ({ location }) => {
    // 실제로는 날씨 API를 호출합니다
    return {
      temperature: 25,
      humidity: 60,
      conditions: '맑음'
    };
  }
);

async function main() {
  const result = await robota.run('서울의 날씨는 어떤가요?');
  console.log(result);
}

main().catch(console.error);
```

### 도구 사용

```typescript
import { Robota } from '@robota/core';
import { OpenAIProvider } from '@robota/openai';
import { createTool, ToolRegistry } from '@robota/tools';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 도구 생성
const calculatorTool = createTool({
  name: 'calculator',
  description: '수학 계산을 수행합니다',
  parameters: [
    { name: 'expression', type: 'string', description: '계산할 수식', required: true }
  ],
  execute: async ({ expression }) => {
    return { result: eval(expression) };
  }
});

// 도구 레지스트리 생성
const toolRegistry = new ToolRegistry();
toolRegistry.register(calculatorTool);

// Robota 인스턴스 생성
const robota = new Robota({
  provider: new OpenAIProvider({
    client: openai,
    model: 'gpt-4'
  })
});

// 도구를 함수로 등록
robota.registerFunction(
  {
    name: 'useCalculator',
    description: '계산기를 사용합니다',
    parameters: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          description: '계산할 수식'
        }
      },
      required: ['expression']
    }
  },
  async ({ expression }) => {
    return await toolRegistry.executeTool('calculator', { expression });
  }
);

async function main() {
  const result = await robota.run('123 곱하기 456은 얼마인가요?');
  console.log(result);
}

main().catch(console.error);
```

## 📚 문서

전체 문서는 [공식 사이트](https://robotaio.github.io/robota/)에서 확인할 수 있습니다.

- [시작하기 가이드](https://robotaio.github.io/robota/docs/getting-started)
- [핵심 개념](https://robotaio.github.io/robota/docs/core-concepts)
- [제공업체 가이드](https://robotaio.github.io/robota/docs/providers)
- [함수 호출](https://robotaio.github.io/robota/docs/function-calling)
- [도구 사용하기](https://robotaio.github.io/robota/docs/tools)
- [API 참조](https://robotaio.github.io/robota/docs/api-reference)

## 📝 자세한 예제

더 많은 예제는 [examples](./examples) 디렉토리에서 확인할 수 있습니다:

- [기본 대화형 챗봇](./examples/basic-chat)
- [함수 호출 활용 예제](./examples/function-calling)
- [날씨 조회 에이전트](./examples/weather-agent)
- [웹 검색 에이전트](./examples/web-search)
- [데이터베이스 통합 예제](./examples/database-integration)
- [OpenAPI 통합 데모](./examples/openapi-integration)
- [멀티모달 에이전트](./examples/multimodal)

## 🏗️ 프로젝트 구조

Robota는 모노레포로 구성되어 있으며, 각 패키지는 특정 기능을 담당합니다:

```
packages/
├── core/               - 핵심 라이브러리
├── openai/             - OpenAI 제공업체
├── anthropic/          - Anthropic 제공업체
├── langchain/          - LangChain 통합
├── replicate/          - Replicate 모델 통합
├── tools/              - 도구 라이브러리
└── mcp/                - Model Context Protocol
```

## 🧪 테스트

Robota는 철저한 테스트를 통해 코드 품질을 보장합니다:

```bash
# 전체 테스트 실행
pnpm test

# 특정 패키지 테스트
pnpm --filter @robota/core test

# 테스트 감시 모드
pnpm test:watch

# 테스트 커버리지 보고서
pnpm test:coverage
```

## 🧩 확장하기

Robota는 확장을 위한 다양한 인터페이스를 제공합니다:

1. **새로운 제공업체 구현**: `ModelContextProtocol` 인터페이스를 구현하여 새로운 AI 모델 추가
2. **커스텀 도구 생성**: `createTool` 함수로 도메인 특화 도구 개발
3. **메모리 시스템 확장**: `Memory` 인터페이스로 커스텀 메모리 전략 구현
4. **사용자 정의 에이전트**: 기본 클래스를 확장하여 특화된 에이전트 개발

## 🔄 로드맵

Robota의 향후 개발 계획:

- ✅ 핵심 기능 구현 완료
- ✅ 단위 테스트 작성
- ✅ 예제 코드 추가
- ✅ CI/CD 파이프라인 설정
- ✅ npm 배포 설정
- ✅ GitHub Pages 배포 구성
- 🔜 문서화 개선
- 🔜 추가 제공업체 지원 (Google, Mistral AI, Cohere)
- 🔜 보안 기능 강화
- 🔜 성능 최적화
- 🔜 브라우저 번들 사이즈 최적화
- 🔜 서버리스 환경 최적화
- 🔜 WebAssembly 지원

## 👥 기여하기

기여는 언제나 환영합니다! [CONTRIBUTING.md](CONTRIBUTING)에서 기여 가이드라인을 확인할 수 있습니다.

## 📄 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE)를 따릅니다.
