[Core API - v0.1.0](/robota/api-reference/core/) / FunctionRegistry

# Class: FunctionRegistry

함수 호출 레지스트리

## Table of contents

### Constructors

- [constructor](/robota/api-reference/core/classes/FunctionRegistry#constructor)

### Methods

- [register](/robota/api-reference/core/classes/FunctionRegistry#register)
- [getAllDefinitions](/robota/api-reference/core/classes/FunctionRegistry#getalldefinitions)
- [getDefinition](/robota/api-reference/core/classes/FunctionRegistry#getdefinition)
- [execute](/robota/api-reference/core/classes/FunctionRegistry#execute)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new FunctionRegistry**(): [`FunctionRegistry`](/robota/api-reference/core/classes/FunctionRegistry)

#### Returns

[`FunctionRegistry`](/robota/api-reference/core/classes/FunctionRegistry)

## Methods

### <a id="register" name="register"></a> register

▸ **register**(`definition`, `handler`): `void`

함수를 등록합니다

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`FunctionDefinition`](/robota/api-reference/core/interfaces/FunctionDefinition) |
| `handler` | [`FunctionHandler`](/robota/api-reference/core/#functionhandler) |

#### Returns

`void`

#### Defined in

[packages/core/src/function-calling.ts:55](https://github.com/robotaio/robota/blob/main/packages/core/src/function-calling.ts#L55)

___

### <a id="getalldefinitions" name="getalldefinitions"></a> getAllDefinitions

▸ **getAllDefinitions**(): [`FunctionDefinition`](/robota/api-reference/core/interfaces/FunctionDefinition)[]

등록된 모든 함수 정의를 반환합니다

#### Returns

[`FunctionDefinition`](/robota/api-reference/core/interfaces/FunctionDefinition)[]

#### Defined in

[packages/core/src/function-calling.ts:63](https://github.com/robotaio/robota/blob/main/packages/core/src/function-calling.ts#L63)

___

### <a id="getdefinition" name="getdefinition"></a> getDefinition

▸ **getDefinition**(`name`): `undefined` \| [`FunctionDefinition`](/robota/api-reference/core/interfaces/FunctionDefinition)

함수 이름으로 함수 정의를 가져옵니다

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`undefined` \| [`FunctionDefinition`](/robota/api-reference/core/interfaces/FunctionDefinition)

#### Defined in

[packages/core/src/function-calling.ts:70](https://github.com/robotaio/robota/blob/main/packages/core/src/function-calling.ts#L70)

___

### <a id="execute" name="execute"></a> execute

▸ **execute**(`functionCall`, `context?`): `Promise`\<[`FunctionCallResult`](/robota/api-reference/core/interfaces/FunctionCallResult)\>

함수 호출을 실행합니다

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionCall` | [`FunctionCall`](/robota/api-reference/core/interfaces/FunctionCall) |
| `context?` | `any` |

#### Returns

`Promise`\<[`FunctionCallResult`](/robota/api-reference/core/interfaces/FunctionCallResult)\>

#### Defined in

[packages/core/src/function-calling.ts:77](https://github.com/robotaio/robota/blob/main/packages/core/src/function-calling.ts#L77)
