/**
 * MCP 제공업체 구현
 * 
 * @module McpToolProvider
 * @description
 * MCP(Model Context Protocol) 클라이언트를 ToolProvider 인터페이스로 래핑합니다.
 */

import { BaseToolProvider } from './base-provider';
import type {
    ToolProviderOptions,
    ToolProviderResponse,
    ToolProviderResponseStream
} from '../types/provider';
import type {
    ModelContext,
    FunctionSchema
} from '../types/model-context-protocol';
import { Client } from '@modelcontextprotocol/sdk';
import { logger } from '../../packages/core/src';

/**
 * MCP 제공업체 옵션 인터페이스
 */
export interface McpToolProviderOptions extends ToolProviderOptions {
    /**
     * MCP 클라이언트 인스턴스
     */
    client: Client;

    /**
     * 통합 타입: 클라이언트 또는 OpenAPI
     */
    type?: 'client' | 'openapi';

    /**
     * OpenAPI 스키마 URL 또는 객체(type이 'openapi'인 경우 필수)
     */
    schema?: string | object;

    /**
     * API 기본 URL(type이 'openapi'인 경우 필수)
     */
    baseURL?: string;

    /**
     * 요청 헤더(type이 'openapi'인 경우 유용)
     */
    headers?: Record<string, string>;
}

/**
 * MCP 제공업체 클래스
 * 
 * @class McpToolProvider
 * @extends BaseToolProvider
 * @description
 * MCP 클라이언트를 래핑하여 ToolProvider 인터페이스를 구현합니다.
 */
export class McpToolProvider extends BaseToolProvider {
    /**
     * MCP 클라이언트
     */
    private client: Client;

    /**
     * MCP 도구 목록
     */
    private mcpTools: any[] = [];

    /**
     * 생성자
     * 
     * @constructor
     * @param {McpToolProviderOptions} options - MCP 제공업체 옵션
     */
    constructor(options: McpToolProviderOptions) {
        super({
            id: 'mcp',
            ...options
        });

        if (!options.client) {
            throw new Error('MCP 클라이언트가 제공되지 않았습니다.');
        }

        this.client = options.client;

        // 초기화 즉시 MCP 도구 로드
        this.initializeMcpTools().catch(error => {
            logger.error('MCP 도구 초기화 중 오류 발생:', error);
        });
    }

    /**
     * MCP 도구 목록 초기화
     * 
     * @private
     * @returns {Promise<void>}
     */
    private async initializeMcpTools(): Promise<void> {
        try {
            // 사용 가능한 도구 목록 가져오기
            const response = await this.client.listTools();
            this.mcpTools = response.tools;
            logger.info(`MCP 도구 ${this.mcpTools.length}개를 가져왔습니다.`);

            // 도구 정보 출력 (디버깅용)
            if (this.mcpTools.length > 0) {
                logger.info('사용 가능한 MCP 도구 목록:');
                this.mcpTools.forEach(tool => {
                    logger.info(`- ${tool.name}: ${tool.description || '설명 없음'}`);
                });
            }
        } catch (error) {
            logger.error('MCP 도구 목록을 가져오는 데 실패했습니다:', error);
        }
    }

