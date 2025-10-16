---
"ilib-lint-webos": patch
---

- Refactor the part that constructs tags to generate HTML output.
- Add section IDs so that the Jest's `toMatchSnapshot()` snapshots capture only the detailed descriptions section, excluding the total summary.
- Add test cases to verify the `format()` and `formatOutput()` methods of the HtmlFormatter class.