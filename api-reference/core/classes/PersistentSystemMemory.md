[Core API - v0.1.0](/robota/api-reference/core/) / PersistentSystemMemory

# Class: PersistentSystemMemory

시스템 메시지를 유지하는 메모리

## Implements

- [`Memory`](/robota/api-reference/core/interfaces/Memory)

## Table of contents

### Constructors

- [constructor](/robota/api-reference/core/classes/PersistentSystemMemory#constructor)

### Methods

- [addMessage](/robota/api-reference/core/classes/PersistentSystemMemory#addmessage)
- [getMessages](/robota/api-reference/core/classes/PersistentSystemMemory#getmessages)
- [clear](/robota/api-reference/core/classes/PersistentSystemMemory#clear)
- [updateSystemPrompt](/robota/api-reference/core/classes/PersistentSystemMemory#updatesystemprompt)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new PersistentSystemMemory**(`systemPrompt`, `options?`): [`PersistentSystemMemory`](/robota/api-reference/core/classes/PersistentSystemMemory)

#### Parameters

| Name | Type |
| :------ | :------ |
| `systemPrompt` | `string` |
| `options?` | `Object` |
| `options.maxMessages?` | `number` |

#### Returns

[`PersistentSystemMemory`](/robota/api-reference/core/classes/PersistentSystemMemory)

#### Defined in

[packages/core/src/memory.ts:74](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L74)

## Methods

### <a id="addmessage" name="addmessage"></a> addMessage

▸ **addMessage**(`message`): `void`

메모리에 메시지를 추가합니다.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`Message`](/robota/api-reference/core/interfaces/Message) |

#### Returns

`void`

#### Implementation of

[Memory](/robota/api-reference/core/interfaces/Memory).[addMessage](/robota/api-reference/core/interfaces/Memory#addmessage)

#### Defined in

[packages/core/src/memory.ts:85](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L85)

___

### <a id="getmessages" name="getmessages"></a> getMessages

▸ **getMessages**(): [`Message`](/robota/api-reference/core/interfaces/Message)[]

저장된 모든 메시지를 가져옵니다.

#### Returns

[`Message`](/robota/api-reference/core/interfaces/Message)[]

#### Implementation of

[Memory](/robota/api-reference/core/interfaces/Memory).[getMessages](/robota/api-reference/core/interfaces/Memory#getmessages)

#### Defined in

[packages/core/src/memory.ts:89](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L89)

___

### <a id="clear" name="clear"></a> clear

▸ **clear**(): `void`

저장된 메시지를 지웁니다.

#### Returns

`void`

#### Implementation of

[Memory](/robota/api-reference/core/interfaces/Memory).[clear](/robota/api-reference/core/interfaces/Memory#clear)

#### Defined in

[packages/core/src/memory.ts:93](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L93)

___

### <a id="updatesystemprompt" name="updatesystemprompt"></a> updateSystemPrompt

▸ **updateSystemPrompt**(`systemPrompt`): `void`

시스템 프롬프트 업데이트

#### Parameters

| Name | Type |
| :------ | :------ |
| `systemPrompt` | `string` |

#### Returns

`void`

#### Defined in

[packages/core/src/memory.ts:106](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L106)
