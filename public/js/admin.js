// 관리자 페이지 - 글 작성, 수정, 삭제

let editingPostId = null;

// 페이지 로드 시
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    setupForm();
});

// 폼 설정
function setupForm() {
    const form = document.getElementById('postForm');
    form.addEventListener('submit', handleSubmit);
}

// 폼 제출 처리
async function handleSubmit(e) {
    e.preventDefault();
    
    alert('⚠️ 정적 사이트에서는 글 작성/수정이 불가능합니다.\n\n글을 추가하려면:\n1. 로컬에서 posts/ 디렉토리에 Markdown 파일을 작성\n2. npm run build 실행\n3. GitHub에 커밋 및 푸시\n4. Cloudflare Pages가 자동으로 재배포');
    return;
    
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    
    if (!title || !content) {
        alert('제목과 내용을 모두 입력해주세요.');
        return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '처리 중...';
    
    try {
        let response;
        
        if (editingPostId) {
            // 수정
            response = await fetch(`/api/posts/${editingPostId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content })
            });
        } else {
            // 작성
            response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content })
            });
        }
        
        // 네트워크 오류 체크
        if (!response) {
            throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
        }
        
        let data;
        try {
            data = await response.json();
        } catch (parseError) {
            throw new Error(`서버 응답 오류 (상태 코드: ${response.status}). 서버 콘솔을 확인해주세요.`);
        }
        
        if (!response.ok) {
            throw new Error(data.error || '작업을 완료할 수 없습니다.');
        }
        
        // 성공
        alert(data.message);
        resetForm();
        loadPosts();
    } catch (error) {
        console.error('오류:', error);
        alert(`오류: ${error.message}\n\n자세한 내용은 브라우저 개발자 도구 콘솔을 확인해주세요.`);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// 글 수정
async function editPost(id) {
    try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) {
            throw new Error('글을 불러올 수 없습니다.');
        }
        
        const post = await response.json();
        
        // 폼에 데이터 채우기
        document.getElementById('postId').value = post.id;
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postContent').value = post.body;
        
        // UI 업데이트
        editingPostId = post.id;
        document.getElementById('formTitle').textContent = '글 수정';
        document.getElementById('submitBtn').textContent = '수정';
        document.getElementById('cancelBtn').style.display = 'inline-block';
        
        // 폼으로 스크롤
        document.getElementById('postForm').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('오류:', error);
        alert(error.message);
    }
}

// 글 삭제
async function deletePost(id) {
    alert('⚠️ 정적 사이트에서는 글 삭제가 불가능합니다.\n\n글을 삭제하려면:\n1. 로컬에서 posts/ 디렉토리에서 해당 파일 삭제\n2. npm run build 실행\n3. GitHub에 커밋 및 푸시\n4. Cloudflare Pages가 자동으로 재배포');
    return;
    
    if (!confirm('정말로 이 글을 삭제하시겠습니까?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/posts/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || '글을 삭제할 수 없습니다.');
        }
        
        alert(data.message);
        loadPosts();
    } catch (error) {
        console.error('오류:', error);
        alert(error.message);
    }
}

// 폼 초기화
function resetForm() {
    editingPostId = null;
    document.getElementById('postForm').reset();
    document.getElementById('postId').value = '';
    document.getElementById('formTitle').textContent = '새 글 작성';
    document.getElementById('submitBtn').textContent = '작성';
    document.getElementById('cancelBtn').style.display = 'none';
}

// 글 목록 로드
async function loadPosts() {
    const postsList = document.getElementById('adminPostsList');
    
    try {
        const response = await fetch('/api/posts.json');
        if (!response.ok) {
            throw new Error('글 목록을 불러올 수 없습니다.');
        }
        
        const posts = await response.json();
        
        if (posts.length === 0) {
            postsList.innerHTML = '<div class="loading">아직 작성된 글이 없습니다.</div>';
            return;
        }
        
        postsList.innerHTML = posts.map(post => `
            <div class="admin-post-item">
                <div class="admin-post-item-info">
                    <h4>${escapeHtml(post.title)}</h4>
                    <div class="post-meta">${escapeHtml(post.date)}</div>
                </div>
                <div class="admin-post-item-actions">
                    <button class="btn-edit" onclick="editPost('${post.id}')">수정</button>
                    <button class="btn-delete" onclick="deletePost('${post.id}')">삭제</button>
                </div>
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

