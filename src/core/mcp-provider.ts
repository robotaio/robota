/**
 * MCP 제공자 (Model Context Protocol Provider)
 * 
 * @module MCPProvider
 * @description
 * MCP(Model Context Protocol)를 통해 AI 모델과 통신하는 제공자 클래스입니다.
 * @modelcontextprotocol/sdk 라이브러리의 클라이언트를 사용합니다.
 */

import type { Provider, ProviderOptions, ProviderResponse, ProviderResponseStream } from '../types/provider';
import type { Message, ModelContext } from '../types/model-context-protocol';
import type { MCPClient } from '../types/mcp';

/**
 * 함수 호출 인터페이스
 */
export interface FunctionCall {
    name: string;
    arguments: Record<string, any>;
}

/**
 * MCP 제공자 옵션 인터페이스
 */
export interface MCPProviderOptions {
    /**
     * MCP 클라이언트 인스턴스
     */
    client: MCPClient;

    /**
     * 사용할 모델 이름
     */
    model: string;

    /**
     * 생성 온도 (0~1 사이)
     */
    temperature?: number;

    /**
     * 최대 토큰 수
     */
    maxTokens?: number;
}

/**
 * MCP 제공자 클래스
 * 
 * @class MCPProvider
 * @implements {Provider}
 * @description
 * MCP(Model Context Protocol)를 통해 AI 모델과 통신하는 제공자 클래스입니다.
 */
export class MCPProvider implements Provider {
    /**
     * 제공자 식별자
     */
    id: string = 'mcp';

    /**
     * 제공자 옵션
     */
    options: ProviderOptions;

    /**
     * MCP 클라이언트 인스턴스
     */
    private client: MCPClient;

    /**
     * 사용할 모델 이름
     */
    private model: string;

    /**
     * 생성 온도
     */
    private temperature: number;

    /**
     * 최대 토큰 수
     */
    private maxTokens?: number;

    /**
     * MCPProvider 생성자
     * 
     * @constructor
     * @param {MCPProviderOptions} options - MCP 제공자 옵션
     */
    constructor(options: MCPProviderOptions) {
        this.client = options.client;
        this.model = options.model;
        this.temperature = options.temperature || 0.7;
        this.maxTokens = options.maxTokens;

        // Provider 인터페이스 옵션 초기화
        this.options = {
            model: this.model
        };
    }

    /**
     * MCP 형식으로 요청 변환
     * 
     * @private
     * @param {ModelContext} context - 모델 컨텍스트
     * @returns {Object} MCP 형식 요청
     */
    private transformToMCPRequest(context: ModelContext): any {
        return {
            model: this.model,
            messages: context.messages.map(msg => ({
                role: msg.role,
                content: msg.content,
                name: msg.name,
                function_call: msg.functionCall ? {
                    name: msg.functionCall.name,
                    arguments: JSON.stringify(msg.functionCall.arguments)
                } : undefined
            })),
            functions: context.functions,
            temperature: this.temperature,
            max_tokens: this.maxTokens,
            stream: false
        };
    }

    /**
     * MCP 응답을 Robota 형식으로 변환
     * 
     * @private
     * @param {any} mcpResponse - MCP 응답
     * @returns {ProviderResponse} Robota 형식 응답
     */
    private transformFromMCPResponse(mcpResponse: any): ProviderResponse {
        let functionCall: FunctionCall | undefined;

        if (mcpResponse.function_call) {
            functionCall = {
                name: mcpResponse.function_call.name,
                arguments: JSON.parse(mcpResponse.function_call.arguments || '{}')
            };
        }

        return {
            content: mcpResponse.content,
            functionCall,
            usage: mcpResponse.metadata
        };
    }

    /**
     * 모델 완성 요청
     * 
     * @param {ModelContext} context - 모델 컨텍스트
     * @returns {Promise<ProviderResponse>} 모델 응답
     */
    async getCompletion(context: ModelContext): Promise<ProviderResponse> {
        try {
            const mcpRequest = this.transformToMCPRequest(context);
            const mcpResponse = await this.client.chat(mcpRequest);
            return this.transformFromMCPResponse(mcpResponse);
        } catch (error) {
            console.error('MCP 제공자 오류:', error);
            throw error;
        }
    }

    /**
     * 생성 요청 (Provider 인터페이스 구현)
     * 
     * @param {ModelContext} context - 모델 컨텍스트
     * @returns {Promise<ProviderResponse>} 모델 응답
     */
    async generateCompletion(context: ModelContext): Promise<ProviderResponse> {
        return this.getCompletion(context);
    }

    /**
     * 스트리밍 완성 요청
     * 
     * @param {ModelContext} context - 모델 컨텍스트
     * @returns {AsyncIterable<ProviderResponse>} 스트림 응답
     */
    async *getCompletionStream(context: ModelContext): AsyncGenerator<ProviderResponse> {
        try {
            const mcpRequest = this.transformToMCPRequest(context);
            mcpRequest.stream = true;

            const mcpStream = await this.client.stream(mcpRequest);

            for await (const chunk of mcpStream) {
                let functionCall: FunctionCall | undefined;

                if (chunk.function_call) {
                    functionCall = {
                        name: chunk.function_call.name,
                        arguments: JSON.parse(chunk.function_call.arguments || '{}')
                    };
                }

                yield {
                    content: chunk.content,
                    functionCall,
                    usage: chunk.metadata
                };
            }
        } catch (error) {
            console.error('MCP 스트리밍 오류:', error);
            throw error;
        }
    }

    /**
     * 생성 스트리밍 요청 (Provider 인터페이스 구현)
     * 
     * @param {ModelContext} context - 모델 컨텍스트
     * @param {Partial<ProviderOptions>} [options] - 추가 옵션
     * @returns {Promise<AsyncIterable<ProviderResponse>>} 스트림 응답
     */
    async generateCompletionStream(context: ModelContext, options?: Partial<ProviderOptions>): Promise<AsyncIterable<ProviderResponse>> {
        // 옵션이 제공되면 임시로 적용
        if (options?.model) {
            const originalModel = this.model;
            this.model = options.model;

            const generator = this.getCompletionStream(context);

            // 원래 모델로 복원
            this.model = originalModel;

            return generator;
        }

        return this.getCompletionStream(context);
    }

    /**
     * 제공자 설정 업데이트
     * 
     * @param {Partial<MCPProviderOptions>} options - 업데이트할 옵션
     */
    updateOptions(options: Partial<MCPProviderOptions>): void {
        if (options.model) {
            this.model = options.model;
            this.options.model = options.model;
        }
        if (options.temperature !== undefined) this.temperature = options.temperature;
        if (options.maxTokens !== undefined) this.maxTokens = options.maxTokens;
        if (options.client) this.client = options.client;
    }

    /**
     * 기능 지원 여부 확인
     * 
     * @param {string} feature - 확인할 기능 이름
     * @returns {boolean} 지원 여부
     */
    supportsFeature(feature: string): boolean {
        const supportedFeatures = ['function-calling', 'streaming'];
        return supportedFeatures.includes(feature);
    }
} 