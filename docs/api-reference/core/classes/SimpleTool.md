[Core API - v0.1.0](../README.md) / SimpleTool

# Class: SimpleTool

도구 클래스

## Implements

- [`Tool`](../interfaces/Tool.md)

## Table of contents

### Constructors

- [constructor](SimpleTool.md#constructor)

### Properties

- [name](SimpleTool.md#name)
- [description](SimpleTool.md#description)
- [schema](SimpleTool.md#schema)
- [execute](SimpleTool.md#execute)

### Methods

- [toFunctionDefinition](SimpleTool.md#tofunctiondefinition)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new SimpleTool**(`options`): [`SimpleTool`](SimpleTool.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ToolOptions`](../interfaces/ToolOptions.md) |

#### Returns

[`SimpleTool`](SimpleTool.md)

#### Defined in

[packages/core/src/tools.ts:53](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L53)

## Properties

### <a id="name" name="name"></a> name

• **name**: `string`

도구 이름

#### Implementation of

[Tool](../interfaces/Tool.md).[name](../interfaces/Tool.md#name)

#### Defined in

[packages/core/src/tools.ts:48](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L48)

___

### <a id="description" name="description"></a> description

• `Optional` **description**: `string`

도구 설명

#### Implementation of

[Tool](../interfaces/Tool.md).[description](../interfaces/Tool.md#description)

#### Defined in

[packages/core/src/tools.ts:49](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L49)

___

### <a id="schema" name="schema"></a> schema

• **schema**: `ZodObject`\<`any`, `UnknownKeysParam`, `ZodTypeAny`, {}, {}\>

도구 매개변수 스키마

#### Implementation of

[Tool](../interfaces/Tool.md).[schema](../interfaces/Tool.md#schema)

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

[Tool](../interfaces/Tool.md).[execute](../interfaces/Tool.md#execute)

#### Defined in

[packages/core/src/tools.ts:51](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L51)

## Methods

### <a id="tofunctiondefinition" name="tofunctiondefinition"></a> toFunctionDefinition

▸ **toFunctionDefinition**(): [`FunctionDefinition`](../interfaces/FunctionDefinition.md)

함수 정의로 변환

#### Returns

[`FunctionDefinition`](../interfaces/FunctionDefinition.md)

#### Implementation of

[Tool](../interfaces/Tool.md).[toFunctionDefinition](../interfaces/Tool.md#tofunctiondefinition)

#### Defined in

[packages/core/src/tools.ts:63](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L63)
