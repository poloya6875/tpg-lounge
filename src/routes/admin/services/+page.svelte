<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';

  type Service = {
    id: string;
    name: string;
    price: string;
    note: string;
    youtube_id: string;
    desc: string;
    display_order: number;
    is_active: boolean;
  };

  let services = $state<Service[]>([]);
  let loading = $state(true);
  let saving = $state(false);
  let editingId = $state<string | null>(null);

  let newService = $state({
    id: '', name: '', price: '', note: '', youtube_id: '', desc: '', display_order: 0, is_active: true
  });

  let editForm = $state({
    id: '', name: '', price: '', note: '', youtube_id: '', desc: '', display_order: 0, is_active: true
  });

  onMount(async () => {
    await fetchServices();
  });

  async function fetchServices() {
    loading = true;
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });
    if (!error && data) services = data;
    loading = false;
  }

  async function addService(e: Event) {
    e.preventDefault();
    if (!newService.id.trim() || !newService.name.trim()) return;
    saving = true;
    const { error } = await supabase.from('services').insert([{ ...newService }]);
    if (!error) {
      newService = { id: '', name: '', price: '', note: '', youtube_id: '', desc: '', display_order: 0, is_active: true };
      await fetchServices();
    } else {
      alert('저장 실패: ' + error.message);
    }
    saving = false;
  }

  function startEdit(s: Service) {
    editingId = s.id;
    editForm = { ...s };
  }

  function cancelEdit() {
    editingId = null;
  }

  async function saveEdit() {
    saving = true;
    const { error } = await supabase.from('services').update({
      name: editForm.name,
      price: editForm.price,
      note: editForm.note,
      youtube_id: editForm.youtube_id,
      desc: editForm.desc,
      display_order: editForm.display_order,
      is_active: editForm.is_active
    }).eq('id', editingId);
    if (!error) {
      editingId = null;
      await fetchServices();
    } else {
      alert('수정 실패: ' + error.message);
    }
    saving = false;
  }

  async function toggleActive(s: Service) {
    await supabase.from('services').update({ is_active: !s.is_active }).eq('id', s.id);
    await fetchServices();
  }

  async function deleteService(id: string) {
    if (!confirm(`"${id}" 항목을 삭제하시겠습니까?`)) return;
    await supabase.from('services').delete().eq('id', id);
    await fetchServices();
  }
</script>

