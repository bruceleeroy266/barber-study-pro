# filesystem

File and directory operations.

## Actions

- **read** — Read file contents
  - `path`: File path
  - `limit`: Max lines to read
  - `offset`: Line number to start from

- **write** — Write content to file (creates if missing, overwrites if exists)
  - `path`: File path
  - `content`: Content to write

- **edit** — Precise text replacement (must match exactly)
  - `path`: File path
  - `old_string`: Exact text to find
  - `new_string`: Replacement text

- **list** — List directory contents
  - `path`: Directory path

- **delete** — Delete file or directory
  - `path`: Path to delete

## Examples

```yaml
# Read a file
filesystem:
  action: read
  path: "config.json"

# Write a file
filesystem:
  action: write
  path: "notes.txt"
  content: "Hello world"

# Edit a file
filesystem:
  action: edit
  path: "config.json"
  old_string: '"port": 3000'
  new_string: '"port": 8080'
```
