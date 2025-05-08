# 제공업체 (Providers)

Robota는 다양한 AI 제공업체를 지원하여 여러 LLM 서비스를 활용할 수 있게 합니다. 각 제공업체는 특정 API와 통신하고 해당 서비스의 고유한 기능을 활용할 수 있도록 설계되었습니다.

## 지원되는 제공업체

### OpenAI

OpenAI의 GPT 모델과 통합하기 위한 제공업체입니다. GPT-3.5, GPT-4 등 다양한 모델을 지원합니다.

자세한 내용은 [OpenAI 제공업체 문서](./providers-openai.md)를 참조하세요.

### Anthropic

Anthropic의 Claude 모델과 통합하기 위한 제공업체입니다. Claude, Claude Instant 등의 모델을 지원합니다.

자세한 내용은 [Anthropic 제공업체 문서](./providers-anthropic.md)를 참조하세요.

### LangChain

LangChain 프레임워크와 통합하기 위한 제공업체로, 다양한 LangChain 모델과 체인을 Robota에서 활용할 수 있습니다.

자세한 내용은 [LangChain 제공업체 문서](./providers-langchain.md)를 참조하세요.

### Replicate

Replicate 플랫폼의 다양한 오픈소스 모델을 활용할 수 있는 제공업체입니다.

자세한 내용은 [Replicate 제공업체 문서](./providers-replicate.md)를 참조하세요.

## 제공업체 사용하기

각 제공업체는 일관된 인터페이스를 통해 사용됩니다:

```typescript
import { Robota, OpenAIProvider } from 'robota';

// OpenAI 제공업체 설정
const provider = new OpenAIProvider({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4',
  temperature: 0.7
});

// Robota 인스턴스에 제공업체 연결
const robota = new Robota({ provider });

// 실행
const result = await robota.run('안녕하세요! 오늘 날씨가 어때요?');
```

## 여러 제공업체 사용하기

여러 제공업체를 동시에 사용하여 다양한 AI 모델의 장점을 활용할 수 있습니다:

```typescript
import { Robota, OpenAIProvider, AnthropicProvider, ProviderRouter } from 'robota';

// 여러 제공업체 설정
const openaiProvider = new OpenAIProvider({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4'
});

const anthropicProvider = new AnthropicProvider({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-opus'
});

// 라우터를 통해 여러 제공업체 사용
const router = new ProviderRouter({
  defaultProvider: openaiProvider,
  providers: {
    openai: openaiProvider,
    anthropic: anthropicProvider
  },
  routingStrategy: (message, context) => {
    // 메시지 내용에 따라 적절한 제공업체 선택
    if (message.includes('창의적') || message.includes('creative')) {
      return 'anthropic';
    }
    return 'openai'; // 기본값
  }
});

// 라우터를 제공업체로 사용
const robota = new Robota({ provider: router });

// 각 질문은 적절한 제공업체로 라우팅됨
const creativeResult = await robota.run('창의적인 시를 써줘');  // Anthropic으로 라우팅
const factualResult = await robota.run('파이의 값은 얼마인가요?');  // OpenAI로 라우팅
```

## 제공업체 구성 옵션

각 제공업체는 서비스별 고유 구성 옵션을 지원합니다. 공통적으로 지원되는 기본 옵션은 다음과 같습니다:

```typescript
interface ProviderOptions {
  model: string;       // 사용할 모델 이름
  temperature?: number; // 응답의 무작위성/창의성 (0~1)
  maxTokens?: number;   // 최대 생성 토큰 수
  stopSequences?: string[]; // 생성 중지 시퀀스
  streamMode?: boolean; // 스트리밍 모드 활성화 여부
}
```

## 커스텀 제공업체 만들기

자체 AI 서비스나 지원되지 않는 서비스를 통합하려면 커스텀 제공업체를 만들 수 있습니다.

기본 제공업체 인터페이스를 구현하여 시작할 수 있습니다:

```typescript
import { BaseProvider, ProviderResponse, ProviderOptions } from 'robota';

class CustomProvider extends BaseProvider {
  constructor(options) {
    super(options);
    // 초기화 로직
  }

  async generateCompletion(prompt, options) {
    // API 호출 구현
    const response = await this.callCustomAPI(prompt, options);
    
    return {
      content: response.text,
      usage: {
        promptTokens: response.promptTokens,
        completionTokens: response.completionTokens,
        totalTokens: response.totalTokens
      }
    };
  }

  async generateCompletionStream(prompt, options) {
    // 스트리밍 API 호출 구현
    const stream = this.callCustomAPIStream(prompt, options);
    return stream;
  }
}
```

자세한 커스텀 제공업체 구현 방법은 [커스텀 제공업체 문서](./providers-custom.md)를 참조하세요. 