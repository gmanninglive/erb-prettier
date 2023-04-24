enum ERB {
  open = "<%",
  open_print = "<%=",
  open_print_escape = "<%==",
  close = "%>",
}

type TokenType = "open" | "open_p" | "open_p_e" | "close" | "html" | "ruby";

export class Token {
  type: TokenType;
  content: string;
  start: number;
  end: number;

  constructor({
    type,
    content,
    start,
    pos,
  }: {
    type: TokenType;
    content: string;
    start: number;
    pos: number;
  }) {
    this.content = content;
    this.type = type;
    this.start = start;
    this.end = pos;
  }

  loc() {
    return `${this.start}:${this.end}`;
  }
}

type StateFn = (() => void) | null;

export class Lexer {
  private start = 0;
  private pos = 0;
  text: string;
  tokens: Token[] = [];
  state: StateFn = this.lex_html;

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
      this.pos++;
    } else {
      this.pos += by;
    }
  }

  private next_is_open_pe() {
    return this.text.slice(this.pos, this.pos + 4) == ERB.open_print_escape;
  }

  private next_is_open_p() {
    return this.text.slice(this.pos, this.pos + 3) == ERB.open_print;
  }

  private next_is_open() {
    return this.text.slice(this.pos, this.pos + 2) == ERB.open;
  }

  private next_is_end = () => this.pos + 1 > this.text.length;

  private emit_html = () =>
    this.tokens.push(
      new Token({
        type: "html",
        content: this.text.slice(this.start, this.pos),
        start: this.start,
        pos: this.pos,
      })
    );

  private lex_open() {
    this.start = this.pos;
    while (!(this.text.slice(this.pos, this.pos + 2) == ERB.close)) {
      this.advance();
    }

    this.tokens.push(
      new Token({
        type: "ruby",
        content: this.text.slice(this.start, this.pos),
        start: this.start,
        pos: this.pos,
      })
    );
    this.state = this.lex_close;
  }

  private lex_close() {
    this.tokens.push(
      new Token({
        type: "close",
        content: ERB.close,
        start: this.start,
        pos: this.pos,
      })
    );
    this.advance(2);

    this.state = this.lex_html;
  }

  private lex_html() {
    this.start = this.pos;

    L: while (true) {
      if (this.next_is_open_pe()) {
        this.emit_html();
        this.advance(3);

        this.tokens.push(
          new Token({
            type: "open_p_e",
            content: ERB.open_print_escape,
            start: this.start,
            pos: this.pos,
          })
        );

        this.state = this.lex_open;
        break L;
      }
      if (this.next_is_open_p()) {
        this.emit_html();
        this.tokens.push(
          new Token({
            type: "open_p",
            content: ERB.open_print,
            start: this.start,
            pos: this.pos,
          })
        );
        this.advance(3);
        this.state = this.lex_open;
        break L;
      }
      if (this.next_is_open()) {
        this.emit_html();
        this.tokens.push(
          new Token({
            type: "open",
            content: ERB.open,
            start: this.start,
            pos: this.pos,
          })
        );
        this.advance(2);
        this.state = this.lex_open;
        break L;
      }

      if (this.next_is_end()) {
        if (this.pos > this.start) {
          this.emit_html();
        }

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
