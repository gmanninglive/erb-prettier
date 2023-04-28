import { AstPath, format } from "prettier";
import { ERBAst, ERBNode, Parser } from "./parser";

function print(path: AstPath<ERBAst>) {
  let html_string = "";
  let erb_nodes: Map<string, ERBNode> = new Map();

  const { program } = path.stack[0];

  const walk = (node: ERBNode) => {
    for (const n of node.children) {
      switch (n.token?.type) {
        case "html": {
          html_string += n.token.content;
          break;
        }
        case "erb": {
          const iden = `<erb-node-${n.id} />`;

          html_string += iden;
          erb_nodes.set(iden, n);
          break;
        }
        case "text": {
          html_string += n.token.content;
        }
      }

      walk(n);

      if (n.token?.type === "html") {
        html_string += n?.closing_token?.content || "";
      }
    }
  };

  walk(program);

  let formatted_html = format(html_string, { parser: "html" });

  return [...erb_nodes].reduce((prev, [key, node]) => {
    return prev.replace(
      key,
      `${node.opening_token?.content}${node.token?.content}${node.closing_token?.content}`
    );
  }, formatted_html);
}

const printers = {
  "erb-ast": {
    print,
  },
};

const parser = {
  parse: (input: string) => new Parser(input).parse(),
  astFormat: "erb-ast",
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
