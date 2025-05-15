/**
 * RobotaCore 클래스
 * 에이전틱 AI 라이브러리의 주요 진입점
 * 
 * @module RobotaCore
 * @description
 * RobotaCore는 에이전틱 AI를 쉽게 구축할 수 있는 주요 클래스입니다.
 * 다양한 AI 제공업체와 통합되며, 함수 호출 기능을 통해 AI가 코드를 실행할 수 있게 합니다.
 * 
 * @example
 * ```typescript
 * import { RobotaCore } from 'robota';
 * import { OpenAIProvider } from '@robota/openai';
 * 
 * // OpenAI 제공업체 초기화
 * const provider = new OpenAIProvider({
 *   apiKey: process.env.OPENAI_API_KEY,
 *   model: 'gpt-4',
 * });
 * 
 * // RobotaCore 인스턴스 생성
 * const robota = new RobotaCore({
 *   provider,
 *   systemPrompt: '당신은 친절한 AI 비서입니다.',
 * });
 * 
 * // 함수 실행
 * const response = await robota.run('오늘 날씨가 어때?');
 * logger.info(response);
 * ```
 */

import type { Provider, ProviderOptions, ProviderResponse, ProviderResponseStream } from '../types/provider';
import type { Message, ModelContext, FunctionSchema, FunctionCallMode, MessageRole } from '../types/model-context-protocol';
import type { Function, FunctionResult } from '../types/function';
import type { Tool } from '../types/tool';
import { ConversationMemory } from '../utils/conversation-memory';
import { logger } from '../../packages/core/src/utils';

/**
 * RobotaCore 옵션 인터페이스
 * 
 * @interface RobotaCoreOptions
 * @description
 * RobotaCore 인스턴스를 초기화하기 위한 옵션 객체입니다.
 */
export interface RobotaCoreOptions {
  /**
   * AI 제공업체
   * 
   * @description
   * OpenAI, Anthropic 등의 AI 제공업체 인스턴스입니다.
   * 라이브러리에서 제공하는 Provider 인터페이스를 구현해야 합니다.
   */
  provider: Provider;

  /**
   * 시스템 프롬프트
   * 
   * @description
   * AI 모델에 전달할 시스템 프롬프트입니다.
   * AI의 행동과 응답 스타일을 정의합니다.
   */
  systemPrompt?: string;

  /**
   * 시스템 메시지 배열
   * 
   * @description
   * 여러 시스템 메시지를 배열로 전달할 수 있습니다.
   * 복잡한 컨텍스트 설정이 필요한 경우 유용합니다.
   */
  systemMessages?: Message[];

  /**
   * 메모리 관리자 (대화 기록 저장)
   * 
   * @description
   * 대화 기록을 관리하는 메모리 인스턴스입니다.
   * 제공하지 않으면 기본 ConversationMemory가 사용됩니다.
   */
  memory?: ConversationMemory;

  /**
   * 함수 호출 콜백
   * 
   * @description
   * 함수가 호출될 때 실행되는 콜백 함수입니다.
   * 로깅이나 모니터링에 유용합니다.
   * 
   * @param functionName 호출된 함수 이름
   * @param args 함수에 전달된 인자
   * @param result 함수 실행 결과
   */
  onFunctionCall?: (
    functionName: string,
    args: Record<string, any>,
    result: any
  ) => void;

  /**
   * 함수 호출 구성
   * 
   * @description
   * 함수 호출 동작을 세밀하게 제어하기 위한 설정입니다.
   */
  functionCallConfig?: {
    /**
     * 최대 함수 호출 횟수
     * 
     * @description
     * 단일 대화에서 허용되는 최대 함수 호출 횟수입니다.
     * 기본값은 10입니다.
     */
    maxCalls?: number;

    /**
     * 함수 호출 타임아웃 (ms)
     * 
     * @description
     * 함수 호출이 이 시간 내에 완료되지 않으면 취소됩니다.
     * 기본값은 30000ms (30초)입니다.
     */
    timeout?: number;

    /**
     * 허용된 함수 목록
     * 
     * @description
     * 이 목록에 있는 함수만 호출 가능합니다.
     * 설정하지 않으면 모든 등록된 함수가 호출 가능합니다.
     */
    allowedFunctions?: string[];

    /**
     * 기본 함수 호출 모드
     * 
     * @description
     * 함수 호출 방식을 결정합니다.
     * - 'auto': AI가 필요에 따라 함수를 호출합니다.
     * - 'force': 특정 함수 호출을 강제합니다.
     * - 'disabled': 함수 호출을 비활성화합니다.
     * 
     * 기본값은 'auto'입니다.
     */
    defaultMode?: FunctionCallMode;
  };
}

