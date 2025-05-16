/**
 * MCP 제공자 (Model Context Protocol Provider)
 *
 * @module MCPProvider
 * @description
 * MCP(Model Context Protocol)를 통해 AI 모델과 통신하는 제공자 클래스입니다.
 * @modelcontextprotocol/sdk 라이브러리의 클라이언트를 사용합니다.
 */
import { createMcpToolProvider, createOpenAPIToolProvider } from './client-adapter';
/**
 * MCP 제공자 클래스
 *
 * @class MCPProvider
 * @implements {ToolProvider}
 * @description
 * MCP(Model Context Protocol)를 통해 AI 모델과 통신하는 제공자 클래스입니다.
 * 이제 다양한 클라이언트 어댑터를 지원합니다:
 * - MCP 클라이언트
 * - OpenAPI 스키마 기반 클라이언트
 * - 사용자 정의 함수 기반 클라이언트
 */
export class MCPProvider {
    /**
     * 제공자 식별자
     */
    id = 'mcp';
    /**
     * 제공자 옵션
     */
    options;
    /**
     * 클라이언트 어댑터 인스턴스
     */
    clientAdapter;
    /**
     * 사용할 모델 이름
     */
    model;
    /**
     * 생성 온도
     */
    temperature;
    /**
     * 최대 토큰 수
     */
    maxTokens;
    /**
     * MCPProvider 생성자
     *
     * @constructor
     * @param {MCPProviderOptions} options - MCP 제공자 옵션
     */
    constructor(options) {
        // 클라이언트 어댑터 초기화
        if (options.clientAdapter) {
            // 어댑터가 직접 제공된 경우
            this.clientAdapter = options.clientAdapter;
        }
        else if (options.client) {
            // MCP 클라이언트가 제공된 경우
            this.clientAdapter = createMcpToolProvider(options.client, {
                model: options.model,
                temperature: options.temperature,
                maxTokens: options.maxTokens
            });
        }
        else if (options.openAPISchema && options.baseURL) {
            // OpenAPI 스키마가 제공된 경우
            this.clientAdapter = createOpenAPIToolProvider({
                schema: options.openAPISchema,
                baseURL: options.baseURL,
                headers: options.headers,
                model: options.model,
                temperature: options.temperature,
                maxTokens: options.maxTokens
            });
        }
        else {
            throw new Error("MCPProvider 초기화에 필요한 클라이언트 어댑터, MCP 클라이언트, 또는 OpenAPI 스키마 중 하나를 제공해야 합니다.");
        }
        this.model = options.model;
        this.temperature = options.temperature || 0.7;
        this.maxTokens = options.maxTokens;
        // ToolProvider 인터페이스 옵션 초기화
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
    transformToClientRequest(context) {
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
     * @param {any} clientResponse - 클라이언트 응답
     * @returns {ToolProviderResponse} Robota 형식 응답
     */
    transformFromClientResponse(clientResponse) {
        let functionCall;
        if (clientResponse.function_call) {
            functionCall = {
                name: clientResponse.function_call.name,
                arguments: JSON.parse(clientResponse.function_call.arguments || '{}')
            };
        }
        // metadata 형식 변환
        let usage = undefined;
        if (clientResponse.metadata) {
            usage = {
                promptTokens: clientResponse.metadata.prompt_tokens || 0,
                completionTokens: clientResponse.metadata.completion_tokens || 0,
                totalTokens: clientResponse.metadata.total_tokens || 0
            };
        }
        return {
            content: clientResponse.content,
            functionCall,
            usage
        };
    }
    /**
     * 모델 완성 요청
     *
     * @param {ModelContext} context - 모델 컨텍스트
     * @returns {Promise<ToolProviderResponse>} 모델 응답
     */
    async getCompletion(context) {
        try {
            const clientRequest = this.transformToClientRequest(context);
            const clientResponse = await this.clientAdapter.chat(clientRequest);
            return this.transformFromClientResponse(clientResponse);
        }
        catch (error) {
            console.error('MCP 제공자 오류:', error);
            throw error;
        }
    }
    /**
     * 생성 요청 (ToolProvider 인터페이스 구현)
     *
     * @param {ModelContext} context - 모델 컨텍스트
     * @returns {Promise<ToolProviderResponse>} 모델 응답
     */
    async generateCompletion(context) {
        return this.getCompletion(context);
    }
    /**
     * 스트리밍 완성 요청
     *
     * @param {ModelContext} context - 모델 컨텍스트
     * @returns {AsyncIterable<ToolProviderResponse>} 스트림 응답
     */
    async *getCompletionStream(context) {
        try {
            const clientRequest = this.transformToClientRequest(context);
            clientRequest.stream = true;
            const clientStream = await this.clientAdapter.stream(clientRequest);
            for await (const chunk of clientStream) {
                let functionCall;
                if (chunk.function_call) {
                    functionCall = {
                        name: chunk.function_call.name,
                        arguments: JSON.parse(chunk.function_call.arguments || '{}')
                    };
                }
                // metadata 형식 변환
                let usage = undefined;
                if (chunk.metadata) {
                    usage = {
                        promptTokens: chunk.metadata.prompt_tokens || 0,
                        completionTokens: chunk.metadata.completion_tokens || 0,
                        totalTokens: chunk.metadata.total_tokens || 0
                    };
                }
                yield {
                    content: chunk.content,
                    functionCall,
                    usage
                };
            }
        }
        catch (error) {
            console.error('MCP 스트리밍 오류:', error);
            throw error;
        }
    }
    /**
     * 생성 스트리밍 요청 (ToolProvider 인터페이스 구현)
     *
     * @param {ModelContext} context - 모델 컨텍스트
     * @param {Partial<ToolProviderOptions>} [options] - 추가 옵션
     * @returns {Promise<AsyncIterable<ToolProviderResponse>>} 스트림 응답
     */
    async generateCompletionStream(context, options) {
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
    updateOptions(options) {
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
        // 클라이언트 어댑터 업데이트
        if (options.clientAdapter) {
            this.clientAdapter = options.clientAdapter;
        }
        else if (options.client) {
            this.clientAdapter = createMcpToolProvider(options.client, {
                model: this.model,
                temperature: this.temperature,
                maxTokens: this.maxTokens
            });
        }
        else if (options.openAPISchema && options.baseURL) {
            this.clientAdapter = createOpenAPIToolProvider({
                schema: options.openAPISchema,
                baseURL: options.baseURL,
                headers: options.headers || {},
                model: this.model,
                temperature: this.temperature,
                maxTokens: this.maxTokens
            });
        }
    }
    /**
     * 기능 지원 여부 확인
     *
     * @param {string} feature - 확인할 기능 이름
     * @returns {boolean} 지원 여부
     */
    supportsFeature(feature) {
        const supportedFeatures = ['function-calling', 'streaming'];
        return supportedFeatures.includes(feature);
    }
}
//# sourceMappingURL=mcp-provider.js.map