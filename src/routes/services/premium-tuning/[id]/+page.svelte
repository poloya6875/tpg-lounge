<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { supabase } from '$lib/supabase';

  type Service = {
    id: string;
    name: string;
    price: string;
    note: string;
    youtube_id?: string;
    desc?: string;
  };

  let item = $state<Service | null>(null);
  let loading = $state(true);

  onMount(async () => {
    const id = $page.params.id;
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    if (!error && data) item = data;
    loading = false;
  });
</script>

<div class="container page-content">
  {#if loading}
    <div style="text-align:center;padding:100px;color:var(--text-secondary);">불러오는 중...</div>
  {:else if !item}
    <div style="text-align:center;padding:100px;">
      <p>서비스를 찾을 수 없습니다.</p>
      <a href="/services/premium-tuning" class="btn-primary" style="display:inline-block;margin-top:20px;">← 목록으로</a>
    </div>
  {:else}
  <div class="back-link">
    <a href="/services/premium-tuning">← 메뉴판으로 돌아가기</a>
  </div>

  <div class="detail-header">
    <h1 class="page-title">{item.name}</h1>
    <div class="price-tag">{item.price}</div>
  </div>

  {#if item.youtube_id}
  <div class="glass-panel video-container">
    <div class="video-wrapper">
      <iframe 
        src="https://www.youtube.com/embed/{item.youtube_id}?autoplay=1&mute=1" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen
        title="{item.name} 시공 영상"
      ></iframe>
    </div>
  </div>
  {/if}

  <div class="glass-panel info-container">
    <h2>시공 상세 정보</h2>
    {#if item.desc}
    <p class="desc">{item.desc}</p>
    {/if}
    <div class="note-box">
      <strong>참고사항:</strong> {item.note || '문의하세요'}
    </div>
    
    <div class="action-area">
      <a href="/admin/reservation" class="btn-primary btn-large">이 시공으로 예약하기</a>
    </div>
  </div>
  {/if}
</div>

<style>
  .page-content {
    padding: 40px 20px;
    max-width: 900px;
  }

  .back-link {
    margin-bottom: 24px;
  }

  .back-link a {
    color: var(--text-secondary);
    font-weight: 500;
    transition: color 0.2s;
  }

  .back-link a:hover {
    color: var(--accent-color);
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 30px;
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 20px;
  }

  .page-title {
    font-size: 2.5rem;
    margin: 0;
  }

  .price-tag {
    font-size: 1.5rem;
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    color: var(--accent-color);
    background: rgba(0, 196, 140, 0.1);
    padding: 8px 16px;
    border-radius: 8px;
  }

  .video-container {
    padding: 20px;
    margin-bottom: 30px;
  }

  .video-wrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 */
    height: 0;
    overflow: hidden;
    border-radius: 8px;
    background: #000;
  }

  .video-wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .info-container {
    padding: 30px;
  }

  .info-container h2 {
    font-size: 1.5rem;
    margin-bottom: 16px;
  }

  .desc {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 24px;
    color: var(--text-primary);
  }

  .note-box {
    background: rgba(0, 196, 140, 0.05);
    border-left: 4px solid var(--accent-color);
    padding: 16px;
    border-radius: 0 8px 8px 0;
    margin-bottom: 30px;
    color: var(--text-secondary);
  }

  .action-area {
    text-align: center;
    margin-top: 40px;
  }

  .btn-large {
    font-size: 1.2rem;
    padding: 16px 40px;
  }

  @media (max-width: 768px) {
    .detail-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
  }
</style>
