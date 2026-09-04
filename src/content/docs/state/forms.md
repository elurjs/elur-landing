---
title: Forms
description: Reactive forms with createForm, elurField, built-in validators, and submit handling.
section: State
order: 2
---

# Forms

Elur ships a full form module: `createForm()` for managed forms with
validation and submit handling, `elurField()` for standalone fields, and a set
of built-in validators. All field state is signal-based, so the UI updates
automatically as the user types.

## `createForm()`

`createForm()` takes an initial-values object and an options bag with
validators. It returns a `FormState` with reactive fields, computed validity,
and a `handleSubmit` wrapper:

```typescript
import { createForm, required, email, minLength, html } from "@elurjs/core";

const form = createForm(
  { email: "", password: "" },
  {
    validators: {
      email: [required(), email()],
      password: [required(), minLength(8)],
    },
    validateOn: "blur",
  }
);

html`
  <form @submit=${form.handleSubmit(async (values) => {
    await api.login(values);
  })}>
    <input
      type="email"
      value=${() => form.fields.email.value.value}
      @input=${form.fields.email.onInput}
      @blur=${form.fields.email.onBlur}
    />
    ${() => form.fields.email.error.value
      ? html`<p style="color:red">${() => form.fields.email.error.value}</p>`
      : null}

    <input
      type="password"
      value=${() => form.fields.password.value.value}
      @input=${form.fields.password.onInput}
      @blur=${form.fields.password.onBlur}
    />
    ${() => form.fields.password.error.value
      ? html`<p style="color:red">${() => form.fields.password.error.value}</p>`
      : null}

    <button disabled=${() => !form.canSubmit.value || form.isSubmitting.value}>
      ${() => form.isSubmitting.value ? "Submitting…" : "Log in"}
    </button>
  </form>
`.mount("#app");
```

## FormState members

| Member | Type | Description |
| --- | --- | --- |
| `fields` | `Record<string, FieldState>` | Per-field state — value, error, event handlers. |
| `values` | `Signal<T>` | Computed snapshot of all field values. |
| `errors` | `Signal<FieldErrors>` | Computed map of currently visible errors. |
| `valid` | `Signal<boolean>` | True when no visible errors (follows `validateOn`). |
| `canSubmit` | `Signal<boolean>` | True when all validators pass, regardless of visibility. Bind submit buttons to this. |
| `dirty` | `Signal<boolean>` | True when at least one field has been modified. |
| `touched` | `Signal<boolean>` | True when at least one field has lost focus. |
| `isSubmitting` | `Signal<boolean>` | True while the submit callback is running. |
| `submitCount` | `Signal<number>` | Number of submit attempts (including failed validations). |
| `handleSubmit(fn)` | `(fn) => (e: Event) => void` | Wraps a submit callback — prevents default, validates, manages `isSubmitting`. |
| `reset(newInitialValues?)` | `void` | Reset all fields to initial values. |
| `setValue(path, value, opts?)` | `void` | Set a field by dot-path (supports nested). |
| `setValues(values, opts?)` | `void` | Set multiple fields at once. |
| `setErrors(errors)` | `void` | Inject external errors (e.g., from a server response). |
| `dispose()` | `void` | Dispose all internal computed signals. Call in `onUnmount`. |

## `validateOn`

Controls when validation errors become visible:

| Value | Errors appear |
| --- | --- |
| `"blur"` (default) | After the field loses focus at least once |
| `"input"` | As soon as the user types |
| `"submit"` | Only after the first submit attempt |

```typescript
const form = createForm({ name: "" }, {
  validators: { name: [required()] },
  validateOn: "input", // show errors immediately as the user types
});
```

## Built-in validators

| Validator | Description |
| --- | --- |
| `required(message?)` | Rejects `null`, `""`, and empty arrays |
| `minLength(n, message?)` | String must be at least `n` characters |
| `maxLength(n, message?)` | String must be at most `n` characters |
| `email(message?)` | Must match a basic email pattern |
| `pattern(regex, message?)` | Must match the given regex |
| `min(n, message?)` | Number must be ≥ `n` |
| `max(n, message?)` | Number must be ≤ `n` |

