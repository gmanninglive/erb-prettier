import { Token } from ".";

export class ERBAst {
  stack: Token[] = [];
  program: ERBNode;
  nodes: Map<number, ERBNode>;

  constructor(stack: Token[]) {
    this.stack = stack;
    this.nodes = new Map();
    this.nodes.set(
      -1,
      new ERBNode({ parent_id: -1, node_id: -1, token: null })
    );
    this.program = this.get_node(-1)!;

    this.to_ast();
  }

  get_node(id: number) {
    return this.nodes.get(id);
  }

  private to_ast() {
    let parent = this.get_node(-1)!;
    this.stack.forEach((token, idx) => {
      const node = new ERBNode({
        token,
        node_id: idx,
        parent_id: parent.node_id,
      });

      this.nodes.set(idx, node);

      switch (token.kind) {
        case "close": {
          parent.append_child(node);

          parent = this.get_node(parent.parent_id) || this.get_node(-1)!;
          break;
        }
        case "open": {
          if (token.type === "html") {
            parent.append_child(node);
          }

          parent = this.nodes.get(idx)!;
        }
        default: {
          parent.append_child(node);
          break;
        }
      }
    });
  }
}

export class ERBNode {
  opening_tag: Token | null = null;
  node_id: number;
  parent_id: number;
  token: Token | null;
  children: ERBNode[] = [];

  constructor({
    parent_id,
    node_id,
    token,
  }: {
    node_id: number;
    parent_id: number;
    token: Token | null;
  }) {
    this.parent_id = parent_id;
    this.node_id = node_id;
    this.token = token;
  }

  append_child(n: ERBNode) {
    this.children.push(n);
  }
}
