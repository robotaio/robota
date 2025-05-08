# Robota

쉽게 Agentic AI를 만들 수 있는 JavaScript 라이브러리

[![NPM Version](https://img.shields.io/npm/v/robota.svg)](https://www.npmjs.com/package/robota)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 소개

Robota는 AI 에이전트를 쉽게, 직관적으로, 그리고 유연하게 구축할 수 있는 타입스크립트 라이브러리입니다. 다양한 AI 제공업체 (OpenAI, Anthropic 등)를 지원하며, 함수 호출, 도구 통합, 대화 관리 등 에이전트 구축에 필요한 모든 기능을 제공합니다.

## 특징

- **다양한 AI 제공업체 지원**: OpenAI, Anthropic, LangChain, Replicate 등을 통합하여 사용할 수 있습니다.
- **강력한 함수 호출 기능**: AI가 함수를 직접 호출하여 외부 API, 데이터베이스 등과 상호작용할 수 있습니다.
- **모듈식 설계**: 필요한 기능만 가져와 사용할 수 있는 모듈식 설계로 가볍고 유연한 구현이 가능합니다.
- **OpenAPI 통합**: OpenAPI 스펙에서 자동으로 AI 도구를 생성하여 기존 API를 쉽게 AI에 연결할 수 있습니다.
- **타입 안정성**: TypeScript로 작성되어 타입 안정성을 보장하고 IDE의 자동 완성 기능을 활용할 수 있습니다.

## 설치

npm을 사용하여 핵심 패키지 설치:

```bash
npm install @robota/core
```

필요한 제공업체 패키지 설치:

```bash
# OpenAI 제공업체
npm install @robota/openai

# Anthropic 제공업체
npm install @robota/anthropic
```

또는 pnpm 사용:

```bash
pnpm add @robota/core @robota/openai
```

## 기본 사용법

```typescript
import { Robota } from '@robota/core';
import { OpenAIProvider } from '@robota/openai';

// Robota 인스턴스 생성
const robota = new Robota({
  provider: new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4'
  })
});

// 실행
const result = await robota.run('타입스크립트란 무엇인가요?');
console.log(result);
```

## 문서

자세한 문서는 [공식 사이트](https://robota.io)에서 확인하세요.

## 예제

더 많은 예제는 [examples](./examples) 디렉토리에서 확인할 수 있습니다.

## 개발 상태

현재 프로젝트는 적극적으로 개발 중입니다:

- ✅ 핵심 기능 구현 완료
- ✅ 단위 테스트 작성
- ✅ 예제 코드 추가
- ✅ CI/CD 파이프라인 설정
- ✅ npm 배포 설정
- ✅ GitHub Pages 배포 구성
- ⏳ 문서화 진행 중
- ⏳ 추가 제공업체 지원 작업 중
- ⏳ 성능 최적화 작업 중

## 기여하기

기여는 언제나 환영합니다! 자세한 내용은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참조하세요.

## 라이선스

MIT
