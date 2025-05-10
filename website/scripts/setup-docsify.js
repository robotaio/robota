/**
 * Docsify 설정 파일을 생성하는 스크립트
 */

import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

// 디렉토리 경로
const DIST_DIR = path.resolve(process.cwd(), './dist');
const API_DOCS_DIR = path.resolve(DIST_DIR, 'api-reference');

// .nojekyll 파일 생성 (GitHub Pages에서 Jekyll 처리 방지)
function createNojekyllFile() {
  const nojekyllPath = path.join(DIST_DIR, '.nojekyll');
  fs.writeFileSync(nojekyllPath, '');
  console.log(`✅ .nojekyll 파일 생성 완료: ${nojekyllPath}`);
}

// index.html 파일 생성
function createIndexHtml() {
  const indexHtmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta charset="UTF-8">
  <title>Robota 문서</title>
  <meta name="description" content="Robota는 AI 애플리케이션을 개발하기 위한 오픈소스 라이브러리입니다.">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsify@4/themes/vue.css">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤖</text></svg>">
  <style>
    :root {
      --theme-color: #42b983;
      --sidebar-width: 300px;
    }
    .sidebar {
      padding: 20px;
    }
    .markdown-section {
      max-width: 900px;
    }
    .markdown-section code {
      background-color: #f8f8f8;
    }
  </style>
  <script src="/scripts/redirect.js"></script>
</head>
<body>
  <div id="app"></div>
  <script>
    window.$docsify = {
      name: 'Robota',
      repo: 'https://github.com/robotaio/robota',
      loadSidebar: true,
      subMaxLevel: 3,
      auto2top: true,
      homepage: 'README.md',
      search: {
        maxAge: 86400000,
        paths: 'auto',
        placeholder: '검색',
        noData: '결과 없음',
        depth: 6
      },
      copyCode: {
        buttonText: '복사',
        errorText: '오류',
        successText: '복사됨'
      },
      pagination: {
        previousText: '이전',
        nextText: '다음',
        crossChapter: true
      },
      notFoundPage: '404.html',
      routerMode: 'history',
      alias: {
        '/api-reference/core': '/api-reference/core/',
        '/api-reference/openai': '/api-reference/openai/',
        '/api-reference/anthropic': '/api-reference/anthropic/',
        '/api-reference/langchain': '/api-reference/langchain/',
        '/api-reference/replicate': '/api-reference/replicate/',
        '/api-reference/tools': '/api-reference/tools/'
      },
      plugins: [
        function(hook, vm) {
          hook.doneEach(function() {
            document.title = vm.config.name + ' - ' + vm.route.file.split('/').pop().replace('.md', '');
            
            const existingMeta = document.querySelector('meta[name="description"]');
            if (existingMeta) existingMeta.remove();
            
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = 'Robota ' + vm.route.file.split('/').pop().replace('.md', '') + ' 문서';
            document.head.appendChild(meta);
          });
        }
      ]
    }
  </script>
  <script src="https://cdn.jsdelivr.net/npm/docsify@4/lib/docsify.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/docsify@4/lib/plugins/search.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/docsify-copy-code/dist/docsify-copy-code.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/docsify-pagination/dist/docsify-pagination.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-bash.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-javascript.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-typescript.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-json.min.js"></script>
</body>
</html>`;

  const indexHtmlPath = path.join(DIST_DIR, 'index.html');
  fs.writeFileSync(indexHtmlPath, indexHtmlContent);
  console.log(`✅ index.html 파일 생성 완료: ${indexHtmlPath}`);
}

// API 참조 카테고리 목록 가져오기
function getApiCategories() {
  if (!fs.existsSync(API_DOCS_DIR)) {
    return [];
  }

  const categories = fs.readdirSync(API_DOCS_DIR)
    .filter(item => {
      const itemPath = path.join(API_DOCS_DIR, item);
      return fs.statSync(itemPath).isDirectory();
    })
    .map(category => {
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      return { name: categoryName, path: `api-reference/${category}` };
    });

  return categories;
}

// 하위 디렉토리에 index.md 파일 생성
function createSubdirectoryIndexFiles(categories) {
  console.log('🔍 하위 디렉토리 index.md 파일 생성 중...');

  categories.forEach(category => {
    const categoryPath = path.join(DIST_DIR, category.path);
    if (!fs.existsSync(categoryPath)) return;

    // 하위 디렉토리 확인(classes, interfaces 등)
    const subdirs = fs.readdirSync(categoryPath)
      .filter(item => {
        const itemPath = path.join(categoryPath, item);
        return fs.statSync(itemPath).isDirectory();
      });

    subdirs.forEach(subdir => {
      const subdirPath = path.join(categoryPath, subdir);
      const indexPath = path.join(subdirPath, 'index.md');

      // 이미 index.md가 있는지 확인
      if (fs.existsSync(indexPath)) return;

      // 하위 디렉토리의 모든 마크다운 파일 찾기
      const mdFiles = globSync(path.join(subdirPath, '*.md'));
      if (mdFiles.length === 0) return;

      // 인덱스 파일 내용 생성
      const categoryTitle = category.name;
      const subdirTitle = subdir.charAt(0).toUpperCase() + subdir.slice(1);

      let indexContent = `# ${categoryTitle} ${subdirTitle}\n\n${categoryTitle} 패키지의 ${subdirTitle} 목록입니다.\n\n`;

      // 모든 파일을 링크로 추가
      mdFiles.forEach(file => {
        const fileName = path.basename(file, '.md');
        if (fileName !== 'index') {
          indexContent += `- [${fileName}](./${fileName}.md)\n`;
        }
      });

      // 인덱스 파일 저장
      fs.writeFileSync(indexPath, indexContent);
      console.log(`✅ ${subdir} 디렉토리에 index.md 파일 생성 완료: ${indexPath}`);
    });
  });

  console.log('🎉 하위 디렉토리 index.md 파일 생성 완료!');
}

