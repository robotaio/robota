import {
  Context,
  FunctionCallMode,
  FunctionSchema,
  Message,
  ModelResponse,
  RunOptions,
  RobotaOptions,
  StreamingResponseChunk,
  MCPClient,
  AIClient
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
  private provider?: ModelContextProtocol;
  private mcpClient?: MCPClient;
  private aiClient?: AIClient; // 단일 AI 클라이언트
  private model?: string;
  private temperature?: number;
  private systemPrompt?: string;
  private systemMessages?: Message[];
  private memory: Memory;
  private functions: Record<string, Function> = {};
  private functionSchemas: FunctionSchema[] = [];
  private mcpTools: any[] = []; // MCP 도구 목록
  private functionCallConfig: {
    defaultMode?: FunctionCallMode;
    maxCalls: number;
    timeout: number;
    allowedFunctions?: string[];
  };
  private onFunctionCall?: (functionName: string, args: any, result: any) => void;
  private onToolCall?: (toolName: string, params: any, result: any) => void;

  /**
   * Robota 인스턴스 생성
   * 
   * @param options - Robota 초기화 옵션
   */
  constructor(options: RobotaOptions) {
    if (!options.provider && !options.mcpClient && !options.aiClient) {
      throw new Error('Provider, mcpClient, 또는 aiClient 중 하나는 반드시 제공해야 합니다.');
    }

    this.provider = options.provider;
    this.mcpClient = options.mcpClient;
    this.aiClient = options.aiClient;
    this.model = options.model;
    this.temperature = options.temperature;
    this.systemPrompt = options.systemPrompt;
    this.memory = options.memory || new SimpleMemory();
    this.onFunctionCall = options.onFunctionCall;
    this.onToolCall = options.onToolCall;

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

    // MCP 클라이언트가 있다면 즉시 초기화 진행
    if (this.mcpClient) {
      // 비동기 초기화 시작 (결과를 기다리지 않음)
      this.initializeMcpTools().then(() => {
        console.log('MCP 도구 초기화 완료');
      }).catch(error => {
        console.error('MCP 도구 초기화 중 오류 발생:', error);
      });
    }
  }

  /**
   * MCP 도구 목록 초기화
   */
  private async initializeMcpTools(): Promise<void> {
    if (!this.mcpClient) return;

    try {
      // 사용 가능한 도구 목록 가져오기 response.tools 활용
      const response = await this.mcpClient.listTools();
      this.mcpTools = response.tools;
      console.log(`MCP 도구 ${this.mcpTools.length}개를 가져왔습니다.`);

      // 도구 정보 출력 (디버깅용)
      if (this.mcpTools.length > 0) {
        console.log('사용 가능한 MCP 도구 목록:');
        this.mcpTools.forEach(tool => {
          console.log(`- ${tool.name}: ${tool.description || '설명 없음'}`);
        });
      }
    } catch (error) {
      console.error('MCP 도구 목록을 가져오는 데 실패했습니다:', error);
    }
  }

  /**
   * MCP 도구 목록 가져오기
   * 
   * @returns MCP 도구 목록
   */
  async listMcpTools(): Promise<any[]> {
    if (!this.mcpClient) {
      throw new Error('MCP 클라이언트가 설정되지 않았습니다.');
    }

    try {
      // 도구 목록이 없으면 다시 가져오기
      if (this.mcpTools.length === 0) {
        const response = await this.mcpClient.listTools();
        this.mcpTools = response.tools;
      }
      return this.mcpTools;
    } catch (error) {
      console.error('MCP 도구 목록을 가져오는 데 실패했습니다:', error);
      throw new Error(`MCP 도구 목록 조회 오류: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * MCP 도구 호출
   * 
   * @param toolName - 도구 이름
   * @param params - 도구 매개변수
   * @returns 도구 호출 결과
   */
  async callMcpTool(toolName: string, params: any): Promise<any> {
    if (!this.mcpClient) {
      throw new Error('MCP 클라이언트가 설정되지 않았습니다.');
    }

    try {
      // 도구 호출
      const result = await this.mcpClient.callTool(toolName, params);

      // 콜백 실행 (설정된 경우)
      if (this.onToolCall) {
        this.onToolCall(toolName, params, result);
      }

      return result;
    } catch (error) {
      console.error(`MCP 도구 '${toolName}' 호출 중 오류 발생:`, error);
      throw new Error(`MCP 도구 호출 오류: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * MCP 리소스 가져오기
   * 
   * @param uri - 리소스 URI
   * @returns 리소스 내용
   */
  async getMcpResource(uri: string): Promise<any> {
    if (!this.mcpClient || !this.mcpClient.getResource) {
      throw new Error('MCP 클라이언트가 리소스 가져오기를 지원하지 않습니다.');
    }

    try {
      // 리소스 가져오기
      return await this.mcpClient.getResource(uri);
    } catch (error) {
      console.error(`MCP 리소스 '${uri}' 가져오기 중 오류 발생:`, error);
      throw new Error(`MCP 리소스 가져오기 오류: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * MCP 도구를 사용하여 작업 실행
   * 
   * @param toolName - 도구 이름
   * @param params - 도구 매개변수
   * @param followUp - 도구 호출 후 후속 프롬프트
   * @returns 실행 결과
   */
  async runWithMcpTool(toolName: string, params: any, followUp?: string): Promise<string> {
    // 도구 호출
    const toolResult = await this.callMcpTool(toolName, params);

    // 도구 호출 결과를 대화 기록에 추가
    const functionMessage: Message = {
      role: 'function',
      name: toolName,
      content: JSON.stringify(toolResult)
    };
    this.memory.addMessage(functionMessage);

    // 후속 프롬프트가 있다면 실행
    if (followUp) {
      return await this.run(followUp);
    }

    // 도구 호출 결과를 문자열로 변환
    return toolResult.content || JSON.stringify(toolResult);
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
    return this.generateStream(context, options);
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
   * MCP 클라이언트를 통한 응답 생성
   * 
   * @param context - 대화 컨텍스트
   * @param options - 모델 실행 옵션
   * @returns - AI 모델의 응답
   */
  private async generateResponseWithMCP(context: Context, options: RunOptions = {}): Promise<ModelResponse> {
    if (!this.mcpClient) {
      throw new Error('MCP 클라이언트가 설정되지 않았습니다.');
    }

    const { messages, functions, systemPrompt } = context;

    // 시스템 프롬프트 추가 (없는 경우)
    const messagesWithSystem = systemPrompt && !messages.some(m => m.role === 'system')
      ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
      : messages;

    // 요청 옵션 구성
    const requestOptions: any = {
      model: this.model || 'default',
      messages: messagesWithSystem.map(m => ({
        role: m.role,
        content: m.content,
        function_call: m.functionCall,
        name: m.name
      })),
      temperature: options.temperature || this.temperature || 0.7,
    };

    if (options.maxTokens) {
      requestOptions.max_tokens = options.maxTokens;
    }

    // MCP 도구 정보 가져오기
    if (this.mcpTools.length === 0) {
      try {
        await this.initializeMcpTools();
      } catch (error) {
        console.warn('MCP 도구 목록 가져오기 실패:', error);
      }
    }

    // MCP 도구를 OpenAI의 tool 형식으로 변환
    if (this.mcpTools.length > 0) {
      const mcpToolSchemas = this.mcpTools.map(tool => ({
        type: "function",
        function: {
          name: tool.name,
          description: tool.description || '',
          parameters: tool.parameters || {
            type: 'object',
            properties: {}
          }
        }
      }));

      // OpenAI API 요청에 tools 필드 추가
      requestOptions.tools = mcpToolSchemas;

      // tool_choice 설정 (자동 호출 허용)
      requestOptions.tool_choice = "auto";
    }

    try {
      // aiClient가 있는 경우 사용
      if (this.aiClient) {
        // OpenAI 클라이언트인 경우
        if (this.aiClient.type === 'openai') {
          console.log('OpenAI 클라이언트로 MCP 요청 실행:', JSON.stringify(requestOptions, null, 2));

          const openaiResponse = await this.aiClient.instance.chat.completions.create(requestOptions);

          // 응답 형식 변환
          const response = {
            content: openaiResponse.choices[0]?.message?.content || "",
            tool_calls: openaiResponse.choices[0]?.message?.tool_calls || [],
            usage: openaiResponse.usage
          };

          console.log('OpenAI 응답:', JSON.stringify(response, null, 2));

          // 응답 파싱
          const modelResponse: ModelResponse = {
            content: response.content,
            functionCall: response.tool_calls && response.tool_calls.length > 0
              ? {
                name: response.tool_calls[0].function.name,
                arguments: typeof response.tool_calls[0].function.arguments === 'string'
                  ? JSON.parse(response.tool_calls[0].function.arguments)
                  : response.tool_calls[0].function.arguments
              }
              : undefined,
            usage: response.usage
          };

          // 도구 호출 처리: 만약 툴 호출이 MCP 도구에 해당한다면 자동으로 호출
          if (modelResponse.functionCall &&
            this.mcpTools.some(tool => tool.name === modelResponse.functionCall?.name) &&
            options.functionCallMode !== 'disabled') {
            try {
              const toolName = modelResponse.functionCall.name;
              const params = modelResponse.functionCall.arguments;

              console.log(`MCP 도구 '${toolName}' 자동 호출 실행:`, params);

              // MCP 도구 호출
              const toolResult = await this.mcpClient.callTool(toolName, params);

              console.log(`MCP 도구 '${toolName}' 호출 결과:`, toolResult);

              // 콜백 실행 (설정된 경우)
              if (this.onToolCall) {
                this.onToolCall(toolName, params, toolResult);
              }

              // 도구 호출 결과를 대화 기록에 추가
              const functionMessage: Message = {
                role: 'function',
                name: toolName,
                content: JSON.stringify(toolResult)
              };
              this.memory.addMessage(functionMessage);

              // 도구 결과를 바탕으로 후속 응답 생성
              const newContext = this.prepareContext(options);
              return await this.generateResponse(newContext, options);
            } catch (error) {
              console.error('MCP 도구 자동 호출 중 오류 발생:', error);
              // 오류 발생 시 함수 호출 정보를 제거하고 오류 메시지를 포함한 응답 반환
              return {
                content: `죄송합니다. MCP 도구 '${modelResponse.functionCall.name}'를 호출하는 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
                functionCall: undefined, // 함수 호출 정보 제거
                usage: modelResponse.usage
              };
            }
          }

          return modelResponse;
        }
        // Anthropic 등 다른 클라이언트인 경우
        else {
          throw new Error(`MCP와 함께 사용 시 OpenAI 클라이언트만 지원됩니다. 현재 타입: ${this.aiClient.type}`);
        }
      }
      // aiClient가 없는 경우 간단한 응답 반환
      else {
        return {
          content: `MCP 통합을 위해서는 OpenAI 클라이언트가 필요합니다.\n메시지: ${messagesWithSystem[messagesWithSystem.length - 1]?.content || ''}`,
          functionCall: undefined,
          usage: undefined
        };
      }
    } catch (error) {
      console.error('AI 클라이언트 호출 중 오류 발생:', error);
      throw new Error(`AI 클라이언트 호출 중 오류: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 응답 생성
   * 
   * @param context - 대화 컨텍스트
   * @param options - 모델 실행 옵션
   * @returns - AI 모델의 응답
   */
  private async generateResponse(context: Context, options: RunOptions = {}): Promise<ModelResponse> {
    // MCP 클라이언트와 AI 클라이언트가 모두 설정된 경우
    if (this.mcpClient && this.aiClient) {
      return this.generateResponseWithMCP(context, options);
    }

    // MCP 클라이언트만 설정된 경우
    if (this.mcpClient && !this.aiClient) {
      return this.generateResponseWithMCP(context, options);
    }

    // Provider가 설정된 경우 기존 로직 사용
    if (this.provider) {
      return this.provider.chat(context, {
        temperature: options.temperature,
        maxTokens: options.maxTokens,
        functionCallMode: options.functionCallMode || this.functionCallConfig.defaultMode,
        forcedFunction: options.forcedFunction,
        forcedArguments: options.forcedArguments
      });
    }

    // AI 클라이언트만 설정된 경우 처리
    if (this.aiClient) {
      const { messages, functions, systemPrompt } = context;

      // 시스템 프롬프트 추가 (없는 경우)
      const messagesWithSystem = systemPrompt && !messages.some(m => m.role === 'system')
        ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
        : messages;

      // 요청 옵션 구성
      const requestOptions: any = {
        messages: messagesWithSystem.map(m => ({
          role: m.role,
          content: m.content,
          function_call: m.functionCall,
          name: m.name
        })),
        temperature: options.temperature || this.temperature || 0.7,
      };

      if (options.maxTokens) {
        requestOptions.max_tokens = options.maxTokens;
      }

      if (this.model) {
        requestOptions.model = this.model;
      }

      // 함수가 있는 경우 요청에 포함
      if (functions && functions.length > 0) {
        requestOptions.functions = functions.map(fn => ({
          name: fn.name,
          description: fn.description || '',
          parameters: fn.parameters
        }));
      }

      // 클라이언트 타입에 따른 처리
      try {
        switch (this.aiClient.type) {
          case 'openai': {
            // OpenAI API를 사용하여 응답 생성
            const openaiResponse = await this.aiClient.instance.chat.completions.create(requestOptions);
            return {
              content: openaiResponse.choices[0]?.message?.content || "",
              functionCall: openaiResponse.choices[0]?.message?.function_call ? {
                name: openaiResponse.choices[0].message.function_call.name,
                arguments: typeof openaiResponse.choices[0].message.function_call.arguments === 'string'
                  ? JSON.parse(openaiResponse.choices[0].message.function_call.arguments)
                  : openaiResponse.choices[0].message.function_call.arguments
              } : undefined,
              usage: openaiResponse.usage ? {
                promptTokens: openaiResponse.usage.prompt_tokens,
                completionTokens: openaiResponse.usage.completion_tokens,
                totalTokens: openaiResponse.usage.total_tokens
              } : undefined
            };
          }
          case 'anthropic': {
            // Anthropic API를 사용하여 응답 생성
            const anthropicResponse = await this.aiClient.instance.messages.create(requestOptions);
            return {
              content: anthropicResponse.content[0]?.text || "",
              // Anthropic의 함수 호출 처리는 다를 수 있음
              functionCall: undefined,
              usage: undefined
            };
          }
          default:
            throw new Error(`지원되지 않는 AI 클라이언트 타입: ${this.aiClient.type}`);
        }
      } catch (error) {
        console.error('AI 클라이언트 호출 중 오류 발생:', error);
        throw new Error(`AI 클라이언트 호출 중 오류: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    throw new Error('유효한 Provider, MCP 클라이언트, 또는 AI 클라이언트가 설정되지 않았습니다.');
  }

  /**
   * 스트리밍 응답 생성 - MCP Client 사용
   */
  private async generateStreamWithMCP(context: Context, options: RunOptions = {}): Promise<AsyncIterable<StreamingResponseChunk>> {
    if (!this.mcpClient || !this.mcpClient.stream) {
      throw new Error('MCP 클라이언트가 스트리밍을 지원하지 않습니다.');
    }

    const { messages, functions, systemPrompt } = context;

    // 시스템 프롬프트 추가 (없는 경우)
    const messagesWithSystem = systemPrompt && !messages.some(m => m.role === 'system')
      ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
      : messages;

    // 요청 옵션 구성
    const requestOptions: any = {
      model: this.model || 'default',
      messages: messagesWithSystem.map(m => ({
        role: m.role,
        content: m.content,
        function_call: m.functionCall,
        name: m.name
      })),
      temperature: options.temperature || this.temperature || 0.7,
      stream: true
    };

    if (options.maxTokens) {
      requestOptions.max_tokens = options.maxTokens;
    }

    // 함수가 있는 경우 추가
    if (functions && functions.length > 0) {
      requestOptions.functions = functions.map(fn => ({
        name: fn.name,
        description: fn.description || '',
        parameters: fn.parameters
      }));
    }

    // 스트리밍 응답 처리 함수
    async function* streamProcessor(stream: AsyncIterable<any>): AsyncGenerator<StreamingResponseChunk, void, unknown> {
      for await (const chunk of stream) {
        yield {
          content: chunk.content,
          functionCall: chunk.function_call ? {
            name: chunk.function_call.name,
            arguments: chunk.function_call.arguments
          } : undefined,
          isComplete: chunk.isComplete || false
        };
      }
    }

    // MCP 클라이언트 스트리밍 호출
    const stream = await this.mcpClient.stream(requestOptions);
    return streamProcessor(stream);
  }

  /**
   * 스트리밍 응답 생성
   */
  private async generateStream(context: Context, options: RunOptions = {}): Promise<AsyncIterable<StreamingResponseChunk>> {
    // MCP 클라이언트가 설정된 경우 해당 클라이언트 사용
    if (this.mcpClient && this.mcpClient.stream) {
      return this.generateStreamWithMCP(context, options);
    }

    // Provider가 설정된 경우 기존 로직 사용
    if (this.provider) {
      return this.provider.chatStream(context, {
        temperature: options.temperature,
        maxTokens: options.maxTokens,
        functionCallMode: options.functionCallMode || this.functionCallConfig.defaultMode,
        forcedFunction: options.forcedFunction,
        forcedArguments: options.forcedArguments
      });
    }

    // AI 클라이언트 스트리밍 처리 로직
    if (this.aiClient) {
      // 클라이언트 타입에 따른 스트리밍 처리
      switch (this.aiClient.type) {
        case 'openai':
          // OpenAI 스트리밍 처리 로직
          // TODO: OpenAI 스트림 API 구현
          break;
        case 'anthropic':
          // Anthropic 스트리밍 처리 로직
          // TODO: Anthropic 스트림 API 구현
          break;
        default:
          // 기타 제공업체 스트리밍 처리
          // TODO: 커스텀 스트리밍 처리 구현
          break;
      }
    }

    throw new Error('유효한 Provider, 스트리밍을 지원하는 MCP 클라이언트, 또는 AI 클라이언트가 설정되지 않았습니다.');
  }

  /**
   * MCP 클라이언트 회기 종료
   */
  async closeMcpClient(): Promise<void> {
    if (this.mcpClient && this.mcpClient.close) {
      await this.mcpClient.close();
    }
  }
} 