[Core API](../../) / [Exports](../modules) / Robota

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

- [constructor](Robota#constructor)

### Methods

- [addResponseToMemory](Robota#addresponsetomemory)
- [addSystemMessage](Robota#addsystemmessage)
- [chat](Robota#chat)
- [clearMemory](Robota#clearmemory)
- [configureFunctionCall](Robota#configurefunctioncall)
- [registerFunction](Robota#registerfunction)
- [registerFunctions](Robota#registerfunctions)
- [run](Robota#run)
- [runStream](Robota#runstream)
- [setFunctionCallMode](Robota#setfunctioncallmode)
- [setSystemMessages](Robota#setsystemmessages)
- [setSystemPrompt](Robota#setsystemprompt)

## Constructors

### constructor

• **new Robota**(`options`): [`Robota`](Robota)

Robota 인스턴스 생성

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`RobotaOptions`](../interfaces/RobotaOptions) | Robota 초기화 옵션 |

#### Returns

[`Robota`](Robota)

#### Defined in

[packages/core/src/robota.ts:51](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/robota.ts#L51)

## Methods

### addResponseToMemory

▸ **addResponseToMemory**(`response`): `void`

응답 메시지 추가

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `response` | [`ModelResponse`](../interfaces/ModelResponse) | 모델 응답 |

#### Returns

`void`

#### Defined in

[packages/core/src/robota.ts:288](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/robota.ts#L288)

___

### addSystemMessage

▸ **addSystemMessage**(`content`): `void`

기존 시스템 메시지에 새 시스템 메시지 추가

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `content` | `string` | 추가할 시스템 메시지 내용 |

#### Returns

`void`

#### Defined in

[packages/core/src/robota.ts:106](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/robota.ts#L106)

___

### chat

▸ **chat**(`message`, `options?`): `Promise`\<`string`\>

채팅 메시지 처리 및 응답 생성

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | 사용자 메시지 |
| `options` | [`RunOptions`](../interfaces/RunOptions) | 실행 옵션 |

#### Returns

`Promise`\<`string`\>

모델 응답 내용

#### Defined in

[packages/core/src/robota.ts:241](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/robota.ts#L241)

___

### clearMemory

▸ **clearMemory**(): `void`

메모리 초기화

#### Returns

`void`

#### Defined in

[packages/core/src/robota.ts:299](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/robota.ts#L299)

___

### configureFunctionCall

▸ **configureFunctionCall**(`config`): `void`

함수 호출 설정 구성

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Object` | 함수 호출 구성 옵션 |
| `config.allowedFunctions?` | `string`[] | - |
| `config.maxCalls?` | `number` | - |
| `config.mode?` | [`FunctionCallMode`](../modules#functioncallmode) | - |
| `config.timeout?` | `number` | - |

#### Returns

`void`

#### Defined in

[packages/core/src/robota.ts:147](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/robota.ts#L147)

___

### registerFunction

▸ **registerFunction**(`schema`, `fn`): `void`

단일 함수 등록

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `schema` | [`FunctionSchema`](../interfaces/FunctionSchema) | 함수 스키마 |
| `fn` | `Function` | 함수 구현 |

#### Returns

`void`

#### Defined in

[packages/core/src/robota.ts:200](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/robota.ts#L200)

___

### registerFunctions

▸ **registerFunctions**(`functions`): `void`

여러 함수 등록

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `functions` | `Record`\<`string`, `Function`\> | 함수 이름과 구현을 담은 객체 |

#### Returns

`void`

#### Defined in

[packages/core/src/robota.ts:172](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/robota.ts#L172)

___

### run

▸ **run**(`prompt`, `options?`): `Promise`\<`string`\>

텍스트 프롬프트 실행

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prompt` | `string` | 사용자 프롬프트 |
| `options` | [`RunOptions`](../interfaces/RunOptions) | 실행 옵션 |

#### Returns

`Promise`\<`string`\>

모델 응답 내용

#### Defined in

[packages/core/src/robota.ts:223](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/robota.ts#L223)

___

### runStream

▸ **runStream**(`prompt`, `options?`): `Promise`\<`AsyncIterable`\<[`StreamingResponseChunk`](../interfaces/StreamingResponseChunk), `any`, `any`\>\>

스트리밍 응답 생성

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prompt` | `string` | 사용자 프롬프트 |
| `options` | [`RunOptions`](../interfaces/RunOptions) | 실행 옵션 |

#### Returns

`Promise`\<`AsyncIterable`\<[`StreamingResponseChunk`](../interfaces/StreamingResponseChunk), `any`, `any`\>\>

스트리밍 응답 청크 이터레이터

#### Defined in

[packages/core/src/robota.ts:272](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/robota.ts#L272)

___

### setFunctionCallMode

▸ **setFunctionCallMode**(`mode`): `void`

함수 호출 모드 설정

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mode` | [`FunctionCallMode`](../modules#functioncallmode) | 함수 호출 모드 ('auto', 'force', 'disabled') |

#### Returns

`void`

#### Defined in

[packages/core/src/robota.ts:138](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/robota.ts#L138)

___

### setSystemMessages

▸ **setSystemMessages**(`messages`): `void`

여러 시스템 메시지 설정

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messages` | [`Message`](../interfaces/Message)[] | 시스템 메시지 배열 |

#### Returns

`void`

#### Defined in

[packages/core/src/robota.ts:96](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/robota.ts#L96)

___

### setSystemPrompt

▸ **setSystemPrompt**(`prompt`): `void`

단일 시스템 프롬프트 설정

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prompt` | `string` | 시스템 프롬프트 내용 |

#### Returns

`void`

#### Defined in

[packages/core/src/robota.ts:86](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/robota.ts#L86)
