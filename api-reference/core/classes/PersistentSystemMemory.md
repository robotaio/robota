[Core API - v0.1.0](/api-reference/core/) / PersistentSystemMemory

# Class: PersistentSystemMemory

시스템 메시지를 유지하는 메모리

## Implements

- [`Memory`](/api-reference/core/interfaces/Memory.md)

## Table of contents

### Constructors

- [constructor](#constructor)

### Methods

- [addMessage](#addmessage)
- [getMessages](#getmessages)
- [clear](#clear)
- [updateSystemPrompt](#updatesystemprompt)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new PersistentSystemMemory**(`systemPrompt`, `options?`): [`PersistentSystemMemory`]()

#### Parameters

| Name | Type |
| :------ | :------ |
| `systemPrompt` | `string` |
| `options?` | `Object` |
| `options.maxMessages?` | `number` |

#### Returns

[`PersistentSystemMemory`]()

#### Defined in

[packages/core/src/memory.ts:74](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L74)

## Methods

### <a id="addmessage" name="addmessage"></a> addMessage

▸ **addMessage**(`message`): `void`

메모리에 메시지를 추가합니다.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`Message`](/api-reference/core/interfaces/Message.md) |

#### Returns

`void`

#### Implementation of

[Memory](/api-reference/core/interfaces/Memory.md).[addMessage](/api-reference/core/interfaces/Memory.md#addmessage)

#### Defined in

[packages/core/src/memory.ts:85](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L85)

___

### <a id="getmessages" name="getmessages"></a> getMessages

▸ **getMessages**(): [`Message`](/api-reference/core/interfaces/Message.md)[]

저장된 모든 메시지를 가져옵니다.

#### Returns

[`Message`](/api-reference/core/interfaces/Message.md)[]

#### Implementation of

[Memory](/api-reference/core/interfaces/Memory.md).[getMessages](/api-reference/core/interfaces/Memory.md#getmessages)

#### Defined in

[packages/core/src/memory.ts:89](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L89)

___

### <a id="clear" name="clear"></a> clear

▸ **clear**(): `void`

저장된 메시지를 지웁니다.

#### Returns

`void`

#### Implementation of

[Memory](/api-reference/core/interfaces/Memory.md).[clear](/api-reference/core/interfaces/Memory.md#clear)

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
