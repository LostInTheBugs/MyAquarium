# Token usage tracking — MyAquarium

LLM token usage for this project, tallied session by session.

## Cumulative tally (2026-09-14)

| Metric | Value |
|---|---|
| Dev sessions (Hermes) | 2 |
| Scripted agent sessions (API) | 14 |
| Models | deepseek-v4-flash, deepseek-v4-pro |
| Messages | 2 350 |
| API calls | 1 404 |
| Input tokens | 1 720 098 |
| Output tokens | 723 406 |
| Of which reasoning | 372 495 |
| Cache read (cache_read) | 225 383 808 |
| Cache write (cache_write) | 0 |
| **Total (input + output)** | **2 443 504** |
| Estimated cost | ≈ 1.332 USD |

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
- The 2026-09-14 deployment session (release 2026.09.001) was still
  running when this tally was taken — it will be added to the next one.
- `reasoning_tokens` is probably included in `output_tokens`
  (to be confirmed with the provider).
- Tally generated on 2026-09-14 from the session database.
