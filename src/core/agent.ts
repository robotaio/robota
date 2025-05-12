/**
 * Robota 클래스
 * 
 * @module Robota
 * @description
 * AI 에이전트를 구현하는 기본 클래스입니다.
 * 다양한 에이전트 패턴의 기반이 됩니다.
 */

import type { Provider } from '../types/provider';
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
    provider: Provider;

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
export class Robota {
    protected name: string;
    protected description: string;
    protected robota: RobotaCore;

    /**
     * Robota 생성자
     * 
     * @constructor
     * @param options Robota 옵션
     */
    constructor(options: RobotaOptions) {
        this.name = options.name;
        this.description = options.description;

        // RobotaCore 인스턴스 생성
        this.robota = new RobotaCore({
            provider: options.provider,
            systemPrompt: options.systemPrompt,
            systemMessages: options.systemMessages,
            memory: options.memory
        });

        // 도구 등록
        if (options.tools && options.tools.length > 0) {
            this.robota.registerTools(options.tools);
        }
    }

    /**
     * 에이전트 실행
     * 
     * @param input 사용자 입력
     * @returns 에이전트 응답
     */
    async run(input: string): Promise<string> {
        console.log(`[${this.name}] 입력 받음: ${input}`);
        return await this.robota.run(input);
    }

    /**
     * 에이전트의 이름 반환
     */
    getName(): string {
        return this.name;
    }

    /**
     * 에이전트의 설명 반환
     */
    getDescription(): string {
        return this.description;
    }

    /**
     * 대화 기록 반환
     */
    getMessages(): Message[] {
        return this.robota.getMessages();
    }

    /**
     * 대화 기록 초기화
     */
    clearMessages(): void {
        this.robota.clearMessages();
    }
} 