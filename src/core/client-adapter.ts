/**
 * 클라이언트 어댑터 모듈
 * 
 * @module ClientAdapter
 * @description
 * 다양한 AI 클라이언트 구현체를 추상화하는 어댑터 인터페이스와 구현체를 제공합니다.
 * MCPClient, OpenAPI 기반 클라이언트, 사용자 정의 함수 등 다양한 소스에서 AI 기능을 통합할 수 있습니다.
 */

import type { MCPClient } from '../types/mcp';
import type { Message, ModelContext, FunctionCallMode } from '../types/model-context-protocol';
import type { ToolProvider, ToolProviderOptions, ToolProviderResponse, ToolProviderResponseStream } from '../types/provider';
import { logger } from '../../packages/core/src/utils';

/**
 * 클라이언트 요청 옵션 인터페이스
 */
export interface ClientRequestOptions {
    /**
     * 사용할 모델 이름
     */
    model: string;

    /**
     * 메시지 배열
     */
    messages: Message[];

    /**
     * 함수 정의 배열 (함수 호출 기능에 사용)
     */
    functions?: any[];

    /**
     * 온도 설정 (0~1 사이)
     */
    temperature?: number;

    /**
     * 최대 토큰 수
     */
    max_tokens?: number;

    /**
     * 스트리밍 모드 여부
     */
    stream?: boolean;

    /**
     * 기타 추가 옵션
     */
    [key: string]: any;
}

/**
 * 클라이언트 응답 인터페이스
 */
export interface ClientResponse {
    /**
     * 응답 내용
     */
    content?: string;

    /**
     * 함수 호출 정보
     */
    function_call?: {
        name: string;
        arguments: string;
    };

    /**
     * 사용량 메타데이터
     */
    metadata?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
    };
}

/**
 * 기본 클라이언트 어댑터 추상 클래스
 * 
 * @class BaseClientAdapter
 * @implements {ToolProvider}
 * @description
 * ToolProvider 인터페이스를 구현하는 기본 클라이언트 어댑터 클래스입니다.
 * 직접 Robota에 주입할 수 있습니다.
 */
export abstract class BaseClientAdapter implements ToolProvider {
    /**
     * 제공자 식별자
     */
    id: string = 'client-adapter';

    /**
     * 제공자 옵션
     */
    options: ToolProviderOptions;

    /**
     * 사용할 모델 이름
     */
    protected model: string;

    /**
     * 생성 온도
     */
    protected temperature: number;

    /**
     * 최대 토큰 수
     */
    protected maxTokens?: number;

    /**
     * 생성자
     * 
     * @param options - 어댑터 옵션
     */
    constructor(options: {
        model: string;
        temperature?: number;
        maxTokens?: number;
    }) {
        this.model = options.model;
        this.temperature = options.temperature || 0.7;
        this.maxTokens = options.maxTokens;

        this.options = {
            model: this.model
        };
    }

