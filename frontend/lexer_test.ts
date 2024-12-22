import { assert } from "jsr:@std/assert";
import { tokenize } from "./lexer.ts";

Deno.test("let test", () => {
    const code = "let a = 1;const b = 2;const c = a + b;";
    const tokens = tokenize(code);
    for (const token of tokens) {
        console.log(token);
    }
    assert(tokens.length > 0);
});

Deno.test("fn test", () => {
    const code = "fn add(a, b) { return a + b; }";
    const tokens = tokenize(code);
    for (const token of tokens) {
        console.log(token);
    }
    assert(tokens.length > 0);
});

Deno.test("type test", () => {
    const code = `
    const name = "jack";
    const age = 18;
    const isMale = true;
    let nextAge = age + 1;
    `;
    const tokens = tokenize(code);
    for (const token of tokens) {
        console.log(token);
    }
    assert(tokens.length > 0);
});
