import type {
  Message,
  RobotaOptions,
  RunOptions,
  FunctionCallMode,
  ModelResponse,
  FunctionSchema,
  StreamingResponseChunk,
  Context
} from './types';
import { SimpleMemory } from './memory';

/**
 * Robota의 메인 클래스
 * 에이전트를 초기화하고 실행하는 인터페이스 제공
 */
export class Robota {
  private provider: any;
  private systemPrompt?: string;
  private memory: any;
  private functions: Record<string, Function> = {};
  private functionSchemas: FunctionSchema[] = [];
  private functionCallConfig: {
    maxCalls: number;
    timeout: number;
    allowedFunctions?: string[];
  };
  private onFunctionCall?: (functionName: string, args: any, result: any) => void;

  /**
   * Robota 인스턴스 생성
   */
  constructor(options: RobotaOptions) {
    this.provider = options.provider;
    this.systemPrompt = options.systemPrompt;
    this.memory = options.memory || new SimpleMemory();
    this.onFunctionCall = options.onFunctionCall;

    this.functionCallConfig = {
      maxCalls: options.functionCallConfig?.maxCalls || 10,
      timeout: options.functionCallConfig?.timeout || 30000,
      allowedFunctions: options.functionCallConfig?.allowedFunctions
    };
  }

  /**
   * 여러 함수 등록
   */
  registerFunctions(functions: Record<string, Function>): void {
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
   */
  registerFunction(schema: FunctionSchema, fn: Function): void {
    this.functions[schema.name] = fn;
    this.functionSchemas.push(schema);
  }

  /**
   * 텍스트 프롬프트 실행
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
   */
  async chat(message: string, options: RunOptions = {}): Promise<string> {
    const userMessage: Message = {
      role: 'user',
      content: message
    };
    this.memory.addMessage(userMessage);

    const context = {
      messages: this.memory.getMessages(),
      functions: this.functionSchemas,
      systemPrompt: options.systemPrompt || this.systemPrompt
    };

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
   * 응답 메시지 추가
   */
  addResponseToMemory(response: ModelResponse): void {
    const assistantMessage: Message = {
      role: 'assistant',
      content: response.content || ''
    };
    this.memory.addMessage(assistantMessage);
  }

  /**
   * 모델 응답 생성
   */
  async generateCompletion(context: Context, options: RunOptions = {}): Promise<ModelResponse> {
    return this.provider.chat(context);
  }

  /**
   * 스트리밍 응답 생성
   */
  async runStream(prompt: string, options: RunOptions = {}): Promise<AsyncIterable<StreamingResponseChunk>> {
    const context = this.initializeContext(prompt, options);
    return this.provider.generateCompletionStream(context);
  }

  /**
   * 컨텍스트 초기화
   */
  private initializeContext(prompt: string, options: RunOptions): Context {
    const message: Message = {
      role: 'user',
      content: prompt
    };

    const messages = this.memory ? this.memory.getMessages() : [];
    messages.push(message);

    return {
      messages,
      functions: this.functionSchemas,
      systemPrompt: options.systemPrompt || this.systemPrompt
    };
  }

  /**
   * 함수 호출 처리
   */
  private async handleFunctionCall(
    response: ModelResponse,
    context: Context,
    options: RunOptions
  ): Promise<string> {
    if (!response.functionCall) return response.content || '';

    const { name, arguments: args } = response.functionCall;

    if (!this.functions[name]) {
      throw new Error(`Function "${name}" is not registered`);
    }

    if (
      this.functionCallConfig.allowedFunctions &&
      !this.functionCallConfig.allowedFunctions.includes(name)
    ) {
      throw new Error(`Function "${name}" is not allowed to be called`);
    }

    try {
      const result = await Promise.race([
        this.functions[name](args),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Function call timed out')),
            this.functionCallConfig.timeout)
        )
      ]);

      if (this.onFunctionCall) {
        this.onFunctionCall(name, args, result);
      }

      const functionResultMessage: Message = {
        role: 'function',
        name,
        content: typeof result === 'string' ? result : JSON.stringify(result),
        functionResult: result
      };

      context.messages.push({
        role: 'assistant',
        content: response.content || '',
        functionCall: response.functionCall
      });

      context.messages.push(functionResultMessage);

      const newResponse = await this.generateResponse(context, options);
      return newResponse.content || '';
    } catch (error) {
      throw new Error(`Error executing function "${name}": ${(error as Error).message}`);
    }
  }

  /**
   * 응답 생성
   */
  private async generateResponse(context: Context, options: RunOptions): Promise<ModelResponse> {
    const functionCallMode = options.functionCallMode || 'auto';

    return this.generateCompletion(context, {
      temperature: options.temperature,
      maxTokens: options.maxTokens,
      functionCallMode
    });
  }
} 