<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';

  type Ledger = {
    id: number;
    date: string;
    deposit: number;
    content: string;
    cost: number;
    paymentMethod: string;
    incidental: number;
    partsPurchase: number;
    partsSales: number;
    meals: number;
  };

  let ledgers = $state<Ledger[]>([]);
  let loading = $state(true);
  let saving = $state(false);

  let newLedger = $state({
    date: '',
    deposit: 0,
    content: '',
    cost: 0,
    paymentMethod: '카드',
    incidental: 0,
    partsPurchase: 0,
    partsSales: 0,
    meals: 0
  });

  onMount(async () => {
    await fetchLedgers();
  });

  async function fetchLedgers() {
    loading = true;
    const { data, error } = await supabase
      .from('ledgers')
      .select('*')
      .order('date', { ascending: false });
    if (!error && data) {
      ledgers = data.map(l => ({
        id: l.id,
        date: l.date,
        deposit: l.deposit,
        content: l.content,
        cost: l.cost,
        paymentMethod: l.payment_method,
        incidental: l.incidental,
        partsPurchase: l.parts_purchase,
        partsSales: l.parts_sales,
        meals: l.meals
      }));
    }
    loading = false;
  }

  async function addLedger(e: Event) {
    e.preventDefault();
    saving = true;
    const { error } = await supabase.from('ledgers').insert([{
      date: newLedger.date,
      deposit: newLedger.deposit,
      content: newLedger.content,
      cost: newLedger.cost,
      payment_method: newLedger.paymentMethod,
      incidental: newLedger.incidental,
      parts_purchase: newLedger.partsPurchase,
      parts_sales: newLedger.partsSales,
      meals: newLedger.meals
    }]);
    if (!error) {
      newLedger = { date: '', deposit: 0, content: '', cost: 0, paymentMethod: '카드', incidental: 0, partsPurchase: 0, partsSales: 0, meals: 0 };
      await fetchLedgers();
    } else {
      alert('저장 실패: ' + error.message);
    }
    saving = false;
  }

  async function deleteLedger(id: number) {
    if (!confirm('삭제하시겠습니까?')) return;
    await supabase.from('ledgers').delete().eq('id', id);
    await fetchLedgers();
  }

  let editingId = $state<number | null>(null);
  let editForm = $state({
    date: '', content: '', cost: 0, paymentMethod: '카드',
    incidental: 0, partsPurchase: 0, partsSales: 0, meals: 0
  });

  function startEdit(l: Ledger) {
    editingId = l.id;
    editForm = {
      date: l.date,
      content: l.content,
      cost: l.cost,
      paymentMethod: l.paymentMethod,
      incidental: l.incidental,
      partsPurchase: l.partsPurchase,
      partsSales: l.partsSales,
      meals: l.meals
    };
  }

  function cancelEdit() { editingId = null; }

  async function saveEdit() {
    saving = true;
    const { error } = await supabase.from('ledgers').update({
      date: editForm.date,
      content: editForm.content,
      cost: editForm.cost,
      payment_method: editForm.paymentMethod,
      incidental: editForm.incidental,
      parts_purchase: editForm.partsPurchase,
      parts_sales: editForm.partsSales,
      meals: editForm.meals
    }).eq('id', editingId);
    if (!error) {
      editingId = null;
      await fetchLedgers();
    } else {
      alert('수정 실패: ' + error.message);
    }
    saving = false;
  }

  // Calculate totals
  let totalRevenue = $derived(ledgers.reduce((sum, l) => sum + l.cost + l.partsSales, 0));
  let totalExpense = $derived(ledgers.reduce((sum, l) => sum + l.partsPurchase + l.incidental + l.meals, 0));
  let netProfit = $derived(totalRevenue - totalExpense);

  let currentMonthStr = new Date().toISOString().slice(0, 7);
  let thisMonthRevenue = $derived(
    ledgers.filter(l => l.date.startsWith(currentMonthStr))
           .reduce((sum, l) => sum + l.cost + l.partsSales, 0)
  );

  let selectedYear = $state(new Date().getFullYear().toString());

  let barChartEl: HTMLElement;
  let revenuePieEl: HTMLElement;
  let expensePieEl: HTMLElement;

  let barChart: any;
  let revenuePie: any;
  let expensePie: any;

  let ApexCharts: any;
  let showDashboard = $state(false);

  onMount(async () => {
    if (typeof window !== 'undefined') {
      const module = await import('apexcharts');
      ApexCharts = module.default;
    }
  });

  // Use Svelte action for reliable chart mounting inside {#if} blocks
  function barChartAction(node: HTMLElement) {
    async function init() {
      if (!ApexCharts) {
        const module = await import('apexcharts');
        ApexCharts = module.default;
      }
      renderBarChart(node);
    }
    init();
    return {
      destroy() { if (barChart) barChart.destroy(); }
    };
  }

  function revenuePieAction(node: HTMLElement) {
    async function init() {
      if (!ApexCharts) {
        const module = await import('apexcharts');
        ApexCharts = module.default;
      }
      renderRevenuePie(node);
    }
    init();
    return {
      destroy() { if (revenuePie) revenuePie.destroy(); }
    };
  }

  function expensePieAction(node: HTMLElement) {
    async function init() {
      if (!ApexCharts) {
        const module = await import('apexcharts');
        ApexCharts = module.default;
      }
      renderExpensePie(node);
    }
    init();
    return {
      destroy() { if (expensePie) expensePie.destroy(); }
    };
  }

  function renderBarChart(node: HTMLElement) {
    if (!ApexCharts || !node) return;
    if (barChart) barChart.destroy();
    let monthlyData = new Array(12).fill(0);
    ledgers.forEach(l => {
      if (l.date.startsWith(selectedYear)) {
        let month = parseInt(l.date.split('-')[1], 10) - 1;
        monthlyData[month] += (l.cost + l.partsSales - l.partsPurchase - l.incidental - l.meals);
      }
    });
    barChart = new ApexCharts(node, {
      chart: { type: 'bar', height: 280, toolbar: { show: false }, fontFamily: 'Noto Sans KR, sans-serif' },
      series: [{ name: '월별 순수익', data: monthlyData }],
      xaxis: { categories: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] },
      colors: ['#39C5BB'],
      dataLabels: { enabled: false },
      yaxis: { labels: { formatter: (val: number) => val.toLocaleString() + '원' } }
    });
    barChart.render();
  }

  function renderRevenuePie(node: HTMLElement) {
    if (!ApexCharts || !node) return;
    if (revenuePie) revenuePie.destroy();
    let costTotal = 0, partsSalesTotal = 0;
    ledgers.forEach(l => { costTotal += l.cost; partsSalesTotal += l.partsSales; });
    revenuePie = new ApexCharts(node, {
      chart: { type: 'pie', height: 300, fontFamily: 'Noto Sans KR, sans-serif' },
      series: (costTotal + partsSalesTotal) > 0 ? [costTotal, partsSalesTotal] : [1],
      labels: (costTotal + partsSalesTotal) > 0 ? ['시공비', '부품 매출'] : ['데이터 없음'],
      colors: ['#39C5BB', '#fb923c'],
      title: { text: '매출 관련 비율', align: 'center' }
    });
    revenuePie.render();
  }

  function renderExpensePie(node: HTMLElement) {
    if (!ApexCharts || !node) return;
    if (expensePie) expensePie.destroy();
    let expParts = 0, expMeals = 0, expIncidental = 0;
    ledgers.forEach(l => { expParts += l.partsPurchase; expMeals += l.meals; expIncidental += l.incidental; });
    expensePie = new ApexCharts(node, {
      chart: { type: 'pie', height: 300, fontFamily: 'Noto Sans KR, sans-serif' },
      series: (expParts+expMeals+expIncidental) > 0 ? [expParts, expMeals, expIncidental] : [1],
      labels: (expParts+expMeals+expIncidental) > 0 ? ['부품 매입', '식대', '기타 부대비용'] : ['지출 없음'],
      colors: ['#f43f5e', '#fb923c', '#eab308'],
      title: { text: '매입 및 지출 비율', align: 'center' }
    });
    expensePie.render();
  }
