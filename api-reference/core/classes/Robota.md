[Core API - v0.1.0](/api-reference/core/) / Robota

# Class: Robota

Robota의 메인 클래스
에이전트를 초기화하고 실행하는 인터페이스 제공

**`Example`**

```ts
const robota = new Robota({
  provider: new OpenAIProvider({
    model: 'gpt-4',
    client: openaiClient
  }),
  systemPrompt: '당신은 도움이 되는 AI 어시스턴트입니다.'
});

const response = await robota.run('안녕하세요!');
```

## Table of contents

### Constructors

- [constructor](/api-reference/core/classes/Robota#constructor)

### Methods

- [setSystemPrompt](/api-reference/core/classes/Robota#setsystemprompt)
- [setSystemMessages](/api-reference/core/classes/Robota#setsystemmessages)
- [addSystemMessage](/api-reference/core/classes/Robota#addsystemmessage)
- [setFunctionCallMode](/api-reference/core/classes/Robota#setfunctioncallmode)
- [configureFunctionCall](/api-reference/core/classes/Robota#configurefunctioncall)
- [registerFunctions](/api-reference/core/classes/Robota#registerfunctions)
- [registerFunction](/api-reference/core/classes/Robota#registerfunction)
- [run](/api-reference/core/classes/Robota#run)
- [chat](/api-reference/core/classes/Robota#chat)
- [runStream](/api-reference/core/classes/Robota#runstream)
- [addResponseToMemory](/api-reference/core/classes/Robota#addresponsetomemory)
- [clearMemory](/api-reference/core/classes/Robota#clearmemory)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new Robota**(`options`): [`Robota`](/api-reference/core/classes/Robota)

Robota 인스턴스 생성

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`RobotaOptions`](/api-reference/core/interfaces/RobotaOptions) | Robota 초기화 옵션 |

#### Returns

[`Robota`](/api-reference/core/classes/Robota)

#### Defined in

[packages/core/src/robota.ts:51](https://github.com/robotaio/robota/blob/main/packages/core/src/robota.ts#L51)

## Methods

### <a id="setsystemprompt" name="setsystemprompt"></a> setSystemPrompt

▸ **setSystemPrompt**(`prompt`): `void`

단일 시스템 프롬프트 설정

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prompt` | `string` | 시스템 프롬프트 내용 |

#### Returns

`void`

#### Defined in

[packages/core/src/robota.ts:86](https://github.com/robotaio/robota/blob/main/packages/core/src/robota.ts#L86)

___

### <a id="setsystemmessages" name="setsystemmessages"></a> setSystemMessages

▸ **setSystemMessages**(`messages`): `void`

여러 시스템 메시지 설정

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messages` | [`Message`](/api-reference/core/interfaces/Message)[] | 시스템 메시지 배열 |

#### Returns

`void`

#### Defined in

[packages/core/src/robota.ts:96](https://github.com/robotaio/robota/blob/main/packages/core/src/robota.ts#L96)

___

### <a id="addsystemmessage" name="addsystemmessage"></a> addSystemMessage

▸ **addSystemMessage**(`content`): `void`

기존 시스템 메시지에 새 시스템 메시지 추가

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `content` | `string` | 추가할 시스템 메시지 내용 |

#### Returns

`void`

#### Defined in

[packages/core/src/robota.ts:106](https://github.com/robotaio/robota/blob/main/packages/core/src/robota.ts#L106)

___

### <a id="setfunctioncallmode" name="setfunctioncallmode"></a> setFunctionCallMode

▸ **setFunctionCallMode**(`mode`): `void`

함수 호출 모드 설정

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mode` | [`FunctionCallMode`](/api-reference/core/#functioncallmode) | 함수 호출 모드 ('auto', 'force', 'disabled') |

#### Returns

`void`

#### Defined in

[packages/core/src/robota.ts:138](https://github.com/robotaio/robota/blob/main/packages/core/src/robota.ts#L138)

___

### <a id="configurefunctioncall" name="configurefunctioncall"></a> configureFunctionCall

▸ **configureFunctionCall**(`config`): `void`

함수 호출 설정 구성

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Object` | 함수 호출 구성 옵션 |
| `config.mode?` | [`FunctionCallMode`](/api-reference/core/#functioncallmode) | - |
| `config.maxCalls?` | `number` | - |
| `config.timeout?` | `number` | - |
| `config.allowedFunctions?` | `string`[] | - |

#### Returns

`void`

#### Defined in

[packages/core/src/robota.ts:147](https://github.com/robotaio/robota/blob/main/packages/core/src/robota.ts#L147)

___

### <a id="registerfunctions" name="registerfunctions"></a> registerFunctions

▸ **registerFunctions**(`functions`): `void`

여러 함수 등록

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `functions` | `Record`\<`string`, `Function`\> | 함수 이름과 구현을 담은 객체 |

#### Returns

`void`

#### Defined in

[packages/core/src/robota.ts:172](https://github.com/robotaio/robota/blob/main/packages/core/src/robota.ts#L172)

___

### <a id="registerfunction" name="registerfunction"></a> registerFunction

▸ **registerFunction**(`schema`, `fn`): `void`

단일 함수 등록

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `schema` | [`FunctionSchema`](/api-reference/core/interfaces/FunctionSchema) | 함수 스키마 |
| `fn` | `Function` | 함수 구현 |

#### Returns

`void`

#### Defined in

[packages/core/src/robota.ts:200](https://github.com/robotaio/robota/blob/main/packages/core/src/robota.ts#L200)

___

### <a id="run" name="run"></a> run

▸ **run**(`prompt`, `options?`): `Promise`\<`string`\>

텍스트 프롬프트 실행

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prompt` | `string` | 사용자 프롬프트 |
| `options` | [`RunOptions`](/api-reference/core/interfaces/RunOptions) | 실행 옵션 |

#### Returns

`Promise`\<`string`\>

모델 응답 내용

#### Defined in

[packages/core/src/robota.ts:223](https://github.com/robotaio/robota/blob/main/packages/core/src/robota.ts#L223)

___

### <a id="chat" name="chat"></a> chat

▸ **chat**(`message`, `options?`): `Promise`\<`string`\>

채팅 메시지 처리 및 응답 생성

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | 사용자 메시지 |
| `options` | [`RunOptions`](/api-reference/core/interfaces/RunOptions) | 실행 옵션 |

#### Returns

`Promise`\<`string`\>

모델 응답 내용

#### Defined in

[packages/core/src/robota.ts:241](https://github.com/robotaio/robota/blob/main/packages/core/src/robota.ts#L241)

___

### <a id="runstream" name="runstream"></a> runStream

▸ **runStream**(`prompt`, `options?`): `Promise`\<`AsyncIterable`\<[`StreamingResponseChunk`](/api-reference/core/interfaces/StreamingResponseChunk), `any`, `any`\>\>

스트리밍 응답 생성

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prompt` | `string` | 사용자 프롬프트 |
| `options` | [`RunOptions`](/api-reference/core/interfaces/RunOptions) | 실행 옵션 |

#### Returns

`Promise`\<`AsyncIterable`\<[`StreamingResponseChunk`](/api-reference/core/interfaces/StreamingResponseChunk), `any`, `any`\>\>

스트리밍 응답 청크 이터레이터

#### Defined in

[packages/core/src/robota.ts:272](https://github.com/robotaio/robota/blob/main/packages/core/src/robota.ts#L272)

___

### <a id="addresponsetomemory" name="addresponsetomemory"></a> addResponseToMemory

▸ **addResponseToMemory**(`response`): `void`

응답 메시지 추가

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `response` | [`ModelResponse`](/api-reference/core/interfaces/ModelResponse) | 모델 응답 |

#### Returns

`void`

#### Defined in

[packages/core/src/robota.ts:288](https://github.com/robotaio/robota/blob/main/packages/core/src/robota.ts#L288)

___

### <a id="clearmemory" name="clearmemory"></a> clearMemory

▸ **clearMemory**(): `void`

메모리 초기화

#### Returns

`void`

#### Defined in

[packages/core/src/robota.ts:299](https://github.com/robotaio/robota/blob/main/packages/core/src/robota.ts#L299)
