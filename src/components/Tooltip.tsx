import {JSX, ParentComponent} from 'solid-js';

export const Tooltip: ParentComponent<{tooltip: JSX.Element}> = (props) => {
    return (
        <span class='cursor-default relative group/c'>
            <div class='italic whitespace-nowrap absolute top-full left-0 z-10 mt-1 rounded-xs px-2 py-1 bg-amber-100 hidden group-hover/c:block font-sans text-s text-gray-700'>{props.tooltip}</div>
            {props.children}
        </span>
    );
};