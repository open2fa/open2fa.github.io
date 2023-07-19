import { readFile, writeFile } from "node:fs/promises";

const elements = ["accounts-list", "add-account", "one-time-password"];

const appLayout = await readFile("app-layout.html", "utf-8");

const clearAndUpper = (text) => text.replace(/-/, "").toUpperCase();
const toPascalCase = (text) => text.replace(/(^\w|-\w)/g, clearAndUpper);

const templates = await Promise.all(
  elements.map((template) =>
    readFile(`${template}.html`, "utf-8").then((content) =>
      content.replaceAll("\n", "").replaceAll("\t", "")
    )
  )
);

const content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <link rel="icon" href="data:image/x-icon;base64,AA" />
  <title>Open 2FA</title>
  <link rel="stylesheet" href="root.css">
</head>
<body>
  <!-- App layout. -->
  ${appLayout.split("\n").join("\n  ")}
  <!-- CustomElement templates. -->
  ${templates.join("\n  ")}

  <!-- CustomElements definitions. -->
  <script type="module">
    ${elements
      .map(
        (element) =>
          `import { ${toPascalCase(element)} } from "./${element}.js";`
      )
      .join("\n    ")}

    ${elements
      .map(
        (element) =>
          `customElements.define("${element}", ${toPascalCase(element)});`
      )
      .join("\n    ")}
  </script>
</body>
</html>
`;

await writeFile("app.html", content, "utf-8");