    /**
     * 모델 컨텍스트를 클라이언트 요청 옵션으로 변환
     * 
     * @param context - 모델 컨텍스트
     * @returns 클라이언트 요청 옵션
     */
    protected transformContextToRequest(context: ModelContext): ClientRequestOptions {
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
     * 클라이언트 응답을 ToolProvider 응답으로 변환
     * 
     * @param response - 클라이언트 응답
     * @returns ToolProvider 응답
     */
    protected transformResponseToProvider(response: ClientResponse): ToolProviderResponse {
        let functionCall = undefined;

        if (response.function_call) {
            functionCall = {
                name: response.function_call.name,
                arguments: JSON.parse(response.function_call.arguments || '{}')
            };
        }

        // metadata 형식 변환
        let usage = undefined;
        if (response.metadata) {
            usage = {
                promptTokens: response.metadata.prompt_tokens || 0,
                completionTokens: response.metadata.completion_tokens || 0,
                totalTokens: response.metadata.total_tokens || 0
            };
        }

        return {
            content: response.content,
            functionCall,
            usage
        };
    }

    /**
     * 생성 요청 처리 (ToolProvider 인터페이스 구현)
     * 
     * @param context - 모델 컨텍스트
     * @param options - 추가 옵션
     * @returns ToolProvider 응답
     */
    async generateCompletion(context: ModelContext, options?: Partial<ToolProviderOptions>): Promise<ToolProviderResponse> {
        try {
            // 임시 모델 변경 적용
            const originalModel = this.model;
            if (options?.model) {
                this.model = options.model;
            }

            const requestOptions = this.transformContextToRequest(context);
            const response = await this.chat(requestOptions);

            // 원래 모델로 복원
            if (options?.model) {
                this.model = originalModel;
            }

            return this.transformResponseToProvider(response);
        } catch (error) {
            logger.error('클라이언트 어댑터 생성 요청 오류:', error);
            throw error;
        }
    }

    /**
     * 생성 스트리밍 요청 처리 (ToolProvider 인터페이스 구현)
     * 
     * @param context - 모델 컨텍스트
     * @param options - 추가 옵션
     * @returns ToolProvider 응답 스트림
     */
    async generateCompletionStream(context: ModelContext, options?: Partial<ToolProviderOptions>): Promise<ToolProviderResponseStream> {
        try {
            // 임시 모델 변경 적용
            const originalModel = this.model;
            if (options?.model) {
                this.model = options.model;
            }

            const requestOptions = this.transformContextToRequest(context);
            requestOptions.stream = true;

            // 스트림 생성
            const stream = this.stream(requestOptions);

            // 원래 모델로 복원
            if (options?.model) {
                this.model = originalModel;
            }

            // 응답 변환 스트림 반환
            return (async function* (adapter) {
                for await (const chunk of stream) {
                    yield adapter.transformResponseToProvider(chunk);
                }
            })(this);
        } catch (error) {
            logger.error('클라이언트 어댑터 스트리밍 요청 오류:', error);
            throw error;
        }
    }

    /**
     * 채팅 요청 처리 (추상 메서드)
     * 
     * @param options - 요청 옵션
     * @returns 클라이언트 응답
     */
    abstract chat(options: ClientRequestOptions): Promise<ClientResponse>;

    /**
     * 스트리밍 채팅 요청 처리 (추상 메서드)
     * 
     * @param options - 요청 옵션
     * @returns 응답 스트림
     */
    abstract stream(options: ClientRequestOptions): AsyncIterable<ClientResponse>;

    /**
     * 클라이언트 정보 반환 (추상 메서드)
     * 
     * @returns 클라이언트 타입 및 정보
     */
    abstract getInfo(): { type: string;[key: string]: any };

    /**
     * 설정 업데이트
     * 
     * @param options - 업데이트할 옵션
     */
    updateOptions(options: Partial<{
        model: string;
        temperature: number;
        maxTokens: number;
    }>): void {
        if (options.model) {
            this.model = options.model;
            this.options.model = options.model;
        }
        if (options.temperature !== undefined) {
            this.temperature = options.temperature;
        }
        if (options.maxTokens !== undefined) {
            this.maxTokens = options.maxTokens;
        }
    }

    /**
     * 기능 지원 여부 확인
     * 
     * @param feature - 확인할 기능 이름
     * @returns 지원 여부
     */
    supportsFeature(feature: string): boolean {
        const supportedFeatures = ['function-calling', 'streaming'];
        return supportedFeatures.includes(feature);
    }
}

/**
 * MCP 클라이언트 어댑터
 * 
 * @class MCPClientAdapter
 * @extends {BaseClientAdapter}
 * @description
 * Model Context Protocol 클라이언트를 위한 어댑터 구현입니다.
 */
export class MCPClientAdapter extends BaseClientAdapter {
    /**
     * MCP 클라이언트 인스턴스
     */
    private client: MCPClient;

    /**
     * 생성자
     * 
     * @param client - MCP 클라이언트 인스턴스
     * @param options - 어댑터 옵션
     */
    constructor(client: MCPClient, options: {
        model: string;
        temperature?: number;
        maxTokens?: number;
    }) {
        super(options);
        this.client = client;
        this.id = 'mcp';
    }

