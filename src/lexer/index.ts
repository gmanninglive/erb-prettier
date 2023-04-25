import { is_alphanumeric, is_whitespace } from "./utils";

enum ERB {
  open = "<%",
  open_print = "<%=",
  open_print_escape = "<%==",
  close = "%>",
  close_trimmed = "-%>",
}

export type TokenType = "open" | "close" | "html" | "ruby";

export class Token {
  type: TokenType;
  content: string;
  start: number;
  end: number;

  constructor({
    type,
    content,
    start,
    end,
  }: {
    type: TokenType;
    content: string;
    start: number;
    end: number;
  }) {
    this.content = content;
    this.type = type;
    this.start = start;
    this.end = end;
  }

  loc() {
    return `${this.start}:${this.end}`;
  }

  is_print() {
    return this.type === "open" && this.content.endsWith("=");
  }

  is_escaped() {
    return this.type === "open" && this.content.endsWith("==");
  }

  is_trimmed() {
    return this.content === ERB.close_trimmed;
  }

  is_comment() {
    return this.type === "open" && this.content.endsWith("#");
  }
}

type StateFn = (() => void) | null;

export class Lexer {
  text: string;
  tokens: Token[] = [];
  state: StateFn = this.lex_html;
  private start = 0;
  private pos = 0;
  private advance_stack: number[] = [];

  constructor(input: string) {
    this.text = input;
  }

  lex() {
    while (this.state !== null) {
      this.state();
    }

    return this.tokens;
  }

  private advance(by?: number) {
    if (!by) {
      this.advance_stack.push(1);
      this.pos++;
    } else {
      this.advance_stack.push(by);
      this.pos += by;
    }
  }

  private peek(n = 1) {
    return this.text[this.pos + n];
  }

  private peek_slice(n = 1) {
    return this.text.slice(this.pos, this.pos + n);
  }

  private back() {
    if (this.pos > 0 && this.advance_stack.length) {
      this.pos -= this.advance_stack.pop()!;
    }
  }

  private is_eof(position: number) {
    return position + 1 > this.text.length;
  }

  private emit(type: Token["type"]) {
    if (this.pos > this.start) {
      this.tokens.push(
        new Token({
          type,
          content: this.text.slice(this.start, this.pos),
          start: this.start,
          end: this.pos,
        })
      );
    }
  }

  private lex_ruby() {
    this.start = this.pos;

    L: while (true) {
      if (
        this.peek_slice(2) === ERB.close ||
        (this.is_eof(this.pos + 3) && this.peek_slice(3) === "-%>")
      ) {
        break L;
      }

      this.advance();
    }

    this.emit("ruby");
    this.state = this.lex_close;
  }

  private lex_close() {
    this.start = this.pos;
    let span = 2;

    while (
      !this.is_eof(this.pos + span) &&
      !is_alphanumeric(this.peek(span)) &&
      !is_whitespace(this.peek(span))
    ) {
      span++;
    }

    this.advance(span);

    this.emit("close");

    this.state = this.lex_html;
  }

  private lex_open() {
    this.start = this.pos;
    let span = 2;

    while (
      !is_alphanumeric(this.peek(span)) &&
      !is_whitespace(this.peek(span))
    ) {
      span++;
    }

    this.advance(span);

    this.emit("open");

    this.state = this.lex_ruby;
  }

  private lex_html() {
    this.start = this.pos;

    L: while (true) {
      if (this.peek_slice(2) === ERB.open) {
        this.emit("html");

        this.state = this.lex_open;
        break L;
      }

      if (this.is_eof(this.pos)) {
        this.emit("html");

        this.state = null;
        break L;
      }

      this.advance();
    }
  }
}

export default {
  parse: (input: string) => new Lexer(input).lex(),
  astFormat: "erb-ast",
};
