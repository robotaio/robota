/**
 * 도구 모듈
 *
 * @module Tool
 * @description
 * AI 에이전트가 외부 시스템과 상호작용하기 위한 도구를 제공합니다.
 * 도구는 실행 로직과 매개변수 검증을 포함하며, 전처리와 후처리 훅을 지원합니다.
 */
import type { Tool as ToolInterface, ToolOptions, ToolResult } from '../types/tool';
import type { FunctionSchema } from '../types/model-context-protocol';
/**
 * 도구 클래스
 *
 * @class Tool
 * @implements {ToolInterface<TParams, TResult>}
 * @description
 * AI 에이전트가 사용할 수 있는 도구를 구현합니다.
 * 도구는 함수와 유사하지만 더 많은 기능을 제공합니다:
 * - 매개변수 검증 (zod를 통한)
 * - 실행 전후 훅
 * - 오류 처리 및 결과 포맷팅
 * - 카테고리 및 버전 정보
 *
 * @template TParams - 도구 매개변수 타입
 * @template TResult - 도구 결과 타입
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { Tool } from 'robota';
 *
 * const weatherTool = new Tool({
 *   name: 'getWeather',
 *   description: '특정 위치의 날씨 정보를 조회합니다.',
 *   category: 'data',
 *   version: '1.0.0',
 *   parameters: z.object({
 *     location: z.string().describe('날씨를 조회할 위치 (도시명)'),
 *     unit: z.enum(['celsius', 'fahrenheit']).optional().describe('온도 단위')
 *   }),
 *   execute: async (params) => {
 *     // 날씨 API 호출 로직
 *     const data = { temperature: 25, condition: '맑음' };
 *     return {
 *       status: 'success',
 *       data
 *     };
 *   }
 * });
 * ```
 */
export declare class Tool<TParams = any, TResult = any> implements ToolInterface<TParams, TResult> {
    /**
     * 도구 이름
     *
     * @public
     * @readonly
     * @description
     * 도구를 식별하는 고유 이름입니다.
     */
    readonly name: string;
    /**
     * 도구 설명
     *
     * @public
     * @readonly
     * @description
     * 도구의 기능을 설명하는 문자열입니다.
     * AI가 이 설명을 통해 도구의 용도를 이해합니다.
     */
    readonly description: string;
    /**
     * 도구 카테고리
     *
     * @public
     * @readonly
     * @description
     * 도구를 분류하는 카테고리입니다.
     * 예: 'data', 'file', 'api', 'utility' 등
     */
    readonly category?: string;
    /**
     * 도구 버전
     *
     * @public
     * @readonly
     * @description
     * 도구의 버전 정보입니다.
     * 시맨틱 버전(Semantic Versioning) 형식을 권장합니다.
     */
    readonly version?: string;
    /**
     * 도구 스키마
     *
     * @public
     * @readonly
     * @description
     * 도구를 함수로 변환한 스키마입니다.
     * AI 모델에 전달될 때 이 스키마가 사용됩니다.
     */
    readonly schema: FunctionSchema;
    /**
     * 매개변수 검증 여부
     *
     * @private
     * @description
     * 도구 실행 시 매개변수 검증 여부를 결정합니다.
     * 기본값은 true입니다.
     */
    private readonly validateParams;
    /**
     * 매개변수 스키마
     *
     * @private
     * @description
     * 매개변수 검증에 사용되는 zod 스키마 또는 JSON 스키마입니다.
     */
    private readonly parameters;
    /**
     * 도구 실행 함수
     *
     * @private
     * @description
     * 도구의 핵심 로직을 구현한 함수입니다.
     */
    private readonly _execute;
    /**
     * 실행 전 훅
     *
     * @private
     * @description
     * 도구 실행 전에 호출되는 함수입니다.
     * 매개변수를 전처리하는 데 사용됩니다.
     */
    private readonly beforeExecute?;
    /**
     * 실행 후 훅
     *
     * @private
     * @description
     * 도구 실행 후에 호출되는 함수입니다.
     * 결과를 후처리하는 데 사용됩니다.
     */
    private readonly afterExecute?;
    /**
     * 생성자
     *
     * @constructor
     * @description
     * 도구 인스턴스를 초기화합니다.
     *
     * @param {ToolOptions<TParams, TResult>} options - 도구 옵션
     */
    constructor(options: ToolOptions<TParams, TResult>);
    /**
     * 도구 실행
     *
     * @method execute
     * @description
     * 도구를 실행하고 결과를 반환합니다.
     * 다음 단계를 수행합니다:
     * 1. 매개변수 전처리 (beforeExecute 훅)
     * 2. 매개변수 검증 (zod를 통한)
     * 3. 도구 핵심 로직 실행
     * 4. 결과 후처리 (afterExecute 훅)
     * 5. 오류 처리 및 결과 반환
     *
     * @param {TParams} params - 도구 매개변수
     * @returns {Promise<ToolResult<TResult>>} 도구 실행 결과
     *
     * @example
     * ```typescript
     * const result = await weatherTool.execute({ location: '서울' });
     * logger.info(result);
     * // {
     * //   status: 'success',
     * //   data: { temperature: 25, condition: '맑음' }
     * // }
     * ```
     */
    execute(params: TParams): Promise<ToolResult<TResult>>;
    /**
     * 함수 스키마로 변환
     *
     * @method toFunctionSchema
     * @description
     * 도구를 함수 스키마로 변환합니다.
     * 이 스키마는 AI 모델에 전달되어 도구의 사용 방법을 알려줍니다.
     *
     * @returns {FunctionSchema} 함수 스키마
     */
    toFunctionSchema(): FunctionSchema;
    /**
     * zod 스키마를 JSON 스키마로 변환
     *
     * @method zodToJsonSchema
     * @private
     * @description
     * zod 스키마를 JSON 스키마로 변환합니다.
     * createFunction 유틸리티를 통해 변환을 수행합니다.
     *
     * @param {z.ZodObject<any>} schema - zod 스키마
     * @returns {FunctionSchema['parameters']} JSON 스키마
     */
    private zodToJsonSchema;
    /**
     * 도구 정보 문자열 반환
     *
     * @method toString
     * @description
     * 도구의 기본 정보를 문자열로 반환합니다.
     * 디버깅 및 로깅 용도로 유용합니다.
     *
     * @returns {string} 도구 정보 문자열
     */
    toString(): string;
    /**
     * 도구 팩토리 함수
     *
     * @static
     * @method create
     * @description
     * 새로운 도구 인스턴스를 생성합니다.
     * Tool 클래스의 생성자를 직접 호출하는 대신 이 정적 메서드를 사용할 수 있습니다.
     *
     * @template TParams - 도구 매개변수 타입
     * @template TResult - 도구 결과 타입
     * @param {ToolOptions<TParams, TResult>} options - 도구 옵션
     * @returns {Tool<TParams, TResult>} 도구 인스턴스
     *
     * @example
     * ```typescript
     * import { z } from 'zod';
     * import { Tool } from 'robota';
     *
     * const calculatorTool = Tool.create({
     *   name: 'calculator',
     *   description: '수학 계산을 수행합니다.',
     *   category: 'utility',
     *   parameters: z.object({
     *     expression: z.string().describe('계산할 수학 표현식 (예: 2 + 2)'),
     *   }),
     *   execute: async (params) => {
     *     const result = eval(params.expression);
     *     return {
     *       status: 'success',
     *       data: { result }
     *     };
     *   }
     * });
     * ```
     */
    static create<TParams = any, TResult = any>(options: ToolOptions<TParams, TResult>): Tool<TParams, TResult>;
}
//# sourceMappingURL=tool.d.ts.map