[Core API - v0.1.0](/api-reference/core/) / Tool

# Interface: Tool

도구 인터페이스

## Implemented by

- [`SimpleTool`](/api-reference/core/classes/SimpleTool)

## Table of contents

### Properties

- [name](/api-reference/core/interfaces/Tool#name)
- [description](/api-reference/core/interfaces/Tool#description)
- [schema](/api-reference/core/interfaces/Tool#schema)
- [execute](/api-reference/core/interfaces/Tool#execute)

### Methods

- [toFunctionDefinition](/api-reference/core/interfaces/Tool#tofunctiondefinition)

## Properties

### <a id="name" name="name"></a> name

• **name**: `string`

도구 이름

#### Defined in

[packages/core/src/tools.ts:11](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L11)

___

### <a id="description" name="description"></a> description

• `Optional` **description**: `string`

도구 설명

#### Defined in

[packages/core/src/tools.ts:16](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L16)

___

### <a id="schema" name="schema"></a> schema

• **schema**: `ZodObject`\<`any`, `UnknownKeysParam`, `ZodTypeAny`, {}, {}\>

도구 매개변수 스키마

#### Defined in

[packages/core/src/tools.ts:21](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L21)

___

### <a id="execute" name="execute"></a> execute

• **execute**: (`args`: `any`) => `Promise`\<`any`\>

도구 실행 함수

#### Type declaration

▸ (`args`): `Promise`\<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `any` |

##### Returns

`Promise`\<`any`\>

#### Defined in

[packages/core/src/tools.ts:26](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L26)

## Methods

### <a id="tofunctiondefinition" name="tofunctiondefinition"></a> toFunctionDefinition

▸ **toFunctionDefinition**(): [`FunctionDefinition`](/api-reference/core/interfaces/FunctionDefinition)

함수 정의로 변환

#### Returns

[`FunctionDefinition`](/api-reference/core/interfaces/FunctionDefinition)

#### Defined in

[packages/core/src/tools.ts:31](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L31)
