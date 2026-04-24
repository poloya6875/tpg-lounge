<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';

  type Reservation = {
    id: number;
    date: string;
    name: string;
    contact: string;
    content: string;
    cost: number;
    status: string;
  };

  let reservations = $state<Reservation[]>([]);
  let loading = $state(true);
  let saving = $state(false);

  let newReservation = $state({
    date: '',
    name: '',
    contact: '',
    content: '',
    cost: 0
  });

  onMount(async () => {
    await fetchReservations();
  });

  async function fetchReservations() {
    loading = true;
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('date', { ascending: false });
    if (!error && data) reservations = data;
    loading = false;
  }

  async function addReservation(e: Event) {
    e.preventDefault();
    saving = true;
    const { error } = await supabase.from('reservations').insert([{
      date: newReservation.date,
      name: newReservation.name,
      contact: newReservation.contact,
      content: newReservation.content,
      cost: newReservation.cost,
      status: '승인대기'
    }]);
    if (!error) {
      newReservation = { date: '', name: '', contact: '', content: '', cost: 0 };
      await fetchReservations();
    } else {
      alert('저장 실패: ' + error.message);
    }
    saving = false;
  }

  async function approveReservation(id: number) {
    // 1. 예약 상태 승인완료로 업데이트
    const { error: updateError } = await supabase
      .from('reservations')
      .update({ status: '작업완료' })
      .eq('id', id);

    if (updateError) {
      alert('승인 처리 실패: ' + updateError.message);
      return;
    }

    // 2. 해당 예약 정보 조회
    const res = reservations.find(r => r.id === id);
    if (!res) return;

    // 3. 장부에 자동 등록 (시공비용만)
    const { error: ledgerError } = await supabase.from('ledgers').insert([{
      date: res.date,
      content: res.content,
      cost: res.cost,
      deposit: 0,
      payment_method: '미정',
      incidental: 0,
      parts_purchase: 0,
      parts_sales: 0,
      meals: 0
    }]);

    if (ledgerError) {
      alert('장부 자동 등록 실패: ' + ledgerError.message);
    } else {
      alert(`✅ 승인 완료!\n장부에 자동으로 등록되었습니다.\n- 시공 내용: ${res.content}\n- 시공 비용: ${res.cost.toLocaleString()}원`);
    }

    await fetchReservations();
  }

  async function cancelReservation(id: number) {
    await supabase.from('reservations').update({ status: '취소됨' }).eq('id', id);
    await fetchReservations();
  }

  async function deleteReservation(id: number) {
    if (!confirm('삭제하시겠습니까?')) return;
    await supabase.from('reservations').delete().eq('id', id);
    await fetchReservations();
  }
</script>

<div class="container admin-page">
  <div class="admin-header">
    <h1 class="page-title">예약 관리 <span class="text-accent">시스템</span></h1>
    <p class="page-subtitle">고객의 예약 접수를 확인하고 승인/취소 처리를 할 수 있습니다.</p>
  </div>

  <div class="admin-grid">
    <!-- 새 예약 등록 폼 -->
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
        <button type="submit" class="btn-primary" style="width: 100%" disabled={saving}>
          {saving ? '저장 중...' : '예약 등록'}
        </button>
      </form>
    </div>

    <!-- 예약 목록 -->
    <div class="glass-panel list-panel">
      <h2>예약 목록</h2>
      {#if loading}
        <div class="loading-msg">불러오는 중...</div>
      {:else}
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
                  <span class="status-badge {res.status === '작업완료' ? 'status-approved' : (res.status === '취소됨' ? 'status-cancelled' : 'status-pending')}">
                    {res.status}
                  </span>
                </td>
                <td>
                  {#if res.status === '승인대기'}
                    <button class="btn-action btn-approve" onclick={() => approveReservation(res.id)}>✅ 작업완료</button>
                    <button class="btn-action btn-cancel" onclick={() => cancelReservation(res.id)}>취소</button>
                  {/if}
                  <button class="btn-action btn-delete" onclick={() => deleteReservation(res.id)}>삭제</button>
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
      {/if}
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

  td:nth-child(4) {
    white-space: normal;
    word-break: keep-all;
  }

  th {
    background: rgba(57, 197, 187, 0.1);
  }

  .status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .status-pending { background: rgba(251, 146, 60, 0.2); color: #fb923c; }
  .status-approved { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
  .status-cancelled { background: rgba(244, 63, 94, 0.2); color: #f43f5e; }

  .btn-action {
    border: none;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 600;
    transition: all 0.2s;
    margin: 2px;
  }

  .btn-approve { background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3); }
  .btn-approve:hover { background: rgba(34, 197, 94, 0.2); }
  .btn-cancel { background: rgba(251, 146, 60, 0.1); color: #fb923c; border: 1px solid rgba(251, 146, 60, 0.3); }
  .btn-cancel:hover { background: rgba(251, 146, 60, 0.2); }
  .btn-delete { background: rgba(244, 63, 94, 0.1); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.3); }
  .btn-delete:hover { background: rgba(244, 63, 94, 0.2); }

  .empty-state {
    text-align: center;
    padding: 40px !important;
    color: var(--text-secondary);
  }

  .loading-msg {
    text-align: center;
    padding: 60px;
    color: var(--text-secondary);
  }

  @media (max-width: 1024px) {
    .admin-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 768px) {
    .admin-page { padding: 30px 16px; }
    .page-title { font-size: 1.8rem; }
  }
</style>
