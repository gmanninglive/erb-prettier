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
            "closed_by": null,
            "content": " Time.zone.now ",
            "depth": 0,
            "end": 18,
            "expression_end": Token {
              "content": "%>",
              "end": 20,
              "kind": "erb_close",
              "start": 18,
              "type": "erb",
            },
            "expression_start": Token {
              "content": "<%=",
              "end": 3,
              "kind": "erb_start",
              "start": 0,
              "type": "erb",
            },
            "has_end_tag": false,
            "id": 1,
            "kind": "self_closing",
            "parent_id": -1,
            "start": 3,
            "type": "erb",
          },
        ],
        "closed_by": null,
        "depth": 0,
        "end": 19,
        "expression_end": null,
        "expression_start": null,
        "has_end_tag": false,
        "id": -1,
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
                "closed_by": null,
                "content": "
          ",
                "depth": 1,
                "end": 10,
                "expression_end": null,
                "expression_start": null,
                "has_end_tag": false,
                "id": 1,
                "kind": "text",
                "parent_id": 0,
                "start": 5,
                "type": "text",
              },
              ERBNode {
                "children": [
                  ERBNode {
                    "children": [],
                    "closed_by": null,
                    "content": "
            ",
                    "depth": 2,
                    "end": 30,
                    "expression_end": null,
                    "expression_start": null,
                    "has_end_tag": false,
                    "id": 5,
                    "kind": "text",
                    "parent_id": 3,
                    "start": 23,
                    "type": "text",
                  },
                  ERBNode {
                    "children": [],
                    "closed_by": null,
                    "content": " render Component.new ",
                    "depth": 2,
                    "end": 55,
                    "expression_end": Token {
                      "content": "%>",
                      "end": 57,
                      "kind": "erb_close",
                      "start": 55,
                      "type": "erb",
                    },
                    "expression_start": Token {
                      "content": "<%=",
                      "end": 33,
                      "kind": "erb_start",
                      "start": 30,
                      "type": "erb",
                    },
                    "has_end_tag": false,
                    "id": 7,
                    "kind": "self_closing",
                    "parent_id": 3,
                    "start": 33,
                    "type": "erb",
                  },
                  ERBNode {
                    "children": [],
                    "closed_by": null,
                    "content": "
          ",
                    "depth": 2,
                    "end": 62,
                    "expression_end": null,
                    "expression_start": null,
                    "has_end_tag": false,
                    "id": 9,
                    "kind": "text",
                    "parent_id": 3,
                    "start": 57,
                    "type": "text",
                  },
                ],
                "closed_by": ERBNode {
                  "children": [],
                  "closed_by": null,
                  "content": " end ",
                  "depth": 2,
                  "end": 69,
                  "expression_end": Token {
                    "content": "%>",
                    "end": 71,
                    "kind": "erb_close",
                    "start": 69,
                    "type": "erb",
                  },
                  "expression_start": Token {
                    "content": "<%",
                    "end": 64,
                    "kind": "erb_start",
                    "start": 62,
                    "type": "erb",
                  },
                  "has_end_tag": false,
                  "id": 11,
                  "kind": "parent_close",
                  "parent_id": 3,
                  "start": 64,
                  "type": "erb",
                },
                "content": " if true ",
                "depth": 1,
                "end": 21,
                "expression_end": Token {
                  "content": "%>",
                  "end": 23,
                  "kind": "erb_close",
                  "start": 21,
                  "type": "erb",
                },
                "expression_start": Token {
                  "content": "<%",
                  "end": 12,
                  "kind": "erb_start",
                  "start": 10,
                  "type": "erb",
                },
                "has_end_tag": false,
                "id": 3,
                "kind": "parent",
                "parent_id": 0,
                "start": 12,
                "type": "erb",
              },
              ERBNode {
                "children": [],
                "closed_by": null,
                "content": "    
          
          ",
                "depth": 1,
                "end": 85,
                "expression_end": null,
                "expression_start": null,
                "has_end_tag": false,
                "id": 13,
                "kind": "text",
                "parent_id": 0,
                "start": 71,
                "type": "text",
              },
            ],
            "closed_by": ERBNode {
              "children": [],
              "closed_by": null,
              "content": "</div>",
              "depth": 1,
              "end": 91,
              "expression_end": null,
              "expression_start": null,
              "has_end_tag": false,
              "id": 14,
              "kind": "parent_close",
              "parent_id": 0,
              "start": 85,
              "type": "html",
            },
            "content": "<div>",
            "depth": 0,
            "end": 5,
            "expression_end": null,
            "expression_start": null,
            "has_end_tag": false,
            "id": 0,
            "kind": "parent",
            "parent_id": -1,
            "start": 0,
            "type": "html",
          },
        ],
        "closed_by": null,
        "depth": 0,
        "end": 90,
        "expression_end": null,
        "expression_start": null,
        "has_end_tag": false,
        "id": -1,
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
                "closed_by": null,
                "content": "Test",
                "depth": 1,
                "end": 58,
                "expression_end": null,
                "expression_start": null,
                "has_end_tag": false,
                "id": 1,
                "kind": "text",
                "parent_id": 0,
                "start": 54,
                "type": "text",
              },
            ],
            "closed_by": ERBNode {
              "children": [],
              "closed_by": null,
              "content": "</div>",
              "depth": 1,
              "end": 64,
              "expression_end": null,
              "expression_start": null,
              "has_end_tag": false,
              "id": 2,
              "kind": "parent_close",
              "parent_id": 0,
              "start": 58,
              "type": "html",
            },
            "content": "<div class="<%= true ? 'test-true' : 'test-false' %>">",
            "depth": 0,
            "end": 54,
            "expression_end": null,
            "expression_start": null,
            "has_end_tag": false,
            "id": 0,
            "kind": "parent",
            "parent_id": -1,
            "start": 0,
            "type": "html",
          },
        ],
        "closed_by": null,
        "depth": 0,
        "end": 63,
        "expression_end": null,
        "expression_start": null,
        "has_end_tag": false,
        "id": -1,
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
            "closed_by": null,
            "content": "<%# <!-- /users/sign_in --> %>",
            "depth": 0,
            "end": 30,
            "expression_end": null,
            "expression_start": null,
            "has_end_tag": false,
            "id": 0,
            "kind": "comment",
            "parent_id": -1,
            "start": 0,
            "type": "erb",
          },
          ERBNode {
            "children": [],
            "closed_by": null,
            "content": "
          ",
            "depth": 0,
            "end": 35,
            "expression_end": null,
            "expression_start": null,
            "has_end_tag": false,
            "id": 1,
            "kind": "text",
            "parent_id": -1,
            "start": 30,
            "type": "text",
          },
          ERBNode {
            "children": [
              ERBNode {
                "children": [],
                "closed_by": null,
                "content": "
          ",
                "depth": 1,
                "end": 72,
                "expression_end": null,
                "expression_start": null,
                "has_end_tag": false,
                "id": 5,
                "kind": "text",
                "parent_id": 3,
                "start": 67,
                "type": "text",
              },
              ERBNode {
                "children": [],
                "closed_by": null,
                "content": "<meta name="robots" content="noindex, nofollow">",
                "depth": 1,
                "end": 120,
                "expression_end": null,
                "expression_start": null,
                "has_end_tag": false,
                "id": 6,
                "kind": "self_closing",
                "parent_id": 3,
                "start": 72,
                "type": "html",
              },
              ERBNode {
                "children": [],
                "closed_by": null,
                "content": "
          ",
                "depth": 1,
                "end": 125,
                "expression_end": null,
                "expression_start": null,
                "has_end_tag": false,
                "id": 7,
                "kind": "text",
                "parent_id": 3,
                "start": 120,
                "type": "text",
              },
            ],
            "closed_by": ERBNode {
              "children": [],
              "closed_by": null,
              "content": " end ",
              "depth": 1,
              "end": 132,
              "expression_end": Token {
                "content": "%>",
                "end": 134,
                "kind": "erb_close",
                "start": 132,
                "type": "erb",
              },
              "expression_start": Token {
                "content": "<%",
                "end": 127,
                "kind": "erb_start",
                "start": 125,
                "type": "erb",
              },
              "has_end_tag": false,
              "id": 9,
              "kind": "parent_close",
              "parent_id": 3,
              "start": 127,
              "type": "erb",
            },
            "content": " content_for :extra_tags do ",
            "depth": 0,
            "end": 65,
            "expression_end": Token {
              "content": "%>",
              "end": 67,
              "kind": "erb_close",
              "start": 65,
              "type": "erb",
            },
            "expression_start": Token {
              "content": "<%",
              "end": 37,
              "kind": "erb_start",
              "start": 35,
              "type": "erb",
            },
            "has_end_tag": false,
            "id": 3,
            "kind": "parent",
            "parent_id": -1,
            "start": 37,
            "type": "erb",
          },
          ERBNode {
            "children": [],
            "closed_by": null,
            "content": "
          
          ",
            "depth": 0,
            "end": 144,
            "expression_end": null,
            "expression_start": null,
            "has_end_tag": false,
            "id": 11,
            "kind": "text",
            "parent_id": -1,
            "start": 134,
            "type": "text",
          },
          ERBNode {
            "children": [],
            "closed_by": null,
            "content": "<%# WIP— Really important comment that will definetely be removed,
          once the work has been carried out %>",
            "depth": 0,
            "end": 252,
            "expression_end": null,
            "expression_start": null,
            "has_end_tag": false,
            "id": 12,
            "kind": "comment",
            "parent_id": -1,
            "start": 144,
            "type": "erb",
          },
          ERBNode {
            "children": [],
            "closed_by": null,
            "content": "
          
          ",
            "depth": 0,
            "end": 262,
            "expression_end": null,
            "expression_start": null,
            "has_end_tag": false,
            "id": 13,
            "kind": "text",
            "parent_id": -1,
            "start": 252,
            "type": "text",
          },
          ERBNode {
            "children": [
              ERBNode {
                "children": [],
                "closed_by": null,
                "content": "
            ",
                "depth": 1,
                "end": 353,
                "expression_end": null,
                "expression_start": null,
                "has_end_tag": false,
                "id": 15,
                "kind": "text",
                "parent_id": 14,
                "start": 346,
                "type": "text",
              },
              ERBNode {
                "children": [
                  ERBNode {
                    "children": [],
                    "closed_by": null,
                    "content": "
              ",
                    "depth": 2,
                    "end": 401,
                    "expression_end": null,
                    "expression_start": null,
                    "has_end_tag": false,
                    "id": 17,
                    "kind": "text",
                    "parent_id": 16,
                    "start": 392,
                    "type": "text",
                  },
                  ERBNode {
                    "children": [
                      ERBNode {
                        "children": [],
                        "closed_by": null,
                        "content": "
                ",
                        "depth": 3,
                        "end": 417,
                        "expression_end": null,
                        "expression_start": null,
                        "has_end_tag": false,
                        "id": 19,
                        "kind": "text",
                        "parent_id": 18,
                        "start": 406,
                        "type": "text",
                      },
                      ERBNode {
                        "children": [],
                        "closed_by": null,
                        "content": "<img class="w-auto h-12 mx-auto" src="/Logo-Black.svg" alt="Logo">",
                        "depth": 3,
                        "end": 483,
                        "expression_end": null,
                        "expression_start": null,
                        "has_end_tag": false,
                        "id": 20,
                        "kind": "self_closing",
                        "parent_id": 18,
                        "start": 417,
                        "type": "html",
                      },
                      ERBNode {
                        "children": [],
                        "closed_by": null,
                        "content": "
                ",
                        "depth": 3,
                        "end": 494,
                        "expression_end": null,
                        "expression_start": null,
                        "has_end_tag": false,
                        "id": 21,
                        "kind": "text",
                        "parent_id": 18,
                        "start": 483,
                        "type": "text",
                      },
                      ERBNode {
                        "children": [
                          ERBNode {
                            "children": [],
                            "closed_by": null,
                            "content": "Log in to your account",
                            "depth": 4,
                            "end": 583,
                            "expression_end": null,
                            "expression_start": null,
                            "has_end_tag": false,
                            "id": 23,
                            "kind": "text",
                            "parent_id": 22,
                            "start": 561,
                            "type": "text",
                          },
                        ],
                        "closed_by": ERBNode {
                          "children": [],
                          "closed_by": null,
                          "content": "</h2>",
                          "depth": 4,
                          "end": 588,
                          "expression_end": null,
                          "expression_start": null,
                          "has_end_tag": false,
                          "id": 24,
                          "kind": "parent_close",
                          "parent_id": 22,
                          "start": 583,
                          "type": "html",
                        },
                        "content": "<h2 class="mt-6 text-3xl font-extrabold text-center text-gray-900">",
                        "depth": 3,
                        "end": 561,
                        "expression_end": null,
                        "expression_start": null,
                        "has_end_tag": false,
                        "id": 22,
                        "kind": "parent",
                        "parent_id": 18,
                        "start": 494,
                        "type": "html",
                      },
                      ERBNode {
                        "children": [],
                        "closed_by": null,
                        "content": "
          
                ",
                        "depth": 3,
                        "end": 604,
                        "expression_end": null,
                        "expression_start": null,
                        "has_end_tag": false,
                        "id": 25,
                        "kind": "text",
                        "parent_id": 18,
                        "start": 588,
                        "type": "text",
                      },
                      ERBNode {
                        "children": [
                          ERBNode {
                            "children": [],
                            "closed_by": null,
                            "content": "
                ",
                            "depth": 4,
                            "end": 690,
                            "expression_end": null,
                            "expression_start": null,
                            "has_end_tag": false,
                            "id": 29,
                            "kind": "text",
                            "parent_id": 27,
                            "start": 679,
                            "type": "text",
                          },
                          ERBNode {
                            "children": [
                              ERBNode {
                                "children": [],
                                "closed_by": null,
                                "content": "
                  Or ",
                                "depth": 5,
                                "end": 756,
                                "expression_end": null,
                                "expression_start": null,
                                "has_end_tag": false,
                                "id": 31,
                                "kind": "text",
                                "parent_id": 30,
                                "start": 740,
                                "type": "text",
                              },
                            ],
                            "closed_by": ERBNode {
                              "children": [],
                              "closed_by": null,
                              "content": "</p>",
                              "depth": 5,
                              "end": 760,
                              "expression_end": null,
                              "expression_start": null,
                              "has_end_tag": false,
                              "id": 32,
                              "kind": "parent_close",
                              "parent_id": 30,
                              "start": 756,
                              "type": "html",
                            },
                            "content": "<p class="mt-2 text-sm text-center text-gray-600">",
                            "depth": 4,
                            "end": 740,
                            "expression_end": null,
                            "expression_start": null,
                            "has_end_tag": false,
                            "id": 30,
                            "kind": "parent",
                            "parent_id": 27,
                            "start": 690,
                            "type": "html",
                          },
                          ERBNode {
                            "children": [],
                            "closed_by": null,
                            "content": "
                  ",
                            "depth": 4,
                            "end": 773,
                            "expression_end": null,
                            "expression_start": null,
                            "has_end_tag": false,
                            "id": 33,
                            "kind": "text",
                            "parent_id": 27,
                            "start": 760,
                            "type": "text",
                          },
                          ERBNode {
                            "children": [],
                            "closed_by": null,
                            "content": " link_to 'Create Account', new_registration_path(resource_name), class: 'font-medium text-orange-primary hover:text-orange-secondary' ",
                            "depth": 4,
                            "end": 910,
                            "expression_end": Token {
                              "content": "%>",
                              "end": 912,
                              "kind": "erb_close",
                              "start": 910,
                              "type": "erb",
                            },
                            "expression_start": Token {
                              "content": "<%=",
                              "end": 776,
                              "kind": "erb_start",
                              "start": 773,
                              "type": "erb",
                            },
                            "has_end_tag": false,
                            "id": 35,
                            "kind": "self_closing",
                            "parent_id": 27,
                            "start": 776,
                            "type": "erb",
                          },
                          ERBNode {
                            "children": [],
                            "closed_by": null,
                            "content": "
                    
                ",
                            "depth": 4,
                            "end": 938,
                            "expression_end": null,
                            "expression_start": null,
                            "has_end_tag": false,
                            "id": 37,
                            "kind": "text",
                            "parent_id": 27,
                            "start": 912,
                            "type": "text",
                          },
                        ],
                        "closed_by": ERBNode {
                          "children": [],
                          "closed_by": null,
                          "content": " end ",
                          "depth": 4,
                          "end": 945,
                          "expression_end": Token {
                            "content": "%>",
                            "end": 947,
                            "kind": "erb_close",
                            "start": 945,
                            "type": "erb",
                          },
                          "expression_start": Token {
                            "content": "<%",
                            "end": 940,
                            "kind": "erb_start",
                            "start": 938,
                            "type": "erb",
                          },
                          "has_end_tag": false,
                          "id": 39,
                          "kind": "parent_close",
                          "parent_id": 27,
                          "start": 940,
                          "type": "erb",
                        },
                        "content": " if devise_mapping.registerable? && controller_name != 'registrations' ",
                        "depth": 3,
                        "end": 677,
                        "expression_end": Token {
                          "content": "%>",
                          "end": 679,
                          "kind": "erb_close",
                          "start": 677,
                          "type": "erb",
                        },
                        "expression_start": Token {
                          "content": "<%",
                          "end": 606,
                          "kind": "erb_start",
                          "start": 604,
                          "type": "erb",
                        },
                        "has_end_tag": false,
                        "id": 27,
                        "kind": "parent",
                        "parent_id": 18,
                        "start": 606,
                        "type": "erb",
                      },
                      ERBNode {
                        "children": [],
                        "closed_by": null,
                        "content": "
              ",
                        "depth": 3,
                        "end": 956,
                        "expression_end": null,
                        "expression_start": null,
                        "has_end_tag": false,
                        "id": 41,
                        "kind": "text",
                        "parent_id": 18,
                        "start": 947,
                        "type": "text",
                      },
                    ],
                    "closed_by": ERBNode {
                      "children": [],
                      "closed_by": null,
                      "content": "</div>",
                      "depth": 3,
                      "end": 962,
                      "expression_end": null,
                      "expression_start": null,
                      "has_end_tag": false,
                      "id": 42,
                      "kind": "parent_close",
                      "parent_id": 18,
                      "start": 956,
                      "type": "html",
                    },
                    "content": "<div>",
                    "depth": 2,
                    "end": 406,
                    "expression_end": null,
                    "expression_start": null,
                    "has_end_tag": false,
                    "id": 18,
                    "kind": "parent",
                    "parent_id": 16,
                    "start": 401,
                    "type": "html",
                  },
                  ERBNode {
                    "children": [],
                    "closed_by": null,
                    "content": "
              ",
                    "depth": 2,
                    "end": 971,
                    "expression_end": null,
                    "expression_start": null,
                    "has_end_tag": false,
                    "id": 43,
                    "kind": "text",
                    "parent_id": 16,
                    "start": 962,
                    "type": "text",
                  },
                  ERBNode {
                    "children": [],
                    "closed_by": null,
                    "content": " render 'new' ",
                    "depth": 2,
                    "end": 988,
                    "expression_end": Token {
                      "content": "%>",
                      "end": 990,
                      "kind": "erb_close",
                      "start": 988,
                      "type": "erb",
                    },
                    "expression_start": Token {
                      "content": "<%=",
                      "end": 974,
                      "kind": "erb_start",
                      "start": 971,
                      "type": "erb",
                    },
                    "has_end_tag": false,
                    "id": 45,
                    "kind": "self_closing",
                    "parent_id": 16,
                    "start": 974,
                    "type": "erb",
                  },
                  ERBNode {
                    "children": [],
                    "closed_by": null,
                    "content": "
            ",
                    "depth": 2,
                    "end": 997,
                    "expression_end": null,
                    "expression_start": null,
                    "has_end_tag": false,
                    "id": 47,
                    "kind": "text",
                    "parent_id": 16,
                    "start": 990,
                    "type": "text",
                  },
                ],
                "closed_by": ERBNode {
                  "children": [],
                  "closed_by": null,
                  "content": "</div>",
                  "depth": 2,
                  "end": 1003,
                  "expression_end": null,
                  "expression_start": null,
                  "has_end_tag": false,
                  "id": 48,
                  "kind": "parent_close",
                  "parent_id": 16,
                  "start": 997,
                  "type": "html",
                },
                "content": "<div class="w-full max-w-md space-y-8">",
                "depth": 1,
                "end": 392,
                "expression_end": null,
                "expression_start": null,
                "has_end_tag": false,
                "id": 16,
                "kind": "parent",
                "parent_id": 14,
                "start": 353,
                "type": "html",
              },
              ERBNode {
                "children": [],
                "closed_by": null,
                "content": "
          ",
                "depth": 1,
                "end": 1008,
                "expression_end": null,
                "expression_start": null,
                "has_end_tag": false,
                "id": 49,
                "kind": "text",
                "parent_id": 14,
                "start": 1003,
                "type": "text",
              },
            ],
            "closed_by": ERBNode {
              "children": [],
              "closed_by": null,
              "content": "</div>",
              "depth": 1,
              "end": 1014,
              "expression_end": null,
              "expression_start": null,
              "has_end_tag": false,
              "id": 50,
              "kind": "parent_close",
              "parent_id": 14,
              "start": 1008,
              "type": "html",
            },
            "content": "<div class="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">",
            "depth": 0,
            "end": 346,
            "expression_end": null,
            "expression_start": null,
            "has_end_tag": false,
            "id": 14,
            "kind": "parent",
            "parent_id": -1,
            "start": 262,
            "type": "html",
          },
          ERBNode {
            "children": [],
            "closed_by": null,
            "content": "
          ",
            "depth": 0,
            "end": 1019,
            "expression_end": null,
            "expression_start": null,
            "has_end_tag": false,
            "id": 51,
            "kind": "text",
            "parent_id": -1,
            "start": 1014,
            "type": "text",
          },
        ],
        "closed_by": null,
        "depth": 0,
        "end": 1018,
        "expression_end": null,
        "expression_start": null,
        "has_end_tag": false,
        "id": -1,
        "parent_id": -1,
        "start": 0,
        "type": "program",
      }
    `);
  });
});
