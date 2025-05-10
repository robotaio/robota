---
title: utils
sidebar_position: 2
---

# utils

`core/src/utils.ts` 파일의 API 문서입니다.

## 설명

유틸리티 함수 모음

## 설명

문자열을 청크로 나누는 함수

@param text 나눌 문자열
@param chunkSize 각 청크의 최대 크기
@returns 문자열 청크 배열

## 설명

객체에서 undefined 값을 제거하는 함수

@param obj 정리할 객체
@returns undefined 값이 제거된 객체

## 설명

문자열이 JSON인지 확인하는 함수

@param str 확인할 문자열
@returns JSON 여부

## 설명

지연 함수

@param ms 지연 시간(밀리초)
@returns Promise

## 설명

토큰 수 대략적 추정 함수

@param text 측정할 텍스트
@returns 대략적인 토큰 수

## 설명

문자열 스트림에서 완성된 JSON 객체를 추출하는 함수

@param text JSON 문자열 조각
@returns 완성된 JSON 객체와 남은 문자열

