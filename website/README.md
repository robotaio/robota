# Robota API 문서

이 디렉토리는 Robota 라이브러리의 API 문서를 생성하는 코드를 포함하고 있습니다. TypeDoc을 사용하여 TypeScript 소스코드로부터 API 문서를 자동 생성합니다.

## 설치

의존성 패키지를 설치합니다:

```bash
npm install
```

## 문서 생성

다음 명령어로 API 문서를 생성할 수 있습니다:

```bash
npm run build
```

이 명령어는 `../docs/api-reference/` 디렉토리에 마크다운 형식의 API 문서를 생성합니다.

## 문서 미리보기

생성된 문서를 로컬에서 미리보려면 다음 명령어를 사용합니다:

```bash
npm run serve
```

이 명령어는 로컬 서버를 실행하여 생성된 문서를 웹 브라우저에서 확인할 수 있게 해줍니다.

## 문서 구조

- `index.md`: API 문서의 메인 페이지
- 각 패키지 별로 별도의 디렉토리가 생성됩니다:
  - `core/`: 코어 패키지 API 문서
  - `openai/`: OpenAI 패키지 API 문서
  - `anthropic/`: Anthropic 패키지 API 문서
  - `langchain/`: LangChain 패키지 API 문서
  - `replicate/`: Replicate 패키지 API 문서
  - `tools/`: Tools 패키지 API 문서

## 설정 파일

- `typedoc.json`: TypeDoc 설정 파일
- `scripts/generate-api-docs.js`: API 문서 생성 스크립트

## 테스트

문서 생성 스크립트에 대한 테스트는 다음 명령으로 실행합니다:

```bash
npm test
```

테스트는 다음 사항을 검증합니다:
- 문서 생성 스크립트가 필요한 모든 함수를 가지고 있는지 확인
- 링크 변환 로직이 올바르게 구현되어 있는지 확인
- HTML 생성 로직이 올바르게 구현되어 있는지 확인

새로운 기능이나 변경사항을 추가할 때는 테스트 코드도 함께 업데이트하는 것이 좋습니다.
