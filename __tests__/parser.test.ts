import { Parser, print_to_erb } from "../src/parser";

describe("Parser: Parses and prints e2e", () => {
  it("parses single line", () => {
    const input = `<%= Time.zone.now %>'`;

    const ast = new Parser(input).parse();
    const out = print_to_erb(ast);

    expect(out).toEqual(input);
    expect(out).toMatchInlineSnapshot(`"<%= Time.zone.now %>'"`);
  });

  it("parses multi line", () => {
    const input = `<div>
    <% if true %>
      <%= render Component.new %>
    <% end %>    
    
    </div>`;

    const ast = new Parser(input).parse();
    const out = print_to_erb(ast);

    expect(out).toEqual(input);
    expect(out).toMatchInlineSnapshot(`
      "<div>
          <% if true %>
            <%= render Component.new %>
          <% end %>    
          
          </div>"
    `);
  });

  it("parses erb ignoring inline attribute", () => {
    const input = `<div class="<%= true ? 'test-true' : 'test-false' %>"></div>`;

    const ast = new Parser(input).parse();
    const out = print_to_erb(ast);

    expect(out).toEqual(input);
    expect(out).toMatchInlineSnapshot(
      `"<div class="<%= true ? 'test-true' : 'test-false' %>"></div>"`
    );
  });

  it("parses erb comments", () => {
    const input = `<div>
      <%# This is a very long comment, that adds lot of value to the code %>
      </div>`;

    const ast = new Parser(input).parse();
    const out = print_to_erb(ast);

    expect(out).toEqual(input);
    expect(out).toMatchInlineSnapshot(`
      "<div>
            <%# This is a very long comment, that adds lot of value to the code %>
            </div>"
    `);
  });
});
