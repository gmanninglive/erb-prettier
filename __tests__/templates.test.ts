import fs from "fs";
import { format } from "prettier";

describe("e2e", () => {
  it("formats template files", () => {
    const root = "__tests__/templates";
    const paths = fs.readdirSync(root);

    paths
      .filter((p) => !p.includes("prettier"))
      .forEach((path) => {
        const input = fs.readFileSync(root.concat("/", path)).toString();

        const output = format(input, {
          parser: "erb",
          pluginSearchDirs: [".."],
          plugins: ["erb-prettier"],
        });

        expect(output).toMatchSnapshot(path);
        fs.writeFileSync(
          [
            "__tests__",
            "__snapshots__",
            path.replace("html.erb", "prettier.html.erb"),
          ].join("/"),
          output
        );
      });
  });
});
