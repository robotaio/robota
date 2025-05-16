/**
 * 도구 관련 타입 정의
 */
import { z } from 'zod';
import type { FunctionSchema } from './model-context-protocol';
import type { Function } from './function';
/**
 * 도구 매개변수 타입
 */
export type ToolParameter = z.ZodObject<any> | FunctionSchema['parameters'];
/**
 * 도구 결과 인터페이스
 */
export interface ToolResult<T = any> {
    /**
     * 결과 데이터
     */
    data: T;
    /**
     * 상태 코드
     */
    status: 'success' | 'error';
    /**
     * 오류 메시지 (있는 경우)
     */
    error?: string;
    /**
     * 사용자에게 보여줄 메시지
     */
    message?: string;
}
/**
 * 도구 옵션 인터페이스
 */
export interface ToolOptions<TParams = any, TResult = any> {
    /**
     * 도구 이름
     */
    name: string;
    /**
     * 도구 설명
     */
    description: string;
    /**
     * 매개변수 스키마
     */
    parameters: ToolParameter;
    /**
     * 도구 실행 로직
     */
    execute: (params: TParams) => Promise<ToolResult<TResult>> | ToolResult<TResult>;
    /**
     * 매개변수 검증 여부
     */
    validateParams?: boolean;
    /**
     * 도구 버전
     */
    version?: string;
    /**
     * 도구 카테고리
     */
    category?: string;
    /**
     * 실행 전 훅
     */
    beforeExecute?: (params: TParams) => Promise<TParams> | TParams;
    /**
     * 실행 후 훅
     */
    afterExecute?: (result: ToolResult<TResult>) => Promise<ToolResult<TResult>> | ToolResult<TResult>;
}
/**
 * 도구 인터페이스
 */
export interface Tool<TParams = any, TResult = any> extends Function<TParams, ToolResult<TResult>> {
    /**
     * 도구 이름
     */
    name: string;
    /**
     * 도구 설명
     */
    description: string;
    /**
     * 도구 카테고리
     */
    category?: string;
    /**
     * 도구 버전
     */
    version?: string;
    /**
     * 도구 실행
     */
    execute: (params: TParams) => Promise<ToolResult<TResult>> | ToolResult<TResult>;
    /**
     * 함수 스키마로 변환
     */
    toFunctionSchema(): FunctionSchema;
}
//# sourceMappingURL=tool.d.ts.map