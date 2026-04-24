<script>
  import { goto } from '$app/navigation';
  
  let username = $state('');
  let password = $state('');
  let errorMsg = $state('');

  function handleLogin(e) {
    e.preventDefault();
    if (username === 'tpglounge' && password === '123456789a') {
      // For simple sample purposes, using sessionStorage (Client-side auth)
      // Note: In production, use secure server-side cookies.
      sessionStorage.setItem('admin_auth', 'true');
      goto('/admin/reservation');
    } else {
      errorMsg = '아이디 또는 비밀번호가 일치하지 않습니다.';
    }
  }
</script>

<div class="login-container container">
  <div class="glass-panel login-panel">
    <div class="login-header">
      <h1 class="logo-text">TPG <span class="text-accent">Lounge</span></h1>
      <p class="subtitle">관리자 시스템 로그인</p>
    </div>

    <form onsubmit={handleLogin}>
      {#if errorMsg}
        <div class="error-msg">{errorMsg}</div>
      {/if}
      
      <div class="form-group">
        <label class="form-label">아이디</label>
        <input type="text" class="form-input" bind:value={username} required autofocus />
      </div>
      
      <div class="form-group">
        <label class="form-label">비밀번호</label>
        <input type="password" class="form-input" bind:value={password} required />
      </div>
      
      <button type="submit" class="btn-primary login-btn">로그인</button>
    </form>
  </div>
</div>

<style>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70vh;
  }

  .login-panel {
    width: 100%;
    max-width: 400px;
    padding: 40px;
  }

  .login-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .logo-text {
    font-family: 'Outfit', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .subtitle {
    color: var(--text-secondary);
  }

  .error-msg {
    background: rgba(244, 63, 94, 0.1);
    color: #f43f5e;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 0.9rem;
    text-align: center;
    border: 1px solid rgba(244, 63, 94, 0.3);
  }

  .login-btn {
    width: 100%;
    margin-top: 10px;
    padding: 14px;
    font-size: 1.1rem;
  }
</style>