<div class="container admin-page">
  <div class="admin-header">
    <h1 class="page-title">시공목록 <span class="text-accent">관리</span></h1>
    <p class="page-subtitle">시공 항목을 추가, 수정, 삭제하고 표시 순서와 활성 상태를 관리합니다.</p>
  </div>

  <!-- 신규 추가 폼 -->
  <div class="glass-panel form-panel">
    <h2>새 시공 항목 추가</h2>
    <form onsubmit={addService}>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">ID (슬러그, 영문)</label>
          <input class="form-input" type="text" bind:value={newService.id} placeholder="예: blackbox" required />
        </div>
        <div class="form-group">
          <label class="form-label">표시 순서</label>
          <input class="form-input" type="number" bind:value={newService.display_order} />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">시공 항목명</label>
        <input class="form-input" type="text" bind:value={newService.name} placeholder="예: 프리미엄 블랙박스 2채널 시공" required />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">가격</label>
          <input class="form-input" type="text" bind:value={newService.price} placeholder="예: 250,000원" />
        </div>
        <div class="form-group">
          <label class="form-label">비고</label>
          <input class="form-input" type="text" bind:value={newService.note} placeholder="예: 배선 흡음 처리" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">유튜브 영상 ID</label>
        <input class="form-input" type="text" bind:value={newService.youtube_id} placeholder="예: dQw4w9WgXcQ (youtube.com/watch?v= 뒤 부분)" />
      </div>
      <div class="form-group">
        <label class="form-label">상세 설명</label>
        <textarea class="form-input" rows="3" bind:value={newService.desc} placeholder="상세 설명을 입력하세요"></textarea>
      </div>
      <button type="submit" class="btn-primary" disabled={saving}>
        {saving ? '저장 중...' : '항목 추가'}
      </button>
    </form>
  </div>

  <!-- 서비스 목록 테이블 -->
  <div class="glass-panel">
    <h2 style="padding: 24px 24px 0; font-size:1.5rem; border-bottom:1px solid var(--border-color); padding-bottom:12px; margin:0 0 0 0;">시공 항목 목록</h2>
    {#if loading}
      <div style="text-align:center;padding:60px;color:var(--text-secondary);">불러오는 중...</div>
    {:else}
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>순서</th>
            <th>ID</th>
            <th>항목명</th>
            <th>가격</th>
            <th>유튜브ID</th>
            <th>활성</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {#each services as s (s.id)}
            {#if editingId === s.id}
            <tr class="editing-row">
              <td><input class="form-input mini" type="number" bind:value={editForm.display_order} /></td>
              <td><span class="id-badge">{s.id}</span></td>
              <td><input class="form-input mini" type="text" bind:value={editForm.name} /></td>
              <td><input class="form-input mini" type="text" bind:value={editForm.price} /></td>
              <td><input class="form-input mini" type="text" bind:value={editForm.youtube_id} /></td>
              <td>
                <input type="checkbox" bind:checked={editForm.is_active} />
              </td>
              <td>
                <button class="btn-action btn-approve" onclick={saveEdit} disabled={saving}>저장</button>
                <button class="btn-action btn-cancel" onclick={cancelEdit}>취소</button>
              </td>
            </tr>
            {:else}
            <tr class={s.is_active ? '' : 'inactive-row'}>
              <td>{s.display_order}</td>
              <td><span class="id-badge">{s.id}</span></td>
              <td style="text-align:left">{s.name}</td>
              <td>{s.price}</td>
              <td>{s.youtube_id || '-'}</td>
              <td>
                <button class="toggle-btn {s.is_active ? 'active' : 'inactive'}" onclick={() => toggleActive(s)}>
                  {s.is_active ? '활성' : '비활성'}
                </button>
              </td>
              <td>
                <button class="btn-action btn-edit" onclick={() => startEdit(s)}>수정</button>
                <button class="btn-action btn-delete" onclick={() => deleteService(s.id)}>삭제</button>
              </td>
            </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    </div>
    {/if}
  </div>
</div>

<style>
  .admin-page { padding: 60px 20px; }
  .admin-header { margin-bottom: 40px; }
  .page-title { font-size: 2.5rem; margin-bottom: 10px; }
  .page-subtitle { color: var(--text-secondary); font-size: 1.1rem; }

  .form-panel { padding: 30px; margin-bottom: 40px; }
  .form-panel h2 { font-size: 1.5rem; margin-bottom: 24px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  textarea.form-input { resize: vertical; }

  .table-responsive { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; min-width: 800px; }
  th, td { padding: 12px 10px; text-align: center !important; vertical-align: middle !important; border-bottom: 1px solid var(--border-color); white-space: nowrap; }
  th { background: rgba(57, 197, 187, 0.1); font-weight: 700; }

  .id-badge {
    background: rgba(57, 197, 187, 0.15); color: var(--accent-color);
    padding: 3px 8px; border-radius: 4px; font-size: 0.85rem; font-family: monospace;
  }

  .inactive-row { opacity: 0.45; }
  .editing-row { background: rgba(57, 197, 187, 0.05); }

  .mini { padding: 6px 8px; font-size: 0.85rem; min-width: 80px; max-width: 160px; }

  .toggle-btn {
    border: none; padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; cursor: pointer;
  }
  .toggle-btn.active { background: rgba(34, 197, 94, 0.15); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3); }
  .toggle-btn.inactive { background: rgba(100, 116, 139, 0.1); color: #94a3b8; border: 1px solid #e2e8f0; }

  .btn-action { border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 600; margin: 2px; transition: all 0.2s; }
  .btn-edit { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); }
  .btn-edit:hover { background: rgba(59, 130, 246, 0.2); }
  .btn-approve { background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3); }
  .btn-approve:hover { background: rgba(34, 197, 94, 0.2); }
  .btn-cancel { background: rgba(100, 116, 139, 0.1); color: #64748b; border: 1px solid #e2e8f0; }
  .btn-delete { background: rgba(244, 63, 94, 0.1); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.3); }
  .btn-delete:hover { background: rgba(244, 63, 94, 0.2); }

  @media (max-width: 768px) {
    .admin-page { padding: 30px 16px; }
    .form-row { grid-template-columns: 1fr; }
  }
</style>
