---
title: Commands
description: createCommand — concurrency modes, retry, optimistic updates, offline queue, and invalidation.
section: Elur Query
order: 3
---

# Commands

`createCommand` is the write side of Elur Query. It manages mutations with
concurrency control, retry, optimistic updates, and an offline queue.

## `createCommand<V, R, C>(commandKey, executeFn, options?)`

```typescript
import { createCommand } from "@elurjs/query";

const saveProfile = createCommand(
  "profile/save",
  async (payload: { name: string }, { signal }) => {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
    if (!res.ok) throw new Error("Failed");
    return res.json();
  },
  { mode: "latest", invalidate: ["profile"] }
);

saveProfile.execute({ name: "Deiver" });        // fire-and-forget
await saveProfile.executeAsync({ name: "Ada" }); // imperative (throws on error)
```

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `commandKey` | `string` | Unique command key (use action: `"profile/save"`) |
| `executeFn` | `(variables: V, ctx: CommandContext) => Promise<R>` | Mutation function |
| `options` | `CommandOptions<V, R, C>` | Configuration |

### `CommandContext`

| Field | Type | Description |
| --- | --- | --- |
| `signal` | `AbortSignal` | Aborts when cancelled or superseded |
| `commandKey` | `string` | The command key |

## `CommandResult<V, R>`

### Signals

| Member | Type | Description |
| --- | --- | --- |
| `status` | `Signal<CommandStatus>` | `"idle" \| "pending" \| "success" \| "error" \| "queued"` |
| `data` | `Signal<R \| undefined>` | Last result |
| `error` | `Signal<unknown>` | Last error |
| `variables` | `Signal<V \| undefined>` | Last variables |
| `failureCount` | `Signal<number>` | Retry failure count |
| `inFlight` | `Signal<number>` | Active executions |
| `queuedCount` | `Signal<number>` | Offline queue length |

### Computed signals

| Member | Type | Description |
| --- | --- | --- |
| `isIdle` | `Signal<boolean>` | `status === "idle"` |
| `isPending` | `Signal<boolean>` | `status === "pending"` |
| `isSuccess` | `Signal<boolean>` | `status === "success"` |
| `isError` | `Signal<boolean>` | `status === "error"` |
| `isQueued` | `Signal<boolean>` | `status === "queued"` |

### Methods

| Member | Type | Description |
| --- | --- | --- |
| `execute(v)` | `(v: V) => void` | Fire-and-forget (errors go to `error` signal) |
| `executeAsync(v)` | `(v: V) => Promise<R>` | Imperative (throws on error, including `CommandQueuedError`) |
| `reset()` | `() => void` | Reset signals to idle (or queued if queue has items) |
| `cancel()` | `() => void` | Abort all in-flight controllers |
| `replayQueue()` | `() => Promise<void>` | Replay offline queue |
| `clearQueue()` | `() => Promise<void>` | Clear offline queue |
| `dispose()` | `() => void` | Remove listeners, cancel in-flight, clean global state |

## `execute` vs `executeAsync`

```typescript
// Fire-and-forget — errors go to cmd.error signal
cmd.execute({ name: "Deiver" });

// Imperative — throws on error
try {
  const result = await cmd.executeAsync({ name: "Deiver" });
} catch (err) {
  if (err instanceof CommandQueuedError) {
    // queued offline, will replay later
  } else {
    // actual error
  }
}
```

## Concurrency modes

| Mode | Behavior | Use for |
| --- | --- | --- |
| `"latest"` (default) | Aborts previous in-flight, keeps latest | Search-as-you-type, form saves |
| `"queue"` | Serializes calls in order | Ordered mutations, sequential saves |
| `"parallel"` | Runs all concurrently | Independent bulk operations |
| `"queueOffline"` | Like `queue` + offline queue on disconnect | Mobile, unreliable networks |

```typescript
// Latest: only the last call matters
createCommand("search", searchFn, { mode: "latest" });

// Queue: every call runs in order
createCommand("order/create", createOrderFn, { mode: "queue" });

// Parallel: all run at once
createCommand("bulk/delete", deleteFn, { mode: "parallel" });

// Offline: queue when offline, replay on reconnect
createCommand("order/create", createOrderFn, {
  mode: "queueOffline",
  offline: { adapter: myAdapter },
});
```

## Options

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `CommandMode` | `"latest"` | Concurrency strategy |
| `dedupeWindowMs` | `number` | `0` | Anti double-tap window (ms) |
| `serializeByKey` | `boolean` | `true` | Serialize `queue`/`latest` by command key across instances |
| `retry` | `RetryPolicy` | `0` (no retries) | Number or function |
| `retryDelay` | `RetryDelayPolicy` | exponential backoff | Number or function |
| `invalidate` | `string[] \| ((data, vars) => string[])` | — | Query keys to invalidate on success |
| `onMutate` | `(vars: V) => C \| Promise<C>` | — | Pre-mutation hook (optimistic updates) |
| `onSuccess` | `(data: R, vars: V, ctx: C?) => void` | — | Success callback |
| `onError` | `(err: unknown, vars: V, ctx: C?) => void` | — | Error callback |
| `onSettled` | `(data, err, vars, ctx?) => void` | — | Always runs |
| `offline` | `OfflineQueueOptions<V, R>` | — | Offline queue config (required for `queueOffline`) |

## Retry

### `RetryPolicy`

