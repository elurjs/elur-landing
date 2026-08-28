import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function ElurQuery(): ElurTemplate {
  return raw(`
<section class="section elur-query-section" id="elur-query">
    <div class="container">
      <div class="section-header animate-on-scroll">
        <div class="section-label">🛰️ Elur Query</div>
        <h2 class="section-title">Elur Query goes beyond fetch + cache.<br><span class="gradient-text">Queues,
            offline mode, and command orchestration.</span>
        </h2>
        <p class="section-desc">Built for real app workflows: command modes, retries, optimistic updates, and
          offline replay with a custom queue adapter.</p>
      </div>

      <div class="elur-query-layout">
        <div class="elur-query-copy animate-on-scroll">
          <p><strong>@elurjs/query</strong> is CQRS-style state orchestration for Elur:</p>
          <div class="elur-query-modes">
            <span class="elur-query-mode">latest</span>
            <span class="elur-query-mode">queue</span>
            <span class="elur-query-mode">parallel</span>
            <span class="elur-query-mode">queueOffline</span>
          </div>
          <ul class="elur-query-points">
            <li><span class="elur-query-check">✓</span> <span><strong>createQuery</strong> for read operations with
                status/data/error signals.</span></li>
            <li><span class="elur-query-check">✓</span> <span><strong>createCommand</strong> for mutations with
                retries, dedupe, invalidation, and optimistic rollback.</span></li>
            <li><span class="elur-query-check">✓</span> <span>Cache utilities like <strong>getQueryData</strong>,
                <strong>setQueryData</strong>, and <strong>updateQueryData</strong>.</span></li>
          </ul>

          <div class="elur-query-wow-grid">
            <div class="elur-query-wow-card">
              <strong>Offline Queue + Replay</strong>
              Queue commands while offline and replay on reconnect.
            </div>
            <div class="elur-query-wow-card">
              <strong>CommandQueuedError</strong>
              Distinguish queued-offline from real command failures.
            </div>
            <div class="elur-query-wow-card">
              <strong>Optimistic Rollback</strong>
              Use onMutate/onError to keep UI fast and safe.
            </div>
            <div class="elur-query-wow-card">
              <strong>Retry + Backoff</strong>
              Fine-grained retry policy per command.
            </div>
          </div>

          <div class="elur-query-callout">
            v1.5.1 adds single-flight request dedup, <code>keepPreviousData</code>, <code>dispose()</code>,
            and a robust stableStringify.
          </div>

          <a href="https://www.npmjs.com/package/@elurjs/query" class="btn-primary" target="_blank" rel="noopener">
            View Elur Query on npm
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <div class="code-block animate-on-scroll">
          <div class="code-header">
            <div class="code-dots"><span></span><span></span><span></span></div>
            <span class="code-filename">orders-command.ts</span>
          </div>
          <div class="code-body">
            <pre><span class="kw">import</span> { createCommand, CommandQueuedError, getQueryData, setQueryData } <span class="kw">from</span> <span class="str">"@elurjs/query"</span>;

<span class="kw">const</span> saveOrder = <span class="fn">createCommand</span>(<span class="str">"orders/save"</span>,
  <span class="kw">async</span> (payload, { signal }) => {
    <span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">"/api/orders"</span>, {
      method: <span class="str">"POST"</span>, body: JSON.<span class="fn">stringify</span>(payload), signal
    });
    <span class="kw">if</span> (!res.ok) <span class="kw">throw</span> <span class="kw">new</span> <span class="fn">Error</span>(<span class="str">"save failed"</span>);
    <span class="kw">return</span> res.<span class="fn">json</span>();
  },
  {
    mode: <span class="str">"queueOffline"</span>,
    invalidate: [<span class="str">"orders/list"</span>],
    retry: (count, err) =&gt; count &lt; <span class="num">3</span>,
    retryDelay: (count) =&gt; Math.<span class="fn">min</span>(<span class="num">500</span> * <span class="num">2</span> ** (count - <span class="num">1</span>), <span class="num">5000</span>),
    onMutate: (item) =&gt; {
      <span class="kw">const</span> prev = <span class="fn">getQueryData</span>(<span class="str">"orders/list"</span>) ?? [];
      <span class="fn">setQueryData</span>(<span class="str">"orders/list"</span>, [...prev, item]);
      <span class="kw">return</span> { prev };
    },
    onError: (_e, _item, ctx) =&gt; <span class="fn">setQueryData</span>(<span class="str">"orders/list"</span>, ctx?.prev ?? []),
    offline: {
      adapter: myQueueAdapter, <span class="cmt">// implements CommandQueueAdapter</span>
      isOnline: () =&gt; navigator.onLine,
      replayOnReconnect: <span class="kw">true</span>,
      maxReplayAttempts: <span class="num">5</span>
    }
  }
);

<span class="kw">try</span> {
  <span class="kw">await</span> saveOrder.<span class="fn">executeAsync</span>({ id: <span class="str">"A-100"</span>, total: <span class="num">42</span> });
} <span class="kw">catch</span> (e) {
  <span class="kw">if</span> (e <span class="kw">instanceof</span> <span class="fn">CommandQueuedError</span>) {
    <span class="cmt">// queued offline; replay happens later</span>
  }
}

<span class="kw">await</span> saveOrder.<span class="fn">replayQueue</span>();</pre>
          </div>
        </div>
      </div>
    </div>
  </section>
  `);
}
