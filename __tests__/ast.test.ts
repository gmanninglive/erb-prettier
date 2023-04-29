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
                "parent_id": 0,
                "start": 64,
                "type": "erb",
              },
              ERBNode {
                "children": [],
                "closing_token": null,
                "content": "    
          
          ",
                "depth": 1,
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
    const input = `<%# <!-- /users/sign_in --> %>
    <% content_for :extra_tags do %>
    <meta name="robots" content="noindex, nofollow">
    <% end %>
    
    <%# WIP— Really important comment that will definetely be removed,
    once the work has been carried out %>
    
    <div class="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8">
        <div>
          <img class="w-auto h-12 mx-auto" src="/Logo-Black.svg" alt="Logo">
          <h2 class="mt-6 text-3xl font-extrabold text-center text-gray-900">Log in to your account</h2>
    
          <% if devise_mapping.registerable? && controller_name != 'registrations' %>
          <p class="mt-2 text-sm text-center text-gray-600">
            Or </p>
            <%= link_to 'Create Account', new_registration_path(resource_name), class: 'font-medium text-orange-primary hover:text-orange-secondary' %>
              
          <% end %>
        </div>
        <%= render 'new' %>
      </div>
    </div>
    `;
    const tokens = new Lexer(input).lex();
    const out = new ERBAst(tokens, input);

    expect(out.program).toMatchInlineSnapshot(`
      ProgramNode {
        "children": [
          ERBNode {
            "children": [],
            "closing_token": null,
            "content": "<%# <!-- /users/sign_in --> %>",
            "depth": 0,
            "end": 30,
            "id": 0,
            "kind": "comment",
            "opening_token": null,
            "parent_id": -1,
            "start": 0,
            "type": "erb",
          },
          ERBNode {
            "children": [],
            "closing_token": null,
            "content": "
          ",
            "depth": 0,
            "end": 35,
            "id": 1,
            "kind": "text",
            "opening_token": null,
            "parent_id": -1,
            "start": 30,
            "type": "text",
          },
          ERBNode {
            "children": [
              ERBNode {
                "children": [],
                "closing_token": null,
                "content": "
          ",
                "depth": 1,
                "end": 72,
                "id": 5,
                "kind": "text",
                "opening_token": null,
                "parent_id": 3,
                "start": 67,
                "type": "text",
              },
              ERBNode {
                "children": [],
                "closing_token": null,
                "content": "<meta name="robots" content="noindex, nofollow">",
                "depth": 1,
                "end": 120,
                "id": 6,
                "kind": "self_closing",
                "opening_token": null,
                "parent_id": 3,
                "start": 72,
                "type": "html",
              },
              ERBNode {
                "children": [],
                "closing_token": null,
                "content": "
          ",
                "depth": 1,
                "end": 125,
                "id": 7,
                "kind": "text",
                "opening_token": null,
                "parent_id": 3,
                "start": 120,
                "type": "text",
              },
            ],
            "closing_token": Token {
              "content": "%>",
              "end": 67,
              "kind": "close",
              "start": 65,
              "type": "erb",
            },
            "content": " content_for :extra_tags do ",
            "depth": 0,
            "end": 65,
            "id": 3,
            "kind": "statement",
            "opening_token": Token {
              "content": "<%",
              "end": 37,
              "kind": "open",
              "start": 35,
              "type": "erb",
            },
            "parent_id": -1,
            "start": 37,
            "type": "erb",
          },
          ERBNode {
            "children": [],
            "closing_token": Token {
              "content": "%>",
              "end": 134,
              "kind": "close",
              "start": 132,
              "type": "erb",
            },
            "content": " end ",
            "depth": 1,
            "end": 132,
            "id": 9,
            "kind": "statement",
            "opening_token": Token {
              "content": "<%",
              "end": 127,
              "kind": "open",
              "start": 125,
              "type": "erb",
            },
            "parent_id": -1,
            "start": 127,
            "type": "erb",
          },
          ERBNode {
            "children": [],
            "closing_token": null,
            "content": "
          
          ",
            "depth": 0,
            "end": 144,
            "id": 11,
            "kind": "text",
            "opening_token": null,
            "parent_id": -1,
            "start": 134,
            "type": "text",
          },
          ERBNode {
            "children": [],
            "closing_token": null,
            "content": "<%# WIP— Really important comment that will definetely be removed,
          once the work has been carried out %>",
            "depth": 0,
            "end": 252,
            "id": 12,
            "kind": "comment",
            "opening_token": null,
            "parent_id": -1,
            "start": 144,
            "type": "erb",
          },
          ERBNode {
            "children": [],
            "closing_token": null,
            "content": "
          
          ",
            "depth": 0,
            "end": 262,
            "id": 13,
            "kind": "text",
            "opening_token": null,
            "parent_id": -1,
            "start": 252,
            "type": "text",
          },
          ERBNode {
            "children": [
              ERBNode {
                "children": [],
                "closing_token": null,
                "content": "
            ",
                "depth": 1,
                "end": 353,
                "id": 15,
                "kind": "text",
                "opening_token": null,
                "parent_id": 14,
                "start": 346,
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
                    "end": 401,
                    "id": 17,
                    "kind": "text",
                    "opening_token": null,
                    "parent_id": 16,
                    "start": 392,
                    "type": "text",
                  },
                  ERBNode {
                    "children": [
                      ERBNode {
                        "children": [],
                        "closing_token": null,
                        "content": "
                ",
                        "depth": 3,
                        "end": 417,
                        "id": 19,
                        "kind": "text",
                        "opening_token": null,
                        "parent_id": 18,
                        "start": 406,
                        "type": "text",
                      },
                      ERBNode {
                        "children": [],
                        "closing_token": null,
                        "content": "<img class="w-auto h-12 mx-auto" src="/Logo-Black.svg" alt="Logo">",
                        "depth": 3,
                        "end": 483,
                        "id": 20,
                        "kind": "self_closing",
                        "opening_token": null,
                        "parent_id": 18,
                        "start": 417,
                        "type": "html",
                      },
                      ERBNode {
                        "children": [],
                        "closing_token": null,
                        "content": "
                ",
                        "depth": 3,
                        "end": 494,
                        "id": 21,
                        "kind": "text",
                        "opening_token": null,
                        "parent_id": 18,
                        "start": 483,
                        "type": "text",
                      },
                      ERBNode {
                        "children": [
                          ERBNode {
                            "children": [],
                            "closing_token": null,
                            "content": "Log in to your account",
                            "depth": 4,
                            "end": 583,
                            "id": 23,
                            "kind": "text",
                            "opening_token": null,
                            "parent_id": 22,
                            "start": 561,
                            "type": "text",
                          },
                        ],
                        "closing_token": Token {
                          "content": "</h2>",
                          "end": 588,
                          "kind": "close",
                          "start": 583,
                          "type": "html",
                        },
                        "content": "<h2 class="mt-6 text-3xl font-extrabold text-center text-gray-900">",
                        "depth": 3,
                        "end": 561,
                        "id": 22,
                        "kind": "open",
                        "opening_token": null,
                        "parent_id": 18,
                        "start": 494,
                        "type": "html",
                      },
                      ERBNode {
                        "children": [],
                        "closing_token": null,
                        "content": "
          
                ",
                        "depth": 3,
                        "end": 604,
                        "id": 25,
                        "kind": "text",
                        "opening_token": null,
                        "parent_id": 18,
                        "start": 588,
                        "type": "text",
                      },
                      ERBNode {
                        "children": [
                          ERBNode {
                            "children": [],
                            "closing_token": null,
                            "content": "
                ",
                            "depth": 4,
                            "end": 690,
                            "id": 29,
                            "kind": "text",
                            "opening_token": null,
                            "parent_id": 27,
                            "start": 679,
                            "type": "text",
                          },
                          ERBNode {
                            "children": [
                              ERBNode {
                                "children": [],
                                "closing_token": null,
                                "content": "
                  Or ",
                                "depth": 5,
                                "end": 756,
                                "id": 31,
                                "kind": "text",
                                "opening_token": null,
                                "parent_id": 30,
                                "start": 740,
                                "type": "text",
                              },
                            ],
                            "closing_token": Token {
                              "content": "</p>",
                              "end": 760,
                              "kind": "close",
                              "start": 756,
                              "type": "html",
                            },
                            "content": "<p class="mt-2 text-sm text-center text-gray-600">",
                            "depth": 4,
                            "end": 740,
                            "id": 30,
                            "kind": "open",
                            "opening_token": null,
                            "parent_id": 27,
                            "start": 690,
                            "type": "html",
                          },
                          ERBNode {
                            "children": [],
                            "closing_token": null,
                            "content": "
                  ",
                            "depth": 4,
                            "end": 773,
                            "id": 33,
                            "kind": "text",
                            "opening_token": null,
                            "parent_id": 27,
                            "start": 760,
                            "type": "text",
                          },
                          ERBNode {
                            "children": [],
                            "closing_token": Token {
                              "content": "%>",
                              "end": 912,
                              "kind": "close",
                              "start": 910,
                              "type": "erb",
                            },
                            "content": " link_to 'Create Account', new_registration_path(resource_name), class: 'font-medium text-orange-primary hover:text-orange-secondary' ",
                            "depth": 4,
                            "end": 910,
                            "id": 35,
                            "kind": "statement",
                            "opening_token": Token {
                              "content": "<%=",
                              "end": 776,
                              "kind": "self_closing",
                              "start": 773,
                              "type": "erb",
                            },
                            "parent_id": 27,
                            "start": 776,
                            "type": "erb",
                          },
                          ERBNode {
                            "children": [],
                            "closing_token": null,
                            "content": "
                    
                ",
                            "depth": 4,
                            "end": 938,
                            "id": 37,
                            "kind": "text",
                            "opening_token": null,
                            "parent_id": 27,
                            "start": 912,
                            "type": "text",
                          },
                        ],
                        "closing_token": Token {
                          "content": "%>",
                          "end": 679,
                          "kind": "close",
                          "start": 677,
                          "type": "erb",
                        },
                        "content": " if devise_mapping.registerable? && controller_name != 'registrations' ",
                        "depth": 3,
                        "end": 677,
                        "id": 27,
                        "kind": "statement",
                        "opening_token": Token {
                          "content": "<%",
                          "end": 606,
                          "kind": "open",
                          "start": 604,
                          "type": "erb",
                        },
                        "parent_id": 18,
                        "start": 606,
                        "type": "erb",
                      },
                      ERBNode {
                        "children": [],
                        "closing_token": Token {
                          "content": "%>",
                          "end": 947,
                          "kind": "close",
                          "start": 945,
                          "type": "erb",
                        },
                        "content": " end ",
                        "depth": 4,
                        "end": 945,
                        "id": 39,
                        "kind": "statement",
                        "opening_token": Token {
                          "content": "<%",
                          "end": 940,
                          "kind": "open",
                          "start": 938,
                          "type": "erb",
                        },
                        "parent_id": 18,
                        "start": 940,
                        "type": "erb",
                      },
                      ERBNode {
                        "children": [],
                        "closing_token": null,
                        "content": "
              ",
                        "depth": 3,
                        "end": 956,
                        "id": 41,
                        "kind": "text",
                        "opening_token": null,
                        "parent_id": 18,
                        "start": 947,
                        "type": "text",
                      },
                    ],
                    "closing_token": Token {
                      "content": "</div>",
                      "end": 962,
                      "kind": "close",
                      "start": 956,
                      "type": "html",
                    },
                    "content": "<div>",
                    "depth": 2,
                    "end": 406,
                    "id": 18,
                    "kind": "open",
                    "opening_token": null,
                    "parent_id": 16,
                    "start": 401,
                    "type": "html",
                  },
                  ERBNode {
                    "children": [],
                    "closing_token": null,
                    "content": "
              ",
                    "depth": 2,
                    "end": 971,
                    "id": 43,
                    "kind": "text",
                    "opening_token": null,
                    "parent_id": 16,
                    "start": 962,
                    "type": "text",
                  },
                  ERBNode {
                    "children": [],
                    "closing_token": Token {
                      "content": "%>",
                      "end": 990,
                      "kind": "close",
                      "start": 988,
                      "type": "erb",
                    },
                    "content": " render 'new' ",
                    "depth": 2,
                    "end": 988,
                    "id": 45,
                    "kind": "statement",
                    "opening_token": Token {
                      "content": "<%=",
                      "end": 974,
                      "kind": "self_closing",
                      "start": 971,
                      "type": "erb",
                    },
                    "parent_id": 16,
                    "start": 974,
                    "type": "erb",
                  },
                  ERBNode {
                    "children": [],
                    "closing_token": null,
                    "content": "
            ",
                    "depth": 2,
                    "end": 997,
                    "id": 47,
                    "kind": "text",
                    "opening_token": null,
                    "parent_id": 16,
                    "start": 990,
                    "type": "text",
                  },
                ],
                "closing_token": Token {
                  "content": "</div>",
                  "end": 1003,
                  "kind": "close",
                  "start": 997,
                  "type": "html",
                },
                "content": "<div class="w-full max-w-md space-y-8">",
                "depth": 1,
                "end": 392,
                "id": 16,
                "kind": "open",
                "opening_token": null,
                "parent_id": 14,
                "start": 353,
                "type": "html",
              },
              ERBNode {
                "children": [],
                "closing_token": null,
                "content": "
          ",
                "depth": 1,
                "end": 1008,
                "id": 49,
                "kind": "text",
                "opening_token": null,
                "parent_id": 14,
                "start": 1003,
                "type": "text",
              },
            ],
            "closing_token": Token {
              "content": "</div>",
              "end": 1014,
              "kind": "close",
              "start": 1008,
              "type": "html",
            },
            "content": "<div class="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">",
            "depth": 0,
            "end": 346,
            "id": 14,
            "kind": "open",
            "opening_token": null,
            "parent_id": -1,
            "start": 262,
            "type": "html",
          },
          ERBNode {
            "children": [],
            "closing_token": null,
            "content": "
          ",
            "depth": 0,
            "end": 1019,
            "id": 51,
            "kind": "text",
            "opening_token": null,
            "parent_id": -1,
            "start": 1014,
            "type": "text",
          },
        ],
        "closing_token": null,
        "depth": 0,
        "end": 1018,
        "id": -1,
        "opening_token": null,
        "parent_id": -1,
        "start": 0,
        "type": "program",
      }
    `);
  });
});
