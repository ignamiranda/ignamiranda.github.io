# Durable Agent Briefs

An agent brief is a self-contained comment or document that lets an AFK agent (or human) pick up an issue and run with it without needing the original conversation.

## Format

```
## Agent Brief: <title>

### Context
What's broken or wanted. Include root cause if known.

### Acceptance Criteria
- Bullet list of observable outcomes.

### Implementation Notes
- Specific technical approach, constraints, or gotchas.

### Files to Change
- `path/to/file` — what to do (line-level detail if helpful).

### Verification
- How to confirm the fix works (build, test, manual steps).
```

## Principles

- **Self-contained.** Don't reference disappearable context (e.g. "as we discussed").
- **Specific.** Prefer line numbers, exact method names, and code snippets over vague descriptions.
- **Testable.** Every criterion must be observable — "user sees X", "build passes", "test Y asserts Z".
- **Minimal.** One issue = one brief. If multiple independent changes, split into multiple issues.
