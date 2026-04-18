# subagents

Spawn and manage isolated sub-agent sessions for parallel work.

## Actions

- **spawn** — Create new sub-agent session
  - `task`: Instructions for the agent
  - `mode`: run (one-shot) | session (persistent)
  - `runtime`: subagent | acp
  - `agentId`: Agent type to use
  - `label`: Label for the session
  - `thread`: Thread-bound session
  - `timeoutSeconds`: Timeout for the task

- **list** — List active sub-agents
  - `limit`: Max results
  - `activeMinutes`: Filter by recent activity

- **send** — Send message to sub-agent
  - `sessionKey`: Target session
  - `message`: Message to send

- **steer** — Send steering message to sub-agent
  - `target`: Session to steer
  - `message`: Steering instructions

- **kill** — Terminate a sub-agent
  - `target`: Session to kill

## Examples

```yaml
# Spawn a worker
subagents:
  action: spawn
  task: "Research best practices for X"
  label: "research-worker"

# List agents
subagents:
  action: list

# Send message
subagents:
  action: send
  sessionKey: "agent:subagent:research-worker"
  message: "Status update?"
```

## Agent Types

- **heartbeat** — Periodic system checks
- **research** — Explore options, gather information
- **worker** — Execute tasks, process data
