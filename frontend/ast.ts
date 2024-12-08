export enum NodeType {
    Program = "Program",
    VarDeclaration = "VarDeclaration",
    FunctionDeclaration = "FunctionDeclaration",
    AssignmentExpr = "AssignmentExpr",
    MemberExpr = "MemberExpr",
    CallExpr = "CallExpr",
    Property = "Property",
    ObjectLiteral = "ObjectLiteral",
    NumericLiteral = "NumericLiteral",
    Identifier = "Identifier",
    BinaryExpr = "BinaryExpr",
}

export enum Operator {
    Plus = "+",
    Minus = "-",
    Multiply = "*",
    Divide = "/",
    Equals = "=",
    LessThan = "<",
    GreaterThan = ">",
    LessThanOrEqual = "<=",
    GreaterThanOrEqual = ">=",
    NotEqual = "!=",
    And = "&&",
    Or = "||",
    Not = "!",
}

/**
 * Program
 * ```
 * let x = if (true) { 1 } else { 2 }
 * ```
 */
export interface Stmt {
    kind: NodeType;
}

export interface Program extends Stmt {
    kind: NodeType.Program;
    body: Stmt[];
}

export interface Expr extends Stmt {
}

export interface BinaryExpr extends Expr {
    kind: NodeType.BinaryExpr;
    left: Expr;
    right: Expr;
    operator: Operator;
}

export interface Identifier extends Expr {
    kind: NodeType.Identifier;
    symbol: string;
}

export interface NumericLiteral extends Expr {
    kind: NodeType.NumericLiteral;
    value: number;
}
