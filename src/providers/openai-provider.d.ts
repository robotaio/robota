/**
 * OpenAI 제공업체 클래스
 */
import OpenAI from 'openai';
import { BaseToolProvider } from './base-provider';
import type { ToolProviderOptions, ToolProviderResponse, ToolProviderResponseStream } from '../types/provider';
import type { ModelContext, FunctionSchema } from '../types/model-context-protocol';
/**
 * OpenAI 제공업체 옵션 인터페이스
 */
export interface OpenAIProviderOptions extends ToolProviderOptions {
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
export declare class OpenAIProvider extends BaseToolProvider {
    /**
     * OpenAI 클라이언트
     */
    private client;
    /**
     * 생성자
     * @param options OpenAI 제공업체 옵션
     */
    constructor(options: OpenAIProviderOptions);
    /**
     * 텍스트 완성 생성
     * @param context 모델 컨텍스트
     * @param additionalOptions 추가 옵션
     * @returns 제공업체 응답
     */
    generateCompletion(context: ModelContext, additionalOptions?: Partial<ToolProviderOptions>): Promise<ToolProviderResponse>;
    /**
     * 스트리밍 텍스트 완성 생성
     * @param context 모델 컨텍스트
     * @param additionalOptions 추가 옵션
     * @returns 제공업체 응답 스트림
     */
    generateCompletionStream(context: ModelContext, additionalOptions?: Partial<ToolProviderOptions>): Promise<ToolProviderResponseStream>;
    /**
     * MCP 컨텍스트를 OpenAI 형식으로 변환
     * @param context MCP 컨텍스트
     * @returns OpenAI 형식 컨텍스트
     */
    convertContextToModelFormat(context: ModelContext): any;
    /**
     * OpenAI 응답을 MCP 형식으로 변환
     * @param response OpenAI 응답
     * @returns MCP 형식 응답
     */
    convertModelResponseToMCP(response: OpenAI.Chat.Completions.ChatCompletion): ToolProviderResponse;
    /**
     * 메시지를 OpenAI 형식으로 변환
     * @param message MCP 메시지
     * @returns OpenAI 형식 메시지
     */
    private convertMessageToOpenAIFormat;
    /**
     * OpenAI 스트림 처리
     * @param stream OpenAI 스트림
     * @returns 제공업체 응답 스트림
     */
    private handleOpenAIStream;
    /**
     * OpenAI 오류 처리
     * @param error OpenAI API 오류
     * @returns 처리된 오류
     */
    private handleOpenAIError;
    /**
     * 함수 스키마 변환
     * @param functions 함수 스키마 배열
     * @returns OpenAI 형식 함수 배열
     */
    transformFunctionSchemas(functions: FunctionSchema[]): any;
    /**
     * 제공업체가 특정 기능을 지원하는지 확인
     * @param feature 확인할 기능 이름
     * @returns 지원 여부
     */
    supportsFeature(feature: string): boolean;
}
//# sourceMappingURL=openai-provider.d.ts.map