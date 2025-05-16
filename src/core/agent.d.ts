/**
 * Robota 클래스
 *
 * @module Robota
 * @description
 * AI 에이전트를 구현하는 기본 클래스입니다.
 * 다양한 에이전트 패턴의 기반이 됩니다.
 */
import type { ToolProvider } from '../types/provider';
import type { Message } from '../types/model-context-protocol';
import { ConversationMemory } from '../utils/conversation-memory';
import { Tool } from './tool';
import { RobotaCore } from './robota';
/**
 * Robota 옵션 인터페이스
 */
export interface RobotaOptions {
    /**
     * 에이전트 이름
     */
    name: string;
    /**
     * 에이전트 설명
     */
    description: string;
    /**
     * AI 제공업체
     */
    provider: ToolProvider;
    /**
     * 사용 가능한 도구 목록
     */
    tools?: Tool[];
    /**
     * 시스템 프롬프트
     */
    systemPrompt?: string;
    /**
     * 시스템 메시지 배열
     */
    systemMessages?: Message[];
    /**
     * 대화 메모리 관리자
     */
    memory?: ConversationMemory;
}
/**
 * Robota 클래스
 *
 * @class Robota
 * @description
 * AI 에이전트를 구현하는 기본 클래스입니다.
 * 특화된 에이전트 패턴(ReAct, Planning 등)의 기반이 됩니다.
 */
export declare class Robota {
    protected name: string;
    protected description: string;
    protected robota: RobotaCore;
    /**
     * Robota 생성자
     *
     * @constructor
     * @param options Robota 옵션
     */
    constructor(options: RobotaOptions);
    /**
     * 에이전트 실행
     *
     * @param input 사용자 입력
     * @returns 에이전트 응답
     */
    run(input: string): Promise<string>;
    /**
     * 에이전트의 이름 반환
     */
    getName(): string;
    /**
     * 에이전트의 설명 반환
     */
    getDescription(): string;
    /**
     * 대화 기록 반환
     */
    getMessages(): Message[];
    /**
     * 대화 기록 초기화
     */
    clearMessages(): void;
}
//# sourceMappingURL=agent.d.ts.map