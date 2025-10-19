import {Component, createMemo, createSignal, For, getOwner, JSX, Show} from 'solid-js';
import {ApiDescription, TypeDescription} from '../lib/api-description';
import {Icon} from './Icon';
import {
    mdiCheckBold, mdiDeleteCircleOutline,
    mdiLanguageTypescript,
    mdiMinusBoxOutline,
    mdiPlusBoxOutline,
    mdiPlusCircleOutline,
    mdiShape,
} from '@mdi/js';
import {TypeLink} from './TypeLink';
import {EditableValueContainer} from '../lib/editable-request-input';
import {ReqInput} from './ReqInput';

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
    evc?: EditableValueContainer;
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
                    <FullView api={props.api} desc={props.api.types[props.desc.type.alias]} evc={props.evc?.editable()?.aliasFor}/>
                </>
            ) : (props.desc.type.arrayOf) ? (
                <>
                    <div class='flex gap-1'>
                        <div class='text-amber-700 font-bold'>Array&lt; ... &gt;</div>
                        {nullable}
                        <Show when={props.evc?.editable()?.type === 'array'}>
                            <>
                                <span class='text-gray-500'>[Size: {props.evc?.editable()?.arrayElements?.().length}]</span>
                            </>
                        </Show>
                    </div>
                    <Show
                        when={props.evc}
                        fallback={<FullView api={props.api} desc={props.desc.type.arrayOf}/>}
                    >
                        <For each={props.evc?.editable()?.arrayElements?.()}>{(e, index) => (
                            <TypeDoc2
                                api={props.api}
                                desc={props.desc.type.arrayOf!}
                                name={index().toString()}
                                icons={
                                    <button
                                        class='cursor-pointer hover:fill-pink-300'
                                        onClick={() => {
                                            props.evc?.editable()?.arrayRemove?.(index());
                                        }}
                                    >
                                        <Icon icon={mdiDeleteCircleOutline}/>
                                    </button>
                                }
                                evc={e}
                            />
                        )}</For>
                        <div class='text-gray-500 flex gap-1 items-center'>
                            ...
                            <button
                                class='cursor-pointer hover:fill-pink-300'
                                onClick={() => {
                                    props.evc?.editable()?.arrayInsert?.();
                                }}
                            >
                                <Icon icon={mdiPlusCircleOutline}/>
                            </button>
                        </div>
                    </Show>
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
                            evc={props.evc?.editable()?.objectChildren?.[key]}
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
    evc?: EditableValueContainer;
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
                if (props.evc) {
                    return true;
                }
                currentDesc = currentDesc.type.arrayOf;
                continue;
            }
            return;
        }

        return expandable;
    });
    // const owner = getOwner();
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
                                'text-emerald-800': (props.desc.inputOptional && !props.evc?.isSet()) || props.desc.outputExtendable,
                            }}>{props.name}:</div>
                        </>
                    ) : null}
                </div>
                {props.icons}
                <Show when={props.desc.inputOptional}>
                    <div
                        class='bg-cyan-900 rounded-xs px-1 text-gray-300 uppercase text-xs font-bold flex items-center gap-1 group'
                        classList={{
                            'cursor-pointer': !!props.evc,
                        }}
                        onClick={() => {
                            // runWithOwner(owner, () => {
                                props.evc?.setIsSet?.(!props.evc?.isSet());
                            // });
                        }}
                    >
                        Optional
                        <Show when={props.evc}>
                            <div class='bg-gray-400 w-3 h-3 rounded-xs fill-black flex items-center justify-center group-hover:bg-white'>
                                <Show when={props.evc?.isSet()}>
                                    <Icon icon={mdiCheckBold} size='10'/>
                                </Show>
                            </div>
                        </Show>
                    </div>
                </Show>
                <Show when={props.evc && props.desc.nullable && props.evc.isSet()}>
                    <div
                        class='bg-amber-900 cursor-pointer rounded-xs px-1 text-gray-200 uppercase text-xs font-bold flex items-center gap-1 group'
                        onClick={() => {
                            // runWithOwner(owner, () => {
                                props.evc?.setIsNull?.(!props.evc?.isNull());
                            // });
                        }}
                    >
                        null
                        <div class='bg-gray-400 w-3 h-3 rounded-xs fill-black flex items-center justify-center group-hover:bg-white'>
                            <Show when={props.evc?.isNull()}>
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
                <Show when={props.evc?.isSet() && !props.evc?.isNull() && props.evc?.editable()}>
                    <ReqInput editable={props.evc?.editable()!}/>
                </Show>
            </div>
            <Show when={expanded()}>
                <FullView api={props.api} desc={props.desc} line evc={(props.evc?.isSet() && !props.evc?.isNull()) ? props.evc : undefined}/>
            </Show>
        </div>
    );
};