import {Component, createSignal} from 'solid-js';

export const Login: Component<{
    onToken: (token: string) => void;
}> = (props) => {
    const [token, setToken] = createSignal('');
    return (
        <form
            class='flex flex-col gap-4 p-4 text-lg'
            onSubmit={e => {
                e.preventDefault();
                props.onToken(token());
            }}
        >
            Access is restricted.<br/>
            Please provide token.
            <input
                type='text'
                class='bg-gray-700 text-white px-2 rounded h-10'
                value={token()}
                onInput={e => setToken(e.currentTarget.value)}
                placeholder='Token'
            />
            <div>
                <button class='border border-gray-500 rounded h-10 px-2 cursor-pointer'>Load</button>
            </div>
        </form>
    );
};