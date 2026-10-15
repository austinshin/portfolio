# How I Got My AI Assistant to Hand Off Work to Claude Code

Oct 15, 2026 · @Link

My personal AI assistant can now hand coding work to Claude Code on my Mac, and get the results back, without me in the loop. A message goes in, and about 2 to 7 minutes later a headless Claude Code session has picked it up, done the work, and replied.

I use two AI tools every day. Mew, my assistant on Meta Muse, knows my life: email, calendar, what I'm working on. Claude Code knows my computer: it can write code, run it and build things in my folders. Neither could talk to the other, so I was the courier, copy-pasting context between them. This post explains the bridge I built so they can work together on their own.

## How it fits together

The whole bridge is a shared inbox plus a wake-up timer. Mew and Claude never connect directly; they both read and write one file in a secret GitHub gist.

&#91;embedded content: relay architecture · 6 parts, 2 directions\]

Mew writes tasks into the gist and reads replies from it. On my Mac, a poller checks the gist every 2 minutes, starts a headless Claude Code run when work is waiting, and Claude replies through a small MCP server that writes back to the same file.

## The message format

Everything travels through one JSON file, `relay.json`, holding a single list of messages in both directions. Each message says who sent it and where it stands.

A task from Mew to Claude looks like this:

```json
{
  "id": "m-20261015T171658",
  "from": "mew",
  "ts": "2026-10-15T17:16:58Z",
  "text": "Add the new interview to the tracker: ...",
  "status": "pending",
  "reply": null
}
```

The status moves through four values:

| Status | Meaning | Set by |
| --- | --- | --- |
| `pending` | Waiting for Claude | Mew |
| `claimed` | A Claude run has taken it | Poller |
| `done` | Finished; `reply` holds the result | Claude |
| `failed` | Failed twice; I get a notification | Poller |

Questions from Claude to Mew use the same list with `"from": "claude"`, a `question` field and an `answer` field that Mew fills in. One file, one shape, both directions.

## Claude asks Mew

On the Claude side, the bridge is a small MCP server: a Python script that Claude Code launches and talks to over stdio. It gives Claude two tools:

- `ask_mew(question)` appends a `pending` message from `claude` and returns its id right away.
- `get_mew_reply(id)` checks the gist every 15 seconds until Mew's answer lands, waiting up to 7 minutes per call.

Mew runs a scheduled check about every 5 minutes. It reads the file, answers anything pending using its own memory and tools, and writes the answer back. So when Claude needs a fact only Mew knows, like the details of an email it can't read, it asks and waits.

Registering it is one command:

```bash
claude mcp add mew-relay -- python3 /path/to/mew_relay_server.py
```

## Mew hands work to Claude

This direction is the hard one. Claude Code only acts when something starts a turn, so a tool that reads the inbox isn't enough. Something has to notice the message and wake Claude up.

The MCP server gained two more tools, `check_mew_messages()` and `reply_to_mew(id, text)`, so any Claude session can read and answer Mew's tasks. The waking is done by a poller: a plain Python script that macOS's launchd runs every 2 minutes. Each pass:

1. Reads the gist. If nothing from Mew is pending, it exits. That costs one API call and no model usage.
2. Resets any message stuck in `claimed` for over 45 minutes, from a crashed run, back to `pending`.
3. Marks every pending message `claimed`, then starts one headless run, `claude -p "<prompt>"`, with all of them listed oldest first.
4. Claude does the work and calls `reply_to_mew` for each message.
5. Anything still `claimed` afterwards goes back to `pending`, or to `failed` after 2 attempts, and I get a macOS notification.

Two details made this work in practice:

- **Batching.** Mew often sends a task and then a correction a few minutes later. Handing every pending message to one run, oldest first, lets the follow-up amend the original instead of racing it.
- **Memory between runs.** Each headless run starts fresh. The workspace keeps a `LOG.md` listing every past task and where its output lives. The prompt tells Claude to read it first and append to it last, so the next run knows what the last one built.

## Keeping it safe

Headless means nobody approves anything, so the text of a relayed message is effectively a command on my machine. The fence has to be in the configuration, not in good intentions.

