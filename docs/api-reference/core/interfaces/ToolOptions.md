[Core API](../../) / [Exports](../modules) / ToolOptions

# Interface: ToolOptions

도구 생성 옵션

## Table of contents

### Properties

- [description](ToolOptions#description)
- [execute](ToolOptions#execute)
- [name](ToolOptions#name)
- [schema](ToolOptions#schema)

## Properties

### description

• `Optional` **description**: `string`

#### Defined in

[packages/core/src/tools.ts:39](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/tools.ts#L39)

___

### execute

• **execute**: (`args`: `any`) => `Promise`\<`any`\>

#### Type declaration

▸ (`args`): `Promise`\<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `any` |

##### Returns

`Promise`\<`any`\>

#### Defined in

[packages/core/src/tools.ts:41](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/tools.ts#L41)

___

### name

• **name**: `string`

#### Defined in

[packages/core/src/tools.ts:38](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/tools.ts#L38)

___

### schema

• **schema**: `ZodObject`\<`any`, `UnknownKeysParam`, `ZodTypeAny`, {}, {}\>

#### Defined in

[packages/core/src/tools.ts:40](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/tools.ts#L40)
