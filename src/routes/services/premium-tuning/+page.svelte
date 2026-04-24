<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';

  type Service = {
    id: string;
    name: string;
    price: string;
    note: string;
    display_order: number;
    is_active: boolean;
  };

  let menuItems = $state<Service[]>([]);
  let loading = $state(true);

  onMount(async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (!error && data) menuItems = data;
    loading = false;
  });
</script>

<div class="container page-content">
  <div class="menu-header">
    <div class="shop-logo-large"></div>
    <h1 class="page-title">Premium Tuning <span class="text-accent">Menu</span></h1>
    <p class="subtitle">TPG Lounge만의 프리미엄 전장 튜닝 단가표입니다. 항목을 클릭하시면 상세 영상과 설명을 보실 수 있습니다.</p>
  </div>

  <div class="glass-panel table-container">
    {#if loading}
      <div style="text-align:center;padding:80px;color:var(--text-secondary);">불러오는 중...</div>
    {:else}
    <table class="menu-table">
      <thead>
        <tr>
          <th>No.</th>
          <th>시공 항목 (Item)</th>
          <th>비고 (Note)</th>
          <th class="price-col">시공 가격 (Price)</th>
          <th>상세보기</th>
        </tr>
      </thead>
      <tbody>
        {#each menuItems as item, index}
          <tr class="menu-row">
            <td>{index + 1}</td>
            <td class="item-name">{item.name}</td>
            <td class="item-note">{item.note}</td>
            <td class="price-col text-accent font-bold">{item.price}</td>
            <td>
              <a href="/services/premium-tuning/{item.id}" class="btn-detail">영상 보기 ▶</a>
            </td>
          </tr>
        {/each}
        {#if menuItems.length === 0}
          <tr><td colspan="5" style="text-align:center;padding:40px;">등록된 서비스가 없습니다.</td></tr>
        {/if}
      </tbody>
    </table>
    {/if}
  </div>
</div>

<style>
  .page-content { padding: 60px 20px; min-height: 80vh; }
  .menu-header { text-align: center; margin-bottom: 50px; }
  .shop-logo-large {
    width: 300px; height: 90px; margin: 0 auto 24px;
    background-image: url('https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250806_288%2F1754455206110UVHzl_JPEG%2F%25B8%25DE%25B4%25BA%25C6%25C7.JPG');
    background-size: cover; background-position: top center;
    border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 196, 140, 0.2);
  }
  .page-title { font-size: 3rem; margin-bottom: 16px; }
  .subtitle { color: var(--text-secondary); font-size: 1.1rem; max-width: 600px; margin: 0 auto; line-height: 1.6; }
  .table-container { padding: 0; overflow: hidden; }
  .menu-table { width: 100%; border-collapse: collapse; }
  .menu-table th, .menu-table td { padding: 20px 24px; border-bottom: 1px solid var(--border-color); }
  .menu-table th { background: rgba(0, 196, 140, 0.08); color: var(--text-primary); font-size: 1.1rem; text-align: center; }
  .menu-table td { text-align: center; vertical-align: middle; }
  .item-name { font-weight: 600; font-size: 1.1rem; text-align: left !important; }
  .item-note { color: var(--text-secondary); font-size: 0.95rem; text-align: left !important; }
  .price-col { font-family: 'Outfit', sans-serif; font-size: 1.2rem; }
  .font-bold { font-weight: 700; }
  .menu-row { transition: all 0.2s; }
  .menu-row:hover { background: rgba(0, 196, 140, 0.03); transform: scale(1.01); }
  .btn-detail {
    background: rgba(0, 196, 140, 0.1); color: var(--accent-color);
    padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: 600;
    border: 1px solid rgba(0, 196, 140, 0.2); transition: all 0.3s; display: inline-block;
  }
  .btn-detail:hover { background: var(--accent-color); color: white; border-color: transparent; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0, 196, 140, 0.3); }
  @media (max-width: 768px) {
    .menu-table th, .menu-table td { padding: 12px; }
    .item-note { display: none; }
    .shop-logo-large { width: 100%; max-width: 300px; }
  }
</style>