- **Deny by default.** Runs use `--permission-mode dontAsk`: any tool not on the allow-list is refused, not prompted.
- **A short allow-list.** Read and search anywhere; edit files only inside one workspace folder (`Edit(//Users/me/Code/mew-tasks/**)`); run only `npm`, `node`, `python3`, `git` and a few read-only shell commands; the relay tools.
- **No outbound actions.** No email, no calendar writes, nothing that contacts other people. The prompt tells Claude to send a proposal back instead when a task needs more.
- **A spending cap.** `--max-budget-usd 5` per run.
- **One gatekeeper on the inbox.** Writing to the gist requires a GitHub token with the `gist` scope. Anyone with it can queue work, so it lives in one place and gets rotated if it ever leaks.

One more problem was concurrency. Both sides rewrite the whole file, so two writes in the same second could erase one another. Every write now re-reads the file right before saving, merges by message id, and checks afterwards that the change stuck, retrying if not. Mew follows the same rule.

## What it did in the first two days

The first real task was a job-search tracker. Mew sent a spec with my applications so far. Three minutes later, a headless run had built a local web app, filled it in and replied with run instructions. Over the next two days Mew sent 8 more messages: new interviews from my calendar, meeting links, rejections and a full rebuild in React. Each was handled in 1 to 7 minutes with no prompting from me. The tracker stayed current while I was busy interviewing.

### The job tracker

The tracker is a local-first React app: a small Node server, one JSON file for all the data, and no cloud account. What it ended up with:

&#91;image: The interview tracker: a Needs review panel, upcoming interviews with countdowns and Join links, and the applications table with stage filters\]

*Shown with sample data; the companies are made up.*

- **A pipeline.** Applied → Screening → Interview → Offer, plus Rejected and Ghosted. The run added Ghosted on its own when I reported two companies had gone silent, rather than mislabel them as rejected.
- **Table and board views.** A sortable table with a stage dropdown per row, and a board where cards drag between columns.
- **Upcoming interviews.** Soonest first, with a countdown, length, interviewer, prep notes and a Join button for the meeting link.
- **Search across everything,** one box, press `/`.
- **A Needs review panel.** Anything ambiguous gets flagged for me instead of guessed: an unknown role, a missing posting link, a stage that would move backwards.
- **A sync importer.** Updates arrive as small JSON files and are applied with `npm run sync`. Running the same file twice changes nothing, and unclear matches become review flags. This is how relayed messages reach the data.
- **Safe storage.** Atomic writes, a backup before every save (last 200 kept), and an open browser tab reloads instead of overwriting newer data.
- **Tests.** 12 automated tests cover migration, sync rules and saving, and every run has to keep them green.

What I learned along the way:

- **Verify what assistants say they can do.** Mew confidently described a `check_mew_messages()` tool that didn't exist yet. Its messages were landing in an inbox nobody read.
- **Keep one source of truth.** While I was improving the tracker in an interactive Claude session, a headless run rebuilt it in a new folder at Mew's request. I ended up with two diverging copies. `LOG.md` had the answer the whole time; now I check it first.
- **Validate the reply path.** One headless run first called `reply_to_mew` with a wrong id. The server rejected it, and it retried correctly. Without that check, the reply would have vanished silently.
- **Small permission details matter.** In Claude Code, a `Write(path)` allow rule doesn't scope file writes; `Edit(path)` rules cover all file-editing tools.
- **Let the guardrails stop you.** Claude Code's auto mode refused to install the launchd job on its own, flagging it as creating a persistent agent. I installed it myself. That's the right split: the agent builds it, a human turns it on.

## Limitations and what's next

- **Latency.** 2 to 7 minutes each way, set by Mew's 5-minute check and the 2-minute poller. Fine for chores, not for conversation.
- **A gist is not a queue.** It has no locking, so safety depends on both sides re-reading before every write. It's fine for one person; a real product would use a database.
- **My Mac has to be on.** The poller runs locally, so tasks wait while the laptop sleeps.
- **Runs share context only through files.** `LOG.md` gives continuity, but each run rebuilds its understanding from scratch.

Next I want Mew to send a daily sync task so the tracker updates from my email and calendar without me reporting anything. Beyond that, the pattern is general: any assistant that can write JSON to a shared place can hand work to a coding agent that can act on a computer.
