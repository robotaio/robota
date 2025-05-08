# 시작하기

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

# LangChain 제공업체
npm install @robota/langchain

# Replicate 제공업체
npm install @robota/replicate

# 도구 패키지
npm install @robota/tools
```

또는 pnpm 사용:

```bash
pnpm add @robota/core @robota/openai
```

## 기본 사용법

가장 기본적인 형태로 Robota를 설정하고 사용하는 방법은 다음과 같습니다:

```typescript
import { Robota } from '@robota/core';
import { OpenAIProvider } from '@robota/openai';

// 환경 변수에서 API 키 가져오기
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OPENAI_API_KEY 환경 변수가 필요합니다');
}

// Robota 인스턴스 생성
const robota = new Robota({
  provider: new OpenAIProvider({
    apiKey,
    model: 'gpt-4'
  })
});

// 간단한 질문 실행
const result = await robota.run('타입스크립트란 무엇인가요?');
console.log(result);
```

## 함수 호출 사용

AI가 함수를 호출할 수 있도록 설정:

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

// 함수 정의
const functions = {
  getWeather: async (location: string) => {
    // 실제 구현에서는 여기서 날씨 API를 호출
    console.log(`${location}의 날씨를 가져오는 중...`);
    return { temperature: 20, condition: '맑음' };
  },
  
  getCurrentTime: async (timezone: string = 'Asia/Seoul') => {
    console.log(`${timezone}의 현재 시간을 가져오는 중...`);
    return new Date().toLocaleString('ko-KR', { timeZone: timezone });
  }
};

// 함수 등록
robota.registerFunctions(functions);

// 실행
const result = await robota.run('서울의 날씨가 어떤지 알려주고, 현재 시간도 알려줘.');
console.log(result);
```

## 스트리밍 응답

스트리밍 응답을 사용하여 실시간으로 결과 받기:

```typescript
import { Robota } from '@robota/core';
import { OpenAIProvider } from '@robota/openai';

const robota = new Robota({
  provider: new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4'
  })
});

// 스트리밍 응답 처리
const stream = await robota.runStream('타입스크립트의 장점에 대해 5가지 알려줘');

for await (const chunk of stream) {
  process.stdout.write(chunk.content || '');
}
```

## 다음 단계

- [핵심 개념](./core-concepts.md)을 읽고 Robota의 구성 요소를 이해하세요.
- 다양한 [제공업체](./providers.md)에 대해 알아보세요.
- [함수 호출](./function-calling.md)에 대한 자세한 내용을 확인하세요. 