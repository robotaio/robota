/**
 * RobotaCore 클래스
 * 에이전틱 AI 라이브러리의 주요 진입점
 *
 * @module RobotaCore
 * @description
 * RobotaCore는 에이전틱 AI를 쉽게 구축할 수 있는 주요 클래스입니다.
 * 다양한 AI 제공업체와 통합되며, 함수 호출 기능을 통해 AI가 코드를 실행할 수 있게 합니다.
 *
 * @example
 * ```typescript
 * import { RobotaCore } from 'robota';
 * import { OpenAIProvider } from '@robota/openai';
 *
 * // OpenAI 제공업체 초기화
 * const provider = new OpenAIProvider({
 *   apiKey: process.env.OPENAI_API_KEY,
 *   model: 'gpt-4',
 * });
 *
 * // RobotaCore 인스턴스 생성
 * const robota = new RobotaCore({
 *   provider,
 *   systemPrompt: '당신은 친절한 AI 비서입니다.',
 * });
 *
 * // 함수 실행
 * const response = await robota.run('오늘 날씨가 어때?');
 * logger.info(response);
 * ```
 */
import type { ToolProvider, ToolProviderOptions, ToolProviderResponseStream } from '../types/provider';
import type { Message, FunctionCallMode } from '../types/model-context-protocol';
import type { Function } from '../types/function';
import type { Tool } from '../types/tool';
import { ConversationMemory } from '../utils/conversation-memory';
/**
 * RobotaCore 옵션 인터페이스
 *
 * @interface RobotaCoreOptions
 * @description
 * RobotaCore 인스턴스를 초기화하기 위한 옵션 객체입니다.
 */
export interface RobotaCoreOptions {
    /**
     * AI 제공업체
     *
     * @description
     * OpenAI, Anthropic 등의 AI 제공업체 인스턴스입니다.
     * 라이브러리에서 제공하는 ToolProvider 인터페이스를 구현해야 합니다.
     *
     * @example
     * ```typescript
     * // MCP 클라이언트 어댑터를 사용한 예제
     * import { createMcpToolProvider } from 'robota';
     * import { Client } from '@modelcontextprotocol/sdk';
     *
     * const mcpClient = new Client(transport);
     * const provider = createMcpToolProvider(mcpClient, {
     *   model: 'gpt-4'
     * });
     *
     * // OpenAPI 스키마 어댑터를 사용한 예제
     * import { createOpenAPIToolProvider } from 'robota';
     *
     * const provider = createOpenAPIToolProvider({
     *   schema: 'https://api.example.com/openapi.json',
     *   baseURL: 'https://api.example.com',
     *   headers: { 'Authorization': 'Bearer token' },
     *   model: 'model-name'
     * });
     *
     * // 함수 기반 어댑터를 사용한 예제
     * import { createFunctionToolProvider } from 'robota';
     *
     * const provider = createFunctionToolProvider({
     *   chat: async (options) => {
     *     // 채팅 요청 구현
     *     return { content: '응답 내용' };
     *   },
     *   model: 'custom-model'
     * });
     * ```
     */
    provider: ToolProvider;
    /**
     * 시스템 프롬프트
     *
     * @description
     * AI 모델에 전달할 시스템 프롬프트입니다.
     * AI의 행동과 응답 스타일을 정의합니다.
     */
    systemPrompt?: string;
    /**
     * 시스템 메시지 배열
     *
     * @description
     * 여러 시스템 메시지를 배열로 전달할 수 있습니다.
     * 복잡한 컨텍스트 설정이 필요한 경우 유용합니다.
     */
    systemMessages?: Message[];
    /**
     * 메모리 관리자 (대화 기록 저장)
     *
     * @description
     * 대화 기록을 관리하는 메모리 인스턴스입니다.
     * 제공하지 않으면 기본 ConversationMemory가 사용됩니다.
     */
    memory?: ConversationMemory;
    /**
     * 함수 호출 콜백
     *
     * @description
     * 함수가 호출될 때 실행되는 콜백 함수입니다.
     * 로깅이나 모니터링에 유용합니다.
     *
     * @param functionName 호출된 함수 이름
     * @param args 함수에 전달된 인자
     * @param result 함수 실행 결과
     */
    onFunctionCall?: (functionName: string, args: Record<string, any>, result: any) => void;
    /**
     * 함수 호출 구성
     *
     * @description
     * 함수 호출 동작을 세밀하게 제어하기 위한 설정입니다.
     */
    functionCallConfig?: {
        /**
         * 최대 함수 호출 횟수
         *
         * @description
         * 단일 대화에서 허용되는 최대 함수 호출 횟수입니다.
         * 기본값은 10입니다.
         */
        maxCalls?: number;
        /**
         * 함수 호출 타임아웃 (ms)
         *
         * @description
         * 함수 호출이 이 시간 내에 완료되지 않으면 취소됩니다.
         * 기본값은 30000ms (30초)입니다.
         */
        timeout?: number;
        /**
         * 허용된 함수 목록
         *
         * @description
         * 이 목록에 있는 함수만 호출 가능합니다.
         * 설정하지 않으면 모든 등록된 함수가 호출 가능합니다.
         */
        allowedFunctions?: string[];
        /**
         * 기본 함수 호출 모드
         *
         * @description
         * 함수 호출 방식을 결정합니다.
         * - 'auto': AI가 필요에 따라 함수를 호출합니다.
         * - 'force': 특정 함수 호출을 강제합니다.
         * - 'disabled': 함수 호출을 비활성화합니다.
         *
         * 기본값은 'auto'입니다.
         */
        defaultMode?: FunctionCallMode;
    };
}
/**
 * 실행 옵션 인터페이스
 *
 * @interface RunOptions
 * @description
 * run 또는 runStream 메서드 호출 시 사용되는 옵션입니다.
 */
