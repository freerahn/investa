const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');

const POSTS_DIR = path.join(__dirname, 'posts');
const OUTPUT_DIR = path.join(__dirname, 'public', 'api');
const POSTS_JSON = path.join(OUTPUT_DIR, 'posts.json');

async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function buildPosts() {
  try {
    // 출력 디렉토리 생성
    await ensureDir(OUTPUT_DIR);
    
    // posts 디렉토리 확인
    let files;
    try {
      files = await fs.readdir(POSTS_DIR);
    } catch {
      console.log('posts 디렉토리가 없습니다. 빈 글 목록을 생성합니다.');
      await fs.writeFile(POSTS_JSON, JSON.stringify([], null, 2), 'utf-8');
      return;
    }
    
    const posts = [];
    
    // 각 Markdown 파일 처리
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(POSTS_DIR, file);
        const content = await fs.readFile(filePath, 'utf-8');
        
        // 파일명에서 ID 추출
        const id = file.replace('.md', '');
        
        // 메타데이터 파싱
        let title = id;
        let date = '';
        let body = content;
        
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
        
        // 개별 글 JSON 파일 생성
        const postData = {
          id,
          title,
          date,
          body,
          html
        };
        
        const postJsonPath = path.join(OUTPUT_DIR, `posts`, `${id}.json`);
        await ensureDir(path.dirname(postJsonPath));
        await fs.writeFile(postJsonPath, JSON.stringify(postData, null, 2), 'utf-8');
        
        // 글 목록에 추가
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
    
    // 글 목록 JSON 파일 생성
    await fs.writeFile(POSTS_JSON, JSON.stringify(posts, null, 2), 'utf-8');
    
    console.log(`✅ 빌드 완료: ${posts.length}개의 글을 처리했습니다.`);
  } catch (error) {
    console.error('빌드 오류:', error);
    process.exit(1);
  }
}

buildPosts();

