import {
    AssignmentExpr,
    BinaryExpr,
    CallExpr,
    Expr,
    FunctionDeclaration,
    Identifier,
    MemberExpr,
    NodeType,
    NumericLiteral,
    ObjectLiteral,
    Operator,
    Program,
    Property,
    Stmt,
    VarDeclaration,
} from "./ast.ts";
import { TokenType } from "./lexer.ts";
import { Token, tokenize } from "./lexer.ts";

function parseOperator(value: string): Operator {
    switch (value) {
        case "+":
            return Operator.Plus;
        case "-":
            return Operator.Minus;
        case "*":
            return Operator.Multiply;
        case "/":
            return Operator.Divide;
        case "%":
            return Operator.Modulus;
    }
    console.error(`Unknown operator: ${value}`);
    Deno.exit(1);
}

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

    private expect(type: TokenType, err: unknown) {
        const prev = this.tokens.shift();
        if (!prev || prev.type !== type) {
            console.error(`expect ${type}, but got ${prev?.type}`, err);
            Deno.exit(1);
        }
        return prev;
    }

    private parseStmt(): Stmt {
        switch (this.first().type) {
            case TokenType.Let:
            case TokenType.Const:
                return this.parseVarDeclaration();
            case TokenType.Fn:
                return this.parseFnDeclaration();
            default:
                return this.parseExpr();
        }
    }

    /**
     * (let|const) identifier = expr
     */
    private parseVarDeclaration(): Stmt {
        const isConstant = this.eatFirst().type === TokenType.Const;
        const identifier: string =
            this.expect(TokenType.Identifier, "expect identifier name").value;
        // let a;
        if (this.first().type === TokenType.Semicolon) {
            this.eatFirst();
            // const a; error
            if (isConstant) {
                throw new Error("constant variable must have a value");
            }
            return {
                kind: NodeType.VarDeclaration,
                constant: isConstant,
                identifier,
            } as VarDeclaration;
        }
        // const a = 3;
        this.expect(TokenType.Equals, "expect '=' to assign value");
        const declaration = {
            kind: NodeType.VarDeclaration,
            constant: isConstant,
            identifier,
            value: this.parseExpr(),
        } as VarDeclaration;
        this.expect(TokenType.Semicolon, "expect ';' to end the statement");
        return declaration;
    }

    private parseFnDeclaration(): FunctionDeclaration {
        this.eatFirst();
        const name = this.expect(TokenType.Identifier, "expect function name")
            .value;
        const args = this.parseArgs();
        const parameters = [];
        for (const arg of args) {
            if (arg.kind !== NodeType.Identifier) {
                console.error("Expect identifier");
                console.error(arg);
                throw new Error("Expect identifier");
            }
            parameters.push((arg as Identifier).symbol);
        }
        this.expect(TokenType.OpenBrace, "expect '{'");
        const body = [];
        while (this.first().type !== TokenType.CloseBrace) {
            if (this.first().type === TokenType.Semicolon) {
                this.eatFirst();
                continue;
            }
            body.push(this.parseStmt());
        }
        this.expect(TokenType.CloseBrace, "expect '}'");
        return {
            kind: NodeType.FunctionDeclaration,
            name,
            parameters,
            body,
        };
    }

    /**
     * 解析表达式
     */
    private parseExpr(): Expr {
        return this.parseAssignmentExpr();
    }

    private parsePrimaryExpr(): Expr {
        const { type } = this.first();
        let value: Expr;
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
            case TokenType.OpenParen:
                this.eatFirst();
                value = this.parseExpr();
                this.expect(TokenType.CloseParen, "expect ')'");
                return value;
            default:
                console.error(
                    "Unexpected token found during parsing!",
                    this.first(),
                );
                Deno.exit(1);
        }
    }

    /**
     * 对象表达式
     */
    private parseObjectExpr(): Expr {
        if (this.first().type !== TokenType.OpenBrace) {
            return this.parseAdditiveExpr();
        }
        this.eatFirst();
        const properties: Property[] = [];
        while (
            this.notEndOfTokens() && this.first().type !== TokenType.CloseBrace
        ) {
            const key =
                this.expect(TokenType.Identifier, "expect property key").value;
            // Allows shorthand key: pair -> { key, }
            if (this.first().type === TokenType.Comma) {
                this.eatFirst();
                properties.push({ kind: NodeType.Property, key } as Property);
                continue;
            } else if (this.first().type === TokenType.CloseBrace) {
                // Allows shorthand key: pair -> { key }
                properties.push({ kind: NodeType.Property, key } as Property);
                continue;
            }
            // { key: val }
            this.expect(TokenType.Colon, "expect ':'");
            const value = this.parseExpr();
            properties.push(
                { kind: NodeType.Property, key, value } as Property,
            );
            if (this.first().type === TokenType.CloseBrace) {
                this.expect(TokenType.Semicolon, "expect ';' or '}'");
            }
        }

        this.expect(TokenType.CloseBrace, "expect '}'");
        return { kind: NodeType.ObjectLiteral, properties } as ObjectLiteral;
    }

    private parseArgumentsList(): Expr[] {
        const args = [this.parseAssignmentExpr()];
        while (this.first().type === TokenType.Comma) {
            this.eatFirst();
            args.push(this.parseAssignmentExpr());
        }
        return args;
    }

    /**
     * 解析表达式
     */
    private parseAdditiveExpr() {
        let left = this.parseMultiPlicateExpr();
        while (this.first().value === "+" || this.first().value === "-") {
            const operator = parseOperator(this.eatFirst().value);
            const right = this.parseMultiPlicateExpr();
            left = {
                kind: NodeType.BinaryExpr,
                operator,
                left,
                right,
            } as BinaryExpr;
        }
        return left;
    }

    /**
     * 解析表达式
     */
    private parseMultiPlicateExpr(): Expr {
        let left = this.parseCallMemberExpr();
        while (["*", "/", "%"].includes(this.first().value)) {
            const operator = parseOperator(this.eatFirst().value);
            const right = this.parseCallMemberExpr();
            left = {
                kind: NodeType.BinaryExpr,
                operator,
                left,
                right,
            } as BinaryExpr;
        }
        return left as Expr;
    }

    private parseProperty(): Property {
        console.error("TODO! parseProperty");
        Deno.exit(1);
    }

    private parseCallMemberExpr(): Expr {
        const member = this.parseMemberExpr();
        if (this.first().type === TokenType.OpenParen) {
            return this.parseCallExpr(member);
        }
        return member as Expr;
    }

    private parseMemberExpr(): Expr {
        let object = this.parsePrimaryExpr();
        while (
            this.first().type == TokenType.Dot ||
            this.first().type == TokenType.OpenBracket
        ) {
            const operator = this.eatFirst();
            let property: Expr;
            let computed: boolean;

            if (operator.type === TokenType.Dot) {
                computed = false;
                property = this.parsePrimaryExpr();
                if (property.kind !== NodeType.Identifier) {
                    throw new Error("Expect identifier");
                }
            } else {
                computed = true;
                property = this.parseExpr();
                this.expect(TokenType.CloseBracket, "expect ']'");
            }

            object = {
                kind: NodeType.MemberExpr,
                object,
                property,
                computed,
            } as MemberExpr;
        }
        return object as Expr;
    }

    private parseArgs(): Expr[] {
        this.expect(TokenType.OpenParen, "Expected open parenthesis");
		const args =
			this.first().type == TokenType.CloseParen ? [] : this.parseArgumentsList();
		this.expect(
			TokenType.CloseParen,
			"Missing closing parenthesis inside arguments list"
		);
		return args;
    }

    private parseCallExpr(caller: Expr): Expr {
        let callExpr: Expr = {
            kind: NodeType.CallExpr,
            caller,
            args: this.parseArgs()
        } as CallExpr;
		if (this.first().type == TokenType.OpenParen) {
			callExpr = this.parseCallExpr(callExpr);
		}
		return callExpr;
    }

    /**
     * 赋值语句
     */
    private parseAssignmentExpr(): Expr {
        const left = this.parseObjectExpr();
        if (this.first().type === TokenType.Equals) {
            this.eatFirst();
            const right = this.parseAssignmentExpr();
            return {
                kind: NodeType.AssignmentExpr,
                left,
                right,
            } as AssignmentExpr;
        }
        return left;
    }

    private parseBinaryExpr(): Expr {
        console.error("TODO! parseProperty");
        Deno.exit(1);
    }
}
