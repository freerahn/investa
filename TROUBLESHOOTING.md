# 🔧 Cloudflare Pages 404 오류 해결 가이드

## 현재 문제

`https://investa.pages.dev/` 또는 배포 해시 URL에서 404 오류가 발생합니다.

## 원인

배포 로그에서 다음이 확인되었습니다:
```
No build command specified. Skipping build step.
```

**빌드가 실행되지 않아 `public` 디렉토리가 배포되지 않았습니다.**

## 해결 방법 (필수)

### 1단계: Cloudflare Pages 대시보드에서 빌드 설정

1. [Cloudflare 대시보드](https://dash.cloudflare.com) 로그인
2. 왼쪽 메뉴에서 **Pages** 클릭
3. **investa** 프로젝트 선택
4. 상단 **Settings** 탭 클릭
5. **Builds & deployments** 섹션으로 스크롤
6. 다음 설정을 **정확히** 입력:

   ```
   Build command: npm run build
   Build output directory: public
   Root directory: (비워둠 - 아무것도 입력하지 않음)
   ```

7. **Save** 버튼 클릭

### 2단계: 재배포

설정 저장 후:

**방법 A: 수동 재배포**
- **Deployments** 탭으로 이동
- 최신 배포 옆의 **⋮** (점 3개) 메뉴 클릭
- **Retry deployment** 선택

**방법 B: 자동 재배포**
- GitHub에 새 커밋을 푸시하면 자동으로 재배포됩니다

### 3단계: 확인

배포 로그에서 다음이 보여야 합니다:

```
Installing dependencies
Running npm run build
✅ 빌드 완료: X개의 글을 처리했습니다.
Uploading... (X/X)
✨ Upload complete!
Success: Your site was deployed!
```

## 중요 확인사항

### ✅ 빌드 출력 디렉토리 확인

Cloudflare Pages는 **빌드 출력 디렉토리**의 내용만 배포합니다.

- 빌드 출력 디렉토리가 `public`이면 → `public/index.html`이 배포됩니다
- 빌드 출력 디렉토리가 `.`이면 → 루트의 `index.html`이 배포됩니다

**현재 프로젝트는 `public` 디렉토리를 사용하므로 반드시 `public`으로 설정해야 합니다.**

### ✅ 빌드 명령어 확인

빌드 명령어는 다음 중 하나를 사용할 수 있습니다:
- `npm run build` (권장)
- `npm install && npm run build` (의존성 설치 포함)

### ✅ 파일 구조 확인

배포 후 다음 파일들이 있어야 합니다:
- `/index.html` (메인 페이지)
- `/css/style.css` (스타일시트)
- `/js/main.js` (스크립트)
- `/api/posts.json` (글 목록)

## 추가 문제 해결

### 문제: 빌드 설정을 했는데도 404가 발생

1. **배포 로그 확인**
   - Deployments 탭 → 최신 배포 클릭 → 로그 확인
   - 빌드 에러가 있는지 확인

2. **빌드 출력 디렉토리 재확인**
   - `public` 디렉토리에 `index.html`이 있는지 확인
   - 빌드 출력 디렉토리가 정확히 `public`인지 확인 (앞뒤 공백 없음)

3. **캐시 지우기**
   - 브라우저 캐시 지우기 (Ctrl+Shift+R)
   - Cloudflare 캐시 퍼지 (선택사항)

### 문제: 빌드는 성공했지만 여전히 404

1. **`_redirects` 파일 확인**
   - `public/_redirects` 파일이 있어야 합니다
   - 내용: `/*    /index.html   200`

2. **파일 경로 확인**
   - 모든 경로가 절대 경로(`/css/style.css`)인지 확인
   - 상대 경로(`css/style.css`)는 문제를 일으킬 수 있습니다

## 현재 프로젝트 상태

- ✅ `build.js` - 빌드 스크립트 준비됨
- ✅ `package.json` - 빌드 명령어 정의됨 (`npm run build`)
- ✅ `public/index.html` - 메인 페이지 준비됨
- ✅ `public/_redirects` - 리다이렉트 규칙 준비됨
- ❌ **Cloudflare Pages 빌드 설정 필요** (대시보드에서 설정)

## 연락처

문제가 계속되면:
1. Cloudflare Pages 배포 로그 전체를 확인
2. 에러 메시지를 기록
3. GitHub Issues에 문제 보고

