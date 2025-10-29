// 메인 애플리케이션 로직
console.log('메인 애플리케이션 로드됨');

class BlogApp {
  constructor() {
    this.posts = [];
    this.filteredPosts = [];
    this.currentTag = '';
    this.currentCategory = '';
    this.searchQuery = '';
    
    this.init();
  }

  async init() {
    console.log('블로그 앱 초기화 시작');
    
    try {
      // 게시글 데이터 로드
      await this.loadPosts();
      
      // UI 초기화
      this.initializeUI();
      
      // 이벤트 리스너 설정
      this.setupEventListeners();
      
      console.log('블로그 앱 초기화 완료');
    } catch (error) {
      console.error('블로그 앱 초기화 실패:', error);
      this.showError('게시글을 불러오는 중 오류가 발생했습니다.');
    }
  }

  async loadPosts() {
    console.log('게시글 데이터 로드 시작');
    
    try {
      const response = await fetch('posts.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      this.posts = await response.json();
      this.filteredPosts = [...this.posts];
      
      console.log(`${this.posts.length}개의 게시글 로드됨`);
    } catch (error) {
      console.error('게시글 로드 실패:', error);
      
      // posts.json이 없을 때 예시 데이터 사용
      this.posts = this.getSamplePosts();
      this.filteredPosts = [...this.posts];
      
      console.log('예시 데이터로 대체됨');
    }
  }

  getSamplePosts() {
    return [
      {
        file: 'example.md',
        title: '첫 번째 게시글',
        date: '2025-01-26',
        tags: ['JavaScript', 'Web'],
        category: 'Development',
        description: '블로그 첫 게시글입니다.',
        excerpt: '이것은 예시 게시글입니다. 실제로는 posts.json 파일에서 게시글 데이터를 불러옵니다.'
      },
      {
        file: 'sample.md',
        title: '두 번째 게시글',
        date: '2025-01-25',
        tags: ['CSS', 'Design'],
        category: 'Tutorial',
        description: 'CSS에 대한 게시글입니다.',
        excerpt: 'CSS를 사용한 스타일링에 대해 알아보겠습니다. 반응형 디자인과 다크 모드에 대한 내용을 포함합니다.'
      }
    ];
  }

  initializeUI() {
    console.log('UI 초기화 시작');
    
    // 로딩 상태 숨기기
    this.hideLoading();
    
    // 게시글 목록 렌더링
    this.renderPosts();
    
    // 필터 옵션 설정
    this.setupFilters();
    
    console.log('UI 초기화 완료');
  }

  setupEventListeners() {
    console.log('이벤트 리스너 설정 시작');
    
    // 검색 입력
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.filterPosts();
      });
    }

    // 검색 버튼
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.filterPosts();
      });
    }

    // 태그 필터
    const tagFilter = document.getElementById('tagFilter');
    if (tagFilter) {
      tagFilter.addEventListener('change', (e) => {
        this.currentTag = e.target.value;
        this.filterPosts();
      });
    }

    // 카테고리 필터
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        this.currentCategory = e.target.value;
        this.filterPosts();
      });
    }

    console.log('이벤트 리스너 설정 완료');
  }

  setupFilters() {
    console.log('필터 옵션 설정 시작');
    
    // 태그 수집
    const allTags = new Set();
    this.posts.forEach(post => {
      post.tags.forEach(tag => allTags.add(tag));
    });

    // 태그 필터 옵션 추가
    const tagFilter = document.getElementById('tagFilter');
    if (tagFilter) {
      Array.from(allTags).sort().forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagFilter.appendChild(option);
      });
    }

    // 카테고리 수집
    const allCategories = new Set();
    this.posts.forEach(post => {
      if (post.category) {
        allCategories.add(post.category);
      }
    });

    // 카테고리 필터 옵션 추가
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      Array.from(allCategories).sort().forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
      });
    }

    console.log('필터 옵션 설정 완료');
  }

  filterPosts() {
    console.log('게시글 필터링 시작');
    console.log('검색어:', this.searchQuery);
    console.log('선택된 태그:', this.currentTag);
    console.log('선택된 카테고리:', this.currentCategory);

    this.filteredPosts = this.posts.filter(post => {
      // 검색어 필터
      if (this.searchQuery) {
        const searchLower = this.searchQuery.toLowerCase();
        const matchesSearch = 
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // 태그 필터
      if (this.currentTag) {
        if (!post.tags.includes(this.currentTag)) return false;
      }

      // 카테고리 필터
      if (this.currentCategory) {
        if (post.category !== this.currentCategory) return false;
      }

      return true;
    });

    console.log(`필터링 결과: ${this.filteredPosts.length}개 게시글`);
    this.renderPosts();
  }

  renderPosts() {
    console.log('게시글 렌더링 시작');
    
    const postsGrid = document.getElementById('postsGrid');
    const noPosts = document.getElementById('noPosts');
    
    if (!postsGrid) {
      console.error('postsGrid 요소를 찾을 수 없습니다');
      return;
    }

    // 기존 게시글 제거
    postsGrid.innerHTML = '';

    if (this.filteredPosts.length === 0) {
      if (noPosts) {
        noPosts.style.display = 'block';
      }
      return;
    }

    if (noPosts) {
      noPosts.style.display = 'none';
    }

    // 게시글 카드 생성
    this.filteredPosts.forEach(post => {
      const postCard = this.createPostCard(post);
      postsGrid.appendChild(postCard);
    });

    console.log(`${this.filteredPosts.length}개 게시글 렌더링 완료`);
  }

  createPostCard(post) {
    console.log('게시글 카드 생성:', post.title);
    
    const card = document.createElement('a');
    card.className = 'post-card';
    card.href = `post.html?file=${encodeURIComponent(post.file)}`;
    
    const tagsHtml = post.tags.map(tag => 
      `<span class="post-card-tag">${this.escapeHtml(tag)}</span>`
    ).join('');

    card.innerHTML = `
      <h2 class="post-card-title">${this.escapeHtml(post.title)}</h2>
      <div class="post-card-meta">
        <time class="post-card-date">${this.formatDate(post.date)}</time>
        <div class="post-card-tags">${tagsHtml}</div>
      </div>
      <p class="post-card-excerpt">${this.escapeHtml(post.excerpt)}</p>
    `;

    return card;
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

  hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.style.display = 'none';
    }
  }

  showError(message) {
    console.error('에러 표시:', message);
    
    const postsGrid = document.getElementById('postsGrid');
    if (postsGrid) {
      postsGrid.innerHTML = `
        <div class="no-posts">
          <p>❌ ${message}</p>
        </div>
      `;
    }
  }
}

// DOM이 로드되면 앱 시작
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM 로드 완료, 블로그 앱 시작');
  new BlogApp();
});
