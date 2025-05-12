[Core API](../../) / [Exports](../modules) / RobotaOptions

# Interface: RobotaOptions

Robota 설정 인터페이스

## Table of contents

### Properties

- [functionCallConfig](RobotaOptions#functioncallconfig)
- [memory](RobotaOptions#memory)
- [onFunctionCall](RobotaOptions#onfunctioncall)
- [provider](RobotaOptions#provider)
- [systemMessages](RobotaOptions#systemmessages)
- [systemPrompt](RobotaOptions#systemprompt)

## Properties

### functionCallConfig

• `Optional` **functionCallConfig**: [`FunctionCallConfig`](FunctionCallConfig)

#### Defined in

[packages/core/src/types.ts:139](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/types.ts#L139)

___

### memory

• `Optional` **memory**: `any`

#### Defined in

[packages/core/src/types.ts:138](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/types.ts#L138)

___

### onFunctionCall

• `Optional` **onFunctionCall**: (`functionName`: `string`, `args`: `any`, `result`: `any`) => `void`

#### Type declaration

▸ (`functionName`, `args`, `result`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | `string` |
| `args` | `any` |
| `result` | `any` |

##### Returns

`void`

#### Defined in

[packages/core/src/types.ts:140](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/types.ts#L140)

___

### provider

• **provider**: `any`

#### Defined in

[packages/core/src/types.ts:135](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/types.ts#L135)

___

### systemMessages

• `Optional` **systemMessages**: [`Message`](Message)[]

#### Defined in

[packages/core/src/types.ts:137](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/types.ts#L137)

___

### systemPrompt

• `Optional` **systemPrompt**: `string`

#### Defined in

[packages/core/src/types.ts:136](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/types.ts#L136)