Validators return an error string when invalid, or `null`/`undefined` when
valid. They receive `(value, allValues?)` — the second argument enables
cross-field validation:

```typescript
import { createForm, required, createValidator } from "@elurjs/core";

const form = createForm(
  { password: "", confirm: "" },
  {
    validators: {
      password: [required(), minLength(8)],
      confirm: [
        required(),
        createValidator((value, all) =>
          value !== all?.password ? "Passwords do not match" : null
        ),
      ],
    },
  }
);
```

## Custom validators

`createValidator()` is a typed wrapper that makes a function compatible with
`elurField` and `createForm`:

```typescript
import { createValidator } from "@elurjs/core";

const even = createValidator<number>((n) =>
  n % 2 !== 0 ? "Must be even" : null
);
```

You can also extend the built-in `validators` namespace with `extendValidators`:

```typescript
import { validators, extendValidators } from "@elurjs/core";

const myValidators = extendValidators(validators, {
  even: () => (n: number) => (n % 2 !== 0 ? "Must be even" : null),
});
```

## `elurField()` — standalone fields

For a single field outside a full form, use `elurField()`:

```typescript
import { elurField, required, html } from "@elurjs/core";

const name = elurField("", [required()]);

html`
  <div>
    <input
      value=${() => name.value.value}
      @input=${name.onInput}
      @blur=${name.onBlur}
    />
    ${() => name.error.value
      ? html`<p style="color:red">${() => name.error.value}</p>`
      : null}
  </div>
`.mount("#app");
```

Each `FieldState` exposes: `value` (read/write signal), `error` (visible
error), `rawError` (error ignoring visibility), `touched`, `dirty`, `onInput`,
`onBlur`, `reset()`, and `setValue()`.

## `elurFieldArray()` — dynamic field lists

For forms with repeating groups (e.g., a list of contacts), use
`elurFieldArray()`:

```typescript
import { elurFieldArray, required, html, repeat } from "@elurjs/core";

const contacts = elurFieldArray(
  [{ name: "" }],
  { name: [required()] }
);

html`
  <ul>
    ${() => repeat(
      contacts.fields.value,
      (_, i) => i,
      (group) => html`
        <li>
          <input
            value=${() => group.name.value.value}
            @input=${group.name.onInput}
            @blur=${group.name.onBlur}
          />
          ${() => group.name.error.value
            ? html`<span style="color:red">${() => group.name.error.value}</span>`
            : null}
        </li>
      `
    )}
  </ul>
  <button @click=${() => contacts.append({ name: "" })}>Add contact</button>
`.mount("#app");
```

`elurFieldArray` exposes: `fields` (signal of field groups), `append()`,
`remove(i)`, `move(from, to)`, `replace(i, value)`, `length` (signal),
`setValues()`, `patchValues()`, and `reset()`.

## Schema-level validation (Zod, Valibot, Yup)

Pass a `validate` function to run schema validation on submit, after built-in
validators pass. Return a field-to-error map, or `null` if valid:

```typescript
import { createForm } from "@elurjs/core";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18),
});

const form = createForm(
  { email: "", age: 0 },
  {
    validate(values) {
      const r = schema.safeParse(values);
      if (r.success) return null;
      return Object.fromEntries(
        Object.entries(r.error.flatten().fieldErrors)
          .map(([k, v]) => [k, v?.[0]])
      );
    },
  }
);
```

## Checkbox and select binding

`elurField` auto-coerces values based on the initial value type. For booleans
(checkboxes) and numbers, it handles the conversion automatically:

```typescript
import { elurField, html } from "@elurjs/core";

const agree = elurField(false);        // boolean → reads .checked
const age = elurField(0);              // number → parses to Number
const color = elurField("blue");       // string → reads .value

html`
  <label>
    <input type="checkbox" checked=${() => agree.value.value} @input=${agree.onInput} />
    I agree
  </label>
  <input type="number" value=${() => age.value.value} @input=${age.onInput} />
  <select value=${() => color.value.value} @input=${color.onInput}>
    <option value="red">Red</option>
    <option value="blue">Blue</option>
  </select>
