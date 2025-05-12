# LangChain 제공자

LangChain 프레임워크와 통합하기 위한 제공자로, 다양한 LangChain 모델과 체인을 Robota에서 활용할 수 있습니다.

## 특징

- LangChain 모델, 체인, 에이전트 통합
- 기존 LangChain 프로젝트와 Robota의 쉬운 통합
- LangChain의 다양한 유틸리티와 도구 활용 가능

## 설치

```bash
npm install @robota/langchain langchain
```

## 사용법

### 기본 모델 사용

```typescript
import { Robota, LangChainProvider } from 'robota';
import { ChatOpenAI } from 'langchain/chat_models/openai';

// LangChain 모델 생성
const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4',
  temperature: 0.7
});

// LangChain 제공자 초기화
const provider = new LangChainProvider({
  model: model
});

// Robota 인스턴스에 제공자 연결
const robota = new Robota({ provider });

// 실행
const result = await robota.run('안녕하세요! 오늘 날씨가 어때요?');
console.log(result);
```

### 체인 사용

```typescript
import { Robota, LangChainProvider } from 'robota';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';

// LangChain 모델 생성
const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4'
});

// 메모리와 체인 설정
const memory = new BufferMemory();
const chain = new ConversationChain({ llm: model, memory });

// LangChain 제공자 초기화 (체인 사용)
const provider = new LangChainProvider({
  chain: chain
});

// Robota 인스턴스에 제공자 연결
const robota = new Robota({ provider });

// 실행
const result1 = await robota.run('내 이름은 김철수야.');
console.log(result1);

const result2 = await robota.run('내 이름이 뭐지?');
console.log(result2); // 메모리 기능으로 이전 대화 기억
```

### 에이전트 사용

```typescript
import { Robota, LangChainProvider } from 'robota';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { Calculator } from 'langchain/tools/calculator';
import { WebBrowser } from 'langchain/tools/webbrowser';

// LangChain 모델 생성
const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4',
  temperature: 0
});

// 도구 설정
const tools = [
  new Calculator(),
  new WebBrowser()
];

// 에이전트 생성
const executor = await initializeAgentExecutorWithOptions(
  tools,
  model,
  {
    agentType: 'chat-conversational-react-description',
    verbose: true,
  }
);

// LangChain 제공자 초기화 (에이전트 사용)
const provider = new LangChainProvider({
  agent: executor
});

// Robota 인스턴스에 제공자 연결
const robota = new Robota({ provider });

// 실행
const result = await robota.run('123 * 456은 얼마야?');
console.log(result);
```

## 제공자 옵션

LangChain 제공자는 다음과 같은 옵션을 지원합니다:

```typescript
interface LangChainProviderOptions extends ProviderOptions {
  // 다음 중 하나는 반드시 제공해야 함
  model?: BaseChatModel | BaseLLM; // LangChain 모델
  chain?: Chain;                   // LangChain 체인
  agent?: AgentExecutor;           // LangChain 에이전트

  // 선택적 옵션
  memory?: BaseChatMemory;         // LangChain 메모리 (model 사용 시)
  verbose?: boolean;               // 상세 로깅 활성화
}
```

## LangChain과 Robota 통합의 이점

1. **기능 확장**: LangChain의 다양한 도구와 유틸리티를 Robota의 UI/UX와 함께 사용할 수 있습니다.
2. **기존 투자 보호**: 이미 LangChain으로 구축한 프로젝트를 Robota로 쉽게 마이그레이션할 수 있습니다.
3. **유연성**: 특정 작업은 LangChain의 특화된 기능을 활용하고, 나머지는 Robota의 기능을 사용할 수 있습니다.

## 주의사항

- LangChain 제공자를 사용할 때는 `model`, `chain`, `agent` 중 하나를 반드시 제공해야 합니다.
- LangChain의 메모리 시스템과 Robota의 메모리 시스템은 별도로 관리됩니다. 필요에 따라 적절한 시스템을 선택하세요.
- 스트리밍은 LangChain 모델이 이를 지원하는 경우에만 작동합니다. 