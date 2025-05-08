/**
 * Robota 클래스
 * 에이전틱 AI 라이브러리의 주요 진입점
 */

import type { Provider, ProviderOptions, ProviderResponse, ProviderResponseStream } from '../types/provider';
import type { Message, ModelContext, FunctionSchema, FunctionCallMode } from '../types/model-context-protocol';
import type { Function, FunctionResult } from '../types/function';
import type { Tool } from '../types/tool';
import { ConversationMemory } from '../utils/conversation-memory';

/**
 * Robota 옵션 인터페이스
 */
export interface RobotaOptions {
  /**
   * AI 제공업체
   */
  provider: Provider;
  
  /**
   * 시스템 프롬프트
   */
  systemPrompt?: string;
  
  /**
   * 메모리 관리자 (대화 기록 저장)
   */
  memory?: ConversationMemory;
  
  /**
   * 함수 호출 콜백
   */
  onFunctionCall?: (
    functionName: string, 
    args: Record<string, any>, 
    result: any
  ) => void;
  
  /**
   * 함수 호출 구성
   */
  functionCallConfig?: {
    /**
     * 최대 함수 호출 횟수
     */
    maxCalls?: number;
    
    /**
     * 함수 호출 타임아웃 (ms)
     */
    timeout?: number;
    
    /**
     * 허용된 함수 목록
     */
    allowedFunctions?: string[];
  };
}

/**
 * 실행 옵션 인터페이스
 */
export interface RunOptions {
  /**
   * 함수 호출 모드
   */
  functionCallMode?: FunctionCallMode;
  
  /**
   * 강제 함수 이름 (functionCallMode가 'force'인 경우)
   */
  forcedFunction?: string;
  
  /**
   * 강제 함수 인자 (functionCallMode가 'force'인 경우)
   */
  forcedArguments?: Record<string, any>;
  
  /**
   * 제공업체 옵션 재정의
   */
  providerOptions?: Partial<ProviderOptions>;
}

/**
 * Robota 클래스
 * 에이전틱 AI 구축을 위한 주요 클래스
 */
export class Robota {
  /**
   * AI 제공업체
   */
  private provider: Provider;
  
  /**
   * 시스템 프롬프트
   */
  private systemPrompt?: string;
  
  /**
   * 등록된 함수 맵
   */
  private functions: Map<string, Function> = new Map();
  
  /**
   * 등록된 도구 맵
   */
  private tools: Map<string, Tool> = new Map();
  
  /**
   * 메모리 관리자
   */
  private memory: ConversationMemory;
  
  /**
   * 함수 호출 콜백
   */
  private onFunctionCall?: (
    functionName: string, 
    args: Record<string, any>, 
    result: any
  ) => void;
  
  /**
   * 함수 호출 구성
   */
  private functionCallConfig: {
    maxCalls: number;
    timeout: number;
    allowedFunctions?: string[];
  };
  
  /**
   * 생성자
   * @param options Robota 옵션
   */
  constructor(options: RobotaOptions) {
    this.provider = options.provider;
    this.systemPrompt = options.systemPrompt;
    this.memory = options.memory || new ConversationMemory();
    this.onFunctionCall = options.onFunctionCall;
    
    this.functionCallConfig = {
      maxCalls: options.functionCallConfig?.maxCalls || 10,
      timeout: options.functionCallConfig?.timeout || 30000,
      allowedFunctions: options.functionCallConfig?.allowedFunctions
    };
  }
  
  /**
   * 함수 등록
   * @param functions 등록할 함수 객체
   */
  registerFunctions(functions: Record<string, Function | ((...args: any[]) => any)>): void {
    for (const [name, func] of Object.entries(functions)) {
      if (typeof func === 'function') {
        // 일반 함수를 Function 인터페이스로 변환하는 로직 필요
        // 이 부분은 createFunction 유틸리티로 구현
        // 여기서는 구현 생략
      } else {
        this.functions.set(name, func);
      }
    }
  }
  
  /**
   * 도구 등록
   * @param tools 등록할 도구 배열
   */
  registerTools(tools: Tool[]): void {
    for (const tool of tools) {
      this.tools.set(tool.name, tool);
      // 도구를 함수로도 등록
      this.functions.set(tool.name, {
        name: tool.name,
        description: tool.description,
        schema: tool.toFunctionSchema(),
        execute: tool.execute
      });
    }
  }
  
  /**
   * 프롬프트 실행
   * @param prompt 사용자 프롬프트
   * @param options 실행 옵션
   * @returns AI 응답
   */
  async run(prompt: string, options: RunOptions = {}): Promise<string> {
    // 사용자 메시지 생성
    const userMessage: Message = {
      role: 'user',
      content: prompt
    };
    
    // 메모리에 메시지 추가
    this.memory.addMessage(userMessage);
    
    // 컨텍스트 생성
    const context = this.createContext(options);
    
    // 완성 생성
    const response = await this.provider.generateCompletion(
      context,
      options.providerOptions
    );
    
    // 함수 호출 처리
    if (response.functionCall) {
      return await this.handleFunctionCall(response, context, options);
    }
    
    // 메모리에 응답 추가
    if (response.content) {
      this.memory.addMessage({
        role: 'assistant',
        content: response.content
      });
    }
    
    return response.content || '';
  }
  