export interface RunOptions {
    /**
     * 함수 호출 모드
     *
     * @description
     * 이 실행에 대한 함수 호출 모드를 설정합니다.
     * 인스턴스 기본값을 재정의합니다.
     */
    functionCallMode?: FunctionCallMode;
    /**
     * 강제 함수 이름 (functionCallMode가 'force'인 경우)
     *
     * @description
     * functionCallMode가 'force'로 설정된 경우 호출할 함수 이름입니다.
     */
    forcedFunction?: string;
    /**
     * 강제 함수 인자 (functionCallMode가 'force'인 경우)
     *
     * @description
     * functionCallMode가 'force'로 설정된 경우 함수에 전달할 인자입니다.
     */
    forcedArguments?: Record<string, any>;
    /**
     * 제공업체 옵션 재정의
     *
     * @description
     * 이 실행에 대한 제공업체 옵션을 재정의합니다.
     * 온도, 최대 토큰 등의 매개변수를 조정할 수 있습니다.
     */
    providerOptions?: Partial<ToolProviderOptions>;
}
/**
 * RobotaCore 클래스
 *
 * @class RobotaCore
 * @description
 * 에이전틱 AI 구축을 위한 주요 클래스입니다.
 * AI 대화, 함수 호출, 도구 사용 등을 관리합니다.
 */
