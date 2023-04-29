import {
  AstPath,
  format,
  ParserOptions,
  Parser as PrettierParser,
} from "prettier";
import { ERBAst, ProgramNode, ERBNode, Parser, ERBKind } from "./parser";

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
          if (n.content.trim() === ERBKind.END) {
            break;
          }

          let iden = `<node-${n.id}>`;

          if (n.kind === "self_closing" || n.kind === "comment") {
            iden = `<node-${n.id} />`;
          }

          html_string += iden;
          erb_nodes.set(iden, n);
          break;
        }
        case "text": {
          html_string += n.content;
        }
      }

      walk(n);

      // add closing html tag
      if (n.type === "html") {
        html_string += n.closed_by?.content || "";
      }

      // add <% end %> tag placeholder
      if (
        n.type === "erb" &&
        n.kind !== "self_closing" &&
        n.kind !== "comment"
      ) {
        const iden = `</node-${n.id}>`;
        html_string += iden;

        erb_nodes.set(iden, n);
      }
    }
  };

  walk(program);

  const formatted_html = format(html_string, { parser: "html" });

  function print_erb(node: ERBNode, is_end_tag: boolean) {
    if (node.kind === "comment") {
      return node.content;
    }

    // print end tag
    if (is_end_tag) {
      const start = node.closed_by?.expression_start?.content;
      const end = node.closed_by?.expression_end?.content;
      const expression = node.closed_by?.content;

      if (!start || !end || !expression) {
        console.error(
          `Error printing file, expected end received undefined;\n\nfor: ${node.content}, start: ${node.start}, end: ${node.end}`
        );
        return "";
      }
      return start + expression.trim() + end;
    }

    const start = node.expression_start?.content;
    const end = node.expression_end?.content;

    const indent = " ".repeat((node.depth + 2) * tabWidth);
    const expression = node.content
      // replace whitespace after comma with newline and indent matching depth within tree
      .replace(/,[\s\n\r]*/g, ",\n".concat(indent))
      // trim start and end to normalize
      .trim();

    const formatted = `${start} ${expression} ${end}`;

    return formatted;
  }

  return [...erb_nodes].reduce((prev, [key, node]) => {
    return prev.replace(key, print_erb(node, key.startsWith("</")));
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
