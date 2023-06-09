import { ERBAst, ERBNode } from "./ast";
import { Lexer, Token } from "./lexer";

export * from "./lexer";
export * from "./ast";

export class Parser {
  input: string;
  tokens: Token[];
  lexer: Lexer;
  ast?: ERBAst;

  constructor(input: string) {
    this.input = input;
    this.lexer = new Lexer(this.input);
    this.tokens = this.lexer.lex();
  }

  parse() {
    this.ast = new ERBAst(this.tokens, this.input);

    return this.ast;
  }
}

/* prints the ast back to an unformatted string, intended only for regression testing of the parser */
export function print_to_erb(ast: ERBAst) {
  let buffer = "";
  const callback = (node: ERBNode) => {
    if (node.kind === "comment") {
      buffer += node.content;
      return;
    }

    switch (node.type) {
      case "erb": {
        buffer += node.expression_start?.content;
        buffer += node.content;
        buffer += node.expression_end?.content;
        break;
      }
      default: {
        buffer += node?.content;
      }
    }

    node.children.forEach(callback);

    if (node.kind !== "parent") return;

    if (node.type === "erb") {
      buffer += `${node.closed_by?.expression_start?.content}${node.closed_by?.content}${node.closed_by?.expression_end?.content}`;
    } else {
      buffer += node.closed_by?.content || "";
    }
  };

  ast.program.children.forEach(callback);
  return buffer;
}
