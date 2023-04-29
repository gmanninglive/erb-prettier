import { AstPath, format, Parser as PrettierParser } from "prettier";
import { ERBAst, ProgramNode, ERBNode, Parser } from "./parser";

function print(path: AstPath<ERBAst>) {
  let html_string = "";
  let erb_nodes: Map<string, ERBNode> = new Map();

  const ast = path.stack[0];
  const { program } = ast;

  const walk = (node: ProgramNode) => {
    for (const n of node.children) {
      switch (n.type) {
        case "html": {
          html_string += n.content;
          break;
        }
        case "erb": {
          const iden = `<erb-node-${n.id} />`;

          html_string += iden;
          erb_nodes.set(iden, n);
          break;
        }
        case "text": {
          html_string += n.content;
        }
      }

      walk(n);

      if (n.type === "html") {
        html_string += n.closing_token?.content || "";
      }
    }
  };

  walk(program);

  const formatted_html = format(html_string, { parser: "html" });

  return [...erb_nodes].reduce((prev, [key, node]) => {
    return prev.replace(key, print_erb(node));
  }, formatted_html);
}

function print_erb(node: ERBNode) {
  const start = node.opening_token?.content;
  const end = node.closing_token?.content;

  if (node.kind === "comment") {
    return node.content;
  }

  const expression = node.content
    // replace whitespace after comma with newline and indent matching depth within tree
    .replace(/,[\s\n\r]*/g, ",\n".concat(...Array(node.depth + 2).fill("  ")))
    // trim start and end to normalize
    .trim();

  return `${start} ${expression} ${end}`;
}

const printers = {
  "erb-ast": {
    print,
  },
};

const parser: PrettierParser = {
  parse: (input: string) => new Parser(input).ast,
  astFormat: "erb-ast",
  locStart(node: ERBNode) {
    return node.start;
  },
  locEnd(node: ERBNode) {
    return node.end;
  },
};

module.exports = {
  defaultOptions: {},
  parsers: {
    erb: parser,
  },
  printers,
  languages: [
    {
      name: "html-erb",
      parsers: ["erb"],
      extensions: [".html.erb"],
    },
  ],
};
