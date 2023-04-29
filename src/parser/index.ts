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

    this.lexer = new Lexer(input);

    this.tokens = this.lexer.lex();
  }

  parse() {
    this.ast = new ERBAst(this.tokens, this.input);

    return this.ast;
  }
}

export function print_to_erb(ast: ERBAst) {
  let buffer = "";
  const callback = (node: ERBNode) => {
    switch (node.type) {
      case "erb": {
        buffer += node.opening_token?.content;
        buffer += node.content;
        buffer += node.closing_token?.content;
        break;
      }
      default: {
        buffer += node?.content;
      }
    }

    node.children.forEach(callback);

    if (node.type === "html") {
      buffer += node?.closing_token?.content || "";
    }
  };

  ast.program.children.forEach(callback);
  return buffer;
}
