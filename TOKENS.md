# Token usage tracking — MyAquarium

LLM token usage for this project, tallied session by session.

## Cumulative tally (2026-09-15)

| Metric | Value |
|---|---|
| Dev sessions (Hermes) | 3 |
| Scripted agent sessions (API) | 14 |
| Models | deepseek-v4-flash, deepseek-v4-pro, deepseek-flash, gemini-3.6-flash |
| Messages | 2 661 |
| API calls | 1 545 |
| Input tokens | 2 219 985 |
| Output tokens | 984 084 |
| Of which reasoning | 570 451 |
| Cache read (cache_read) | 260 366 080 |
| Cache write (cache_write) | 0 |
| **Total (input + output)** | **3 204 069** |
| Estimated cost | ≈ 1.657 USD |

## How to re-read the counter

The Hermes session database (SQLite) holds the exact counters:

```bash
sqlite3 ~/.hermes/state.db "SELECT id, started_at, model,
  input_tokens, output_tokens, cache_read_tokens, cache_write_tokens,
  reasoning_tokens, estimated_cost_usd
  FROM sessions WHERE cwd LIKE '%MyAquarium%' OR cwd LIKE '%aquarium-app%'
  ORDER BY started_at;"
```

Since 2026-08-03 the per-session counters live in `session_model_usage`
(one row per session × model, filtered by `session_id`).

## Notes

- Tally taken from `~/.hermes/state.db` — these are the real runtime
  counters, not an estimate.
- The sessions started before this project moved to `~/work/MyAquarium`
  (`~/aquarium-app`, `~/work/github-audit/MyAquarium`) are included.
- The 2026-09-15 dev session (visual realism pass + fish swim animation,
  still running when this tally was taken) will be added to the next one.
- `reasoning_tokens` is probably included in `output_tokens`
  (to be confirmed with the provider).
- Tally generated on 2026-09-15 from the session database.
