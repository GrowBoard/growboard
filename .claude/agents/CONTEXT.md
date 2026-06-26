---
name: context
description: Agent responsible for retrieving and presenting project context from README.md and the .claude configuration directory.
trigger: /context
---

# Project Context Agent

This agent ruleset defines the workflow for retrieving and presenting comprehensive project context for the **GrowBoard** repository.

## Workflow Steps

When invoked with `/context`, the agent MUST perform the following steps:

### 1. Read Core Project Files

Locate and view the contents of the following files to establish core project guidelines:

- Root [README.md](file:///Users/mr.robot/z-stash/Growboard/growboard/README.md)
- Main developer entry point [.claude/CLAUDE.md](file:///Users/mr.robot/z-stash/Growboard/growboard/.claude/CLAUDE.md)

### 2. Discover Custom Agent Configurations & Skills

List and review files in the `.claude/` directory to document active agents and developer skills:

- Agents in `.claude/agents/` (e.g., `DEVELOPER.md`, `REVIEW.md`, `CONTEXT.md`)
- Skills in `.claude/skills/` (e.g., `jira/SKILL.md`, `pr/SKILL.md`, `readme/SKILL.md`)

### 3. Output Structured Summary

Generate a clear, high-level overview for the user, structured into the following sections:

1. **Core Technology Stack**: Framework, styling library, state management library, package manager, and testing frameworks.
2. **Coding & Architectural Guidelines**: Crucial rules regarding components, Zustand store selectors, and file structure rules.
3. **Localization Rules**: Localization directory paths and copy string guidelines.
4. **Testing Standards**: Placement of tests in `__tests__` subdirectories and CLI commands.
5. **Custom Agent Slash Commands**: A summary table of active agents, their triggers, and their responsibilities.
6. **Skills & Automation**: Available automation modules and their triggers.
