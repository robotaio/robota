import {
  Context,
  FunctionCallMode,
  FunctionSchema,
  Message,
  ModelResponse,
  RunOptions,
  RobotaOptions,
  StreamingResponseChunk
} from './types';
import { SimpleMemory } from './memory';
import type { Memory } from './memory';
import type { ModelContextProtocol } from './model-context-protocol';

/**
 * Robota의 메인 클래스
 * 에이전트를 초기화하고 실행하는 인터페이스 제공
 * 
 * @example
 * ```ts
 * const robota = new Robota({
 *   provider: new OpenAIProvider({
 *     model: 'gpt-4',
 *     client: openaiClient
 *   }),
 *   systemPrompt: '당신은 도움이 되는 AI 어시스턴트입니다.'
 * });
 * 
 * const response = await robota.run('안녕하세요!');
 * ```
 */
export class Robota {
  private provider: ModelContextProtocol;
  private systemPrompt?: string;
  private systemMessages?: Message[];
  private memory: Memory;
  private functions: Record<string, Function> = {};
  private functionSchemas: FunctionSchema[] = [];
  private functionCallConfig: {
    defaultMode?: FunctionCallMode;
    maxCalls: number;
    timeout: number;
    allowedFunctions?: string[];
  };
  private onFunctionCall?: (functionName: string, args: any, result: any) => void;

  /**
   * Robota 인스턴스 생성
   * 
   * @param options - Robota 초기화 옵션
   */
  constructor(options: RobotaOptions) {
    if (!options.provider) {
      throw new Error('Provider는 필수입니다. 유효한 Provider를 지정해주세요.');
    }

    this.provider = options.provider;
    this.systemPrompt = options.systemPrompt;
    this.memory = options.memory || new SimpleMemory();
    this.onFunctionCall = options.onFunctionCall;

    // 시스템 메시지 배열 초기화
    if (options.systemMessages) {
      this.systemMessages = options.systemMessages;
    } else if (options.systemPrompt) {
      this.systemMessages = [{ role: 'system', content: options.systemPrompt }];
    }

    // 함수 호출 설정 초기화
    this.functionCallConfig = {
      defaultMode: options.functionCallConfig?.defaultMode || 'auto',
      maxCalls: options.functionCallConfig?.maxCalls || 10,
      timeout: options.functionCallConfig?.timeout || 30000,
      allowedFunctions: options.functionCallConfig?.allowedFunctions
    };
  }

  // ============================================================
  // 시스템 메시지 관리
  // ============================================================

  /**
   * 단일 시스템 프롬프트 설정
   * 
   * @param prompt - 시스템 프롬프트 내용
   */
  setSystemPrompt(prompt: string): void {
    this.systemPrompt = prompt;
    this.systemMessages = [{ role: 'system', content: prompt }];
  }

  /**
   * 여러 시스템 메시지 설정
   * 
   * @param messages - 시스템 메시지 배열
   */
  setSystemMessages(messages: Message[]): void {
    this.systemPrompt = undefined;
    this.systemMessages = messages;
  }

  /**
   * 기존 시스템 메시지에 새 시스템 메시지 추가
   * 
   * @param content - 추가할 시스템 메시지 내용
   */
  addSystemMessage(content: string): void {
    // systemPrompt 설정이 있고 systemMessages가 없거나 systemPrompt 설정과 동일한 메시지 하나만 있는 경우
    if (this.systemPrompt) {
      if (!this.systemMessages ||
        (this.systemMessages.length === 1 &&
          this.systemMessages[0].role === 'system' &&
          this.systemMessages[0].content === this.systemPrompt)) {
        this.systemMessages = [
          { role: 'system', content: this.systemPrompt },
          { role: 'system', content }
        ];
      } else {
        this.systemMessages.push({ role: 'system', content });
      }
      this.systemPrompt = undefined;
    } else {
      if (!this.systemMessages) {
        this.systemMessages = [];
      }
      this.systemMessages.push({ role: 'system', content });
    }
  }

  // ============================================================
  // 함수 호출 관리
  // ============================================================

