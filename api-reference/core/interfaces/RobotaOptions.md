[Core API - v0.1.0](/api-reference/core/) / RobotaOptions

# Interface: RobotaOptions

Robota 설정 인터페이스

## Table of contents

### Properties

- [provider](/api-reference/core/interfaces/RobotaOptions#provider)
- [systemPrompt](/api-reference/core/interfaces/RobotaOptions#systemprompt)
- [systemMessages](/api-reference/core/interfaces/RobotaOptions#systemmessages)
- [memory](/api-reference/core/interfaces/RobotaOptions#memory)
- [functionCallConfig](/api-reference/core/interfaces/RobotaOptions#functioncallconfig)
- [onFunctionCall](/api-reference/core/interfaces/RobotaOptions#onfunctioncall)

## Properties

### <a id="provider" name="provider"></a> provider

• **provider**: `any`

#### Defined in

[packages/core/src/types.ts:135](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L135)

___

### <a id="systemprompt" name="systemprompt"></a> systemPrompt

• `Optional` **systemPrompt**: `string`

#### Defined in

[packages/core/src/types.ts:136](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L136)

___

### <a id="systemmessages" name="systemmessages"></a> systemMessages

• `Optional` **systemMessages**: [`Message`](/api-reference/core/interfaces/Message)[]

#### Defined in

[packages/core/src/types.ts:137](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L137)

___

### <a id="memory" name="memory"></a> memory

• `Optional` **memory**: `any`

#### Defined in

[packages/core/src/types.ts:138](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L138)

___

### <a id="functioncallconfig" name="functioncallconfig"></a> functionCallConfig

• `Optional` **functionCallConfig**: [`FunctionCallConfig`](/api-reference/core/interfaces/FunctionCallConfig)

#### Defined in

[packages/core/src/types.ts:139](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L139)

___

### <a id="onfunctioncall" name="onfunctioncall"></a> onFunctionCall

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

[packages/core/src/types.ts:140](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L140)
