# exec

Execute shell commands with output capture, background support, and PTY for interactive programs.

## Actions

- **run** — Execute a shell command
  - `command` (required): The shell command to run
  - `workdir`: Working directory (defaults to current)
  - `env`: Environment variables as key=value pairs
  - `timeout`: Timeout in seconds
  - `pty`: Use pseudo-terminal for interactive programs
  - `background`: Run in background (returns session ID)
  - `yieldMs`: Milliseconds to wait before backgrounding

- **process** — Manage background processes
  - `action`: list | poll | log | write | kill
  - `sessionId`: Target session for actions
  - `data`: Text to write (for write action)
  - `keys`: Key tokens to send (for send-keys)

## Examples

```yaml
# Run a command
exec:
  command: "ls -la"

# Run with timeout
exec:
  command: "npm install"
  timeout: 120

# Background process
exec:
  command: "python server.py"
  background: true

# Interactive with PTY
exec:
  command: "vim file.txt"
  pty: true
```
