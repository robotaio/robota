/**
 * 함수 생성 유틸리티
 *
 * @module Function
 * @description
 * AI가 호출할 수 있는 함수를 생성하고 관리하는 유틸리티입니다.
 * zod 라이브러리를 사용하여 함수 매개변수의 유효성 검사를 수행합니다.
 */
import type { Function, FunctionOptions } from '../types/function';
/**
 * 함수 생성
 *
 * @function createFunction
 * @description
 * AI가 호출할 수 있는 함수를 생성합니다.
 * 함수 이름, 설명, 매개변수 스키마, 실행 로직을 정의할 수 있습니다.
 *
 * @template TParams 함수 매개변수 타입
 * @template TResult 함수 반환 결과 타입
 * @param {FunctionOptions<TParams, TResult>} options - 함수 옵션
 * @param {string} options.name - 함수 이름
 * @param {string} [options.description] - 함수 설명
 * @param {z.ZodObject<any> | FunctionSchema['parameters']} options.parameters - 매개변수 스키마
 * @param {(params: TParams) => Promise<TResult> | TResult} options.execute - 실행 로직
 * @returns {Function<TParams, TResult>} 생성된 함수 객체
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { createFunction } from 'robota';
 *
 * const getWeather = createFunction({
 *   name: 'getWeather',
 *   description: '특정 위치의 날씨 정보를 조회합니다.',
 *   parameters: z.object({
 *     location: z.string().describe('날씨를 조회할 위치 (도시명)'),
 *     unit: z.enum(['celsius', 'fahrenheit']).optional().describe('온도 단위')
 *   }),
 *   execute: async (params) => {
 *     // 날씨 API 호출 로직
 *     return { temperature: 25, condition: '맑음' };
 *   }
 * });
 * ```
 */
export declare function createFunction<TParams = any, TResult = any>(options: FunctionOptions<TParams, TResult>): Function<TParams, TResult>;
/**
 * 일반 함수를 호출 가능한 함수로 변환
 *
 * @function functionFromCallback
 * @description
 * 일반 JavaScript 함수를 AI가 호출할 수 있는 Function 객체로 변환합니다.
 * 매개변수 타입은 자동으로 유추됩니다.
 *
 * @param {string} name - 함수 이름
 * @param {(...args: any[]) => any} fn - 변환할 JavaScript 함수
 * @param {string} [description] - 함수 설명
 * @returns {Function} AI가 호출할 수 있는 함수 객체
 *
 * @example
 * ```typescript
 * import { functionFromCallback } from 'robota';
 *
 * function add(a: number, b: number): number {
 *   return a + b;
 * }
 *
 * const addFunction = functionFromCallback(
 *   'add',
 *   add,
 *   '두 숫자를 더합니다.'
 * );
 * ```
 */
export declare function functionFromCallback(name: string, fn: (...args: any[]) => any, description?: string): Function;
//# sourceMappingURL=function.d.ts.map