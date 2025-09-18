import {Component, createMemo, createSignal, For, getOwner, JSX, runWithOwner, Show} from 'solid-js';
import {ApiDescription, TypeDescription} from '../lib/api-description';
import {Icon} from './Icon';
import {
    mdiCheckBold,
    mdiDeleteCircleOutline,
    mdiLanguageTypescript,
    mdiMinusBoxOutline,
    mdiPlusBoxOutline,
    mdiPlusCircleOutline,
    mdiShape,
} from '@mdi/js';
import {TypeLink} from './TypeLink';
import {ReqInput} from './ReqInput';
import {EditableRequestInput} from '../lib/editable-request-input';

export const ShortView: Component<{
    api: ApiDescription;
    desc: TypeDescription;
}> = props => {
    return (
        <>
            {(props.desc.type.alias) ? (
                <>
                    <Icon icon={mdiShape}/>
                    {props.desc.type.alias}
                </>
            ) : (props.desc.type.arrayOf) ? (
                <>
                    <span class='text-amber-700'>Array&lt; </span>
                    <ShortView api={props.api} desc={props.desc.type.arrayOf}/>
                    <span class='text-amber-800'> &gt;</span>
                </>
            ) : (props.desc.type.ts) ? (
                <>{props.desc.type.ts}</>
            ) : (props.desc.type.objectOf) ? (
                '{...}'
            ) : null}
            {(props.desc.nullable) ? (
                <div class='text-amber-700'> | null</div>
            ) : null}
        </>
    );
};

export const FullView: Component<{
    api: ApiDescription;
    desc: TypeDescription;
    line?: boolean;
    editableInput?: EditableRequestInput;
}> = props => {
    const nullable = props.desc.nullable ? <div class='text-amber-700 font-bold'> | null</div> : null;
    return (
        <div class='pl-3.5 ml-2.5 my-1 flex flex-col gap-1' classList={{
            'border-l border-gray-700 hover:border-gray-500': !!props.line,
        }}>
            {props.desc.description ? (
                <div class='italic text-gray-500'>{props.desc.description}</div>
            ) : null}
            {(props.desc.type.alias) ? (
                <>
                    <div class='flex items-center gap-1 text-gray-500 fill-gray-500'>
                        <TypeLink name={props.desc.type.alias}/>
                        {nullable}
                    </div>
                    <FullView api={props.api} desc={props.api.types[props.desc.type.alias]} editableInput={props.editableInput}/>
                </>
            ) : (props.desc.type.arrayOf) ? (
                <>
                    <div class='flex gap-1'>
                        <div class='text-amber-700 font-bold'>Array&lt; ... &gt;</div>
                        {nullable}
                        <Show when={props.editableInput?.type === 'array' ? props.editableInput : null}>{ei => (
                            <>
                                [{ei().get().value.length}]
                                <button onClick={() => {
                                    ei().insert();
                                }}>
                                    <Icon icon={mdiPlusCircleOutline}/>
                                </button>
                            </>
                        )}</Show>
                    </div>
                    <Show
                        when={(props.editableInput?.type === 'array' && props.editableInput.get().value.length) ? props.editableInput : null}
                        fallback={<FullView api={props.api} desc={props.desc.type.arrayOf}/>}
                    >{ei => (
                        <For each={ei().get().value}>{(e, index) => (
                            <TypeDoc2
                                api={props.api}
                                desc={props.desc.type.arrayOf!}
                                name={index().toString()}
                                icons={
                                    <button onClick={() => {
                                        ei().remove(index());
                                    }}>
                                        <Icon icon={mdiDeleteCircleOutline}/>
                                    </button>
                                }
                                editableInput={e}
                            />
                        )}</For>
                    )}</Show>
                </>
            ) : (props.desc.type.ts) ? (
                <div class='flex gap-1'>
                    <Icon icon={mdiLanguageTypescript}/>
                    <code>{props.desc.type.ts}{nullable}</code>
                </div>
            ) : (props.desc.type.objectOf) ? (
                <>
                    <div class='flex gap-1'>
                        <div class='text-gray-500 font-bold'>{'Object {...}'}</div>
                        {nullable}
                    </div>
                    <For each={Object.keys(props.desc.type.objectOf).sort()}>{key => (
                        <TypeDoc2
                            api={props.api}
                            desc={props.desc.type.objectOf![key]}
                            name={key}
                            editableInput={props.editableInput?.get().value?.[key]}
                        />
                    )}</For>
                </>
            ) : null }
        </div>
    );
}

