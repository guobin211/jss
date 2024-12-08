import * as path from "jsr:@std/path";
import { assert } from "jsr:@std/assert";
import { tokenize } from "./lexer.ts";

const filename = path.fromFileUrl(import.meta.url);
const dirname = path.dirname(filename);

Deno.test("lexer test", async () => {
    const filename = path.join(dirname, "parser.jss");
    const code = await Deno.readTextFile(filename);
    const tokens = tokenize(code);
    for (const token of tokens) {
        console.log(token);
    }
    assert(tokens.length > 0);
});
