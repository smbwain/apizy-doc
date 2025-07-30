import {Component} from 'solid-js';

import {Icon} from './Icon';
import {mdiFunction, mdiShape} from '@mdi/js';
import {A} from '@solidjs/router';

export const TypeLink: Component<{
    name: string;
    methodId?: string;
}> = (props) => {
    return (
        <A
            class='inline-flex font-bold cursor-pointer hover:text-pink-300 hover:fill-pink-300 gap-1 h-5 items-center'
            activeClass='text-pink-400 fill-pink-400'
            href={`${props.methodId ? '/method/' : '/type/'}${props.methodId ?? props.name}`}
        >
            <Icon icon={props.methodId ? mdiFunction : mdiShape}/>
            {props.name}
        </A>
    );
}