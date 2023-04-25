import { Lexer } from "../src/lexer";

describe("Lexer", () => {
  it("parses single line", () => {
    const input = `<%= Time.zone.now %>`;

    const out = new Lexer(input).lex();
    expect(out).toMatchInlineSnapshot(`
      [
        Token {
          "content": "<%=",
          "end": 3,
          "start": 0,
          "type": "open",
        },
        Token {
          "content": " Time.zone.now ",
          "end": 18,
          "start": 3,
          "type": "ruby",
        },
        Token {
          "content": "%>",
          "end": 20,
          "start": 18,
          "type": "close",
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
          "content": "<div>
          ",
          "end": 10,
          "start": 0,
          "type": "html",
        },
        Token {
          "content": "<%",
          "end": 12,
          "start": 10,
          "type": "open",
        },
        Token {
          "content": " if true ",
          "end": 21,
          "start": 12,
          "type": "ruby",
        },
        Token {
          "content": "%>",
          "end": 23,
          "start": 21,
          "type": "close",
        },
        Token {
          "content": "
            ",
          "end": 30,
          "start": 23,
          "type": "html",
        },
        Token {
          "content": "<%=",
          "end": 33,
          "start": 30,
          "type": "open",
        },
        Token {
          "content": " render Component.new ",
          "end": 55,
          "start": 33,
          "type": "ruby",
        },
        Token {
          "content": "%>",
          "end": 57,
          "start": 55,
          "type": "close",
        },
        Token {
          "content": "
          ",
          "end": 62,
          "start": 57,
          "type": "html",
        },
        Token {
          "content": "<%",
          "end": 64,
          "start": 62,
          "type": "open",
        },
        Token {
          "content": " end ",
          "end": 69,
          "start": 64,
          "type": "ruby",
        },
        Token {
          "content": "%>",
          "end": 71,
          "start": 69,
          "type": "close",
        },
        Token {
          "content": "    
          
          </div>",
          "end": 91,
          "start": 71,
          "type": "html",
        },
      ]
    `);
  });
});
