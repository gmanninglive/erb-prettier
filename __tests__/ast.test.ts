import { Lexer } from "../src/lexer";
import { ERBAst } from "../src/lexer/ast";

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
            "node_id": 0,
            "opening_tag": null,
            "parent_id": -1,
            "token": Token {
              "content": "<%=",
              "end": 3,
              "kind": "self_closing",
              "start": 0,
              "type": "erb",
            },
          },
          ERBNode {
            "children": [],
            "node_id": 1,
            "opening_tag": null,
            "parent_id": -1,
            "token": Token {
              "content": " Time.zone.now ",
              "end": 18,
              "kind": "statement",
              "start": 3,
              "type": "erb",
            },
          },
          ERBNode {
            "children": [],
            "node_id": 2,
            "opening_tag": null,
            "parent_id": -1,
            "token": Token {
              "content": "%>",
              "end": 20,
              "kind": "close",
              "start": 18,
              "type": "erb",
            },
          },
        ],
        "node_id": -1,
        "opening_tag": null,
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
              [Circular],
              ERBNode {
                "children": [],
                "node_id": 1,
                "opening_tag": null,
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
                "children": [],
                "node_id": 5,
                "opening_tag": null,
                "parent_id": 0,
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
                "node_id": 6,
                "opening_tag": null,
                "parent_id": 0,
                "token": Token {
                  "content": "<%=",
                  "end": 33,
                  "kind": "self_closing",
                  "start": 30,
                  "type": "erb",
                },
              },
              ERBNode {
                "children": [],
                "node_id": 7,
                "opening_tag": null,
                "parent_id": 0,
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
                "node_id": 8,
                "opening_tag": null,
                "parent_id": 0,
                "token": Token {
                  "content": "%>",
                  "end": 57,
                  "kind": "close",
                  "start": 55,
                  "type": "erb",
                },
              },
            ],
            "node_id": 0,
            "opening_tag": null,
            "parent_id": -1,
            "token": Token {
              "content": "<div>",
              "end": 5,
              "kind": "open",
              "start": 0,
              "type": "html",
            },
          },
          ERBNode {
            "children": [],
            "node_id": 9,
            "opening_tag": null,
            "parent_id": -1,
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
            "node_id": 13,
            "opening_tag": null,
            "parent_id": -1,
            "token": Token {
              "content": "    
          
          ",
              "end": 85,
              "kind": "text",
              "start": 71,
              "type": "text",
            },
          },
          ERBNode {
            "children": [],
            "node_id": 14,
            "opening_tag": null,
            "parent_id": -1,
            "token": Token {
              "content": "</div>",
              "end": 91,
              "kind": "close",
              "start": 85,
              "type": "html",
            },
          },
        ],
        "node_id": -1,
        "opening_tag": null,
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
              [Circular],
              ERBNode {
                "children": [],
                "node_id": 1,
                "opening_tag": null,
                "parent_id": 0,
                "token": Token {
                  "content": "<%=",
                  "end": 15,
                  "kind": "self_closing",
                  "start": 12,
                  "type": "erb",
                },
              },
              ERBNode {
                "children": [],
                "node_id": 2,
                "opening_tag": null,
                "parent_id": 0,
                "token": Token {
                  "content": " true ? 'test-true' : 'test-false' ",
                  "end": 50,
                  "kind": "statement",
                  "start": 15,
                  "type": "erb",
                },
              },
              ERBNode {
                "children": [],
                "node_id": 3,
                "opening_tag": null,
                "parent_id": 0,
                "token": Token {
                  "content": "%>",
                  "end": 52,
                  "kind": "close",
                  "start": 50,
                  "type": "erb",
                },
              },
            ],
            "node_id": 0,
            "opening_tag": null,
            "parent_id": -1,
            "token": Token {
              "content": "<div class="",
              "end": 12,
              "kind": "open",
              "start": 0,
              "type": "html",
            },
          },
          ERBNode {
            "children": [],
            "node_id": 4,
            "opening_tag": null,
            "parent_id": -1,
            "token": Token {
              "content": "">Test",
              "end": 58,
              "kind": "text",
              "start": 52,
              "type": "text",
            },
          },
          ERBNode {
            "children": [],
            "node_id": 5,
            "opening_tag": null,
            "parent_id": -1,
            "token": Token {
              "content": "</div>",
              "end": 64,
              "kind": "close",
              "start": 58,
              "type": "html",
            },
          },
        ],
        "node_id": -1,
        "opening_tag": null,
        "parent_id": -1,
        "token": null,
      }
    `);
  });
});