    /**
     * 채팅 요청 처리
     * 
     * @param options - 요청 옵션
     * @returns 클라이언트 응답
     */
    async chat(options: ClientRequestOptions): Promise<ClientResponse> {
        try {
            return await this.client.chat(options);
        } catch (error) {
            logger.error('MCP 클라이언트 채팅 오류:', error);
            throw error;
        }
    }

    /**
     * 스트리밍 채팅 요청 처리
     * 
     * @param options - 요청 옵션
     * @returns 응답 스트림
     */
    async *stream(options: ClientRequestOptions): AsyncIterable<ClientResponse> {
        try {
            const stream = await this.client.stream(options);
            for await (const chunk of stream) {
                yield chunk;
            }
        } catch (error) {
            logger.error('MCP 클라이언트 스트리밍 오류:', error);
            throw error;
        }
    }

    /**
     * 클라이언트 정보 반환
     * 
     * @returns 클라이언트 타입 정보
     */
    getInfo(): { type: string;[key: string]: any } {
        return {
            type: 'mcp',
            client: this.client
        };
    }
}

/**
 * OpenAPI 클라이언트 어댑터
 * 
 * @class OpenAPIClientAdapter
 * @extends {BaseClientAdapter}
 * @description
 * OpenAPI 스펙을 기반으로 한 클라이언트 어댑터 구현입니다.
 * RESTful API를 통해 AI 모델과 통신합니다.
 */
export class OpenAPIClientAdapter extends BaseClientAdapter {
    /**
     * OpenAPI 스키마 URL 또는 객체
     */
    private schema: string | object;

    /**
     * API 기본 URL
     */
    private baseURL: string;

    /**
     * HTTP 헤더
     */
    private headers: Record<string, string>;

    /**
     * 생성자
     * 
     * @param options - OpenAPI 클라이언트 옵션
     */
    constructor(options: {
        schema: string | object;
        baseURL: string;
        headers?: Record<string, string>;
        model: string;
        temperature?: number;
        maxTokens?: number;
    }) {
        super({
            model: options.model,
            temperature: options.temperature,
            maxTokens: options.maxTokens
        });
        this.schema = options.schema;
        this.baseURL = options.baseURL;
        this.headers = options.headers || {};
        this.id = 'openapi';
    }

    /**
     * 채팅 요청 처리
     * 
     * @param options - 요청 옵션
     * @returns 클라이언트 응답
     */
    async chat(options: ClientRequestOptions): Promise<ClientResponse> {
        try {
            // 실제 구현에서는 OpenAPI 기반 요청 처리 로직 필요
            // 여기서는 기본 구현만 제공
            logger.info('OpenAPI 클라이언트 요청:', options);

            // 실제 API 호출 로직 구현 필요
            throw new Error('OpenAPI 클라이언트 chat 메서드 구현 필요');

            // return {
            //   content: '응답 내용'
            // };
        } catch (error) {
            logger.error('OpenAPI 클라이언트 채팅 오류:', error);
            throw error;
        }
    }

    /**
     * 스트리밍 채팅 요청 처리
     * 
     * @param options - 요청 옵션
     * @returns 응답 스트림
     */
    async *stream(options: ClientRequestOptions): AsyncIterable<ClientResponse> {
        try {
            // 실제 구현에서는 OpenAPI 기반 스트리밍 요청 처리 로직 필요
            // 여기서는 기본 구현만 제공
            logger.info('OpenAPI 클라이언트 스트리밍 요청:', options);

            // 실제 API 호출 로직 구현 필요
            throw new Error('OpenAPI 클라이언트 stream 메서드 구현 필요');

            // yield {
            //   content: '스트림 청크'
            // };
        } catch (error) {
            logger.error('OpenAPI 클라이언트 스트리밍 오류:', error);
            throw error;
        }
    }

