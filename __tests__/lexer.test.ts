import { Lexer } from "../src/lexer";

describe("Lexer", () => {
  it("parses single line", () => {
    const input = `<%= Time.zone.now %>`;

    const out = new Lexer(input).lex();
    expect(out).toMatchInlineSnapshot(`
      [
        Token {
          "content": "<%= Time.zone.now %>",
          "end": 20,
          "kind": "close",
          "start": 0,
          "type": "html",
        },
      ]
    `);
  });

  it("parses multi line", () => {
    const input = `<div>
    <% if true %>
      <%= render Component.new %>
    <% end %>    
    
    </div>`;

    const out = new Lexer(input).lex();

    expect(out).toMatchInlineSnapshot(`
      [
        Token {
          "content": "<div>",
          "end": 5,
          "kind": "open",
          "start": 0,
          "type": "html",
        },
        Token {
          "content": "
          ",
          "end": 10,
          "kind": "text",
          "start": 5,
          "type": "text",
        },
        Token {
          "content": "<%",
          "end": 12,
          "kind": "open",
          "start": 10,
          "type": "erb",
        },
        Token {
          "content": " if true ",
          "end": 21,
          "kind": "statement",
          "start": 12,
          "type": "erb",
        },
        Token {
          "content": "%>",
          "end": 23,
          "kind": "close",
          "start": 21,
          "type": "erb",
        },
        Token {
          "content": "
            ",
          "end": 30,
          "kind": "text",
          "start": 23,
          "type": "text",
        },
        Token {
          "content": "<%=",
          "end": 33,
          "kind": "self_closing",
          "start": 30,
          "type": "erb",
        },
        Token {
          "content": " render Component.new ",
          "end": 55,
          "kind": "statement",
          "start": 33,
          "type": "erb",
        },
        Token {
          "content": "%>",
          "end": 57,
          "kind": "close",
          "start": 55,
          "type": "erb",
        },
        Token {
          "content": "
          ",
          "end": 62,
          "kind": "text",
          "start": 57,
          "type": "text",
        },
        Token {
          "content": "<%",
          "end": 64,
          "kind": "open",
          "start": 62,
          "type": "erb",
        },
        Token {
          "content": " end ",
          "end": 69,
          "kind": "statement",
          "start": 64,
          "type": "erb",
        },
        Token {
          "content": "%>",
          "end": 71,
          "kind": "close",
          "start": 69,
          "type": "erb",
        },
        Token {
          "content": "    
          
          ",
          "end": 85,
          "kind": "text",
          "start": 71,
          "type": "text",
        },
        Token {
          "content": "</div>",
          "end": 91,
          "kind": "close",
          "start": 85,
          "type": "html",
        },
      ]
    `);
  });

  it("doesn't extract erb from html tag attributes", () => {
    const input = `<div class="<%= true ? 'test-true' : 'test-false' %>"></div>`;

    const out = new Lexer(input).lex();

    expect(out).toMatchInlineSnapshot(`
      [
        Token {
          "content": "<div class="<%= true ? 'test-true' : 'test-false' %>">",
          "end": 54,
          "kind": "open",
          "start": 0,
          "type": "html",
        },
        Token {
          "content": "</div>",
          "end": 60,
          "kind": "close",
          "start": 54,
          "type": "html",
        },
      ]
    `);
  });
});
