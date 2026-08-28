import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function Comparison(): ElurTemplate {
  return raw(`
<section class="section comparison" id="comparison">
    <div class="container">
      <div class="section-header animate-on-scroll">
        <div class="section-label">📊 Performance Benchmarks</div>
        <h2 class="section-title">Raw speed. Zero compiler.</h2>
        <p class="section-desc">We benchmarked Elur with 1,000-row scenarios using the js-framework-benchmark style
          workflow, reporting both JS-only and full-render timing so results are easier to interpret.</p>
      </div>

      <div class="bench-methodology-alert animate-on-scroll">
        <h4>Read this before comparing numbers</h4>
        <ul class="bench-methodology-list">
          <li><span>1.</span> JS-only means framework/runtime cost only. Full render includes layout + paint.</li>
          <li><span>2.</span> The create-row win can happen when DOM patching and batching reduce framework overhead in
            the measured phase.</li>
          <li><span>3.</span> Use both columns before drawing conclusions for your real app workload.</li>
        </ul>
      </div>

      <div class="bench-legend animate-on-scroll">
        <div class="bench-leg-item">
          <div class="bench-leg-dot js"></div>
          <span class="bench-leg-label">JS ONLY</span>
          <span>Framework overhead only</span>
        </div>
        <div class="bench-leg-divider"></div>
        <div class="bench-leg-item">
          <div class="bench-leg-dot full"></div>
          <span class="bench-leg-label">FULL RENDER</span>
          <span>JS + Layout + Paint</span>
        </div>
      </div>

      <div class="tbl-wrap animate-on-scroll">
        <table class="bench-table">
          <thead>
            <tr>
              <th class="th-op" rowspan="2">Operation (1k rows)</th>
              <th class="th-elur-old fw-group" colspan="2" title="Versión estable anterior">Elur 1.3.0</th>
              <th class="th-elur fw-group" colspan="2">Elur 3.5.0 🚀</th>
              <th class="th-van fw-group" colspan="2">Vanilla JS</th>
              <th class="th-solid fw-group" colspan="2">Solid.js</th>
              <th class="th-svelte fw-group" colspan="2">Svelte 5</th>
              <th class="th-vue fw-group" colspan="2">Vue 3</th>
              <th class="th-react fw-group" colspan="2">React 18</th>
            </tr>
            <tr>
              <th class="sub-js fw-group">JS</th>
              <th class="sub-full">Full</th>
              <th class="sub-js fw-group">JS</th>
              <th class="sub-full">Full</th>
              <th class="sub-js fw-group">JS</th>
              <th class="sub-full">Full</th>
              <th class="sub-js fw-group">JS</th>
              <th class="sub-full">Full</th>
              <th class="sub-js fw-group">JS</th>
              <th class="sub-full">Full</th>
              <th class="sub-js fw-group">JS</th>
              <th class="sub-full">Full</th>
              <th class="sub-js fw-group">JS</th>
              <th class="sub-full">Full</th>
            </tr>
          </thead>
          <tbody>
            <!-- CREATE -->
            <tr>
              <td class="op-cell">
                <span class="op-name">Create rows</span>
                <span class="op-sub">Initial render</span>
              </td>
              <!-- 1.3.0 -->
              <td class="val-cell elur-old-cell fw-group">
                <div class="cell-inner"><span class="v-js strike-time">220.2ms</span></div>
              </td>
              <td class="val-cell elur-old-cell">
                <div class="cell-inner"><span class="v-full">603.9ms</span></div>
              </td>
              <!-- 3.4.0 -->
              <td class="val-cell elur-cell fw-group">
                <div class="cell-inner">
                  <span class="v-js">21.83ms <span class="bench-badge b-win">WIN</span></span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:10%;background:var(--green)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell elur-cell">
                <div class="cell-inner"><span class="v-full">109.84ms</span></div>
              </td>

              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--van-col)">~55ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:30%;background:var(--van-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~80ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--so-col)">~65ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:36%;background:var(--so-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~130ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--sv-col)">~100ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:55%;background:var(--sv-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~180ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--v-col)">~130ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:72%;background:var(--v-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~280ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--r-col)">~160ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:88%;background:var(--r-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~350ms</span></div>
              </td>
            </tr>

            <!-- REPLACE -->
            <tr class="elur-row">
              <td class="op-cell">
                <span class="op-name">Replace rows</span>
                <span class="op-sub">Full array swap</span>
              </td>
              <!-- 1.3.0 -->
              <td class="val-cell elur-old-cell fw-group">
                <div class="cell-inner"><span class="v-js strike-time">286.5ms</span></div>
              </td>
              <td class="val-cell elur-old-cell">
                <div class="cell-inner"><span class="v-full">567.5ms</span></div>
              </td>
              <!-- 3.4.0 -->
              <td class="val-cell elur-cell fw-group">
                <div class="cell-inner">
                  <span class="v-js">29.99ms <span class="bench-badge b-win">WIN</span></span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:12%;background:var(--green)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell elur-cell">
                <div class="cell-inner"><span class="v-full">121.01ms</span></div>
              </td>

              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--van-col)">~55ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:30%;background:var(--van-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~85ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--so-col)">~70ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:38%;background:var(--so-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~140ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--sv-col)">~105ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:57%;background:var(--sv-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~190ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--v-col)">~135ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:73%;background:var(--v-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~290ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--r-col)">~165ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:90%;background:var(--r-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~360ms</span></div>
              </td>
            </tr>

            <!-- UPDATE -->
            <tr>
              <td class="op-cell">
                <span class="op-name">Update (1 in 10)</span>
                <span class="op-sub">Fine-grained text update</span>
              </td>
              <!-- 1.3.0 -->
              <td class="val-cell elur-old-cell fw-group">
                <div class="cell-inner"><span class="v-js strike-time">0.8ms</span></div>
              </td>
              <td class="val-cell elur-old-cell">
                <div class="cell-inner"><span class="v-full">40.1ms</span></div>
              </td>
              <!-- 3.4.0 -->
              <td class="val-cell elur-cell fw-group">
                <div class="cell-inner">
                  <span class="v-js">0.21ms <span class="bench-badge b-top">TOP</span></span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:2%;background:var(--green)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell elur-cell">
                <div class="cell-inner"><span class="v-full">31.66ms</span></div>
              </td>

              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--van-col)">~4ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:24%;background:var(--van-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~15ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--so-col)">~5ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:30%;background:var(--so-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~20ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--sv-col)">~8ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:48%;background:var(--sv-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~30ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--v-col)">~12ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:72%;background:var(--v-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~45ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--r-col)">~15ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:90%;background:var(--r-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~55ms</span></div>
              </td>
            </tr>

            <!-- SELECT -->
            <tr class="elur-row">
              <td class="op-cell">
                <span class="op-name">Select row</span>
                <span class="op-sub">Highlight 1 element</span>
              </td>
              <!-- 1.3.0 -->
              <td class="val-cell elur-old-cell fw-group">
                <div class="cell-inner"><span class="v-js strike-time">0.3ms</span></div>
              </td>
              <td class="val-cell elur-old-cell">
                <div class="cell-inner"><span class="v-full">21.6ms</span></div>
              </td>
              <!-- 3.4.0 -->
              <td class="val-cell elur-cell fw-group">
                <div class="cell-inner">
                  <span class="v-js">0.02ms <span class="bench-badge b-top">TOP</span></span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:1%;background:var(--green)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell elur-cell">
                <div class="cell-inner"><span class="v-full">30.62ms</span></div>
              </td>

              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--van-col)">~2ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:16%;background:var(--van-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~8ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--so-col)">~3ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:25%;background:var(--so-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~12ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--sv-col)">~5ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:41%;background:var(--sv-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~18ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--v-col)">~8ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:66%;background:var(--v-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~28ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--r-col)">~10ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:83%;background:var(--r-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~35ms</span></div>
              </td>
            </tr>

            <!-- SWAP -->
            <tr>
              <td class="op-cell">
                <span class="op-name">Swap rows</span>
                <span class="op-sub">Swap index 2 and 998</span>
              </td>
              <!-- 1.3.0 -->
              <td class="val-cell elur-old-cell fw-group">
                <div class="cell-inner"><span class="v-js strike-time">53.3ms</span></div>
              </td>
              <td class="val-cell elur-old-cell">
                <div class="cell-inner"><span class="v-full">380.5ms</span></div>
              </td>
              <!-- 3.4.0 -->
              <td class="val-cell elur-cell fw-group">
                <div class="cell-inner">
                  <span class="v-js">0.86ms <span class="bench-badge b-top">TOP</span></span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:1%;background:var(--green)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell elur-cell">
                <div class="cell-inner"><span class="v-full">31.18ms</span></div>
              </td>

              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--van-col)">~5ms <span
                      class="bench-badge b-best">★</span></span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:14%;background:var(--van-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~20ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--so-col)">~8ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:22%;background:var(--so-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~30ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--sv-col)">~12ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:34%;background:var(--sv-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~45ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--v-col)">~25ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:71%;background:var(--v-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~90ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--r-col)">~30ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:85%;background:var(--r-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~110ms</span></div>
              </td>
            </tr>

            <!-- CLEAR -->
            <tr class="elur-row">
              <td class="op-cell">
                <span class="op-name">Clear rows</span>
                <span class="op-sub">Range.deleteContents()</span>
              </td>
              <!-- 1.3.0 -->
              <td class="val-cell elur-old-cell fw-group">
                <div class="cell-inner"><span class="v-js strike-time">43.2ms</span></div>
              </td>
              <td class="val-cell elur-old-cell">
                <div class="cell-inner"><span class="v-full">307.5ms</span></div>
              </td>
              <!-- 3.4.0 -->
              <td class="val-cell elur-cell fw-group">
                <div class="cell-inner">
                  <span class="v-js">15.31ms <span class="bench-badge b-win">WIN</span></span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:15%;background:var(--accent-light)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell elur-cell">
                <div class="cell-inner"><span class="v-full">31.85ms</span></div>
              </td>

              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--van-col)">~30ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:27%;background:var(--van-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~50ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--so-col)">~35ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:31%;background:var(--so-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~60ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--sv-col)">~45ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:40%;background:var(--sv-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~75ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--v-col)">~80ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:72%;background:var(--v-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~150ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--r-col)">~95ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:86%;background:var(--r-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~180ms</span></div>
              </td>
            </tr>

            <!-- DELETE -->
            <tr>
              <td class="op-cell">
                <span class="op-name">Delete row</span>
                <span class="op-sub">Eliminar 1 fila</span>
              </td>
              <!-- 1.3.0 -->
              <td class="val-cell elur-old-cell fw-group">
                <div class="cell-inner"><span class="v-js strike-time">1.9ms</span></div>
              </td>
              <td class="val-cell elur-old-cell">
                <div class="cell-inner"><span class="v-full">44.8ms</span></div>
              </td>
              <!-- 3.4.0 -->
              <td class="val-cell elur-cell fw-group">
                <div class="cell-inner">
                  <span class="v-js">0.76ms <span class="bench-badge b-top">TOP</span></span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:5%;background:var(--green)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell elur-cell">
                <div class="cell-inner"><span class="v-full">26.03ms</span></div>
              </td>

              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--van-col)">~1ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:8%;background:var(--van-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~5ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--so-col)">~2ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:16%;background:var(--so-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~8ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--sv-col)">~3ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:25%;background:var(--sv-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~12ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--v-col)">~8ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:66%;background:var(--v-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~25ms</span></div>
              </td>
              <td class="val-cell fw-group">
                <div class="cell-inner"><span class="v-js" style="color:var(--r-col)">~10ms</span>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:83%;background:var(--r-col)"></div>
                  </div>
                </div>
              </td>
              <td class="val-cell">
                <div class="cell-inner"><span class="v-full">~35ms</span></div>
              </td>
            </tr>

            <!-- BUNDLE -->
            <tr style="background: rgba(0,0,0,0.3); border-top: 1px solid var(--border);">
              <td class="op-cell" style="border-top:1px solid var(--border);">
                <span class="op-name">Gzipped Size</span>
                <span class="op-sub">Library footprint</span>
              </td>
              <td class="val-cell elur-old-cell fw-group" colspan="2">
                <div class="bundle-size" style="color:var(--text-secondary)">~10 KB</div>
                <div class="bundle-note">v1.3.0</div>
              </td>
              <td class="val-cell elur-cell fw-group" colspan="2">
                <div class="bundle-size" style="color:var(--green)">~15 KB <span class="bench-badge b-win">WIN</span>
                </div>
                <div class="bundle-note">Router + Stores included</div>
              </td>
              <td class="val-cell fw-group" colspan="2">
                <div class="bundle-size" style="color:var(--van-col)">0 KB <span class="bench-badge b-best">★</span>
                </div>
                <div class="bundle-note">Browser Native</div>
              </td>
              <td class="val-cell fw-group" colspan="2">
                <div class="bundle-size" style="color:var(--so-col)">~7 KB</div>
                <div class="bundle-note">Core only</div>
              </td>
              <td class="val-cell fw-group" colspan="2">
                <div class="bundle-size" style="color:var(--sv-col)">~2 KB*</div>
                <div class="bundle-note">Requires compiler</div>
              </td>
              <td class="val-cell fw-group" colspan="2">
                <div class="bundle-size" style="color:var(--v-col)">~22 KB</div>
                <div class="bundle-note">Core + Runtime</div>
              </td>
              <td class="val-cell fw-group" colspan="2">
                <div class="bundle-size" style="color:var(--r-col)">~45 KB</div>
                <div class="bundle-note">React + DOM</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bench-footnotes animate-on-scroll" style="text-align: center; margin-top: 24px; padding: 0 16px;">
        <div class="bench-fn">* Averages calculated from a base of <b>20 distinct samples</b> per operation mode to rule
          out V8 GC outliers. Based on official <b>js-framework-benchmark</b> methodology. Lower times are better.</div>
      </div>

      <!-- Built-in Features Comparison -->
      <div class="builtin-table-wrapper animate-on-scroll">
        <h3>Built-in vs. Third-party</h3>
        <div class="comparison-table-wrapper">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th class="elur-col">Elur</th>
                <th>React</th>
                <th>Vue</th>
                <th>Solid</th>
                <th>Svelte</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Router</td>
                <td class="elur-col check-cell">Built-in ✓</td>
                <td class="x-cell">react-router</td>
                <td class="x-cell">vue-router</td>
                <td class="x-cell">@solidjs/router</td>
                <td class="x-cell">svelte-kit</td>
              </tr>
              <tr>
                <td>Form Validation</td>
                <td class="elur-col check-cell">Built-in ✓</td>
                <td class="x-cell">react-hook-form</td>
                <td class="x-cell">vee-validate</td>
                <td class="x-cell">—</td>
                <td class="x-cell">—</td>
              </tr>
              <tr>
                <td>Global Stores</td>
                <td class="elur-col check-cell">Built-in ✓</td>
                <td class="x-cell">zustand / redux</td>
                <td class="x-cell">pinia</td>
                <td class="check-cell">Built-in ✓</td>
                <td class="x-cell">svelte/store</td>
              </tr>
              <tr>
                <td>Dependency Injection</td>
                <td class="elur-col check-cell">Built-in ✓</td>
                <td class="x-cell">React Context</td>
                <td class="check-cell">Built-in ✓</td>
                <td class="x-cell">createContext</td>
                <td class="x-cell">getContext</td>
              </tr>
              <tr>
                <td>Portals</td>
                <td class="elur-col check-cell">Built-in ✓</td>
                <td class="check-cell">Built-in ✓</td>
                <td class="check-cell">Teleport ✓</td>
                <td class="check-cell">Built-in ✓</td>
                <td class="x-cell">—</td>
              </tr>
              <tr>
                <td>Error Boundaries</td>
                <td class="elur-col check-cell">Built-in ✓</td>
                <td class="check-cell">Built-in ✓</td>
                <td class="x-cell">errorHandler</td>
                <td class="check-cell">Built-in ✓</td>
                <td class="x-cell">—</td>
              </tr>
              <tr>
                <td>Transitions</td>
                <td class="elur-col check-cell">Built-in ✓</td>
                <td class="x-cell">—</td>
                <td class="check-cell">Built-in ✓</td>
                <td class="x-cell">—</td>
                <td class="check-cell">Built-in ✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>

  <!-- Inspired By -->
  `);
}
