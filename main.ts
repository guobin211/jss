if (import.meta.main) {
    const { args } = Deno;
    if (args.length < 2) {
        console.log('Usage: deno run main.ts <filename>');
        Deno.exit(1);
    }
}
