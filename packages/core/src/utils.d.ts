/**
 * 유틸리티 함수 모음
 */
/**
 * 문자열을 청크로 나누는 함수
 *
 * @param text 나눌 문자열
 * @param chunkSize 각 청크의 최대 크기
 * @returns 문자열 청크 배열
 */
export declare function splitTextIntoChunks(text: string, chunkSize: number): string[];
/**
 * 객체에서 undefined 값을 제거하는 함수
 *
 * @param obj 정리할 객체
 * @returns undefined 값이 제거된 객체
 */
export declare function removeUndefined<T extends Record<string, any>>(obj: T): T;
/**
 * 문자열이 JSON인지 확인하는 함수
 *
 * @param str 확인할 문자열
 * @returns JSON 여부
 */
export declare function isJSON(str: string): boolean;
/**
 * 지연 함수
 *
 * @param ms 지연 시간(밀리초)
 * @returns Promise
 */
export declare function delay(ms: number): Promise<void>;
/**
 * 토큰 수 대략적 추정 함수
 *
 * @param text 측정할 텍스트
 * @returns 대략적인 토큰 수
 */
export declare function estimateTokenCount(text: string): number;
/**
 * 문자열 스트림에서 완성된 JSON 객체를 추출하는 함수
 *
 * @param text JSON 문자열 조각
 * @returns 완성된 JSON 객체와 남은 문자열
 */
export declare function extractJSONObjects(text: string): {
    objects: any[];
    remaining: string;
};
/**
 * logger 유틸리티 (console.log 대체)
 */
export declare const logger: {
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
};
//# sourceMappingURL=utils.d.ts.map