export interface TypeDescription {
    type: {
        ts?: string;
        alias?: string;
        arrayOf?: TypeDescription;
        objectOf?: Record<string, TypeDescription>;
    };

    description?: string;
    nullable?: boolean;

    outputExtendable?: boolean;
    inputOptional?: boolean;
}

export interface MethodDescription {
    description?: string;
    input?: TypeDescription;
    output: TypeDescription;
}

export interface ApiDescription {
    types: Record<string, TypeDescription>;
    methods: Record<string, MethodDescription>;
}

export type MethodsScope = {
    [key: string]: {
        scope?: MethodsScope;
        method?: MethodDescription;
        methodName?: string;
    }
}

export const buildMethodsScopeTree = (methods: Record<string, MethodDescription>): MethodsScope => {
    const keys = Object.keys(methods).sort();
    const res: MethodsScope = {};

    for (const key of keys) {
        const path = key.split('.');
        const methodName = path.pop()!;

        let current = res;
        for (const name of path) {
            current = (current[name] ??= {scope: {}}).scope!;
        }
        current[methodName] = {
            method: methods[key],
            methodName: key,
        }
    }

    return res;
};