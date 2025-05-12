/**
 * OpenAI 제공업체 클래스
 */

import OpenAI from 'openai';
import { BaseProvider } from './base-provider';
import type { ProviderOptions, ProviderResponse, ProviderResponseStream } from '../types/provider';
import type { ModelContext, Message, FunctionSchema } from '../types/model-context-protocol';

/**
 * OpenAI 제공업체 옵션 인터페이스
 */
export interface OpenAIProviderOptions extends ProviderOptions {
  /**
   * OpenAI API 키
   */
  apiKey?: string;

  /**
   * OpenAI 클라이언트 인스턴스
   */
  client: OpenAI;

  /**
   * 사용할 모델 (기본값: gpt-3.5-turbo)
   */
  model: string;

  /**
   * 응답 온도 (0~2, 기본값: 0.7)
   */
  temperature?: number;

  /**
   * 응답 토큰 수 제한
   */
  maxTokens?: number;

  /**
   * 상위 p 샘플링 (0~1)
   */
  topP?: number;

  /**
   * 빈도 페널티 (-2.0~2.0)
   */
  frequencyPenalty?: number;

  /**
   * 존재 페널티 (-2.0~2.0)
   */
  presencePenalty?: number;

  /**
   * OpenAI 조직 ID
   */
  organization?: string;

  /**
   * 사용자 정의 기본 URL
   */
  baseURL?: string;
}

/**
 * OpenAI 제공업체 클래스
 */
export class OpenAIProvider extends BaseProvider {
  /**
   * OpenAI 클라이언트
   */
  private client: OpenAI;

  /**
   * 생성자
   * @param options OpenAI 제공업체 옵션
   */
  constructor(options: OpenAIProviderOptions) {
    // model 옵션을 super 호출 전에 기본값으로 설정
    const defaultedOptions = {
      ...options,
      model: options.model || 'gpt-3.5-turbo'
    };

    super(defaultedOptions);

    this.client = options.client;
  }

  /**
   * 텍스트 완성 생성
   * @param context 모델 컨텍스트
   * @param additionalOptions 추가 옵션
   * @returns 제공업체 응답
   */
  async generateCompletion(
    context: ModelContext,
    additionalOptions?: Partial<ProviderOptions>
  ): Promise<ProviderResponse> {
    const options = this.mergeOptions(additionalOptions);
    const openaiFormat = this.convertContextToModelFormat(context);

    try {
      const requestParams: OpenAI.Chat.ChatCompletionCreateParams = {
        model: options.model,
        messages: openaiFormat.messages,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        top_p: (options as OpenAIProviderOptions).topP,
        frequency_penalty: (options as OpenAIProviderOptions).frequencyPenalty,
        presence_penalty: (options as OpenAIProviderOptions).presencePenalty,
        stop: options.stopSequences,
        stream: false
      };

      // 함수 호출 모드 처리
      if (openaiFormat.functions && openaiFormat.functions.length > 0) {
        requestParams.functions = openaiFormat.functions;

        // 함수 호출 모드 설정
        if (options.functionCallMode === 'auto') {
          requestParams.function_call = 'auto';
        } else if (options.functionCallMode === 'disabled') {
          requestParams.function_call = 'none';
        } else if (options.functionCallMode === 'force' && additionalOptions?.forcedFunction) {
          requestParams.function_call = {
            name: additionalOptions.forcedFunction
          };
        }
      }

      const response = await this.client.chat.completions.create(requestParams);

      return this.convertModelResponseToMCP(response);
    } catch (error) {
      // OpenAI API 오류 처리
      throw this.handleOpenAIError(error);
    }
  }

  /**
   * 스트리밍 텍스트 완성 생성
   * @param context 모델 컨텍스트
   * @param additionalOptions 추가 옵션
   * @returns 제공업체 응답 스트림
   */
  async generateCompletionStream(
    context: ModelContext,
    additionalOptions?: Partial<ProviderOptions>
  ): Promise<ProviderResponseStream> {
    const options = this.mergeOptions(additionalOptions);
    const openaiFormat = this.convertContextToModelFormat(context);

    try {
      const requestParams: OpenAI.Chat.ChatCompletionCreateParams = {
        model: options.model,
        messages: openaiFormat.messages,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        top_p: (options as OpenAIProviderOptions).topP,
        frequency_penalty: (options as OpenAIProviderOptions).frequencyPenalty,
        presence_penalty: (options as OpenAIProviderOptions).presencePenalty,
        stop: options.stopSequences,
        stream: true
      };

      // 함수 호출 모드 처리
      if (openaiFormat.functions && openaiFormat.functions.length > 0) {
        requestParams.functions = openaiFormat.functions;

        // 함수 호출 모드 설정
        if (options.functionCallMode === 'auto') {
          requestParams.function_call = 'auto';
        } else if (options.functionCallMode === 'disabled') {
          requestParams.function_call = 'none';
        } else if (options.functionCallMode === 'force' && additionalOptions?.forcedFunction) {
          requestParams.function_call = {
            name: additionalOptions.forcedFunction
          };
        }
      }

      const stream = await this.client.chat.completions.create(requestParams);

      // 스트림 처리 및 반환
      return this.handleOpenAIStream(stream);
    } catch (error) {
      // OpenAI API 오류 처리
      throw this.handleOpenAIError(error);
    }
  }

