---
title: index
sidebar_position: 2
---

# index

`tools/src/index.ts` 파일의 API 문서입니다.

## 설명

@module @robota/tools

Robota AI 에이전트를 위한 도구 라이브러리

## 설명

도구 실행 결과 타입

## 설명

도구 실행 성공 여부

## 설명

도구 실행 결과 데이터

## 설명

도구 실행 중 발생한 오류

## 설명

추가 메타데이터

## 설명

도구 파라미터 타입

## 설명

도구 인터페이스

## 설명

도구 이름

## 설명

도구 설명

## 설명

도구 파라미터 정의

## 설명

도구 실행 함수

@param input - 도구 입력 파라미터
@returns 실행 결과

## 설명

도구 생성 옵션

## 설명

도구 이름

## 설명

도구 설명

## 설명

도구 파라미터 정의

## 설명

도구 실행 함수

## 설명

도구 생성 함수

@param options - 도구 생성 옵션
@returns 생성된 도구

### Example
```ts
const weatherTool = createTool({
  name: 'getWeather',
  description: '특정 위치의 날씨 정보를 가져옵니다',
  parameters: [
    { name: 'location', type: 'string', description: '위치 (도시명)', required: true }
  ],
  execute: async ({ location }) => {
    // 날씨 API 호출 로직
    return { temperature: 25, humidity: 60, conditions: '맑음' };
  }
});
```

## 설명

도구 레지스트리 클래스

여러 도구를 등록하고 관리하는 클래스

## 설명

도구 등록

@param tool - 등록할 도구

## 설명

여러 도구 등록

@param tools - 등록할 도구 배열

## 설명

도구 가져오기

@param name - 가져올 도구 이름
@returns 도구 또는 undefined

## 설명

모든 도구 가져오기

@returns 모든 등록된 도구 배열

## 설명

도구 실행

@param name - 실행할 도구 이름
@param input - 도구 입력 파라미터
@returns 도구 실행 결과

