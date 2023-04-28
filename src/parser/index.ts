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
    this.ast = new ERBAst(this.tokens);

    return this.ast;
  }

  to_erb() {
    let buffer = "";
    const callback = (node: ERBNode) => {
      switch (node.token?.type) {
        case "erb": {
          buffer += node.opening_token?.content;
          buffer += node.token.content;
          buffer += node.closing_token?.content;
          break;
        }
        default: {
          buffer += node?.token?.content;
        }
      }

      node.children.forEach(callback);

      if (node.token?.type === "html") {
        buffer += node?.closing_token?.content || "";
      }
    };

    this.ast?.program.children.forEach(callback);
    return buffer;
  }
}