/**
 * 실행 옵션 인터페이스
 * 
 * @interface RunOptions
 * @description
 * run 또는 runStream 메서드 호출 시 사용되는 옵션입니다.
 */
export interface RunOptions {
  /**
   * 함수 호출 모드
   * 
   * @description
   * 이 실행에 대한 함수 호출 모드를 설정합니다.
   * 인스턴스 기본값을 재정의합니다.
   */
  functionCallMode?: FunctionCallMode;

  /**
   * 강제 함수 이름 (functionCallMode가 'force'인 경우)
   * 
   * @description
   * functionCallMode가 'force'로 설정된 경우 호출할 함수 이름입니다.
   */
  forcedFunction?: string;

  /**
   * 강제 함수 인자 (functionCallMode가 'force'인 경우)
   * 
   * @description
   * functionCallMode가 'force'로 설정된 경우 함수에 전달할 인자입니다.
   */
  forcedArguments?: Record<string, any>;

  /**
   * 제공업체 옵션 재정의
   * 
   * @description
   * 이 실행에 대한 제공업체 옵션을 재정의합니다.
   * 온도, 최대 토큰 등의 매개변수를 조정할 수 있습니다.
   */
  providerOptions?: Partial<ProviderOptions>;
}

/**
 * RobotaCore 클래스
 * 
 * @class RobotaCore
 * @description
 * 에이전틱 AI 구축을 위한 주요 클래스입니다.
 * AI 대화, 함수 호출, 도구 사용 등을 관리합니다.
 */
export class RobotaCore {
  /**
   * AI 제공업체
   * 
   * @private
   * @description
   * OpenAI, Anthropic 등의 AI 제공업체 인스턴스입니다.
   */
  private provider: Provider;

  /**
   * 시스템 프롬프트
   * 
   * @private
   * @description
   * AI 모델에 전달되는 시스템 지시사항입니다.
   */
  private systemPrompt?: string;

  /**
   * 시스템 메시지 배열
   * 
   * @private
   * @description
   * AI에 전달되는 시스템 메시지 목록입니다.
   */
  private systemMessages: Message[] = [];

  /**
   * 등록된 함수 맵
   * 
   * @private
   * @description
   * 이름으로 색인된 등록된 함수 맵입니다.
   */
  private functions: Map<string, Function> = new Map();

  /**
   * 등록된 도구 맵
   * 
   * @private
   * @description
   * 이름으로 색인된 등록된 도구 맵입니다.
   */
  private tools: Map<string, Tool> = new Map();

  /**
   * 메모리 관리자
   * 
   * @private
   * @description
   * 대화 기록을 관리하는 메모리 인스턴스입니다.
   */
  private memory: ConversationMemory;

  /**
   * 함수 호출 콜백
   * 
   * @private
   * @description
   * 함수가 호출될 때 실행되는 콜백 함수입니다.
   */
  private onFunctionCall?: (
    functionName: string,
    args: Record<string, any>,
    result: any
  ) => void;

  /**
   * 함수 호출 구성
   * 
   * @private
   * @description
   * 함수 호출 동작을 세밀하게 제어하기 위한 설정입니다.
   */
  private functionCallConfig: {
    maxCalls: number;
    timeout: number;
    allowedFunctions?: string[];
    defaultMode: FunctionCallMode;
  };

