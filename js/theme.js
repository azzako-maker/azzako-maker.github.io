// 다크/라이트 모드 토글 기능
console.log('테마 관리자 로드됨');

class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('themeToggle');
    this.themeIcon = document.querySelector('.theme-icon');
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    
    this.init();
  }

  init() {
    console.log('테마 초기화 시작, 현재 테마:', this.currentTheme);
    
    // 저장된 테마가 있으면 적용
    this.applyTheme(this.currentTheme);
    
    // 토글 버튼 이벤트 리스너
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }

  getSystemTheme() {
    // 시스템 테마 감지
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  getStoredTheme() {
    // 로컬 스토리지에서 테마 가져오기
    return localStorage.getItem('theme');
  }

  setStoredTheme(theme) {
    // 로컬 스토리지에 테마 저장
    localStorage.setItem('theme', theme);
    console.log('테마 저장됨:', theme);
  }

  applyTheme(theme) {
    console.log('테마 적용 중:', theme);
    
    // HTML 요소에 테마 속성 설정
    document.documentElement.setAttribute('data-theme', theme);
    
    // 아이콘 업데이트
    if (this.themeIcon) {
      this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    
    // 테마 저장
    this.setStoredTheme(theme);
    this.currentTheme = theme;
  }

  toggleTheme() {
    console.log('테마 토글 요청됨, 현재:', this.currentTheme);
    
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    
    console.log('테마 변경 완료:', newTheme);
  }
}

// DOM이 로드되면 테마 관리자 초기화
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM 로드 완료, 테마 관리자 시작');
  new ThemeManager();
});

// 시스템 테마 변경 감지
if (window.matchMedia) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    // 저장된 테마가 없을 때만 시스템 테마 변경에 반응
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      const themeIcon = document.querySelector('.theme-icon');
      if (themeIcon) {
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      }
    }
  });
}