```typescript
// Fixed retry count
retry: 3

// Function: (failureCount, error) => boolean
retry: (failureCount, error) => {
  const status = (error as { status?: number })?.status;
  const isTransient = status === undefined || status >= 500 || status === 429;
  return isTransient && failureCount < 3;
}
```

`failureCount` starts at 1 on first failure.

### `RetryDelayPolicy`

```typescript
// Fixed delay
retryDelay: 1000

// Function: (failureCount, error) => ms
retryDelay: (failureCount) => Math.min(500 * 2 ** (failureCount - 1), 5000)
```

Default: `min(1000 * 2^(failureCount-1), 30000)` — exponential backoff capped at 30s.

## `dedupeWindowMs`

Prevents rapid double-execution within a time window:

```typescript
createCommand("like", likeFn, { dedupeWindowMs: 300 });
// Clicking twice within 300ms → only one execution
```

## `serializeByKey`

When `true` (default), `queue` and `latest` modes serialize by command key
across all `createCommand` instances with the same key. Set `false` for
per-instance isolation:

```typescript
// Two instances share the same queue
const cmd1 = createCommand("sync", syncFn, { mode: "queue", serializeByKey: true });
const cmd2 = createCommand("sync", syncFn, { mode: "queue", serializeByKey: true });
// cmd1 and cmd2 share a single queue

// Two instances have independent queues
const cmdA = createCommand("sync", syncFn, { mode: "queue", serializeByKey: false });
const cmdB = createCommand("sync", syncFn, { mode: "queue", serializeByKey: false });
// cmdA and cmdB have separate queues
```

## Invalidation

Commands can auto-invalidate query keys on success:

```typescript
// Static list
createCommand("post/create", createPost, { invalidate: ["posts/list", "feed"] });

// Dynamic — compute keys from result and variables
createCommand("post/create", createPost, {
  invalidate: (data, variables) => [`posts/${data.id}`, "posts/list"],
});
```

## Offline queue

`mode: "queueOffline"` requires an adapter. When offline, commands are
enqueued and replayed on reconnect.

### `OfflineQueueOptions<V, R>`

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `adapter` | `CommandQueueAdapter<V>` | — | **Required** — persistence strategy |
| `isOnline` | `() => boolean \| Promise<boolean>` | `navigator.onLine` | Online detector |
| `replayOnReconnect` | `boolean` | `true` | Auto-replay on browser `online` event |
| `maxReplayAttempts` | `number` | — | Cap replay attempts before pausing item |
| `shouldEnqueue` | `(error, variables) => boolean` | — | Enqueue after failed execution |
| `onEnqueue` | `(entry) => void` | — | Called when item is queued |
| `onReplaySuccess` | `(data, entry) => void` | — | Called on successful replay |
| `onReplayError` | `(error, entry) => void` | — | Called on failed replay |

### `CommandQueueAdapter<V>`

```typescript
interface CommandQueueAdapter<TVariables> {
  enqueue(entry: OfflineCommandEntry<TVariables>): Promise<void> | void;
  list(commandKey?: string): Promise<OfflineCommandEntry<TVariables>[]> | OfflineCommandEntry<TVariables>[];
  update(entry: OfflineCommandEntry<TVariables>): Promise<void> | void;
  remove(id: string): Promise<void> | void;
}
```

### LocalStorage adapter example

```typescript
class LocalStorageQueueAdapter implements CommandQueueAdapter<CreateOrderInput> {
  private key = "elur-query:offline-commands";

  private read(): OfflineCommandEntry<CreateOrderInput>[] {
    const raw = localStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : [];
  }

  private write(items: OfflineCommandEntry<CreateOrderInput>[]) {
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  enqueue(entry) { this.write([...this.read(), entry]); }
  list(commandKey?) {
    const all = this.read();
    return commandKey ? all.filter(i => i.commandKey === commandKey) : all;
  }
  update(entry) { this.write(this.read().map(i => i.id === entry.id ? entry : i)); }
  remove(id) { this.write(this.read().filter(i => i.id !== id)); }
}
```

### `OfflineCommandEntry<V>`

Represents a queued command stored by the adapter:

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Unique ID (`"commandKey:timestamp:random"`) |
| `commandKey` | `string` | The command key this entry belongs to |
| `variables` | `V` | Serialized payload to replay |
| `attempts` | `number` | Replay attempt count |
| `createdAt` | `number` | Timestamp when enqueued |
| `lastError` | `string` | Last replay error message (if any) |

### `CommandQueuedError`

Thrown by `executeAsync` when a command is queued offline:

```typescript
import { CommandQueuedError } from "@elurjs/query";

try {
  await cmd.executeAsync({ id: "A-100", total: 42 });
} catch (error) {
  if (error instanceof CommandQueuedError) {
    console.log("Queued:", error.entry.id);
    console.log("Code:", error.code); // "COMMAND_QUEUED_OFFLINE"
  }
}
```

| Property | Type | Description |
| --- | --- | --- |
| `entry` | `OfflineCommandEntry<V>` | The queued entry with variables and metadata |
| `code` | `"COMMAND_QUEUED_OFFLINE"` | Stable error code for programmatic checks |
| `name` | `"CommandQueuedError"` | Error name |
| `message` | `string` | `"Command queued offline: <commandKey>"` |

`execute` (fire-and-forget) does not throw — check `status.value === "queued"`
instead.

### Manual replay

```typescript
await cmd.replayQueue();  // replay all queued items
await cmd.clearQueue();   // discard all queued items
```

Replay preserves command ordering — if one item fails, replay stops to
maintain sequence.
