export enum ValueType {
    Null,
    Number,
    String,
    Bool,
    Object,
    Fn,
    BuildInFn,
}

export function displayValue(value: RuntimeValue) {
    let type = "";
    switch (value.type) {
        case ValueType.Bool:
            type = "Bool";
            break;
        case ValueType.Number:
            type = "Number";
            break;
        case ValueType.String:
            type = "String";
            break;
        case ValueType.Object:
            type = "Object";
            break;
        case ValueType.Fn:
            type = "Function";
            break;
        case ValueType.BuildInFn:
            type = "BuildInFunction";
            break;
    }
    console.log(`{ type: ${type}, value: ${value.value} }`);
}

export function makeNull(): RuntimeValue {
    return {
        type: ValueType.Null,
        value: null,
    }
}

export function makeNumber(input: number): NumberValue {
    return {
        type: ValueType.Number,
        value: input,
    }
}

export interface RuntimeValue {
    type: ValueType;
    value: number | string | boolean | object | null;
}

export interface NumberValue extends RuntimeValue {
    type: ValueType.Number;
    value: number;
}

export interface StringValue extends RuntimeValue {
    type: ValueType.String;
    value: string;
}
