# browser

Control web browsers for automation, screenshots, and data extraction.

## Actions

- **open** — Open a URL in browser
  - `url`: URL to open
  - `profile`: Browser profile (chrome, openclaw)
  - `target`: sandbox | host | node

- **snapshot** — Capture page state (elements, text)
  - `targetId`: Tab to snapshot
  - `refs`: role | aria (reference type)

- **act** — Perform action on page
  - `kind`: click | type | press | hover | fill | evaluate
  - `ref`: Element reference from snapshot
  - `text`: Text to type (for type/fill)

- **screenshot** — Capture page image
  - `fullPage`: Capture full page
  - `type`: png | jpeg

## Examples

```yaml
# Open a page
browser:
  action: open
  url: "https://example.com"

# Take screenshot
browser:
  action: screenshot
  fullPage: true

# Click element
browser:
  action: act
  kind: click
  ref: "e12"
```
