# AI 제공자 (Providers)

Robota는 다양한 AI 제공자를 지원하여 여러 LLM 서비스를 활용할 수 있게 합니다. 각 제공자는 특정 API와 통신하고 해당 서비스의 고유한 기능을 활용할 수 있도록 설계되었습니다.

## 지원되는 제공자

### 현재 구현됨

- [OpenAI](openai.md) - OpenAI의 GPT 모델과 통합하기 위한 제공자
- [Anthropic](anthropic.md) - Anthropic의 Claude 모델과 통합하기 위한 제공자
- [Replicate](replicate.md) - Replicate 플랫폼의 다양한 오픈소스 모델을 활용할 수 있는 제공자
- [LangChain](langchain.md) - LangChain 프레임워크와 통합하기 위한 제공자

### 프로토콜 제공자

특정 프로토콜을 기반으로 한 제공자도 지원합니다:

- [MCP (Model Context Protocol)](../protocols/mcp-provider.md) - Model Context Protocol을 지원하는 모델과 통합하기 위한 제공자

## 제공자 사용 방법

각 제공자의 상세 사용법은 해당 문서 페이지를 참조하세요. 공통적인 사용 패턴은 다음과 같습니다:

```typescript
import { Robota, OpenAIProvider } from 'robota';
import OpenAI from 'openai';

// 클라이언트 생성
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 제공자 초기화
const provider = new OpenAIProvider({
  model: 'gpt-4',
  temperature: 0.7,
  client: openaiClient
});

// Robota 인스턴스 생성
const robota = new Robota({ provider });

// 실행
const result = await robota.run('안녕하세요!');
```

## 커스텀 제공자 만들기

자체 AI 서비스나 지원되지 않는 서비스를 통합하려면 [커스텀 제공자 가이드](custom.md)를 참조하세요. 