`.mount("#app");
```

:::tip
Bind submit buttons to `canSubmit` (not `valid`) — `canSubmit` reflects whether
all validators pass regardless of error visibility, so a pristine form with
empty required fields correctly starts disabled.
:::

## Types

### `Validator<T, AllValues>`

```typescript
type Validator<T, AllValues = unknown> = (
  value: T,
  allValues?: AllValues,
) => string | null | undefined;
```

Returns an error string when invalid, or `null`/`undefined` when valid.

### `ValidateOn`

Controls when validation errors become visible:

```typescript
type ValidateOn = "blur" | "input" | "submit";
```

- `"blur"` — after the field loses focus (default)
- `"input"` — as soon as the user types
- `"submit"` — only after the first submit attempt

### `ValidatorsBase`

```typescript
type ValidatorsBase = typeof validators;
```

The type of the built-in `validators` object. Used with `extendValidators` to
get typed custom validator namespaces.

### `DeepPartial<T>`

```typescript
type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;
```

Used by `FormState.patch()` and `FormState.setValues()` for partial updates.

### `FieldState<T>`

| Field | Type | Description |
| --- | --- | --- |
| `value` | `Signal<T>` | Current value (read/write) |
| `error` | `Signal<string \| null>` | Visible error (follows `validateOn`) |
| `rawError` | `Signal<string \| null>` | Real error ignoring visibility rules |
| `touched` | `Signal<boolean>` | True after first blur |
| `dirty` | `Signal<boolean>` | True after first input |
| `onInput` | `(e: Event) => void` | Attach to `@input` |
| `onBlur` | `() => void` | Attach to `@blur` |
| `reset()` | `() => void` | Reset to initial value and clear state |
| `setValue(value, options?)` | `(value: T, options?) => void` | Set value programmatically |

### `FieldArrayState<T>`

| Field | Type | Description |
| --- | --- | --- |
| `fields` | `Signal<Array<{ [K]: FieldState<T[K]> }>>` | Reactive list of field groups |
| `length` | `Signal<number>` | Number of items (reactive) |
| `append(value)` | `(value: T) => void` | Add item to end |
| `remove(index)` | `(index: number) => void` | Remove item at index |
| `move(from, to)` | `(from: number, to: number) => void` | Move item between indices |
| `replace(index, value)` | `(index: number, value: T) => void` | Replace item at index |
| `setValues(items)` | `(items: T[]) => void` | Replace entire array |
| `patchValues(items)` | `(items: Partial<T>[]) => void` | Patch existing items |
| `reset(items?)` | `(items?: T[]) => void` | Reset to initial or new values |

### `FieldErrors<T>`

```typescript
type FieldErrors<T> = { [K in keyof T]?: string | null } & Record<string, string | null | undefined>;
```

### `FormState<T>`

| Field | Type | Description |
| --- | --- | --- |
| `fields` | `FormFields<T>` | Individual field states |
| `values` | `Signal<T>` | Computed snapshot of all values |
| `errors` | `Signal<FieldErrors<T>>` | Computed visible errors |
| `valid` | `Signal<boolean>` | True when no visible errors |
| `canSubmit` | `Signal<boolean>` | True when all validators pass (regardless of visibility) |
| `isSubmitting` | `Signal<boolean>` | True during async submit |
| `submit(handler)` | `(handler) => Promise<void>` | Run validators + handler |
| `setErrors(errors)` | `(errors: FieldErrors<T>) => void` | Inject server/schema errors |
| `reset()` | `() => void` | Reset all fields |
| `patch(values)` | `(values: DeepPartial<T>) => void` | Partial update |
| `dispose()` | `() => void` | Clean up signals |

### `FormOptions<T>`

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `validators` | `FormValidators<T>?` | — | Per-field validators |
| `validateOn` | `ValidateOn?` | `"blur"` | When errors become visible |
| `validate` | `(values: T) => FieldErrors<T> \| null`? | — | Schema-level validator (runs on submit) |
| `initialValues` | `DeepPartial<T>?` | — | Initial values for fields |