// 사이드바 파일 생성
function createSidebar() {
  // 기본 사이드바 항목
  let sidebarContent = `* [홈](/)
* [시작하기](getting-started.md)
* [핵심 개념](core-concepts.md)
* [API 참조](api-reference.md)`;

  // API 카테고리 추가
  const apiCategories = getApiCategories();
  if (apiCategories.length > 0) {
    apiCategories.forEach(category => {
      sidebarContent += `\n  * [${category.name}](${category.path}/)`;

      // 각 카테고리의 내부 파일 가져오기 (선택적으로 추가)
      try {
        const categoryPath = path.join(DIST_DIR, category.path);
        const indexPath = path.join(categoryPath, 'index.md');

        if (fs.existsSync(indexPath)) {
          const indexContent = fs.readFileSync(indexPath, 'utf8');
          const links = indexContent.match(/\[.*?\]\(.*?\.md\)/g);

          if (links) {
            links.forEach(link => {
              // 기본 링크 형식: [이름](경로.md)
              const linkMatch = link.match(/\[(.*?)\]\((.*?)\)/);
              if (linkMatch && linkMatch[1] && linkMatch[2] && !linkMatch[1].includes('index')) {
                const linkName = linkMatch[1];
                const linkPath = linkMatch[2];
                sidebarContent += `\n    * [${linkName}](${category.path}/${linkPath})`;
              }
            });
          }
        }
      } catch (error) {
        console.warn(`⚠️ ${category.name} 카테고리의 하위 항목을 가져오는 중 오류 발생:`, error);
      }
    });
  }

  // 나머지 항목 추가
  sidebarContent += `
* [프로바이더](providers.md)
* [함수 호출](function-calling.md)
* [모델 컨텍스트 프로토콜](model-context-protocol.md)
* [시스템 메시지](system-messages.md)
* [코드 개선사항](code-improvements.md)`;

  const sidebarPath = path.join(DIST_DIR, '_sidebar.md');
  fs.writeFileSync(sidebarPath, sidebarContent);
  console.log(`✅ _sidebar.md 파일 생성 완료: ${sidebarPath}`);

  // API 참조 디렉토리에도 동일한 사이드바 파일 복사
  if (fs.existsSync(API_DOCS_DIR)) {
    fs.writeFileSync(path.join(API_DOCS_DIR, '_sidebar.md'), sidebarContent);
    console.log(`✅ API 참조 디렉토리에 _sidebar.md 파일 복사 완료`);

    // 각 API 카테고리 디렉토리에도 사이드바 파일 복사
    apiCategories.forEach(category => {
      const categoryPath = path.join(DIST_DIR, category.path);
      if (fs.existsSync(categoryPath)) {
        fs.writeFileSync(path.join(categoryPath, '_sidebar.md'), sidebarContent);
        console.log(`✅ ${category.name} 카테고리 디렉토리에 _sidebar.md 파일 복사 완료`);

        // 하위 디렉토리(classes, interfaces 등)에도 사이드바 파일 복사
        const subdirs = fs.readdirSync(categoryPath)
          .filter(item => {
            const itemPath = path.join(categoryPath, item);
            return fs.statSync(itemPath).isDirectory();
          });

        subdirs.forEach(subdir => {
          const subdirPath = path.join(categoryPath, subdir);
          fs.writeFileSync(path.join(subdirPath, '_sidebar.md'), sidebarContent);
          console.log(`✅ ${category.name}/${subdir} 디렉토리에 _sidebar.md 파일 복사 완료`);
        });
      }
    });
  }
}

