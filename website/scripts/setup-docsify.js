/**
 * Docsify 설정 파일을 생성하는 스크립트
 */

import fs from 'fs';
import path from 'path';

// 디렉토리 경로
const DOCS_DIR = path.resolve(process.cwd(), '../docs');

// .nojekyll 파일 생성 (GitHub Pages에서 Jekyll 처리 방지)
function createNojekyllFile() {
  const nojekyllPath = path.join(DOCS_DIR, '.nojekyll');
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
      alias: {
        '/api-reference/core': '/api-reference/core/',
        '/api-reference/openai': '/api-reference/openai/',
        '/api-reference/anthropic': '/api-reference/anthropic/',
        '/api-reference/langchain': '/api-reference/langchain/',
        '/api-reference/replicate': '/api-reference/replicate/',
        '/api-reference/tools': '/api-reference/tools/'
      }
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

  const indexHtmlPath = path.join(DOCS_DIR, 'index.html');
  fs.writeFileSync(indexHtmlPath, indexHtmlContent);
  console.log(`✅ index.html 파일 생성 완료: ${indexHtmlPath}`);
}

// 사이드바 파일 생성
function createSidebar() {
  const sidebarContent = `* [홈](/)
* [시작하기](getting-started.md)
* [핵심 개념](core-concepts.md)
* [API 참조](api-reference.md)
* [프로바이더](providers.md)
* [함수 호출](function-calling.md)
* [모델 컨텍스트 프로토콜](model-context-protocol.md)
* [시스템 메시지](system-messages.md)
* [코드 개선사항](code-improvements.md)`;

  const sidebarPath = path.join(DOCS_DIR, '_sidebar.md');
  fs.writeFileSync(sidebarPath, sidebarContent);
  console.log(`✅ _sidebar.md 파일 생성 완료: ${sidebarPath}`);
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

  const notFoundPath = path.join(DOCS_DIR, '404.html');
  fs.writeFileSync(notFoundPath, notFoundContent);
  console.log(`✅ 404.html 파일 생성 완료: ${notFoundPath}`);
}

// 메인 함수
function main() {
  console.log('🔍 Docsify 설정 파일 생성 중...');

  // 폴더가 존재하는지 확인
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`❌ 문서 디렉토리(${DOCS_DIR})가 존재하지 않습니다.`);
    process.exit(1);
  }

  // 각 파일 생성
  createNojekyllFile();
  createIndexHtml();
  createSidebar();
  create404Page();

  console.log('🎉 Docsify 설정 파일 생성 완료!');
}

// main 함수 실행
try {
  main();
} catch (error) {
  console.error('❌ Docsify 설정 파일 생성 중 오류 발생:', error);
  process.exit(1);
} 