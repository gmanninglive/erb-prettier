import { Lexer } from "../src/lexer";

describe("Lexer", () => {
  it("parses single line", () => {
    const input = `<%= Time.zone.now %>`;

    const out = new Lexer(input).lex();
    expect(out).toMatchInlineSnapshot(`
      [
        Token {
          "content": "",
          "end": 0,
          "start": 0,
          "type": "html",
        },
        Token {
          "content": "<%=",
          "end": 0,
          "start": 0,
          "type": "open_p",
        },
        Token {
          "content": " Time.zone.now ",
          "end": 18,
          "start": 3,
          "type": "ruby",
        },
        Token {
          "content": "%>",
          "end": 18,
          "start": 3,
          "type": "close",
        },
      ]
    `);
  });

  it("parses multi line", () => {
    const input = `<div>
    <% if true then %>
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
          "end": 10,
          "start": 0,
          "type": "open",
        },
        Token {
          "content": " if true then ",
          "end": 26,
          "start": 12,
          "type": "ruby",
        },
        Token {
          "content": "%>",
          "end": 26,
          "start": 12,
          "type": "close",
        },
        Token {
          "content": "
            ",
          "end": 35,
          "start": 28,
          "type": "html",
        },
        Token {
          "content": "<%=",
          "end": 35,
          "start": 28,
          "type": "open_p",
        },
        Token {
          "content": " render Component.new ",
          "end": 60,
          "start": 38,
          "type": "ruby",
        },
        Token {
          "content": "%>",
          "end": 60,
          "start": 38,
          "type": "close",
        },
        Token {
          "content": "
          ",
          "end": 67,
          "start": 62,
          "type": "html",
        },
        Token {
          "content": "<%",
          "end": 67,
          "start": 62,
          "type": "open",
        },
        Token {
          "content": " end ",
          "end": 74,
          "start": 69,
          "type": "ruby",
        },
        Token {
          "content": "%>",
          "end": 74,
          "start": 69,
          "type": "close",
        },
        Token {
          "content": "    
          
          </div>",
          "end": 96,
          "start": 76,
          "type": "html",
        },
      ]
    `);
  });
});
