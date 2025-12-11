// 글보기 페이지

// URL에서 글 ID 가져오기
function getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// 글 로드
async function loadPost() {
    const postId = getPostIdFromUrl();
    const postContainer = document.getElementById('postContainer');
    
    if (!postId) {
        postContainer.innerHTML = '<div class="error">글 ID가 없습니다.</div>';
        return;
    }
    
    try {
        const response = await fetch(`/api/posts/${postId}.json`);
        if (!response.ok) {
            throw new Error('글을 불러올 수 없습니다.');
        }
        
        const post = await response.json();
        
        // 제목 업데이트
        document.title = `${post.title} - 블로그`;
        
        // 글 내용 표시
        postContainer.innerHTML = `
            <div class="post-header">
                <h2>${escapeHtml(post.title)}</h2>
                <div class="post-meta">${escapeHtml(post.date)}</div>
            </div>
            <div class="post-body">
                ${post.html}
            </div>
        `;
        
        // 최신 글 목록 로드
        loadRecentPosts(postId);
    } catch (error) {
        console.error('오류:', error);
        postContainer.innerHTML = `<div class="error">${error.message}</div>`;
    }
}

// 최신 글 목록 로드
async function loadRecentPosts(currentPostId) {
    const recentPostsList = document.getElementById('recentPostsList');
    
    try {
        const response = await fetch('/api/posts.json');
        if (!response.ok) {
            throw new Error('글 목록을 불러올 수 없습니다.');
        }
        
        const posts = await response.json();
        
        // 현재 글 제외하고 최대 10개만
        const recentPosts = posts
            .filter(post => post.id !== currentPostId)
            .slice(0, 10);
        
        if (recentPosts.length === 0) {
            recentPostsList.innerHTML = '<div class="loading">다른 글이 없습니다.</div>';
            return;
        }
        
        recentPostsList.innerHTML = recentPosts.map(post => `
            <div class="recent-post-item">
                <a href="/post.html?id=${post.id}">${escapeHtml(post.title)}</a>
                <div class="post-meta">${escapeHtml(post.date)}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('오류:', error);
        recentPostsList.innerHTML = '<div class="error">최신 글을 불러올 수 없습니다.</div>';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 페이지 로드 시 글 로드
document.addEventListener('DOMContentLoaded', loadPost);

