import { displayValue } from "./backend/core/values.ts";
import { createGlobalEnv } from "./backend/environment.ts";
import { evaluate } from "./backend/interpreter.ts";
import { Parser } from "./frontend/parser.ts";

async function runPrompt() {
    const decoder = new TextDecoder();
    const buffer = new Uint8Array(1024);
    while (true) {
        console.log("jss v0.1.0, type .exit to exit");
        await Deno.stdout.write(new TextEncoder().encode("> "));
        const n = <number> await Deno.stdin.read(buffer);
        const input = decoder.decode(buffer.subarray(0, n)).trim();
        if (input === ".exit") {
            Deno.exit(0);
        }
        runCode(input);
    }
}

function runCode(code: string) {
    const env = createGlobalEnv();
    const program = new Parser().process(code);
    const result = evaluate(program, env);
    console.log("runCode result:");
    displayValue(result);
}

async function runFile(filename: string) {
    const input = await Deno.readTextFile(filename);
    runCode(input);
}

async function run(args: string[]) {
    runCode(`fn add(a, b) { return a + b; }`);
    const [filename, code] = args;
    if (args.length === 1 && filename.endsWith(".rss")) {
        await runFile(filename);
    } else if (args.length === 2 && filename === "eval" && code.length > 0) {
        runCode(code);
    } else {
        await runPrompt();
    }
}

if (import.meta.main) {
    await run(Deno.args);
}
