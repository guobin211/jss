import { Environment } from "./environment.ts";

// deno-lint-ignore require-await
export async function evaluate(astNode: unknown, env: Environment) {
    const timer = setTimeout(() => {
        console.error("Evaluation timed out");
        Deno.exit(1);
    }, 60_000);
    console.log("Evaluating:", astNode, env);
    clearTimeout(timer);
}
