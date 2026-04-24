<script>
  const menuItems = [
    { id: 'ambient', name: '전좌석 엠비언트 라이트 (RGB)', price: '450,000원', note: '스마트폰 앱 연동 가능' },
    { id: 'autotrunk', name: '스마트 오토 트렁크 장착', price: '550,000원', note: '순정형 핏, 풋센서 별도' },
    { id: 'autofrunk', name: '스마트 오토 프렁크 장착', price: '450,000원', note: '부드러운 개폐' },
    { id: 'sunblind', name: '전동 선블라인드 (루프 쉐이드)', price: '380,000원', note: '여름철 필수' },
    { id: 'yoke', name: '요크 스티어링 휠 교체', price: '400,000원', note: '가죽/리얼 카본 옵션' },
    { id: 'swivel', name: '센터 모니터 스위블 브라켓', price: '250,000원', note: '좌우 30도 회전' },
    { id: 'cluster', name: '운전석 계기판 (HUD 디스플레이)', price: '320,000원', note: '속도/배터리 연동' },
    { id: 'rearmonitor', name: '2열 후석 안드로이드 모니터', price: '420,000원', note: '넷플릭스/유튜브 지원' },
    { id: 'softclosing', name: '소프트 클로징 도어', price: '650,000원', note: '4도어 전체' },
    { id: 'blackbox', name: '프리미엄 블랙박스 2채널 시공', price: '250,000원', note: '배선 흡음 처리' },
    { id: 'hipass', name: 'RF 하이패스 매립', price: '120,000원', note: '글로브박스/콘솔 내장' },
    { id: 'pedal', name: '알루미늄 스포츠 페달', price: '80,000원', note: '논슬립 패드 적용' },
    { id: 'widemirror', name: '옵틱글래스 광각 미러', price: '150,000원', note: '사각지대 해소' },
    { id: 'ventseat', name: '통풍 시트 튜닝 (1열)', price: '800,000원', note: '순정형 버튼 이식' },
    { id: 'soundproof', name: '프리미엄 방음 패키지', price: '600,000원', note: '도어/휀다/트렁크' },
    { id: 'doorhandle', name: '오토 도어 핸들', price: '450,000원', note: '웰컴 라이트 포함' }
  ];
</script>

<div class="container page-content">
  <div class="menu-header">
    <div class="shop-logo-large"></div>
    <h1 class="page-title">Premium Tuning <span class="text-accent">Menu</span></h1>
    <p class="subtitle">TPG Lounge만의 프리미엄 전장 튜닝 단가표입니다. 항목을 클릭하시면 상세 영상과 설명을 보실 수 있습니다.</p>
  </div>

  <div class="glass-panel table-container">
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
      </tbody>
    </table>
  </div>
</div>

<style>
  .page-content {
    padding: 60px 20px;
    min-height: 80vh;
  }

  .menu-header {
    text-align: center;
    margin-bottom: 50px;
  }

  .shop-logo-large {
    width: 300px;
    height: 90px;
    margin: 0 auto 24px;
    background-image: url('https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250806_288%2F1754455206110UVHzl_JPEG%2F%25B8%25DE%25B4%25BA%25C6%25C7.JPG');
    background-size: cover;
    background-position: top center;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 196, 140, 0.2);
  }

  .page-title {
    font-size: 3rem;
    margin-bottom: 16px;
  }

  .subtitle {
    color: var(--text-secondary);
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .table-container {
    padding: 0;
    overflow: hidden;
  }

  .menu-table {
    width: 100%;
    border-collapse: collapse;
  }

  .menu-table th, .menu-table td {
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color);
  }

  .menu-table th {
    background: rgba(0, 196, 140, 0.08);
    color: var(--text-primary);
    font-size: 1.1rem;
    text-align: center;
  }

  .menu-table td {
    text-align: center;
    vertical-align: middle;
  }

  .item-name {
    font-weight: 600;
    font-size: 1.1rem;
    text-align: left !important;
  }

  .item-note {
    color: var(--text-secondary);
    font-size: 0.95rem;
    text-align: left !important;
  }

  .price-col {
    font-family: 'Outfit', sans-serif;
    font-size: 1.2rem;
  }

  .font-bold {
    font-weight: 700;
  }

  .menu-row {
    transition: all 0.2s;
  }

  .menu-row:hover {
    background: rgba(0, 196, 140, 0.03);
    transform: scale(1.01);
  }

  .btn-detail {
    background: rgba(0, 196, 140, 0.1);
    color: var(--accent-color);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    border: 1px solid rgba(0, 196, 140, 0.2);
    transition: all 0.3s;
    display: inline-block;
  }

  .btn-detail:hover {
    background: var(--accent-gradient);
    color: white;
    border-color: transparent;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 196, 140, 0.3);
  }

  @media (max-width: 768px) {
    .menu-table th, .menu-table td {
      padding: 12px;
    }
    
    .item-note {
      display: none; /* Hide notes on small screens */
    }
    
    .shop-logo-large {
      width: 100%;
      max-width: 300px;
    }
  }
</style>
