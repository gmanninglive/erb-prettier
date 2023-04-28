import { Parser } from "../src/parser";

describe("Parser: Parses and prints e2e", () => {
  it("parses single line", () => {
    const input = `<%= Time.zone.now %>'`;

    const parser = new Parser(input);
    parser.parse();
    const out = parser.to_erb();

    expect(out).toEqual(input);
    expect(out).toMatchInlineSnapshot(`"<%= Time.zone.now %>'"`);
  });

  it("parses multi line", () => {
    const input = `<div>
    <% if true %>
      <%= render Component.new %>
    <% end %>    
    
    </div>`;

    const parser = new Parser(input);
    parser.parse();
    const out = parser.to_erb();

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

    const parser = new Parser(input);
    parser.parse();
    const out = parser.to_erb();

    expect(out).toEqual(input);
    expect(out).toMatchInlineSnapshot(
      `"<div class="<%= true ? 'test-true' : 'test-false' %>"></div>"`
    );
  });
});
