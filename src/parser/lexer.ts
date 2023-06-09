import { is_alphanumeric, is_quote, is_whitespace } from "./utils";

export enum ERBKind {
  START = "<%",
  START_PRINT = "<%=",
  START_PRINT_ESCAPE = "<%==",
  START_COMMENT = "<%#",
  CLOSE = "%>",
  CLOSE_TRIMMED = "-%>",
  IF = "if",
  ELSE = "else",
  ELSE_IF = "elsif",
  END = "end",
  DO = "do",
  STATEMENT = "__statement__",
}

export enum HTMLKind {
  OPEN = "<",
  CLOSE = "</",
  SELF_CLOSING = "/>",
}

// void elements should be treated as self closing, as they can't contain children
const VOID_HTML = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
];

export type TokenType = "erb" | "html" | "text";

type Start = number;
type End = number;
export type Loc = `${Start}:${End}`;

export class Token {
  type: TokenType;
  content: string;
  start: number;
  end: number;
  kind:
    | "parent"
    | "parent_close"
    | "self_closing"
    | "erb_start"
    | "erb_close"
    | "text"
    | "comment";

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

    this.kind = this.get_kind();
  }

  loc(): Loc {
    return `${this.start}:${this.end}`;
  }

  is_close() {
    return (
      this.content.startsWith(HTMLKind.CLOSE) ||
      this.content.trim() === ERBKind.END
    );
  }

  is_self_closing() {
    if (this.type === "html") {
      return (
        this.content.endsWith(HTMLKind.SELF_CLOSING) ||
        VOID_HTML.some((s) => this.content.slice(1).startsWith(s))
      );
    }

    return false;
  }

  is_print() {
    return this.type === "erb" && this.content.endsWith("=");
  }

  is_escaped() {
    return this.type === "erb" && this.content.endsWith("==");
  }

  is_trimmed() {
    return this.content === ERBKind.CLOSE_TRIMMED;
  }

  is_comment() {
    return this.type === "erb" && this.content.endsWith("#");
  }

  private get_kind(): typeof this.kind {
    if (this.content.startsWith(ERBKind.START_COMMENT)) {
      return "comment";
    }
    if (this.is_self_closing()) {
      return "self_closing";
    }
    if (this.is_close()) {
      return "parent_close";
    }
    if (this.type === "erb" && this.content.startsWith(ERBKind.START)) {
      return "erb_start";
    }
    if (this.type === "erb" && this.content.endsWith(ERBKind.CLOSE)) {
      return "erb_close";
    }
    if (this.type !== "text") {
      return "parent";
    }
    return "text";
  }

  toString() {
    return this.content;
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

    this.set_token_kind();
    return this.tokens;
  }

  private debug() {
    console.debug({ start: this.start, pos: this.pos, state: this.state });
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

  private current() {
    return this.text[this.pos];
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
        this.peek_slice(2) === ERBKind.CLOSE ||
        (this.is_eof(this.pos + 3) && this.peek_slice(3) === "-%>")
      ) {
        break L;
      }

      this.advance();
    }

    this.emit("erb");
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

    this.emit("erb");

    this.state = this.lex_text;
  }

  private lex_open() {
    this.start = this.pos;

    // consume any erb comments as a single token
    if (this.peek_slice(3) === ERBKind.START_COMMENT) {
      while (this.peek_slice(2) !== ERBKind.CLOSE) {
        this.advance();
      }

      this.advance(2);
      this.emit("erb");
      this.state = this.lex_text;

      return;
    }

    let span = 2;

    while (
      !is_alphanumeric(this.peek(span)) &&
      !is_whitespace(this.peek(span))
    ) {
      span++;
    }

    this.advance(span);

    this.emit("erb");

    this.state = this.lex_ruby;
  }

  private lex_html() {
    this.start = this.pos;

    L: while (true) {
      // as this lexer is currently only intended for code formatting,
      // we treat erb within html tag attributes as part of the html token
      if (this.peek_slice(2) === ERBKind.START && !is_quote(this.peek(-1))) {
        this.emit("html");

        this.state = this.lex_open;
        break L;
      }

      if (this.peek() === ">" && !is_quote(this.peek(2))) {
        this.advance(2);
        this.emit("html");

        this.state = this.lex_text;
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

  private lex_text() {
    this.start = this.pos;

    L: while (true) {
      if (
        this.current() === "<" &&
        (is_alphanumeric(this.peek()) || this.peek() === "/")
      ) {
        this.emit("text");

        this.state = this.lex_html;
        break L;
      }

      if (this.peek_slice(2) === ERBKind.START) {
        this.emit("text");

        this.state = this.lex_open;
        break L;
      }

      if (this.is_eof(this.pos)) {
        this.emit("text");

        this.state = null;
        break L;
      }

      this.advance();
    }
  }

  private set_token_kind() {
    this.tokens.forEach((token, idx) => {
      if (token.type === "erb" && token.is_print()) {
        const expression = this.tokens[idx + 1];

        if (expression.type === "erb" && expression.kind === "parent") {
          expression.kind = "self_closing";
        }
      }
    });
  }
}
