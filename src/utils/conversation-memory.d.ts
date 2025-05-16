/**
 * 대화 메모리 관리자
 * 대화 기록을 저장하고 관리하는 클래스
 */
import type { Message } from '../types/model-context-protocol';
/**
 * 대화 메모리 옵션 인터페이스
 */
export interface ConversationMemoryOptions {
    /**
     * 최대 메시지 수
     */
    maxMessages?: number;
    /**
     * 초기 메시지 배열
     */
    initialMessages?: Message[];
    /**
     * 시간 기반 메시지 만료 (밀리초)
     */
    messageExpiry?: number;
    /**
     * 메시지 변경 시 호출되는 콜백
     */
    onUpdate?: (messages: Message[]) => void;
}
/**
 * 대화 메모리 관리자 클래스
 */
export declare class ConversationMemory {
    /**
     * 저장된 메시지 배열
     */
    private messages;
    /**
     * 최대 메시지 수
     */
    private maxMessages;
    /**
     * 메시지 만료 시간 (밀리초)
     */
    private messageExpiry?;
    /**
     * 업데이트 콜백
     */
    private onUpdate?;
    /**
     * 생성자
     * @param options 대화 메모리 옵션
     */
    constructor(options?: ConversationMemoryOptions);
    /**
     * 메시지 추가
     * @param message 추가할 메시지
     */
    addMessage(message: Message): void;
    /**
     * 여러 메시지 추가
     * @param messages 추가할 메시지 배열
     */
    addMessages(messages: Message[]): void;
    /**
     * 모든 메시지 가져오기
     * @returns 메시지 배열
     */
    getMessages(): Message[];
    /**
     * 메시지 필터링해서 가져오기
     * @param filter 필터 함수
     * @returns 필터링된 메시지 배열
     */
    getFilteredMessages(filter: (message: Message) => boolean): Message[];
    /**
     * 특정 역할의 메시지만 가져오기
     * @param role 메시지 역할
     * @returns 지정된 역할의 메시지 배열
     */
    getMessagesByRole(role: Message['role']): Message[];
    /**
     * 마지막 n개 메시지 가져오기
     * @param n 가져올 메시지 수
     * @returns 마지막 n개 메시지 배열
     */
    getLastMessages(n: number): Message[];
    /**
     * 대화 기록 초기화
     */
    clear(): void;
    /**
     * 대화 기록 저장
     * @returns 직렬화된 대화 기록
     */
    serialize(): string;
    /**
     * 저장된 대화 기록 로드
     * @param serialized 직렬화된 대화 기록
     */
    deserialize(serialized: string): void;
}
//# sourceMappingURL=conversation-memory.d.ts.map