// 404 페이지 생성
function create404Page() {
  const notFoundContent = `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta charset="UTF-8">
  <title>페이지를 찾을 수 없습니다 - Robota</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsify@4/themes/vue.css">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤖</text></svg>">
</head>
<body>
  <div id="app">페이지를 찾을 수 없습니다. <a href="/">홈으로 돌아가기</a></div>
</body>
</html>`;

  const notFoundPath = path.join(DIST_DIR, '404.html');
  fs.writeFileSync(notFoundPath, notFoundContent);
  console.log(`✅ 404.html 파일 생성 완료: ${notFoundPath}`);
}

// GitHub Pages 지원을 위한 URL 리다이렉트 파일 생성
function createRedirects() {
  // GitHub Pages에서 SPA 히스토리 모드를 지원하기 위한 스크립트 생성
  const scriptContent = `
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
`;

  // 스크립트를 저장할 파일 경로
  const scriptPath = path.join(DIST_DIR, 'scripts');
  if (!fs.existsSync(scriptPath)) {
    fs.mkdirSync(scriptPath, { recursive: true });
  }

  const redirectScriptPath = path.join(scriptPath, 'redirect.js');
  fs.writeFileSync(redirectScriptPath, scriptContent);
  console.log(`✅ GitHub Pages 리다이렉트 스크립트 생성 완료: ${redirectScriptPath}`);

  // 404 페이지 업데이트
  const notFoundContent = `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta charset="UTF-8">
  <title>페이지를 찾을 수 없습니다 - Robota</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsify@4/themes/vue.css">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤖</text></svg>">
  <script src="/scripts/redirect.js"></script>
</head>
<body>
  <div id="app">페이지를 찾을 수 없습니다. <a href="/">홈으로 돌아가기</a></div>
</body>
</html>`;

  const notFoundPath = path.join(DIST_DIR, '404.html');
  fs.writeFileSync(notFoundPath, notFoundContent);
  console.log(`✅ 404.html 페이지 업데이트 완료`);

  // index.html 업데이트
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf-8');
    // 이미 스크립트를 포함하고 있지 않은지 확인
    if (!indexContent.includes('redirect.js')) {
      // </head> 태그 전에 스크립트 추가
      indexContent = indexContent.replace('</head>', '  <script src="/scripts/redirect.js"></script>\n</head>');
      fs.writeFileSync(indexPath, indexContent);
      console.log(`✅ index.html에 리다이렉트 스크립트 추가 완료`);
    }
  }
}

// 메인 함수
function main() {
  console.log('🔍 Docsify 설정 파일 생성 중...');

  // 폴더가 존재하는지 확인
  if (!fs.existsSync(DIST_DIR)) {
    console.error(`❌ 문서 디렉토리(${DIST_DIR})가 존재하지 않습니다.`);
    process.exit(1);
  }

  // 각 파일 생성
  createNojekyllFile();
  createIndexHtml();

  // API 카테고리 가져오기
  const apiCategories = getApiCategories();

  // 하위 디렉토리 index.md 파일 생성
  createSubdirectoryIndexFiles(apiCategories);

  createSidebar();
  create404Page();
  createRedirects();

  console.log('🎉 Docsify 설정 파일 생성 완료!');
}

// main 함수 실행
try {
  main();
} catch (error) {
  console.error('❌ Docsify 설정 파일 생성 중 오류 발생:', error);
  process.exit(1);
} 