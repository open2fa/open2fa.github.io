import { readdir, readFile, writeFile } from "node:fs/promises"
import { basename, extname, join } from "node:path"

const htmlElementsDirFiles = await readdir("html-elements")
const elements = htmlElementsDirFiles
  .filter((filename) => extname(filename) === ".js")
  .map((filename) => basename(filename, ".js"))

const clearAndUpper = (text) => text.replace(/-/, "").toUpperCase()
const toPascalCase = (text) => text.replace(/(^\w|-\w)/g, clearAndUpper)

const templates = await Promise.all(
  elements.map((template) =>
    readFile(join("html-elements", `${template}.html`), "utf-8").then((content) =>
      content.replaceAll("\n", "").replaceAll("\t", "")
    )
  )
)

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
  <!-- CustomElement templates. -->
  ${templates.join("\n  ")}

  <!-- CustomElements definitions. -->
  <script type="module">
    ${elements
      .map((element) => `import { ${toPascalCase(element)} } from "./html-elements/${element}.js";`)
      .join("\n    ")}

    ${elements.map((element) => `customElements.define("${element}", ${toPascalCase(element)});`).join("\n    ")}
  </script>

  <app-layout></app-layout>
</body>
</html>
`

await writeFile("app.html", content, "utf-8")
