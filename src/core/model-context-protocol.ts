/**
 * 모델 컨텍스트 프로토콜(MCP)
 * 
 * 다양한 AI 모델 제공업체와 통합하기 위한 표준화된 인터페이스
 */

import type { Message, FunctionSchema, ModelResponse, Context } from '../types';

/**
 * MCP 제공업체 옵션
 */
export interface MCPProviderOptions {
    /**
     * 모델 식별자
     */
    model: string;

    /**
     * 온도 설정 (0.0 ~ 1.0)
     */
    temperature?: number;

    /**
     * 최대 토큰 수
     */
    maxTokens?: number;

    /**
     * 중지 시퀀스
     */
    stopSequences?: string[];
}

/**
 * MCP 응답 스트림 타입
 */
export interface MCPResponseStream {
    /**
     * 컨텐츠 (텍스트)
     */
    content?: string;

    /**
     * 함수 호출 (부분)
     */
    function_call?: Partial<{
        name: string;
        arguments: string;
    }>;

    /**
     * 스트림 청크가 완료되었는지 여부
     */
    isComplete?: boolean;
}

/**
 * MCP 응답 타입
 */
export interface MCPResponse {
    /**
     * 컨텐츠 (텍스트)
     */
    content?: string;

    /**
     * 함수 호출
     */
    function_call?: {
        name: string;
        arguments: string;
    };

    /**
     * 사용량 통계
     */
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

/**
 * MCP 메시지 타입
 */
export interface MCPMessage {
    /**
     * 메시지 역할
     */
    role: 'system' | 'user' | 'assistant' | 'function';

    /**
     * 메시지 컨텐츠
     */
    content: string;

    /**
     * 함수 이름 (함수 역할일 경우)
     */
    name?: string;

    /**
     * 함수 호출 정보 (어시스턴트 역할일 경우)
     */
    function_call?: {
        name: string;
        arguments: string;
    };
}

/**
 * MCP 함수 타입
 */
export interface MCPFunction {
    /**
     * 함수 이름
     */
    name: string;

    /**
     * 함수 설명
     */
    description?: string;

    /**
     * 함수 파라미터
     */
    parameters: {
        type: 'object';
        properties: Record<string, {
            type: string;
            description?: string;
            enum?: any[];
        }>;
        required?: string[];
    };
}

/**
 * MCP 제공업체 인터페이스
 * 
 * 모든 모델 제공업체는 이 인터페이스를 구현해야 합니다.
 */
export interface MCPProvider {
    /**
     * 메시지 포맷 변환
     * 
     * 표준 메시지 형식을 MCP 메시지 형식으로 변환
     * 
     * @param messages - 표준 메시지 배열
     * @returns MCP 메시지 배열
     */
    formatMessages(messages: Message[]): MCPMessage[];

    /**
     * 함수 포맷 변환
     * 
     * 표준 함수 스키마를 MCP 함수 형식으로 변환
     * 
     * @param functions - 표준 함수 스키마 배열
     * @returns MCP 함수 배열
     */
    formatFunctions(functions: FunctionSchema[]): MCPFunction[];

    /**
     * 채팅 완료
     * 
     * 주어진 컨텍스트에 대해 AI 모델의 응답을 생성
     * 
     * @param context - 대화 컨텍스트
     * @param options - 추가 옵션
     * @returns AI 모델 응답
     */
    chat(context: Context, options?: {
        temperature?: number;
        maxTokens?: number;
        functionCallMode?: 'auto' | 'force' | 'disabled';
        forcedFunction?: string;
        forcedArguments?: Record<string, any>;
    }): Promise<ModelResponse>;

    /**
     * 스트리밍 채팅 완료
     * 
     * 주어진 컨텍스트에 대해 AI 모델의 응답을 스트림으로 생성
     * 
     * @param context - 대화 컨텍스트
     * @param options - 추가 옵션
     * @returns 응답 스트림
     */
    chatStream(context: Context, options?: {
        temperature?: number;
        maxTokens?: number;
        functionCallMode?: 'auto' | 'force' | 'disabled';
        forcedFunction?: string;
        forcedArguments?: Record<string, any>;
    }): AsyncIterable<MCPResponseStream>;
} 