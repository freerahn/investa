const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');

const app = express();
const PORT = 3000;
const POSTS_DIR = path.join(__dirname, 'posts');

// posts 디렉토리가 없으면 생성
async function ensurePostsDir() {
  try {
    await fs.access(POSTS_DIR);
  } catch {
    await fs.mkdir(POSTS_DIR, { recursive: true });
  }
}

// 정적 파일 서빙
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 글 목록 조회 (최신순)
app.get('/api/posts', async (req, res) => {
  try {
    const files = await fs.readdir(POSTS_DIR);
    const posts = [];

    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(POSTS_DIR, file);
        const content = await fs.readFile(filePath, 'utf-8');
        
        // 파일명에서 ID 추출 (YYYYMMDDHHmmss-title.md 형식)
        const id = file.replace('.md', '');
        
        // 첫 번째 줄을 제목으로, 두 번째 줄을 날짜로 파싱 (있을 경우)
        const lines = content.split('\n');
        let title = id;
        let date = '';
        let body = content;

        // 메타데이터가 있으면 파싱
        if (content.startsWith('---\n')) {
          const metaEnd = content.indexOf('\n---\n', 4);
          if (metaEnd > 0) {
            const metaContent = content.substring(4, metaEnd);
            const bodyContent = content.substring(metaEnd + 5);
            body = bodyContent;

            metaContent.split('\n').forEach(line => {
              if (line.startsWith('title:')) {
                title = line.substring(6).trim();
              } else if (line.startsWith('date:')) {
                date = line.substring(5).trim();
              }
            });
          }
        } else if (lines[0].startsWith('# ')) {
          // 첫 줄이 제목인 경우
          title = lines[0].substring(2).trim();
          body = lines.slice(1).join('\n');
        }

        // 파일 수정 시간으로 날짜 설정 (없을 경우)
        if (!date) {
          const stats = await fs.stat(filePath);
          date = stats.mtime.toISOString().split('T')[0];
        }

        posts.push({
          id,
          title,
          date,
          excerpt: body.substring(0, 150).replace(/\n/g, ' ').trim()
        });
      }
    }

    // 날짜순 정렬 (최신순)
    posts.sort((a, b) => {
      const dateA = new Date(a.date + (a.id.length > 10 ? '' : ' ' + a.id.substring(8, 10) + ':' + a.id.substring(10, 12)));
      const dateB = new Date(b.date + (b.id.length > 10 ? '' : ' ' + b.id.substring(8, 10) + ':' + b.id.substring(10, 12)));
      return dateB - dateA;
    });

    res.json(posts);
  } catch (error) {
    console.error('글 목록 조회 오류:', error);
    res.status(500).json({ error: '글 목록을 불러올 수 없습니다.' });
  }
});

// 특정 글 조회
app.get('/api/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const filePath = path.join(POSTS_DIR, `${id}.md`);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      
      let title = id;
      let date = '';
      let body = content;

      // 메타데이터 파싱
      if (content.startsWith('---\n')) {
        const metaEnd = content.indexOf('\n---\n', 4);
        if (metaEnd > 0) {
          const metaContent = content.substring(4, metaEnd);
          body = content.substring(metaEnd + 5);

          metaContent.split('\n').forEach(line => {
            if (line.startsWith('title:')) {
              title = line.substring(6).trim();
            } else if (line.startsWith('date:')) {
              date = line.substring(5).trim();
            }
          });
        }
      } else if (body.startsWith('# ')) {
        const lines = body.split('\n');
        title = lines[0].substring(2).trim();
        body = lines.slice(1).join('\n');
      }

      // 날짜가 없으면 파일 수정 시간 사용
      if (!date) {
        const stats = await fs.stat(filePath);
        date = stats.mtime.toISOString().split('T')[0];
      }

      // Markdown을 HTML로 변환
      const html = marked(body);

      res.json({
        id,
        title,
        date,
        body,
        html
      });
    } catch (fileError) {
      if (fileError.code === 'ENOENT') {
        res.status(404).json({ error: '글을 찾을 수 없습니다.' });
      } else {
        throw fileError;
      }
    }
  } catch (error) {
    console.error('글 조회 오류:', error);
    res.status(500).json({ error: '글을 불러올 수 없습니다.' });
  }
});

