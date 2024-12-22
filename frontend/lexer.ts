/**
 * Token type enum.
 */
export enum TokenType {
    Number,
    String,
    Identifier,
    Let, // let
    Const, // const
    Fn, // fn
    BinaryOperator, // Grouping * Operators
    Equals, // ==
    Comma, // ,
    Dot, // .
    Colon, // :
    Semicolon, // ;
    OpenParen, // (
    CloseParen, // )
    OpenBrace, // {
    CloseBrace, // }
    OpenBracket, // [
    CloseBracket, // ]
    EOF,
}

export interface Token {
    value: string;
    type: TokenType;
}

const charMap: { [key: string]: TokenType } = {
    "+": TokenType.BinaryOperator,
    "-": TokenType.BinaryOperator,
    "*": TokenType.BinaryOperator,
    "/": TokenType.BinaryOperator,
    "%": TokenType.BinaryOperator,
    "=": TokenType.Equals,
    "(": TokenType.OpenParen,
    ")": TokenType.CloseParen,
    "{": TokenType.OpenBrace,
    "}": TokenType.CloseBrace,
    "[": TokenType.OpenBracket,
    "]": TokenType.CloseBracket,
    ",": TokenType.Comma,
    ".": TokenType.Dot,
    ":": TokenType.Colon,
    ";": TokenType.Semicolon,
    "let": TokenType.Let,
    "const": TokenType.Const,
    "fn": TokenType.Fn,
};

function token(value = "", type: TokenType): Token {
    return { value, type };
}

function isSkipChar(src: string): boolean {
    return src === " " || src === "\n" || src === "\t";
}

export function tokenize(source: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    while (i < source.length) {
        const char = source[i];
        if (isSkipChar(char)) {
            i++;
            continue;
        }
        const tokenType = charMap[char];
        if (tokenType) {
            tokens.push(token(char, tokenType));
            i++;
            continue;
        }
        /**
         * parse string
         */
        if (char === '"') {
            let str = "";
            i++;
            while (i < source.length && source[i] !== '"') {
                if (source[i] === "\\") {
                    i++;
                    if (i < source.length) {
                        const escapeChar = source[i];
                        switch (escapeChar) {
                            case "n":
                                str += "\n";
                                break;
                            case "t":
                                str += "\t";
                                break;
                            case "r":
                                str += "\r";
                                break;
                            case '"':
                                str += '"';
                                break;
                            case "\\":
                                str += "\\";
                                break;
                            default:
                                str += escapeChar;
                        }
                        i++;
                        continue;
                    } else {
                        console.error(
                            `Unterminated escape sequence at position ${i}`,
                        );
                        Deno.exit(1);
                    }
                }
                str += source[i];
                i++;
            }
            if (i >= source.length || source[i] !== '"') {
                console.error(`Unterminated string literal at position ${i}`);
                Deno.exit(1);
            }
            i++;
            tokens.push(token(str, TokenType.String));
            continue;
        }
        /**
         * parse number 整数和浮点数
         */
        if (char.match(/[0-9]/)) {
            let num = "";
            let dotCount = 0;
            while (
                i < source.length &&
                (source[i].match(/[0-9]/) ||
                    (source[i] === "." && dotCount < 1))
            ) {
                if (source[i] === ".") {
                    dotCount++;
                }
                num += source[i];
                i++;
            }
            if (dotCount > 1) {
                console.error(`Invalid number format: ${num}`);
                Deno.exit(1);
            }
            tokens.push(token(num, TokenType.Number));
            continue;
        }
        /**
         * parse identifier
         */
        if (char.match(/[a-zA-Z]/)) {
            let id = "";
            while (i < source.length && source[i].match(/[a-zA-Z]/)) {
                id += source[i];
                i++;
            }
            if (charMap[id]) {
                tokens.push(token(id, charMap[id]));
            } else {
                tokens.push(token(id, TokenType.Identifier));
            }
            continue;
        }
        console.error(`Unexpected character: ['${char}']`);
        Deno.exit(1);
    }
    tokens.push({ type: TokenType.EOF, value: "EndOfFile" });
    return tokens;
}
