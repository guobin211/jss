export enum NodeType {
    /**
     * Statement
     */
    Program = "Program",
    VarDeclaration = "VarDeclaration",
    FunctionDeclaration = "FunctionDeclaration",
    AssignmentExpr = "AssignmentExpr",
    /**
     * Expression
     */
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
    Modulus = "%",
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

export interface VarDeclaration extends Stmt {
    kind: NodeType.VarDeclaration;
    constant: boolean;
    identifier: string;
    value?: Expr;
}

export interface FunctionDeclaration extends Stmt {
	kind: NodeType.FunctionDeclaration
	parameters: string[];
	name: string;
	body: Stmt[];
}

/**
 * 表达式
 */
export interface Expr extends Stmt {
}

export interface BinaryExpr extends Expr {
    kind: NodeType.BinaryExpr;
    left: Expr;
    right: Expr;
    operator: Operator;
}

/**
 * 标识符
 */
export interface Identifier extends Expr {
    kind: NodeType.Identifier;
    symbol: string;
}

/**
 * 数字
 */
export interface NumericLiteral extends Expr {
    kind: NodeType.NumericLiteral;
    value: number;
}

/**
 * 属性
 */
export interface Property extends Expr {
    kind: NodeType.Property;
    key: string;
    value?: Expr;
}

export interface ObjectLiteral extends Expr {
    kind: NodeType.ObjectLiteral;
    properties: Property[];
}

export interface AssignmentExpr extends Expr {
    kind: NodeType.AssignmentExpr;
    left: Expr;
    right: Expr;
}

export interface MemberExpr extends Expr {
    kind: NodeType.MemberExpr;
    object: Expr;
    property: Expr;
    computed: boolean;
}

export interface CallExpr extends Expr {
    kind: NodeType.CallExpr;
    caller: Expr;
    args: Expr[];
}

export function isBinaryExpr(node: Stmt): node is BinaryExpr {
    return node.kind === NodeType.BinaryExpr;
}
