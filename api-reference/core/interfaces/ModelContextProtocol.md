[Core API - v0.1.0](/robota/api-reference/core/) / ModelContextProtocol

# Interface: ModelContextProtocol

모델 컨텍스트 프로토콜(MCP)

다양한 AI 모델 제공업체와 통합하기 위한 표준화된 인터페이스

## Table of contents

### Properties

- [options](/robota/api-reference/core/interfaces/ModelContextProtocol#options)

### Methods

- [chat](/robota/api-reference/core/interfaces/ModelContextProtocol#chat)
- [chatStream](/robota/api-reference/core/interfaces/ModelContextProtocol#chatstream)
- [formatMessages](/robota/api-reference/core/interfaces/ModelContextProtocol#formatmessages)
- [formatFunctions](/robota/api-reference/core/interfaces/ModelContextProtocol#formatfunctions)
- [parseResponse](/robota/api-reference/core/interfaces/ModelContextProtocol#parseresponse)
- [parseStreamingChunk](/robota/api-reference/core/interfaces/ModelContextProtocol#parsestreamingchunk)
- [countTokens](/robota/api-reference/core/interfaces/ModelContextProtocol#counttokens)

## Properties

### <a id="options" name="options"></a> options

• **options**: [`ProviderOptions`](/robota/api-reference/core/interfaces/ProviderOptions)

기본 모델 및 설정

#### Defined in

[packages/core/src/model-context-protocol.ts:20](https://github.com/robotaio/robota/blob/main/packages/core/src/model-context-protocol.ts#L20)

## Methods

### <a id="chat" name="chat"></a> chat

▸ **chat**(`context`, `options?`): `Promise`\<[`ModelResponse`](/robota/api-reference/core/interfaces/ModelResponse)\>

주어진 컨텍스트로 모델에 요청을 보내고 응답을 받습니다.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`Context`](/robota/api-reference/core/interfaces/Context) | 요청 컨텍스트 (메시지, 함수 정의 등) |
| `options?` | `Object` | 추가 옵션 |
| `options.temperature?` | `number` | - |
| `options.maxTokens?` | `number` | - |
| `options.functionCallMode?` | ``"auto"`` \| ``"force"`` \| ``"disabled"`` | - |
| `options.forcedFunction?` | `string` | - |
| `options.forcedArguments?` | `Record`\<`string`, `any`\> | - |

#### Returns

`Promise`\<[`ModelResponse`](/robota/api-reference/core/interfaces/ModelResponse)\>

모델 응답

#### Defined in

[packages/core/src/model-context-protocol.ts:29](https://github.com/robotaio/robota/blob/main/packages/core/src/model-context-protocol.ts#L29)

___

### <a id="chatstream" name="chatstream"></a> chatStream

▸ **chatStream**(`context`, `options?`): `AsyncIterable`\<[`StreamingResponseChunk`](/robota/api-reference/core/interfaces/StreamingResponseChunk), `any`, `any`\>

주어진 컨텍스트로 모델에 스트리밍 요청을 보내고 응답 청크를 받습니다.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`Context`](/robota/api-reference/core/interfaces/Context) | 요청 컨텍스트 (메시지, 함수 정의 등) |
| `options?` | `Object` | 추가 옵션 |
| `options.temperature?` | `number` | - |
| `options.maxTokens?` | `number` | - |
| `options.functionCallMode?` | ``"auto"`` \| ``"force"`` \| ``"disabled"`` | - |
| `options.forcedFunction?` | `string` | - |
| `options.forcedArguments?` | `Record`\<`string`, `any`\> | - |

#### Returns

`AsyncIterable`\<[`StreamingResponseChunk`](/robota/api-reference/core/interfaces/StreamingResponseChunk), `any`, `any`\>

스트리밍 응답 AsyncIterable

#### Defined in

[packages/core/src/model-context-protocol.ts:44](https://github.com/robotaio/robota/blob/main/packages/core/src/model-context-protocol.ts#L44)

___

### <a id="formatmessages" name="formatmessages"></a> formatMessages

▸ **formatMessages**(`messages`): `any`

메시지를 모델이 이해할 수 있는 형식으로 포맷합니다.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messages` | [`Message`](/robota/api-reference/core/interfaces/Message)[] | 메시지 배열 |

#### Returns

`any`

포맷된 메시지

#### Defined in

[packages/core/src/model-context-protocol.ts:58](https://github.com/robotaio/robota/blob/main/packages/core/src/model-context-protocol.ts#L58)

___

### <a id="formatfunctions" name="formatfunctions"></a> formatFunctions

▸ **formatFunctions**(`functions`): `any`

함수 정의를 모델이 이해할 수 있는 형식으로 포맷합니다.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `functions` | [`FunctionSchema`](/robota/api-reference/core/interfaces/FunctionSchema)[] | 함수 정의 배열 |

#### Returns

`any`

포맷된 함수 정의

#### Defined in

[packages/core/src/model-context-protocol.ts:66](https://github.com/robotaio/robota/blob/main/packages/core/src/model-context-protocol.ts#L66)

___

### <a id="parseresponse" name="parseresponse"></a> parseResponse

▸ **parseResponse**(`response`): [`ModelResponse`](/robota/api-reference/core/interfaces/ModelResponse)

모델 응답을 표준 형식으로 파싱합니다.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `response` | `any` | 모델의 원시 응답 |

#### Returns

[`ModelResponse`](/robota/api-reference/core/interfaces/ModelResponse)

표준화된 ModelResponse

#### Defined in

[packages/core/src/model-context-protocol.ts:74](https://github.com/robotaio/robota/blob/main/packages/core/src/model-context-protocol.ts#L74)

___

### <a id="parsestreamingchunk" name="parsestreamingchunk"></a> parseStreamingChunk

▸ **parseStreamingChunk**(`chunk`): [`StreamingResponseChunk`](/robota/api-reference/core/interfaces/StreamingResponseChunk)

스트리밍 응답 청크를 표준 형식으로 파싱합니다.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chunk` | `any` | 모델의 원시 응답 청크 |

#### Returns

[`StreamingResponseChunk`](/robota/api-reference/core/interfaces/StreamingResponseChunk)

표준화된 StreamingResponseChunk

#### Defined in

[packages/core/src/model-context-protocol.ts:82](https://github.com/robotaio/robota/blob/main/packages/core/src/model-context-protocol.ts#L82)

___

### <a id="counttokens" name="counttokens"></a> countTokens

▸ **countTokens**(`input`): `Promise`\<`number`\>

모델의 토큰 사용량을 계산합니다.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` | 입력 텍스트 |

#### Returns

`Promise`\<`number`\>

추정 토큰 수

#### Defined in

[packages/core/src/model-context-protocol.ts:90](https://github.com/robotaio/robota/blob/main/packages/core/src/model-context-protocol.ts#L90)
