<script>
  let { data } = $props();
  let item = $derived(data.item);
</script>

<div class="container page-content">
  <div class="back-link">
    <a href="/services/premium-tuning">← 메뉴판으로 돌아가기</a>
  </div>

  <div class="detail-header">
    <h1 class="page-title">{item.name}</h1>
    <div class="price-tag">{item.price}</div>
  </div>

  <div class="glass-panel video-container">
    <div class="video-wrapper">
      <iframe 
        src="https://www.youtube.com/embed/{item.youtubeId}?autoplay=1&mute=1" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen
        title="{item.name} 시공 영상"
      ></iframe>
    </div>
  </div>

  <div class="glass-panel info-container">
    <h2>시공 상세 정보</h2>
    <p class="desc">{item.desc}</p>
    <div class="note-box">
      <strong>참고사항:</strong> {item.note}
    </div>
    
    <div class="action-area">
      <a href="/admin/reservation" class="btn-primary btn-large">이 시공으로 예약하기</a>
    </div>
  </div>
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
