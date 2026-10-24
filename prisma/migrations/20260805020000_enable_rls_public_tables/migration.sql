-- 목적: Supabase 보안 검사(Security Advisor)가 리포트한 취약점 해결
--   1) rls_disabled_in_public — public 스키마 테이블에 RLS가 꺼져 있어
--      프로젝트 URL + anon 키만 있으면 누구나 PostgREST API로 모든 행을
--      읽기/수정/삭제할 수 있는 상태였음.
--   2) 민감한 컬럼 노출 — users.hashedPassword, donations.paymentKey 등
--      민감 정보를 담은 테이블도 동일하게 무방비로 노출되어 있었음.
--
-- 배경: 이 프로젝트는 Prisma가 Supabase Postgres에 (Session Pooler를 통해)
--   "postgres" 역할로 직접 접속하여 모든 DB 작업을 수행한다
--   (Docs/2.02 supabase 연결 이슈.md 참고). src/lib/supabase/storage.ts에서만
--   service_role 키로 Storage(파일) API를 서버 사이드에서 호출할 뿐, 브라우저에서
--   anon 키로 테이블을 직접 조회하는 코드는 없다. Supabase의 "postgres" 역할은
--   기본적으로 RLS를 우회(BYPASSRLS)하므로, 아래처럼 RLS를 켜고 정책을 하나도
--   만들지 않아도(= 기본 거부) Prisma/앱 동작에는 영향이 없다. 반대로
--   PostgREST가 사용하는 anon/authenticated 역할은 정책이 없으면 아무 행도
--   반환하지 않으므로, 이번 취약점이 완전히 차단된다.
--
-- 적용 방법:
--   prisma migrate deploy 실행 시 다른 마이그레이션과 함께 자동 적용됨.
--   (수동 적용이 필요하면 Supabase 대시보드 SQL Editor에 이 파일 내용을 실행)
--
-- 적용 후 확인:
--   Supabase 대시보드 > Advisors > Security Advisor 에서
--   "rls_disabled_in_public" / 민감 데이터 노출 경고가 사라졌는지 확인.

ALTER TABLE "public"."users"                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."accounts"                ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."sessions"                ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."verification_tokens"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."donations"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."expenses"                ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."budget_items"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."finance_reports"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."community_posts"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."comments"                ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."education_applications"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."newsletter_subscribers"  ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 참고: 정책(policy)을 하나도 만들지 않았으므로 위 테이블들은 anon/authenticated
-- 역할에게 "기본 거부(deny-all)" 상태가 된다. 이 프로젝트는 브라우저에서
-- supabase-js로 직접 DB를 조회하지 않고, 모든 조회/쓰기는 Next.js 서버
-- (src/app, src/lib)를 거쳐 Prisma로 처리하므로 이것이 올바른 기본값이다.
--
-- 향후 브라우저에서 직접 Supabase API(PostgREST)를 호출해야 하는 기능을
-- 추가한다면, 그때 필요한 테이블에 한해 최소 권한 정책을 명시적으로 추가할 것.
-- 예시 (공개 게시판 글만 읽기 허용):
--
--   CREATE POLICY "공개 커뮤니티 글 읽기 허용"
--     ON "public"."community_posts" FOR SELECT
--     TO anon, authenticated
--     USING (true);
--
-- 처럼 필요한 범위만 "USING" 조건으로 좁혀서 추가한다. 절대로 정책 없이
-- RLS를 끄는 방식(rls disabled)으로 되돌리지 말 것.
