<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let isAuthenticated = $state(false);

  onMount(() => {
    // Check client-side authentication status
    const auth = sessionStorage.getItem('admin_auth');
    if (auth !== 'true') {
      goto('/login');
    } else {
      isAuthenticated = true;
    }
  });

  function handleLogout() {
    sessionStorage.removeItem('admin_auth');
    goto('/login');
  }

  let { children } = $props();
</script>

{#if isAuthenticated}
  <div class="admin-topbar container">
    <span class="welcome-text">관리자 모드</span>
    <button class="btn-logout" onclick={handleLogout}>로그아웃</button>
  </div>
  
  {@render children()}
{/if}

<style>
  .admin-topbar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    margin-top: 20px;
    gap: 16px;
  }

  .welcome-text {
    font-size: 0.9rem;
    color: var(--text-secondary);
  }

  .btn-logout {
    background: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 6px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s;
  }

  .btn-logout:hover {
    color: var(--text-primary);
    border-color: var(--text-secondary);
  }
</style>
