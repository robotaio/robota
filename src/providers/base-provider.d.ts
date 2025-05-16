/**
 * 기본 제공업체 클래스
 * 모든 제공업체의 기본 클래스
 */
import type { ToolProvider, ToolProviderOptions, ToolProviderResponse, ToolProviderResponseStream } from '../types/provider';
import type { ModelContext, FunctionSchema, ModelContextProtocol } from '../types/model-context-protocol';
/**
 * 기본 제공업체 구현
 */
export declare abstract class BaseToolProvider implements ToolProvider, Partial<ModelContextProtocol> {
    /**
     * 제공업체 ID
     */
    readonly id: string;
    /**
     * 제공업체 옵션
     */
    readonly options: ToolProviderOptions;
    /**
     * 생성자
     * @param options 제공업체 옵션
     */
    constructor(options: ToolProviderOptions);
    /**
     * 텍스트 완성 생성 (추상 메서드)
     * @param context 모델 컨텍스트
     * @param options 추가 옵션
     */
    abstract generateCompletion(context: ModelContext, options?: Partial<ToolProviderOptions>): Promise<ToolProviderResponse>;
    /**
     * 스트리밍 텍스트 완성 생성 (추상 메서드)
     * @param context 모델 컨텍스트
     * @param options 추가 옵션
     */
    abstract generateCompletionStream(context: ModelContext, options?: Partial<ToolProviderOptions>): Promise<ToolProviderResponseStream>;
    /**
     * 함수 스키마 변환
     * @param functions 함수 스키마 배열
     * @returns 제공업체별 함수 형식
     */
    transformFunctionSchemas(functions: FunctionSchema[]): any;
    /**
     * 제공업체가 특정 기능을 지원하는지 확인
     * @param feature 확인할 기능 이름
     * @returns 지원 여부
     */
    supportsFeature(feature: string): boolean;
    /**
     * MCP 컨텍스트를 모델 고유 형식으로 변환
     * @param context MCP 컨텍스트
     * @returns 모델 고유 형식
     */
    convertContextToModelFormat?(context: ModelContext): any;
    /**
     * 모델 응답을 MCP 형식으로 변환
     * @param modelResponse 모델 응답
     * @returns MCP 형식 응답
     */
    convertModelResponseToMCP?(modelResponse: any): ToolProviderResponse;
    /**
     * 제공업체 옵션 병합
     * @param additionalOptions 추가 옵션
     * @returns 병합된 옵션
     */
    protected mergeOptions(additionalOptions?: Partial<ToolProviderOptions>): ToolProviderOptions;
    /**
     * 제공업체 정보 문자열 반환
     * @returns 제공업체 정보 문자열
     */
    toString(): string;
}
//# sourceMappingURL=base-provider.d.ts.map