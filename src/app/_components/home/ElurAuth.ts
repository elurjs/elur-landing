import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function ElurAuth(): ElurTemplate {
  return raw(`
<section class="home-section home-elur-auth-section" id="elur-auth">
    <div class="home-container">
      <div class="home-section-header animate-on-scroll">
        <div class="home-section-label">🔐 Elur Auth</div>
        <h2 class="home-section-title">Authentication and authorization<br><span class="home-gradient-text">built for Elur.
          </span>
        </h2>
        <p class="home-section-desc">Driver-based auth with reactive signals. JWT, session cookies, API keys, and OIDC — all
          share the same policy engine and router guards.</p>
      </div>

      <div class="home-elur-auth-layout">
        <div class="home-elur-auth-copy animate-on-scroll">
          <p><strong>@elurjs/auth</strong> is the official auth layer for the Elur ecosystem:</p>
          <ul class="home-elur-auth-points">
            <li><span class="home-elur-auth-check">✓</span> <span><strong>createAuth</strong> with reactive session, user,
                token, and isAuthenticated signals.</span></li>
            <li><span class="home-elur-auth-check">✓</span> <span><strong>Drivers</strong> for JWT, session cookies, API keys,
                and OIDC with PKCE.</span></li>
            <li><span class="home-elur-auth-check">✓</span> <span><strong>Policy engine</strong> with RBAC, tenant-aware
                resolvers, and custom guards.</span></li>
            <li><span class="home-elur-auth-check">✓</span> <span><strong>Router integration</strong> via declarative
                <code>meta.auth</code> DSL and standalone guards.</span></li>
          </ul>

          <div class="home-elur-auth-callout">
            v1.3.0 adds a credential-safe DevTools plugin for inspecting live auth instances, providers,
            session state, and user previews during development.
          </div>

          <a href="/docs/ecosystem/auth/overview/" class="home-btn-primary">
            Read the Elur Auth docs
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <div class="home-code-block animate-on-scroll">
          <div class="home-code-header">
            <div class="home-code-dots"><span></span><span></span><span></span></div>
            <span class="home-code-filename">auth.ts</span>
          </div>
          <div class="home-code-body">
            <pre><span class="kw">import</span> { createAuth, jwtDriver, rbacPolicy } <span class="kw">from</span> <span class="str">"@elurjs/auth"</span>;

<span class="kw">const</span> auth = <span class="fn">createAuth</span>({
  driver: <span class="fn">jwtDriver</span>({ loginUrl: <span class="str">"/api/login"</span> }),
  autoRefresh: <span class="kw">true</span>,
  identity: { roles: <span class="str">"roles"</span>, permissions: <span class="str">"permissions"</span> },
});

auth.<span class="fn">attachPolicy</span>(
  <span class="fn">rbacPolicy</span>({
    resolveRoles: (u, tenant) => tenant ? u.rolesByTenant[tenant] : u.roles,
  }),
);

<span class="kw">await</span> auth.<span class="fn">login</span>({ email: <span class="str">"deiver@example.com"</span>, password: <span class="str">"secret"</span> });

console.<span class="fn">log</span>(auth.isAuthenticated.value); <span class="cmt">// true</span>
console.<span class="fn">log</span>(auth.<span class="fn">can</span>(<span class="str">"role:admin"</span>, { tenant: <span class="str">"acme"</span> }).value);</pre>
          </div>
        </div>
      </div>
    </div>
  </section>
  `);
}
