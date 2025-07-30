import {Component, createMemo, For, Show} from 'solid-js';
import {ApiDescription, buildMethodsScopeTree, MethodsScope} from '../lib/api-description';
import {ExpandableContent} from './ExpandableContent';
import {TypeLink} from './TypeLink';
import {Icon} from './Icon';
import {mdiFolderOutline} from '@mdi/js';

const NavMethods: Component<{
    scope: MethodsScope;
    onSelect: (kind: 'type' | 'method', id: string) => void;
}> = (props) => {
    return (
        <For each={Object.keys(props.scope)}>{key => (
            <Show when={props.scope[key].scope} fallback={
                <div>
                    <TypeLink name={key} methodId={props.scope[key].methodName!}/>
                </div>
            }>
                <ExpandableContent title={<div class='flex flex-row gap-1'>
                    <Icon icon={mdiFolderOutline}/>
                    {key}
                </div>}>
                    <NavMethods scope={props.scope[key].scope!} onSelect={props.onSelect}/>
                </ExpandableContent>
            </Show>
        )}</For>
    );
}

export const Nav: Component<{
    apiDescription: ApiDescription;
    onSelect: (kind: 'type' | 'method', id: string) => void;
}> = (props) => {
    const tree = createMemo(() => buildMethodsScopeTree(props.apiDescription.methods));
    return (
        <nav class='p-3 overflow-y-auto'>
            <ExpandableContent title={'Methods'}>
                <NavMethods scope={tree()} onSelect={props.onSelect}/>
            </ExpandableContent>
            <ExpandableContent title={'Types'}>
                <For each={Object.keys(props.apiDescription.types).sort()}>{(key) => {
                    // return <div><span onClick={() => props.onSelect('type', key)}>{key}</span></div>;
                    return <div><TypeLink name={key}/></div>;
                }}</For>
            </ExpandableContent>
        </nav>
    );
};