[Core API - v0.1.0](../README.md) / FunctionSchema

# Interface: FunctionSchema

함수 스키마 인터페이스

## Table of contents

### Properties

- [name](FunctionSchema.md#name)
- [description](FunctionSchema.md#description)
- [parameters](FunctionSchema.md#parameters)

## Properties

### <a id="name" name="name"></a> name

• **name**: `string`

#### Defined in

[packages/core/src/types.ts:56](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L56)

___

### <a id="description" name="description"></a> description

• `Optional` **description**: `string`

#### Defined in

[packages/core/src/types.ts:57](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L57)

___

### <a id="parameters" name="parameters"></a> parameters

• **parameters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `type` | ``"object"`` |
| `properties` | `Record`\<`string`, \{ `type`: `string` ; `description?`: `string` ; `enum?`: `any`[] ; `default?`: `any`  }\> |
| `required?` | `string`[] |

#### Defined in

[packages/core/src/types.ts:58](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L58)
