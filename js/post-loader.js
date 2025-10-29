// 게시글 상세 페이지 로더
console.log('게시글 로더 모듈 로드됨');

class PostLoader {
  constructor() {
    this.postData = null;
    this.markdownContent = '';
    
    this.init();
  }

  async init() {
    console.log('게시글 로더 초기화 시작');
    
    try {
      // URL에서 파일명 가져오기
      const urlParams = new URLSearchParams(window.location.search);
      const fileName = urlParams.get('file');
      
      if (!fileName) {
        throw new Error('파일명이 지정되지 않았습니다');
      }
      
      console.log('로드할 파일:', fileName);
      
      // 게시글 데이터 로드
      await this.loadPostData(fileName);
      
      // 게시글 렌더링
      this.renderPost();
      
      // Giscus 댓글 로드
      this.loadGiscus();
      
      console.log('게시글 로더 초기화 완료');
    } catch (error) {
      console.error('게시글 로드 실패:', error);
      this.showError('게시글을 불러오는 중 오류가 발생했습니다.');
    }
  }

  async loadPostData(fileName) {
    console.log('게시글 데이터 로드 시작:', fileName);
    
    try {
      // posts.json에서 메타데이터 가져오기
      const postsResponse = await fetch('posts.json');
      if (!postsResponse.ok) {
        throw new Error(`posts.json 로드 실패: ${postsResponse.status}`);
      }
      
      const posts = await postsResponse.json();
      this.postData = posts.find(post => post.file === fileName);
      
      if (!this.postData) {
        throw new Error('게시글을 찾을 수 없습니다');
      }
      
      console.log('게시글 메타데이터 로드됨:', this.postData);
      
      // 마크다운 파일 로드
      await this.loadMarkdownContent(fileName);
      
    } catch (error) {
      console.error('게시글 데이터 로드 오류:', error);
      
      // 예시 데이터로 대체
      this.postData = this.getSamplePostData(fileName);
      this.markdownContent = this.getSampleMarkdownContent();
      
      console.log('예시 데이터로 대체됨');
    }
  }

  async loadMarkdownContent(fileName) {
    console.log('마크다운 내용 로드 시작:', fileName);
    
    try {
      const response = await fetch(`pages/${fileName}`);
      if (!response.ok) {
        throw new Error(`마크다운 파일 로드 실패: ${response.status}`);
      }
      
      this.markdownContent = await response.text();
      console.log('마크다운 내용 로드됨');
      
    } catch (error) {
      console.error('마크다운 로드 오류:', error);
      this.markdownContent = this.getSampleMarkdownContent();
    }
  }

  getSamplePostData(fileName) {
    return {
      file: fileName,
      title: '샘플 게시글',
      date: '2025-01-26',
      tags: ['JavaScript', 'Web', 'Tutorial'],
      category: 'Development',
      description: '샘플 게시글입니다.',
      excerpt: '이것은 예시 게시글입니다.'
    };
  }

  getSampleMarkdownContent() {
    return `# 샘플 게시글

이것은 **샘플 게시글**입니다. 실제로는 \`pages/\` 폴더의 마크다운 파일에서 내용을 불러옵니다.

## 주요 기능

- 마크다운 지원
- 코드 하이라이팅
- 다크/라이트 모드
- 반응형 디자인

## 코드 예시

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}

hello();
\`\`\`

## 목록

1. 첫 번째 항목
2. 두 번째 항목
3. 세 번째 항목

- 순서 없는 목록
- 항목 2
- 항목 3

## 링크와 이미지

[GitHub](https://github.com)로 이동하세요.

> 이것은 인용문입니다.

---

이제 블로그가 완성되었습니다! 🎉`;
  }

  renderPost() {
    console.log('게시글 렌더링 시작');
    
    // 제목 설정
    this.setPostTitle();
    
    // 메타데이터 설정
    this.setPostMetadata();
    
    // 내용 렌더링
    this.renderPostContent();
    
    console.log('게시글 렌더링 완료');
  }

