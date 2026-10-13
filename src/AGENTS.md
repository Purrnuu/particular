# Source Invariants

Follow the root [AGENTS.md](../AGENTS.md). Detailed implementation notes live in [engine-reference.md](../architecture/engine-reference.md), and [boundaries.md](../architecture/boundaries.md) describes the extension contracts.

- Convenience factories receive FeatureContext and register all resource cleanup.
- Async work must check lifetime after every await; timers must be cancellable.
- Destruction is terminal and idempotent, including initialization rollback.
- Forces use common hooks; frame-dependent work consumes FrameContext.
- Keep coordinate spaces explicit and preserve 3D depth during effect snapshots.
- Enforce particle budgets across emitters; image budget expansion is explicit.
- Preserve pooled-object reset invariants and avoid allocations in hot paths.
- Public API changes require llms.txt/README updates and fresh package tests.
