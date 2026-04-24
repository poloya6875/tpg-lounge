<script>
  let ledgers = $state([
    {
      id: 1,
      date: '2026-04-24',
      deposit: 50000,
      content: '블랙박스 2채널',
      cost: 250000,
      paymentMethod: '카드',
      incidental: 0,
      partsPurchase: 150000,
      partsSales: 200000,
      meals: 12000
    }
  ]);

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

  function addLedger(e) {
    e.preventDefault();
    const id = ledgers.length ? Math.max(...ledgers.map(l => l.id)) + 1 : 1;
    ledgers = [...ledgers, { ...newLedger, id }];
    newLedger = {
      date: '', deposit: 0, content: '', cost: 0, paymentMethod: '카드',
      incidental: 0, partsPurchase: 0, partsSales: 0, meals: 0
    };
  }
  
  function deleteLedger(id) {
    ledgers = ledgers.filter(l => l.id !== id);
  }

  // Calculate totals
  let totalRevenue = $derived(ledgers.reduce((sum, l) => sum + l.cost + l.partsSales, 0));
  let totalExpense = $derived(ledgers.reduce((sum, l) => sum + l.partsPurchase + l.incidental + l.meals, 0));
  let netProfit = $derived(totalRevenue - totalExpense);
</script>

<div class="container admin-page">
  <div class="admin-header">
    <h1 class="page-title">장부 관리 <span class="text-accent">시스템</span></h1>
    <p class="page-subtitle">매출, 매입, 부대비용 등 상세한 재무 현황을 관리합니다.</p>
  </div>

  <div class="summary-cards">
    <div class="glass-panel summary-card">
      <h3>총 매출</h3>
      <p class="amount text-success">{totalRevenue.toLocaleString()}원</p>
    </div>
    <div class="glass-panel summary-card">
      <h3>총 지출</h3>
      <p class="amount text-danger">{totalExpense.toLocaleString()}원</p>
    </div>
    <div class="glass-panel summary-card">
      <h3>순이익</h3>
      <p class="amount text-accent">{netProfit.toLocaleString()}원</p>
    </div>
  </div>

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

        <button type="submit" class="btn-primary" style="width: 100%; margin-top: 10px;">내역 등록</button>
      </form>
    </div>

    <!-- 장부 목록 -->
    <div class="glass-panel list-panel">
      <h2>장부 내역</h2>
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
              <tr>
                <td>{l.date}</td>
                <td>{l.content}</td>
                <td><span class="pay-method">{l.paymentMethod}</span></td>
                <td>
                  <div class="amount-split">
                    <span class="text-secondary">예: {l.deposit.toLocaleString()}</span>
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
                  <button class="btn-action btn-delete" onclick={() => deleteLedger(l.id)}>삭제</button>
                </td>
              </tr>
            {/each}
            {#if ledgers.length === 0}
              <tr>
                <td colspan="7" class="empty-state">등록된 장부 내역이 없습니다.</td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
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

  .page-title {
    font-size: 2.5rem;
    margin-bottom: 10px;
  }

  .page-subtitle {
    color: var(--text-secondary);
    font-size: 1.1rem;
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 40px;
  }

  .summary-card {
    padding: 24px;
    text-align: center;
  }

  .summary-card h3 {
    color: var(--text-secondary);
    font-size: 1rem;
    margin-bottom: 12px;
  }

  .amount {
    font-size: 2rem;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
  }

  .text-success { color: #22c55e; }
  .text-danger { color: #f43f5e; }

  .admin-grid {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 32px;
  }

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
</style>
