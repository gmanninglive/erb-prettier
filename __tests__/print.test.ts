import { format } from "prettier";

describe("it", () => {
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

    console.log(output);
  });
});
