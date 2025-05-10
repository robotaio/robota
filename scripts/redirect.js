
// GitHub Pages에서 SPA 히스토리 모드를 지원하기 위한 스크립트
(function() {
  // 현재 URL 확인
  var isGitHubPages = window.location.hostname.indexOf('github.io') > -1;
  var basePath = '/robota'; // 마지막 슬래시 제외
  
  if (isGitHubPages) {
    // 히스토리 모드를 위한 처리
    console.log('GitHub Pages에서 Docsify를 실행 중입니다.');
    
    // 히스토리 모드에서 서버 측 라우팅이 없으므로, 클라이언트에서 처리
    // 404 페이지가 표시될 때, 원래 요청된 URL을 파싱하여 Docsify가 처리할 수 있게 함
    if (window.location.pathname.indexOf('/404.html') === -1) {
      // 현재 경로를 Docsify에서 처리할 수 있도록 설정
      window.$docsify = window.$docsify || {};
      window.$docsify.routerMode = 'history';
      
      // 경로가 실제 파일을 가리키지 않는 경우 Docsify가 처리할 수 있도록 설정
      var script = document.createElement('script');
      script.text = 'window.$docsify.fallbackPage = true;';
      document.body.appendChild(script);
    }
  }
})();
