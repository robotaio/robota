/**
 * 기본 제공업체 클래스
 * 모든 제공업체의 기본 클래스
 */

import { randomUUID } from 'crypto';
import type { Provider, ProviderOptions, ProviderResponse, ProviderResponseStream } from '../types/provider';
import type { ModelContext, FunctionSchema, ModelContextProtocol } from '../types/model-context-protocol';

/**
 * 기본 제공업체 구현
 */
export abstract class BaseProvider implements Provider, Partial<ModelContextProtocol> {
  /**
   * 제공업체 ID
   */
  public readonly id: string;
  
  /**
   * 제공업체 옵션
   */
  public readonly options: ProviderOptions;
  
  /**
   * 생성자
   * @param options 제공업체 옵션
   */
  constructor(options: ProviderOptions) {
    this.id = randomUUID();
    this.options = {
      ...options,
      temperature: options.temperature ?? 0.7,
      maxTokens: options.maxTokens,
      stopSequences: options.stopSequences,
      streamMode: options.streamMode ?? false
    };
  }
  
  /**
   * 텍스트 완성 생성 (추상 메서드)
   * @param context 모델 컨텍스트
   * @param options 추가 옵션
   */
  abstract generateCompletion(
    context: ModelContext,
    options?: Partial<ProviderOptions>
  ): Promise<ProviderResponse>;
  
  /**
   * 스트리밍 텍스트 완성 생성 (추상 메서드)
   * @param context 모델 컨텍스트
   * @param options 추가 옵션
   */
  abstract generateCompletionStream(
    context: ModelContext,
    options?: Partial<ProviderOptions>
  ): Promise<ProviderResponseStream>;
  
  /**
   * 함수 스키마 변환
   * @param functions 함수 스키마 배열
   * @returns 제공업체별 함수 형식
   */
  transformFunctionSchemas(functions: FunctionSchema[]): any {
    // 기본 구현은 함수 스키마를 그대로 반환
    // 각 제공업체 클래스에서 재정의
    return functions;
  }
  
  /**
   * 제공업체가 특정 기능을 지원하는지 확인
   * @param feature 확인할 기능 이름
   * @returns 지원 여부
   */
  supportsFeature(feature: string): boolean {
    // 기본 구현은 기능 지원하지 않음
    // 각 제공업체 클래스에서 재정의
    return false;
  }
  
  /**
   * MCP 컨텍스트를 모델 고유 형식으로 변환
   * @param context MCP 컨텍스트
   * @returns 모델 고유 형식
   */
  convertContextToModelFormat?(context: ModelContext): any {
    // 기본 구현은 컨텍스트를 그대로 반환
    // 각 제공업체 클래스에서 재정의
    return context;
  }
  
  /**
   * 모델 응답을 MCP 형식으로 변환
   * @param modelResponse 모델 응답
   * @returns MCP 형식 응답
   */
  convertModelResponseToMCP?(modelResponse: any): ProviderResponse {
    // 기본 구현은 응답을 그대로 반환
    // 각 제공업체 클래스에서 재정의
    return modelResponse as ProviderResponse;
  }
  
  /**
   * 제공업체 옵션 병합
   * @param additionalOptions 추가 옵션
   * @returns 병합된 옵션
   */
  protected mergeOptions(additionalOptions?: Partial<ProviderOptions>): ProviderOptions {
    return {
      ...this.options,
      ...additionalOptions
    };
  }
  
  /**
   * 제공업체 정보 문자열 반환
   * @returns 제공업체 정보 문자열
   */
  toString(): string {
    return `Provider(id=${this.id}, model=${this.options.model})`;
  }
} 