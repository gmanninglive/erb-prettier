import { TokenType, Token, Loc, Lexer } from ".";

class ERBAst {
  stack: Token[] = [];
  nodes: ERBNode[] = [];

  constructor(stack: Token[]) {
    this.stack = stack;
    this.to_ast();
  }

  get_node(loc: Loc) {
    return this.stack.filter((t) => t.loc() === loc);
  }

  // <div>
  //   <div>
  //     <%= test %>
  //   </div>
  // </div>

  private to_ast() {
    this.stack.forEach((token, idx) => {
      if (token.type === "html") {
        this.nodes.push(new ERBNode({ token }));
      }
    });
  }
}

class ERBNode {
  opening_tag: Token | null = null;
  parent: Token | null;
  token: Token | null;

  constructor({
    parent = null,
    token,
  }: {
    parent?: Token | null;
    token: Token;
  }) {
    this.parent = parent;
    this.token = token;
  }

  get children(): Token[] {
    return this.children;
  }

  append_child(t: Token) {
    this.children.push(t);
  }
}

const tokens = new Lexer("<%= render Component.new %>").lex();

const ast = new ERBAst(tokens);

const node = new ERBNode({
  token: new Token({ type: "erb", content: "test", start: 10, end: 14 }),
});
