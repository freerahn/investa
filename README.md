# 블로그 시스템

Markdown 파일 기반 블로그 시스템입니다.

## 설치 및 실행

### 로컬 개발 (Node.js 서버)

1. 의존성 설치:
```bash
npm install
```

2. 서버 실행:
```bash
npm start
```

3. 브라우저에서 접속:
- 메인 페이지: http://localhost:3000
- 관리자 페이지: http://localhost:3000/admin.html

### Cloudflare Pages 배포 (정적 사이트)

1. 의존성 설치:
```bash
npm install
```

2. 빌드 실행 (Markdown을 HTML로 변환):
```bash
npm run build
```

3. GitHub에 커밋 및 푸시:
```bash
git add .
git commit -m "Update posts"
git push
```

4. Cloudflare Pages 설정:
   - Build command: `npm run build`
   - Build output directory: `public`
   - Root directory: `/` (또는 비워둠)

**주의**: Cloudflare Pages에서는 글 작성/수정/삭제 기능이 작동하지 않습니다. 글을 추가하려면 로컬에서 `posts/` 디렉토리에 Markdown 파일을 작성한 후 빌드하고 다시 배포해야 합니다.

## 주요 기능

- **메인 페이지**: 작성된 모든 글 목록 표시
- **관리자 페이지**: 글 작성, 수정, 삭제 (로컬 서버에서만 작동)
- **글보기 페이지**: 
  - PC: 우측에 최신글 목록
  - 모바일: 하단에 최신글 목록
- **데이터 저장**: `posts/` 디렉토리에 Markdown 파일로 저장
- **정적 사이트 지원**: Cloudflare Pages 등 정적 호스팅 서비스에 배포 가능

## 파일 구조

```
project/
├── server.js          # Express 서버 (로컬 개발용)
├── build.js           # 빌드 스크립트 (정적 사이트 생성)
├── package.json       # 의존성 관리
├── posts/             # 글 저장 디렉토리 (자동 생성)
├── public/
│   ├── index.html     # 메인 페이지
│   ├── admin.html     # 관리자 페이지
│   ├── post.html      # 글보기 페이지
│   ├── api/           # 빌드된 API 파일 (JSON)
│   │   ├── posts.json # 글 목록
│   │   └── posts/     # 개별 글 JSON 파일
│   ├── css/
│   │   └── style.css  # 스타일시트
│   └── js/
│       ├── main.js    # 메인 페이지 스크립트
│       ├── admin.js   # 관리자 페이지 스크립트
│       └── post.js    # 글보기 페이지 스크립트
└── .gitignore
```

## 글 형식

각 글은 `posts/` 디렉토리에 다음과 같은 형식으로 저장됩니다:

```markdown
---
title: 글 제목
date: 2024-01-01
---

글 내용 (Markdown 형식)
```

## 주의사항

- `posts/` 디렉토리는 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.
- 코드를 업데이트해도 기존에 작성한 글은 유지됩니다.
- 각 글은 고유한 ID (타임스탬프 기반)로 저장됩니다.

