import {
    Expr,
    Identifier,
    NodeType,
    NumericLiteral,
    Program,
    Stmt,
} from "./ast.ts";
import { TokenType } from "./lexer.ts";
import { Token, tokenize } from "./lexer.ts";

export class Parser {
    private tokens: Token[] = [];

    process(code: string): Program {
        this.tokens = tokenize(code);
        const program: Program = {
            kind: NodeType.Program,
            body: [],
        };
        while (this.notEndOfTokens()) {
            program.body.push(this.parseStmt());
        }
        return program;
    }

    private first() {
        return this.tokens[0] as Token;
    }

    private eatFirst() {
        const prev = this.tokens.shift() as Token;
        return prev;
    }

    private notEndOfTokens(): boolean {
        return this.tokens[0].type !== TokenType.EOF;
    }

    private parseStmt(): Stmt {
        return this.parseExpr();
    }

    private parseExpr(): Expr {
        return this.parsePrimaryExpr();
    }

    private parsePrimaryExpr(): Expr {
        const { type } = this.first();
        switch (type) {
            case TokenType.Identifier:
                return {
                    kind: NodeType.Identifier,
                    symbol: this.eatFirst().value,
                } as Identifier;
            case TokenType.Number:
                return {
                    kind: NodeType.NumericLiteral,
                    value: Number(this.eatFirst().value),
                } as NumericLiteral;
            default:
                console.error("unexpected token", this.first());
                return {} as Stmt;
        }
    }
}
