/**
 * ReAct 패턴을 구현한 에이전트 클래스
 * 추론(Reasoning)과 행동(Acting)을 반복하여 복잡한 작업을 수행합니다.
 */

import { Robota } from '../core/agent';
import type { RobotaOptions } from '../core/agent';
import { Tool } from '../core/tool';
import type { Provider } from '../types/provider';
import type { Message } from '../types/model-context-protocol';
import { ConversationMemory } from '../utils/conversation-memory';

/**
 * ReAct 에이전트 옵션 인터페이스
 */
export interface ReActRobotaOptions extends RobotaOptions {
    /** 추론 과정을 출력할지 여부 */
    chainOfThought?: boolean;
    /** 최대 반복 횟수 */
    maxIterations?: number;
}

/**
 * ReAct 패턴 기반 에이전트 클래스
 * 
 * 추론(Reasoning)과 행동(Acting)을 번갈아가며 수행하여
 * 복잡한 작업을 단계적으로 해결합니다.
 */
export class ReActRobota extends Robota {
    /** 추론 과정 표시 여부 */
    private chainOfThought: boolean;
    /** 최대 반복 횟수 */
    private maxIterations: number;

    /**
     * ReAct 에이전트 생성자
     */
    constructor(options: ReActRobotaOptions) {
        super(options);
        this.chainOfThought = options.chainOfThought ?? false;
        this.maxIterations = options.maxIterations ?? 5;
    }

    /**
     * 에이전트 실행
     * 
     * @param input 사용자 입력
     * @returns 에이전트 응답
     */
    async run(input: string): Promise<string> {
        console.log(`[ReAct ${this.name}] 입력 받음: ${input}`);

        let currentInput = input;
        let iteration = 0;
        let finalResponse = '';
        let previousResponses: string[] = [];

        while (iteration < this.maxIterations) {
            // 이전 응답 포함 여부 결정
            let prompt = currentInput;
            if (iteration > 0 && this.chainOfThought) {
                // 이전 결과를 포함하여 프롬프트 구성
                prompt = `${currentInput}\n\n이전 단계:\n${previousResponses.join('\n')}`;
            }

            // Robota를 통해 응답 생성
            const response = await this.robota.run(prompt);

            // 응답 내용 분석
            const hasToolCall = response.includes('행동:') || response.includes('Action:');

            // 이전 응답에 추가
            previousResponses.push(response);

            // 도구 호출이 없거나 마지막 반복인 경우 종료
            if (!hasToolCall || iteration === this.maxIterations - 1) {
                finalResponse = formatFinalResponse(response, this.chainOfThought);
                break;
            }

            // 다음 반복을 위해 입력 업데이트
            currentInput = `이전 단계에서의 관찰 결과를 바탕으로 작업을 계속하세요.`;
            iteration++;
        }

        return finalResponse;
    }

    /**
     * 기본 시스템 프롬프트 생성
     */
    private generateDefaultSystemPrompt(): string {
        return `당신은 ${this.name}입니다. ${this.description}

당신은 사용자의 문제를 해결하기 위해 ReAct(Reasoning + Acting) 패턴을 따릅니다:

1. 생각(Reasoning): 현재 상황을 분석하고 다음 단계를 추론합니다.
2. 행동(Acting): 적절한 도구를 사용해 정보를 얻거나 작업을 수행합니다.
3. 관찰(Observation): 도구 실행 결과를 관찰하고 이해합니다.
4. 반복: 목표를 달성할 때까지 위 단계를 반복합니다.

각 단계에서 다음 형식을 따르세요:

생각: <문제에 대한 분석과 접근 방법을 설명>
행동: <사용할 도구 선택 및 매개변수 설정>
관찰: <도구 실행 결과 관찰>
(반복...)

최종적으로 사용자의 질문에 명확하고 간결하게 답변하세요.
불필요한 도구 사용은 피하고, 필요할 때만 도구를 사용하세요.
답변을 모를 경우 정직하게 모른다고 인정하세요.`;
    }

    /**
     * 최종 응답 형식화
     * 
     * Chain-of-Thought 과정을 제거하고 사용자 친화적인 응답만 추출
     */
    private formatFinalResponse(response: string, includeChainOfThought: boolean): string {
        // Chain-of-thought 패턴 제거
        if (!includeChainOfThought) {
            return response;
        }

        // "생각:" 또는 "행동:" 이후에 나오는 내용 제거
        const thoughtPattern = /(생각|Thought):/i;
        const actionPattern = /(행동|Action):/i;

        const thoughtMatch = response.match(thoughtPattern);
        const actionMatch = response.match(actionPattern);

        if (thoughtMatch || actionMatch) {
            // 최종 응답 부분 추출
            const parts = response.split(/\n(생각|Thought|행동|Action|관찰|Observation):/i);
            if (parts.length > 1) {
                // 첫 번째 부분이 최종 응답으로 간주 (분석/행동 이전의 내용)
                return parts[0].trim();
            }
        }

        return response;
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

/**
 * 기본 시스템 프롬프트 생성
 */
function generateDefaultSystemPrompt(agentName: string, agentDescription: string): string {
    return `당신은 ${agentName}입니다. ${agentDescription}

당신은 사용자의 문제를 해결하기 위해 ReAct(Reasoning + Acting) 패턴을 따릅니다:

1. 생각(Reasoning): 현재 상황을 분석하고 다음 단계를 추론합니다.
2. 행동(Acting): 적절한 도구를 사용해 정보를 얻거나 작업을 수행합니다.
3. 관찰(Observation): 도구 실행 결과를 관찰하고 이해합니다.
4. 반복: 목표를 달성할 때까지 위 단계를 반복합니다.

각 단계에서 다음 형식을 따르세요:

생각: <문제에 대한 분석과 접근 방법을 설명>
행동: <사용할 도구 선택 및 매개변수 설정>
관찰: <도구 실행 결과 관찰>
(반복...)

최종적으로 사용자의 질문에 명확하고 간결하게 답변하세요.
불필요한 도구 사용은 피하고, 필요할 때만 도구를 사용하세요.
답변을 모를 경우 정직하게 모른다고 인정하세요.`;
}

/**
 * 최종 응답 형식화
 * 
 * Chain-of-Thought 과정을 제거하고 사용자 친화적인 응답만 추출
 */
function formatFinalResponse(response: string, includeChainOfThought: boolean): string {
    // Chain-of-thought 패턴 제거
    if (!includeChainOfThought) {
        return response;
    }

    // "생각:" 또는 "행동:" 이후에 나오는 내용 제거
    const thoughtPattern = /(생각|Thought):/i;
    const actionPattern = /(행동|Action):/i;

    const thoughtMatch = response.match(thoughtPattern);
    const actionMatch = response.match(actionPattern);

    if (thoughtMatch || actionMatch) {
        // 최종 응답 부분 추출
        const parts = response.split(/\n(생각|Thought|행동|Action|관찰|Observation):/i);
        if (parts.length > 1) {
            // 첫 번째 부분이 최종 응답으로 간주 (분석/행동 이전의 내용)
            return parts[0].trim();
        }
    }

    return response;
} 