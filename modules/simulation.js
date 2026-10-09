/* 协作实验区：固定种子的合成任务与离散事件模型。无真实企业数据拟合。 */
(() => {
  'use strict';
  const SEED = 20261007;
  const STAGES = ['manual', 'ai', 'review', 'rework'];
  const LABELS = { manual: '人工初处理', ai: 'AI 辅助', review: '结果复核', rework: '人工返工' };
  const PRESETS = {
    balanced: { name: '协同成熟', coverage: 80, quality: 90, collaboration: 80, review: 85, humans: 4, aiSlots: 6 },
    reckless: { name: '盲目扩张', coverage: 95, quality: 15, collaboration: 15, review: 35, humans: 2, aiSlots: 10 },
    careful: { name: '谨慎引入', coverage: 30, quality: 75, collaboration: 65, review: 95, humans: 3, aiSlots: 3 }
  };
  const COLORS = { manual: '#6e88aa', ai: '#67a8ff', review: '#50d9c7', rework: '#ffac7b', error: '#ff8194' };
  const one = n => Number(n).toLocaleString('zh-CN', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  const pct = n => one(n) + '%';
  const sign = n => (n > 0 ? '+' : '') + pct(n);
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let active = null;
  let comparisonCache = [];
  let comparisonSequence = 0;

  function normalize(p = {}) {
    const n = (k, fallback, max = 100, min = 0) => clamp(Number.isFinite(Number(p[k])) ? Number(p[k]) : fallback, min, max);
    return {
      coverage: n('coverage', 80), quality: n('quality', 90), collaboration: n('collaboration', 80), review: n('review', 85),
      humans: Math.round(n('humans', 4, 8, 1)), aiSlots: Math.round(n('aiSlots', 6, 12, 1)),
      count: Number(p.count) === 300 ? 300 : 100, seed: SEED
    };
  }

  function random(seed) {
    let a = seed >>> 0;
    return () => {
      a += 0x6D2B79F5;
      let t = a;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function taskBatch(count) {
    const rand = random(SEED);
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1, complexity: .75 + .8 * rand(), routeU: rand(), errorU: rand(), reviewU: rand(), detectU: rand()
    }));
  }

  function runQueue(params, batch, traditional = false) {
    const c = traditional ? 0 : params.coverage / 100;
    const d = params.quality / 100, h = params.collaboration / 100, r = params.review / 100;
    const s = Math.sqrt(d * h);
    const tasks = batch.map(raw => {
      const ai = raw.routeU < c;
      const errorChance = ai ? clamp((.025 + .72 * (1 - s)) * raw.complexity, .02, .88) : clamp(.028 * raw.complexity, .015, .055);
      return { ...raw, ai, base: 5 + 4 * raw.complexity, errorChance, initialError: raw.errorU < errorChance,
        reviewed: raw.reviewU < r, detectionChance: clamp(.22 + .68 * r + .12 * h - .12 * (raw.complexity - 1), .1, .98),
        jobs: [], doneTime: Infinity, deliveredError: false, detected: false };
    });
    const queues = { manual: tasks.filter(t => !t.ai), ai: tasks.filter(t => t.ai), review: [], rework: [] };
    const humans = Array.from({ length: params.humans }, () => null);
    const aiWorkers = Array.from({ length: params.aiSlots }, () => null);
    const workload = { manual: 0, ai: 0, review: 0, rework: 0 };
    const jobs = [], milestones = [];
    let now = 0, finished = 0;

    const duration = (task, stage) => {
      if (stage === 'manual') return task.base;
      if (stage === 'ai') return task.base * (.22 + .45 * (1 - s) + .12 * (1 - d));
      if (stage === 'review') return task.base * (.08 + .18 * r + .10 * (1 - h));
      return task.base * (.65 + .85 * (1 - h) + .35 * (1 - d));
    };
    function start(task, stage, worker, pool) {
      const span = { taskId: task.id, stage, start: now, end: now + duration(task, stage), resource: worker + 1, pool };
      workload[stage] += span.end - span.start;
      task.jobs.push(span); jobs.push(span);
      return { task, span };
    }
    function dispatch() {
      for (let i = 0; i < humans.length; i++) {
        if (humans[i]) continue;
        const stage = ['rework', 'review', 'manual'].find(k => queues[k].length);
        if (stage) humans[i] = start(queues[stage].shift(), stage, i, 'human');
      }
      for (let i = 0; i < aiWorkers.length; i++) {
        if (!aiWorkers[i] && queues.ai.length) aiWorkers[i] = start(queues.ai.shift(), 'ai', i, 'ai');
      }
    }
    function finish(task, wrong) {
      task.doneTime = now; task.deliveredError = wrong; finished++;
    }
    function complete(job) {
      const task = job.task, stage = job.span.stage;
      if (stage === 'manual' || stage === 'ai') {
        if (task.reviewed) queues.review.push(task);
        else finish(task, task.initialError);
      } else if (stage === 'review') {
        task.detected = task.initialError && task.detectU < task.detectionChance;
        if (task.detected) queues.rework.push(task);
        else finish(task, task.initialError);
      } else {
        // 教学简化：一次人工返工能纠正已发现的错误。
        finish(task, false);
      }
    }

    dispatch();
    while (finished < tasks.length) {
      let next = Infinity;
      for (const job of [...humans, ...aiWorkers]) if (job) next = Math.min(next, job.span.end);
      if (!Number.isFinite(next)) throw new Error('模拟队列意外停止');
      now = next;
      for (const pool of [humans, aiWorkers]) {
        for (let i = 0; i < pool.length; i++) {
          if (pool[i] && pool[i].span.end <= now + 1e-8) {
            const job = pool[i]; pool[i] = null; complete(job);
          }
        }
      }
      milestones.push(now); dispatch();
    }
    const initialErrors = tasks.filter(t => t.initialError).length;
    const undetectedErrors = tasks.filter(t => t.deliveredError).length;
    const reviewed = tasks.filter(t => t.reviewed).length;
    const reworked = tasks.filter(t => t.detected).length;
    const humanWork = workload.manual + workload.review + workload.rework;
    return {
      tasks, jobs, milestones: [...new Set(milestones)], totalMinutes: now, workload, reviewed, reworked,
      initialErrors, undetectedErrors, firstPassRate: (1 - initialErrors / tasks.length) * 100,
      finalPassRate: (1 - undetectedErrors / tasks.length) * 100,
      humanUtilization: humanWork / (params.humans * now), aiUtilization: workload.ai / (params.aiSlots * now),
      humanWork, aiWork: workload.ai, synergy: s
    };
  }

  function evaluate(input = {}) {
    const params = normalize(input), batch = taskBatch(params.count);
    const result = runQueue(params, batch);
    const baseline = runQueue(params, batch, true);
    result.efficiency = (baseline.totalMinutes / result.totalMinutes - 1) * 100;
    result.qualityEfficiency = ((result.finalPassRate / 100) / (baseline.finalPassRate / 100) * baseline.totalMinutes / result.totalMinutes - 1) * 100;
    return { params, result, baseline };
  }

  function compact(model) {
    const { params, result: r, baseline: b } = model;
    return {
      params: { ...params }, totalMinutes: r.totalMinutes, baselineMinutes: b.totalMinutes,
      efficiencyPercent: r.efficiency, qualityAdjustedEfficiencyPercent: r.qualityEfficiency,
      firstPassPercent: r.firstPassRate, finalPassPercent: r.finalPassRate,
      aiRoutedTasks: r.tasks.filter(t=>t.ai).length,
      undetectedErrors: r.undetectedErrors, initialErrors: r.initialErrors, reviewed: r.reviewed, reworked: r.reworked,
      humanUtilizationPercent: r.humanUtilization * 100, aiUtilizationPercent: r.aiUtilization * 100, workloadMinutes: { ...r.workload }
    };
  }

  const CSS = `
.sim-lab{color:var(--ink,#ecf3ff);font-family:inherit}.sim-topline{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:22px}.sim-topline p{max-width:58ch;color:var(--muted,#a0b4d0);line-height:1.8}.sim-meta{display:flex;flex-wrap:wrap;gap:8px}.sim-meta span{border:1px solid var(--line,#29415f);padding:5px 10px;border-radius:999px;font-size:11px;color:var(--muted,#a0b4d0)}.sim-layout{display:grid;grid-template-columns:minmax(260px,.75fr) minmax(0,1.7fr);gap:24px}.sim-controls,.sim-board,.sim-chart-card,.sim-compare{border:1px solid var(--line,#29415f);border-radius:20px;background:var(--surface,rgba(18,41,70,.62));padding:24px;min-width:0}.sim-controls h3,.sim-board h3,.sim-chart-card h3{margin:0 0 10px;font-size:18px;letter-spacing:.02em}.sim-intro{font-size:12px;line-height:1.7;color:var(--muted,#a0b4d0);margin:0 0 18px}.sim-presets{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 25px}.sim-presets button{border:1px solid var(--line,#29415f);background:transparent;color:inherit;font:inherit;font-size:12px;padding:8px 10px;border-radius:8px;cursor:pointer}.sim-presets button[aria-pressed=true]{background:var(--blue,#67a8ff);color:#07162a;border-color:transparent}.sim-control{margin:0 0 20px}.sim-control label{display:flex;justify-content:space-between;align-items:center;gap:10px;font-size:13px;font-weight:650}.sim-control output{font-variant-numeric:tabular-nums;color:var(--teal,#50d9c7)}.sim-control input[type=range]{display:block;width:100%;margin:13px 0 7px;accent-color:var(--teal,#50d9c7);cursor:pointer}.sim-control small{display:block;color:var(--muted,#a0b4d0);font-size:11px;line-height:1.6}.sim-resources{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:22px 0 15px}.sim-select label{display:block;color:var(--muted,#a0b4d0);font-size:11px;margin-bottom:7px}.sim-select select{width:100%;border:1px solid var(--line,#29415f);border-radius:8px;padding:8px;color:inherit;background:var(--surface,#122946);font:inherit;font-size:12px}.sim-select select option{background:#122946;color:#e6f0ff}.sim-control-foot{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:18px}.sim-link{font:inherit;font-size:12px;background:none;border:0;color:var(--teal,#50d9c7);cursor:pointer;padding:6px 0;text-align:left;text-decoration:underline;text-underline-offset:4px}.sim-toolbar{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0}.sim-toolbar button,.sim-action{border:1px solid var(--line,#29415f);border-radius:9px;background:transparent;color:inherit;font:inherit;font-size:12px;cursor:pointer;padding:9px 12px}.sim-toolbar button.sim-play{background:var(--teal,#50d9c7);color:#07162a;border-color:transparent}.sim-toolbar button:disabled{opacity:.48;cursor:default}.sim-board-header{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.sim-time{font-size:30px;font-weight:750;letter-spacing:-.04em;font-variant-numeric:tabular-nums;white-space:nowrap}.sim-time small{font-size:11px;font-weight:400;letter-spacing:0;color:var(--muted,#a0b4d0);display:block;text-align:right}.sim-shared{font-size:11px;color:var(--muted,#a0b4d0);line-height:1.7;margin:6px 0 20px}.sim-pipeline{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.sim-lane{border:1px solid var(--line,#29415f);border-top:2px solid var(--lane-color);border-radius:10px;min-width:0;padding:12px 9px;background:rgba(7,22,42,.22);min-height:158px}.sim-lane h4{font-size:12px;margin:0 0 9px;color:var(--lane-color)}.sim-lane-head{display:flex;justify-content:space-between;gap:5px;color:var(--muted,#a0b4d0);font-size:10px}.sim-token-grid{display:flex;flex-wrap:wrap;align-content:flex-start;gap:4px;min-height:65px;margin-top:12px}.sim-token{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;font-size:8px;border:1px solid var(--lane-color);border-radius:5px;color:var(--lane-color);font-variant-numeric:tabular-nums;background:rgba(7,22,42,.4)}.sim-token.sim-running{background:var(--lane-color);color:#07162a;box-shadow:0 0 10px color-mix(in srgb,var(--lane-color) 25%,transparent)}.sim-more{font-size:10px;color:var(--muted,#a0b4d0);padding:4px}.sim-lane-count{font-size:10px;color:var(--muted,#a0b4d0);margin-top:8px;line-height:1.6}.sim-empty{font-size:10px;color:var(--muted,#a0b4d0);line-height:1.8}.sim-delivery{margin-top:13px;border:1px solid var(--line,#29415f);border-radius:11px;padding:13px;display:flex;justify-content:space-between;align-items:center;gap:18px}.sim-delivery h4{margin:0 0 5px;font-size:12px}.sim-delivery p{margin:0;font-size:11px;color:var(--muted,#a0b4d0)}.sim-delivery strong{color:var(--teal,#50d9c7);font-size:21px;font-variant-numeric:tabular-nums}.sim-delivery strong small{font-size:12px;color:var(--muted,#a0b4d0)}.sim-progress{height:4px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden;margin:16px 0}.sim-progress span{height:100%;display:block;background:var(--teal,#50d9c7);width:0;transition:width .18s linear}.sim-feedback{min-height:38px;font-size:12px;line-height:1.7;color:var(--muted,#a0b4d0)}.sim-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:22px}.sim-metric{border-top:1px solid var(--line,#29415f);padding-top:13px;min-width:0}.sim-metric span{font-size:11px;color:var(--muted,#a0b4d0);display:block;line-height:1.5}.sim-metric strong{display:block;font-size:24px;margin:5px 0;font-variant-numeric:tabular-nums;font-weight:700}.sim-metric small{font-size:10px;color:var(--muted,#a0b4d0);display:block;line-height:1.6}.sim-warning{color:var(--coral,#ff8194)!important}.sim-archive-actions{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;border-top:1px solid var(--line,#29415f);margin-top:23px;padding-top:17px}.sim-archive-actions p{margin:0;color:var(--muted,#a0b4d0);font-size:11px}.sim-chart-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:24px}.sim-chart{height:310px;width:100%;min-width:0}.sim-chart-card p{font-size:11px;color:var(--muted,#a0b4d0);line-height:1.7;margin:0 0 10px}.sim-chart-title{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.sim-chart-title select{max-width:120px;border:1px solid var(--line,#29415f);color:inherit;background:var(--surface,#122946);border-radius:6px;font:inherit;font-size:11px;padding:5px}.sim-chart-title select option{background:#122946}.sim-bottleneck{font-size:12px;line-height:1.8;color:var(--muted,#a0b4d0);border-top:1px solid var(--line,#29415f);padding-top:12px}.sim-bottleneck b{color:var(--ink,#ecf3ff);font-weight:600}.sim-compare{margin-top:24px}.sim-compare h3{font-size:18px;margin:0 0 8px}.sim-compare p{font-size:11px;color:var(--muted,#a0b4d0);line-height:1.7;margin:0 0 16px}.sim-compare-scroll{overflow-x:auto}.sim-compare table{border-collapse:collapse;width:100%;min-width:460px;font-size:11px}.sim-compare th,.sim-compare td{padding:11px 12px;border-bottom:1px solid var(--line,#29415f);text-align:right;line-height:1.6;vertical-align:middle}.sim-compare th:first-child,.sim-compare td:first-child{text-align:left}.sim-compare th{color:var(--teal,#50d9c7);font-weight:600}.sim-compare td{color:var(--muted,#a0b4d0)}.sim-model-dialog{color:var(--ink,#ecf3ff);background:#0c213b;border:1px solid var(--line,#29415f);border-radius:22px;width:min(820px,calc(100vw - 32px));max-height:88vh;padding:28px;overflow:auto}.sim-model-dialog::backdrop{background:rgba(0,9,24,.78);backdrop-filter:blur(5px)}.sim-dialog-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:20px}.sim-dialog-heading h3{font-size:25px;line-height:1.4;margin:0 0 14px}.sim-model-dialog h4{font-size:15px;margin:24px 0 10px}.sim-model-dialog p,.sim-model-dialog li{font-size:12px;line-height:1.9;color:var(--muted,#a0b4d0)}.sim-model-dialog ul,.sim-model-dialog ol{padding-left:22px}.sim-model-dialog code{color:var(--teal,#50d9c7);font:inherit}.sim-model-dialog button{flex-shrink:0}.sim-note{font-size:11px;color:var(--muted,#a0b4d0);line-height:1.8;margin-top:20px}.sim-lab button:focus-visible,.sim-lab input:focus-visible,.sim-lab select:focus-visible,.sim-model-dialog button:focus-visible{outline:2px solid var(--teal,#50d9c7);outline-offset:3px}.sim-lab [hidden]{display:none!important}@media(max-width:1080px){.sim-layout{grid-template-columns:minmax(220px,.7fr) minmax(0,1.3fr)}.sim-controls,.sim-board{padding:18px}.sim-pipeline{grid-template-columns:repeat(2,minmax(0,1fr))}.sim-lane{min-height:125px}.sim-metric strong{font-size:21px}}@media(max-width:760px){.sim-layout,.sim-chart-grid{grid-template-columns:1fr}.sim-topline{display:block}.sim-topline p{font-size:12px}.sim-controls,.sim-board,.sim-chart-card,.sim-compare{padding:18px;border-radius:15px}.sim-time{font-size:26px}.sim-metrics{gap:12px}.sim-metric strong{font-size:20px}.sim-chart{height:285px}.sim-toolbar button{flex:1;white-space:nowrap;padding:9px 7px;font-size:11px}.sim-chart-title{flex-wrap:wrap}.sim-topline .sim-meta{margin-top:14px}}@media(max-width:380px){.sim-metrics{grid-template-columns:1fr 1fr}.sim-board-header{flex-wrap:wrap}.sim-time small{text-align:left}.sim-controls,.sim-board{padding:14px}}@media(prefers-reduced-motion:reduce){.sim-progress span{transition:none}}
`;

  function markup() {
    const range = (key, name, help) => `<div class="sim-control"><label for="sim-${key}">${name}<output id="sim-${key}-value" for="sim-${key}"></output></label><input id="sim-${key}" data-sim-param="${key}" type="range" min="0" max="100" step="1" value="${PRESETS.balanced[key]}"><small>${help}</small></div>`;
    const opts = n => Array.from({ length: n }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('');
    return `<div class="sim-lab">
      <div class="sim-topline"><p>把同一批任务交给不同的协作方式。看见资源争用、复核和返工如何改变时间，再追问：更快交付，是否意味着更可靠？</p><div class="sim-meta"><span>合成教学实验</span><span>固定种子 ${SEED}</span><span>离散事件队列</span></div></div>
      <div class="sim-layout"><div class="sim-controls panel"><h3>配置你的协作方案</h3><p class="sim-intro">每次使用相同的任务难度与随机序列。改变一个条件，比较同一批任务的不同结果。</p>
      <div class="sim-presets" role="group" aria-label="协作方案预设">${Object.entries(PRESETS).map(([key, p]) => `<button type="button" data-sim-preset="${key}" aria-pressed="${key === 'balanced'}">${p.name}</button>`).join('')}</div>
      ${range('coverage','AI 任务覆盖','按该概率分流，实际 AI 任务数在结果中注明。')}${range('quality','数据质量','影响 AI 处理速度与初始错误概率。')}${range('collaboration','协作能力','影响 AI 配合、人工复核与返工耗时。')}${range('review','复核强度','提高抽检概率和检出能力，实际抽检数会波动；占用人工资源。')}
      <div class="sim-resources"><div class="sim-select"><label for="sim-humans">人类处理资源</label><select id="sim-humans" data-sim-param="humans">${opts(8)}</select></div><div class="sim-select"><label for="sim-aiSlots">AI 并发通道</label><select id="sim-aiSlots" data-sim-param="aiSlots">${opts(12)}</select></div></div>
      <div class="sim-select"><label for="sim-count">合成任务队列</label><select id="sim-count" data-sim-param="count"><option value="100">100 项标准化任务</option><option value="300">300 项标准化任务</option></select></div>
      <div class="sim-control-foot"><button type="button" class="sim-link" data-sim-action="method">打开模型假设与算法</button></div></div>
      <div class="sim-board panel"><div class="sim-board-header"><div><div class="eyebrow">协作任务流水线</div><h3>任务在队列中流动</h3></div><div class="sim-time"><span data-sim-current-time>0.0</span><small>虚拟分钟 · 当前进度</small></div></div>
      <p class="sim-shared" data-sim-shared></p><div class="sim-pipeline">${STAGES.map(stage => `<section class="sim-lane" style="--lane-color:${COLORS[stage]}" data-sim-lane="${stage}"><h4>${LABELS[stage]}</h4><div class="sim-lane-head"><span data-sim-queued>等待 0</span><span data-sim-busy>处理中 0</span></div><div class="sim-token-grid" data-sim-tokens></div><div class="sim-lane-count" data-sim-stage-summary></div></section>`).join('')}</div>
      <div class="sim-delivery"><div><h4>交付区</h4><p data-sim-delivery-note>尚未完成任务</p></div><strong><span data-sim-completed>0</span><small data-sim-total></small></strong></div><div class="sim-progress" role="progressbar" aria-label="合成任务完成进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div>
      <div class="sim-toolbar"><button type="button" class="sim-play" data-sim-action="play">播放过程</button><button type="button" data-sim-action="step">推进一个事件</button><button type="button" data-sim-action="finish">直接查看结果</button><button type="button" data-sim-action="reset">重置过程</button></div><div class="sim-feedback" role="status" data-sim-feedback></div>
      <div class="sim-metrics"><div class="sim-metric"><span>估计总耗时</span><strong data-sim-metric="time"></strong><small data-sim-baseline></small></div><div class="sim-metric"><span>一次合格率</span><strong data-sim-metric="first"></strong><small>初处理后即正确的任务比例</small></div><div class="sim-metric"><span>未检出错误</span><strong data-sim-metric="errors"></strong><small>完整队列交付后仍存在的错误</small></div><div class="sim-metric"><span>完成量效率变化</span><strong data-sim-metric="efficiency"></strong><small>相对同资源、同复核的传统基准</small></div><div class="sim-metric"><span>最终合格率</span><strong data-sim-metric="final"></strong><small>包含已检出并经返工修正的任务</small></div><div class="sim-metric"><span>质量调整后效率</span><strong data-sim-metric="qualityEfficiency"></strong><small>仅比较正确任务的单位时间完成量</small></div></div>
      <div class="sim-archive-actions"><div><button type="button" class="sim-action button primary" data-sim-action="save">保存当前方案</button> <button type="button" class="sim-action" data-sim-action="export">导出结果 JSON</button></div><p data-sim-saved>保存两组方案后并排比较</p></div></div></div>
      <div class="sim-chart-grid"><section class="sim-chart-card panel"><h3>时间花在哪</h3><p>累计忙碌时间 ÷ 对应资源数，单位为分钟。并行通道不可相加为总耗时。</p><div class="sim-chart" data-sim-chart="workload" role="img" aria-label="传统与当前方案的各阶段资源负载堆叠图"></div><div class="sim-bottleneck" data-sim-bottleneck></div></section>
      <section class="sim-chart-card panel"><div class="sim-chart-title"><h3>一个条件，改变多少</h3><select data-sim-sensitivity aria-label="选择敏感性分析条件"><option value="coverage">AI 覆盖</option><option value="quality">数据质量</option><option value="collaboration">协作能力</option><option value="review">复核强度</option></select></div><p>其余配置不变，每 10 个百分点重跑同一任务队列；折线连接离散试验点，不是预测置信区间。</p><div class="sim-chart" data-sim-chart="sensitivity" role="img" aria-label="单个参数变化时总耗时与未检出错误率的敏感性折线图"></div><div class="sim-bottleneck" data-sim-sensitivity-note></div></section></div>
      <section class="sim-compare panel" data-sim-comparison hidden><h3>把两组方案放在一起</h3><p>固定种子相同。任务数或资源不同时，原始总耗时不能直接归因于 AI；请同时查看每 100 项耗时、配置和最终质量。</p><div class="sim-compare-scroll" data-sim-compare-table></div></section>
      <p class="sim-note">这些任务、错误概率与时长均为合成教学设定，系数未经真实企业数据拟合。合格与错误来自模型内部真值；现实部署还需要独立验证。实验不代表真实生产率、成本、岗位变化或经营收益。</p>
      <dialog class="sim-model-dialog" data-sim-dialog aria-labelledby="sim-model-title"><div class="sim-dialog-heading"><h3 id="sim-model-title">我们怎样模拟协作</h3><button type="button" class="sim-action" data-sim-action="close-method" aria-label="关闭模型假设">关闭</button></div>
      <p>本实验是自建的离散事件教学模型。所有系数未经过企业样本拟合；虚拟分钟仅表达同一任务集内的相对耗时，不对应现实工时承诺。</p><h4>固定任务与共同随机数</h4><p>使用种子 <code>${SEED}</code> 和 Mulberry32 伪随机生成器。每项任务固定生成难度 x∈[0.75,1.55)、AI 路由阈值、初始错误阈值、抽检阈值与检出阈值，均服从均匀分布 U(0,1)。300 项队列的前 100 项与 100 项队列完全相同。重跑、参数扫描和传统基准始终复用这批阈值，不另换样本。</p>
      <h4>参数与单项时长</h4><p>c=覆盖、d=质量、h=协作、r=复核，滑块除以100后取0至1。s=√(d×h)，基础人工时长 b=5+4x 分钟。H 为人工资源数，A 为 AI 并发通道数。</p><ul><li>AI 路由：路由阈值 &lt; c；否则人工初处理。</li><li>人工初处理：<code>b</code>；AI 初处理：<code>b × [0.22+0.45(1−s)+0.12(1−d)]</code>。</li><li>复核：<code>b × [0.08+0.18r+0.10(1−h)]</code>。</li><li>返工：<code>b × [0.65+0.85(1−h)+0.35(1−d)]</code>。</li></ul>
      <h4>错误与复核</h4><ul><li>人工初始错误概率：<code>clamp(0.028x,0.015,0.055)</code>。</li><li>AI 初始错误概率：<code>clamp([0.025+0.72(1−s)]x,0.02,0.88)</code>。固定错误阈值低于概率时发生错误。</li><li>抽检阈值 &lt; r 时复核。错误检出概率：<code>clamp(0.22+0.68r+0.12h−0.12(x−1),0.10,0.98)</code>。</li><li>被检出的错误进入人工返工；未被抽检或抽检后仍漏检的错误进入交付区。教学简化假设一次返工可以修正已发现的错误，没有模拟新错误或误报。</li></ul>
      <h4>事件调度与资源争用</h4><ol><li>任务在虚拟时间0同时到达，进入人工或 AI 初处理队列。AI 使用独立 A 个通道，人工初处理、复核与返工共享 H 个处理资源。</li><li>资源空闲时按“返工→复核→人工初处理”优先级取任务；每条队列内部先进先出。正在处理的任务不会被抢占。</li><li>推进至下一项任务完成时刻，释放资源并将任务分流到下一队列。同刻事件按人工资源编号，再按 AI 资源编号确定处理顺序，再统一分派空闲资源。</li><li>最后一项任务交付时刻就是总耗时 T。不是阶段均值的简单相加。动画是这套完整事件轨迹的回放，不在背景连续运行。</li></ol>
      <h4>传统基准与指标</h4><p>传统基准将 c 设为0，保持同一任务集、H、d、h、r 与同样的复核/返工机制。A 不影响纯人工基准。一次合格率=初处理正确项数÷N；最终合格率=(N−未检出错误数)÷N。完成量效率变化=<code>(T基准/T−1)×100%</code>；质量调整后效率=<code>[(最终合格率/基准最终合格率)×T基准/T−1]×100%</code>。资源利用率=累计忙碌时间÷(资源数×T)。图中资源平均负载=累计忙碌时间÷资源数，两种资源并行，不能将它们相加当成T。</p>
      <h4>还没有模拟什么</h4><p>任务间依赖、到达高峰、模型排队服务费、设备和能源、岗位替代、结果价值差异、难以识别的系统性偏差、学习效应与返工后新错误均未纳入。质量真值在教学模型中已知，现实中不能仅凭模型自身判断正确。这里展示的是约束与取舍，需要真实场景试验才能验证实际收益。</p></dialog>
    </div>`;
  }

  function mount(root, api = {}) {
    destroy();
    if (typeof root === 'string') root = document.querySelector(root);
    if (!root || typeof root.querySelector !== 'function') throw new Error('SimLab.mount 需要有效的容器');
    const abort = new AbortController(), timers = new Set(), urls = new Set(), charts = new Map();
    const style = document.createElement('style'); style.dataset.simStyle = ''; style.textContent = CSS; document.head.append(style);
    root.innerHTML = markup();
    const $ = q => root.querySelector(q), $$ = q => [...root.querySelectorAll(q)];
    let params = normalize(PRESETS.balanced), model = null, time = 0, playing = false, playTimer = null, chartTimer = null;
    let sensitivityKey = 'coverage';
    const notify = msg => { if (typeof api.notify === 'function') api.notify(msg); };
    function stop() {
      playing = false;
      if (playTimer !== null) { clearInterval(playTimer); timers.delete(playTimer); playTimer = null; }
      $('[data-sim-action="play"]').textContent = time >= model?.result.totalMinutes ? '重新播放' : '播放过程';
    }
    function readParams() {
      const p = {};
      $$('[data-sim-param]').forEach(el => { p[el.dataset.simParam] = Number(el.value); });
      return normalize(p);
    }
    function updateControls() {
      $$('[data-sim-param]').forEach(el => { el.value = params[el.dataset.simParam]; });
      ['coverage','quality','collaboration','review'].forEach(key => $('#sim-'+key+'-value').textContent = params[key]+'%');
      $$('[data-sim-preset]').forEach(b => {
        const preset = PRESETS[b.dataset.simPreset];
        b.setAttribute('aria-pressed', String(Object.keys(preset).filter(k=>k!=='name').every(k=>params[k]===preset[k])));
      });
      $('[data-sim-shared]').textContent = `人工初处理、复核、返工共用 ${params.humans} 位处理资源；AI 有 ${params.aiSlots} 个独立并发通道。编号表示同一批合成任务。`;
    }
    function snapshot() {
      const stages = Object.fromEntries(STAGES.map(k=>[k,{ busy:[], queued:[], finished:0 }]));
      let done = 0, wrong = 0;
      for (const task of model.result.tasks) {
        if (task.doneTime <= time + 1e-8) { done++; if (task.deliveredError) wrong++; }
        for (const job of task.jobs) if (job.end <= time + 1e-8) stages[job.stage].finished++;
        if (task.doneTime <= time + 1e-8) continue;
        const next = task.jobs.find(job=>job.end>time+1e-8);
        if (next) stages[next.stage][next.start<=time+1e-8?'busy':'queued'].push(task.id);
      }
      return { stages, done, wrong };
    }
    function renderFrame() {
      const snap = snapshot(), finished = time >= model.result.totalMinutes - 1e-8;
      $('[data-sim-current-time]').textContent = one(time);
      STAGES.forEach(stage => {
        const lane = $(`[data-sim-lane="${stage}"]`), data=snap.stages[stage];
        lane.querySelector('[data-sim-queued]').textContent = `等待 ${data.queued.length}`;
        lane.querySelector('[data-sim-busy]').textContent = `处理中 ${data.busy.length}`;
        const show=[...data.busy.map(id=>({id,running:true})),...data.queued.map(id=>({id,running:false}))].slice(0,12);
        lane.querySelector('[data-sim-tokens]').innerHTML = show.length ? show.map(t=>`<span class="sim-token${t.running?' sim-running':''}" title="任务 ${t.id} · ${t.running?'处理中':'排队'}">${String(t.id).padStart(3,'0')}</span>`).join('')+(data.busy.length+data.queued.length>12?`<span class="sim-more">+${data.busy.length+data.queued.length-12}</span>`:'') : '<span class="sim-empty">本时刻没有任务</span>';
        lane.querySelector('[data-sim-stage-summary]').textContent = `已完成本阶段 ${data.finished} 项`;
      });
      $('[data-sim-completed]').textContent = snap.done;
      $('[data-sim-total]').textContent = ` / ${params.count}`;
      $('[data-sim-delivery-note]').textContent = snap.done ? `其中 ${snap.wrong} 项错误仍未检出；真值来自教学模型` : '尚未完成任务，等待第一项交付';
      const progress=snap.done/params.count*100, bar=$('.sim-progress');
      bar.setAttribute('aria-valuenow',String(Math.round(progress))); bar.querySelector('span').style.width=progress+'%';
      $('[data-sim-action="step"]').disabled=finished;
      $('[data-sim-action="finish"]').disabled=finished;
      if(!playing)$('[data-sim-action="play"]').textContent=finished?'重新播放':'播放过程';
      $('[data-sim-feedback]').textContent = finished ? `这批任务已完成。${model.result.reworked} 项检出错误经过返工，${model.result.undetectedErrors} 项错误仍被交付。时间效率与质量需要一起判断。` : time===0 ? '完整轨迹已生成。点击播放或按事件推进；页面不会自动开始回放。' : `正在回放固定轨迹：已交付 ${snap.done} 项。实心任务为处理中，空心任务为排队；不同阶段共享的人工资源可能形成瓶颈。`;
    }
    function renderMetrics() {
      const r=model.result,b=model.baseline;
      $('[data-sim-shared]').textContent=`人工初处理、复核、返工共用 ${params.humans} 位处理资源；AI 有 ${params.aiSlots} 个独立并发通道。本批 AI 分流 ${r.tasks.filter(t=>t.ai).length}/${params.count} 项，实际抽检 ${r.reviewed} 项。`;
      $('[data-sim-metric="time"]').textContent=one(r.totalMinutes)+' min';
      $('[data-sim-baseline]').textContent=`传统基准 ${one(b.totalMinutes)} min`;
      $('[data-sim-metric="first"]').textContent=pct(r.firstPassRate);
      $('[data-sim-metric="errors"]').textContent=r.undetectedErrors+' 项';
      $('[data-sim-metric="errors"]').classList.toggle('sim-warning',r.undetectedErrors>params.count*.1);
      $('[data-sim-metric="efficiency"]').textContent=sign(r.efficiency);
      $('[data-sim-metric="final"]').textContent=pct(r.finalPassRate);
      $('[data-sim-metric="qualityEfficiency"]').textContent=sign(r.qualityEfficiency);
      $('[data-sim-metric="qualityEfficiency"]').classList.toggle('sim-warning',r.qualityEfficiency<0);
      const humanBottleneck=r.humanUtilization>=r.aiUtilization;
      const busiest=['manual','review','rework'].sort((a,b)=>r.workload[b]-r.workload[a])[0];
      $('[data-sim-bottleneck]').innerHTML=`<b>${humanBottleneck?'人工共享资源压力较大':'AI 并发通道压力较大'}</b> · 人工利用率 ${pct(r.humanUtilization*100)}，AI 利用率 ${pct(r.aiUtilization*100)}。人工负载中，${LABELS[busiest]}占比最高。利用率提示容量约束，不证明现实中的因果瓶颈。`;
    }
    function chart(key, option) {
      const old=charts.get(key);
      if (old && !old.isDisposed?.()) { old.setOption(option,true); return; }
      const el=$(`[data-sim-chart="${key}"]`);
      if (typeof api.chart==='function') {
        const instance=api.chart(el,option); if(instance) charts.set(key,instance);
      } else el.textContent='此图表需要展厅图表引擎。数值与队列模拟仍可使用。';
    }
    function baseChart() {
      return { animation:false, backgroundColor:'transparent', textStyle:{fontFamily:'inherit',color:'#b4c7df',fontSize:11}, tooltip:{trigger:'axis',backgroundColor:'#0c213b',borderColor:'#29415f',textStyle:{color:'#edf4ff',fontSize:11}}, grid:{left:80,right:30,top:55,bottom:40}, legend:{top:5,textStyle:{color:'#b4c7df',fontSize:10}}, aria:{enabled:true} };
    }
    function renderWorkload() {
      const r=model.result,b=model.baseline,H=params.humans,A=params.aiSlots;
      chart('workload', { ...baseChart(), xAxis:{type:'value',name:'平均忙碌分钟',nameLocation:'middle',nameGap:26,axisLabel:{color:'#a6bedb',fontSize:10},splitLine:{lineStyle:{color:'rgba(141,168,204,.16)'}}},yAxis:{type:'category',data:['传统 · 人类','当前 · 人类','当前 · AI'],axisLabel:{color:'#b4c7df',fontSize:10},axisTick:{show:false},axisLine:{show:false}},series:STAGES.map(stage=>({ name:LABELS[stage],type:'bar',stack:'busy',barMaxWidth:28,itemStyle:{color:COLORS[stage]},data:[stage==='ai'?0:b.workload[stage]/H,stage==='ai'?0:r.workload[stage]/H,stage==='ai'?r.workload.ai/A:0] })) });
    }
    function renderSensitivity() {
      const rows=Array.from({length:11},(_,i)=>{const val=i*10;const m=evaluate({...params,[sensitivityKey]:val});return {value:val,time:m.result.totalMinutes,errors:m.result.undetectedErrors/params.count*100};});
      chart('sensitivity',{...baseChart(),grid:{left:50,right:50,top:55,bottom:45},xAxis:{type:'category',data:rows.map(x=>x.value+'%'),axisLabel:{color:'#a6bedb',fontSize:10},axisLine:{lineStyle:{color:'#29415f'}},axisTick:{show:false}},yAxis:[{type:'value',name:'总耗时 min',nameTextStyle:{color:'#a6bedb',fontSize:10},axisLabel:{color:'#a6bedb',fontSize:10},splitLine:{lineStyle:{color:'rgba(141,168,204,.16)'}}},{type:'value',name:'漏检率 %',min:0,max:100,nameTextStyle:{color:'#a6bedb',fontSize:10},axisLabel:{color:'#a6bedb',fontSize:10},splitLine:{show:false}}],series:[{name:'总耗时',type:'line',data:rows.map(x=>x.time),symbolSize:5,smooth:false,lineStyle:{width:2},itemStyle:{color:'#67a8ff'}},{name:'未检出错误率',type:'line',yAxisIndex:1,data:rows.map(x=>x.errors),symbolSize:5,smooth:false,lineStyle:{width:2,type:'dashed'},itemStyle:{color:'#ff8194'}}]});
      const a=rows[0],b=rows[10];
      $('[data-sim-sensitivity-note]').textContent=`${({coverage:'AI 覆盖',quality:'数据质量',collaboration:'协作能力',review:'复核强度'})[sensitivityKey]}从0%到100%：总耗时 ${one(a.time)}→${one(b.time)} min，未检出错误率 ${pct(a.errors)}→${pct(b.errors)}。离散点可能跳变，源自同一批任务的路由与检出阈值。`;
    }
    function renderComparison() {
      const saved=comparisonCache;
      $('[data-sim-saved]').textContent=saved.length?`已保存 ${saved.length} 组方案${saved.length<2?'，再保存一组开始比较':''}`:'保存两组方案后并排比较';
      $('[data-sim-comparison]').hidden=saved.length<2;
      if(saved.length<2)return;
      const defs=[['AI 覆盖 / 数据 / 协作 / 复核',s=>[s.params.coverage,s.params.quality,s.params.collaboration,s.params.review].join(' / ')+'%'],['任务 / 人类 / AI 并发',s=>`${s.params.count} / ${s.params.humans} / ${s.params.aiSlots}`],['总耗时',s=>one(s.totalMinutes)+' min'],['每100项耗时',s=>one(s.totalMinutes/s.params.count*100)+' min'],['一次合格率',s=>pct(s.firstPassPercent)],['最终合格率',s=>pct(s.finalPassPercent)],['未检出错误',s=>s.undetectedErrors+' 项'],['人工返工',s=>s.reworked+' 项'],['完成量效率变化',s=>sign(s.efficiencyPercent)],['质量调整后效率',s=>sign(s.qualityAdjustedEfficiencyPercent)]];
      $('[data-sim-compare-table]').innerHTML=`<table><thead><tr><th scope="col">比较指标</th>${saved.map(s=>`<th scope="col">${esc(s.name)}</th>`).join('')}</tr></thead><tbody>${defs.map(([name,fmt])=>`<tr><th scope="row">${name}</th>${saved.map(s=>`<td>${esc(fmt(s))}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    }
    function recompute() {
      stop();params=readParams();model=evaluate(params);time=0;updateControls();renderMetrics();renderFrame();renderWorkload();
      if(chartTimer!==null){clearTimeout(chartTimer);timers.delete(chartTimer);}
      chartTimer=setTimeout(()=>{timers.delete(chartTimer);chartTimer=null;renderSensitivity();},120);timers.add(chartTimer);
    }
    function download() {
      const data={kind:'synthetic-teaching-simulation',modelVersion:'collaboration-queue-v1',createdAt:new Date().toISOString(),seed:SEED,assumptions:'合成任务、固定随机数、未拟合的教学系数；非真实企业预测。一次人工返工修正已发现错误，未模拟误报或新错误。',modelSpecification:{generator:'Mulberry32',complexity:'x=0.75+0.8*U',base:'b=5+4*x',synergy:'s=sqrt(d*h)',manualMinutes:'b',aiMinutes:'b*(0.22+0.45*(1-s)+0.12*(1-d))',reviewMinutes:'b*(0.08+0.18*r+0.10*(1-h))',reworkMinutes:'b*(0.65+0.85*(1-h)+0.35*(1-d))',manualErrorChance:'clamp(0.028*x,0.015,0.055)',aiErrorChance:'clamp((0.025+0.72*(1-s))*x,0.02,0.88)',detectionChance:'clamp(0.22+0.68*r+0.12*h-0.12*(x-1),0.10,0.98)',humanQueuePriority:['rework','review','manual'],policy:'FIFO within stage; non-preemptive; all tasks arrive at 0; baseline coverage=0 with other conditions held fixed'},...compact(model),timeline:model.result.jobs,taskOutcomes:model.result.tasks.map(t=>({id:t.id,complexity:t.complexity,routeThreshold:t.routeU,errorThreshold:t.errorU,reviewThreshold:t.reviewU,detectionThreshold:t.detectU,ai:t.ai,reviewed:t.reviewed,initialError:t.initialError,detected:t.detected,undetectedError:t.deliveredError,completedAt:t.doneTime}))};
      const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}));urls.add(url);
      const a=document.createElement('a');a.href=url;a.download=`协作实验_${params.count}任务_${SEED}.json`;document.body.append(a);a.click();a.remove();
      const id=setTimeout(()=>{URL.revokeObjectURL(url);urls.delete(url);timers.delete(id);},1000);timers.add(id);notify('当前参数、结果与事件轨迹已导出 JSON');
    }
    function save() {
      const value=compact(model),name=`方案 ${++comparisonSequence}`;
      const record={...value,id:'sim-'+Date.now()+'-'+comparisonSequence,name,title:'协作实验 '+name,kind:'simulation',type:'simulation',createdAt:new Date().toISOString(),seed:SEED,modelVersion:'collaboration-queue-v1',label:'合成教学模拟',summary:`${params.count}项任务 · ${one(value.totalMinutes)}分钟 · 最终合格率${pct(value.finalPassPercent)}`};
      comparisonCache.push(record);if(comparisonCache.length>4)comparisonCache.shift();renderComparison();
      try{if(typeof api.saveScenario==='function')Promise.resolve(api.saveScenario(record)).then(()=>notify('方案已保存到探索档案；已保存方案可并排比较')).catch(()=>notify('当前方案已保存在本页；探索档案暂未写入'));else notify('当前方案已保存在本页，可以并排比较');}catch(_){notify('当前方案已保存在本页；探索档案暂未写入');}
    }
    function onAction(action) {
      if(action==='play') {
        if(playing){stop();return;}
        if(time>=model.result.totalMinutes)time=0;
        playing=true;$('[data-sim-action="play"]').textContent='暂停过程';
        playTimer=setInterval(()=>{time=Math.min(model.result.totalMinutes,time+model.result.totalMinutes/60);renderFrame();if(time>=model.result.totalMinutes)stop();},250);timers.add(playTimer);
      } else if(action==='step') {stop();time=model.result.milestones.find(t=>t>time+1e-8)??model.result.totalMinutes;renderFrame();}
      else if(action==='finish'){stop();time=model.result.totalMinutes;renderFrame();$('[data-sim-action="play"]').textContent='重新播放';}
      else if(action==='reset'){stop();time=0;renderFrame();}
      else if(action==='save')save();
      else if(action==='export')download();
      else if(action==='method'){const d=$('[data-sim-dialog]');if(typeof d.showModal==='function')d.showModal();else d.setAttribute('open','');}
      else if(action==='close-method'){const d=$('[data-sim-dialog]');if(typeof d.close==='function')d.close();else d.removeAttribute('open');}
    }
    root.addEventListener('click',e=>{
      const button=e.target.closest('button');if(!button||!root.contains(button))return;
      if(button.dataset.simPreset){const p=PRESETS[button.dataset.simPreset];params=normalize({...p,count:params.count});updateControls();recompute();}
      else if(button.dataset.simAction)onAction(button.dataset.simAction);
    },{signal:abort.signal});
    root.addEventListener('input',e=>{if(e.target.matches('input[data-sim-param]'))recompute();},{signal:abort.signal});
    root.addEventListener('change',e=>{if(e.target.matches('select[data-sim-param]'))recompute();if(e.target.matches('[data-sim-sensitivity]')){sensitivityKey=e.target.value;renderSensitivity();}},{signal:abort.signal});
    const dialog=$('[data-sim-dialog]');dialog.addEventListener('click',e=>{if(e.target===dialog){const box=dialog.getBoundingClientRect();if(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom)dialog.close();}},{signal:abort.signal});
    const resize=()=>{for(const instance of charts.values())if(!instance.isDisposed?.())instance.resize?.();};
    window.addEventListener('resize',resize,{signal:abort.signal});
    let observer=null;if(typeof ResizeObserver==='function'){observer=new ResizeObserver(resize);observer.observe(root);}
    active={root,abort,timers,urls,charts,style,observer,getState:()=>({params:{...params},currentTime:time,playing,result:compact(model),saved:comparisonCache.map(s=>({...s}))})};
    updateControls();model=evaluate(params);renderMetrics();renderFrame();renderWorkload();renderSensitivity();renderComparison();
    const handle=active;
    return {destroy:()=>{if(active===handle)destroy();},getState:()=>active===handle?handle.getState():null};
  }

  function destroy() {
    if(!active)return;
    active.abort.abort();active.observer?.disconnect();
    for(const id of active.timers){clearInterval(id);clearTimeout(id);}
    for(const url of active.urls)URL.revokeObjectURL(url);
    for(const instance of active.charts.values())try{if(!instance.isDisposed?.())instance.dispose?.();}catch(_){}
    const dialog=active.root.querySelector('[data-sim-dialog]');if(dialog?.open)dialog.close?.();
    active.root.innerHTML='';active.style.remove();active=null;
  }

  window.SimLab={mount,destroy,evaluate:(params)=>compact(evaluate(params)),getState:()=>active?.getState()??null};
})();
