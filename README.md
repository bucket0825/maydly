# maydly — Admin Calendar

## 프로젝트 구조

```
maydly/
├─ stable/
│  └─ v0.1_stable/      ← 현재 안정 버전
│     ├─ admin.html
│     ├─ admin.js
│     ├─ index.html
│     ├─ events-data.json
│     └─ public-data.json
│
├─ test/                 ← 기능 실험 버전 (아직 없음)
│
├─ admin.html            ← 실제 서비스 중인 파일
├─ admin.js
├─ index.html
├─ events-data.json
└─ public-data.json
```

## 버전 히스토리

| 버전 | 상태 | 설명 |
|------|------|------|
| v0.1_stable | ✅ stable | 기본 캘린더 + PIN 로그인 + TimeTree 데이터(992개) |

## 작업 방식

1. `stable/` 폴더의 최신 버전이 항상 기준점
2. 새 기능은 `test/` 폴더에서만 실험
3. test 정상 확인 후 → stable 승격
4. 오류가 길어지면 → 마지막 stable로 복귀

## 현재 stable: v0.1_stable

포함 기능:
- 관리자 페이지 접속 (admin.html)
- PIN 로그인 (0825)
- 월간/주간/일간 캘린더 뷰
- 라벨 필터 (남스튜디오, 여스튜디오, 야외, 프로필페이, 야외상업, PA촬영, 휴무, 무페이, 노쇼)
- TimeTree 데이터 992개 (2023-01 ~ 2026-05)
- 공개 캘린더 페이지 (index.html)

## 다음 예정: v0.2_test

아직 미정 — 다음 기능 논의 후 결정
