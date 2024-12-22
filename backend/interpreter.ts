import { BinaryExpr, Identifier, Program, Stmt } from "../frontend/ast.ts";
import { NumericLiteral } from "../frontend/ast.ts";
import { NodeType, Operator } from "../frontend/ast.ts";
import { makeNull, NumberValue, RuntimeValue, ValueType } from "./core/values.ts";
import { Environment } from "./environment.ts";

export function evaluate(astNode: Stmt, env: Environment): RuntimeValue {
    setTimeout(() => {
        console.error("evaluate timeout over 30s");
        Deno.exit(1);
    }, 30 * 1000);
    switch (astNode.kind) {
        case NodeType.NumericLiteral:
            return {
                type: ValueType.Number,
                value: (astNode as NumericLiteral).value,
            };
        case NodeType.BinaryExpr:
            return evalBinaryExpr(astNode as BinaryExpr, env);
        case NodeType.Program:
            return evalProgram(astNode as Program, env);
        case NodeType.Identifier:
            return evalIdentifier(astNode as Identifier, env);
        default:
            console.error(`Unknown node type: ${astNode.kind}`);
            Deno.exit(1);
    }
}

function evalProgram(program: Program, env: Environment): RuntimeValue {
	let lastEvaluated: RuntimeValue = makeNull();
	for (const statement of program.body) {
		lastEvaluated = evaluate(statement, env);
	}
	return lastEvaluated;
}

function evalNumberBinaryExpr(
    l: NumberValue,
    r: NumberValue,
    o: Operator,
): NumberValue {
    let result: number;
    switch (o) {
        case Operator.Plus:
            result = l.value + r.value;
            break;
        case Operator.Minus:
            result = l.value - r.value;
            break;
        case Operator.Multiply:
            result = r.value * r.value;
            break;
        case Operator.Divide:
            if (r.value === 0) {
                throw new Error("Division by zero");
            }
            result = l.value / r.value;
            break;
        case Operator.Modulus:
            result = l.value % r.value;
            break;
        default:
            throw new Error(`Unknown operator ${o}`);
    }
    return {
        type: ValueType.Number,
        value: result,
    };
}

function evalBinaryExpr(expr: BinaryExpr, env: Environment): RuntimeValue {
    const l = evaluate(expr.left, env) as NumberValue;
    const r = evaluate(expr.right, env) as NumberValue;
    if (l.type === ValueType.Number && r.type === ValueType.Number) {
        return evalNumberBinaryExpr(l, r, expr.operator);
    }
    console.error("Type mismatch");
    Deno.exit(1);
}

function evalIdentifier(ident: Identifier, env: Environment): RuntimeValue {
    return env.getVar(ident.symbol);
}
