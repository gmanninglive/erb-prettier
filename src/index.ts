import { AstPath, format } from "prettier";
import parser, { Token } from "./lexer";

// TODO: work out the best solution for formatting seperate languages
async function print(path: AstPath<Token[]>) {
  let output = [];

  for (const token of path.stack[0]) {
    switch (token.type) {
      case "open": {
        output.push(token.content);
        break;
      }
      case "close": {
        output.push(token.content);
        break;
      }
      case "html": {
        output.push(format(token.content, { parser: "html" }));
      }
      case "ruby": {
        output.push(format(token.content, { parser: "ruby" }));
      }
    }
  }

  return output.join();
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