  /**
   * 함수 호출 모드 설정
   * 
   * @param mode - 함수 호출 모드 ('auto', 'force', 'disabled')
   */
  setFunctionCallMode(mode: FunctionCallMode): void {
    this.functionCallConfig.defaultMode = mode;
  }

  /**
   * 함수 호출 설정 구성
   * 
   * @param config - 함수 호출 구성 옵션
   */
  configureFunctionCall(config: {
    mode?: FunctionCallMode;
    maxCalls?: number;
    timeout?: number;
    allowedFunctions?: string[];
  }): void {
    if (config.mode) {
      this.functionCallConfig.defaultMode = config.mode;
    }
    if (config.maxCalls !== undefined) {
      this.functionCallConfig.maxCalls = config.maxCalls;
    }
    if (config.timeout !== undefined) {
      this.functionCallConfig.timeout = config.timeout;
    }
    if (config.allowedFunctions) {
      this.functionCallConfig.allowedFunctions = config.allowedFunctions;
    }
  }

  /**
   * 여러 함수 등록
   * 
   * @param functions - 함수 이름과 구현을 담은 객체
   */
  registerFunctions(functions: Record<string, Function>): void {
    if (!functions || typeof functions !== 'object') {
      throw new Error('functions 파라미터는 객체여야 합니다.');
    }

    this.functions = { ...this.functions, ...functions };

    for (const [name, _] of Object.entries(functions)) {
      const schema: FunctionSchema = {
        name,
        description: '',
        parameters: {
          type: 'object',
          properties: {},
          required: []
        }
      };

      this.functionSchemas.push(schema);
    }
  }

  /**
   * 단일 함수 등록
   * 
   * @param schema - 함수 스키마
   * @param fn - 함수 구현
   */
  registerFunction(schema: FunctionSchema, fn: Function): void {
    if (!schema || !schema.name) {
      throw new Error('유효한 함수 스키마가 필요합니다.');
    }
    if (typeof fn !== 'function') {
      throw new Error('두 번째 인자는 함수여야 합니다.');
    }

    this.functions[schema.name] = fn;
    this.functionSchemas.push(schema);
  }

  // ============================================================
  // 실행 메서드
  // ============================================================

  /**
   * 텍스트 프롬프트 실행
   * 
   * @param prompt - 사용자 프롬프트
   * @param options - 실행 옵션
   * @returns 모델 응답 내용
   */
  async run(prompt: string, options: RunOptions = {}): Promise<string> {
    const context = this.initializeContext(prompt, options);
    const response = await this.generateResponse(context, options);

    if (response.functionCall && options.functionCallMode !== 'disabled') {
      return await this.handleFunctionCall(response, context, options);
    }

    return response.content || '';
  }

  /**
   * 채팅 메시지 처리 및 응답 생성
   * 
   * @param message - 사용자 메시지
   * @param options - 실행 옵션
   * @returns 모델 응답 내용
   */
  async chat(message: string, options: RunOptions = {}): Promise<string> {
    const userMessage: Message = {
      role: 'user',
      content: message
    };
    this.memory.addMessage(userMessage);

    const context = this.prepareContext(options);

    const response = await this.generateResponse(context, options);

    if (response.functionCall && options.functionCallMode !== 'disabled') {
      return await this.handleFunctionCall(response, context, options);
    }

    const assistantMessage: Message = {
      role: 'assistant',
      content: response.content || ''
    };
    this.memory.addMessage(assistantMessage);

    return response.content || '';
  }

  /**
   * 스트리밍 응답 생성
   * 
   * @param prompt - 사용자 프롬프트
   * @param options - 실행 옵션
   * @returns 스트리밍 응답 청크 이터레이터
   */
  async runStream(prompt: string, options: RunOptions = {}): Promise<AsyncIterable<StreamingResponseChunk>> {
    const context = this.initializeContext(prompt, options);
    return this.provider.chatStream(context, {
      temperature: options.temperature,
      maxTokens: options.maxTokens,
      functionCallMode: options.functionCallMode || this.functionCallConfig.defaultMode,
      forcedFunction: options.forcedFunction,
      forcedArguments: options.forcedArguments
    });
  }

