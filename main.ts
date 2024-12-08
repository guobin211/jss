import { createGlobalEnv } from "./backend/environment.ts";
import { evaluate } from "./backend/interpreter.ts";
import { Parser } from "./frontend/parser.ts";

async function runPrompt() {
    while (true) {
        console.log("jss v0.1.0, type .exit to exit");
        const input = prompt("> ");
        if (input === null) {
            break;
        }
        if (input === ".exit") {
            Deno.exit(0);
        }
        await runCode(input);
    }
}

async function runCode(code: string) {
    const env = createGlobalEnv();
    const program = new Parser().process(code);
    await evaluate(program, env);
}

async function runFile(filename: string) {
    const input = await Deno.readTextFile(filename);
    await runCode(input);
}

async function run(args: string[]) {
    const [filename, code] = args;
    if (args.length === 1 && filename.endsWith(".rss")) {
        await runFile(filename);
    } else if (args.length === 2 && filename === "eval" && code.length > 0) {
        await runCode(code);
    } else {
        await runPrompt();
    }
}

if (import.meta.main) {
    await run(Deno.args);
}
