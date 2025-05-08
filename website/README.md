# Robota 문서 웹사이트

이 디렉토리는 Robota 프로젝트의 문서 웹사이트를 포함하고 있습니다.

## 개발 서버 실행

```bash
npm run dev
```

## 빌드

```bash
npm run build
```

## GitHub Pages 배포 정보

이 웹사이트는 GitHub Actions를 통해 자동으로 GitHub Pages에 배포됩니다. 배포 구성은 `.github/workflows/deploy-docs.yml` 파일에 정의되어 있습니다.

웹사이트는 상대 경로를 사용하여 `/robota/` 또는 `/` 경로 모두에서 작동할 수 있도록 설정되어 있습니다.

## 기술 스택

- [Next.js](https://nextjs.org/)
- [Nextra](https://nextra.site/) 