  /**
   * 응답 메시지 추가
   * 
   * @param response - 모델 응답
   */
  addResponseToMemory(response: ModelResponse): void {
    const assistantMessage: Message = {
      role: 'assistant',
      content: response.content || ''
    };
    this.memory.addMessage(assistantMessage);
  }

  /**
   * 메모리 초기화
   */
  clearMemory(): void {
    this.memory.clear();
  }

  // ============================================================
  // 내부 헬퍼 메서드
  // ============================================================

  /**
   * 컨텍스트 초기화
   * 
   * @private
   * @param prompt - 사용자 프롬프트
   * @param options - 실행 옵션
   * @returns 초기화된 컨텍스트
   */
  private initializeContext(prompt: string, options: RunOptions): Context {
    const userMessage: Message = {
      role: 'user',
      content: prompt
    };

    // 사용자 메시지 추가
    this.memory.addMessage(userMessage);

    return this.prepareContext(options);
  }

  /**
   * 함수 호출 처리
   * 
   * @private
   * @param response - 모델 응답
   * @param context - 컨텍스트
   * @param options - 실행 옵션
   * @returns 최종 응답 내용
   */
  private async handleFunctionCall(
    response: ModelResponse,
    context: Context,
    options: RunOptions
  ): Promise<string> {
    if (!response.functionCall || !response.functionCall.name) {
      throw new Error('함수 호출 정보가 누락되었습니다.');
    }

    const functionName = response.functionCall.name;
    const fn = this.functions[functionName];

    if (!fn) {
      throw new Error(`함수 '${functionName}'이(가) 등록되지 않았습니다.`);
    }

    // 함수 호출 및 결과 처리
    try {
      const args = typeof response.functionCall.arguments === 'string'
        ? JSON.parse(response.functionCall.arguments)
        : response.functionCall.arguments;

      const result = await fn(args);

      // 함수 호출 및 결과를 메모리에 추가
      const functionMessage: Message = {
        role: 'function',
        name: functionName,
        content: JSON.stringify(result)
      };

      this.memory.addMessage(functionMessage);

      // 콜백 실행 (설정된 경우)
      if (this.onFunctionCall) {
        this.onFunctionCall(functionName, args, result);
      }

      // 함수 호출 후 새로운 응답 생성
      const newContext = this.prepareContext(options);
      const followUpResponse = await this.generateResponse(newContext, options);

      // 응답을 메모리에 추가
      this.addResponseToMemory(followUpResponse);

      return followUpResponse.content || '';
    } catch (error) {
      console.error(`함수 '${functionName}' 실행 중 오류 발생:`, error);
      throw error;
    }
  }

  /**
   * 컨텍스트 준비
   * 
   * @private
   * @param options - 실행 옵션
   * @returns 준비된 컨텍스트
   */
  private prepareContext(options: RunOptions): Context {
    const messages = this.memory ? this.memory.getMessages() : [];

    const context: Context = {
      messages,
      functions: this.functionSchemas
    };

    // 시스템 메시지 처리
    if (options.systemPrompt) {
      context.systemPrompt = options.systemPrompt;
    } else if (this.systemMessages && this.systemMessages.length > 0) {
      // 시스템 메시지가 있으면 메시지 배열 앞에 추가
      context.messages = [...this.systemMessages, ...messages];
    } else if (this.systemPrompt) {
      context.systemPrompt = this.systemPrompt;
    }

    return context;
  }

  /**
   * 모델 응답 생성
   * 
   * @private
   * @param context - 컨텍스트
   * @param options - 실행 옵션
   * @returns 모델 응답
   */
  private async generateResponse(context: Context, options: RunOptions): Promise<ModelResponse> {
    return this.provider.chat(context, {
      temperature: options.temperature,
      maxTokens: options.maxTokens,
      functionCallMode: options.functionCallMode || this.functionCallConfig.defaultMode,
      forcedFunction: options.forcedFunction,
      forcedArguments: options.forcedArguments
    });
  }
} 