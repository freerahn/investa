# ⚠️ Cloudflare Pages 404 오류 해결 방법

## 문제 원인

로그에서 다음 메시지가 보입니다:
```
No build command specified. Skipping build step.
```

빌드가 실행되지 않아 사이트가 제대로 배포되지 않았습니다.

## 해결 방법

### 1. Cloudflare Pages 대시보드에서 빌드 설정

1. [Cloudflare 대시보드](https://dash.cloudflare.com)에 로그인
2. **Pages** 메뉴 클릭
3. **investa** 프로젝트 선택
4. **Settings** 탭 클릭
5. **Builds & deployments** 섹션에서 다음 설정:

   ```
   Build command: npm run build
   Build output directory: public
   Root directory: (비워둠)
   ```

6. **Save** 클릭

### 2. 재배포

설정 저장 후:
- **Deployments** 탭으로 이동
- 최신 배포 옆의 **⋮** 메뉴 클릭
- **Retry deployment** 선택

또는 GitHub에 새 커밋을 푸시하면 자동으로 재배포됩니다.

### 3. 확인

배포 로그에서 다음이 보여야 합니다:
```
Running npm run build
✅ 빌드 완료: X개의 글을 처리했습니다.
```

## 현재 상태

- ✅ 빌드 스크립트 준비됨 (`build.js`)
- ✅ 빌드된 파일 커밋됨 (`public/api/posts.json`)
- ❌ Cloudflare Pages 빌드 설정 필요

## 추가 확인사항

배포 후에도 404가 계속되면:
1. 브라우저 캐시 지우기 (Ctrl+Shift+R)
2. 배포 로그에서 에러 확인
3. `public` 디렉토리가 올바르게 배포되었는지 확인

