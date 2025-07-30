import {Component} from 'solid-js';

export const Icon: Component<{
    icon: string | null;
    size?: '10';
}> = (props) => {
    return props.icon ? (
        <span>
            <svg width={props.size ?? '20'} height={props.size ?? '20'} viewBox='0 0 24 24'>
                <path d={props.icon}/>
            </svg>
        </span>
    ) : null;
    //         <svg width='24' height='24' class='fill-white'><path d={props.icon}/></svg>) : null;
    // return props.icon ?
    //     (size === 'small' ? <svg width='16' height='16' viewBox='0 0 24 24' class='fill-white'><path d={props.icon}/></svg> :
    //         <svg width='24' height='24' class='fill-white'><path d={props.icon}/></svg>) : null;
}