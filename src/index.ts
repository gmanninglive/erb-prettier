import { AstPath, format } from "prettier";
import parser, { Token } from "./lexer";

// TODO: work out the best solution for formatting seperate languages
async function print(path: AstPath<Token[]>) {
  let ruby: string[] = [];
  let html: string[] = [];
  let output = "";

  for (const token of path.stack[0]) {
    switch (token.type) {
      case "open": {
        ruby.push(token.content);
        html.push("<");
        break;
      }
      case "close": {
        ruby.push(token.content);
        html.push("/>");
        break;
      }
      case "html": {
        html.push(token.content);
        break;
      }
      case "ruby": {
        ruby.push(token.content);
        html.push(`ruby_${token.start}:${token.end}`);
        break;
      }
    }
    const formatted_html = await format(html.join(), { parser: "html" });

    for (const token of path.stack[0]) {
      switch (token.type) {
        case "open": {
          html.push("<");
          break;
        }
        case "close": {
          html.push("/>");
          break;
        }
        case "html": {
          break;
        }
        case "ruby": {
          html.push(`ruby_${token.start}:${token.end}`);
          break;
        }
      }
    }
  }

  return output;
}

const printers = {
  "erb-ast": {
    print,
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
