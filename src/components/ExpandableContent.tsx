import {createSignal, JSX, ParentComponent, Show} from 'solid-js';

import {Icon} from './Icon';
import {mdiMinusBoxOutline, mdiPlusBoxOutline} from '@mdi/js';

export const ExpandableContent: ParentComponent<{title: JSX.Element}> = (props) => {
    const [expanded, setExpanded] = createSignal(true);
    return (
        <div>
            <div class='flex gap-1 items-center cursor-pointer text-gray-300 fill-gray-300 h-6' onClick={() => setExpanded(b => !b)}>
                <Icon class='fill-gray-600' icon={expanded() ? mdiMinusBoxOutline : mdiPlusBoxOutline}/>
                {props.title}
            </div>
            <Show when={expanded()}>
                <div class='ml-6 relative before:bg-gray-600 before:absolute before:top-[6px] before:bottom-[6px] before:-left-3.5 before:w-px'>{props.children}</div>
            </Show>
        </div>
    );
};