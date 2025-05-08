[Core API](../../) / [Exports](../modules) / FunctionDefinition

# Interface: FunctionDefinition

함수 정의 인터페이스

## Table of contents

### Properties

- [description](FunctionDefinition#description)
- [name](FunctionDefinition#name)
- [parameters](FunctionDefinition#parameters)

## Properties

### description

• `Optional` **description**: `string`

#### Defined in

[packages/core/src/types.ts:39](https://github.com/robotaio/robota/blob/c397724a2d06d66ad71d874519312f9bbb9b1d70/packages/core/src/types.ts#L39)

___

### name

• **name**: `string`

#### Defined in

[packages/core/src/types.ts:38](https://github.com/robotaio/robota/blob/c397724a2d06d66ad71d874519312f9bbb9b1d70/packages/core/src/types.ts#L38)

___

### parameters

• `Optional` **parameters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `properties?` | `Record`\<`string`, \{ `default?`: `any` ; `description?`: `string` ; `enum?`: `any`[] ; `type`: `string`  }\> |
| `required?` | `string`[] |
| `type` | `string` |

#### Defined in

[packages/core/src/types.ts:40](https://github.com/robotaio/robota/blob/c397724a2d06d66ad71d874519312f9bbb9b1d70/packages/core/src/types.ts#L40)
