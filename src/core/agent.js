/**
 * Robota 클래스
 *
 * @module Robota
 * @description
 * AI 에이전트를 구현하는 기본 클래스입니다.
 * 다양한 에이전트 패턴의 기반이 됩니다.
 */
import { RobotaCore } from './robota';
import { logger } from '../../packages/core/src/utils';
/**
 * Robota 클래스
 *
 * @class Robota
 * @description
 * AI 에이전트를 구현하는 기본 클래스입니다.
 * 특화된 에이전트 패턴(ReAct, Planning 등)의 기반이 됩니다.
 */
export class Robota {
    name;
    description;
    robota;
    /**
     * Robota 생성자
     *
     * @constructor
     * @param options Robota 옵션
     */
    constructor(options) {
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
    async run(input) {
        logger.info(`[${this.name}] 입력 받음: ${input}`);
        return await this.robota.run(input);
    }
    /**
     * 에이전트의 이름 반환
     */
    getName() {
        return this.name;
    }
    /**
     * 에이전트의 설명 반환
     */
    getDescription() {
        return this.description;
    }
    /**
     * 대화 기록 반환
     */
    getMessages() {
        return this.robota.getMessages();
    }
    /**
     * 대화 기록 초기화
     */
    clearMessages() {
        this.robota.clearMessages();
    }
}
//# sourceMappingURL=agent.js.map