import {Component, For, getOwner, runWithOwner, Show} from 'solid-js';
import {EditableValue} from '../lib/editable-request-input';
import {Icon} from './Icon';
import {mdiPencilCircleOutline} from '@mdi/js';

export const InputString: Component<{
    editable: EditableValue;
}> = props => {
    const owner = getOwner();
    return (
        <input
            class='grow text-gray-700 outline-0 rounded px-1'
            classList={{
                'bg-red-300': !(props.editable.isValid?.() ?? true),
                'bg-white': props.editable.isValid?.() ?? true,
            }}
            value={props.editable.strValue?.()}
            onInput={e => {
                runWithOwner(owner, () => {
                    props.editable.setStrValue?.(e.currentTarget.value);
                });
            }}
        />
    );
};

export const InputBoolean: Component<{
    editable: EditableValue;
}> = props => {
    const owner = getOwner();
    return (
        <select class='grow bg-white text-gray-700 outline-0 rounded px-1' onChange={e => {
            runWithOwner(owner, () => {
                props.editable.setBoolValue?.(e.currentTarget.value === 'true');
            });
        }}>
            <option value='true' selected={props.editable.boolValue?.()}>true</option>
            <option value='false' selected={!props.editable.boolValue?.()}>false</option>
        </select>
    );
};

export const InputEnum: Component<{
    editable: EditableValue;
}> = props => {
    const owner = getOwner();
    return (
        <select class='grow bg-white text-gray-700 outline-0 rounded px-1' onChange={e => {
            runWithOwner(owner, () => {
                props.editable.setStrValue?.(e.currentTarget.value);
            });
        }}>
            <For each={props.editable.enumValues?.()}>{val => (
                <option value={val.name} selected={val.name === props.editable.strValue?.()}>{val.name}</option>
            )}</For>
        </select>
    );
};

export const ReqInput: Component<{
    editable: EditableValue;
}> = props => {
    return (
        <div class='grow rounded px-1 flex items-center gap-1'>
            <Show when={props.editable.type === 'string' || props.editable.type === 'number' || props.editable.type === 'json'}>
                <Icon icon={mdiPencilCircleOutline} class='fill-cyan-700'/>
                <InputString editable={props.editable}/>
            </Show>
            <Show when={props.editable.type === 'enum'}>
                <Icon icon={mdiPencilCircleOutline} class='fill-cyan-700'/>
                <InputEnum editable={props.editable}/>
            </Show>
            <Show when={props.editable.type === 'boolean'}>
                <Icon icon={mdiPencilCircleOutline} class='fill-cyan-700'/>
                <InputBoolean editable={props.editable}/>
            </Show>
        </div>
    );
};