import { ERBKind, Token } from "./lexer";

const opening_idens = ["if", "do", "unless"];

export class ERBAst {
  stack: Token[];
  program: ProgramNode;
  node_map: Map<number, ERBNode>;
  source: string;

  constructor(stack: Token[], src: string) {
    this.source = src;
    this.stack = stack;
    this.node_map = new Map();
    this.program = new ProgramNode({
      parent_id: -1,
      id: -1,
      depth: 0,
      start: 0,
      end: src.length - 1,
    });

    this.to_ast();
  }

  get_token(id: number) {
    return this.stack[id];
  }

  get_node(id: number) {
    return this.node_map.get(id);
  }

  get_parent(node: ProgramNode) {
    return this.node_map.get(node.parent_id) || this.program;
  }

  private to_ast() {
    let parent: ProgramNode = this.program;
    let depth = 0;
    this.stack.forEach((token, idx) => {
      const node = new ERBNode({
        token,
        id: idx,
        parent_id: parent.id,
        depth: depth,
      });

      this.node_map.set(idx, node);

      switch (token.kind) {
        case "close": {
          if (token.type === "html") {
            parent.closing_token = token;

            // Move up one level
            parent = this.get_parent(parent);
            depth--;
          }

          break;
        }
        case "open": {
          if (token.type === "html") {
            parent.append_child(node);
            parent = node;
            depth++;
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
            depth++;
          }

          if (token.content.trim() === ERBKind.END) {
            // Move up one level
            parent = this.get_parent(parent);
            depth++;
          }
        }
        default: {
          if (token.type !== "erb" || token.kind === "comment") {
            parent.append_child(node);
          }
          break;
        }
      }
    });
  }
}

export class ProgramNode {
  id: number;
  parent_id: number;
  children: ERBNode[] = [];
  depth: number;
  start: number;
  end: number;
  opening_token?: Token | null = null;
  closing_token?: Token | null = null;
  type = "program";

  constructor({
    parent_id,
    id,
    depth,
    start,
    end,
  }: {
    id: number;
    parent_id: number;
    depth: number;
    start: number;
    end: number;
  }) {
    this.parent_id = parent_id;
    this.id = id;
    this.depth = depth;
    this.start = start;
    this.end = end;
  }

  append_child(n: ERBNode) {
    this.children.push(n);
  }
}

export class ERBNode extends ProgramNode {
  type: Token["type"];
  content: string;
  kind: Token["kind"];

  constructor({
    parent_id,
    id,
    token,
    depth,
  }: {
    id: number;
    parent_id: number;
    token: Token;
    depth: number;
  }) {
    super({
      parent_id,
      id,
      depth,
      start: token.start,
      end: token.end,
    });

    this.type = token.type;
    this.content = token.content;
    this.kind = token.kind;
  }
}