export declare class RobotaCore {
    /**
     * AI 제공업체
     *
     * @private
     * @description
     * OpenAI, Anthropic 등의 AI 제공업체 인스턴스입니다.
     */
    private provider;
    /**
     * 시스템 프롬프트
     *
     * @private
     * @description
     * AI 모델에 전달되는 시스템 지시사항입니다.
     */
    private systemPrompt?;
    /**
     * 시스템 메시지 배열
     *
     * @private
     * @description
     * AI에 전달되는 시스템 메시지 목록입니다.
     */
    private systemMessages;
    /**
     * 등록된 함수 맵
     *
     * @private
     * @description
     * 이름으로 색인된 등록된 함수 맵입니다.
     */
    private functions;
    /**
     * 등록된 도구 맵
     *
     * @private
     * @description
     * 이름으로 색인된 등록된 도구 맵입니다.
     */
    private tools;
    /**
     * 메모리 관리자
     *
     * @private
     * @description
     * 대화 기록을 관리하는 메모리 인스턴스입니다.
     */
    private memory;
    /**
     * 함수 호출 콜백
     *
     * @private
     * @description
     * 함수가 호출될 때 실행되는 콜백 함수입니다.
     */
    private onFunctionCall?;
    /**
     * 함수 호출 구성
     *
     * @private
     * @description
     * 함수 호출 동작을 세밀하게 제어하기 위한 설정입니다.
     */
    private functionCallConfig;
    /**
     * 생성자
     *
     * @constructor
     * @description
     * RobotaCore 인스턴스를 초기화합니다.
     *
     * @param {RobotaCoreOptions} options - RobotaCore 옵션
     */
    constructor(options: RobotaCoreOptions);
    /**
     * 함수 등록
     *
     * @description
     * AI가 호출할 수 있는 함수를 등록합니다.
     *
     * @param {Record<string, Function | ((...args: any[]) => any)>} functions - 등록할 함수 객체
     * @returns {void}
     *
     * @example
     * ```typescript
     * robota.registerFunctions({
     *   getWeather: {
     *     name: 'getWeather',
     *     description: '특정 위치의 날씨 정보를 조회합니다.',
     *     parameters: z.object({
     *       location: z.string().describe('날씨를 조회할 위치 (도시명)'),
     *     }),
     *     execute: async (params) => {
     *       // 날씨 API 호출 로직
     *       return { temperature: 25, condition: '맑음' };
     *     }
     *   }
     * });
     * ```
     */
    registerFunctions(functions: Record<string, Function | ((...args: any[]) => any)>): void;
    /**
     * 도구 등록
     *
     * @description
     * AI가 사용할 수 있는 도구를 등록합니다.
     *
     * @param {Tool[]} tools - 등록할 도구 배열
     * @returns {void}
     *
     * @example
     * ```typescript
     * import { createTool } from 'robota';
     *
     * const calculatorTool = createTool({
     *   name: 'calculator',
     *   description: '수학 계산을 수행합니다.',
     *   parameters: z.object({
     *     expression: z.string().describe('계산할 수학 표현식 (예: 2 + 2)'),
     *   }),
     *   execute: async (params) => {
     *     return { result: eval(params.expression) };
     *   }
     * });
     *
     * robota.registerTools([calculatorTool]);
     * ```
     */
    registerTools(tools: Tool[]): void;
    /**
     * 프롬프트 실행
     *
     * @description
     * 사용자 프롬프트를 실행하고 AI 응답을 반환합니다.
     * 필요한 경우 함수 호출을 처리합니다.
     *
     * @param {string} prompt - 사용자 프롬프트
     * @param {RunOptions} [options={}] - 실행 옵션
     * @returns {Promise<string>} AI 응답
     *
     * @example
     * ```typescript
     * const response = await robota.run('오늘 서울의 날씨가 어때?');
     * logger.info(response); // '서울의 현재 기온은 25도이며, 맑은 상태입니다.'
     * ```
     */
    run(prompt: string, options?: RunOptions): Promise<string>;
    /**
     * 프롬프트 스트리밍 실행
     *
     * @description
     * 사용자 프롬프트를 실행하고 AI 응답을 스트림으로 반환합니다.
     * 실시간 응답 처리에 유용합니다.
     *
     * @param {string} prompt - 사용자 프롬프트
     * @param {RunOptions} [options={}] - 실행 옵션
     * @returns {Promise<ToolProviderResponseStream>} AI 응답 스트림
     *
     * @example
     * ```typescript
     * const stream = await robota.runStream('긴 이야기를 들려줘');
     *
     * for await (const chunk of stream) {
     *   process.stdout.write(chunk); // 청크별로 출력
     * }
     * ```
     */
    runStream(prompt: string, options?: RunOptions): Promise<ToolProviderResponseStream>;
    /**
     * 모델 컨텍스트 생성
     *
     * @private
     * @description
     * AI 모델에 전송할 컨텍스트를 생성합니다.
     *
     * @param {RunOptions} options - 실행 옵션
     * @returns {ModelContext} 모델 컨텍스트
     */
    private createContext;
    /**
     * 함수 호출 처리
     *
     * @private
     * @description
     * AI의 함수 호출 요청을 처리하고 결과를 반환합니다.
     *
     * @param {ToolProviderResponse} response - 제공업체 응답
     * @param {ModelContext} context - 모델 컨텍스트
     * @param {RunOptions} options - 실행 옵션
     * @returns {Promise<string>} 처리 결과
     */
    private handleFunctionCall;
    /**
     * 대화 메시지 가져오기
     *
     * @description
     * 현재 대화의 모든 메시지를 반환합니다.
     *
     * @returns {Message[]} 메시지 배열
     */
    getMessages(): Message[];
    /**
     * 대화 메시지 초기화
     *
     * @description
     * 모든 대화 메시지를 삭제하고 초기화합니다.
     * 시스템 메시지는 유지됩니다.
     *
     * @returns {void}
     */
    clearMessages(): void;
    /**
     * 시스템 프롬프트 설정
     *
     * @description
     * 새로운 시스템 프롬프트를 설정합니다.
     *
     * @param {string} prompt - 새 시스템 프롬프트
     * @returns {void}
     */
    setSystemPrompt(prompt: string): void;
    /**
     * 시스템 메시지 설정
     *
     * @description
     * 새로운 시스템 메시지를 설정합니다.
     *
     * @param {Message | Message[]} messages - 새 시스템 메시지
     * @returns {void}
     */
    setSystemMessages(messages: Message | Message[]): void;
    /**
     * 시스템 메시지 추가
     *
     * @description
     * 기존 시스템 메시지에 새 메시지를 추가합니다.
     *
     * @param {string} content - 추가할 메시지 내용
     * @returns {void}
     */
    addSystemMessage(content: string): void;
    /**
     * 함수 호출 모드 설정
     *
     * @description
     * 기본 함수 호출 모드를 설정합니다.
     *
     * @param {FunctionCallMode} mode - 함수 호출 모드
     * @returns {void}
     */
    setFunctionCallMode(mode: FunctionCallMode): void;
    /**
     * 함수 호출 구성 설정
     *
     * @description
     * 함수 호출 관련 설정을 변경합니다.
     *
     * @param config - 함수 호출 구성
     * @param {FunctionCallMode} [config.mode] - 함수 호출 모드
     * @param {number} [config.maxCalls] - 최대 함수 호출 횟수
     * @param {number} [config.timeout] - 함수 호출 타임아웃
     * @param {string[]} [config.allowedFunctions] - 허용된 함수 목록
     * @returns {void}
     */
    configureFunctionCall(config: {
        mode?: FunctionCallMode;
        maxCalls?: number;
        timeout?: number;
        allowedFunctions?: string[];
    }): void;
}
//# sourceMappingURL=robota.d.ts.map