
// GitHub Pages에서 SPA 히스토리 모드를 지원하기 위한 스크립트
(function() {
  // 베이스 경로 구하기 (GitHub Pages의 경우 '/robota/' 형식)
  var basePath = '';
  if (window.location.hostname.indexOf('github.io') > -1) {
    // GitHub Pages URL에서 리포지토리 이름 추출
    var pathSegments = window.location.pathname.split('/');
    if (pathSegments.length > 1) {
      basePath = '/' + pathSegments[1] + '/';
    }
  }

  // 현재 URL에서 경로 부분 가져오기
  var path = window.location.pathname;
  var isGitHubPages = window.location.hostname.indexOf('github.io') > -1;
  
  // 404 페이지에서 원래 URL로 리다이렉트 처리
  if (path.endsWith('/404.html')) {
    var redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');
      window.location.replace(redirectPath);
    }
    return;
  }

  // GitHub Pages인 경우와 base path 이후 경로가 있는 경우에만 처리
  if (isGitHubPages && path !== basePath && !path.endsWith('/index.html')) {
    // HTML 파일로 직접 접근한 경우는 다르게 처리
    if (path.endsWith('.html')) {
      var htmlLessPath = path.replace('.html', '');
      sessionStorage.setItem('redirectPath', htmlLessPath);
      window.location.replace(basePath + '404.html');
      return;
    }

    // 현재 경로가 API 참조 경로인지 확인
    if (path.includes('/api-reference/')) {
      // 현재 경로 저장 후 404.html로 리다이렉트
      sessionStorage.setItem('redirectPath', path);
      window.location.replace(basePath + '404.html');
    }
  }
})();
