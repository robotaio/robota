[Core API - v0.1.0](../README.md) / FunctionDefinition

# Interface: FunctionDefinition

함수 정의 인터페이스

## Table of contents

### Properties

- [name](FunctionDefinition.md#name)
- [description](FunctionDefinition.md#description)
- [parameters](FunctionDefinition.md#parameters)

## Properties

### <a id="name" name="name"></a> name

• **name**: `string`

#### Defined in

[packages/core/src/types.ts:38](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L38)

___

### <a id="description" name="description"></a> description

• `Optional` **description**: `string`

#### Defined in

[packages/core/src/types.ts:39](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L39)

___

### <a id="parameters" name="parameters"></a> parameters

• `Optional` **parameters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `properties?` | `Record`\<`string`, \{ `type`: `string` ; `description?`: `string` ; `enum?`: `any`[] ; `default?`: `any`  }\> |
| `required?` | `string`[] |

#### Defined in

[packages/core/src/types.ts:40](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L40)
