/**
 * 대화 메모리 관리자
 * 대화 기록을 저장하고 관리하는 클래스
 */
/**
 * 대화 메모리 관리자 클래스
 */
export class ConversationMemory {
    /**
     * 저장된 메시지 배열
     */
    messages = [];
    /**
     * 최대 메시지 수
     */
    maxMessages;
    /**
     * 메시지 만료 시간 (밀리초)
     */
    messageExpiry;
    /**
     * 업데이트 콜백
     */
    onUpdate;
    /**
     * 생성자
     * @param options 대화 메모리 옵션
     */
    constructor(options = {}) {
        this.maxMessages = options.maxMessages || 100;
        this.messageExpiry = options.messageExpiry;
        this.onUpdate = options.onUpdate;
        if (options.initialMessages) {
            this.messages = [...options.initialMessages];
        }
    }
    /**
     * 메시지 추가
     * @param message 추가할 메시지
     */
    addMessage(message) {
        this.messages.push({
            ...message,
            // 메시지에 타임스탬프가 없으면 현재 시간 추가
            ...(this.messageExpiry && { timestamp: Date.now() })
        });
        // 최대 메시지 수 초과 시 오래된 메시지 제거
        if (this.messages.length > this.maxMessages) {
            this.messages = this.messages.slice(this.messages.length - this.maxMessages);
        }
        // 만료된 메시지 제거
        if (this.messageExpiry) {
            const expiryThreshold = Date.now() - this.messageExpiry;
            this.messages = this.messages.filter((msg) => !msg.timestamp || msg.timestamp >= expiryThreshold);
        }
        // 업데이트 콜백 호출
        if (this.onUpdate) {
            this.onUpdate(this.getMessages());
        }
    }
    /**
     * 여러 메시지 추가
     * @param messages 추가할 메시지 배열
     */
    addMessages(messages) {
        for (const message of messages) {
            this.addMessage(message);
        }
    }
    /**
     * 모든 메시지 가져오기
     * @returns 메시지 배열
     */
    getMessages() {
        return [...this.messages];
    }
    /**
     * 메시지 필터링해서 가져오기
     * @param filter 필터 함수
     * @returns 필터링된 메시지 배열
     */
    getFilteredMessages(filter) {
        return this.messages.filter(filter);
    }
    /**
     * 특정 역할의 메시지만 가져오기
     * @param role 메시지 역할
     * @returns 지정된 역할의 메시지 배열
     */
    getMessagesByRole(role) {
        return this.getFilteredMessages((msg) => msg.role === role);
    }
    /**
     * 마지막 n개 메시지 가져오기
     * @param n 가져올 메시지 수
     * @returns 마지막 n개 메시지 배열
     */
    getLastMessages(n) {
        return this.messages.slice(-n);
    }
    /**
     * 대화 기록 초기화
     */
    clear() {
        this.messages = [];
        // 업데이트 콜백 호출
        if (this.onUpdate) {
            this.onUpdate(this.getMessages());
        }
    }
    /**
     * 대화 기록 저장
     * @returns 직렬화된 대화 기록
     */
    serialize() {
        return JSON.stringify(this.messages);
    }
    /**
     * 저장된 대화 기록 로드
     * @param serialized 직렬화된 대화 기록
     */
    deserialize(serialized) {
        try {
            const messages = JSON.parse(serialized);
            this.messages = messages;
            // 업데이트 콜백 호출
            if (this.onUpdate) {
                this.onUpdate(this.getMessages());
            }
        }
        catch (error) {
            throw new Error('Invalid serialized conversation memory');
        }
    }
}
//# sourceMappingURL=conversation-memory.js.map