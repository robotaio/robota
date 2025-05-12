/**
 * Robota OpenAI 통합 모듈
 */

const { Provider } = require('@robota/core');

// OpenAI 제공자 클래스
class OpenAIProvider {
    constructor(options) {
        this.client = options.client;
        this.options = {
            model: options.model,
            temperature: options.temperature || 0.7
        };
    }

    async getCompletion(messages, options) {
        console.log('[OpenAIProvider] 메시지 전송:', JSON.stringify(messages, null, 2));
        return '이것은 OpenAI API의 모의 응답입니다.';
    }

    async *getCompletionStream(messages, options) {
        console.log('[OpenAIProvider] 스트리밍 요청 시작:', JSON.stringify(messages, null, 2));
        const response = '이것은 OpenAI API의 모의 스트리밍 응답입니다. 여러 청크로 나뉘어 전송됩니다.';
        const chunks = response.split(' ');

        for (const chunk of chunks) {
            yield { content: chunk + ' ' };
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
}

module.exports = {
    OpenAIProvider
}; 