  /**
   * MCP 컨텍스트를 OpenAI 형식으로 변환
   * @param context MCP 컨텍스트
   * @returns OpenAI 형식 컨텍스트
   */
  convertContextToModelFormat(context: ModelContext): any {
    // 시스템 프롬프트 처리
    const messages = [...context.messages];

    // 시스템 프롬프트가 없고 컨텍스트에 시스템 프롬프트가 있는 경우 추가
    if (context.systemPrompt && !messages.some(msg => msg.role === 'system')) {
      messages.unshift({
        role: 'system',
        content: context.systemPrompt
      });
    }

    // OpenAI 형식으로 메시지 변환
    const openaiMessages = messages.map(msg => this.convertMessageToOpenAIFormat(msg));

    return {
      messages: openaiMessages,
      functions: context.functions
    };
  }

  /**
   * OpenAI 응답을 MCP 형식으로 변환
   * @param response OpenAI 응답
   * @returns MCP 형식 응답
   */
  convertModelResponseToMCP(response: OpenAI.Chat.Completions.ChatCompletion): ProviderResponse {
    const choice = response.choices[0];
    if (!choice) {
      return {
        content: '',
        metadata: {
          model: response.model
        }
      };
    }

    const message = choice.message;

    let functionCall = undefined;
    if (message.function_call) {
      try {
        functionCall = {
          name: message.function_call.name,
          arguments: JSON.parse(message.function_call.arguments)
        };
      } catch (error) {
        // JSON 파싱 오류 처리
        console.error('Error parsing function arguments:', error);
      }
    }

    return {
      content: message.content || '',
      functionCall,
      usage: response.usage ? {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens
      } : undefined,
      metadata: {
        model: response.model,
        finishReason: choice.finish_reason
      }
    };
  }

  /**
   * 메시지를 OpenAI 형식으로 변환
   * @param message MCP 메시지
   * @returns OpenAI 형식 메시지
   */
  private convertMessageToOpenAIFormat(message: Message): any {
    const { role, content, name, functionCall } = message;

    // 기본 메시지 객체
    const openaiMessage: any = {
      role: role,
      content: content
    };

    // 함수 메시지인 경우 name 추가
    if (role === 'function' && name) {
      openaiMessage.name = name;
    }

    // 함수 호출이 있는 경우 추가
    if (functionCall) {
      openaiMessage.function_call = {
        name: functionCall.name,
        arguments: JSON.stringify(functionCall.arguments)
      };
    }

    return openaiMessage;
  }

  /**
   * OpenAI 스트림 처리
   * @param stream OpenAI 스트림
   * @returns 제공업체 응답 스트림
   */
  private async *handleOpenAIStream(stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>): ProviderResponseStream {
    let content = '';
    let functionName = '';
    let functionArgs = '';

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;

      // delta가 정의되지 않은 경우 스킵
      if (!delta) continue;

      if (delta.content) {
        content += delta.content;
        yield { content: delta.content };
      }

      if (delta.function_call) {
        if (delta.function_call.name) {
          functionName += delta.function_call.name;
        }

        if (delta.function_call.arguments) {
          functionArgs += delta.function_call.arguments;
        }
      }
    }

    // 스트림이 완료되면 최종 상태 반환
    if (functionName && functionArgs) {
      try {
        const args = JSON.parse(functionArgs);
        yield {
          content,
          functionCall: {
            name: functionName,
            arguments: args
          }
        };
      } catch (error) {
        console.error('Error parsing function arguments in stream:', error);
      }
    } else {
      yield { content };
    }
  }

  /**
   * OpenAI 오류 처리
   * @param error OpenAI API 오류
   * @returns 처리된 오류
   */
  private handleOpenAIError(error: any): Error {
    // OpenAI API 오류인 경우 보다 유용한 오류 메시지 제공
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error?.message || 'Unknown OpenAI API error';

      return new Error(`OpenAI API error (${status}): ${message}`);
    }

    // 네트워크 오류 또는 타임아웃
    if (error.request) {
      return new Error('Network error: No response received from OpenAI API');
    }

    // 기타 오류
    return error;
  }

  /**
   * 함수 스키마 변환
   * @param functions 함수 스키마 배열
   * @returns OpenAI 형식 함수 배열
   */
  transformFunctionSchemas(functions: FunctionSchema[]): any {
    // OpenAI는 이미 호환되므로 그대로 반환
    return functions;
  }

  /**
   * 제공업체가 특정 기능을 지원하는지 확인
   * @param feature 확인할 기능 이름
   * @returns 지원 여부
   */
  supportsFeature(feature: string): boolean {
    const supportedFeatures = [
      'function-calling',
      'streaming',
      'json-mode',
      'vision'
    ];

    return supportedFeatures.includes(feature);
  }
} 