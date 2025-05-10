[Core API - v0.1.0](../README.md) / ToolRegistry

# Class: ToolRegistry

도구 레지스트리

## Table of contents

### Constructors

- [constructor](ToolRegistry.md#constructor)

### Methods

- [register](ToolRegistry.md#register)
- [getTool](ToolRegistry.md#gettool)
- [getFunctionDefinitions](ToolRegistry.md#getfunctiondefinitions)
- [execute](ToolRegistry.md#execute)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new ToolRegistry**(): [`ToolRegistry`](ToolRegistry.md)

#### Returns

[`ToolRegistry`](ToolRegistry.md)

## Methods

### <a id="register" name="register"></a> register

▸ **register**(`tool`): `void`

도구 등록

#### Parameters

| Name | Type |
| :------ | :------ |
| `tool` | [`Tool`](../interfaces/Tool.md) |

#### Returns

`void`

#### Defined in

[packages/core/src/tools.ts:121](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L121)

___

### <a id="gettool" name="gettool"></a> getTool

▸ **getTool**(`name`): `undefined` \| [`Tool`](../interfaces/Tool.md)

도구 이름으로 도구 가져오기

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`undefined` \| [`Tool`](../interfaces/Tool.md)

#### Defined in

[packages/core/src/tools.ts:128](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L128)

___

### <a id="getfunctiondefinitions" name="getfunctiondefinitions"></a> getFunctionDefinitions

▸ **getFunctionDefinitions**(): [`FunctionDefinition`](../interfaces/FunctionDefinition.md)[]

모든 도구의 함수 정의 가져오기

#### Returns

[`FunctionDefinition`](../interfaces/FunctionDefinition.md)[]

#### Defined in

[packages/core/src/tools.ts:135](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L135)

___

### <a id="execute" name="execute"></a> execute

▸ **execute**(`name`, `args`): `Promise`\<`any`\>

도구 실행

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `args` | `Record`\<`string`, `any`\> |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/core/src/tools.ts:142](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L142)
