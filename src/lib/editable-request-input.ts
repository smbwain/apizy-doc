import {createMemo, createSignal} from 'solid-js';
import {ApiDescription, TypeDescription} from './api-description';

export interface EditableValueContainer {
    isSet: () => boolean;
    setIsSet?(v: boolean): void;

    isNull: () => boolean;
    setIsNull?(v: boolean): void;

    editable: () => (EditableValue | undefined);
    data: () => any;
}

export interface EditableValueEnumValue {
    name: string;
    value: any;
}

export interface EditableValue {
    type: 'array' | 'string' | 'enum' | 'number' | 'boolean' | 'json' | 'object' | 'alias';

    data: () => any;

    isValid?: () => boolean;

    strValue?: () => string;
    setStrValue?(value: string): void;

    enumValues?: () => EditableValueEnumValue[];

    boolValue?: () => boolean;
    setBoolValue?(value: boolean): void;

    objectChildren?: Record<string, EditableValueContainer>;

    aliasFor?: EditableValueContainer;

    arrayElements?: () => EditableValueContainer[];
    arrayInsert?(index?: number): void;
    arrayRemove?(index: number): void;
}

export function createEditableValueContainer(d: TypeDescription, api: ApiDescription): EditableValueContainer {
    const [isSet, setIsSet] = d.inputOptional ? createSignal(false) : [() => true, undefined];
    const [isNull, setIsNull] = d.nullable ? createSignal(true) : [() => false, undefined];

    const editable = createMemo<EditableValue | undefined>((prev) => {
        return prev ?? ((isSet() && !isNull()) ? createEditableValue(d, api) : undefined);
    });

    const data = () => {
        if (!isSet()) {
            return undefined;
        }
        if (isNull()) {
            return null;
        }
        return editable()?.data();
    }

    return {setIsSet, isNull, setIsNull, isSet, editable, data};
}

function createEditableValue(d: TypeDescription, api: ApiDescription): EditableValue {
    if (d.type.objectOf) {
        return createObject(d.type.objectOf, api);
    }
    if (d.type.arrayOf) {
        return createArray(d.type.arrayOf, api);
    }
    if (d.type.alias) {
        return createAlias(api.types[d.type.alias], api);
    }
    if (d.type.ts === 'string') {
        return createString();
    }
    if (d.type.ts === 'number') {
        return createNumber();
    }
    if (d.type.ts === 'boolean') {
        return createBoolean();
    }

    if (d.type.ts) {
        const parts = d.type.ts.split('|');
        let enumValues: EditableValueEnumValue[] | null = null;
        try {
            enumValues = parts.map(name => ({
                name,
                value: JSON.parse(name),
            }));
        } catch(err) {}
        if (enumValues) {
            return createEnum(enumValues);
        }
    }

    return createJSON();
}

function createString(): EditableValue {
    const [strValue, setStrValue] = createSignal<string>('');

    return {
        type: 'string',
        strValue, setStrValue,
        data: strValue,
    };
}

function createEnum(enumValues: EditableValueEnumValue[]): EditableValue {
    const [strValue, setStrValue] = createSignal<string>(enumValues[0].value ?? '');

    return {
        type: 'enum',
        enumValues: () => enumValues,
        strValue, setStrValue,
        data: () => {
            const name = strValue();
            const item = enumValues.find(v => v.name === name);
            return item ? item.value : null;
        },
    };
}

function createBoolean(): EditableValue {
    const [boolValue, setBoolValue] = createSignal(false);

    return {
        type: 'boolean',
        boolValue, setBoolValue,
        data: boolValue,
    };
}

function createAlias(d: TypeDescription, api: ApiDescription): EditableValue {
    const aliasFor = createEditableValueContainer(d, api);

    return {
        type: 'alias',
        aliasFor,
        data: () => aliasFor.data(),
    };
}

function createNumber(): EditableValue {
    const [data, _setData] = createSignal<any>(0);
    const [strValue, _setStrValue] = createSignal<string>('0');
    const isValid = () => Number.isFinite(Number(strValue()));
    const setStrValue = (value: string) => {
        _setStrValue(value);
        const n = Number(value);
        _setData(Number.isFinite(n) ? n : null);
    };

    return {
        type: 'number',
        isValid,
        strValue, setStrValue,
        data,
    };
}

function createJSON(): EditableValue {
    const [data, _setData] = createSignal<any>(null);
    const isValid = () => {
        try {
            JSON.parse(strValue());
            return true;
        } catch (err) {
            return false;
        }
    };
    const [strValue, _setStrValue] = createSignal<string>('');
    const setStrValue = (value: string) => {
        _setStrValue(value);
        let d = null;
        try {
            d = JSON.parse(value);
        } catch (err) {}
        _setData(d);
    };

    return {
        type: 'json',
        isValid,
        strValue, setStrValue,
        data,
    };
}

function createObject(desc: Record<string, TypeDescription>, api: ApiDescription): EditableValue {
    const objectChildren: Record<string, EditableValueContainer> = {};
    for (const key in desc ) {
        objectChildren[key] = createEditableValueContainer(desc[key], api);
    }

    const data = () => {
        const res: Record<string, any> = {};
        for (const key in objectChildren) {
            if (objectChildren[key].isSet()) {
                res[key] = objectChildren[key].data();
            }
        }
        return res;
    };

    return {
        type: 'object',
        objectChildren,
        data,
    };
}

function createArray(desc: TypeDescription, api: ApiDescription): EditableValue {
    const [arrayElements, setArrayElements] = createSignal<EditableValueContainer[]>([]);

    const data = () => arrayElements().map(e => e.data());

    const arrayInsert = (index?: number) => {
        const newElement = createEditableValueContainer(desc, api);
        setArrayElements(prev => {
            const value = [...prev];
            value.splice(index ?? value.length, 0, newElement);
            return value;
        });
    };

    const arrayRemove = (index: number) => {
        setArrayElements(prev => {
            const value  = [...prev];
            value.splice(index, 1);
            return value;
        });
    }

    return {
        type: 'array',
        arrayElements,
        data,
        arrayInsert,
        arrayRemove,
    };
}