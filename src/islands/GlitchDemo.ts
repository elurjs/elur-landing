import { html, signal, computed, effect, batch } from "@elurjs/core";

interface Row {
    a: number;
    b: number;
    c: number;
    consistent: boolean;
}

/**
 * Runs the classic diamond-shape reactive graph against two engines:
 *
 *   - Elur 4 (the real engine powering this site): push-pull, versioned —
 *     the downstream effect runs once per write and always observes a
 *     consistent snapshot.
 *   - A simulated naive push engine (what Elur 3.x did): each branch of the
 *     diamond notifies the effect independently, so it runs twice per write
 *     and the first run sees torn state (b already updated, c still stale).
 */
function runRealEngine(): Row[] {
    const rows: Row[] = [];
    const a = signal(1);
    const b = computed(() => a.value * 2);
    const c = computed(() => a.value + 10);
    const stop = effect(() => {
        rows.push({ a: a.value, b: b.value, c: c.value, consistent: b.value === a.value * 2 && c.value === a.value + 10 });
    });
    a.value = 2;
    a.value = 3;
    a.value = 4;
    batch(() => { a.value = 5; a.value = 6; });
    stop();
    return rows;
}

function runNaiveEngine(): Row[] {
    // Minimal push-based simulation: a write notifies subscribers in
    // subscription order, each branch recomputes and pushes downstream —
    // no versioning, no lazy pull. This is the classic glitch behavior.
    const subs = new Set<() => void>();
    let a = 1;
    let b = a * 2;
    let c = a + 10;
    const branchSubs = new Set<() => void>();
    const rows: Row[] = [];

    const record = () => {
        rows.push({ a, b, c, consistent: b === a * 2 && c === a + 10 });
    };
    subs.add(() => { b = a * 2; branchSubs.forEach((f) => f()); });
    subs.add(() => { c = a + 10; branchSubs.forEach((f) => f()); });
    branchSubs.add(record);

    const setA = (v: number) => { a = v; subs.forEach((f) => f()); };

    record();
    setA(2);
    setA(3);
    setA(4);
    setA(5);
    setA(6);
    return rows;
}

function GlitchDemo() {
    const real = signal<Row[]>([]);
    const naive = signal<Row[]>([]);
    const ran = signal(false);

    const run = () => {
        real.value = runRealEngine();
        naive.value = runNaiveEngine();
        ran.value = true;
    };

    const table = (rows: Row[], title: string, ok: boolean) => html`
        <div class="glitch-col">
            <div class="glitch-col-head">
                <span class="glitch-col-title">${title}</span>
                ${rows.length > 0
            ? html`<span class="glitch-badge ${ok ? "ok" : "bad"}">
                        ${ok
                    ? `${rows.length} runs · all consistent`
                    : `${rows.length} runs · ${rows.filter((r) => !r.consistent).length} torn`}
                    </span>`
            : null}
            </div>
            <table class="glitch-table">
                <thead><tr><th>a</th><th>b=a×2</th><th>c=a+10</th><th></th></tr></thead>
                <tbody>
                    ${() => rows.map((r) => html`
                        <tr class=${r.consistent ? "" : "torn"}>
                            <td>${r.a}</td><td>${r.b}</td><td>${r.c}</td>
                            <td>${r.consistent ? "✓" : "✗ torn"}</td>
                        </tr>`)}
                </tbody>
            </table>
        </div>
    `;

    return html`
        <div class="glitch-demo">
            <div class="glitch-code"><pre>const a = signal(1);
const b = computed(() =&gt; a.value * 2);   <span class="glitch-c">// branch 1</span>
const c = computed(() =&gt; a.value + 10);  <span class="glitch-c">// branch 2</span>
effect(() =&gt; record(a.value, b.value, c.value));

a.value = 2; a.value = 3; a.value = 4;
batch(() =&gt; { a.value = 5; a.value = 6; });</pre></div>
            <button class="home-demo-btn home-demo-btn-primary" @click=${run}>
                ${() => (ran.value ? "Run again" : "Run the diamond")}
            </button>
            <div class="glitch-cols">
                ${() => table(real.value, "Elur 4 — push-pull versioned", true)}
                ${() => table(naive.value, "Classic push engine (Elur 3.x)", false)}
            </div>
        </div>
    `;
}

export default GlitchDemo;
