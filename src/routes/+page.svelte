<script lang="ts">
  import { onMount } from 'svelte';

  interface Video {
    id: string;
    title: string;
    thumbnail: string;
    link: string;
    author: string;
  }

  // State for YouTube videos
  let videos: Video[] = $state([]);
  let loading = $state(true);
  let error = $state(false);

  onMount(async () => {
    try {
      // Fetching the latest videos from the channel's RSS feed via a free RSS-to-JSON proxy.
      // This avoids CORS issues and doesn't require an API key for recent videos.
      // Channel ID: UCkLbtnmhg0hqbAEWAwQfWZg
      const rssUrl = encodeURIComponent('https://www.youtube.com/feeds/videos.xml?channel_id=UCkLbtnmhg0hqbAEWAwQfWZg');
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;
      
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch videos');
      
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        // We'll show the top 6 recent/popular videos
        videos = data.items.slice(0, 6).map(item => {
          // Extract video ID from link: https://www.youtube.com/watch?v=VIDEO_ID
          const videoIdMatch = item.link.match(/v=([^&]+)/);
          const videoId = videoIdMatch ? videoIdMatch[1] : '';
          return {
            id: videoId,
            title: item.title,
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            link: item.link,
            author: item.author
          };
        });
      }
    } catch (e) {
      console.error(e);
      error = true;
    } finally {
      loading = false;
    }
  });
</script>

<div class="hero-section">
  <div class="container hero-content">
    <div class="hero-text-area">
      <span class="badge">프리미엄 튜닝 전문</span>
      <h1 class="hero-title">
        차량의 가치를 높이는<br/>
        <span class="text-accent">디테일의 차이</span>
      </h1>
      <p class="hero-subtitle">
        저희 샵은 테슬라 튜닝장착을 하고 있으며 이케아 광명점과 코스트코 광명점 바로 인근에 위치하고 있습니다.<br/>
        주로 전동선쉐이드, 엠비언트, 요크핸들, 오토도어핸들, 도어소프트클로징, 방음 등을 취급하고 있으며 인근 틴팅샵과 협력해서 신차패키지도 하고 있습니다.<br/><br/>
        앞으로도 테슬라 오너분들과 다양한 지식정보 공유도 하고 테슬라 튜닝계 1인자가 되도록 노력하겠습니다.
      </p>
      <div class="hero-actions">
        <a href="/admin/reservation" class="btn-primary btn-large">예약 문의하기</a>
        <a href="/services/premium-tuning" class="btn-secondary btn-large">시공 단가표 보기</a>
      </div>
    </div>
    <div class="hero-image-area">
      <div class="image-wrapper">
        <!-- Dynamic Floating/Zooming Hero Image -->
        <img src="https://yt3.ggpht.com/DRY-LJwqU5mv0_tzu8VG7J9no-PMeWwuvUvHHGPShWGgTZvUO88rRlfP6lmV_gCD8LCBFdE9hCJTn5A=s640-c-fcrop64=1,20000000dfffffff-rw-nd-v1" alt="TPG Lounge Premium Tuning" class="hero-img animated-img"/>
        <div class="image-overlay"></div>
      </div>
    </div>
  </div>
</div>

<section class="services-section container">
  <div class="section-header">
    <h2 class="section-title">주요 시공 서비스</h2>
    <p class="section-desc">차량에 최적화된 맞춤형 시공 라인업을 확인하세요.</p>
  </div>
  <div class="service-grid">
    <a href="/services/premium-tuning" class="service-card glass-panel">
      <div class="icon-box">⚡</div>
      <h3>프리미엄 전장 튜닝</h3>
      <p>블랙박스, 엠비언트 라이트, 오토 트렁크 등 전자 장비 전문 시공 및 투명한 단가표 제공.</p>
    </a>
    <div class="service-card glass-panel">
      <div class="icon-box">🛡️</div>
      <h3>디테일링 & 퍼포먼스</h3>
      <p>요크 스티어링 휠, 방음 패키지 등 차량의 주행 성능과 외관을 한 단계 업그레이드 합니다.</p>
    </div>
    <div class="service-card glass-panel">
      <div class="icon-box">🛠️</div>
      <h3>유지 보수 & 안전</h3>
      <p>주행 중 발생할 수 있는 문제를 예방하고 운전자의 안전을 최우선으로 고려한 장비 장착.</p>
    </div>
  </div>
</section>

