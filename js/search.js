// 검색 기능 확장
console.log('검색 모듈 로드됨');

class SearchManager {
  constructor() {
    this.searchInput = document.getElementById('searchInput');
    this.searchBtn = document.getElementById('searchBtn');
    this.searchResults = [];
    this.searchHistory = this.loadSearchHistory();
    
    this.init();
  }

  init() {
    console.log('검색 관리자 초기화 시작');
    
    this.setupEventListeners();
    this.setupKeyboardShortcuts();
    
    console.log('검색 관리자 초기화 완료');
  }

  setupEventListeners() {
    console.log('검색 이벤트 리스너 설정');
    
    if (this.searchInput) {
      // 실시간 검색 (디바운싱)
      let searchTimeout;
      this.searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.performSearch(e.target.value);
        }, 300);
      });

      // 엔터키 검색
      this.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.performSearch(e.target.value);
        }
      });

      // 포커스 시 검색 히스토리 표시
      this.searchInput.addEventListener('focus', () => {
        this.showSearchSuggestions();
      });
    }

    if (this.searchBtn) {
      this.searchBtn.addEventListener('click', () => {
        this.performSearch(this.searchInput.value);
      });
    }

    // 검색창 외부 클릭 시 제안 숨기기
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-box')) {
        this.hideSearchSuggestions();
      }
    });
  }

  setupKeyboardShortcuts() {
    console.log('검색 키보드 단축키 설정');
    
    // Ctrl+K 또는 Cmd+K로 검색창 포커스
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (this.searchInput) {
          this.searchInput.focus();
          this.searchInput.select();
        }
      }

      // ESC로 검색창 포커스 해제
      if (e.key === 'Escape') {
        if (this.searchInput) {
          this.searchInput.blur();
        }
        this.hideSearchSuggestions();
      }
    });
  }

  async performSearch(query) {
    console.log('검색 실행:', query);
    
    if (!query.trim()) {
      this.clearSearch();
      return;
    }

    try {
      // 검색 히스토리에 추가
      this.addToSearchHistory(query);
      
      // 검색 결과 하이라이트
      this.highlightSearchResults(query);
      
      // 검색 통계 표시
      this.showSearchStats(query);
      
    } catch (error) {
      console.error('검색 실행 오류:', error);
    }
  }

  highlightSearchResults(query) {
    console.log('검색 결과 하이라이트 시작');
    
    const postCards = document.querySelectorAll('.post-card');
    const searchLower = query.toLowerCase();
    
    postCards.forEach(card => {
      const title = card.querySelector('.post-card-title');
      const excerpt = card.querySelector('.post-card-excerpt');
      
      if (title && excerpt) {
        // 기존 하이라이트 제거
        this.removeHighlight(title);
        this.removeHighlight(excerpt);
        
        // 새 하이라이트 적용
        this.applyHighlight(title, searchLower);
        this.applyHighlight(excerpt, searchLower);
      }
    });
  }

  applyHighlight(element, searchTerm) {
    const text = element.textContent;
    const regex = new RegExp(`(${this.escapeRegExp(searchTerm)})`, 'gi');
    const highlightedText = text.replace(regex, '<mark class="search-highlight">$1</mark>');
    element.innerHTML = highlightedText;
  }

  removeHighlight(element) {
    const text = element.textContent;
    element.innerHTML = text;
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  showSearchStats(query) {
    console.log('검색 통계 표시');
    
    const resultsCount = document.querySelectorAll('.post-card').length;
    
    // 검색 통계 요소가 없으면 생성
    let statsElement = document.querySelector('.search-stats');
    if (!statsElement) {
      statsElement = document.createElement('div');
      statsElement.className = 'search-stats';
      statsElement.style.cssText = `
        margin-bottom: 1rem;
        padding: 0.5rem 1rem;
        background-color: var(--bg-secondary);
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
      `;
      
      const searchSection = document.querySelector('.search-section');
      if (searchSection) {
        searchSection.appendChild(statsElement);
      }
    }
    
    statsElement.innerHTML = `
      <strong>"${query}"</strong>에 대한 검색 결과: <strong>${resultsCount}개</strong>
      <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: var(--text-muted); cursor: pointer;">×</button>
    `;
  }

  clearSearch() {
    console.log('검색 초기화');
    
    // 하이라이트 제거
    const highlightedElements = document.querySelectorAll('.search-highlight');
    highlightedElements.forEach(element => {
      const parent = element.parentNode;
      parent.replaceChild(document.createTextNode(element.textContent), element);
      parent.normalize();
    });
    
    // 검색 통계 제거
    const statsElement = document.querySelector('.search-stats');
    if (statsElement) {
      statsElement.remove();
    }
  }

  addToSearchHistory(query) {
    if (!query.trim()) return;
    
    // 중복 제거
    this.searchHistory = this.searchHistory.filter(item => item !== query);
    
    // 맨 앞에 추가
    this.searchHistory.unshift(query);
    
    // 최대 10개까지만 저장
    this.searchHistory = this.searchHistory.slice(0, 10);
    
    // 로컬 스토리지에 저장
    localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    
    console.log('검색 히스토리 업데이트:', this.searchHistory);
  }

  loadSearchHistory() {
    try {
      const history = localStorage.getItem('searchHistory');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('검색 히스토리 로드 오류:', error);
      return [];
    }
  }

  showSearchSuggestions() {
    console.log('검색 제안 표시');
    
    if (this.searchHistory.length === 0) return;
    
    // 기존 제안 제거
    this.hideSearchSuggestions();
    
    // 제안 컨테이너 생성
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    suggestionsContainer.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-top: none;
      border-radius: 0 0 var(--radius-md) var(--radius-md);
      box-shadow: var(--shadow);
      z-index: 1000;
      max-height: 200px;
      overflow-y: auto;
    `;
    
    // 히스토리 아이템 생성
    this.searchHistory.forEach((item, index) => {
      const suggestionItem = document.createElement('div');
      suggestionItem.className = 'search-suggestion-item';
      suggestionItem.style.cssText = `
        padding: 0.5rem 1rem;
        cursor: pointer;
        border-bottom: 1px solid var(--border-color);
        transition: var(--transition);
      `;
      
      suggestionItem.innerHTML = `
        <span style="color: var(--text-muted); font-size: 0.8rem;">${index + 1}</span>
        <span style="margin-left: 0.5rem;">${this.escapeHtml(item)}</span>
      `;
      
      suggestionItem.addEventListener('click', () => {
        this.searchInput.value = item;
        this.performSearch(item);
        this.hideSearchSuggestions();
      });
      
      suggestionItem.addEventListener('mouseenter', () => {
        suggestionItem.style.backgroundColor = 'var(--bg-secondary)';
      });
      
      suggestionItem.addEventListener('mouseleave', () => {
        suggestionItem.style.backgroundColor = 'transparent';
      });
      
      suggestionsContainer.appendChild(suggestionItem);
    });
    
    // 검색박스에 제안 컨테이너 추가
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
      searchBox.style.position = 'relative';
      searchBox.appendChild(suggestionsContainer);
    }
  }

  hideSearchSuggestions() {
    const suggestions = document.querySelector('.search-suggestions');
    if (suggestions) {
      suggestions.remove();
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// DOM이 로드되면 검색 관리자 초기화
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM 로드 완료, 검색 관리자 시작');
  new SearchManager();
});
