/**
 * MCP 제공자 (Model Context Protocol Provider)
 *
 * @module MCPProvider
 * @description
 * MCP(Model Context Protocol)를 통해 AI 모델과 통신하는 제공자 클래스입니다.
 * @modelcontextprotocol/sdk 라이브러리의 클라이언트를 사용합니다.
 */
import type { ToolProvider, ToolProviderOptions, ToolProviderResponse } from '../types/provider';
import type { ModelContext } from '../types/model-context-protocol';
import type { MCPClient } from '../types/mcp';
import type { BaseClientAdapter } from './client-adapter';
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
     * 클라이언트 어댑터 또는 MCP 클라이언트 인스턴스
     *
     * BaseClientAdapter 또는 MCPClient 중 하나가 필요합니다.
     */
    clientAdapter?: BaseClientAdapter;
    client?: MCPClient;
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
    /**
     * OpenAPI 스키마 (clientAdapter 대신 사용 가능)
     */
    openAPISchema?: string | object;
    /**
     * API 기본 URL (openAPISchema와 함께 사용)
     */
    baseURL?: string;
    /**
     * HTTP 헤더 (openAPISchema와 함께 사용)
     */
    headers?: Record<string, string>;
}
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
export declare class MCPProvider implements ToolProvider {
    /**
     * 제공자 식별자
     */
    id: string;
    /**
     * 제공자 옵션
     */
    options: ToolProviderOptions;
    /**
     * 클라이언트 어댑터 인스턴스
     */
    private clientAdapter;
    /**
     * 사용할 모델 이름
     */
    private model;
    /**
     * 생성 온도
     */
    private temperature;
    /**
     * 최대 토큰 수
     */
    private maxTokens?;
    /**
     * MCPProvider 생성자
     *
     * @constructor
     * @param {MCPProviderOptions} options - MCP 제공자 옵션
     */
    constructor(options: MCPProviderOptions);
    /**
     * MCP 형식으로 요청 변환
     *
     * @private
     * @param {ModelContext} context - 모델 컨텍스트
     * @returns {Object} MCP 형식 요청
     */
    private transformToClientRequest;
    /**
     * MCP 응답을 Robota 형식으로 변환
     *
     * @private
     * @param {any} clientResponse - 클라이언트 응답
     * @returns {ToolProviderResponse} Robota 형식 응답
     */
    private transformFromClientResponse;
    /**
     * 모델 완성 요청
     *
     * @param {ModelContext} context - 모델 컨텍스트
     * @returns {Promise<ToolProviderResponse>} 모델 응답
     */
    getCompletion(context: ModelContext): Promise<ToolProviderResponse>;
    /**
     * 생성 요청 (ToolProvider 인터페이스 구현)
     *
     * @param {ModelContext} context - 모델 컨텍스트
     * @returns {Promise<ToolProviderResponse>} 모델 응답
     */
    generateCompletion(context: ModelContext): Promise<ToolProviderResponse>;
    /**
     * 스트리밍 완성 요청
     *
     * @param {ModelContext} context - 모델 컨텍스트
     * @returns {AsyncIterable<ToolProviderResponse>} 스트림 응답
     */
    getCompletionStream(context: ModelContext): AsyncGenerator<ToolProviderResponse>;
    /**
     * 생성 스트리밍 요청 (ToolProvider 인터페이스 구현)
     *
     * @param {ModelContext} context - 모델 컨텍스트
     * @param {Partial<ToolProviderOptions>} [options] - 추가 옵션
     * @returns {Promise<AsyncIterable<ToolProviderResponse>>} 스트림 응답
     */
    generateCompletionStream(context: ModelContext, options?: Partial<ToolProviderOptions>): Promise<AsyncIterable<ToolProviderResponse>>;
    /**
     * 제공자 설정 업데이트
     *
     * @param {Partial<MCPProviderOptions>} options - 업데이트할 옵션
     */
    updateOptions(options: Partial<MCPProviderOptions>): void;
    /**
     * 기능 지원 여부 확인
     *
     * @param {string} feature - 확인할 기능 이름
     * @returns {boolean} 지원 여부
     */
    supportsFeature(feature: string): boolean;
}
//# sourceMappingURL=mcp-provider.d.ts.map