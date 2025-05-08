/**
 * 도구 클래스
 */

import { z } from 'zod';
import { createFunction } from './function';
import type { Tool as ToolInterface, ToolOptions, ToolResult } from '../types/tool';
import type { FunctionSchema } from '../types/model-context-protocol';

/**
 * 도구 클래스
 * AI 에이전트가 사용할 수 있는 도구 구현
 */
export class Tool<TParams = any, TResult = any> implements ToolInterface<TParams, TResult> {
  /**
   * 도구 이름
   */
  public readonly name: string;
  
  /**
   * 도구 설명
   */
  public readonly description: string;
  
  /**
   * 도구 카테고리
   */
  public readonly category?: string;
  
  /**
   * 도구 버전
   */
  public readonly version?: string;
  
  /**
   * 도구 스키마
   */
  public readonly schema: FunctionSchema;
  
  /**
   * 매개변수 검증 여부
   */
  private readonly validateParams: boolean;
  
  /**
   * 매개변수 스키마
   */
  private readonly parameters: z.ZodObject<any> | FunctionSchema['parameters'];
  
  /**
   * 도구 실행 함수
   */
  private readonly _execute: (params: TParams) => Promise<ToolResult<TResult>> | ToolResult<TResult>;
  
  /**
   * 실행 전 훅
   */
  private readonly beforeExecute?: (params: TParams) => Promise<TParams> | TParams;
  
  /**
   * 실행 후 훅
   */
  private readonly afterExecute?: (result: ToolResult<TResult>) => Promise<ToolResult<TResult>> | ToolResult<TResult>;
  
  /**
   * 생성자
   * @param options 도구 옵션
   */
  constructor(options: ToolOptions<TParams, TResult>) {
    this.name = options.name;
    this.description = options.description;
    this.category = options.category;
    this.version = options.version;
    this.validateParams = options.validateParams !== false; // 기본값은 true
    this.parameters = options.parameters;
    this._execute = options.execute;
    this.beforeExecute = options.beforeExecute;
    this.afterExecute = options.afterExecute;
    
    // 함수 스키마 생성
    this.schema = this.toFunctionSchema();
  }
  
  /**
   * 도구 실행
   * @param params 도구 매개변수
   * @returns 도구 실행 결과
   */
  async execute(params: TParams): Promise<ToolResult<TResult>> {
    try {
      // 매개변수 전처리
      let processedParams = params;
      if (this.beforeExecute) {
        processedParams = await this.beforeExecute(params);
      }
      
      // 매개변수 검증
      if (this.validateParams && this.parameters instanceof z.ZodObject) {
        try {
          processedParams = this.parameters.parse(processedParams) as TParams;
        } catch (error) {
          if (error instanceof z.ZodError) {
            const errorMessage = error.errors.map(e => 
              `${e.path.join('.')}: ${e.message}`
            ).join(', ');
            
            return {
              status: 'error',
              error: `Parameter validation failed: ${errorMessage}`,
              data: null as any
            };
          }
          throw error;
        }
      }
      
      // 도구 실행
      const result = await this._execute(processedParams);
      
      // 결과 후처리
      if (this.afterExecute) {
        return await this.afterExecute(result);
      }
      
      return result;
    } catch (error) {
      // 오류 처리
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      return {
        status: 'error',
        error: errorMessage,
        data: null as any
      };
    }
  }
  
  /**
   * 함수 스키마로 변환
   * @returns 함수 스키마
   */
  toFunctionSchema(): FunctionSchema {
    return {
      name: this.name,
      description: this.description,
      parameters: this.parameters instanceof z.ZodObject
        ? this.zodToJsonSchema(this.parameters)
        : this.parameters
    };
  }
  
  /**
   * zod 스키마를 JSON 스키마로 변환
   * @param schema zod 스키마
   * @returns JSON 스키마
   */
  private zodToJsonSchema(schema: z.ZodObject<any>): FunctionSchema['parameters'] {
    // 임시로 단순 변환 로직 사용
    // 실제 구현에서는 function.ts의 zodToJsonSchema 함수 활용 가능
    const fn = createFunction({
      name: this.name,
      description: this.description,
      parameters: schema,
      execute: async () => ({} as any)
    });
    
    return fn.schema.parameters;
  }
  
  /**
   * 도구 정보 문자열 반환
   * @returns 도구 정보 문자열
   */
  toString(): string {
    return `Tool(name=${this.name}, category=${this.category || 'default'})`;
  }
  
  /**
   * 도구 팩토리 함수
   * @param options 도구 옵션
   * @returns 도구 인스턴스
   */
  static create<TParams = any, TResult = any>(
    options: ToolOptions<TParams, TResult>
  ): Tool<TParams, TResult> {
    return new Tool<TParams, TResult>(options);
  }
} 