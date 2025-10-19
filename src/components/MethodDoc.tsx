import {Component, createMemo, createSignal, getOwner, Show} from 'solid-js';
import {ApiDescription, MethodDescription} from '../lib/api-description';
import {TypeDoc2} from './TypeDoc2';
import {Icon} from './Icon';
import {mdiClose, mdiFunction} from '@mdi/js';
import {createEditableValueContainer} from '../lib/editable-request-input';

export const MethodDoc: Component<{
    api: ApiDescription;
    name: string;
    desc: MethodDescription;
}> = (props) => {
    const [playgroundTab, setPlaygroundTab] = createSignal<'sdk' | 'curl' | null>(null);
    // console.log('owner 1', getOwner());
    const evc = createMemo(() => props.desc.input ? createEditableValueContainer(props.desc.input, props.api) : undefined);
    /*createMemo(() => {
        return createEditableValueContainer();
        // return createEditableRequestInputFromDescription(props.desc.input!, props.api);
        return {hello: 5};
    });*/
    return (
        <>
            <div class='flex flex-col gap-4 overflow-y-auto grow p-4'>
                <h2 class='text-2xl mb-5 flex gap-1 items-center'><Icon icon={mdiFunction}/>{props.name}</h2>
                <code>
                    sdk.<span class='text-amber-400'>{props.name}</span>(input: Input, options): Promise&lt;Output&gt;
                </code>
                <h3 class='font-bold'>Input</h3>
                <Show when={props.desc.input} fallback={'null'}>
                    <TypeDoc2
                        api={props.api}
                        desc={props.desc.input!}
                        name='Input'
                        expandedByDefault={true}
                        evc={playgroundTab() ? evc() : undefined}
                    />
                </Show>
                <h3 class='font-bold'>Output</h3>
                <TypeDoc2 api={props.api} desc={props.desc.output!} name='Output' expandedByDefault={true}/>
                {/*{'\n    options: '}*/}
                {/*<Insert isObject={true}>*/}
                {/*    {'   extend: ExtendQuery;\n   fetchOptions: FetchOptions;\n'}*/}
                {/*</Insert>*/}
                {/*<span class='text-amber-400'>{'\n'}): Promise&lt;<TypeDoc api={props.api} desc={props.desc.output}/>&gt;</span>*/}
            </div>
            <div class='bg-cyan-900 p-2 overflow-hidden flex flex-col shrink-0' classList={{
                'h-2/5': !!playgroundTab()
            }}>
                <div class='flex items-center gap-2'>
                    <span class='text-gray-400'>Playground</span>
                    <span
                        class='cursor-pointer font-bold hover:text-pink-300 rounded px-1'
                        onClick={() => {
                            setPlaygroundTab('sdk');
                        }}
                        classList={{
                            'bg-white text-pink-400': playgroundTab() === 'sdk',
                        }}
                    >
                        SDK
                    </span>
                    <span
                        class='cursor-pointer font-bold hover:text-pink-300 rounded px-1'
                        onClick={() => {
                            setPlaygroundTab('curl');
                        }}
                        classList={{
                            'bg-white text-pink-400': playgroundTab() === 'curl',
                        }}
                    >
                        curl
                    </span>
                    <div class='flex-grow'/>
                    <Show when={playgroundTab()}>
                        <button
                            class='cursor-pointer hover:fill-pink-300'
                            onClick={() => {
                                setPlaygroundTab(null);
                            }}
                        >
                            <Icon icon={mdiClose}/>
                        </button>
                    </Show>
                </div>
                <Show when={playgroundTab() === 'sdk'}>
                    <div class='p-2 overflow-hidden flex flex-col'>
                        <pre class='bg-gray-200 text-gray-800 p-2 rounded-md overflow-auto'>
                            <strong>await</strong> {props.api.jsSdkPath ?? 'sdk'}.{props.name}(
                            { JSON.stringify(evc()?.data() ?? null, null, 4) }
                            , {'{}'});
                        </pre>
                    </div>
                </Show>
                <Show when={playgroundTab() === 'curl'}>
                    <div class='p-2 overflow-hidden flex flex-col'>
                        <pre class='bg-gray-200 text-gray-800 p-2 rounded-md overflow-auto'>
                            curl -X POST -H 'Content-Type: application/json' -d @- {props.api.apiUrl ?? 'https://example.com/api'}/{props.name} {'<<\'JSON\''}<br/>
                            {JSON.stringify({input: evc()?.data()}, null, 4)}<br/>
                            JSON<br/>
                        </pre>
                    </div>
                </Show>
            </div>
        </>
    );
};