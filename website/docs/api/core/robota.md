---
title: robota
sidebar_position: 2
---

# robota

`core/src/robota.ts` 파일의 API 문서입니다.

## 설명

Robota의 메인 클래스
에이전트를 초기화하고 실행하는 인터페이스 제공

### Example
```ts
const robota = new Robota({
  provider: new OpenAIProvider({
    model: 'gpt-4',
    client: openaiClient
  }),
  systemPrompt: '당신은 도움이 되는 AI 어시스턴트입니다.'
});

const response = await robota.run('안녕하세요!');
```

## 설명

Robota 인스턴스 생성

@param options - Robota 초기화 옵션

## 설명

단일 시스템 프롬프트 설정

@param prompt - 시스템 프롬프트 내용

## 설명

여러 시스템 메시지 설정

@param messages - 시스템 메시지 배열

## 설명

기존 시스템 메시지에 새 시스템 메시지 추가

@param content - 추가할 시스템 메시지 내용

## 설명

함수 호출 모드 설정

@param mode - 함수 호출 모드 ('auto', 'force', 'disabled')

## 설명

함수 호출 설정 구성

@param config - 함수 호출 구성 옵션

## 설명

여러 함수 등록

@param functions - 함수 이름과 구현을 담은 객체

## 설명

단일 함수 등록

@param schema - 함수 스키마
@param fn - 함수 구현

## 설명

텍스트 프롬프트 실행

@param prompt - 사용자 프롬프트
@param options - 실행 옵션
@returns 모델 응답 내용

## 설명

채팅 메시지 처리 및 응답 생성

@param message - 사용자 메시지
@param options - 실행 옵션
@returns 모델 응답 내용

## 설명

스트리밍 응답 생성

@param prompt - 사용자 프롬프트
@param options - 실행 옵션
@returns 스트리밍 응답 청크 이터레이터

## 설명

응답 메시지 추가

@param response - 모델 응답

## 설명

메모리 초기화

## 설명

컨텍스트 초기화

@private
@param prompt - 사용자 프롬프트
@param options - 실행 옵션
@returns 초기화된 컨텍스트

## 설명

함수 호출 처리

@private
@param response - 모델 응답
@param context - 컨텍스트
@param options - 실행 옵션
@returns 최종 응답 내용

## 설명

컨텍스트 준비

@private
@param options - 실행 옵션
@returns 준비된 컨텍스트

## 설명

모델 응답 생성

@private
@param context - 컨텍스트
@param options - 실행 옵션
@returns 모델 응답

