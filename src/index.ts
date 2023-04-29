import {
  AstPath,
  format,
  ParserOptions,
  Parser as PrettierParser,
} from "prettier";
import { ERBAst, ProgramNode, ERBNode, Parser } from "./parser";

function print(path: AstPath<ERBAst>, { tabWidth }: ParserOptions) {
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

  function print_erb(node: ERBNode) {
    const start = node.opening_token?.content;
    const end = node.closing_token?.content;

    if (node.kind === "comment") {
      return node.content;
    }

    const indent = " ".repeat((node.depth + 2) * tabWidth);

    const expression = node.content
      // replace whitespace after comma with newline and indent matching depth within tree
      .replace(/,[\s\n\r]*/g, ",\n".concat(indent))
      // trim start and end to normalize
      .trim();

    const formatted = `${start} ${expression} ${end}`;
    const parent = ast.get_parent(node);

    if (parent.type === "erb") {
      const indent = " ".repeat(tabWidth);
      return indent + formatted;
    }
    return formatted;
  }

  return [...erb_nodes].reduce((prev, [key, node]) => {
    return prev.replace(key, print_erb(node));
  }, formatted_html);
}

const printers = {
  "erb-ast": {
    print,
  },
};

const parser: PrettierParser = {
  parse: (input: string) => new Parser(input).parse(),
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
