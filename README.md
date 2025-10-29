# GitHub Pages 정적 블로그

GitHub Pages를 사용한 정적 블로그입니다. 마크다운으로 게시글을 작성하고 자동으로 배포됩니다.

## 🚀 주요 기능

- ✅ **마크다운 지원**: 마크다운 문법으로 게시글 작성
- ✅ **다크/라이트 모드**: 사용자 선호에 따른 테마 전환
- ✅ **반응형 디자인**: 모바일과 데스크톱 모두 지원
- ✅ **검색 기능**: 게시글 제목, 내용, 태그로 검색
- ✅ **태그 및 카테고리 필터링**: 원하는 주제별 게시글 찾기
- ✅ **코드 하이라이팅**: Prism.js를 사용한 코드 문법 강조
- ✅ **댓글 시스템**: Giscus를 통한 GitHub Discussions 연동
- ✅ **자동 배포**: GitHub Actions를 통한 자동 배포

## 📁 프로젝트 구조

```
/
├── .nojekyll                 # Jekyll 비활성화
├── index.html                # 메인 페이지
├── post.html                 # 게시글 상세 페이지
├── posts.json                # 게시글 메타데이터 (자동 생성)
├── css/
│   ├── style.css            # 메인 스타일
│   └── prism.css            # 코드 하이라이팅 테마
├── js/
│   ├── app.js               # 메인 애플리케이션
│   ├── post-loader.js       # 게시글 로더
│   ├── search.js            # 검색 기능
│   └── theme.js             # 테마 토글
├── pages/                   # 마크다운 게시글
│   ├── example.md
│   └── sample.md
└── .github/
    ├── workflows/
    │   └── deploy.yml       # GitHub Actions 워크플로우
    └── scripts/
        └── generate-posts.js # posts.json 생성 스크립트
```

## 🛠️ 설치 및 설정

### 1. 저장소 포크 및 클론

```bash
# 저장소 포크 후 클론
git clone https://github.com/your-username/your-username.github.io.git
cd your-username.github.io
```

### 2. GitHub Pages 설정

1. 저장소 **Settings** > **Pages** 이동
2. **Source**를 "GitHub Actions"로 설정
3. 저장소 이름을 `{your-username}.github.io`로 변경

### 3. Giscus 댓글 시스템 설정

1. 저장소 **Settings** > **General** > **Features**에서 **Discussions** 활성화
2. [Giscus 앱](https://github.com/apps/giscus) 설치
3. [Giscus 설정 페이지](https://giscus.app/ko)에서 설정 정보 가져오기
4. `js/post-loader.js` 파일의 `loadGiscus()` 함수에서 설정 정보 업데이트:

```javascript
script.setAttribute('data-repo', 'your-username/your-username.github.io');
script.setAttribute('data-repo-id', 'YOUR_REPO_ID');
script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID');
```

### 4. 배포

```bash
git add .
git commit -m "feat: 블로그 초기 설정"
git push origin main
```

## 📝 게시글 작성

### 게시글 작성 방법

1. `pages/` 폴더에 `.md` 파일 생성
2. Front Matter에 메타데이터 작성
3. 마크다운으로 내용 작성
4. Git에 커밋 및 푸시

### 게시글 형식

```markdown
---
title: '게시글 제목'
date: 2025-01-26
tags: ['JavaScript', 'Web']
category: 'Development'
description: '게시글 설명'
---

# 제목

내용...
```

### Front Matter 필드

- `title`: 게시글 제목 (필수)
- `date`: 게시일 (YYYY-MM-DD 형식)
- `tags`: 태그 배열
- `category`: 카테고리
- `description`: 게시글 설명

## 🎨 커스터마이징

### 테마 색상 변경

`css/style.css` 파일의 CSS 변수를 수정:

```css
:root {
  --accent-color: #007bff;  /* 메인 색상 */
  --bg-primary: #ffffff;    /* 배경색 */
  --text-primary: #212529;  /* 텍스트 색상 */
}
```

### 폰트 변경

`index.html`과 `post.html`의 Google Fonts 링크 수정:

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
```

## 🔧 개발

### 로컬 개발 서버 실행

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server

# VS Code Live Server 확장 사용
```

### posts.json 수동 생성

```bash
node .github/scripts/generate-posts.js
```

## 📚 사용된 기술

- **HTML5**: 시맨틱 마크업
- **CSS3**: CSS 변수, Flexbox, Grid, 애니메이션
- **Vanilla JavaScript**: ES6+ 문법
- **Marked.js**: 마크다운 파싱
- **Prism.js**: 코드 하이라이팅
- **Giscus**: 댓글 시스템
- **GitHub Actions**: 자동 배포

## 🐛 문제 해결

### 게시글이 표시되지 않는 경우

1. `.nojekyll` 파일이 루트에 있는지 확인
2. `posts.json` 파일이 생성되었는지 확인
3. 브라우저 개발자 도구에서 콘솔 오류 확인

### 댓글이 표시되지 않는 경우

1. GitHub Discussions가 활성화되었는지 확인
2. Giscus 앱이 설치되었는지 확인
3. `js/post-loader.js`의 설정 정보가 올바른지 확인

### 스타일이 적용되지 않는 경우

1. CSS 파일 경로가 올바른지 확인
2. 브라우저 캐시 삭제
3. CSS 변수 문법 확인

## 📄 라이선스

MIT License

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 지원

문제가 있거나 질문이 있으시면 [Issues](https://github.com/your-username/your-username.github.io/issues)에 등록해주세요.

---

⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!
