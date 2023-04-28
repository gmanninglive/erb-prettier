import { ERBKind, Token } from "./lexer";

const opening_idens = ["if", "do", "unless"];

export class ERBAst {
  stack: Token[];
  program: ERBNode;
  node_map: Map<number, ERBNode>;

  constructor(stack: Token[]) {
    this.stack = stack;
    this.node_map = new Map();
    this.program = new ERBNode({ parent_id: -1, id: -1, token: null });
    this.node_map.set(-1, this.program);

    this.to_ast();
  }

  get_token(id: number) {
    return this.stack[id];
  }

  get_node(id: number) {
    return this.node_map.get(id);
  }

  get_parent(node: ERBNode) {
    return this.node_map.get(node.parent_id) || this.program;
  }

  private to_ast() {
    let parent: ERBNode = this.program;
    this.stack.forEach((token, idx) => {
      const node = new ERBNode({
        token,
        id: idx,
        parent_id: parent.id,
      });

      this.node_map.set(idx, node);

      switch (token.kind) {
        case "close": {
          if (token.type === "html") {
            parent.closing_token = token;

            // Move up one level
            parent = this.get_parent(parent);
          }

          break;
        }
        case "open": {
          if (token.type === "html") {
            parent.append_child(node);
            parent = node;
          }

          break;
        }
        case "statement": {
          node.opening_token = this.get_token(idx - 1);
          node.closing_token = this.get_token(idx + 1);

          parent.append_child(node);

          if (opening_idens.some((s) => token.content.includes(s))) {
            // Move down one level
            parent = node;
          }

          if (token.content.trim() === ERBKind.END) {
            // Move up one level
            parent = this.get_parent(parent);
          }
        }
        default: {
          if (token.type !== "erb") {
            parent.append_child(node);
          }
          break;
        }
      }
    });
  }
}

export class ERBNode {
  opening_token?: Token | null = null;
  closing_token?: Token | null = null;
  id: number;
  parent_id: number;
  token: Token | null;
  children: ERBNode[] = [];

  constructor({
    parent_id,
    id,
    token,
  }: {
    id: number;
    parent_id: number;
    token: Token | null;
  }) {
    this.parent_id = parent_id;
    this.id = id;
    this.token = token;
  }

  append_child(n: ERBNode) {
    this.children.push(n);
  }
}
