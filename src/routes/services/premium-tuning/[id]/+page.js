export function entries() {
  return [
    { id: 'ambient' },
    { id: 'autotrunk' },
    { id: 'autofrunk' },
    { id: 'sunblind' },
    { id: 'yoke' },
    { id: 'swivel' },
    { id: 'cluster' },
    { id: 'rearmonitor' },
    { id: 'softclosing' },
    { id: 'blackbox' },
    { id: 'hipass' },
    { id: 'pedal' },
    { id: 'widemirror' },
    { id: 'ventseat' },
    { id: 'soundproof' },
    { id: 'doorhandle' }
  ];
}

export function load({ params }) {
  const menuItems = {
    'ambient': { name: '전좌석 엠비언트 라이트 (RGB)', price: '450,000원', note: '스마트폰 앱 연동 가능', youtubeId: 'e82VE8UcKAs', desc: '차량 내부 분위기를 완전히 바꿔주는 최고급 RGB 엠비언트 라이트입니다.' },
    'autotrunk': { name: '스마트 오토 트렁크 장착', price: '550,000원', note: '순정형 핏, 풋센서 별도', youtubeId: 'e82VE8UcKAs', desc: '순정 버튼 및 스마트키와 완벽히 연동되는 전동 트렁크 시스템입니다.' },
    'autofrunk': { name: '스마트 오토 프렁크 장착', price: '450,000원', note: '부드러운 개폐', youtubeId: 'e82VE8UcKAs', desc: '테슬라의 프론트 트렁크를 전동으로 열고 닫을 수 있게 해줍니다.' },
    'sunblind': { name: '전동 선블라인드 (루프 쉐이드)', price: '380,000원', note: '여름철 필수', youtubeId: 'e82VE8UcKAs', desc: '뜨거운 태양열을 막아주는 전동 루프 선블라인드로 쾌적함을 더하세요.' },
    'yoke': { name: '요크 스티어링 휠 교체', price: '400,000원', note: '가죽/리얼 카본 옵션', youtubeId: 'e82VE8UcKAs', desc: '주행 시야를 넓혀주고 스포티함을 더해주는 요크 스티어링 휠 시공입니다.' },
    'swivel': { name: '센터 모니터 스위블 브라켓', price: '250,000원', note: '좌우 30도 회전', youtubeId: 'e82VE8UcKAs', desc: '센터 디스플레이를 운전자 및 조수석 쪽으로 회전시킬 수 있는 틸트 브라켓입니다.' },
    'cluster': { name: '운전석 계기판 (HUD 디스플레이)', price: '320,000원', note: '속도/배터리 연동', youtubeId: 'e82VE8UcKAs', desc: '시선 분산을 막아주는 직관적인 운전석 전면 계기판 디스플레이 장착입니다.' },
    'rearmonitor': { name: '2열 후석 안드로이드 모니터', price: '420,000원', note: '넷플릭스/유튜브 지원', youtubeId: 'e82VE8UcKAs', desc: '뒷좌석 탑승자를 위한 스마트 멀티미디어 디스플레이를 시공합니다.' },
    'softclosing': { name: '소프트 클로징 도어', price: '650,000원', note: '4도어 전체', youtubeId: 'e82VE8UcKAs', desc: '문을 살짝만 닫아도 스르륵 닫히는 고급 세단의 소프트 클로징 기능입니다.' },
    'blackbox': { name: '프리미엄 블랙박스 2채널 시공', price: '250,000원', note: '배선 흡음 처리', youtubeId: 'e82VE8UcKAs', desc: '차량의 미관을 해치지 않는 깔끔한 배선 처리와 고화질 블랙박스 시공입니다.' },
    'hipass': { name: 'RF 하이패스 매립', price: '120,000원', note: '글로브박스/콘솔 내장', youtubeId: 'e82VE8UcKAs', desc: '눈에 띄지 않게 RF 하이패스를 차량 내부에 깔끔하게 매립합니다.' },
    'pedal': { name: '알루미늄 스포츠 페달', price: '80,000원', note: '논슬립 패드 적용', youtubeId: 'e82VE8UcKAs', desc: '미끄럼 방지 기능이 포함된 스포티한 디자인의 알루미늄 페달입니다.' },
    'widemirror': { name: '옵틱글래스 광각 미러', price: '150,000원', note: '사각지대 해소', youtubeId: 'e82VE8UcKAs', desc: '사각지대를 획기적으로 줄여주는 안전 주행 필수품, 광각 미러 교체입니다.' },
    'ventseat': { name: '통풍 시트 튜닝 (1열)', price: '800,000원', note: '순정형 버튼 이식', youtubeId: 'e82VE8UcKAs', desc: '여름철 장거리 운전도 쾌적하게 만들어주는 강력한 통풍 시트 시스템입니다.' },
    'soundproof': { name: '프리미엄 방음 패키지', price: '600,000원', note: '도어/휀다/트렁크', youtubeId: 'e82VE8UcKAs', desc: '풍절음과 노면 소음을 혁신적으로 차단하여 조용한 실내를 만듭니다.' },
    'doorhandle': { name: '오토 도어 핸들', price: '450,000원', note: '웰컴 라이트 포함', youtubeId: 'e82VE8UcKAs', desc: '차량에 다가가면 손잡이가 팝업되는 전동식 오토 도어 핸들 시공입니다.' }
  };

  const item = menuItems[params.id];
  
  if (!item) {
    return {
      status: 404,
      error: new Error('Item not found')
    };
  }

  return {
    item
  };
}
