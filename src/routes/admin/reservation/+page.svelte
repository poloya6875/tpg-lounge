<script>
  let reservations = $state([
    { id: 1, date: '2026-04-25', name: '홍길동', contact: '010-1234-5678', content: '블랙박스 2채널 장착', cost: 250000, status: '승인대기' },
    { id: 2, date: '2026-04-26', name: '김철수', contact: '010-9876-5432', content: '엠비언트 라이트 시공', cost: 450000, status: '승인완료' }
  ]);

  let newReservation = $state({
    date: '',
    name: '',
    contact: '',
    content: '',
    cost: 0
  });

  function addReservation(e) {
    e.preventDefault();
    const id = reservations.length ? Math.max(...reservations.map(r => r.id)) + 1 : 1;
    reservations = [...reservations, { ...newReservation, id, status: '승인대기' }];
    newReservation = { date: '', name: '', contact: '', content: '', cost: 0 };
  }

  function approveReservation(id) {
    reservations = reservations.map(r => r.id === id ? { ...r, status: '승인완료' } : r);
  }

  function cancelReservation(id) {
    reservations = reservations.map(r => r.id === id ? { ...r, status: '취소됨' } : r);
  }
</script>

<div class="container admin-page">
  <div class="admin-header">
    <h1 class="page-title">예약 관리 <span class="text-accent">시스템</span></h1>
    <p class="page-subtitle">고객의 예약 접수를 확인하고 승인/취소 처리를 할 수 있습니다.</p>
  </div>

  <div class="admin-grid">
    <!-- 새 예약 등록 폼 (수동) -->
    <div class="glass-panel form-panel">
      <h2>새 예약 수동 등록</h2>
      <form onsubmit={addReservation}>
        <div class="form-group">
          <label class="form-label">예약 날짜</label>
          <input type="date" class="form-input" bind:value={newReservation.date} required />
        </div>
        <div class="form-group">
          <label class="form-label">고객 이름</label>
          <input type="text" class="form-input" bind:value={newReservation.name} placeholder="예: 홍길동" required />
        </div>
        <div class="form-group">
          <label class="form-label">연락처</label>
          <input type="tel" class="form-input" bind:value={newReservation.contact} placeholder="예: 010-1234-5678" required />
        </div>
        <div class="form-group">
          <label class="form-label">시공 내용</label>
          <input type="text" class="form-input" bind:value={newReservation.content} placeholder="예: 블랙박스 설치" required />
        </div>
        <div class="form-group">
          <label class="form-label">예상 시공 비용 (원)</label>
          <input type="number" class="form-input" bind:value={newReservation.cost} required />
        </div>
        <button type="submit" class="btn-primary" style="width: 100%">예약 등록</button>
      </form>
    </div>

    <!-- 예약 목록 -->
    <div class="glass-panel list-panel">
      <h2>예약 목록</h2>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>날짜</th>
              <th>이름</th>
              <th>연락처</th>
              <th>시공 내용</th>
              <th>예상 비용</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {#each reservations as res (res.id)}
              <tr>
                <td>{res.date}</td>
                <td>{res.name}</td>
                <td>{res.contact}</td>
                <td>{res.content}</td>
                <td>{res.cost.toLocaleString()}원</td>
                <td>
                  <span class="status-badge {res.status === '승인완료' ? 'status-approved' : (res.status === '취소됨' ? 'status-cancelled' : 'status-pending')}">
                    {res.status}
                  </span>
                </td>
                <td>
                  {#if res.status === '승인대기'}
                    <button class="btn-action btn-approve" onclick={() => approveReservation(res.id)}>승인</button>
                    <button class="btn-action btn-cancel" onclick={() => cancelReservation(res.id)}>취소</button>
                  {/if}
                </td>
              </tr>
            {/each}
            {#if reservations.length === 0}
              <tr>
                <td colspan="7" class="empty-state">등록된 예약이 없습니다.</td>
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
    margin-bottom: 40px;
  }

  .page-title {
    font-size: 2.5rem;
    margin-bottom: 10px;
  }

  .page-subtitle {
    color: var(--text-secondary);
    font-size: 1.1rem;
  }

  .admin-grid {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 32px;
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
    min-width: 800px;
  }

  th, td {
    padding: 14px 10px;
    text-align: center !important;
    vertical-align: middle !important;
    border-bottom: 1px solid var(--border-color);
    white-space: nowrap;
  }

  td:nth-child(4) { /* 시공내용 */
    white-space: normal;
    word-break: keep-all;
  }

  th {
    background: rgba(57, 197, 187, 0.1); /* Miku mint header */
  }

  .status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .status-pending {
    background: rgba(251, 146, 60, 0.2);
    color: #fb923c;
  }

  .status-approved {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
  }

  .status-cancelled {
    background: rgba(244, 63, 94, 0.2);
    color: #f43f5e;
  }

  .btn-action {
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    transition: all 0.2s;
    margin-right: 4px;
  }

  .btn-approve {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
    border: 1px solid rgba(34, 197, 94, 0.3);
  }

  .btn-approve:hover {
    background: rgba(34, 197, 94, 0.2);
  }

  .btn-cancel {
    background: rgba(244, 63, 94, 0.1);
    color: #f43f5e;
    border: 1px solid rgba(244, 63, 94, 0.3);
  }

  .btn-cancel:hover {
    background: rgba(244, 63, 94, 0.2);
  }

  .empty-state {
    text-align: center;
    padding: 40px !important;
    color: var(--text-secondary);
  }

  @media (max-width: 1024px) {
    .admin-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
