# 블로그 시스템

Markdown 파일 기반 블로그 시스템입니다.

## 설치 및 실행

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

## 주요 기능

- **메인 페이지**: 작성된 모든 글 목록 표시
- **관리자 페이지**: 글 작성, 수정, 삭제
- **글보기 페이지**: 
  - PC: 우측에 최신글 목록
  - 모바일: 하단에 최신글 목록
- **데이터 저장**: `posts/` 디렉토리에 Markdown 파일로 저장
- **코드 보호**: `.gitignore`에 `posts/` 디렉토리가 포함되어 있어 코드 업데이트 시 기존 글이 삭제되지 않습니다.

## 파일 구조

```
project/
├── server.js          # Express 서버
├── package.json       # 의존성 관리
├── posts/             # 글 저장 디렉토리 (자동 생성)
├── public/
│   ├── index.html     # 메인 페이지
│   ├── admin.html     # 관리자 페이지
│   ├── post.html      # 글보기 페이지
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

