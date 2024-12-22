import { RuntimeValue } from "./core/values.ts";

export class Environment {
    private parent: Environment | null;
    private variables: Map<string, RuntimeValue>;

    constructor(parent: Environment | null = null) {
        this.parent = parent;
        this.variables = new Map();
    }

    /**
     * 声明变量和赋值
     */
    declareVar(name: string, value: RuntimeValue): RuntimeValue {
        if (this.variables.has(name)) {
            throw new Error(`Variable ${name} already declared`);
        }
        this.variables.set(name, value);
        return value;
    }

    /**
     * 获取变量值
     */
    getVar(name: string): RuntimeValue {
        if (this.variables.has(name)) {
            return this.variables.get(name)!;
        }
        if (this.parent) {
            return this.parent.getVar(name);
        }
        throw new Error(`Variable ${name} not found`);
    }

    /**
     * 更新变量值
     */
    assignVar(name: string, value: RuntimeValue): RuntimeValue {
        if (this.variables.has(name)) {
            this.variables.set(name, value);
            return value;
        }
        if (this.parent) {
            return this.parent.assignVar(name, value);
        }
        throw new Error(`Variable ${name} not found`);
    }
}

export function createGlobalEnv() {
    return new Environment();
}
