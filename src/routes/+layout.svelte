<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';

  let { children } = $props();

  let isLoggedIn = $state(false);
  let showLoginModal = $state(false);
  let loginError = $state('');
  let loginId = $state('');
  let loginPw = $state('');

  onMount(() => {
    isLoggedIn = sessionStorage.getItem('tpg_admin') === 'true';
  });

  function openLogin() {
    loginId = '';
    loginPw = '';
    loginError = '';
    showLoginModal = true;
  }

  function doLogin(e: Event) {
    e.preventDefault();
    if (loginId === 'tpglounge' && loginPw === '123456789a') {
      sessionStorage.setItem('tpg_admin', 'true');
      isLoggedIn = true;
      showLoginModal = false;
    } else {
      loginError = '아이디 또는 비밀번호가 올바르지 않습니다.';
    }
  }

  function doLogout() {
    sessionStorage.removeItem('tpg_admin');
    isLoggedIn = false;
  }
</script>

<svelte:head>
  <title>TPG Lounge | 자동차 튜닝 전장비 설치 전문점</title>
  <meta name="description" content="자동차 튜닝, 전장비 설치 전문점 TPG Lounge" />
</svelte:head>

<header class="site-header">
  <!-- Full Headline Banner -->
  <a href="/" class="headline-banner"></a>
  <nav class="main-nav">
    <div class="container nav-bar">
      <div class="nav-links">
        <a href="/">홈</a>
        <a href="/services/premium-tuning">시공단가표</a>
        {#if isLoggedIn}
          <a href="/admin/services">시공목록 관리</a>
          <a href="/admin/reservation">예약 관리</a>
          <a href="/admin/ledger">장부 관리</a>
        {/if}
      </div>
      <div class="auth-area">
        {#if isLoggedIn}
          <span class="admin-badge">관리자</span>
          <button class="btn-logout" onclick={doLogout}>로그아웃</button>
        {:else}
          <button class="btn-login" onclick={openLogin}>🔐 관리자 로그인</button>
        {/if}
      </div>
    </div>
  </nav>
</header>

<!-- Login Modal -->
{#if showLoginModal}
<div class="modal-backdrop" onclick={(e) => { if (e.target === e.currentTarget) showLoginModal = false; }}>
  <div class="login-modal glass-panel">
    <h2>관리자 로그인</h2>
    <form onsubmit={doLogin}>
      <div class="form-group">
        <label class="form-label">아이디</label>
        <input class="form-input" type="text" bind:value={loginId} placeholder="아이디를 입력하세요" autocomplete="username" required />
      </div>
      <div class="form-group">
        <label class="form-label">비밀번호</label>
        <input class="form-input" type="password" bind:value={loginPw} placeholder="비밀번호를 입력하세요" autocomplete="current-password" required />
      </div>
      {#if loginError}
        <p class="login-error">{loginError}</p>
      {/if}
      <button type="submit" class="btn-primary" style="width:100%;margin-top:8px;">로그인</button>
      <button type="button" class="btn-close-modal" onclick={() => showLoginModal = false}>취소</button>
    </form>
  </div>
</div>
{/if}

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
  .site-header { width: 100%; }

  .headline-banner {
    display: block;
    width: 100%;
    height: 180px;
    background-image: url('/logo-banner.png');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #e5f1f1;
    border-bottom: 3px solid var(--accent-color);
  }

  .main-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255, 255, 255, 0.97);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--border-color);
    padding: 14px 0;
    box-shadow: var(--shadow-md);
  }

  .nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .nav-links {
    display: flex;
    flex-wrap: wrap;
    gap: 32px;
  }

  .nav-links a {
    font-weight: 600;
    color: var(--text-secondary);
    transition: color 0.2s ease;
    font-size: 1.05rem;
  }

  .nav-links a:hover { color: var(--accent-color); }

  .auth-area {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .admin-badge {
    background: rgba(57, 197, 187, 0.15);
    color: var(--accent-color);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 700;
    border: 1px solid var(--border-mint);
  }

  .btn-login {
    background: var(--accent-color);
    color: white;
    border: none;
    padding: 8px 18px;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Noto Sans KR', sans-serif;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .btn-login:hover { background: var(--accent-hover); transform: translateY(-1px); }

  .btn-logout {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Noto Sans KR', sans-serif;
    transition: all 0.2s;
  }
  .btn-logout:hover { background: #f43f5e; color: white; border-color: transparent; }

  /* Login Modal */
  .modal-backdrop {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.5);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
  }

  .login-modal {
    width: 100%;
    max-width: 420px;
    padding: 40px;
    background: white;
  }

  .login-modal h2 {
    font-size: 1.8rem;
    margin-bottom: 28px;
    text-align: center;
    color: var(--text-primary);
  }

  .login-error {
    color: #f43f5e;
    font-size: 0.9rem;
    text-align: center;
    margin-top: 8px;
  }

  .btn-close-modal {
    width: 100%;
    margin-top: 10px;
    background: transparent;
    border: 1px solid var(--border-color);
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95rem;
    color: var(--text-secondary);
    font-family: 'Noto Sans KR', sans-serif;
  }
  .btn-close-modal:hover { background: #f8fafc; }

  main { min-height: calc(100vh - 200px); }

  footer {
    padding: 50px 0;
    margin-top: 60px;
    background: var(--accent-color);
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
  .location a:hover { background: #ffffff; color: var(--accent-color); }

  @media (max-width: 768px) {
    .headline-banner { height: 100px; }
    .nav-bar { flex-wrap: wrap; gap: 10px; }
    .nav-links { gap: 16px; }
    .nav-links a { font-size: 0.9rem; }
    .btn-login { font-size: 0.85rem; padding: 7px 12px; }
    .footer-content { flex-direction: column; gap: 20px; text-align: center; }
    footer { padding: 30px 0; }
  }
</style>
