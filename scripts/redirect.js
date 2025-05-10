
// GitHub Pages에서 SPA 히스토리 모드를 지원하기 위한 스크립트
(function() {
  // 현재 URL에서 경로 부분 가져오기
  var path = window.location.pathname;
  var isGitHubPages = window.location.hostname.indexOf('github.io') > -1;
  
  // 이미 index.html로 접근한 경우나 404 페이지인 경우는 처리하지 않음
  if (path === '/' || path.endsWith('/index.html') || path.endsWith('/404.html')) {
    return;
  }

  // HTML 파일로 직접 접근한 경우 처리
  if (path.endsWith('.html')) {
    window.location.href = path.replace('.html', '');
    return;
  }

  // 디렉토리 경로에 후행 슬래시가 없는 경우 추가
  if (!path.endsWith('/') && !path.includes('.')) {
    window.location.href = path + '/';
    return;
  }

  // GitHub Pages의 경우 SPA 리다이렉트 처리
  if (isGitHubPages) {
    // 404.html 페이지에서 원래 경로를 복원
    if (path === '/404.html') {
      var redirectTo = sessionStorage.getItem('redirectPath');
      if (redirectTo) {
        sessionStorage.removeItem('redirectPath');
        window.location.replace(redirectTo);
      }
    } else {
      // 현재 경로를 저장하고 404.html로 리다이렉트
      sessionStorage.setItem('redirectPath', path);
      window.location.replace('/404.html');
    }
  }
})();
