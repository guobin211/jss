/**
 * Token type enum.
 */
export enum TokenType {
    Number,
    Identifier,
    // let
    Let,
    // const
    Const,
    // fn
    Fn,
    // Grouping * Operators
    BinaryOperator,
    // ==
    Equals,
    // ,
    Comma,
    // .
    Dot,
    // :
    Colon,
    Semicolon,
    // (
    OpenParen,
    // )
    CloseParen,
    // {
    OpenBrace,
    // }
    CloseBrace,
    // [
    OpenBracket,
    // ]
    CloseBracket,
    EOF,
}

export interface Token {
    value: string;
    type: TokenType;
}

const KEYWORDS: Record<string, TokenType> = {
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
        if (["+", "-", "*", "/", "%"].includes(char)) {
            tokens.push(token(char, TokenType.BinaryOperator));
            i++;
            continue;
        }
        if (char === "=") {
            tokens.push(token(char, TokenType.Equals));
            i++;
            continue;
        }
        if (char === "(") {
            tokens.push(token(char, TokenType.OpenParen));
            i++;
            continue;
        }
        if (char === ")") {
            tokens.push(token(char, TokenType.CloseParen));
            i++;
            continue;
        }
        if (char === "{") {
            tokens.push(token(char, TokenType.OpenBrace));
            i++;
            continue;
        }
        if (char === "}") {
            tokens.push(token(char, TokenType.CloseBrace));
            i++;
            continue;
        }
        if (char === "[") {
            tokens.push(token(char, TokenType.OpenBracket));
            i++;
            continue;
        }
        if (char === "]") {
            tokens.push(token(char, TokenType.CloseBracket));
            i++;
            continue;
        }
        if (char === ",") {
            tokens.push(token(char, TokenType.Comma));
            i++;
            continue;
        }
        if (char === ".") {
            tokens.push(token(char, TokenType.Dot));
            i++;
            continue;
        }
        if (char === ":") {
            tokens.push(token(char, TokenType.Colon));
            i++;
            continue;
        }
        if (char === ";") {
            tokens.push(token(char, TokenType.Semicolon));
            i++;
            continue;
        }
        if (char.match(/[0-9]/)) {
            let num = "";
            while (source[i].match(/[0-9]/)) {
                num += source[i];
                i++;
            }
            tokens.push(token(num, TokenType.Number));
            continue;
        }
        if (char.match(/[a-zA-Z]/)) {
            let id = "";
            while (source[i].match(/[a-zA-Z]/)) {
                id += source[i];
                i++;
            }
            if (KEYWORDS[id]) {
                tokens.push(token(id, KEYWORDS[id]));
            } else {
                tokens.push(token(id, TokenType.Identifier));
            }
            continue;
        }
        throw new Error(`Unexpected character: ['${char}']`);
    }
    return tokens;
}
