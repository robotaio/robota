# 함수 호출 (Function Calling)

함수 호출은 AI 모델이 사전 정의된 함수를 호출할 수 있게 하는 기능입니다. 이를 통해 AI는 외부 시스템과 상호작용하고, 데이터를 검색하거나 계산을 수행할 수 있습니다.

## 기본적인 함수 호출

Robota에서 함수를 정의하고 등록하는 방법은 다음과 같습니다:

```typescript
import { Robota, OpenAIProvider } from 'robota';

// Robota 인스턴스 생성
const robota = new Robota({
  provider: new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4'
  })
});

// 함수 정의
const functions = {
  // 날씨 검색 함수
  getWeather: async (location: string, unit: 'celsius' | 'fahrenheit' = 'celsius') => {
    console.log(`${location}의 날씨를 ${unit} 단위로 검색 중...`);
    // 실제 구현에서는 날씨 API 호출
    return { 
      temperature: 25, 
      condition: '맑음', 
      humidity: 60,
      unit
    };
  },
  
  // 수학 계산 함수
  calculate: async (expression: string) => {
    console.log(`계산 중: ${expression}`);
    // 주의: eval은 보안상 위험할 수 있습니다. 실제 사용시 안전한 대안을 고려하세요.
    return { result: eval(expression) };
  }
};

// 함수 등록
robota.registerFunctions(functions);

// 실행
const result = await robota.run('서울의 날씨가 어떤지 알려주고, 25 + 15의 계산 결과도 보여줘.');
console.log(result);
```

## 함수 스키마 자동 추출

Robota는 타입스크립트의 타입 정보를 사용하여 함수의 매개변수와 반환 타입에 대한 스키마를 자동으로 생성합니다. 이렇게 생성된 스키마는 AI 모델에게 함수의 사용법을 알려주는 데 사용됩니다.

## 복잡한 매개변수를 가진 함수

객체나 배열과 같은 복잡한 매개변수를 가진 함수도 정의할 수 있습니다:

```typescript
// 복잡한 매개변수를 가진 함수
const functions = {
  createUser: async (userData: {
    name: string;
    email: string;
    age: number;
    preferences?: {
      theme: 'light' | 'dark';
      notifications: boolean;
    }
  }) => {
    console.log(`사용자 생성 중: ${userData.name}`);
    return { 
      id: 'user-123',
      createdAt: new Date().toISOString(),
      ...userData
    };
  }
};

robota.registerFunctions(functions);
```

## zod를 사용한 스키마 검증

보다 강력한 매개변수 검증을 위해 `zod` 라이브러리를 사용할 수 있습니다:

```typescript
import { z } from 'zod';
import { Robota, OpenAIProvider, createFunction } from 'robota';

// zod 스키마를 사용한 함수 생성
const sendEmail = createFunction({
  name: 'sendEmail',
  description: '지정된 수신자에게 이메일을 보냅니다',
  parameters: z.object({
    to: z.string().email('유효한 이메일 주소가 필요합니다'),
    subject: z.string().min(1, '제목은 비어있을 수 없습니다'),
    body: z.string(),
    cc: z.array(z.string().email()).optional(),
    bcc: z.array(z.string().email()).optional(),
    attachments: z.array(z.string().url()).optional()
  }),
  execute: async (params) => {
    console.log(`이메일 전송 중: ${params.subject}`);
    // 실제 이메일 전송 로직
    return { 
      status: 'sent',
      messageId: 'msg-' + Math.random().toString(36).substring(2, 9)
    };
  }
});

const robota = new Robota({
  provider: new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4'
  })
});

// 함수 등록
robota.registerFunctions({ sendEmail });
```

## 함수 호출 모드

Robota는 다양한 함수 호출 모드를 지원합니다:

### 자동 모드 (기본값)

AI가 필요에 따라 함수를 자동으로 호출합니다:

```typescript
const result = await robota.run('내일 서울의 날씨가 어떤지 알려줘', {
  functionCallMode: 'auto' // 기본값이므로 생략 가능
});
```

### 강제 모드

특정 함수를 강제로 호출하도록 지시합니다:

```typescript
const result = await robota.run('내일 서울의 날씨가 어떤지 알려줘', {
  functionCallMode: 'force',
  forcedFunction: 'getWeather',
  forcedArguments: { location: '서울', unit: 'celsius' }
});
```

### 비활성화 모드

함수 호출을 완전히 비활성화합니다:

```typescript
const result = await robota.run('안녕하세요!', {
  functionCallMode: 'disabled'
});
```

## 함수 호출 추적 및 로깅

함수 호출을 추적하고 로깅할 수 있습니다:

```typescript
const robota = new Robota({
  provider: new OpenAIProvider({ /* 설정 */ }),
  onFunctionCall: (functionName, args, result) => {
    console.log(`함수 호출: ${functionName}`);
    console.log('인자:', args);
    console.log('결과:', result);
  }
});
```

## 함수 호출 제한 및 안전성

보안과 안전성을 위해 함수 호출에 제한을 둘 수 있습니다:

```typescript
const robota = new Robota({
  provider: new OpenAIProvider({ /* 설정 */ }),
  functionCallConfig: {
    maxCalls: 5, // 최대 함수 호출 횟수
    timeout: 10000, // 함수 호출 타임아웃 (ms)
    allowedFunctions: ['getWeather', 'calculate'] // 허용된 함수 목록
  }
});
``` 