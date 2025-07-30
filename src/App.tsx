import {Component, createEffect, createSignal, Show} from 'solid-js';

import {Nav} from './components/Nav';
import {MethodDoc} from './components/MethodDoc';
import {Icon} from './components/Icon';
import {Login} from './components/Login';
import {ApiDescription} from './lib/api-description';
import {TypeDoc2} from './components/TypeDoc2';
import {mdiFunction, mdiShape} from '@mdi/js';
import {useParams} from '@solidjs/router';

const App: Component = () => {
    const [token, setToken] = createSignal(window.localStorage.getItem('dev-creds') ?? '');
    const [loading, setLoading] = createSignal(true);
    const [desc, setDesc] = createSignal<ApiDescription | null>(null);
    const fetchDoc = () => {
        (async () => {
            await new Promise(r => setTimeout(r, 0));
            try {
                setDesc(null);
                setLoading(true);
                let [url, bearer] = token().split(':::');
                if (bearer === undefined) {
                    bearer = url;
                    url = 'doc?type=json';
                }
                const res = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${bearer}`
                    },
                });
                if (res.status !== 200) {
                    throw new Error('Invalid response');
                }
                const json = await res.json();
                console.log({json});
                setDesc(json);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        })();
    };
    fetchDoc();

    const params = useParams<{
        kind: 'type' | 'method';
        id: string;
    }>();

    const methodName = () => params.kind === 'method' ? params.id : undefined;
    const method = () => methodName() ? desc()!.methods[methodName()!] : null;

    const typeName = () => params.kind === 'type' ? params.id : undefined;
    const type = () => typeName() ? desc()!.types[typeName()!] : null;

    createEffect(() => {
        console.log(params.kind, params.id, 'm', methodName(), 't', typeName());
    });

    return (
        <Show when={desc()} fallback={
            <div class="bg-gray-800 min-h-screen text-white flex items-center justify-center">
                <Show when={!loading()} fallback={'Loading...'}>
                    <Login onToken={token => {
                        window.localStorage.setItem('dev-creds', token);
                        setToken(token);
                        fetchDoc();
                    }}/>
                </Show>
            </div>
        }>
            <div class="bg-gray-800 h-screen text-white fill-white grid grid-cols-[300px_1fr]">
                <Nav
                    apiDescription={desc()!}
                    onSelect={(page, id) => {}}
                />
                <div class="flex flex-col overflow-hidden">
                    <Show when={type()}>
                        <h2 class='text-2xl mb-5 flex gap-1 items-center'><Icon icon={mdiShape}/>{typeName()}</h2>
                        <TypeDoc2 api={desc()!} desc={type()!} expandedByDefault={true} name={typeName()}/>
                    </Show>
                    <Show when={method()}>
                        <MethodDoc
                            api={desc()!}
                            name={params.id}
                            desc={desc()!.methods[params.id]}
                        />
                    </Show>
                </div>
            </div>
        </Show>
    );
};

export default App;
