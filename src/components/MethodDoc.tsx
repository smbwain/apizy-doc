import {Component, createMemo, createSignal, getOwner, Show} from 'solid-js';
import {ApiDescription, MethodDescription} from '../lib/api-description';
import {TypeDoc2} from './TypeDoc2';
import {Icon} from './Icon';
import {mdiClose, mdiFunction} from '@mdi/js';
import {createEditableRequestInputFromDescription, editableRequestInputToJSON} from '../lib/editable-request-input';

export const MethodDoc: Component<{
    api: ApiDescription;
    name: string;
    desc: MethodDescription;
}> = (props) => {
    // const [editableTab, setEditableTab] = createSignal<'sdk' | 'curl' | null>(null);
    // console.log('owner 1', getOwner());
    // const editable = createMemo(() => {
    //     return createEditableRequestInputFromDescription(props.desc.input!, props.api);
    // });
    return (
        <>
            <div class='flex flex-col gap-4 overflow-y-auto grow p-4'>
                <h2 class='text-2xl mb-5 flex gap-1 items-center'><Icon icon={mdiFunction}/>{props.name}</h2>
                <code>
                    sdk.<span class='text-amber-400'>{props.name}</span>(input: Input, options): Promise&lt;Output&gt;
                </code>
                <h3 class='font-bold'>Input</h3>
                <Show when={props.desc.input} fallback={'null'}>
                    <TypeDoc2 api={props.api} desc={props.desc.input!} name='Input' expandedByDefault={true} /*editableInput={editableTab() ? editable() : undefined}*//>
                </Show>
                <h3 class='font-bold'>Output</h3>
                <TypeDoc2 api={props.api} desc={props.desc.output!} name='Output' expandedByDefault={true}/>
                {/*{'\n    options: '}*/}
                {/*<Insert isObject={true}>*/}
                {/*    {'   extend: ExtendQuery;\n   fetchOptions: FetchOptions;\n'}*/}
                {/*</Insert>*/}
                {/*<span class='text-amber-400'>{'\n'}): Promise&lt;<TypeDoc api={props.api} desc={props.desc.output}/>&gt;</span>*/}
            </div>
            {/*<div class='bg-cyan-900 p-2 overflow-hidden flex flex-col h-2/5'>*/}
            {/*    <div class='flex items-center gap-2'>*/}
            {/*        <span class='font-bold'>Playground</span>*/}
            {/*        <span onClick={() => {*/}
            {/*            setEditableTab('sdk');*/}
            {/*        }}>SDK</span>*/}
            {/*        <span onClick={() => {*/}
            {/*            setEditableTab('curl');*/}
            {/*        }}>curl</span>*/}
            {/*        <div class='flex-grow'/>*/}
            {/*        <Show when={editableTab()}>*/}
            {/*            <button onClick={() => {*/}
            {/*                setEditableTab(null);*/}
            {/*            }}>*/}
            {/*                <Icon icon={mdiClose}/>*/}
            {/*            </button>*/}
            {/*        </Show>*/}
            {/*    </div>*/}
            {/*    <Show when={editableTab() === 'sdk'}>*/}
            {/*        <div class='p-2 overflow-hidden flex flex-col'>*/}
            {/*            <pre class='bg-gray-200 text-gray-800 p-2 rounded-md overflow-auto'>*/}
            {/*                await sdk.{props.name}(*/}
            {/*                { JSON.stringify(editableRequestInputToJSON(editable()), null, 4) }*/}
            {/*                , {'{});'})*/}
            {/*            </pre>*/}
            {/*        </div>*/}
            {/*    </Show>*/}
            {/*</div>*/}
        </>
    );
    // ;return (<>*/}
    {/*    sdk.<span class='text-amber-400'>{props.name}(</span>*/}
    {/*    {'\n    input: '}*/}
    {/*    <Show when={props.desc.input} fallback={'null'}>*/}
    {/*        <TypeDoc api={props.api} desc={props.desc.input!}/>*/}
    {/*    </Show>*/}
    {/*    {'\n    options: '}*/}
    {/*    <Insert isObject={true}>*/}
    {/*        {'   extend: ExtendQuery;\n   fetchOptions: FetchOptions;\n'}*/}
    {/*    </Insert>*/}
    {/*    <span class='text-amber-400'>{'\n'}): Promise&lt;<TypeDoc api={props.api} desc={props.desc.output}/>&gt;</span>*/}
    {/*</>);*/}
};