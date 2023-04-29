import { format } from "prettier";

describe("multiline", () => {
  it("does", () => {
    const input = `<div>
    <%= if true %>
      <%= render Component.new %>
    <% end %>    
    
    </div>`;

    const output = format(input, {
      parser: "erb",
      pluginSearchDirs: [".."],
      plugins: ["erb-prettier"],
    });

    expect(output).toMatchInlineSnapshot(`
      "<div>
        <%= if true %>
          <%= render Component.new %>
        <% end %>
      </div>
      "
    `);
  });

  it("single line", async () => {
    const input = `<%= render Component.new %>`;
    const output = format(input, {
      parser: "erb",
      pluginSearchDirs: [".."],
      plugins: ["erb-prettier"],
    });

    expect(output).toMatchInlineSnapshot(`
      "<%= render Component.new %>
      "
    `);
  });
});
