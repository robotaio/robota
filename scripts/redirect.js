
// GitHub Pages에서 SPA 히스토리 모드를 지원하기 위한 스크립트
(function() {
  // 현재 URL 확인
  var isGitHubPages = window.location.hostname.indexOf('github.io') > -1 || window.location.hostname.indexOf('robotaio.github.io') > -1;
  var basePath = '/robota'; // 마지막 슬래시 제외
  
  if (isGitHubPages) {
    // 히스토리 모드를 위한 처리
    console.log('GitHub Pages에서 Docsify를 실행 중입니다.');
    
    // 라우터 모드를 history로 강제 설정
    window.$docsify = window.$docsify || {};
    window.$docsify.routerMode = 'history';
    
    // API 참조 경로에 대한 별도 처리 추가
    var pathRegex = /\/robota\/api-reference\/([^\/]+)(?:\/([^\/]+))?(?:\/([^\/]+))?/;
    var currentPath = window.location.pathname;
    var pathMatch = currentPath.match(pathRegex);
    
    if (pathMatch) {
      // API 참조 경로가 맞는지 확인
      var category = pathMatch[1]; // 예: core, openai 등
      var subdir = pathMatch[2];   // 예: classes, interfaces 등
      var file = pathMatch[3];     // 예: FunctionRegistry 등
      
      console.log('API 참조 경로 감지:', { category, subdir, file });
      
      // 존재하지 않는 HTML 파일에 접근한 경우 처리
      if (file && !currentPath.endsWith('.html')) {
        // 실제 문서 경로로 사용할 수 있도록 보정
        window.$docsify.alias = window.$docsify.alias || {};
        window.$docsify.alias[currentPath] = '/robota/api-reference/' + category + '/' + (subdir ? subdir + '/' : '') + file + '.md';
      }
    }
  }
})();
