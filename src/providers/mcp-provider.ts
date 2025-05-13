import { BaseProvider } from './base-provider';
import { Client } from '@modelcontextprotocol/sdk';
import type {
    ModelContext,
    ModelResponse,
    ProviderOptions,
    Message
} from '../types';

/**
 * MCP 제공자 설정 인터페이스
 */
export interface MCPProviderOptions extends ProviderOptions {
    /**
     * 통합 타입: 클라이언트 또는 OpenAPI
     */
    type: 'client' | 'openapi';

    /**
     * MCP 클라이언트(type이 'client'인 경우 필수)
     */
    client?: Client;

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

    /**
     * 사용할 모델 이름
     */
    model: string;

    /**
     * 모델 온도(창의성 조절)
     */
    temperature?: number;
}

/**
 * Model Context Protocol(MCP) 제공자 클래스
 * MCP를 지원하는 다양한 AI 모델과의 통합을 위한 제공자
 */
export class MCPProvider extends BaseProvider {
    private client: Client;
    private model: string;
    private temperature: number;

    /**
     * MCP 제공자 생성자
     * @param options MCP 제공자 설정
     */
    constructor(options: MCPProviderOptions) {
        super(options);

        if (options.type === 'client') {
            if (!options.client) {
                throw new Error('MCP 클라이언트 타입으로 설정했지만 client가 제공되지 않았습니다.');
            }
            this.client = options.client;
        } else if (options.type === 'openapi') {
            if (!options.schema || !options.baseURL) {
                throw new Error('OpenAPI 타입으로 설정했지만 schema 또는 baseURL이 제공되지 않았습니다.');
            }
            throw new Error('OpenAPI 통합은 아직 구현되지 않았습니다.');
            // TODO: OpenAPI 스키마 기반 클라이언트 구현
        } else {
            throw new Error('잘못된 MCP 제공자 타입입니다. "client" 또는 "openapi"여야 합니다.');
        }

        this.model = options.model;
        this.temperature = options.temperature ?? 0.7;
    }

    /**
     * 모델 컨텍스트를 MCP 형식으로 변환
     * @param context Robota 모델 컨텍스트
     * @returns MCP 형식의 컨텍스트
     */
    private convertContextToMCPFormat(context: ModelContext) {
        // MCP 형식으로 변환하는 로직
        return {
            messages: context.messages.map((msg: Message) => ({
                role: msg.role,
                content: msg.content,
                name: msg.name,
                function_call: msg.functionCall ? {
                    name: msg.functionCall.name,
                    arguments: JSON.stringify(msg.functionCall.arguments)
                } : undefined
            })),
            functions: context.functions,
            model: this.model,
            temperature: this.temperature
        };
    }

    /**
     * MCP 응답을 Robota 모델 응답 형식으로 변환
     * @param mcpResponse MCP에서 반환된 응답
     * @returns Robota 모델 응답
     */
    private convertMCPResponseToModelResponse(mcpResponse: any): ModelResponse {
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
     * 모델에 요청을 보내 응답을 받아옴
     * @param context 모델 컨텍스트
     * @returns 모델 응답
     */
    async run(context: ModelContext): Promise<ModelResponse> {
        try {
            const mcpContext = this.convertContextToMCPFormat(context);
            const mcpResponse = await this.client.run(mcpContext);
            return this.convertMCPResponseToModelResponse(mcpResponse);
        } catch (error) {
            console.error('MCP 제공자 실행 오류:', error);
            throw error;
        }
    }

    /**
     * 스트리밍 응답을 위한 메서드
     * @param context 모델 컨텍스트
     */
    async *stream(context: ModelContext): AsyncGenerator<ModelResponse> {
        try {
            const mcpContext = this.convertContextToMCPFormat(context);
            const mcpStream = await this.client.stream(mcpContext);

            for await (const chunk of mcpStream) {
                yield this.convertMCPResponseToModelResponse(chunk);
            }
        } catch (error) {
            console.error('MCP 제공자 스트리밍 오류:', error);
            throw error;
        }
    }
}

export default MCPProvider; 