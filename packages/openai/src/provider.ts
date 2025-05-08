import OpenAI from 'openai';
import {
  Context,
  FunctionDefinition,
  Message,
  ModelContextProtocol,
  ModelResponse,
  StreamingResponseChunk,
  removeUndefined
} from '@robota/core';
import { OpenAIProviderOptions } from './types';

/**
 * OpenAI 제공업체 구현
 */
export class OpenAIProvider implements ModelContextProtocol {
  /**
   * OpenAI 클라이언트 인스턴스
   */
  private client: OpenAI;

  /**
   * 제공업체 옵션
   */
  public options: OpenAIProviderOptions;

  constructor(options: OpenAIProviderOptions) {
    this.options = {
      temperature: 0.7,
      maxTokens: undefined,
      ...options
    };

    this.client = new OpenAI({
      apiKey: options.apiKey,
      organization: options.organization,
      timeout: options.timeout,
      baseURL: options.baseURL
    });
  }

  /**
   * 메시지를 OpenAI 형식으로 변환
   */
  formatMessages(messages: Message[]): OpenAI.Chat.ChatCompletionMessageParam[] {
    const formattedMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    for (const message of messages) {
      const { role, content, name, functionCall } = message;

      // 함수 호출 결과가 있는 경우
      if (role === 'function') {
        formattedMessages.push({
          role: 'function',
          name: name || '',
          content: typeof content === 'string' ? content : JSON.stringify(content)
        });
        continue;
      }

      // 함수 호출이 있는 경우
      if (functionCall) {
        formattedMessages.push({
          role: role === 'user' ? 'user' :
            role === 'system' ? 'system' : 'assistant',
          content: content || '',
          function_call: {
            name: functionCall.name,
            arguments: typeof functionCall.arguments === 'string'
              ? functionCall.arguments
              : JSON.stringify(functionCall.arguments)
          }
        });
        continue;
      }

      // 일반 메시지
      formattedMessages.push({
        role: role === 'user' ? 'user' :
          role === 'system' ? 'system' : 'assistant',
        content: content || '',
        name
      });
    }

    return formattedMessages;
  }

  /**
   * 함수 정의를 OpenAI 형식으로 변환
   */
  formatFunctions(functions: FunctionDefinition[]): OpenAI.Chat.ChatCompletionTool[] {
    return functions.map(fn => ({
      type: 'function',
      function: {
        name: fn.name,
        description: fn.description || '',
        parameters: fn.parameters || { type: 'object', properties: {} }
      }
    }));
  }

  /**
   * OpenAI API 응답을 표준 형식으로 변환
   */
  parseResponse(response: OpenAI.Chat.ChatCompletion): ModelResponse {
    const message = response.choices[0].message;

    const result: ModelResponse = {
      content: message.content || undefined,
      usage: response.usage ? {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens
      } : undefined,
      metadata: {
        model: response.model,
        finishReason: response.choices[0].finish_reason
      }
    };

    // 함수 호출이 있는 경우
    if (message.function_call) {
      result.functionCall = {
        name: message.function_call.name,
        arguments: message.function_call.arguments
      };
    }

    return result;
  }

  /**
   * 스트리밍 응답 청크를 표준 형식으로 변환
   */
  parseStreamingChunk(chunk: OpenAI.Chat.ChatCompletionChunk): StreamingResponseChunk {
    const delta = chunk.choices[0].delta;

    const result: StreamingResponseChunk = {
      content: delta.content || undefined,
      isComplete: chunk.choices[0].finish_reason !== null
    };

    // 함수 호출 청크가 있는 경우
    if (delta.function_call) {
      result.functionCall = {
        name: delta.function_call.name,
        arguments: delta.function_call.arguments
      };
    }

    return result;
  }

  /**
   * 모델 채팅 요청
   */
  async chat(context: Context): Promise<ModelResponse> {
    const { messages, functions, systemPrompt } = context;

    // 시스템 프롬프트 추가 (없는 경우)
    const messagesWithSystem = systemPrompt && !messages.some(m => m.role === 'system')
      ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
      : messages;

    const formattedMessages = this.formatMessages(messagesWithSystem);

    // OpenAI API 요청 옵션 구성
    const completionOptions: Partial<OpenAI.Chat.ChatCompletionCreateParams> = {
      model: this.options.model,
      messages: formattedMessages,
      temperature: this.options.temperature,
      max_tokens: this.options.maxTokens,
      stream: false
    };

    // 응답 형식이 지정된 경우
    if (this.options.responseFormat) {
      completionOptions.response_format = {
        type: this.options.responseFormat as any
      };
    }

    // 함수가 있는 경우 도구 추가
    if (functions && functions.length > 0) {
      completionOptions.tools = this.formatFunctions(functions);
    }

    // 요청 전 undefined 값 제거
    const cleanedOptions = removeUndefined(completionOptions);

    const response = await this.client.chat.completions.create(cleanedOptions as OpenAI.Chat.ChatCompletionCreateParams);
    return this.parseResponse(response as OpenAI.Chat.ChatCompletion);
  }

  /**
   * 모델 채팅 스트리밍 요청
   */
  async *chatStream(context: Context): AsyncGenerator<StreamingResponseChunk, void, unknown> {
    const { messages, functions, systemPrompt } = context;

    // 시스템 프롬프트 추가 (없는 경우)
    const messagesWithSystem = systemPrompt && !messages.some(m => m.role === 'system')
      ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
      : messages;

    const formattedMessages = this.formatMessages(messagesWithSystem);

    // OpenAI API 요청 옵션 구성
    const completionOptions: Partial<OpenAI.Chat.ChatCompletionCreateParams> = {
      model: this.options.model,
      messages: formattedMessages,
      temperature: this.options.temperature,
      max_tokens: this.options.maxTokens,
      stream: true
    };

    // 응답 형식이 지정된 경우
    if (this.options.responseFormat) {
      completionOptions.response_format = {
        type: this.options.responseFormat as any
      };
    }

    // 함수가 있는 경우 도구 추가
    if (functions && functions.length > 0) {
      completionOptions.tools = this.formatFunctions(functions);
    }

    // 요청 전 undefined 값 제거
    const cleanedOptions = removeUndefined(completionOptions);

    const stream = await this.client.chat.completions.create(cleanedOptions as OpenAI.Chat.ChatCompletionCreateParams);

    // @ts-ignore - OpenAI 스트림 타입 처리
    for await (const chunk of stream) {
      yield this.parseStreamingChunk(chunk);
    }
  }
} 