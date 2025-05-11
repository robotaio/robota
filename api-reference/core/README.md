Core API

# Core API - v0.1.0

## Table of contents

### Classes

- [FunctionRegistry](/robota/api-reference/core/classes/FunctionRegistry)
- [SimpleMemory](/robota/api-reference/core/classes/SimpleMemory)
- [PersistentSystemMemory](/robota/api-reference/core/classes/PersistentSystemMemory)
- [Robota](/robota/api-reference/core/classes/Robota)
- [SimpleTool](/robota/api-reference/core/classes/SimpleTool)
- [ToolRegistry](/robota/api-reference/core/classes/ToolRegistry)

### Interfaces

- [Memory](/robota/api-reference/core/interfaces/Memory)
- [ModelContextProtocol](/robota/api-reference/core/interfaces/ModelContextProtocol)
- [Tool](/robota/api-reference/core/interfaces/Tool)
- [ToolOptions](/robota/api-reference/core/interfaces/ToolOptions)
- [Message](/robota/api-reference/core/interfaces/Message)
- [FunctionCall](/robota/api-reference/core/interfaces/FunctionCall)
- [FunctionCallResult](/robota/api-reference/core/interfaces/FunctionCallResult)
- [FunctionDefinition](/robota/api-reference/core/interfaces/FunctionDefinition)
- [FunctionSchema](/robota/api-reference/core/interfaces/FunctionSchema)
- [ModelResponse](/robota/api-reference/core/interfaces/ModelResponse)
- [StreamingResponseChunk](/robota/api-reference/core/interfaces/StreamingResponseChunk)
- [ProviderOptions](/robota/api-reference/core/interfaces/ProviderOptions)
- [RunOptions](/robota/api-reference/core/interfaces/RunOptions)
- [FunctionCallConfig](/robota/api-reference/core/interfaces/FunctionCallConfig)
- [RobotaOptions](/robota/api-reference/core/interfaces/RobotaOptions)
- [Context](/robota/api-reference/core/interfaces/Context)

### Type Aliases

- [FunctionHandler](/robota/api-reference/core/README#functionhandler)
- [MessageRole](/robota/api-reference/core/README#messagerole)
- [FunctionCallMode](/robota/api-reference/core/README#functioncallmode)

### Functions

- [createFunctionSchema](/robota/api-reference/core/README#createfunctionschema)
- [splitTextIntoChunks](/robota/api-reference/core/README#splittextintochunks)
- [removeUndefined](/robota/api-reference/core/README#removeundefined)
- [isJSON](/robota/api-reference/core/README#isjson)
- [delay](/robota/api-reference/core/README#delay)
- [estimateTokenCount](/robota/api-reference/core/README#estimatetokencount)
- [extractJSONObjects](/robota/api-reference/core/README#extractjsonobjects)

## Type Aliases

### <a id="functionhandler" name="functionhandler"></a> FunctionHandler

Ƭ **FunctionHandler**: (`args`: `Record`\<`string`, `any`\>, `context?`: `any`) => `Promise`\<`any`\>

함수 호출 핸들러 타입

#### Type declaration

▸ (`args`, `context?`): `Promise`\<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Record`\<`string`, `any`\> |
| `context?` | `any` |

##### Returns

`Promise`\<`any`\>

#### Defined in

[packages/core/src/function-calling.ts:40](https://github.com/robotaio/robota/blob/main/packages/core/src/function-calling.ts#L40)

___

### <a id="messagerole" name="messagerole"></a> MessageRole

Ƭ **MessageRole**: ``"user"`` \| ``"assistant"`` \| ``"system"`` \| ``"function"``

메시지 역할 타입

#### Defined in

[packages/core/src/types.ts:4](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L4)

___

### <a id="functioncallmode" name="functioncallmode"></a> FunctionCallMode

Ƭ **FunctionCallMode**: ``"auto"`` \| ``"force"`` \| ``"disabled"``

함수 호출 모드

#### Defined in

[packages/core/src/types.ts:107](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L107)

## Functions

### <a id="createfunctionschema" name="createfunctionschema"></a> createFunctionSchema

▸ **createFunctionSchema**(`definition`): `ZodObject`\<`Record`\<`string`, `ZodTypeAny`\>, ``"strip"``, `ZodTypeAny`, {}, {}\>

함수 스키마를 Zod 스키마로 변환하는 유틸리티 함수

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`FunctionDefinition`](/robota/api-reference/core/interfaces/FunctionDefinition) |

#### Returns

`ZodObject`\<`Record`\<`string`, `ZodTypeAny`\>, ``"strip"``, `ZodTypeAny`, {}, {}\>

#### Defined in

[packages/core/src/function-calling.ts:7](https://github.com/robotaio/robota/blob/main/packages/core/src/function-calling.ts#L7)

___

### <a id="splittextintochunks" name="splittextintochunks"></a> splitTextIntoChunks

▸ **splitTextIntoChunks**(`text`, `chunkSize`): `string`[]

문자열을 청크로 나누는 함수

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | 나눌 문자열 |
| `chunkSize` | `number` | 각 청크의 최대 크기 |

#### Returns

`string`[]

문자열 청크 배열

#### Defined in

[packages/core/src/utils.ts:12](https://github.com/robotaio/robota/blob/main/packages/core/src/utils.ts#L12)

___

### <a id="removeundefined" name="removeundefined"></a> removeUndefined

▸ **removeUndefined**\<`T`\>(`obj`): `T`

객체에서 undefined 값을 제거하는 함수

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Record`\<`string`, `any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `obj` | `T` | 정리할 객체 |

#### Returns

`T`

undefined 값이 제거된 객체

#### Defined in

[packages/core/src/utils.ts:28](https://github.com/robotaio/robota/blob/main/packages/core/src/utils.ts#L28)

___

### <a id="isjson" name="isjson"></a> isJSON

▸ **isJSON**(`str`): `boolean`

문자열이 JSON인지 확인하는 함수

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | 확인할 문자열 |

#### Returns

`boolean`

JSON 여부

#### Defined in

[packages/core/src/utils.ts:48](https://github.com/robotaio/robota/blob/main/packages/core/src/utils.ts#L48)

___

### <a id="delay" name="delay"></a> delay

▸ **delay**(`ms`): `Promise`\<`void`\>

지연 함수

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ms` | `number` | 지연 시간(밀리초) |

#### Returns

`Promise`\<`void`\>

Promise

#### Defined in

[packages/core/src/utils.ts:63](https://github.com/robotaio/robota/blob/main/packages/core/src/utils.ts#L63)

___

### <a id="estimatetokencount" name="estimatetokencount"></a> estimateTokenCount

▸ **estimateTokenCount**(`text`): `number`

토큰 수 대략적 추정 함수

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | 측정할 텍스트 |

#### Returns

`number`

대략적인 토큰 수

#### Defined in

[packages/core/src/utils.ts:73](https://github.com/robotaio/robota/blob/main/packages/core/src/utils.ts#L73)

___

### <a id="extractjsonobjects" name="extractjsonobjects"></a> extractJSONObjects

▸ **extractJSONObjects**(`text`): `Object`

문자열 스트림에서 완성된 JSON 객체를 추출하는 함수

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | JSON 문자열 조각 |

#### Returns

`Object`

완성된 JSON 객체와 남은 문자열

| Name | Type |
| :------ | :------ |
| `objects` | `any`[] |
| `remaining` | `string` |

#### Defined in

[packages/core/src/utils.ts:96](https://github.com/robotaio/robota/blob/main/packages/core/src/utils.ts#L96)
