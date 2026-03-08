# 재테크 TODO + 투자일지 웹앱

개인 사용자를 위한 재테크 기록 웹앱입니다. `TODO`, `매매 기록 중심 투자일지`, `기본 대시보드`, `단일 비밀번호 잠금`을 제공합니다.

## 기술 스택

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS v4
- Prisma + SQLite
- Docker Compose
- Vitest + Playwright

## 빠른 시작

1. 환경변수 파일 생성

```bash
cp .env.example .env
```

2. Docker로 실행

```bash
docker compose up --build
```

3. 브라우저에서 확인

```text
http://localhost:3000
```

기본 로그인 비밀번호는 `.env`의 `APP_PASSWORD` 값입니다.

## 로컬 명령어

```bash
npm install
npm run db:generate
npm run db:push
npm run dev
```

## 품질 규칙

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
```

## 데이터 운영

- 시간대 기준: `Asia/Seoul`
- 통화 단위: `KRW`
- 종목 저장 기준: `symbol`
- 삭제 정책: hard delete
- SQLite 파일은 Git에 포함하지 않습니다.

## 백업 / 복구

SQLite 파일은 `prisma/dev.db`에 저장됩니다.

- 백업

```bash
cp prisma/dev.db prisma/dev.db.backup
```

- 복구

```bash
cp prisma/dev.db.backup prisma/dev.db
```

자동 백업은 v1 범위에 포함하지 않습니다.

개발 환경에서는 Prisma 엔진 호환성 이슈를 피하기 위해 `db push`를 기본 동기화 명령으로 사용합니다. 마이그레이션 SQL은 `prisma/migrations/`에 보관합니다.

## Git 운영 규칙

- 기본 브랜치: `main`
- 기능 작업: `feature/<topic>`
- 커밋 메시지: Conventional Commits
- 병합 전 검증: `docker compose up`, `npm run lint`, `npm run typecheck`
- 초기 병합 전략: squash merge

## 환경변수

필수 변수는 `.env.example`에 정리되어 있습니다.

- `DATABASE_URL`
- `APP_PASSWORD`
- `SESSION_SECRET`