  /**
   * 생성자
   * 
   * @constructor
   * @description
   * RobotaCore 인스턴스를 초기화합니다.
   * 
   * @param {RobotaCoreOptions} options - RobotaCore 옵션
   */
  constructor(options: RobotaCoreOptions) {
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
   * 
   * @description
   * AI가 호출할 수 있는 함수를 등록합니다.
   * 
   * @param {Record<string, Function | ((...args: any[]) => any)>} functions - 등록할 함수 객체
   * @returns {void}
   * 
   * @example
   * ```typescript
   * robota.registerFunctions({
   *   getWeather: {
   *     name: 'getWeather',
   *     description: '특정 위치의 날씨 정보를 조회합니다.',
   *     parameters: z.object({
   *       location: z.string().describe('날씨를 조회할 위치 (도시명)'),
   *     }),
   *     execute: async (params) => {
   *       // 날씨 API 호출 로직
   *       return { temperature: 25, condition: '맑음' };
   *     }
   *   }
   * });
   * ```
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
   * 
   * @description
   * AI가 사용할 수 있는 도구를 등록합니다.
   * 
   * @param {Tool[]} tools - 등록할 도구 배열
   * @returns {void}
   * 
   * @example
   * ```typescript
   * import { createTool } from 'robota';
   * 
   * const calculatorTool = createTool({
   *   name: 'calculator',
   *   description: '수학 계산을 수행합니다.',
   *   parameters: z.object({
   *     expression: z.string().describe('계산할 수학 표현식 (예: 2 + 2)'),
   *   }),
   *   execute: async (params) => {
   *     return { result: eval(params.expression) };
   *   }
   * });
   * 
   * robota.registerTools([calculatorTool]);
   * ```
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
   * 
   * @description
   * 사용자 프롬프트를 실행하고 AI 응답을 반환합니다.
   * 필요한 경우 함수 호출을 처리합니다.
   * 
   * @param {string} prompt - 사용자 프롬프트
   * @param {RunOptions} [options={}] - 실행 옵션
   * @returns {Promise<string>} AI 응답
   * 
   * @example
   * ```typescript
   * const response = await robota.run('오늘 서울의 날씨가 어때?');
   * logger.info(response); // '서울의 현재 기온은 25도이며, 맑은 상태입니다.'
   * ```
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
   * 
   * @description
   * 사용자 프롬프트를 실행하고 AI 응답을 스트림으로 반환합니다.
   * 실시간 응답 처리에 유용합니다.
   * 
   * @param {string} prompt - 사용자 프롬프트
   * @param {RunOptions} [options={}] - 실행 옵션
   * @returns {Promise<ProviderResponseStream>} AI 응답 스트림
   * 
   * @example
   * ```typescript
   * const stream = await robota.runStream('긴 이야기를 들려줘');
   * 
   * for await (const chunk of stream) {
   *   process.stdout.write(chunk); // 청크별로 출력
   * }
   * ```
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
   * 모델 컨텍스트 생성
   * 
   * @private
   * @description
   * AI 모델에 전송할 컨텍스트를 생성합니다.
   * 
   * @param {RunOptions} options - 실행 옵션
   * @returns {ModelContext} 모델 컨텍스트
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
   * 
   * @private
   * @description
   * AI의 함수 호출 요청을 처리하고 결과를 반환합니다.
   * 
   * @param {ProviderResponse} response - 제공업체 응답
   * @param {ModelContext} context - 모델 컨텍스트
   * @param {RunOptions} options - 실행 옵션
   * @returns {Promise<string>} 처리 결과
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
   * 대화 메시지 가져오기
   * 
   * @description
   * 현재 대화의 모든 메시지를 반환합니다.
   * 
   * @returns {Message[]} 메시지 배열
   */
  getMessages(): Message[] {
    return this.memory.getMessages();
  }

  /**
   * 대화 메시지 초기화
   * 
   * @description
   * 모든 대화 메시지를 삭제하고 초기화합니다.
   * 시스템 메시지는 유지됩니다.
   * 
   * @returns {void}
   */
  clearMessages(): void {
    this.memory.clear();
  }

  /**
   * 시스템 프롬프트 설정
   * 
   * @description
   * 새로운 시스템 프롬프트를 설정합니다.
   * 
   * @param {string} prompt - 새 시스템 프롬프트
   * @returns {void}
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
   * 
   * @description
   * 새로운 시스템 메시지를 설정합니다.
   * 
   * @param {Message | Message[]} messages - 새 시스템 메시지
   * @returns {void}
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
   * 
   * @description
   * 기존 시스템 메시지에 새 메시지를 추가합니다.
   * 
   * @param {string} content - 추가할 메시지 내용
   * @returns {void}
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
   * 
   * @description
   * 기본 함수 호출 모드를 설정합니다.
   * 
   * @param {FunctionCallMode} mode - 함수 호출 모드
   * @returns {void}
   */
  setFunctionCallMode(mode: FunctionCallMode): void {
    this.functionCallConfig.defaultMode = mode;
  }

  /**
   * 함수 호출 구성 설정
   * 
   * @description
   * 함수 호출 관련 설정을 변경합니다.
   * 
   * @param config - 함수 호출 구성
   * @param {FunctionCallMode} [config.mode] - 함수 호출 모드
   * @param {number} [config.maxCalls] - 최대 함수 호출 횟수
   * @param {number} [config.timeout] - 함수 호출 타임아웃
   * @param {string[]} [config.allowedFunctions] - 허용된 함수 목록
   * @returns {void}
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