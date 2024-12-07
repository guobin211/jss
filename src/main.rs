fn main() {
    let mut args = std::env::args().collect::<Vec<String>>();
    args.remove(0);
    if args.len() == 1 {
        rss::run_repl();
    } else if args.len() == 2 {
        rss::run_file();
    } else if args.len() == 3 && args[1] == "eval" {
        rss::run_string();
    } else {
        eprintln!("Usage:
rss main.rss
rss eval 1 + 2
");
    }
}
