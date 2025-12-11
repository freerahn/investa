# Cloudflare Pages 빌드 설정 가이드

## 중요: 빌드 설정이 필요합니다!

현재 Cloudflare Pages에서 빌드 명령어가 실행되지 않고 있습니다.

## 해결 방법

### Cloudflare Pages 대시보드에서 설정:

1. Cloudflare 대시보드 → Pages → 프로젝트 선택
2. **Settings** → **Builds & deployments** 클릭
3. 다음 설정을 입력:

   - **Build command**: `npm run build`
   - **Build output directory**: `public`
   - **Root directory**: `/` (또는 비워둠)
   - **Node.js version**: `18` 또는 `20` (선택사항)

4. **Save** 클릭
5. **Retry deployment** 또는 새 커밋을 푸시하여 재배포

### 또는 환경 변수 설정:

- **NPM_VERSION**: `9` (선택사항)

## 확인 방법

배포 로그에서 다음 메시지가 보여야 합니다:
```
Running npm run build
✅ 빌드 완료: X개의 글을 처리했습니다.
```

## 참고

빌드가 실행되지 않으면 `public/api/posts.json` 파일이 생성되지 않아 사이트가 제대로 작동하지 않습니다.