    /**
     * 클라이언트 정보 반환
     * 
     * @returns 클라이언트 타입 정보
     */
    getInfo(): { type: string;[key: string]: any } {
        return {
            type: 'openapi',
            schema: this.schema,
            baseURL: this.baseURL
        };
    }
}

/**
 * 함수 기반 클라이언트 어댑터
 * 
 * @class FunctionClientAdapter
 * @extends {BaseClientAdapter}
 * @description
 * 사용자 정의 함수를 기반으로 하는 클라이언트 어댑터 구현입니다.
 * 함수를 직접 정의하여 채팅 및 스트리밍 기능을 구현할 수 있습니다.
 */
export class FunctionClientAdapter extends BaseClientAdapter {
    /**
     * 채팅 처리 함수
     */
    private chatFn: (options: ClientRequestOptions) => Promise<ClientResponse>;

    /**
     * 스트리밍 처리 함수
     */
    private streamFn?: (options: ClientRequestOptions) => AsyncIterable<ClientResponse>;

    /**
     * 함수 정의 배열
     */
    private functions?: any[];

    /**
     * 생성자
     * 
     * @param options - 함수 기반 클라이언트 옵션
     */
    constructor(options: {
        chat: (options: ClientRequestOptions) => Promise<ClientResponse>;
        stream?: (options: ClientRequestOptions) => AsyncIterable<ClientResponse>;
        model: string;
        temperature?: number;
        maxTokens?: number;
        functions?: any[];
    }) {
        super({
            model: options.model,
            temperature: options.temperature,
            maxTokens: options.maxTokens
        });
        this.chatFn = options.chat;
        this.streamFn = options.stream;
        this.functions = options.functions;
        this.id = 'function';
    }

    /**
     * 모델 컨텍스트를 클라이언트 요청 옵션으로 변환
     * 
     * @param context - 모델 컨텍스트
     * @returns 클라이언트 요청 옵션
     * @override
     */
    protected transformContextToRequest(context: ModelContext): ClientRequestOptions {
        const request = super.transformContextToRequest(context);

        // 함수 정의가 있는 경우 추가
        if (this.functions && this.functions.length > 0) {
            request.functions = this.functions;
        } else if (context.functions) {
            request.functions = context.functions;
        }

        return request;
    }

    /**
     * 채팅 요청 처리
     * 
     * @param options - 요청 옵션
     * @returns 클라이언트 응답
     */
    async chat(options: ClientRequestOptions): Promise<ClientResponse> {
        try {
            return await this.chatFn(options);
        } catch (error) {
            logger.error('함수 기반 클라이언트 채팅 오류:', error);
            throw error;
        }
    }

    /**
     * 스트리밍 채팅 요청 처리
     * 
     * @param options - 요청 옵션
     * @returns 응답 스트림
     */
    async *stream(options: ClientRequestOptions): AsyncIterable<ClientResponse> {
        try {
            if (this.streamFn) {
                // 스트리밍 함수가 정의된 경우
                for await (const chunk of this.streamFn(options)) {
                    yield chunk;
                }
            } else {
                // 스트리밍 함수가 없는 경우, 일반 채팅으로 대체
                const response = await this.chatFn(options);
                yield response;
            }
        } catch (error) {
            logger.error('함수 기반 클라이언트 스트리밍 오류:', error);
            throw error;
        }
    }

