import {createSignal, getOwner} from 'solid-js';
import {ApiDescription, TypeDescription} from './api-description';

interface Data<T> {
    isNull: boolean;
    isSet: boolean;
    value: T;
    isValid?: boolean;
    str?: string;
}
export interface EditableRequestInputBase<T> {
    get: () => Data<T>;
    setIsNull(v: boolean): void;
    setIsSet(v: boolean): void;
}

export interface EditableRequestInputArray extends EditableRequestInputBase<EditableRequestInput[]> {
    type: 'array';
    insert(index?: number): void;
    remove(index: number): void;
}

export interface EditableRequestInputString extends EditableRequestInputBase<string> {
    type: 'string';
    set(value: string): void;
}

export interface EditableRequestInputNumber extends EditableRequestInputBase<number> {
    type: 'number';
    set(value: string): void;
}

export interface EditableRequestInputBoolean extends EditableRequestInputBase<boolean> {
    type: 'boolean';
    set(value: boolean): void;
}

export interface EditableRequestInputAny extends EditableRequestInputBase<any> {
    type: 'json';
    set(value: string): void;
}

export interface EditableRequestInputObject extends EditableRequestInputBase<Record<string, EditableRequestInput>> {
    type: 'object';
}

export type EditableRequestInput = EditableRequestInputString | EditableRequestInputObject | EditableRequestInputArray | EditableRequestInputNumber | EditableRequestInputBoolean | EditableRequestInputAny;

function createEditableRequestInputBase<T>(initial: T, nullable: boolean, optional: boolean, str?: string): [
    EditableRequestInputBase<T>,
    (upd: (prev: Data<T>) => Data<T>) => void,
] {
    console.log('own', getOwner());
    const [get, set] = createSignal({
        isNull: nullable,
        isSet: !optional,
        value: initial,
        str,
    });
    return [
        {
            get,
            setIsNull: (isNull) => set(prev => ({...prev, isNull})),
            setIsSet: (isSet) => set(prev => ({...prev, isSet})),
        },
        set,
    ];
}

function createEditableRequestInputString(nullable: boolean, optional: boolean): EditableRequestInputString {
    const [editable, set] = createEditableRequestInputBase('', nullable, optional);
    return {
        ...editable,
        type: 'string',
        set: value => set(prev => ({...prev, value})),
    };
}

function createEditableRequestInputBoolean(nullable: boolean, optional: boolean): EditableRequestInputBoolean {
    const [editable, set] = createEditableRequestInputBase(false, nullable, optional);
    return {
        ...editable,
        type: 'boolean',
        set: value => set(prev => ({...prev, value})),
    };
}

function createEditableRequestInputNumber(nullable: boolean, optional: boolean): EditableRequestInputNumber {
    const [editable, set] = createEditableRequestInputBase(0, nullable, optional, '0');
    return {
        ...editable,
        type: 'number',
        set: str => {
            const value = Number(str);
            if (str && Number.isFinite(value)) {
                set(prev => ({...prev, value, str, isValid: true}));
            } else {
                set(prev => ({...prev, str, isValid: false}));
            }
        },
    };
}

function createEditableRequestInputJSON(nullable: boolean, optional: boolean): EditableRequestInputAny {
    const [editable, set] = createEditableRequestInputBase({}, nullable, optional, '{}');
    return {
        ...editable,
        type: 'json',
        set: str => {
            let value: any;
            try {
                value = JSON.stringify(str);
            } catch (err) {
                set(prev => ({...prev, str, isValid: false}));
                return;
            }
            set(prev => ({...prev, value, str, isValid: true}));
        },
    };
}

function createEditableRequestInputObject(nullable: boolean, optional: boolean, record: Record<string, TypeDescription>, api: ApiDescription): EditableRequestInputObject {
    const res: Record<string, EditableRequestInput> = {};
    for (const i in record) {
        res[i] = createEditableRequestInputFromDescription(record[i], api);
    }
    const [editable, set] = createEditableRequestInputBase(res, nullable, optional);
    return {
        ...editable,
        type: 'object',
    };
}

function createEditableRequestInputArray(nullable: boolean, optional: boolean, description: TypeDescription, api: ApiDescription): EditableRequestInputArray {
    const [editable, set] = createEditableRequestInputBase<EditableRequestInput[]>([], nullable, optional);
    const insert = (index?: number) => {
        const item = createEditableRequestInputFromDescription(description, api);
        set(prev => {
            const value = [...prev.value];
            value.splice(index ?? value.length, 0, item);
            return {
                ...prev,
                value,
            };
        });
    };
    const remove = (index: number) => {
        set(prev => {
            const value  = [...prev.value];
            value.splice(index, 1);
            return {
                ...prev,
                value,
            };
        });
    };
    return {
        ...editable,
        type: 'array',
        insert,
        remove,
    };
}

export function createEditableRequestInputFromDescription(d: TypeDescription, api: ApiDescription): EditableRequestInput {
    if (d.type.objectOf) {
        return createEditableRequestInputObject(!!d.nullable, !!d.inputOptional, d.type.objectOf, api);
    }
    if (d.type.arrayOf) {
        return createEditableRequestInputArray(!!d.nullable, !!d.inputOptional, d.type.arrayOf, api);
    }
    if (d.type.alias) {
        return createEditableRequestInputFromDescription(api.types[d.type.alias], api);
    }
    if (d.type.ts === 'string') {
        return createEditableRequestInputString(!!d.nullable, !!d.inputOptional);
    }
    if (d.type.ts === 'number') {
        return createEditableRequestInputNumber(!!d.nullable, !!d.inputOptional);
    }
    if (d.type.ts === 'boolean') {
        return createEditableRequestInputBoolean(!!d.nullable, !!d.inputOptional);
    }
    return createEditableRequestInputJSON(!!d.nullable, !!d.inputOptional);
}

export function editableRequestInputToJSON(inp: EditableRequestInput): any {
    if (!inp.get().isSet) {
        return undefined;
    }
    if (inp.get().isNull) {
        return null;
    }
    if (inp.type === 'object') {
        const res: Record<string, any> = {};
        for (const i in inp.get().value) {
            res[i] = editableRequestInputToJSON(inp.get().value[i]);
        }
        return res;
    }
    if (inp.type === 'array') {
        return inp.get().value.map(i => editableRequestInputToJSON(i));
    }
    return inp.get().value;
}