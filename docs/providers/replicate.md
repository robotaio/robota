# Replicate 제공자

Replicate 플랫폼의 다양한 오픈소스 모델을 활용할 수 있는 제공자입니다. Llama, Mistral 등 다양한 오픈소스 모델에 접근할 수 있습니다.

## 특징

- 다양한 오픈소스 LLM 모델 지원
- 간단한 API를 통한 모델 액세스
- 호스팅된 모델을 위한 통합 인터페이스

## 설치

```bash
npm install @robota/replicate
```

## 사용법

### 기본 사용

```typescript
import { Robota, ReplicateProvider } from 'robota';
import Replicate from 'replicate';

// Replicate 클라이언트 생성
const replicateClient = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

// Replicate 제공자 초기화
const provider = new ReplicateProvider({
  model: 'meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3',
  client: replicateClient
});

// Robota 인스턴스에 제공자 연결
const robota = new Robota({ provider });

// 실행
const result = await robota.run('안녕하세요! 오늘 날씨가 어때요?');
console.log(result);
```

### 스트리밍 응답 처리

```typescript
import { Robota, ReplicateProvider } from 'robota';
import Replicate from 'replicate';

// Replicate 클라이언트 생성
const replicateClient = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

// Replicate 제공자 초기화
const provider = new ReplicateProvider({
  model: 'meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3',
  client: replicateClient
});

// Robota 인스턴스 생성
const robota = new Robota({ provider });

// 스트리밍 응답 처리
const stream = await robota.stream('긴 이야기를 해주세요.');

for await (const chunk of stream) {
  process.stdout.write(chunk.content || '');
}
```

## 제공자 옵션

Replicate 제공자는 다음과 같은 옵션을 지원합니다:

```typescript
interface ReplicateProviderOptions extends ProviderOptions {
  // 필수 옵션
  model: string;          // 사용할 모델 ID (예: 'meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3')
  client: Replicate;      // Replicate 클라이언트 인스턴스

  // 선택적 옵션
  temperature?: number;    // 응답의 무작위성/창의성 (0~1)
  maxTokens?: number;      // 최대 생성 토큰 수
  topP?: number;           // 상위 확률 샘플링 (0~1)
  
  // 모델별 추가 파라미터
  modelParams?: Record<string, any>; // 모델별 특정 파라미터
}
```

## 추천 모델

Replicate에서 사용할 수 있는 주요 모델:

| 모델 | ID | 특징 |
|------|------|------|
| Llama 2 70B | meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3 | Meta의 대규모 오픈소스 모델 |
| Mistral 7B | mistralai/mistral-7b-instruct-v0.1:83b6a56e7c828e667f21fd596c338fd4f0039b46bcfa18d973e8e70e455fda70 | 작은 크기에 높은 성능 |
| Mixtral 8x7B | mistralai/mixtral-8x7b-instruct-v0.1:5f98b29fc298bbc9ed3d573447ba35aa0d45304121db0cf1cb6f771069e4c5ee | 혼합 전문가 모델 |

## 주의사항

- Replicate API 토큰은 환경 변수나 안전한 시크릿 관리 시스템을 통해 관리하세요.
- 모델 ID는 버전을 포함한 전체 ID를 사용해야 합니다. (예: `owner/model:version`)
- Replicate의 오픈소스 모델은 대부분 함수 호출 기능을 네이티브하게 지원하지 않습니다. 하지만 Robota는 이를 텍스트 기반으로 에뮬레이션할 수 있습니다.
- 모델별로 제공되는 파라미터가 다를 수 있으므로 `modelParams`를 통해 모델별 특정 파라미터를 전달할 수 있습니다. 