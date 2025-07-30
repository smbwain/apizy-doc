import {Component, getOwner, ParentComponent, Show} from 'solid-js';
import {Editable, EditableBoolean, EditableString} from '../lib/editable-req';
import {Icon} from './Icon';
import {
    mdiCheckboxBlankOutline,
    mdiCheckboxOutline,
    mdiNull,
    mdiPencil,
    mdiPencilOff,
    mdiPencilPlusOutline, mdiTrashCanOutline,
} from '@mdi/js';
import {
    EditableRequestInput,
    EditableRequestInputBoolean,
    EditableRequestInputString,
} from '../lib/editable-request-input';

const ChButton: ParentComponent<{
    active?: boolean;
    onClick: () => void;
}> = props => {
    return (
        <button
            classList={{
                'text-gray-200 fill-gray-200': !props.active,
                'bg-gray-200 text-cyan-800 fill-cyan-800': props.active
            }}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
};

export const InputString: Component<{
    editable: EditableRequestInputString;
}> = props => {
    return (
        <input
            class='grow bg-white text-gray-700 outline-0 rounded px-1'
            value={props.editable.get().value}
            onInput={e => {
                props.editable.set(e.currentTarget.value);
            }}
        />
    );
};

export const InputBoolean: Component<{
    editable: EditableRequestInputBoolean;
}> = props => {
    return (
        <div>
            <select class='bg-white text-gray-700 outline-0 rounded px-1' onChange={e => {
                props.editable.set(e.currentTarget.value === 'true');
            }}>
                <option value='true' selected={props.editable.get().value}>true</option>
                <option value='false' selected={!props.editable.get().value}>false</option>
            </select>
            {/*<input type='checkbox' checked={props.editable.get().value} onClick={() => {*/}
            {/*    props.editable.set(!props.editable.get().value);*/}
            {/*}}/>*/}
        </div>
    );
};

export const ReqInput: Component<{
    editableInput: EditableRequestInput;
}> = props => {
    return (
        <div class='grow rounded px-1 flex items-center gap-1'>
            <Show when={props.editableInput.type === 'string' ? props.editableInput : null}>{e => (
                <InputString editable={e()}/>
            )}</Show>
            <Show when={props.editableInput.type === 'boolean' ? props.editableInput : null}>{e => (
                <InputBoolean editable={e()}/>
            )}</Show>
            {/*<Show when={props.editableInput.get() === undefined}>*/}
            {/*    <ChButton*/}
            {/*        active={props.editableInput.get() !== undefined}*/}
            {/*        onClick={() => {*/}
            {/*            props.editableInput.setup();*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <Icon icon={mdiPencil}/>*/}
            {/*    </ChButton>*/}
            {/*</Show>*/}
            {/*<Show when={props.editableInput.get() !== undefined}>*/}
            {/*    <Show when={props.editableInput.nullable}>*/}
            {/*        <ChButton*/}
            {/*            active={props.editableInput.get() === null}*/}
            {/*            onClick={() => {*/}
            {/*                if (props.editableInput.get() === null) {*/}
            {/*                    props.editableInput.setup();*/}
            {/*                } else {*/}
            {/*                    props.editableInput.setNull();*/}
            {/*                }*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            <Icon icon={mdiNull}/>*/}
            {/*        </ChButton>*/}
            {/*    </Show>*/}
            {/*    <Show when={props.editableInput.get() !== null} fallback={'null'}>*/}
            {/*        { props.editableInput.type === 'object' ? (*/}
            {/*            null*/}
            {/*        ) : (*/}
            {/*            props.editableInput.type === 'string' ? (*/}
            {/*                <InputString editable={props.editableInput}/>*/}
            {/*            ) : props.editableInput.type === 'boolean' ? (*/}
            {/*                <InputBoolean editable={props.editableInput}/>*/}
            {/*            ) : null*/}
            {/*        ) }*/}
            {/*    </Show>*/}
            {/*    <Show when={props.editableInput.optional}>*/}
            {/*        <ChButton*/}
            {/*            active={props.editableInput.get() !== undefined}*/}
            {/*            onClick={() => {*/}
            {/*                props.editableInput.unset();*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            <Icon icon={mdiTrashCanOutline}/>*/}
            {/*        </ChButton>*/}
            {/*    </Show>*/}
            {/*</Show>*/}
        </div>
    );
};