# Icon & Favicon Full-Package ZIP – Product Requirements Document (PRD)
*(“커서”가 바로 개발에 착수할 수 있도록 최대한 친절‧실무형으로 작성)*  

---

## 1. 한눈에 보기
| 항목 | 내용 |
|------|--------------------------------------------------------------|
| **프로젝트 명** | **Icon Package Generator** |
| **목표** | 1024 × 1024 원본 이미지를 업로드 → 18종 아이콘 + `manifest.json` 자동 생성 → ZIP 다운로드 |
| **1차 출시 범위 (MVP)** | • 브라우저에서 1 PNG 업로드<br>• 18 사이즈 PNG 변환<br>• PWA `manifest.json` 포함<br>• 모든 결과물을 ZIP으로 제공 |
| **핵심 지표** | • ZIP 생성 성공률  ≥  99 %<br>• 평균 생성 시간 ≤ 3 s (로컬 16 GB RAM 기준)<br>• ZIP ≤ 1 MB (투명‧단일 PNG 기준) |

---

## 2. 문제 & 기회
- 프로젝트마다 파비콘·PWA 아이콘을 수동 제작/배포 → **반복·오류**  
- 디자이너 없이도 개발자가 **한 번에** 패키지를 확보할 수 있으면 생산성 향상

---

## 3. 목적 & 성공 기준
1. **제로-설정**: 설치나 이미지 편집기 없이 웹에서 즉시 사용  
2. **표준 호환**: 모든 주요 브라우저 / PWA 사양 충족  
3. **재사용**: ZIP 그대로 Next.js 14·React·Vue 등 어디든 투입 가능  

성공 기준 | 목표
---|---
사용자가 ZIP을 받아 곧바로 Next.js `public/`에 복사했을 때 빌드 경고 없는지 | 100 %
Sentry (or console) 오류 | 0 건
Cursor “한 줄 설치 & 실행 테스트” 통과 | 필수

---

## 4. 범위 정의 (MVP)
### 포함
- **PNG 1개 입력**(1024 × 1024 이상, 최대 5 MB)  
- **자동 리사이즈 18종**  
- **`manifest.json` 자동 생성** (name, short_name, `icons` 배열)  
- **ZIP 묶기 & 다운로드**

### 제외
- SVG ↔ PNG 상호 변환  
- 색상 배경 추가/제거, 마스킹 등 편집 기능  
- 원클릭 배포(예: S3 업로드) 기능

---

## 5. 기능 명세 (F-시리즈)

| 코드 | 기능 | 세부 설명 | 우선도 |
|------|------|-----------|--------|
| **F-1** | 이미지 업로드 | drag-&-drop + file picker, PNG only, size ≤ 5 MB | 🟢 |
| **F-2** | 예비 검증 | 해상도·포맷·용량 체크 → 불일치 시 toasts | 🟢 |
| **F-3** | 아이콘 변환 | 아래 18 사이즈로 lossless PNG 생성(알파 유지)<br>16, 32, 48, 57, 60, 72, 96, 114, 120, 144, 152, 167, 180, 192, 256, 384, 512, 1024 | 🟢 |
| **F-4** | `manifest.json` | PWA 필드 포함<br>`icons` → path·type(`image/png`)·sizes 자동 기입 | 🟢 |
| **F-5** | ZIP 패키징 | `/icons/{size}x{size}.png`, `/manifest.json` 구조 | 🟢 |
| **F-6** | 다운로드 UX | 진행률 표시(스피너) → ZIP 다운로드 → “완료” 토스트 | 🟢 |

---

## 6. UX 흐름
1. **페이지 진입** → “1024 × 1024 PNG 업로드” 드롭존 표시  
2. 드래그(또는 클릭) 업로드 → **실시간 검증**  
3. “Generate” 버튼 활성화 → 클릭  
4. 0-100 % Progress bar → **자동 다운로드**(`icons.zip`)  
5. 완료 후 “ZIP 생성 완료 🎉” 토스트

---

## 7. 기술 요구사항

| 영역 | 선택/사양 | 비고 |
|------|-----------|------|
| Runtime | **Node.js ≥ 20** (Next.js 14 `app/` or CLI) | Cursor 기본 환경 |
| 이미지 변환 | `sharp` (v0.33) | WASM 버전 사용 시 번들↑ 주의 |
| ZIP | `jszip` (v3) | in-memory 패키징 |
| 타입 | TypeScript 5 | strict |
| 빌드/배포 | `output: 'export'` (Next.js static) 또는 **npx cli** | 서버리스 호환 |
| Lint & Fmt | ESLint, Prettier | Cursor autofix |
| 테스트 | Vitest + `@testing-library/react` (UI) / Node (CLI) | 최소 happy-path |

---

## 8. 폴더 구조 스켈레톤 (Cursor TODO)

```
icon-pkg-generator/
├─ app/                 # Next.js UI (drag, preview, button)
│  ├─ page.tsx
│  └─ components/
│     ├─ Dropzone.tsx
│     └─ Progress.tsx
├─ src/
│  ├─ generate.ts        # Core: resize & zip
│  └─ sizes.ts           # Export sizes[] constant
├─ public/               # (empty; output is zip)
├─ tests/
│  └─ generate.test.ts
├─ next.config.mjs       # output: 'export'
├─ package.json
└─ README.md
```

> **Cursor 작업 지시:**  
> 1. 위 구조의 **빈 파일** 생성 (구현 X)  
> 2. `next.config.mjs`에 `output: 'export'` 설정  
> 3. `sizes.ts`에 18 사이즈 배열 선언  
> 4. `README.md`에 **setup & dev scripts** 템플릿 기재  
> ※ 구현 로직·스타일링은 이후 커밋에서 진행

---

## 9. QA / 수락 기준
- [ ] 1024×1024 PNG 업로드 후 ZIP 다운로드 성공  
- [ ] ZIP 내부 경로 & 파일 수 = **19** (PNG 18 + manifest)  
- [ ] 각 PNG 실제 해상도 매칭  
- [ ] `manifest.json` `icons[].sizes` 값 정확  
- [ ] Lighthouse PWA “Icons” 경고 없음 (512,192 검사)  
- [ ] 모든 코드 ESLint 에러 0

---

## 10. 향후 개선 (vNext)
- 다중 원본 SVG → 자동 배경/마스크 조합  
- Apple-touch-icon (pre-composed) 자동 <link> 삽입 스니펫  
- CLI 모드: `npx icon-pkg path/to/logo.png --out ./dist`  
- CI hook: PR 머지 시 아이콘 재생성 & push

---

**End of PRD – 바로 Cursor에 붙여 넣어 작업 시작!**
