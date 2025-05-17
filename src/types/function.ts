/**
 * 함수 관련 타입 정의
 */

import { z } from 'zod';
import type { FunctionSchema } from './model-context-protocol';

/**
 * 함수 옵션 인터페이스
 */
export interface FunctionOptions<TParams = any, TResult = any> {
  /**
   * 함수 이름
   */
  name: string;

  /**
   * 함수 설명
   */
  description?: string;

  /**
   * 매개변수 스키마 (zod 스키마 또는 JSON 스키마)
   */
  parameters: z.ZodObject<any> | FunctionSchema['parameters'];

  /**
   * 함수 실행 로직
   */
  execute: (params: TParams) => Promise<TResult> | TResult;
}

/**
 * 함수 인터페이스
 */
export interface Function<TParams = any, TResult = any> {
  /**
   * 함수 이름
   */
  name: string;

  /**
   * 함수 설명
   */
  description?: string;

  /**
   * 함수 스키마
   */
  schema: FunctionSchema;

  /**
   * 함수 실행
   */
  execute: (params: TParams) => Promise<TResult> | TResult;
}

/**
 * 함수 호출 결과
 */
export interface FunctionResult<T = any> {
  /**
   * 결과 데이터
   */
  data: T;

  /**
   * 상태 코드
   */
  status: 'success' | 'error';

  /**
   * 오류 메시지 (있는 경우)
   */
  error?: string;
}

/**
 * 함수 호출 컨텍스트
 */
export interface FunctionCallContext {
  /**
   * 함수 이름
   */
  functionName: string;

  /**
   * 함수 인자
   */
  arguments: Record<string, any>;

  /**
   * 원본 메시지
   */
  message?: string;

  /**
   * 호출 타임스탬프
   */
  timestamp: number;
}

/**
 * 함수 변환기 인터페이스
 */
export interface FunctionTransformer {
  /**
   * 함수를 함수 스키마로 변환
   */
  toSchema<TParams>(func: Function<TParams>): FunctionSchema;

  /**
   * zod 스키마를 함수 스키마 매개변수로 변환
   */
  zodToParameters(schema: z.ZodObject<any>): FunctionSchema['parameters'];
} 