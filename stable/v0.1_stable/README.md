# maydly — Admin Calendar

## 실행 환경 안내 (중요)

### admin.html
- **더블클릭 실행: ❌ 불가**
- 이유: 데이터를 `https://raw.githubusercontent.com/bucket0825/maydly/main/events-data.json` 에서 직접 가져옴 (GitHub URL 하드코딩)
- 인터넷 연결 없이는 데이터를 불러올 수 없음
- **정상 실행 방법: GitHub Pages 업로드 후 브라우저에서 접속**
- 로컬 서버를 켜도 데이터는 GitHub에서 fetch하므로 인터넷 연결은 여전히 필요

### index.html (공개 캘린더)
- **더블클릭 실행: ❌ 불가**
- 이유: `./public-data.json`을 상대경로로 fetch함 → 브라우저 보안 정책(CORS)으로 로컬 file:// 에서 차단
- **로컬 서버 실행 시 작동 가능** (아래 참고)
- **정상 실행 방법: GitHub Pages 업로드 후 브라우저에서 접속**

---

## JSON 파일이 같은 폴더에 있어야 하는 이유

- `index.html`은 `./public-data.json`을 상대경로로 fetch함
- 즉, index.html과 public-data.json이 **같은 폴더(같은 서버 경로)**에 있어야 정상 작동
- `admin.html`은 events-data.json을 GitHub raw URL로 직접 가져오므로, 로컬 폴더 위치는 무관
- 하지만 GitHub에 올릴 때는 반드시 같은 저장소 루트에 함께 있어야 함

---

## 로컬 서버 실행 방법 (index.html 테스트 시)

터미널에서 파일이 있는 폴더로 이동 후:

**Python 3 (권장):**
```bash
cd maydly_v0.1_stable
python3 -m http.server 8080
```
그 후 브라우저에서 `http://localhost:8080/index.html` 접속

**Node.js:**
```bash
npx serve .
```

**VS Code:**  
Live Server 확장 설치 후 index.html 우클릭 → "Open with Live Server"

> ⚠️ 단, admin.html은 로컬 서버로 실행해도 데이터를 GitHub에서 불러오므로 반드시 인터넷 연결 필요

---

## GitHub Pages 업로드 후 확인 주소

| 페이지 | 주소 |
|--------|------|
| 관리자 캘린더 | https://bucket0825.github.io/maydly/admin.html |
| 공개 캘린더 | https://bucket0825.github.io/maydly/index.html |

---

## 파일별 역할

| 파일 | 역할 |
|------|------|
| `admin.html` | 관리자 전용 캘린더. PIN(0825) 입력 후 접속. 일정 조회, 라벨 필터. 데이터는 GitHub raw URL에서 fetch |
| `admin.js` | admin.html의 캘린더 렌더링, 필터, PIN 로직 등 JS |
| `index.html` | 공개용 캘린더 페이지. 방문자가 보는 화면. public-data.json을 상대경로로 fetch |
| `events-data.json` | 관리자용 전체 일정 데이터 (992개, 2023-01~2026-05). admin.html이 GitHub raw URL로 읽음 |
| `public-data.json` | 공개용 일정 데이터. index.html이 상대경로로 읽음. 같은 폴더에 반드시 있어야 함 |
| `README.md` | 이 파일. 실행 방법 및 버전 안내 |

---

## 버전 히스토리

| 버전 | 상태 | 설명 |
|------|------|------|
| v0.1_stable | ✅ stable | 기본 캘린더 + PIN 로그인 + TimeTree 데이터(992개) |

## 버전 관리 구조

```
maydly/
├─ stable/
│  └─ v0.1_stable/      ← 현재 안정 버전
├─ test/                 ← 기능 실험 버전 (아직 없음)
├─ admin.html            ← 실제 서비스 중
├─ admin.js
├─ index.html
├─ events-data.json
└─ public-data.json
```

## 작업 방식

1. `stable/` 폴더의 최신 버전이 항상 기준점
2. 새 기능은 `test/` 폴더에서만 실험
3. test 정상 확인 후 → stable 승격
4. 오류가 길어지면 → 마지막 stable로 복귀 (디버깅 고집 금지)
5. 매 버전마다 전체 파일 세트 제공 (부분 코드 금지)