</script>

<div class="container admin-page">
  <div class="admin-header">
    <div class="title-row">
      <h1 class="page-title">장부 관리 <span class="text-accent">시스템</span></h1>
      <button class="btn-primary" onclick={() => showDashboard = true}>통계 대시보드 보기</button>
    </div>
    <p class="page-subtitle">매출, 매입, 부대비용 등 상세한 재무 현황을 관리합니다.</p>
  </div>

  {#if showDashboard}
  <div class="modal-overlay" onclick={(e) => { if (e.target === e.currentTarget) showDashboard = false; }}>
    <div class="dashboard-section glass-panel">
      <div class="chart-header">
        <h2>통계 대시보드</h2>
        <div class="header-actions">
          <select class="year-select" bind:value={selectedYear}>
            <option value="2025">2025년</option>
            <option value="2026">2026년</option>
            <option value="2027">2027년</option>
          </select>
          <button class="btn-close" onclick={() => showDashboard = false}>닫기 ✕</button>
        </div>
      </div>

      <!-- 요약 카드 4개 -->
      <div class="summary-cards">
        <div class="summary-card glass-panel">
          <h3>이번 달 매출</h3>
          <p class="amount text-success">{thisMonthRevenue.toLocaleString()}원</p>
        </div>
        <div class="summary-card glass-panel">
          <h3>누적 매출</h3>
          <p class="amount text-accent">{totalRevenue.toLocaleString()}원</p>
        </div>
        <div class="summary-card glass-panel">
          <h3>총 지출</h3>
          <p class="amount text-danger">{totalExpense.toLocaleString()}원</p>
        </div>
        <div class="summary-card glass-panel">
          <h3>순이익</h3>
          <p class="amount text-success">{netProfit.toLocaleString()}원</p>
        </div>
      </div>

      <!-- 막대그래프 -->
      <div use:barChartAction class="chart-container"></div>
      
      <!-- 원형 차트 2개 -->
      <div class="pie-charts-row">
        <div class="pie-chart-wrapper">
          <div use:revenuePieAction></div>
        </div>
        <div class="pie-chart-wrapper">
          <div use:expensePieAction></div>
        </div>
      </div>
    </div>
  </div>
  {/if}

  <div class="admin-grid">
    <!-- 새 장부 등록 폼 -->
    <div class="glass-panel form-panel">
      <h2>새 내역 등록</h2>
      <form onsubmit={addLedger}>
        <div class="form-group">
          <label class="form-label">날짜</label>
          <input type="date" class="form-input" bind:value={newLedger.date} required />
        </div>
        <div class="form-group">
          <label class="form-label">시공 내용</label>
          <input type="text" class="form-input" bind:value={newLedger.content} required />
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">예약금</label>
            <input type="number" class="form-input" bind:value={newLedger.deposit} />
          </div>
          <div class="form-group">
            <label class="form-label">시공 비용</label>
            <input type="number" class="form-input" bind:value={newLedger.cost} />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">결제 수단</label>
          <select class="form-input" bind:value={newLedger.paymentMethod}>
            <option value="카드">카드</option>
            <option value="현금">현금</option>
            <option value="계좌이체">계좌이체</option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">부품 매입</label>
            <input type="number" class="form-input" bind:value={newLedger.partsPurchase} />
          </div>
          <div class="form-group">
            <label class="form-label">부품 매출</label>
            <input type="number" class="form-input" bind:value={newLedger.partsSales} />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">식대</label>
            <input type="number" class="form-input" bind:value={newLedger.meals} />
          </div>
          <div class="form-group">
            <label class="form-label">기타 부대비용</label>
            <input type="number" class="form-input" bind:value={newLedger.incidental} />
          </div>
        </div>

        <button type="submit" class="btn-primary" style="width: 100%; margin-top: 10px;" disabled={saving}>
          {saving ? '저장 중...' : '내역 등록'}
        </button>
      </form>
    </div>

    <!-- 장부 목록 -->
    <div class="glass-panel list-panel">
      <h2>장부 내역</h2>
      {#if loading}
        <div style="text-align:center;padding:60px;color:var(--text-secondary);">불러오는 중...</div>
      {:else}
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>날짜</th>
              <th>시공내용</th>
              <th>결제수단</th>
              <th>예약금/시공비</th>
              <th>부품 매입/매출</th>
              <th>식대/부대비용</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {#each ledgers as l (l.id)}
              {#if editingId === l.id}
              <!-- 인라인 수정 모드 -->
              <tr style="background:rgba(57,197,187,0.05);">
                <td><input class="form-input mini" type="date" bind:value={editForm.date} /></td>
                <td><input class="form-input mini" type="text" bind:value={editForm.content} /></td>
                <td>
                  <select class="form-input mini" bind:value={editForm.paymentMethod}>
                    <option value="카드">카드</option>
                    <option value="현금">현금</option>
                    <option value="계좌이체">계좌이체</option>
                    <option value="미정">미정</option>
                  </select>
                </td>
                <td>
                  <div class="amount-split">
                    <input class="form-input mini" type="number" bind:value={editForm.cost} placeholder="시공비" />
                  </div>
                </td>
                <td>
                  <div class="amount-split">
                    <input class="form-input mini" type="number" bind:value={editForm.partsPurchase} placeholder="매입" />
                    <input class="form-input mini" type="number" bind:value={editForm.partsSales} placeholder="매출" />
                  </div>
                </td>
                <td>
                  <div class="amount-split">
                    <input class="form-input mini" type="number" bind:value={editForm.meals} placeholder="식대" />
                    <input class="form-input mini" type="number" bind:value={editForm.incidental} placeholder="부대" />
                  </div>
                </td>
                <td>
                  <button class="btn-action btn-approve" onclick={saveEdit} disabled={saving}>저장</button>
                  <button class="btn-action btn-cancel-edit" onclick={cancelEdit}>취소</button>
                </td>
              </tr>
              {:else}
              <!-- 일반 보기 모드 -->
              <tr>
                <td>{l.date}</td>
                <td>{l.content}</td>
                <td><span class="pay-method">{l.paymentMethod}</span></td>
                <td>
                  <div class="amount-split">
                    <span>시: {l.cost.toLocaleString()}</span>
                  </div>
                </td>
                <td>
                  <div class="amount-split">
                    <span class="text-danger">입: {l.partsPurchase.toLocaleString()}</span>
                    <span class="text-success">출: {l.partsSales.toLocaleString()}</span>
                  </div>
                </td>
                <td>
                  <div class="amount-split text-danger">
                    <span>식: {l.meals.toLocaleString()}</span>
                    <span>기: {l.incidental.toLocaleString()}</span>
                  </div>
                </td>
                <td>
                  <button class="btn-action btn-edit" onclick={() => startEdit(l)}>수정</button>
                  <button class="btn-action btn-delete" onclick={() => deleteLedger(l.id)}>삭제</button>
                </td>
              </tr>
              {/if}
            {/each}
            {#if ledgers.length === 0}
              <tr>
                <td colspan="7" class="empty-state">등록된 장부 내역이 없습니다.</td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .admin-page {
    padding: 60px 20px;
  }

  .admin-header {
    margin-bottom: 30px;
  }

  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .page-title {
    font-size: 2.5rem;
    margin-bottom: 10px;
  }

  .page-subtitle {
    color: var(--text-secondary);
    font-size: 1.1rem;
  }

  /* Modal Overlay Styles for Dashboard */
  .modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
  }

  .dashboard-section {
    padding: 30px;
    width: 90%;
    max-width: 1000px;
    max-height: 90vh;
    overflow-y: auto;
    background: white;
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }

  .summary-card {
    padding: 20px;
    text-align: center;
  }

  .summary-card h3 {
    color: var(--text-secondary);
    font-size: 0.95rem;
    margin-bottom: 10px;
  }

  .amount {
    font-size: 1.5rem;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
  }

  .header-actions {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .btn-close {
    background: #f43f5e;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Noto Sans KR', sans-serif;
  }
  .btn-close:hover {
    background: #e11d48;
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 16px;
  }

  .chart-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--text-primary);
  }

  .year-select {
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    font-weight: 600;
    outline: none;
    font-family: 'Noto Sans KR', sans-serif;
  }

  .chart-container {
    width: 100%;
    margin-bottom: 40px;
  }

  .pie-charts-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }

  .pie-chart-wrapper {
    background: rgba(255, 255, 255, 0.5);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.05);
  }

  .text-success { color: #22c55e; }
  .text-danger { color: #f43f5e; }
  .text-accent { color: var(--accent-color); }

  .admin-grid {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 32px;
  }

  /* ... rest ... */

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .form-panel h2, .list-panel h2 {
    margin-bottom: 24px;
    font-size: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 12px;
  }

  .table-responsive {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 900px;
  }

  th, td {
    padding: 14px 10px;
    text-align: center !important;
    vertical-align: middle !important;
    border-bottom: 1px solid var(--border-color);
    white-space: nowrap;
  }

  td:nth-child(2) { /* 시공내용 */
    white-space: normal;
    word-break: keep-all;
  }

  th {
    background: rgba(57, 197, 187, 0.1); /* Miku mint header */
  }

  .amount-split {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.9rem;
  }

  .pay-method {
    background: rgba(255, 255, 255, 0.1);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.85rem;
  }

  .btn-action {
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    transition: all 0.2s;
  }

  .btn-delete {
    background: rgba(244, 63, 94, 0.1);
    color: #f43f5e;
    border: 1px solid rgba(244, 63, 94, 0.3);
  }

  .btn-delete:hover {
    background: rgba(244, 63, 94, 0.2);
  }

  .btn-edit {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.3);
  }
  .btn-edit:hover { background: rgba(59, 130, 246, 0.2); }

  .btn-approve {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
    border: 1px solid rgba(34, 197, 94, 0.3);
  }
  .btn-approve:hover { background: rgba(34, 197, 94, 0.2); }

  .btn-cancel-edit {
    background: rgba(100, 116, 139, 0.1);
    color: #64748b;
    border: 1px solid #e2e8f0;
  }
  .btn-cancel-edit:hover { background: rgba(100, 116, 139, 0.2); }

  .mini {
    padding: 5px 6px;
    font-size: 0.82rem;
    width: 100%;
    min-width: 60px;
    max-width: 130px;
    margin-bottom: 2px;
  }

  .empty-state {
    text-align: center;
    padding: 40px !important;
    color: var(--text-secondary);
  }

  @media (max-width: 1024px) {
    .admin-grid, .summary-cards {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .pie-charts-row {
      grid-template-columns: 1fr;
    }
    .admin-page {
      padding: 30px 16px;
    }
    .amount {
      font-size: 1.5rem;
    }
    .title-row {
      flex-direction: column;
      align-items: flex-start;
    }
    
    /* Mobile Fullscreen Modal */
    .dashboard-section {
      width: 100vw;
      height: 100vh;
      max-height: 100vh;
      border-radius: 0;
      padding: 20px 16px;
    }
  }
</style>
