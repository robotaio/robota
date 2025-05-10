[Core API - v0.1.0](/api-reference/core/) / FunctionRegistry

# Class: FunctionRegistry

함수 호출 레지스트리

## Table of contents

### Constructors

- [constructor](#constructor)

### Methods

- [register](#register)
- [getAllDefinitions](#getalldefinitions)
- [getDefinition](#getdefinition)
- [execute](#execute)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new FunctionRegistry**(): [`FunctionRegistry`]()

#### Returns

[`FunctionRegistry`]()

## Methods

### <a id="register" name="register"></a> register

▸ **register**(`definition`, `handler`): `void`

함수를 등록합니다

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`FunctionDefinition`](/api-reference/core/interfaces/FunctionDefinition.md) |
| `handler` | [`FunctionHandler`](/api-reference/core/?id=functionhandler) |

#### Returns

`void`

#### Defined in

[packages/core/src/function-calling.ts:55](https://github.com/robotaio/robota/blob/main/packages/core/src/function-calling.ts#L55)

___

### <a id="getalldefinitions" name="getalldefinitions"></a> getAllDefinitions

▸ **getAllDefinitions**(): [`FunctionDefinition`](/api-reference/core/interfaces/FunctionDefinition.md)[]

등록된 모든 함수 정의를 반환합니다

#### Returns

[`FunctionDefinition`](/api-reference/core/interfaces/FunctionDefinition.md)[]

#### Defined in

[packages/core/src/function-calling.ts:63](https://github.com/robotaio/robota/blob/main/packages/core/src/function-calling.ts#L63)

___

### <a id="getdefinition" name="getdefinition"></a> getDefinition

▸ **getDefinition**(`name`): `undefined` \| [`FunctionDefinition`](/api-reference/core/interfaces/FunctionDefinition.md)

함수 이름으로 함수 정의를 가져옵니다

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`undefined` \| [`FunctionDefinition`](/api-reference/core/interfaces/FunctionDefinition.md)

#### Defined in

[packages/core/src/function-calling.ts:70](https://github.com/robotaio/robota/blob/main/packages/core/src/function-calling.ts#L70)

___

### <a id="execute" name="execute"></a> execute

▸ **execute**(`functionCall`, `context?`): `Promise`\<[`FunctionCallResult`](/api-reference/core/interfaces/FunctionCallResult.md)\>

함수 호출을 실행합니다

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionCall` | [`FunctionCall`](/api-reference/core/interfaces/FunctionCall.md) |
| `context?` | `any` |

#### Returns

`Promise`\<[`FunctionCallResult`](/api-reference/core/interfaces/FunctionCallResult.md)\>

#### Defined in

[packages/core/src/function-calling.ts:77](https://github.com/robotaio/robota/blob/main/packages/core/src/function-calling.ts#L77)
