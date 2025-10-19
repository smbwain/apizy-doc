import {Component} from 'solid-js';

export const Icon: Component<{
    icon: string | null;
    size?: '10';
    class?: string;
}> = (props) => {
    return props.icon ? (
        <span class={props.class}>
            <svg width={props.size ?? '20'} height={props.size ?? '20'} viewBox='0 0 24 24'>
                <path d={props.icon}/>
            </svg>
        </span>
    ) : null;
}