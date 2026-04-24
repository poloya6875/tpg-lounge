<script>
  import '../app.css';
  let { children } = $props();
</script>

<svelte:head>
  <title>TPG Lounge | 자동차 튜닝 전장비 설치 전문점</title>
  <meta name="description" content="자동차 튜닝, 전장비 설치 전문점 TPG Lounge" />
</svelte:head>

<header class="site-header">
  <!-- Full Headline Banner -->
  <a href="/" class="headline-banner"></a>
  <nav class="main-nav">
    <div class="container nav-links">
      <a href="/">홈</a>
      <a href="/services/premium-tuning">프리미엄 튜닝</a>
      <a href="/admin/reservation">예약 관리</a>
      <a href="/admin/ledger">장부 관리</a>
    </div>
  </nav>
</header>

<main>
  {@render children()}
</main>

<footer>
  <div class="container footer-content">
    <p>&copy; 2026 TPG Lounge. All rights reserved.</p>
    <p class="location">
      📍 오시는 길: <a href="https://naver.me/5yW0ciWz" target="_blank" rel="noopener noreferrer">네이버 지도 보기</a>
    </p>
  </div>
</footer>

<style>
  .site-header {
    width: 100%;
  }

  .headline-banner {
    display: block;
    width: 100%;
    height: 180px; /* 배너 이미지 전체가 잘리지 않고 다 보이도록 높이 조절 */
    background-image: url('/logo-banner.png');
    background-size: contain; /* 이미지가 잘리지 않고 배너 영역에 꽉 차게 들어감 */
    background-position: center;
    background-repeat: no-repeat;
    background-color: #e5f1f1; /* 이미지 배경색과 자연스럽게 어울리도록 연한 톤 지정 */
    border-bottom: 3px solid var(--accent-color);
  }

  .main-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--border-color);
    padding: 16px 0;
    box-shadow: var(--shadow-md);
  }

  .nav-links {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 40px;
  }

  .nav-links a {
    font-weight: 600;
    color: var(--text-secondary);
    transition: color 0.2s ease;
    font-size: 1.05rem;
  }

  .nav-links a:hover {
    color: var(--accent-color);
  }

  main {
    min-height: calc(100vh - 200px);
  }

  footer {
    padding: 50px 0;
    margin-top: 60px;
    background: var(--accent-color); /* Darker Mint / Miku Mint Contrast */
    color: white;
    border-top: 4px solid #ffffff;
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
  }

  .location a {
    color: #ffffff;
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 4px;
    background: rgba(255, 255, 255, 0.2);
    padding: 6px 12px;
    border-radius: 6px;
    transition: all 0.2s;
  }
  .location a:hover {
    background: #ffffff;
    color: var(--accent-color);
  }

  @media (max-width: 768px) {
    .headline-banner {
      height: 100px;
    }
    .nav-links {
      gap: 16px;
      padding: 0 10px;
    }
    .nav-links a {
      font-size: 0.95rem;
    }
    .footer-content {
      flex-direction: column;
      gap: 20px;
      text-align: center;
    }
    footer {
      padding: 30px 0;
    }
  }
</style>
