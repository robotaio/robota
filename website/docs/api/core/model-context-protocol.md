---
title: model-context-protocol
sidebar_position: 2
---

# model-context-protocol

`core/src/model-context-protocol.ts` 파일의 API 문서입니다.

## 설명

모델 컨텍스트 프로토콜(MCP)

다양한 AI 모델 제공업체와 통합하기 위한 표준화된 인터페이스

## 설명

기본 모델 및 설정

## 설명

주어진 컨텍스트로 모델에 요청을 보내고 응답을 받습니다.

@param context 요청 컨텍스트 (메시지, 함수 정의 등)
@param options 추가 옵션
@returns 모델 응답

## 설명

주어진 컨텍스트로 모델에 스트리밍 요청을 보내고 응답 청크를 받습니다.

@param context 요청 컨텍스트 (메시지, 함수 정의 등)
@param options 추가 옵션
@returns 스트리밍 응답 AsyncIterable

## 설명

메시지를 모델이 이해할 수 있는 형식으로 포맷합니다.

@param messages 메시지 배열
@returns 포맷된 메시지

## 설명

함수 정의를 모델이 이해할 수 있는 형식으로 포맷합니다.

@param functions 함수 정의 배열
@returns 포맷된 함수 정의

## 설명

모델 응답을 표준 형식으로 파싱합니다.

@param response 모델의 원시 응답
@returns 표준화된 ModelResponse

## 설명

스트리밍 응답 청크를 표준 형식으로 파싱합니다.

@param chunk 모델의 원시 응답 청크
@returns 표준화된 StreamingResponseChunk

## 설명

모델의 토큰 사용량을 계산합니다.

@param input 입력 텍스트
@returns 추정 토큰 수

