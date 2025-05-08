import Anthropic from '@anthropic-ai/sdk';
import {
    Context,
    FunctionDefinition,
    Message,
    ModelContextProtocol,
    ModelResponse,
    StreamingResponseChunk,
    removeUndefined
} from '@robota/core';
import { AnthropicProviderOptions } from './types';

/**
 * Anthropic 제공업체 구현
 */
export class AnthropicProvider implements ModelContextProtocol {
    /**
     * Anthropic 클라이언트 인스턴스
     */
    private client: Anthropic;

    /**
     * 제공업체 옵션
     */
    public options: AnthropicProviderOptions;

    constructor(options: AnthropicProviderOptions) {
        this.options = {
            temperature: 0.7,
            maxTokens: undefined,
            ...options
        };

        // 클라이언트가 주입되지 않았으면 에러 발생
        if (!options.client) {
            throw new Error('Anthropic 클라이언트가 주입되지 않았습니다. client 옵션은 필수입니다.');
        }

        this.client = options.client;
    }

    /**
     * 모델에 메시지를 전송하고 응답을 받는 메서드
     */
    async sendMessages(messages: Message[], context: Context): Promise<ModelResponse> {
        // Anthropic API 호출 구현
        // 이 구현은 예시이며, 실제 API 사용 방법에 맞게 수정해야 합니다
        try {
            const response = await this.client.messages.create({
                model: this.options.model || 'claude-3-opus',
                messages: this.formatMessages(messages),
                max_tokens: this.options.maxTokens,
                temperature: this.options.temperature,
                system: context.systemPrompt
            });

            return {
                content: response.content[0].text,
                functionCalls: [], // Anthropic의 도구 호출 구현 필요
                usage: {
                    promptTokens: response.usage.input_tokens,
                    completionTokens: response.usage.output_tokens,
                    totalTokens: response.usage.input_tokens + response.usage.output_tokens
                }
            };
        } catch (error) {
            throw new Error(`Anthropic API 호출 오류: ${error.message}`);
        }
    }

    /**
     * 스트리밍 응답을 위한 메서드
     */
    async streamMessages(messages: Message[], context: Context): Promise<AsyncIterable<StreamingResponseChunk>> {
        // 스트리밍 구현
        // 실제 API 사용 방법에 맞게 수정 필요
        const stream = await this.client.messages.create({
            model: this.options.model || 'claude-3-opus',
            messages: this.formatMessages(messages),
            max_tokens: this.options.maxTokens,
            temperature: this.options.temperature,
            system: context.systemPrompt,
            stream: true
        });

        return this.processStream(stream);
    }

    /**
     * 내부 포맷에서 Anthropic API 포맷으로 메시지 변환
     */
    private formatMessages(messages: Message[]): any[] {
        return messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));
    }

    /**
     * 스트리밍 응답 처리
     */
    private async *processStream(stream: any): AsyncIterable<StreamingResponseChunk> {
        for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.text) {
                yield {
                    content: chunk.delta.text,
                    functionCall: null
                };
            }
        }
    }
} 