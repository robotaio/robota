[Core API - v0.1.0](/api-reference/core/) / Memory

# Interface: Memory

메모리 인터페이스

메모리는 대화 이력을 저장하고 관리하는 역할을 합니다.

## Implemented by

- [`PersistentSystemMemory`](/api-reference/core/classes/PersistentSystemMemory)
- [`SimpleMemory`](/api-reference/core/classes/SimpleMemory)

## Table of contents

### Methods

- [addMessage](/api-reference/core/interfaces/Memory#addmessage)
- [getMessages](/api-reference/core/interfaces/Memory#getmessages)
- [clear](/api-reference/core/interfaces/Memory#clear)

## Methods

### <a id="addmessage" name="addmessage"></a> addMessage

▸ **addMessage**(`message`): `void`

메모리에 메시지를 추가합니다.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`Message`](/api-reference/core/interfaces/Message) |

#### Returns

`void`

#### Defined in

[packages/core/src/memory.ts:12](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L12)

___

### <a id="getmessages" name="getmessages"></a> getMessages

▸ **getMessages**(): [`Message`](/api-reference/core/interfaces/Message)[]

저장된 모든 메시지를 가져옵니다.

#### Returns

[`Message`](/api-reference/core/interfaces/Message)[]

#### Defined in

[packages/core/src/memory.ts:17](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L17)

___

### <a id="clear" name="clear"></a> clear

▸ **clear**(): `void`

저장된 메시지를 지웁니다.

#### Returns

`void`

#### Defined in

[packages/core/src/memory.ts:22](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L22)
