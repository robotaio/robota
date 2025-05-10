[Core API - v0.1.0](/api-reference/core/) / SimpleTool

# Class: SimpleTool

도구 클래스

## Implements

- [`Tool`](/api-reference/core/interfaces/Tool)

## Table of contents

### Constructors

- [constructor](/api-reference/core/classes/SimpleTool#constructor)

### Properties

- [name](/api-reference/core/classes/SimpleTool#name)
- [description](/api-reference/core/classes/SimpleTool#description)
- [schema](/api-reference/core/classes/SimpleTool#schema)
- [execute](/api-reference/core/classes/SimpleTool#execute)

### Methods

- [toFunctionDefinition](/api-reference/core/classes/SimpleTool#tofunctiondefinition)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new SimpleTool**(`options`): [`SimpleTool`](/api-reference/core/classes/SimpleTool)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ToolOptions`](/api-reference/core/interfaces/ToolOptions) |

#### Returns

[`SimpleTool`](/api-reference/core/classes/SimpleTool)

#### Defined in

[packages/core/src/tools.ts:53](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L53)

## Properties

### <a id="name" name="name"></a> name

• **name**: `string`

도구 이름

#### Implementation of

[Tool](/api-reference/core/interfaces/Tool).[name](/api-reference/core/interfaces/Tool#name)

#### Defined in

[packages/core/src/tools.ts:48](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L48)

___

### <a id="description" name="description"></a> description

• `Optional` **description**: `string`

도구 설명

#### Implementation of

[Tool](/api-reference/core/interfaces/Tool).[description](/api-reference/core/interfaces/Tool#description)

#### Defined in

[packages/core/src/tools.ts:49](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L49)

___

### <a id="schema" name="schema"></a> schema

• **schema**: `ZodObject`\<`any`, `UnknownKeysParam`, `ZodTypeAny`, {}, {}\>

도구 매개변수 스키마

#### Implementation of

[Tool](/api-reference/core/interfaces/Tool).[schema](/api-reference/core/interfaces/Tool#schema)

#### Defined in

[packages/core/src/tools.ts:50](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L50)

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

#### Implementation of

[Tool](/api-reference/core/interfaces/Tool).[execute](/api-reference/core/interfaces/Tool#execute)

#### Defined in

[packages/core/src/tools.ts:51](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L51)

## Methods

### <a id="tofunctiondefinition" name="tofunctiondefinition"></a> toFunctionDefinition

▸ **toFunctionDefinition**(): [`FunctionDefinition`](/api-reference/core/interfaces/FunctionDefinition)

함수 정의로 변환

#### Returns

[`FunctionDefinition`](/api-reference/core/interfaces/FunctionDefinition)

#### Implementation of

[Tool](/api-reference/core/interfaces/Tool).[toFunctionDefinition](/api-reference/core/interfaces/Tool#tofunctiondefinition)

#### Defined in

[packages/core/src/tools.ts:63](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L63)
