import {createSignal, JSX, ParentComponent, Show} from 'solid-js';

import styles from './ExpandableContent.module.css';
import {Icon} from './Icon';
import {mdiMinusBoxOutline, mdiPlusBoxOutline} from '@mdi/js';

export const ExpandableContent: ParentComponent<{title: JSX.Element}> = (props) => {
    const [expanded, setExpanded] = createSignal(true);
    return (
        <div class={styles.box}>
            <div class='flex gap-1 items-center cursor-pointer text-gray-400 h-6' onClick={() => setExpanded(b => !b)}>
                <Icon icon={expanded() ? mdiMinusBoxOutline : mdiPlusBoxOutline}/>
                {props.title}
            </div>
            <Show when={expanded()}>
                <div class={styles.children}>{props.children}</div>
            </Show>
        </div>
    );
};