import { assert } from "jsr:@std/assert";
import { Parser } from "./parser.ts";

Deno.test("let", () => {
    const code = 'let a;';
    const program = new Parser().process(code);
    console.log(program);
    assert(program.body.length > 0);
});

Deno.test("let value", () => {
    const code = 'let a = 1;let b = 2;let c = a + b;';
    const program = new Parser().process(code);
    console.log(program);
    assert(program.body.length > 0);
});

Deno.test("const", () => {
    const code = 'const a = 1;const b = 2;const c = a + b;';
    const program = new Parser().process(code);
    console.log(program);
    assert(program.body.length > 0);
});

Deno.test("fn", () => {
    const code = 'fn add(a, b) { return a + b; }';
    const program = new Parser().process(code);
    console.log(program.body);
    assert(program.body.length > 0);
});