    /**
     * MCP 도구 목록 가져오기
     * 
     * @returns {Promise<any[]>} MCP 도구 목록
     */
    async listTools(): Promise<any[]> {
        try {
            // 도구 목록이 없으면 다시 가져오기
            if (this.mcpTools.length === 0) {
                await this.initializeMcpTools();
            }
            return this.mcpTools;
        } catch (error) {
            logger.error('MCP 도구 목록을 가져오는 데 실패했습니다:', error);
            throw new Error(`MCP 도구 목록 조회 오류: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * MCP 도구 호출
     * 
     * @param {string} toolName - 도구 이름
     * @param {any} params - 도구 매개변수
     * @returns {Promise<any>} 도구 호출 결과
     */
    async callTool(toolName: string, params: any): Promise<any> {
        try {
            // 도구 호출
            return await this.client.callTool({
                name: toolName,
                arguments: params
            });
        } catch (error) {
            logger.error(`MCP 도구 '${toolName}' 호출 중 오류 발생:`, error);
            throw new Error(`MCP 도구 호출 오류: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * MCP 리소스 가져오기
     * 
     * @param {string} uri - 리소스 URI
     * @returns {Promise<any>} 리소스 내용
     */
    async getResource(uri: string): Promise<any> {
        try {
            // 리소스 가져오기
            return await this.client.getResource(uri);
        } catch (error) {
            logger.error(`MCP 리소스 '${uri}' 가져오기 중 오류 발생:`, error);
            throw new Error(`MCP 리소스 가져오기 오류: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * 텍스트 완성 생성
     * 
     * @param {ModelContext} context - 모델 컨텍스트
     * @param {Partial<ToolProviderOptions>} [options] - 추가 옵션
     * @returns {Promise<ToolProviderResponse>} 제공업체 응답
     */
    async generateCompletion(
        context: ModelContext,
        options?: Partial<ToolProviderOptions>
    ): Promise<ToolProviderResponse> {
        const mergedOptions = {
            ...this.options,
            ...options
        };

        // 컨텍스트를 MCP 형식으로 변환
        const mcpContext = this.convertContextToMcpFormat(context, mergedOptions);

        try {
            // MCP 클라이언트 호출
            const mcpResponse = await this.client.run(mcpContext);

            // 응답을 ToolProviderResponse 형식으로 변환
            return this.convertMcpResponseToProviderResponse(mcpResponse);
        } catch (error) {
            logger.error('MCP 텍스트 완성 생성 중 오류 발생:', error);
            throw new Error(`MCP 텍스트 완성 생성 오류: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * 스트리밍 텍스트 완성 생성
     * 
     * @param {ModelContext} context - 모델 컨텍스트
     * @param {Partial<ToolProviderOptions>} [options] - 추가 옵션
     * @returns {Promise<ToolProviderResponseStream>} 제공업체 응답 스트림
     */
    async generateCompletionStream(
        context: ModelContext,
        options?: Partial<ToolProviderOptions>
    ): Promise<ToolProviderResponseStream> {
        const mergedOptions = {
            ...this.options,
            ...options,
            streamMode: true
        };

        // 컨텍스트를 MCP 형식으로 변환
        const mcpContext = this.convertContextToMcpFormat(context, mergedOptions);

        try {
            // MCP 클라이언트 스트림 호출
            const mcpStream = await this.client.stream(mcpContext);

            // 스트림을 ToolProviderResponseStream으로 변환하여 반환
            return this.convertMcpStreamToProviderStream(mcpStream);
        } catch (error) {
            logger.error('MCP 스트리밍 텍스트 완성 생성 중 오류 발생:', error);
            throw new Error(`MCP 스트리밍 텍스트 완성 생성 오류: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * 컨텍스트를 MCP 형식으로 변환
     * 
     * @private
     * @param {ModelContext} context - 모델 컨텍스트
     * @param {ToolProviderOptions} options - 제공업체 옵션
     * @returns {any} MCP 형식 컨텍스트
     */
    private convertContextToMcpFormat(
        context: ModelContext,
        options: ToolProviderOptions
    ): any {
        // MCP 형식에 맞게 컨텍스트 변환 로직 구현
        return {
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
            function_call: options.functionCallMode === 'force' && options.forcedFunction
                ? { name: options.forcedFunction, arguments: options.forcedArguments || {} }
                : options.functionCallMode,
            model: options.model,
            temperature: options.temperature,
            max_tokens: options.maxTokens,
            stream: options.streamMode
        };
    }

    /**
     * MCP 응답을 ToolProviderResponse 형식으로 변환
     * 
     * @private
     * @param {any} mcpResponse - MCP 응답
     * @returns {ToolProviderResponse} 제공업체 응답
     */
    private convertMcpResponseToProviderResponse(mcpResponse: any): ToolProviderResponse {
        return {
            content: mcpResponse.content,
            functionCall: mcpResponse.function_call ? {
                name: mcpResponse.function_call.name,
                arguments: JSON.parse(mcpResponse.function_call.arguments || '{}')
            } : undefined,
            usage: mcpResponse.usage,
            metadata: mcpResponse.metadata
        };
    }

    /**
     * MCP 스트림을 ToolProviderResponseStream 형식으로 변환
     * 
     * @private
     * @param {AsyncIterable<any>} mcpStream - MCP 응답 스트림
     * @returns {ToolProviderResponseStream} 제공업체 응답 스트림
     */
    private async *convertMcpStreamToProviderStream(
        mcpStream: AsyncIterable<any>
    ): ToolProviderResponseStream {
        for await (const chunk of mcpStream) {
            yield {
                content: chunk.content || chunk.delta?.content || '',
                functionCall: chunk.function_call || chunk.delta?.function_call
                    ? {
                        name: chunk.function_call?.name || chunk.delta?.function_call?.name,
                        arguments: chunk.function_call?.arguments
                            ? JSON.parse(chunk.function_call.arguments || '{}')
                            : chunk.delta?.function_call?.arguments
                                ? JSON.parse(chunk.delta.function_call.arguments || '{}')
                                : {}
                    }
                    : undefined,
                usage: chunk.usage,
                metadata: chunk.metadata
            };
        }
    }

    /**
     * 함수 스키마 변환
     * 
     * @param {FunctionSchema[]} functions - 함수 스키마 배열
     * @returns {any} 변환된 함수 스키마
     */
    transformFunctionSchemas(functions: FunctionSchema[]): any {
        // MCP 함수 스키마 변환 로직
        return functions;
    }

    /**
     * 제공업체가 특정 기능을 지원하는지 확인
     * 
     * @param {string} feature - 확인할 기능 이름
     * @returns {boolean} 지원 여부
     */
    supportsFeature(feature: string): boolean {
        const supportedFeatures = [
            'functionCalling',
            'streaming',
            'tools'
        ];

        return supportedFeatures.includes(feature);
    }

    /**
     * 연결 종료
     * 
     * @returns {Promise<void>}
     */
    async close(): Promise<void> {
        try {
            await this.client.close();
        } catch (error) {
            logger.error('MCP 클라이언트 종료 중 오류 발생:', error);
        }
    }
}

/**
 * MCP 제공업체 팩토리 함수
 * 
 * @param {Client} client - MCP 클라이언트
 * @param {Omit<McpToolProviderOptions, 'client'>} options - 제공업체 옵션
 * @returns {McpToolProvider} MCP 제공업체 인스턴스
 */
export function createMcpToolProvider(
    client: Client,
    options: Omit<McpToolProviderOptions, 'client'>
): McpToolProvider {
    return new McpToolProvider({
        ...options,
        client
    });
}

// 이전 버전과의 호환성을 위해 MCPProvider 이름 유지
export { McpToolProvider as MCPProvider };
export default McpToolProvider; 