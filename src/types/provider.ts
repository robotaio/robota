/**
 * 제공업체 관련 타입 정의
 */

import type { ModelContext, ModelResponse, FunctionSchema, FunctionCallMode } from './model-context-protocol';

/**
 * 제공업체 옵션 인터페이스
 */
export interface ToolProviderOptions {
  /**
   * 사용할 모델 이름
   */
  model: string;

  /**
   * API 키
   */
  apiKey?: string;

  /**
   * 응답의 무작위성/창의성 (0~1)
   */
  temperature?: number;

  /**
   * 최대 생성 토큰 수
   */
  maxTokens?: number;

  /**
   * 생성 중지 시퀀스
   */
  stopSequences?: string[];

  /**
   * 스트리밍 모드 활성화 여부
   */
  streamMode?: boolean;

  /**
   * 함수 호출 모드
   */
  functionCallMode?: FunctionCallMode;

  /**
   * 강제 실행할 함수 이름 (functionCallMode가 'force'인 경우)
   */
  forcedFunction?: string;

  /**
   * 강제 함수 인자 (functionCallMode가 'force'인 경우)
   */
  forcedArguments?: Record<string, any>;

  /**
   * 추가 모델별 옵션
   */
  [key: string]: any;
}

/**
 * 제공업체 응답 인터페이스
 */
export interface ToolProviderResponse extends ModelResponse {
  /**
   * 응답 내용
   */
  content?: string;

  /**
   * 함수 호출 정보 (있는 경우)
   */
  functionCall?: {
    name: string;
    arguments: Record<string, any>;
  };

  /**
   * 토큰 사용량 정보
   */
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };

  /**
   * 추가 메타데이터
   */
  metadata?: Record<string, any>;
}

/**
 * 제공업체 응답 스트림 타입
 */
export type ToolProviderResponseStream = AsyncIterable<Partial<ToolProviderResponse>>;

/**
 * 제공업체 인터페이스
 */
export interface ToolProvider {
  /**
   * 제공업체 ID
   */
  id: string;

  /**
   * 제공업체 옵션
   */
  options: ToolProviderOptions;

  /**
   * 텍스트 완성 생성
   * @param context 모델 컨텍스트
   * @param options 추가 옵션
   */
  generateCompletion(
    context: ModelContext,
    options?: Partial<ToolProviderOptions>
  ): Promise<ToolProviderResponse>;

  /**
   * 스트리밍 텍스트 완성 생성
   * @param context 모델 컨텍스트
   * @param options 추가 옵션
   */
  generateCompletionStream(
    context: ModelContext,
    options?: Partial<ToolProviderOptions>
  ): Promise<ToolProviderResponseStream>;

  /**
   * 함수 스키마 변환
   * @param functions 함수 스키마 배열
   */
  transformFunctionSchemas?(functions: FunctionSchema[]): any;

  /**
   * 제공업체가 특정 기능을 지원하는지 확인
   * @param feature 확인할 기능 이름
   */
  supportsFeature(feature: string): boolean;
} 