    /**
     * 클라이언트 정보 반환
     * 
     * @returns 클라이언트 타입 정보
     */
    getInfo(): { type: string;[key: string]: any } {
        return {
            type: 'function'
        };
    }
}

/**
 * MCP 클라이언트 어댑터 생성 함수
 * 
 * @function createMcpToolProvider
 * @description
 * MCP 클라이언트로부터 ToolProvider를 생성합니다.
 * 
 * @param {MCPClient} client - MCP 클라이언트 인스턴스
 * @param {Object} [options] - 어댑터 옵션
 * @param {string} options.model - 사용할 모델 이름
 * @param {number} [options.temperature] - 생성 온도 (0~1)
 * @param {number} [options.maxTokens] - 최대 토큰 수
 * @returns {ToolProvider} MCP 클라이언트 기반 ToolProvider
 * 
 * @example
 * ```typescript
 * import { createMcpToolProvider } from 'robota';
 * import { Client } from '@modelcontextprotocol/sdk';
 * 
 * const mcpClient = new Client(transport);
 * const provider = createMcpToolProvider(mcpClient, {
 *   model: 'gpt-4'
 * });
 * 
 * const robota = new Robota({
 *   provider, // ToolProvider 인터페이스 직접 구현
 *   systemPrompt: '당신은 도움이 되는 AI 어시스턴트입니다.'
 * });
 * ```
 */
export function createMcpToolProvider(
    client: MCPClient,
    options: {
        model: string;
        temperature?: number;
        maxTokens?: number;
    }
): ToolProvider {
    return new MCPClientAdapter(client, options);
}

/**
 * OpenAPI 클라이언트 어댑터 생성 함수
 * 
 * @function createOpenAPIToolProvider
 * @description
 * OpenAPI 스키마로부터 ToolProvider를 생성합니다.
 * 
 * @param {Object} options - OpenAPI 클라이언트 옵션
 * @param {string|object} options.schema - OpenAPI 스키마 URL 또는 객체
 * @param {string} options.baseURL - API 기본 URL
 * @param {Record<string, string>} [options.headers] - HTTP 헤더
 * @param {string} options.model - 사용할 모델 이름
 * @param {number} [options.temperature] - 생성 온도 (0~1)
 * @param {number} [options.maxTokens] - 최대 토큰 수
 * @returns {ToolProvider} OpenAPI 스키마 기반 ToolProvider
 * 
 * @example
 * ```typescript
 * import { createOpenAPIToolProvider } from 'robota';
 * 
 * const provider = createOpenAPIToolProvider({
 *   schema: 'https://api.example.com/openapi.json',
 *   baseURL: 'https://api.example.com',
 *   headers: { 'Authorization': 'Bearer token' },
 *   model: 'gpt-4'
 * });
 * 
 * const robota = new Robota({
 *   provider, // ToolProvider 인터페이스 직접 구현
 *   systemPrompt: '당신은 도움이 되는 AI 어시스턴트입니다.'
 * });
 * ```
 */
export function createOpenAPIToolProvider(options: {
    schema: string | object;
    baseURL: string;
    headers?: Record<string, string>;
    model: string;
    temperature?: number;
    maxTokens?: number;
}): ToolProvider {
    return new OpenAPIClientAdapter(options);
}

/**
 * 함수 기반 클라이언트 어댑터 생성 함수
 * 
 * @function createFunctionToolProvider
 * @description
 * 사용자 정의 함수로부터 ToolProvider를 생성합니다.
 * 
 * @param {Object} options - 함수 기반 클라이언트 옵션
 * @param {Function} options.chat - 채팅 처리 함수
 * @param {Function} [options.stream] - 스트리밍 처리 함수 (선택적)
 * @param {string} options.model - 사용할 모델 이름
 * @param {number} [options.temperature] - 생성 온도 (0~1)
 * @param {number} [options.maxTokens] - 최대 토큰 수
 * @param {Array} [options.functions] - 함수 정의 배열 (선택적)
 * @returns {ToolProvider} 함수 기반 ToolProvider
 * 
 * @example
 * ```typescript
 * import { createFunctionToolProvider } from 'robota';
 * 
 * const provider = createFunctionToolProvider({
 *   chat: async (options) => {
 *     // 채팅 요청 구현
 *     return { content: '응답 내용' };
 *   },
 *   stream: async function* (options) {
 *     // 스트리밍 요청 구현
 *     yield { content: '스트림 청크 1' };
 *     yield { content: '스트림 청크 2' };
 *   },
 *   model: 'custom-model'
 * });
 * 
 * const robota = new Robota({
 *   provider, // ToolProvider 인터페이스 직접 구현
 *   systemPrompt: '당신은 도움이 되는 AI 어시스턴트입니다.'
 * });
 * ```
 */
export function createFunctionToolProvider(options: {
    chat: (options: ClientRequestOptions) => Promise<ClientResponse>;
    stream?: (options: ClientRequestOptions) => AsyncIterable<ClientResponse>;
    model: string;
    temperature?: number;
    maxTokens?: number;
    functions?: any[];
}): ToolProvider {
    return new FunctionClientAdapter(options);
} 