Core API

# Core API - v0.1.0

## Table of contents

### Classes

- [FunctionRegistry](classes/FunctionRegistry.md)
- [SimpleMemory](classes/SimpleMemory.md)
- [PersistentSystemMemory](classes/PersistentSystemMemory.md)
- [Robota](classes/Robota.md)
- [SimpleTool](classes/SimpleTool.md)
- [ToolRegistry](classes/ToolRegistry.md)

### Interfaces

- [Memory](interfaces/Memory.md)
- [ModelContextProtocol](interfaces/ModelContextProtocol.md)
- [Tool](interfaces/Tool.md)
- [ToolOptions](interfaces/ToolOptions.md)
- [Message](interfaces/Message.md)
- [FunctionCall](interfaces/FunctionCall.md)
- [FunctionCallResult](interfaces/FunctionCallResult.md)
- [FunctionDefinition](interfaces/FunctionDefinition.md)
- [FunctionSchema](interfaces/FunctionSchema.md)
- [ModelResponse](interfaces/ModelResponse.md)
- [StreamingResponseChunk](interfaces/StreamingResponseChunk.md)
- [ProviderOptions](interfaces/ProviderOptions.md)
- [RunOptions](interfaces/RunOptions.md)
- [FunctionCallConfig](interfaces/FunctionCallConfig.md)
- [RobotaOptions](interfaces/RobotaOptions.md)
- [Context](interfaces/Context.md)

### Type Aliases

- [FunctionHandler](README.md#functionhandler)
- [MessageRole](README.md#messagerole)
- [FunctionCallMode](README.md#functioncallmode)

### Functions

- [createFunctionSchema](README.md#createfunctionschema)
- [splitTextIntoChunks](README.md#splittextintochunks)
- [removeUndefined](README.md#removeundefined)
- [isJSON](README.md#isjson)
- [delay](README.md#delay)
- [estimateTokenCount](README.md#estimatetokencount)
- [extractJSONObjects](README.md#extractjsonobjects)

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
| `definition` | [`FunctionDefinition`](interfaces/FunctionDefinition.md) |

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