export const TypeDoc2: Component<{
    api: ApiDescription;
    desc: TypeDescription;
    expandedByDefault?: boolean;
    name?: string;
    icons?: JSX.Element;
    editableInput?: EditableRequestInput;
}> = (props) => {
    const [expanded, setExpanded] = createSignal(props.expandedByDefault ?? false);
    const expandable = createMemo(() => {
        let expandable = false;

        let currentDesc = props.desc;
        for(;;) {
            if (currentDesc.type.objectOf || currentDesc.type.alias || currentDesc.description) {
                expandable = true;
                break;
            }
            if (currentDesc.type.arrayOf) {
                if (props.editableInput) {
                    return true;
                }
                currentDesc = currentDesc.type.arrayOf;
                continue;
            }
            return;
        }

        return expandable;
    });
    const owner = getOwner();
    return (
        <div>
            <div
                class='flex gap-1 items-center'
            >
                <div
                    class='flex gap-1 items-center group'
                    classList={{
                        'cursor-pointer hover:text-pink-100': expandable(),
                    }}
                    onClick={() => {
                        if (expandable()) {
                            setExpanded(e => !e);
                        }
                    }}
                >
                    <div class='w-5 shrink-0 fill-gray-500 group-hover:fill-gray-300'>
                        <Show when={expandable()}>
                            <Icon icon={expanded() ? mdiMinusBoxOutline : mdiPlusBoxOutline}/>
                        </Show>
                    </div>
                    {props.name ? (
                        <>
                            <div class='flex items-center font-bold text-emerald-500' classList={{
                                'text-emerald-800': (props.desc.inputOptional && !props.editableInput?.get().isSet) || props.desc.outputExtendable,
                            }}>{props.name}:</div>
                        </>
                    ) : null}
                </div>
                {props.icons}
                <Show when={props.desc.inputOptional}>
                    <div
                        class='bg-cyan-900 rounded-xs px-1 text-gray-300 uppercase text-xs font-bold flex items-center gap-1 group'
                        classList={{
                            'cursor-pointer': !!props.editableInput,
                        }}
                        onClick={() => {
                            // runWithOwner(owner, () => {
                            //     props.editableInput!.setIsSet(!props.editableInput!.get().isSet);
                            // });
                        }}
                    >
                        Optional
                        <Show when={props.editableInput}>
                            <div class='bg-gray-400 w-3 h-3 rounded-xs fill-black flex items-center justify-center group-hover:bg-white'>
                                <Show when={props.editableInput!.get().isSet}>
                                    <Icon icon={mdiCheckBold} size='10'/>
                                </Show>
                            </div>
                        </Show>
                    </div>
                </Show>
                <Show when={props.editableInput && props.desc.nullable && (!props.desc.inputOptional || props.editableInput.get().isSet)}>
                    <div
                        class='bg-amber-900 cursor-pointer rounded-xs px-1 text-gray-200 uppercase text-xs font-bold flex items-center gap-1 group'
                        onClick={() => {
                            runWithOwner(owner, () => {
                                props.editableInput!.setIsNull(!props.editableInput!.get().isNull);
                            });
                        }}
                    >
                        null
                        <div class='bg-gray-400 w-3 h-3 rounded-xs fill-black flex items-center justify-center group-hover:bg-white'>
                            <Show when={props.editableInput!.get().isNull}>
                                <Icon icon={mdiCheckBold} size='10'/>
                            </Show>
                        </div>
                    </div>
                </Show>
                {props.desc.outputExtendable ? (
                    <div class='bg-amber-900 rounded-xs px-1 text-gray-900 uppercase text-xs font-bold flex items-center'>Extendable</div>
                ) : ''}
                <Show when={!expanded()}>
                    <div class='text-gray-500 fill-gray-500 font-bold flex items-center gap-1'>
                        <ShortView api={props.api} desc={props.desc}/>
                    </div>
                </Show>
                <div class='w-5'/>
                <Show when={props.editableInput?.get().isSet && !props.editableInput?.get().isNull}>
                    <ReqInput editableInput={props.editableInput!}/>
                </Show>
            </div>
            <Show when={expanded()}>
                <FullView api={props.api} desc={props.desc} line editableInput={props.editableInput}/>
            </Show>
        </div>
    );
};