# Robota - AI 에이전트 프레임워크

Robota는 JavaScript/TypeScript로 작성된 AI 에이전트 프레임워크입니다. 이 프로젝트는 pnpm 모노레포로 구성되어 있으며, 필요에 따라 bun을 사용하여 예제를 실행할 수 있습니다.

## 프로젝트 구조

```
robota/
├── src/
│   ├── packages/         # 라이브러리 패키지
│   │   ├── core/         # 핵심 기능
│   │   ├── tools/        # 도구 모듈
│   │   └── openai/       # OpenAI 통합 모듈
│   └── examples/         # 예제 코드
│       ├── basic/        # 기본 대화 예제
│       ├── function-calling/ # 함수 호출 예제
│       ├── tools/        # 도구 사용 예제
│       └── agents/       # 에이전트 예제
├── pnpm-workspace.yaml   # 워크스페이스 설정
└── package.json          # 루트 패키지 설정
```

## 설치 방법

### 요구 사항

- Node.js 18 이상
- pnpm 8 이상
- bun 1 이상 (선택 사항)

### 설치

```bash
# pnpm 설치 (아직 설치하지 않은 경우)
npm install -g pnpm

# bun 설치 (아직 설치하지 않은 경우)
curl -fsSL https://bun.sh/install | bash

# 의존성 설치
pnpm install
```

## 예제 실행

### pnpm으로 실행

```bash
# 기본 대화 예제
pnpm example:basic

# 함수 호출 예제
pnpm example:function-calling

# 도구 사용 예제
pnpm example:tools

# 에이전트 예제
pnpm example:agents

# 모든 예제 실행
pnpm example:all
```

### bun으로 직접 실행

```bash
# 예제 디렉토리로 이동
cd src/examples

# 기본 대화 예제
bun run basic/simple-conversation.ts

# 함수 호출 예제
bun run function-calling/weather-calculator.ts

# 도구 사용 예제
bun run tools/tool-examples.ts

# 에이전트 예제
bun run agents/research-agent.ts
```

## 개발

### 패키지 빌드

```bash
# 모든 패키지 빌드
pnpm build

# 핵심 의존성 먼저 빌드
pnpm build:deps
```

### 타입 체크

```bash
pnpm typecheck
```

## 환경 변수

예제를 실행하기 위해서는 `.env` 파일을 생성하고 필요한 환경 변수를 설정해야 합니다:

```
# OpenAI API 키 (필수)
OPENAI_API_KEY=your_api_key_here

# 날씨 API 키 (선택 사항)
WEATHER_API_KEY=your_weather_api_key_here
```

## 라이선스

MIT
