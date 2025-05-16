/**
 * 기본 제공업체 클래스
 * 모든 제공업체의 기본 클래스
 */
import { randomUUID } from 'crypto';
/**
 * 기본 제공업체 구현
 */
export class BaseToolProvider {
    /**
     * 제공업체 ID
     */
    id;
    /**
     * 제공업체 옵션
     */
    options;
    /**
     * 생성자
     * @param options 제공업체 옵션
     */
    constructor(options) {
        this.id = randomUUID();
        this.options = {
            ...options,
            temperature: options.temperature ?? 0.7,
            maxTokens: options.maxTokens,
            stopSequences: options.stopSequences,
            streamMode: options.streamMode ?? false,
            functionCallMode: options.functionCallMode ?? 'auto'
        };
    }
    /**
     * 함수 스키마 변환
     * @param functions 함수 스키마 배열
     * @returns 제공업체별 함수 형식
     */
    transformFunctionSchemas(functions) {
        // 기본 구현은 함수 스키마를 그대로 반환
        // 각 제공업체 클래스에서 재정의
        return functions;
    }
    /**
     * 제공업체가 특정 기능을 지원하는지 확인
     * @param feature 확인할 기능 이름
     * @returns 지원 여부
     */
    supportsFeature(feature) {
        // 기본 구현은 기능 지원하지 않음
        // 각 제공업체 클래스에서 재정의
        return false;
    }
    /**
     * MCP 컨텍스트를 모델 고유 형식으로 변환
     * @param context MCP 컨텍스트
     * @returns 모델 고유 형식
     */
    convertContextToModelFormat(context) {
        // 기본 구현은 컨텍스트를 그대로 반환
        // 각 제공업체 클래스에서 재정의
        return context;
    }
    /**
     * 모델 응답을 MCP 형식으로 변환
     * @param modelResponse 모델 응답
     * @returns MCP 형식 응답
     */
    convertModelResponseToMCP(modelResponse) {
        // 기본 구현은 응답을 그대로 반환
        // 각 제공업체 클래스에서 재정의
        return modelResponse;
    }
    /**
     * 제공업체 옵션 병합
     * @param additionalOptions 추가 옵션
     * @returns 병합된 옵션
     */
    mergeOptions(additionalOptions) {
        return {
            ...this.options,
            ...additionalOptions
        };
    }
    /**
     * 제공업체 정보 문자열 반환
     * @returns 제공업체 정보 문자열
     */
    toString() {
        return `ToolProvider(id=${this.id}, model=${this.options.model})`;
    }
}
//# sourceMappingURL=base-provider.js.map