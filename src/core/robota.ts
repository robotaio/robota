/**
 * Robota 클래스
 * 에이전틱 AI 라이브러리의 주요 진입점
 */

import type { Provider, ProviderOptions, ProviderResponse, ProviderResponseStream } from '../types/provider';
import type { Message, ModelContext, FunctionSchema, FunctionCallMode, MessageRole } from '../types/model-context-protocol';
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
   * 시스템 메시지 배열
   */
  systemMessages?: Message[];

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

    /**
     * 기본 함수 호출 모드
     */
    defaultMode?: FunctionCallMode;
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
   * 시스템 메시지 배열
   */
  private systemMessages: Message[] = [];

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
    defaultMode: FunctionCallMode;
  };

  /**
   * 생성자
   * @param options Robota 옵션
   */
  constructor(options: RobotaOptions) {
    this.provider = options.provider;
    this.systemPrompt = options.systemPrompt;

    // 시스템 메시지 초기화
    if (options.systemMessages && options.systemMessages.length > 0) {
      this.systemMessages = options.systemMessages;
    } else if (options.systemPrompt) {
      this.systemMessages = [{
        role: 'system' as MessageRole,
        content: options.systemPrompt
      }];
    }

    this.memory = options.memory || new ConversationMemory();
    this.onFunctionCall = options.onFunctionCall;

    this.functionCallConfig = {
      maxCalls: options.functionCallConfig?.maxCalls || 10,
      timeout: options.functionCallConfig?.timeout || 30000,
      allowedFunctions: options.functionCallConfig?.allowedFunctions,
      defaultMode: options.functionCallConfig?.defaultMode || 'auto'
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
      role: 'user' as MessageRole,
      content: prompt
    };

    // 메모리에 메시지 추가
    this.memory.addMessage(userMessage);

    // 컨텍스트 생성
    const context = this.createContext(options);

    // 함수 호출 모드 설정
    const functionCallMode = options.functionCallMode || this.functionCallConfig.defaultMode;

    // 응답 생성
    const response = await this.provider.generateCompletion(
      context,
      {
        ...options.providerOptions,
        functionCallMode,
        forcedFunction: options.forcedFunction,
        forcedArguments: options.forcedArguments
      }
    );

    // 함수 호출 처리
    if (response.functionCall) {
      // 함수 호출 처리
      return this.handleFunctionCall(response, context, options);
    }

    // 어시스턴트 메시지 생성
    const assistantMessage: Message = {
      role: 'assistant' as MessageRole,
      content: response.content || ''
    };

    // 메모리에 메시지 추가
    this.memory.addMessage(assistantMessage);

    return response.content || '';
  }

  /**
   * 프롬프트 스트리밍 실행
   * @param prompt 사용자 프롬프트
   * @param options 실행 옵션
   * @returns AI 응답 스트림
   */
  async runStream(prompt: string, options: RunOptions = {}): Promise<ProviderResponseStream> {
    // 사용자 메시지 생성
    const userMessage: Message = {
      role: 'user' as MessageRole,
      content: prompt
    };

    // 메모리에 메시지 추가
    this.memory.addMessage(userMessage);

    // 컨텍스트 생성
    const context = this.createContext(options);

    // 함수 호출 모드 설정
    const functionCallMode = options.functionCallMode || this.functionCallConfig.defaultMode;

    // 응답 스트림 생성
    return this.provider.generateCompletionStream(
      context,
      {
        ...options.providerOptions,
        functionCallMode,
        forcedFunction: options.forcedFunction,
        forcedArguments: options.forcedArguments,
        streamMode: true
      }
    );
  }

  /**
   * 컨텍스트 생성
   * @param options 실행 옵션
   * @returns 모델 컨텍스트
   */
  private createContext(options: RunOptions): ModelContext {
    const messages = this.memory.getMessages();
    const systemMessagesToInclude = this.systemMessages.length > 0
      ? this.systemMessages
      : (this.systemPrompt ? [{ role: 'system' as MessageRole, content: this.systemPrompt }] : []);

    // 함수 스키마 생성
    const functions: FunctionSchema[] = [];

    // 함수 호출 모드 확인
    const functionCallMode = options.functionCallMode || this.functionCallConfig.defaultMode;

    // 함수가 사용 가능한지 확인
    if (functionCallMode !== 'disabled') {
      // 모든 함수 또는 허용된 함수만 포함
      const allowedFunctions = this.functionCallConfig.allowedFunctions;

      for (const [name, func] of this.functions.entries()) {
        if (!allowedFunctions || allowedFunctions.includes(name)) {
          functions.push(func.schema);
        }
      }
    }

    // 강제 함수 호출 처리
    if (functionCallMode === 'force' && options.forcedFunction) {
      const forcedFunc = this.functions.get(options.forcedFunction);
      if (!forcedFunc) {
        throw new Error(`강제 함수 '${options.forcedFunction}'를 찾을 수 없습니다.`);
      }
    }

    // 모델 컨텍스트 생성
    return {
      messages: [...systemMessagesToInclude, ...messages],
      functions: functions.length > 0 ? functions : undefined
    };
  }

  /**
   * 함수 호출 처리
   * @param response 제공업체 응답
   * @param context 모델 컨텍스트
   * @param options 실행 옵션
   * @returns 처리 결과
   */
  private async handleFunctionCall(
    response: ProviderResponse,
    context: ModelContext,
    options: RunOptions
  ): Promise<string> {
    if (!response.functionCall || !response.functionCall.name) {
      throw new Error('함수 호출 정보가 없습니다.');
    }

    const functionName = response.functionCall.name;
    const func = this.functions.get(functionName);

    if (!func) {
      throw new Error(`함수 '${functionName}'를 찾을 수 없습니다.`);
    }

    // 허용된 함수 확인
    const allowedFunctions = this.functionCallConfig.allowedFunctions;
    if (allowedFunctions && !allowedFunctions.includes(functionName)) {
      throw new Error(`함수 '${functionName}'는 허용되지 않습니다.`);
    }

    // 함수 인자
    const args = response.functionCall.arguments;

    // 어시스턴트 메시지에 함수 호출 정보 추가
    const assistantMessage: Message = {
      role: 'assistant' as MessageRole,
      content: response.content || '',
      functionCall: {
        name: functionName,
        arguments: args
      }
    };

    // 메모리에 메시지 추가
    this.memory.addMessage(assistantMessage);

    try {
      // 함수 실행
      const result = await func.execute(args);

      // 콜백 호출
      if (this.onFunctionCall) {
        this.onFunctionCall(functionName, args, result);
      }

      // 함수 실행 결과 메시지 생성
      const functionResultMessage: Message = {
        role: 'function' as MessageRole,
        name: functionName,
        content: typeof result === 'string' ? result : JSON.stringify(result),
        functionResult: result
      };

      // 메모리에 메시지 추가
      this.memory.addMessage(functionResultMessage);

      // 함수 호출 모드에 따라 처리
      const functionCallMode = options.functionCallMode || this.functionCallConfig.defaultMode;

      if (functionCallMode === 'force') {
        // 강제 모드에서는 결과만 반환
        return typeof result === 'string' ? result : JSON.stringify(result);
      }

      // 자동 모드에서는 결과에 대한 AI의 응답 요청
      const followUpContext = this.createContext(options);
      const followUpResponse = await this.provider.generateCompletion(followUpContext, options.providerOptions);

      // 후속 함수 호출이 있으면 재귀적으로 처리
      if (followUpResponse.functionCall) {
        return this.handleFunctionCall(followUpResponse, followUpContext, options);
      }

      // 후속 어시스턴트 메시지 추가
      const followUpMessage: Message = {
        role: 'assistant' as MessageRole,
        content: followUpResponse.content || ''
      };

      // 메모리에 메시지 추가
      this.memory.addMessage(followUpMessage);

      return followUpResponse.content || '';
    } catch (error) {
      // 함수 실행 오류 처리
      const errorMessage = error instanceof Error ? error.message : String(error);

      // 오류 메시지 생성
      const functionErrorMessage: Message = {
        role: 'function' as MessageRole,
        name: functionName,
        content: JSON.stringify({ error: errorMessage })
      };

      // 메모리에 오류 메시지 추가
      this.memory.addMessage(functionErrorMessage);

      // 오류에 대한 AI의 응답 요청
      const errorContext = this.createContext(options);
      const errorResponse = await this.provider.generateCompletion(errorContext, options.providerOptions);

      // 오류 응답 메시지 추가
      const errorAssistantMessage: Message = {
        role: 'assistant' as MessageRole,
        content: errorResponse.content || ''
      };

      // 메모리에 메시지 추가
      this.memory.addMessage(errorAssistantMessage);

      return errorResponse.content || '';
    }
  }

  /**
   * 메시지 목록 반환
   * @returns 메시지 배열
   */
  getMessages(): Message[] {
    return this.memory.getMessages();
  }

  /**
   * 모든 메시지 삭제
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
    this.systemMessages = [{
      role: 'system' as MessageRole,
      content: prompt
    }];
  }

  /**
   * 시스템 메시지 설정
   * @param message 시스템 메시지 또는 메시지 배열
   */
  setSystemMessages(messages: Message | Message[]): void {
    if (Array.isArray(messages)) {
      this.systemMessages = messages.filter(msg => msg.role === 'system');
    } else if (messages.role === 'system') {
      this.systemMessages = [messages];
    }
    // 단일 시스템 메시지인 경우 시스템 프롬프트도 업데이트
    if (this.systemMessages.length === 1) {
      this.systemPrompt = this.systemMessages[0].content;
    } else {
      this.systemPrompt = undefined;
    }
  }

  /**
   * 시스템 메시지 추가
   * @param content 시스템 메시지 내용
   */
  addSystemMessage(content: string): void {
    const systemMessage: Message = {
      role: 'system' as MessageRole,
      content
    };
    this.systemMessages.push(systemMessage);
    // 다중 시스템 메시지가 있으면 시스템 프롬프트는 undefined로 설정
    this.systemPrompt = undefined;
  }

  /**
   * 함수 호출 모드 설정
   * @param mode 함수 호출 모드
   */
  setFunctionCallMode(mode: FunctionCallMode): void {
    this.functionCallConfig.defaultMode = mode;
  }

  /**
   * 함수 호출 설정
   * @param config 함수 호출 구성
   */
  configureFunctionCall(config: {
    mode?: FunctionCallMode;
    maxCalls?: number;
    timeout?: number;
    allowedFunctions?: string[];
  }): void {
    if (config.mode !== undefined) {
      this.functionCallConfig.defaultMode = config.mode;
    }
    if (config.maxCalls !== undefined) {
      this.functionCallConfig.maxCalls = config.maxCalls;
    }
    if (config.timeout !== undefined) {
      this.functionCallConfig.timeout = config.timeout;
    }
    if (config.allowedFunctions !== undefined) {
      this.functionCallConfig.allowedFunctions = config.allowedFunctions;
    }
  }
} 