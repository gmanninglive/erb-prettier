import { format } from "prettier";

describe("multiline", () => {
  xit("does", () => {
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

  xit("single line", async () => {
    const input = `<%= render Component.new %>`;

    const output = await format(input, {
      parser: "erb",
      pluginSearchDirs: [".."],
      plugins: ["erb-prettier"],
    });

    console.log(output);
  });
});
