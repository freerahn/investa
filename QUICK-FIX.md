# 🚨 긴급: 404 오류 해결 방법

## 문제
`https://investa.pages.dev/`에서 404 오류가 발생합니다.

## 원인
Cloudflare Pages에서 **빌드가 실행되지 않아** `public` 디렉토리가 배포되지 않았습니다.

## 해결 방법 (5분 안에 해결)

### ⚠️ 필수 단계: Cloudflare Pages 설정

1. **Cloudflare 대시보드 접속**
   - https://dash.cloudflare.com 로그인

2. **Pages 프로젝트 선택**
   - 왼쪽 메뉴에서 **Pages** 클릭
   - **investa** 프로젝트 클릭

3. **Settings 탭 클릭**
   - 상단 메뉴에서 **Settings** 클릭

4. **Builds & deployments 섹션 찾기**
   - 아래로 스크롤하여 **Builds & deployments** 섹션 찾기

5. **다음 설정 입력** (정확히 복사해서 붙여넣기):
   ```
   Build command: npm run build
   Build output directory: public
   Root directory: (비워둠 - 아무것도 입력하지 않음)
   ```

6. **Save 버튼 클릭**

7. **재배포**
   - **Deployments** 탭 클릭
   - 최신 배포 옆의 **⋮** (점 3개) 메뉴 클릭
   - **Retry deployment** 선택

### ✅ 확인

배포가 완료되면 (약 1-2분 소요):
- 배포 로그에서 `Running npm run build` 메시지 확인
- `✅ 빌드 완료` 메시지 확인
- `https://investa.pages.dev/` 접속하여 사이트 확인

## 중요 사항

- **Build output directory**는 반드시 `public`이어야 합니다 (소문자, 앞뒤 공백 없음)
- **Root directory**는 비워두어야 합니다
- 설정 후 반드시 **Save** 버튼을 클릭해야 합니다

## 여전히 안 되나요?

1. 배포 로그를 확인하세요 (Deployments → 최신 배포 클릭)
2. 에러 메시지가 있는지 확인하세요
3. 빌드 명령어가 실행되었는지 확인하세요

