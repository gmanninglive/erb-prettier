import { Lexer } from "../src/parser/lexer";
import { ERBAst } from "../src/parser/ast";

describe("Ast", () => {
  it("parses single line", () => {
    const input = `<%= Time.zone.now %>`;

    const tokens = new Lexer(input).lex();
    const out = new ERBAst(tokens);
    expect(out.program).toMatchInlineSnapshot(`
      ERBNode {
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
            "depth": 0,
            "id": 1,
            "opening_token": Token {
              "content": "<%=",
              "end": 3,
              "kind": "self_closing",
              "start": 0,
              "type": "erb",
            },
            "parent_id": -1,
            "token": Token {
              "content": " Time.zone.now ",
              "end": 18,
              "kind": "statement",
              "start": 3,
              "type": "erb",
            },
          },
        ],
        "closing_token": null,
        "depth": 0,
        "id": -1,
        "opening_token": null,
        "parent_id": -1,
        "token": null,
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
    const out = new ERBAst(tokens);

    expect(out.program).toMatchInlineSnapshot(`
      ERBNode {
        "children": [
          ERBNode {
            "children": [
              ERBNode {
                "children": [],
                "closing_token": null,
                "depth": 1,
                "id": 1,
                "opening_token": null,
                "parent_id": 0,
                "token": Token {
                  "content": "
          ",
                  "end": 10,
                  "kind": "text",
                  "start": 5,
                  "type": "text",
                },
              },
              ERBNode {
                "children": [
                  ERBNode {
                    "children": [],
                    "closing_token": null,
                    "depth": 2,
                    "id": 5,
                    "opening_token": null,
                    "parent_id": 3,
                    "token": Token {
                      "content": "
            ",
                      "end": 30,
                      "kind": "text",
                      "start": 23,
                      "type": "text",
                    },
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
                    "depth": 2,
                    "id": 7,
                    "opening_token": Token {
                      "content": "<%=",
                      "end": 33,
                      "kind": "self_closing",
                      "start": 30,
                      "type": "erb",
                    },
                    "parent_id": 3,
                    "token": Token {
                      "content": " render Component.new ",
                      "end": 55,
                      "kind": "statement",
                      "start": 33,
                      "type": "erb",
                    },
                  },
                  ERBNode {
                    "children": [],
                    "closing_token": null,
                    "depth": 2,
                    "id": 9,
                    "opening_token": null,
                    "parent_id": 3,
                    "token": Token {
                      "content": "
          ",
                      "end": 62,
                      "kind": "text",
                      "start": 57,
                      "type": "text",
                    },
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
                    "depth": 2,
                    "id": 11,
                    "opening_token": Token {
                      "content": "<%",
                      "end": 64,
                      "kind": "open",
                      "start": 62,
                      "type": "erb",
                    },
                    "parent_id": 3,
                    "token": Token {
                      "content": " end ",
                      "end": 69,
                      "kind": "statement",
                      "start": 64,
                      "type": "erb",
                    },
                  },
                ],
                "closing_token": Token {
                  "content": "%>",
                  "end": 23,
                  "kind": "close",
                  "start": 21,
                  "type": "erb",
                },
                "depth": 1,
                "id": 3,
                "opening_token": Token {
                  "content": "<%",
                  "end": 12,
                  "kind": "open",
                  "start": 10,
                  "type": "erb",
                },
                "parent_id": 0,
                "token": Token {
                  "content": " if true ",
                  "end": 21,
                  "kind": "statement",
                  "start": 12,
                  "type": "erb",
                },
              },
              ERBNode {
                "children": [],
                "closing_token": null,
                "depth": 3,
                "id": 13,
                "opening_token": null,
                "parent_id": 0,
                "token": Token {
                  "content": "    
          
          ",
                  "end": 85,
                  "kind": "text",
                  "start": 71,
                  "type": "text",
                },
              },
            ],
            "closing_token": Token {
              "content": "</div>",
              "end": 91,
              "kind": "close",
              "start": 85,
              "type": "html",
            },
            "depth": 0,
            "id": 0,
            "opening_token": null,
            "parent_id": -1,
            "token": Token {
              "content": "<div>",
              "end": 5,
              "kind": "open",
              "start": 0,
              "type": "html",
            },
          },
        ],
        "closing_token": null,
        "depth": 0,
        "id": -1,
        "opening_token": null,
        "parent_id": -1,
        "token": null,
      }
    `);
  });

  it("doesn't extract erb from html tag attributes", () => {
    const input = `<div class="<%= true ? 'test-true' : 'test-false' %>">Test</div>`;

    const tokens = new Lexer(input).lex();
    const out = new ERBAst(tokens);

    expect(out.program).toMatchInlineSnapshot(`
      ERBNode {
        "children": [
          ERBNode {
            "children": [
              ERBNode {
                "children": [],
                "closing_token": null,
                "depth": 1,
                "id": 1,
                "opening_token": null,
                "parent_id": 0,
                "token": Token {
                  "content": "Test",
                  "end": 58,
                  "kind": "text",
                  "start": 54,
                  "type": "text",
                },
              },
            ],
            "closing_token": Token {
              "content": "</div>",
              "end": 64,
              "kind": "close",
              "start": 58,
              "type": "html",
            },
            "depth": 0,
            "id": 0,
            "opening_token": null,
            "parent_id": -1,
            "token": Token {
              "content": "<div class="<%= true ? 'test-true' : 'test-false' %>">",
              "end": 54,
              "kind": "open",
              "start": 0,
              "type": "html",
            },
          },
        ],
        "closing_token": null,
        "depth": 0,
        "id": -1,
        "opening_token": null,
        "parent_id": -1,
        "token": null,
      }
    `);
  });
});