<section class="youtube-section">
  <div class="container">
    <div class="section-header center">
      <h2 class="section-title">최신 시공 영상</h2>
      <p class="section-desc">TPG Lounge의 꼼꼼한 작업 과정을 유튜브에서 실시간으로 확인해보세요.</p>
    </div>

    {#if loading}
      <div class="loading-state">
        <div class="spinner"></div>
        <p>영상을 불러오는 중입니다...</p>
      </div>
    {:else if error || videos.length === 0}
      <div class="error-state">
        <p>영상을 불러오지 못했습니다. 채널을 직접 방문해주세요.</p>
        <a href="https://youtube.com/channel/UCkLbtnmhg0hqbAEWAwQfWZg" target="_blank" class="btn-primary mt-4">유튜브 채널 바로가기</a>
      </div>
    {:else}
      <div class="video-grid">
        {#each videos as video}
          <a href={video.link} target="_blank" rel="noopener noreferrer" class="video-card glass-panel">
            <div class="thumbnail-wrapper">
              <img src={video.thumbnail} alt={video.title} class="thumbnail-img" 
                   onerror={(e) => { e.currentTarget.src = 'https://img.youtube.com/vi/' + video.id + '/hqdefault.jpg'; }} />
              <div class="play-icon">▶</div>
            </div>
            <div class="video-info">
              <h4 class="video-title">{video.title}</h4>
              <span class="video-author">{video.author}</span>
            </div>
          </a>
        {/each}
      </div>
      <div class="view-more">
        <a href="https://youtube.com/channel/UCkLbtnmhg0hqbAEWAwQfWZg" target="_blank" rel="noopener noreferrer" class="btn-secondary">
          유튜브에서 더 보기
        </a>
      </div>
    {/if}
  </div>
</section>

<style>
  /* Hero Section */
  .hero-section {
    padding: 80px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
  }

  .hero-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }

  .badge {
    display: inline-block;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 24px;
    backdrop-filter: blur(4px);
  }

  .hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 24px;
    letter-spacing: -0.02em;
    color: white;
  }
  
  .hero-title .text-accent {
    color: #ffffff;
    text-shadow: 0 0 10px rgba(255,255,255,0.5);
  }

  .hero-subtitle {
    font-size: 1.15rem;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.7;
    margin-bottom: 40px;
    max-width: 90%;
  }

  .hero-actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .btn-large {
    padding: 14px 28px;
    font-size: 1.05rem;
    flex: 1 1 auto;
    text-align: center;
  }

  .btn-secondary {
    background: #ffffff;
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Outfit', 'Noto Sans KR', sans-serif;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-sm);
  }

  .btn-secondary:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    box-shadow: var(--shadow-md);
  }

  .hero-image-area {
    position: relative;
  }

  .image-wrapper {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: var(--shadow-lg);
    aspect-ratio: 4/3;
  }

  .hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .animated-img {
    animation: smoothZoom 15s ease-in-out infinite alternate;
    transform-origin: center center;
  }

  @keyframes smoothZoom {
    0% { transform: scale(1); }
    100% { transform: scale(1.1); }
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top right, rgba(5, 150, 105, 0.1), transparent);
  }

  /* Services Section */
  .services-section {
    padding: 100px 24px;
  }

  .section-header {
    margin-bottom: 50px;
    color: white;
  }

  .section-header.center {
    text-align: center;
  }

  .section-title {
    font-size: 2.2rem;
    margin-bottom: 16px;
    color: white;
  }

  .section-desc {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
  }

  .service-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 32px;
  }

  .service-card {
    display: block;
    padding: 40px 32px;
    color: var(--text-primary);
  }

  .icon-box {
    font-size: 2.5rem;
    margin-bottom: 20px;
    display: inline-block;
    padding: 16px;
    background: rgba(57, 197, 187, 0.1);
    border-radius: 16px;
  }

  .service-card h3 {
    font-size: 1.3rem;
    margin-bottom: 16px;
    color: var(--text-primary);
  }

  .service-card p {
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0;
  }

  /* YouTube Section */
  .youtube-section {
    padding: 80px 0 100px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
  }

  .video-card {
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .thumbnail-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;
    overflow: hidden;
    background: #e5e7eb;
  }

  .thumbnail-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .video-card:hover .thumbnail-img {
    transform: scale(1.05);
  }

  .play-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    padding-left: 5px; /* Visual center adjustment for play button */
    opacity: 0.9;
    transition: all 0.2s;
  }

  .video-card:hover .play-icon {
    background: var(--accent-color);
    transform: translate(-50%, -50%) scale(1.1);
  }

  .video-info {
    padding: 20px;
    color: var(--text-primary);
  }

  .video-title {
    font-size: 1.05rem;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
    color: var(--text-primary);
  }

  .video-author {
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  .view-more {
    text-align: center;
    margin-top: 20px;
  }

  .loading-state, .error-state {
    text-align: center;
    padding: 60px;
    color: var(--text-secondary);
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(5, 150, 105, 0.2);
    border-radius: 50%;
    border-top-color: var(--accent-color);
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .mt-4 {
    margin-top: 16px;
  }

  @media (max-width: 992px) {
    .hero-content {
      grid-template-columns: 1fr;
      text-align: center;
    }

    .hero-actions {
      justify-content: center;
    }

    .hero-subtitle {
      margin: 0 auto 40px;
    }
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.2rem;
    }
    .hero-section {
      padding: 40px 16px;
    }
    .section-title {
      font-size: 1.8rem;
    }
    .services-section, .youtube-section {
      padding: 60px 16px;
    }
    .btn-large {
      width: 100%;
    }
    .hero-actions {
      flex-direction: column;
    }
  }
</style>
