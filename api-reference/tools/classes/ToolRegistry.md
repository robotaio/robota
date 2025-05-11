[Tools API - v0.1.0](/robota/api-reference/tools/) / ToolRegistry

# Class: ToolRegistry

도구 레지스트리 클래스

여러 도구를 등록하고 관리하는 클래스

## Table of contents

### Constructors

- [constructor](/robota/api-reference/tools/classes/ToolRegistry#constructor)

### Methods

- [register](/robota/api-reference/tools/classes/ToolRegistry#register)
- [registerMany](/robota/api-reference/tools/classes/ToolRegistry#registermany)
- [getTool](/robota/api-reference/tools/classes/ToolRegistry#gettool)
- [getAllTools](/robota/api-reference/tools/classes/ToolRegistry#getalltools)
- [executeTool](/robota/api-reference/tools/classes/ToolRegistry#executetool)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new ToolRegistry**(): [`ToolRegistry`](/robota/api-reference/tools/classes/ToolRegistry)

#### Returns

[`ToolRegistry`](/robota/api-reference/tools/classes/ToolRegistry)

## Methods

### <a id="register" name="register"></a> register

▸ **register**(`tool`): [`ToolRegistry`](/robota/api-reference/tools/classes/ToolRegistry)

도구 등록

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tool` | [`Tool`](/robota/api-reference/tools/interfaces/Tool)\<`any`, `any`\> | 등록할 도구 |

#### Returns

[`ToolRegistry`](/robota/api-reference/tools/classes/ToolRegistry)

#### Defined in

[index.ts:161](https://github.com/robotaio/robota/blob/main/packages/tools/src/index.ts#L161)

___

### <a id="registermany" name="registermany"></a> registerMany

▸ **registerMany**(`tools`): [`ToolRegistry`](/robota/api-reference/tools/classes/ToolRegistry)

여러 도구 등록

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tools` | [`Tool`](/robota/api-reference/tools/interfaces/Tool)\<`any`, `any`\>[] | 등록할 도구 배열 |

#### Returns

[`ToolRegistry`](/robota/api-reference/tools/classes/ToolRegistry)

#### Defined in

[index.ts:171](https://github.com/robotaio/robota/blob/main/packages/tools/src/index.ts#L171)

___

### <a id="gettool" name="gettool"></a> getTool

▸ **getTool**(`name`): `undefined` \| [`Tool`](/robota/api-reference/tools/interfaces/Tool)\<`any`, `any`\>

도구 가져오기

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | 가져올 도구 이름 |

#### Returns

`undefined` \| [`Tool`](/robota/api-reference/tools/interfaces/Tool)\<`any`, `any`\>

도구 또는 undefined

#### Defined in

[index.ts:184](https://github.com/robotaio/robota/blob/main/packages/tools/src/index.ts#L184)

___

### <a id="getalltools" name="getalltools"></a> getAllTools

▸ **getAllTools**(): [`Tool`](/robota/api-reference/tools/interfaces/Tool)\<`any`, `any`\>[]

모든 도구 가져오기

#### Returns

[`Tool`](/robota/api-reference/tools/interfaces/Tool)\<`any`, `any`\>[]

모든 등록된 도구 배열

#### Defined in

[index.ts:193](https://github.com/robotaio/robota/blob/main/packages/tools/src/index.ts#L193)

___

### <a id="executetool" name="executetool"></a> executeTool

▸ **executeTool**\<`TInput`, `TOutput`\>(`name`, `input`): `Promise`\<[`ToolResult`](/robota/api-reference/tools/interfaces/ToolResult)\<`TOutput`\>\>

도구 실행

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TInput` | `any` |
| `TOutput` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | 실행할 도구 이름 |
| `input` | `TInput` | 도구 입력 파라미터 |

#### Returns

`Promise`\<[`ToolResult`](/robota/api-reference/tools/interfaces/ToolResult)\<`TOutput`\>\>

도구 실행 결과

#### Defined in

[index.ts:204](https://github.com/robotaio/robota/blob/main/packages/tools/src/index.ts#L204)
