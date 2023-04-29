import { Lexer } from "../src/parser/lexer";
import { ERBAst } from "../src/parser/ast";

describe("Ast", () => {
  it("parses single line", () => {
    const input = `<%= Time.zone.now %>`;

    const tokens = new Lexer(input).lex();
    const out = new ERBAst(tokens, input);
    expect(out.program).toMatchInlineSnapshot(`
      ProgramNode {
        "children": [
          ERBNode {
            "children": [],
            "closing_token": Token {
              "content": "%>",
              "end": 20,
              "kind": "close",
              "start": 18,
              "type": "erb",
            },
            "content": " Time.zone.now ",
            "depth": 0,
            "end": 18,
            "id": 1,
            "kind": "statement",
            "opening_token": Token {
              "content": "<%=",
              "end": 3,
              "kind": "self_closing",
              "start": 0,
              "type": "erb",
            },
            "parent_id": -1,
            "start": 3,
            "type": "erb",
          },
        ],
        "closing_token": null,
        "depth": 0,
        "end": 19,
        "id": -1,
        "opening_token": null,
        "parent_id": -1,
        "start": 0,
        "type": "program",
      }
    `);
  });

  it("parses multi line", () => {
    const input = `<div>
    <% if true %>
      <%= render Component.new %>
    <% end %>    
    
    </div>`;

    const tokens = new Lexer(input).lex();
    const out = new ERBAst(tokens, input);

    expect(out.program).toMatchInlineSnapshot(`
      ProgramNode {
        "children": [
          ERBNode {
            "children": [
              ERBNode {
                "children": [],
                "closing_token": null,
                "content": "
          ",
                "depth": 1,
                "end": 10,
                "id": 1,
                "kind": "text",
                "opening_token": null,
                "parent_id": 0,
                "start": 5,
                "type": "text",
              },
              ERBNode {
                "children": [
                  ERBNode {
                    "children": [],
                    "closing_token": null,
                    "content": "
            ",
                    "depth": 2,
                    "end": 30,
                    "id": 5,
                    "kind": "text",
                    "opening_token": null,
                    "parent_id": 3,
                    "start": 23,
                    "type": "text",
                  },
                  ERBNode {
                    "children": [],
                    "closing_token": Token {
                      "content": "%>",
                      "end": 57,
                      "kind": "close",
                      "start": 55,
                      "type": "erb",
                    },
                    "content": " render Component.new ",
                    "depth": 2,
                    "end": 55,
                    "id": 7,
                    "kind": "statement",
                    "opening_token": Token {
                      "content": "<%=",
                      "end": 33,
                      "kind": "self_closing",
                      "start": 30,
                      "type": "erb",
                    },
                    "parent_id": 3,
                    "start": 33,
                    "type": "erb",
                  },
                  ERBNode {
                    "children": [],
                    "closing_token": null,
                    "content": "
          ",
                    "depth": 2,
                    "end": 62,
                    "id": 9,
                    "kind": "text",
                    "opening_token": null,
                    "parent_id": 3,
                    "start": 57,
                    "type": "text",
                  },
                  ERBNode {
                    "children": [],
                    "closing_token": Token {
                      "content": "%>",
                      "end": 71,
                      "kind": "close",
                      "start": 69,
                      "type": "erb",
                    },
                    "content": " end ",
                    "depth": 2,
                    "end": 69,
                    "id": 11,
                    "kind": "statement",
                    "opening_token": Token {
                      "content": "<%",
                      "end": 64,
                      "kind": "open",
                      "start": 62,
                      "type": "erb",
                    },
                    "parent_id": 3,
                    "start": 64,
                    "type": "erb",
                  },
                ],
                "closing_token": Token {
                  "content": "%>",
                  "end": 23,
                  "kind": "close",
                  "start": 21,
                  "type": "erb",
                },
                "content": " if true ",
                "depth": 1,
                "end": 21,
                "id": 3,
                "kind": "statement",
                "opening_token": Token {
                  "content": "<%",
                  "end": 12,
                  "kind": "open",
                  "start": 10,
                  "type": "erb",
                },
                "parent_id": 0,
                "start": 12,
                "type": "erb",
              },
              ERBNode {
                "children": [],
                "closing_token": null,
                "content": "    
          
          ",
                "depth": 3,
                "end": 85,
                "id": 13,
                "kind": "text",
                "opening_token": null,
                "parent_id": 0,
                "start": 71,
                "type": "text",
              },
            ],
            "closing_token": Token {
              "content": "</div>",
              "end": 91,
              "kind": "close",
              "start": 85,
              "type": "html",
            },
            "content": "<div>",
            "depth": 0,
            "end": 5,
            "id": 0,
            "kind": "open",
            "opening_token": null,
            "parent_id": -1,
            "start": 0,
            "type": "html",
          },
        ],
        "closing_token": null,
        "depth": 0,
        "end": 90,
        "id": -1,
        "opening_token": null,
        "parent_id": -1,
        "start": 0,
        "type": "program",
      }
    `);
  });

  it("doesn't extract erb from html tag attributes", () => {
    const input = `<div class="<%= true ? 'test-true' : 'test-false' %>">Test</div>`;

    const tokens = new Lexer(input).lex();
    const out = new ERBAst(tokens, input);

    expect(out.program).toMatchInlineSnapshot(`
      ProgramNode {
        "children": [
          ERBNode {
            "children": [
              ERBNode {
                "children": [],
                "closing_token": null,
                "content": "Test",
                "depth": 1,
                "end": 58,
                "id": 1,
                "kind": "text",
                "opening_token": null,
                "parent_id": 0,
                "start": 54,
                "type": "text",
              },
            ],
            "closing_token": Token {
              "content": "</div>",
              "end": 64,
              "kind": "close",
              "start": 58,
              "type": "html",
            },
            "content": "<div class="<%= true ? 'test-true' : 'test-false' %>">",
            "depth": 0,
            "end": 54,
            "id": 0,
            "kind": "open",
            "opening_token": null,
            "parent_id": -1,
            "start": 0,
            "type": "html",
          },
        ],
        "closing_token": null,
        "depth": 0,
        "end": 63,
        "id": -1,
        "opening_token": null,
        "parent_id": -1,
        "start": 0,
        "type": "program",
      }
    `);
  });

  it("parses erb comments", () => {
    const input =
      "<%# This is a very long comment, that adds lot of value to the code %>";
    const tokens = new Lexer(input).lex();
    const out = new ERBAst(tokens, input);

    expect(out.program).toMatchInlineSnapshot(`
      ProgramNode {
        "children": [
          ERBNode {
            "children": [],
            "closing_token": null,
            "content": "<%# This is a very long comment, that adds lot of value to the code %>",
            "depth": 0,
            "end": 70,
            "id": 0,
            "kind": "comment",
            "opening_token": null,
            "parent_id": -1,
            "start": 0,
            "type": "erb",
          },
        ],
        "closing_token": null,
        "depth": 0,
        "end": 69,
        "id": -1,
        "opening_token": null,
        "parent_id": -1,
        "start": 0,
        "type": "program",
      }
    `);
  });
});