  setPostTitle() {
    const titleElement = document.getElementById('postTitle');
    const titleElement2 = document.getElementById('postTitleElement');
    
    if (titleElement) {
      titleElement.textContent = this.postData.title;
    }
    if (titleElement2) {
      titleElement2.textContent = this.postData.title;
    }
    
    // 페이지 제목도 업데이트
    document.title = `${this.postData.title} - 블로그`;
  }

  setPostMetadata() {
    // 날짜 설정
    const dateElement = document.getElementById('postDate');
    if (dateElement) {
      dateElement.textContent = this.formatDate(this.postData.date);
    }
    
    // 태그 설정
    const tagsElement = document.getElementById('postTags');
    if (tagsElement) {
      tagsElement.innerHTML = this.postData.tags
        .map(tag => `<span class="post-tag">${this.escapeHtml(tag)}</span>`)
        .join('');
    }
  }

  renderPostContent() {
    console.log('게시글 내용 렌더링 시작');
    
    const contentElement = document.getElementById('postContent');
    if (!contentElement) {
      console.error('postContent 요소를 찾을 수 없습니다');
      return;
    }
    
    try {
      // Front Matter 제거
      const contentWithoutFrontMatter = this.removeFrontMatter(this.markdownContent);
      
      // 마크다운을 HTML로 변환
      const htmlContent = marked.parse(contentWithoutFrontMatter);
      
      // HTML 삽입
      contentElement.innerHTML = htmlContent;
      
      // 코드 하이라이팅 적용
      this.applyCodeHighlighting();
      
      console.log('게시글 내용 렌더링 완료');
      
    } catch (error) {
      console.error('내용 렌더링 오류:', error);
      contentElement.innerHTML = '<p>내용을 렌더링하는 중 오류가 발생했습니다.</p>';
    }
  }

  removeFrontMatter(content) {
    // Front Matter 제거 (---로 시작하고 끝나는 부분)
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (frontMatterMatch) {
      return frontMatterMatch[2];
    }
    return content;
  }

  applyCodeHighlighting() {
    console.log('코드 하이라이팅 적용');
    
    // Prism.js가 로드되었는지 확인
    if (typeof Prism !== 'undefined') {
      Prism.highlightAll();
      console.log('Prism.js 코드 하이라이팅 적용됨');
    } else {
      console.warn('Prism.js가 로드되지 않았습니다');
    }
  }

  loadGiscus() {
    console.log('Giscus 댓글 시스템 로드 시작');
    
    const commentsElement = document.getElementById('giscus-comments');
    if (!commentsElement) {
      console.warn('댓글 컨테이너를 찾을 수 없습니다');
      return;
    }
    
    // Giscus 스크립트가 이미 로드되었는지 확인
    if (document.querySelector('script[src*="giscus"]')) {
      console.log('Giscus가 이미 로드되어 있습니다');
      return;
    }
    
    // Giscus 스크립트 생성
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'your-username/your-username.github.io');
    script.setAttribute('data-repo-id', 'YOUR_REPO_ID');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '1');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', 'ko');
    script.setAttribute('data-loading', 'lazy');
    script.async = true;
    
    // 스크립트를 댓글 컨테이너에 추가
    commentsElement.appendChild(script);
    
    console.log('Giscus 스크립트 추가됨');
  }

  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('날짜 포맷 오류:', error);
      return dateString;
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showError(message) {
    console.error('에러 표시:', message);
    
    const contentElement = document.getElementById('postContent');
    if (contentElement) {
      contentElement.innerHTML = `
        <div class="error-message" style="
          text-align: center;
          padding: 2rem;
          color: var(--text-muted);
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          margin: 2rem 0;
        ">
          <h2>❌ 오류</h2>
          <p>${message}</p>
          <a href="/" style="
            display: inline-block;
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background: var(--accent-color);
            color: white;
            text-decoration: none;
            border-radius: var(--radius-md);
          ">홈으로 돌아가기</a>
        </div>
      `;
    }
  }
}

// DOM이 로드되면 게시글 로더 시작
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM 로드 완료, 게시글 로더 시작');
  new PostLoader();
});
