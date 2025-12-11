// 메인 페이지 - 글 목록 표시
async function loadPosts() {
    const postsList = document.getElementById('postsList');
    
    try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
            throw new Error('글 목록을 불러올 수 없습니다.');
        }
        
        const posts = await response.json();
        
        if (posts.length === 0) {
            postsList.innerHTML = '<div class="loading">아직 작성된 글이 없습니다.</div>';
            return;
        }
        
        postsList.innerHTML = posts.map(post => `
            <div class="post-item">
                <h3><a href="/post.html?id=${post.id}">${escapeHtml(post.title)}</a></h3>
                <div class="post-meta">${escapeHtml(post.date)}</div>
                <div class="post-excerpt">${escapeHtml(post.excerpt)}...</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('오류:', error);
        postsList.innerHTML = `<div class="error">${error.message}</div>`;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 페이지 로드 시 글 목록 로드
document.addEventListener('DOMContentLoaded', loadPosts);