  /**
   * 스트리밍 프롬프트 실행
   * @param prompt 사용자 프롬프트
   * @param options 실행 옵션
   * @returns AI 응답 스트림
   */
  async runStream(prompt: string, options: RunOptions = {}): Promise<ProviderResponseStream> {
    // 사용자 메시지 생성
    const userMessage: Message = {
      role: 'user',
      content: prompt
    };
    
    // 메모리에 메시지 추가
    this.memory.addMessage(userMessage);
    
    // 컨텍스트 생성
    const context = this.createContext(options);
    
    // 스트리밍 완성 생성
    return await this.provider.generateCompletionStream(
      context,
      options.providerOptions
    );
  }
  
  /**
   * 컨텍스트 생성
   * @param options 실행 옵션
   * @returns 모델 컨텍스트
   */
  private createContext(options: RunOptions): ModelContext {
    // 함수 스키마 변환
    const functionSchemas: FunctionSchema[] = [];
    
    if (options.functionCallMode !== 'disabled') {
      for (const func of this.functions.values()) {
        // 허용된 함수만 포함
        if (
          !this.functionCallConfig.allowedFunctions ||
          this.functionCallConfig.allowedFunctions.includes(func.name)
        ) {
          functionSchemas.push(func.schema);
        }
      }
    }
    
    // 강제 함수 호출 모드인 경우
    if (options.functionCallMode === 'force' && options.forcedFunction) {
      const func = this.functions.get(options.forcedFunction);
      if (func) {
        functionSchemas.length = 0;
        functionSchemas.push(func.schema);
      }
    }
    
    return {
      messages: this.memory.getMessages(),
      functions: functionSchemas.length > 0 ? functionSchemas : undefined,
      systemPrompt: this.systemPrompt
    };
  }
  
  /**
   * 함수 호출 처리
   * @param response 제공업체 응답
   * @param context 모델 컨텍스트
   * @param options 실행 옵션
   * @returns 처리된 응답
   */
  private async handleFunctionCall(
    response: ProviderResponse,
    context: ModelContext,
    options: RunOptions
  ): Promise<string> {
    if (!response.functionCall) {
      return response.content || '';
    }
    
    const { name, arguments: args } = response.functionCall;
    
    // 함수 존재 여부 확인
    const func = this.functions.get(name);
    if (!func) {
      throw new Error(`Function '${name}' not found`);
    }
    
    // 어시스턴트 메시지 추가 (함수 호출 포함)
    this.memory.addMessage({
      role: 'assistant',
      content: response.content || '',
      functionCall: {
        name,
        arguments: args
      }
    });
    
    try {
      // 함수 실행
      const result = await Promise.race([
        func.execute(args),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error(`Function '${name}' timed out`)), this.functionCallConfig.timeout);
        })
      ]);
      
      // 콜백 호출
      if (this.onFunctionCall) {
        this.onFunctionCall(name, args, result);
      }
      
      // 함수 메시지 추가
      this.memory.addMessage({
        role: 'function',
        name,
        content: typeof result === 'string' ? result : JSON.stringify(result)
      });
      
      // 재귀적 실행 (함수 결과에 대한 응답 생성)
      const newContext = this.createContext(options);
      const followUpResponse = await this.provider.generateCompletion(
        newContext,
        options.providerOptions
      );
      
      // 함수 호출이 또 있는 경우 재귀 처리
      if (followUpResponse.functionCall) {
        return await this.handleFunctionCall(followUpResponse, newContext, options);
      }
      
      // 최종 응답 메모리에 추가
      if (followUpResponse.content) {
        this.memory.addMessage({
          role: 'assistant',
          content: followUpResponse.content
        });
      }
      
      return followUpResponse.content || '';
    } catch (error) {
      // 에러 메시지 추가
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      this.memory.addMessage({
        role: 'function',
        name,
        content: JSON.stringify({ error: errorMessage })
      });
      
      // 에러 후 다시 AI 응답 요청
      const errorContext = this.createContext(options);
      const errorResponse = await this.provider.generateCompletion(
        errorContext,
        options.providerOptions
      );
      
      if (errorResponse.content) {
        this.memory.addMessage({
          role: 'assistant',
          content: errorResponse.content
        });
      }
      
      return errorResponse.content || `Error calling function ${name}: ${errorMessage}`;
    }
  }
  
  /**
   * 대화 기록 가져오기
   * @returns 메시지 배열
   */
  getMessages(): Message[] {
    return this.memory.getMessages();
  }
  
  /**
   * 대화 기록 초기화
   */
  clearMessages(): void {
    this.memory.clear();
  }
  
  /**
   * 시스템 프롬프트 설정
   * @param prompt 시스템 프롬프트
   */
  setSystemPrompt(prompt: string): void {
    this.systemPrompt = prompt;
  }
} 