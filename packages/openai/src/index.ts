import type { ProviderOptions } from '@robota/core';

/**
 * OpenAI 제공업체 옵션
 */
export interface OpenAIProviderOptions extends ProviderOptions {
    apiKey: string;
}

/**
 * OpenAI 제공업체 클래스
 */
export class OpenAIProvider {
    constructor(options: OpenAIProviderOptions) {
        // 초기화 로직
    }

    // 구현 예정
}

export * from './provider';
export * from './types'; 