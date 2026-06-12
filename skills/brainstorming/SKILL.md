---
name: brainstorming
description: >
  Use this skill whenever the user wants to think through a problem before writing code, explore different ways to implement a feature, compare architectural approaches, or generate and rank ideas. Trigger this skill for prompts like "what's the best way to...", "I'm thinking about...", "help me decide between...", "what are my options for...", "how should I approach...", "brainstorm ideas for...", or any time the user is at a decision point before or during development. Also trigger when the user is stuck and needs to explore alternatives — even if they don't use the word "brainstorm". Do NOT wait for an explicit brainstorm request; if the intent is exploration or decision-making, use this skill.
---

# Brainstorming Skill

Helps the user think through features, architectural decisions, and implementation approaches — generating ranked ideas with a clear recommendation.

---

## When to use context vs. not

- **With code context**: If the user mentions files, the current stack, or says something like "in this project" or "given what we have" — read the relevant files before brainstorming. Tailor every option to what's already there.
- **Without context**: If the question is abstract or the user doesn't reference the codebase — brainstorm from first principles. Keep options general enough to apply to different stacks.
- **Ambiguous**: If it's unclear, make a reasonable assumption and state it briefly at the top ("I'm treating this as a greenfield decision — let me know if you want me to factor in the existing code.").

---

## Output format

Produce a **free-form ranked list** of options. Structure each entry like this:

```
## Option N — [Short Name]

[1–2 sentence description of the approach.]

**Why it works**: [Strengths in this context]
**Trade-offs**: [Weaknesses, costs, risks]
**Best when**: [The condition that makes this the right pick]
```

After all options, add a **Recommendation** section:

```
## ⭐ Recommendation

Go with **[Option Name]** because [concise justification tied to the user's context or stated goal].

If [alternative condition], consider **[Other Option]** instead.
```

---

## Guidelines

- **Rank by fit**, not by popularity or complexity. The simplest option that solves the problem ranks first if it's the best fit.
- **3–5 options** is the sweet spot. Fewer if the problem space is narrow; never more than 6.
- **Be opinionated in the recommendation.** "It depends" is not a recommendation. Pick one and justify it.
- **Match the stack** when context is available. Don't recommend a Redis queue if the project is a simple Next.js hobby app.
- **Avoid filler.** Don't pad with "Great question!" or "There are many ways to approach this." Start directly with the first option.
- **Use plain language.** Brief technical terms are fine, but explain non-obvious ones inline.

---

## Tone

Direct, pragmatic, opinionated. Think "senior dev rubber-ducking with you," not "consultant listing frameworks."

---

## Example trigger phrases

- "What's the best way to handle auth in this app?"
- "Should I use a queue or cron job here?"
- "I'm thinking about refactoring this module — ideas?"
- "What are my options for caching this API response?"
- "Help me decide between REST and GraphQL for this use case"
- "How should I structure this feature?"