// 글 작성
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    console.log('글 작성 요청:', { title: title?.substring(0, 50), contentLength: content?.length });
    
    if (!title || !content) {
      console.log('유효성 검사 실패:', { hasTitle: !!title, hasContent: !!content });
      return res.status(400).json({ error: '제목과 내용은 필수입니다.' });
    }

    // posts 디렉토리 확인
    await ensurePostsDir();

    // 고유 ID 생성 (타임스탬프 기반)
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    const titleSlug = title.replace(/[^a-zA-Z0-9가-힣\s]/g, '').replace(/\s+/g, '-').toLowerCase().substring(0, 50);
    const id = `${timestamp}-${titleSlug || 'post'}`;
    
    // 파일 내용 생성 (메타데이터 포함)
    const fileContent = `---\ntitle: ${title}\ndate: ${now.toISOString().split('T')[0]}\n---\n\n${content}`;
    
    const filePath = path.join(POSTS_DIR, `${id}.md`);
    console.log('파일 저장 경로:', filePath);
    
    await fs.writeFile(filePath, fileContent, 'utf-8');
    console.log('글 작성 성공:', id);

    res.json({ 
      id,
      message: '글이 작성되었습니다.',
      success: true 
    });
  } catch (error) {
    console.error('글 작성 오류:', error);
    console.error('오류 스택:', error.stack);
    res.status(500).json({ error: `글을 작성할 수 없습니다: ${error.message}` });
  }
});

// 글 수정
app.put('/api/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: '제목과 내용은 필수입니다.' });
    }

    const filePath = path.join(POSTS_DIR, `${id}.md`);
    
    // 기존 파일이 있는지 확인
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: '글을 찾을 수 없습니다.' });
    }

    // 기존 메타데이터 유지하거나 새로 생성
    let existingDate = '';
    try {
      const existingContent = await fs.readFile(filePath, 'utf-8');
      if (existingContent.startsWith('---\n')) {
        const metaEnd = existingContent.indexOf('\n---\n', 4);
        if (metaEnd > 0) {
          const metaContent = existingContent.substring(4, metaEnd);
          metaContent.split('\n').forEach(line => {
            if (line.startsWith('date:')) {
              existingDate = line.substring(5).trim();
            }
          });
        }
      }
    } catch (e) {
      // 무시
    }

    const date = existingDate || new Date().toISOString().split('T')[0];
    const fileContent = `---\ntitle: ${title}\ndate: ${date}\n---\n\n${content}`;
    
    await fs.writeFile(filePath, fileContent, 'utf-8');

    res.json({ 
      message: '글이 수정되었습니다.',
      success: true 
    });
  } catch (error) {
    console.error('글 수정 오류:', error);
    res.status(500).json({ error: '글을 수정할 수 없습니다.' });
  }
});

// 글 삭제
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const filePath = path.join(POSTS_DIR, `${id}.md`);

    try {
      await fs.unlink(filePath);
      res.json({ 
        message: '글이 삭제되었습니다.',
        success: true 
      });
    } catch (fileError) {
      if (fileError.code === 'ENOENT') {
        res.status(404).json({ error: '글을 찾을 수 없습니다.' });
      } else {
        throw fileError;
      }
    }
  } catch (error) {
    console.error('글 삭제 오류:', error);
    res.status(500).json({ error: '글을 삭제할 수 없습니다.' });
  }
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error('서버 오류:', err);
  res.status(500).json({ error: '서버 오류가 발생했습니다.' });
});

// 서버 시작
async function startServer() {
  try {
    await ensurePostsDir();
    console.log('posts 디렉토리 확인 완료');
    
    app.listen(PORT, () => {
      console.log(`블로그 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
      console.log('메인 페이지: http://localhost:3000');
      console.log('관리자 페이지: http://localhost:3000/admin.html');
    });
  } catch (error) {
    console.error('서버 시작 오류:', error);
    process.exit(1);
  }
}

startServer();

