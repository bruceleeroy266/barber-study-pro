SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict HqXFVx8CfcinW9ztOz2Zx1kY6PZ374s2zF6mTPMJM5BsjKQjaENAFOfxsgYnefw

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at", "invite_token", "referrer", "oauth_client_state_id", "linking_target_id", "email_optional") VALUES
	('d7de7344-c2df-492a-a9ff-a87b41163e4e', 'cbf437c3-fd62-4924-b3bb-5440cfbe8fe2', 'df1aecba-69b3-48ce-ae60-d850218531c7', 's256', 'WrdZILg2oRaG-vhehDh2_5jajCqfU4yd7QH0_K6gkpk', 'email', '', '', '2026-06-09 16:54:38.792863+00', '2026-06-09 17:02:09.02334+00', 'email/signup', '2026-06-09 17:02:09.023278+00', NULL, NULL, NULL, NULL, false),
	('40cc6f46-b765-43ae-9d61-0eaadacbd41d', '6de24902-075d-4803-a025-3e1d555df542', '378b564c-8519-41b7-91c1-b3734f6b95cd', 's256', 'EpbRnunc-vKUz3R0ldJp6VQiGyA-jMfhiBnypTe7Faw', 'recovery', '', '', '2026-07-28 15:29:01.056911+00', '2026-07-28 15:29:01.056911+00', 'recovery', NULL, NULL, NULL, NULL, NULL, false),
	('2eae743e-bd7d-459e-9d5d-70d419e031fb', '6de24902-075d-4803-a025-3e1d555df542', '5d92f82f-4c00-4d32-ae71-96329e014af6', 's256', '9KcUWomQFmiQwKAW4GN-WACUACFSbXqrpZpVmvDCm6E', 'recovery', '', '', '2026-07-29 01:36:14.52582+00', '2026-07-29 01:36:14.52582+00', 'recovery', NULL, NULL, NULL, NULL, NULL, false);


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '6de24902-075d-4803-a025-3e1d555df542', 'authenticated', 'authenticated', 'patty.pineda.drl@gmail.com', '$2a$10$qHbKF61l/BUph4NlfxX6G.JPzNnC1P/dwpy8zGMPITEajIQe91jzm', '2026-07-23 10:23:42.518769+00', NULL, '', NULL, '3687392eb39b139a20e9a1f001ac6f3ccda531b0ad15c5c1fbe73b33', '2026-07-29 01:38:23.910169+00', '', '', NULL, '2026-07-26 23:28:02.640806+00', '{"provider": "email", "providers": ["email"]}', '{"role": "student", "full_name": "Patty Pineda", "school_name": "RISE Program", "pilot_number": "Pilot #1", "program_name": "Barbering", "email_verified": true, "required_hours": 1200, "pilot_designation": "Student Pilot"}', NULL, '2026-07-23 10:23:42.45846+00', '2026-07-29 01:38:23.913054+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '49047d6f-7976-4ee4-b79f-865480035f52', 'authenticated', 'authenticated', 'gabebot24+student@gmail.com', '$2a$10$ghZpniG/lGl4wojhPC8ZA.hGIuJ7Ach1vhg39VlqUD7L66ZXtGDwy', '2026-07-13 05:22:24.255848+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-24 11:36:51.080159+00', '{"provider": "email", "providers": ["email"]}', '{"role": "student", "full_name": "Pilot Student", "email_verified": true}', NULL, '2026-07-12 03:07:03.498035+00', '2026-07-24 17:26:08.572195+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '534bc5e4-6151-4d49-83d6-78966cc0aaba', 'authenticated', 'authenticated', 'phase2-audit-1784906620@ascynpro.local', '$2a$10$nncJh80eg4uKpwbrXRIfZuX2MT7nnY6/RYgn9hwfb7gn0uddMANVK', '2026-07-24 15:23:41.388442+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-07-24 15:23:41.352589+00', '2026-07-24 15:23:41.389987+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'cbf437c3-fd62-4924-b3bb-5440cfbe8fe2', 'authenticated', 'authenticated', 'gabebot24@gmail.com', '$2a$10$SJS18E6NrbCLVLiI79JU9uBXlMma.BbYdlz0i7ce2C8RPZ2MHEvC6', '2026-06-09 17:02:09.014089+00', NULL, '', '2026-06-09 16:54:38.802914+00', '', NULL, '', '', NULL, '2026-06-16 05:34:26.89923+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "cbf437c3-fd62-4924-b3bb-5440cfbe8fe2", "role": "student", "email": "gabebot24@gmail.com", "full_name": "gabe bot", "email_verified": true, "phone_verified": false}', NULL, '2026-06-09 16:54:38.750171+00', '2026-06-19 15:59:27.81405+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '6a2bcb89-d37e-4d3c-af1f-a1809d323555', 'authenticated', 'authenticated', 'gabebot24+instructor@gmail.com', '$2a$10$YFInc9dS35jvoZUneUZsq.UhDRkDFbSx.7vcE7fDct4GKCKRmfNcW', '2026-07-13 05:22:24.138658+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-25 19:03:59.289853+00', '{"provider": "email", "providers": ["email"]}', '{"role": "instructor", "full_name": "Pilot Instructor", "email_verified": true}', NULL, '2026-07-12 03:13:31.844521+00', '2026-07-26 12:38:51.130555+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '261fcd4c-bbfe-4957-9efd-0dfca6cccdc1', 'authenticated', 'authenticated', 'ascynproofficial@gmail.com', '$2a$10$tNRI0zFOh84pbqJMovecs.KcKW0hYYhBYvU4M0mNk8M6lP79wA/He', '2026-07-31 13:00:29.744754+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-31 13:03:32.898871+00', '{"provider": "email", "providers": ["email"]}', '{"role": "admin", "full_name": "ASCYN PRO Administrator", "email_verified": true}', NULL, '2026-07-31 13:00:29.66174+00', '2026-07-31 13:03:32.906486+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '551936c2-c3fe-46fc-b76f-09ac6996854b', 'authenticated', 'authenticated', 'agabe510@gmail.com', '$2a$10$N2HvmkSZy7kzxfyc0Vm23eHS5pgWyIiWg.oRo9nsEmzkv1sViD3Pm', '2026-06-19 16:02:26.52083+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-22 02:45:15.489202+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "551936c2-c3fe-46fc-b76f-09ac6996854b", "role": "student", "email": "agabe510@gmail.com", "full_name": "gabriel arcaina", "email_verified": true, "phone_verified": false}', NULL, '2026-06-19 16:02:26.473393+00', '2026-06-22 02:45:15.508278+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '135e94df-f14e-4633-a5bf-1416d13357b0', 'authenticated', 'authenticated', 'garcaina510@gmail.com', '$2a$10$bjiKhspTEpvrVy/mn1Vl/.FFOXmV.iXnfc/RWkLYeJfPc3AfIj.jq', '2026-06-20 11:02:47.721124+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-22 02:45:46.822711+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "135e94df-f14e-4633-a5bf-1416d13357b0", "role": "student", "email": "garcaina510@gmail.com", "full_name": "tests student ", "email_verified": true, "phone_verified": false}', NULL, '2026-06-20 11:02:47.686049+00', '2026-06-26 15:47:19.98053+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'e033845b-d182-435f-975d-983174ff20e5', 'authenticated', 'authenticated', 'coark2015@gmail.com', '$2a$10$IWNrysXzI0YSXlpaDuQcPuXYLUYwt/mvKrIyX4uWBPsx2waKtVeSy', '2026-07-02 21:47:39.583968+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-02 21:48:24.384381+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "e033845b-d182-435f-975d-983174ff20e5", "role": "student", "email": "coark2015@gmail.com", "full_name": "Test Student", "email_verified": true, "phone_verified": false}', NULL, '2026-07-02 21:47:39.53684+00', '2026-07-02 23:02:03.318245+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'bc34afaa-ded5-4861-848d-5393423e9f33', 'authenticated', 'authenticated', 'gabebot24+beta2@gmail.com', '$2a$10$jiQx7I6A2zpYpLw77Gfiie.J34l6ZQNQRR.pc8TgLIplDJyKXbQFi', '2026-07-06 18:40:22.993409+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-06 18:40:23.003052+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "bc34afaa-ded5-4861-848d-5393423e9f33", "role": "student", "email": "gabebot24+beta2@gmail.com", "full_name": "Test student", "email_verified": true, "phone_verified": false}', NULL, '2026-07-06 18:40:22.93481+00', '2026-07-06 18:40:23.032399+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a52a5b46-4ad1-4f63-9fed-e601b200f30b', 'authenticated', 'authenticated', 'gabebot24+beta1@gmail.com', '$2a$10$GjATiLwiFx23kphwfnYb/O/4tyO62vrnyiU3WiMltOUByzw61fZia', '2026-07-06 13:17:30.523593+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-06 13:17:30.533184+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "a52a5b46-4ad1-4f63-9fed-e601b200f30b", "role": "student", "email": "gabebot24+beta1@gmail.com", "full_name": "Test Student", "email_verified": true, "phone_verified": false}', NULL, '2026-07-06 13:17:30.433187+00', '2026-07-06 13:17:30.58244+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '11eb1389-f28d-4e34-aa5b-9909e382b328', 'authenticated', 'authenticated', 'instructor@ascyn-smoke.test', '$2a$10$l8HqUFnegg25cW8aO/qv7OqvBkm7MD1ODOKGHOZHPLa1x6hg.0Z3G', '2026-07-28 05:33:32.790553+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-28 13:42:41.665129+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "11eb1389-f28d-4e34-aa5b-9909e382b328", "role": "instructor", "email": "instructor@ascyn-smoke.test", "full_name": "Test Instructor", "email_verified": true, "phone_verified": false}', NULL, '2026-06-26 15:59:19.068456+00', '2026-07-28 13:42:41.668335+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '144ab7dd-b1e2-4ff6-9b16-8fc5357a0d8d', 'authenticated', 'authenticated', 'tessamyers2911@gmail.com', '$2a$10$ZAEWN2ZVwy1dgkhqhYoJnuKY/yge7JmpRxl1htkCLyFeS/Lpp9bte', '2026-07-23 23:06:32.561447+00', '2026-07-23 22:51:12.599861+00', '', NULL, '', NULL, '', '', NULL, '2026-07-23 23:06:32.575489+00', '{"provider": "email", "providers": ["email"]}', '{"role": "instructor", "full_name": "Tessa Myers", "school_id": "12b09747-7391-4811-bc22-db7eebbb12c1", "email_verified": true, "approval_status": "approved", "requires_password_change": true}', NULL, '2026-07-23 17:13:03.859035+00', '2026-07-23 23:06:32.611326+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '669e0110-6a4a-4fa3-aeb1-dd774ae96b32', 'authenticated', 'authenticated', 'ascyn-qa-instructor-test@ascynpro.test', '$2a$10$OzOeyt9FL3CF/Ssyn..BguFAQQfsd4j54IXXF3tjqkweDfqS/wMAK', NULL, NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"role": "instructor", "full_name": "QA Test Instructor", "approval_status": "approved", "requires_password_change": false}', NULL, '2026-07-24 11:38:10.477844+00', '2026-07-24 11:38:10.503082+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '24879a43-b402-4f88-82b6-44d66a67263b', 'authenticated', 'authenticated', 'student@ascyn-smoke.test', '$2a$10$1N8QXYKwTtn0av9/Rf5dMuHMGLqi.BeV/Shik1OPEbO6Hke5Ku7JK', '2026-06-26 15:58:12.759117+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-28 12:10:45.7856+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "24879a43-b402-4f88-82b6-44d66a67263b", "role": "student", "email": "student@ascyn-smoke.test", "full_name": "Test Student ", "email_verified": true, "phone_verified": false}', NULL, '2026-06-26 15:58:12.683783+00', '2026-07-28 12:10:45.789913+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '17f90e39-a66e-41db-a994-622c9795464c', 'authenticated', 'authenticated', 'pending-deep-1785289096741@ascyn-audit.test', '$2a$10$cojdyItIGpotUlmE/Xnr.u4wJCN90oOtfZCvV6.mMQOmVbae0svYi', '2026-07-29 01:38:16.671185+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-29 01:38:17.274756+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-07-29 01:38:16.66311+00', '2026-07-29 01:38:17.28034+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('cbf437c3-fd62-4924-b3bb-5440cfbe8fe2', 'cbf437c3-fd62-4924-b3bb-5440cfbe8fe2', '{"sub": "cbf437c3-fd62-4924-b3bb-5440cfbe8fe2", "role": "student", "email": "gabebot24@gmail.com", "full_name": "gabe bot", "email_verified": true, "phone_verified": false}', 'email', '2026-06-09 16:54:38.788513+00', '2026-06-09 16:54:38.788565+00', '2026-06-09 16:54:38.788565+00', '73fb9349-14ba-4006-a75b-35748f98b769'),
	('551936c2-c3fe-46fc-b76f-09ac6996854b', '551936c2-c3fe-46fc-b76f-09ac6996854b', '{"sub": "551936c2-c3fe-46fc-b76f-09ac6996854b", "role": "student", "email": "agabe510@gmail.com", "full_name": "gabriel arcaina", "email_verified": false, "phone_verified": false}', 'email', '2026-06-19 16:02:26.514411+00', '2026-06-19 16:02:26.514461+00', '2026-06-19 16:02:26.514461+00', '20daffb1-d484-4411-8f19-889ce7a97f56'),
	('135e94df-f14e-4633-a5bf-1416d13357b0', '135e94df-f14e-4633-a5bf-1416d13357b0', '{"sub": "135e94df-f14e-4633-a5bf-1416d13357b0", "role": "student", "email": "garcaina510@gmail.com", "full_name": "tests student ", "email_verified": false, "phone_verified": false}', 'email', '2026-06-20 11:02:47.714993+00', '2026-06-20 11:02:47.71504+00', '2026-06-20 11:02:47.71504+00', '10d0cd3c-2aa3-4db4-86e9-8df7327e5bd5'),
	('24879a43-b402-4f88-82b6-44d66a67263b', '24879a43-b402-4f88-82b6-44d66a67263b', '{"sub": "24879a43-b402-4f88-82b6-44d66a67263b", "role": "student", "email": "student@ascyn-smoke.test", "full_name": "Test Student ", "email_verified": false, "phone_verified": false}', 'email', '2026-06-26 15:58:12.752782+00', '2026-06-26 15:58:12.752835+00', '2026-06-26 15:58:12.752835+00', '6fcdb623-4736-45dc-a1c6-2e8cb33dfc3e'),
	('11eb1389-f28d-4e34-aa5b-9909e382b328', '11eb1389-f28d-4e34-aa5b-9909e382b328', '{"sub": "11eb1389-f28d-4e34-aa5b-9909e382b328", "role": "instructor", "email": "instructor@ascyn-smoke.test", "full_name": "Test Instructor", "email_verified": false, "phone_verified": false}', 'email', '2026-06-26 15:59:19.074187+00', '2026-06-26 15:59:19.074234+00', '2026-06-26 15:59:19.074234+00', '1753f6df-aa1e-4934-bfc0-ba715df748d1'),
	('e033845b-d182-435f-975d-983174ff20e5', 'e033845b-d182-435f-975d-983174ff20e5', '{"sub": "e033845b-d182-435f-975d-983174ff20e5", "role": "student", "email": "coark2015@gmail.com", "full_name": "Test Student", "email_verified": false, "phone_verified": false}', 'email', '2026-07-02 21:47:39.576573+00', '2026-07-02 21:47:39.576624+00', '2026-07-02 21:47:39.576624+00', '2296277b-c67d-4fa0-b686-e16994b4585a'),
	('a52a5b46-4ad1-4f63-9fed-e601b200f30b', 'a52a5b46-4ad1-4f63-9fed-e601b200f30b', '{"sub": "a52a5b46-4ad1-4f63-9fed-e601b200f30b", "role": "student", "email": "gabebot24+beta1@gmail.com", "full_name": "Test Student", "email_verified": false, "phone_verified": false}', 'email', '2026-07-06 13:17:30.506911+00', '2026-07-06 13:17:30.506958+00', '2026-07-06 13:17:30.506958+00', 'e9a9bd9f-ee2c-40f7-b646-f9f6ef973e62'),
	('bc34afaa-ded5-4861-848d-5393423e9f33', 'bc34afaa-ded5-4861-848d-5393423e9f33', '{"sub": "bc34afaa-ded5-4861-848d-5393423e9f33", "role": "student", "email": "gabebot24+beta2@gmail.com", "full_name": "Test student", "email_verified": false, "phone_verified": false}', 'email', '2026-07-06 18:40:22.985861+00', '2026-07-06 18:40:22.98591+00', '2026-07-06 18:40:22.98591+00', '5569aca4-8b5f-40a1-a2b3-15efc8fe7f65'),
	('49047d6f-7976-4ee4-b79f-865480035f52', '49047d6f-7976-4ee4-b79f-865480035f52', '{"sub": "49047d6f-7976-4ee4-b79f-865480035f52", "email": "gabebot24+student@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-12 03:07:03.527646+00', '2026-07-12 03:07:03.527701+00', '2026-07-12 03:07:03.527701+00', '89f1050f-7b5d-4736-9629-221f6142f08b'),
	('6a2bcb89-d37e-4d3c-af1f-a1809d323555', '6a2bcb89-d37e-4d3c-af1f-a1809d323555', '{"sub": "6a2bcb89-d37e-4d3c-af1f-a1809d323555", "email": "gabebot24+instructor@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-12 03:13:31.865571+00', '2026-07-12 03:13:31.865627+00', '2026-07-12 03:13:31.865627+00', 'a99521e1-7d60-4e32-81d5-9b6bc15a731c'),
	('669e0110-6a4a-4fa3-aeb1-dd774ae96b32', '669e0110-6a4a-4fa3-aeb1-dd774ae96b32', '{"sub": "669e0110-6a4a-4fa3-aeb1-dd774ae96b32", "email": "ascyn-qa-instructor-test@ascynpro.test", "email_verified": false, "phone_verified": false}', 'email', '2026-07-24 11:38:10.49982+00', '2026-07-24 11:38:10.499876+00', '2026-07-24 11:38:10.499876+00', 'c65970d7-ff70-4771-b76e-95b1ccc39ca4'),
	('534bc5e4-6151-4d49-83d6-78966cc0aaba', '534bc5e4-6151-4d49-83d6-78966cc0aaba', '{"sub": "534bc5e4-6151-4d49-83d6-78966cc0aaba", "email": "phase2-audit-1784906620@ascynpro.local", "email_verified": false, "phone_verified": false}', 'email', '2026-07-24 15:23:41.383837+00', '2026-07-24 15:23:41.383894+00', '2026-07-24 15:23:41.383894+00', '8f880432-337f-4b58-a517-6b6eec3882a8'),
	('6de24902-075d-4803-a025-3e1d555df542', '6de24902-075d-4803-a025-3e1d555df542', '{"sub": "6de24902-075d-4803-a025-3e1d555df542", "email": "patty.pineda.drl@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-23 10:23:42.509022+00', '2026-07-23 10:23:42.509083+00', '2026-07-23 10:23:42.509083+00', '168e24df-a478-4eab-8254-7835b337e455'),
	('144ab7dd-b1e2-4ff6-9b16-8fc5357a0d8d', '144ab7dd-b1e2-4ff6-9b16-8fc5357a0d8d', '{"sub": "144ab7dd-b1e2-4ff6-9b16-8fc5357a0d8d", "email": "tessamyers2911@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-23 17:13:03.923592+00', '2026-07-23 17:13:03.923651+00', '2026-07-23 17:13:03.923651+00', 'e4ac0401-eb3d-4108-b3ac-509ca31dc2d8'),
	('17f90e39-a66e-41db-a994-622c9795464c', '17f90e39-a66e-41db-a994-622c9795464c', '{"sub": "17f90e39-a66e-41db-a994-622c9795464c", "email": "pending-deep-1785289096741@ascyn-audit.test", "email_verified": false, "phone_verified": false}', 'email', '2026-07-29 01:38:16.664538+00', '2026-07-29 01:38:16.664621+00', '2026-07-29 01:38:16.664621+00', '477a2c68-0734-46fd-ab48-2787c751be0a'),
	('261fcd4c-bbfe-4957-9efd-0dfca6cccdc1', '261fcd4c-bbfe-4957-9efd-0dfca6cccdc1', '{"sub": "261fcd4c-bbfe-4957-9efd-0dfca6cccdc1", "email": "ascynproofficial@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-31 13:00:29.73245+00', '2026-07-31 13:00:29.732507+00', '2026-07-31 13:00:29.732507+00', 'a7963473-c087-4bd5-a9bd-62ec03b1d7aa');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('583024d2-b042-4ae4-94a5-ee613dda3cc9', '6a2bcb89-d37e-4d3c-af1f-a1809d323555', '2026-07-22 01:08:42.020966+00', '2026-07-22 01:08:42.020966+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', '172.59.120.240', NULL, NULL, NULL, NULL, NULL),
	('d983c1b2-7d1a-4c10-bd72-257fd30badf6', '49047d6f-7976-4ee4-b79f-865480035f52', '2026-07-23 04:49:06.189585+00', '2026-07-23 04:49:06.189585+00', NULL, 'aal1', NULL, NULL, 'node', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('f88ec16d-c521-4f94-99b1-8664b4ca9819', '49047d6f-7976-4ee4-b79f-865480035f52', '2026-07-23 04:49:22.429126+00', '2026-07-23 04:49:22.429126+00', NULL, 'aal1', NULL, NULL, 'node', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('4a40f0f5-0d4b-4f79-ba1f-0c2d3c6a7cdd', '49047d6f-7976-4ee4-b79f-865480035f52', '2026-07-23 04:50:05.144388+00', '2026-07-23 04:50:05.144388+00', NULL, 'aal1', NULL, NULL, 'node', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('fbdf25eb-2388-4a0d-957f-db812d2aca34', '49047d6f-7976-4ee4-b79f-865480035f52', '2026-07-23 04:50:37.442176+00', '2026-07-23 04:50:37.442176+00', NULL, 'aal1', NULL, NULL, 'node', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('e3bd5b83-7b9b-40db-8a9a-1e0df3b310a3', '6a2bcb89-d37e-4d3c-af1f-a1809d323555', '2026-07-21 05:11:39.525414+00', '2026-07-21 05:11:39.525414+00', NULL, 'aal1', NULL, NULL, 'node', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('67972638-4fa0-4b84-8eb7-0016d2e0fb07', '49047d6f-7976-4ee4-b79f-865480035f52', '2026-07-23 04:51:00.259902+00', '2026-07-23 04:51:00.259902+00', NULL, 'aal1', NULL, NULL, 'node', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('012c6bd9-190a-4c99-bf50-ee952bd34607', '6a2bcb89-d37e-4d3c-af1f-a1809d323555', '2026-07-21 05:19:06.276593+00', '2026-07-21 05:19:06.276593+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('3b02d88c-0615-4872-8ffc-857a8bcd782c', '6a2bcb89-d37e-4d3c-af1f-a1809d323555', '2026-07-25 19:03:59.292868+00', '2026-07-26 12:38:51.144968+00', NULL, 'aal1', NULL, '2026-07-26 12:38:51.144844', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('6f96c0c0-3c86-494c-a21b-3bada55306b8', 'e033845b-d182-435f-975d-983174ff20e5', '2026-07-02 21:47:39.593493+00', '2026-07-02 21:47:39.593493+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('2ad4508a-6e54-4255-8539-e34090d836bd', 'e033845b-d182-435f-975d-983174ff20e5', '2026-07-02 21:48:24.384484+00', '2026-07-02 23:02:03.329388+00', NULL, 'aal1', NULL, '2026-07-02 23:02:03.329253', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('262cb7f4-27e3-4047-aacb-b11f7a6ab2a0', 'a52a5b46-4ad1-4f63-9fed-e601b200f30b', '2026-07-06 13:17:30.533302+00', '2026-07-06 13:17:30.533302+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('dde6ac84-489a-4449-af9c-a556df6d637d', 'bc34afaa-ded5-4861-848d-5393423e9f33', '2026-07-06 18:40:23.003189+00', '2026-07-06 18:40:23.003189+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36', '98.175.175.7', NULL, NULL, NULL, NULL, NULL),
	('919f17dd-989f-4008-abca-a37f5e603712', '6de24902-075d-4803-a025-3e1d555df542', '2026-07-26 23:25:03.789433+00', '2026-07-26 23:25:03.789433+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1', '64.47.64.131', NULL, NULL, NULL, NULL, NULL),
	('7fc6a31c-8ed4-4e70-bdf1-8fcb1b7f6c18', '6de24902-075d-4803-a025-3e1d555df542', '2026-07-23 10:23:42.923417+00', '2026-07-23 10:23:42.923417+00', NULL, 'aal1', NULL, NULL, 'node', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('45508066-d8f7-4fad-af7f-85fcc6057fe6', '144ab7dd-b1e2-4ff6-9b16-8fc5357a0d8d', '2026-07-23 23:06:32.575595+00', '2026-07-23 23:06:32.575595+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', '12.75.47.10', NULL, NULL, NULL, NULL, NULL),
	('514c088c-0642-4341-afe3-c8aaad81408b', '6de24902-075d-4803-a025-3e1d555df542', '2026-07-26 23:28:02.640914+00', '2026-07-26 23:28:02.640914+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1', '64.47.64.131', NULL, NULL, NULL, NULL, NULL),
	('19e25cf7-ba21-4468-b932-6bf0b61c9974', '49047d6f-7976-4ee4-b79f-865480035f52', '2026-07-24 11:36:51.081353+00', '2026-07-24 17:26:08.583174+00', NULL, 'aal1', NULL, '2026-07-24 17:26:08.58305', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.0.0 Safari/537.36', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('cb137e6a-e8ca-4fec-a963-fb12b8070e96', '24879a43-b402-4f88-82b6-44d66a67263b', '2026-07-28 12:10:34.579705+00', '2026-07-28 12:10:34.579705+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('62d0a333-2f52-4736-857f-86cb4a88c9c1', '24879a43-b402-4f88-82b6-44d66a67263b', '2026-07-28 12:10:34.673682+00', '2026-07-28 12:10:34.673682+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('8061bac0-f63a-411e-b62a-06cfc3d63f9a', '24879a43-b402-4f88-82b6-44d66a67263b', '2026-07-28 12:10:30.394308+00', '2026-07-28 12:10:30.394308+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('20436a27-392b-405f-8399-587524500d8c', '24879a43-b402-4f88-82b6-44d66a67263b', '2026-07-28 12:10:31.116558+00', '2026-07-28 12:10:31.116558+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('823a3b79-47da-4f4b-a049-d17b55a8838a', '24879a43-b402-4f88-82b6-44d66a67263b', '2026-07-28 12:10:32.403712+00', '2026-07-28 12:10:32.403712+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('106645a8-f68c-4a30-931a-5b00712a3bac', '24879a43-b402-4f88-82b6-44d66a67263b', '2026-07-28 12:10:37.570441+00', '2026-07-28 12:10:37.570441+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('f9876ace-11ea-4d30-93eb-08042564926f', '24879a43-b402-4f88-82b6-44d66a67263b', '2026-07-28 12:10:38.002645+00', '2026-07-28 12:10:38.002645+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('87d8efb5-ce98-413d-9065-ddc349ed5939', '24879a43-b402-4f88-82b6-44d66a67263b', '2026-07-28 12:10:29.709204+00', '2026-07-28 12:10:29.709204+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('67706688-8bf0-40b5-97f1-d4f4740b0b38', '24879a43-b402-4f88-82b6-44d66a67263b', '2026-07-28 12:10:39.553672+00', '2026-07-28 12:10:39.553672+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('74cae454-02d9-4209-8903-7a49b7d6673b', '24879a43-b402-4f88-82b6-44d66a67263b', '2026-07-28 12:10:43.000438+00', '2026-07-28 12:10:43.000438+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('1f97f4d5-d478-4ce5-acca-087ca65a16f4', '24879a43-b402-4f88-82b6-44d66a67263b', '2026-07-28 12:10:43.387796+00', '2026-07-28 12:10:43.387796+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('d66b5e90-76cf-4e3e-b02a-bc21c7fe2be3', '24879a43-b402-4f88-82b6-44d66a67263b', '2026-07-28 12:10:40.266254+00', '2026-07-28 12:10:40.266254+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('32a98e27-136e-4bc5-82dc-9596e40a441f', '24879a43-b402-4f88-82b6-44d66a67263b', '2026-07-28 12:10:44.787056+00', '2026-07-28 12:10:44.787056+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('48f881ec-2ff3-4608-aacb-55cff04ff847', '24879a43-b402-4f88-82b6-44d66a67263b', '2026-07-28 12:10:45.785698+00', '2026-07-28 12:10:45.785698+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('a55e2f43-167b-4617-a5d4-282e46039968', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:39:38.729467+00', '2026-07-28 13:39:38.729467+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('24188082-6172-4b01-8c94-c36475d2a900', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:39:29.925048+00', '2026-07-28 13:39:29.925048+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('7713b648-6f20-4be9-a784-9ce1c852291d', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:39:31.829107+00', '2026-07-28 13:39:31.829107+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('37b69f2b-2159-42ae-8f2a-945cc8c260fd', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:39:37.716504+00', '2026-07-28 13:39:37.716504+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('9e852e45-9e94-4b52-813f-8bcecf202468', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:39:30.768392+00', '2026-07-28 13:39:30.768392+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('bd0c76aa-d4de-4635-896f-7d076f36c242', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:39:31.712166+00', '2026-07-28 13:39:31.712166+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('bd5486cc-1a9e-46f5-ad7d-49ea72a3c9c0', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:39:44.825331+00', '2026-07-28 13:39:44.825331+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('c68540bc-dd48-4527-850b-f0738a0622db', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:39:46.808338+00', '2026-07-28 13:39:46.808338+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('47576d81-2fbb-4d05-9890-e62246e03e9f', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:39:45.83733+00', '2026-07-28 13:39:45.83733+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('53ae03f5-9325-47fc-b1c5-989db54b4570', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:39:48.867343+00', '2026-07-28 13:39:48.867343+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('871fb896-1d5b-466f-b133-3f5d50e1a25c', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:39:53.852178+00', '2026-07-28 13:39:53.852178+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('8ab2931f-5a3e-4517-bff6-04419ff94250', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:31.654507+00', '2026-07-28 13:40:31.654507+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('26badbac-8e5c-42c4-abbb-fa14f575e7f7', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:41.68711+00', '2026-07-28 13:40:41.68711+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('edbc6bd1-e5ec-4d7c-bdfc-418e3be99516', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:43.474851+00', '2026-07-28 13:40:43.474851+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('31be3648-7c16-4665-bb01-39f51d4652c1', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:43.881223+00', '2026-07-28 13:40:43.881223+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('2cbb3243-7f37-4be8-abac-f3a6f6980e8c', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:50.838087+00', '2026-07-28 13:40:50.838087+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('ba47acdc-ae6d-4e03-8479-ef15f84a5384', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:57.791223+00', '2026-07-28 13:40:57.791223+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('40b7476d-56be-4ffb-a652-b7fa69ca07d4', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:41:01.561444+00', '2026-07-28 13:41:01.561444+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('742bb3f8-8376-4cd1-94b8-3d8c1d393edc', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:41:03.021526+00', '2026-07-28 13:41:03.021526+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('beb02c60-34ef-4f77-b76e-0633363256c3', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:41:04.011137+00', '2026-07-28 13:41:04.011137+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('0a5670ae-a911-4d62-93a1-ca512acef2f5', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:41:18.356406+00', '2026-07-28 13:41:18.356406+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('2a2253ef-23f1-488a-9af4-83d986dedbb4', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:41:36.923075+00', '2026-07-28 13:41:36.923075+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('ea0df803-2f1f-4b68-8bfd-8646f37eb1c5', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:41:52.461495+00', '2026-07-28 13:41:52.461495+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('5cc5dc61-878d-4672-9b42-93c6a8ed636a', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:42:01.590161+00', '2026-07-28 13:42:01.590161+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('b5d163b6-2089-4d6e-9fe0-0963586fbba7', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:42:02.204045+00', '2026-07-28 13:42:02.204045+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('15c39021-9c69-4c14-b3c4-e807c7f93ee1', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:42:09.111036+00', '2026-07-28 13:42:09.111036+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('68820722-dcff-4171-9909-f9145167a439', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:42:09.303343+00', '2026-07-28 13:42:09.303343+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('43e80ec7-f090-4451-8d9a-f3eefdda82b8', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:39:51.853431+00', '2026-07-28 13:39:51.853431+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('5a838219-15ff-40d2-920f-ff6491977b7e', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:39:53.085371+00', '2026-07-28 13:39:53.085371+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('c9f04984-26d4-4835-b216-8908f55307d3', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:39:58.911382+00', '2026-07-28 13:39:58.911382+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('fa6f069f-b8a4-4a68-8047-0d5277d73f63', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:06.39573+00', '2026-07-28 13:40:06.39573+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('d572fdce-7f5d-483d-8867-8e0ca7941ef2', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:07.013217+00', '2026-07-28 13:40:07.013217+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('ef2c5f3f-3c05-4e2a-9917-073983d06269', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:25.430069+00', '2026-07-28 13:40:25.430069+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('3abeba10-77b9-4698-aac9-4447cf10b8bf', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:25.522976+00', '2026-07-28 13:40:25.522976+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('cfa55879-66b3-4b8e-bc51-33668c0acf3f', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:55.753907+00', '2026-07-28 13:40:55.753907+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('9b368e06-69fd-43d2-be97-3aeb4aa9f102', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:00.917257+00', '2026-07-28 13:40:00.917257+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('6cf4c6ac-8019-45fe-8c17-b2af54c66cd8', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:13.582082+00', '2026-07-28 13:40:13.582082+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('ae1396f3-e16a-4cfd-8bf7-7082a3657fea', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:16.306736+00', '2026-07-28 13:40:16.306736+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('369c0e4f-2e14-45af-ac76-a2d32d232048', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:18.89222+00', '2026-07-28 13:40:18.89222+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('175b8da9-9690-4234-9053-d7fa8926fbe5', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:41:09.863893+00', '2026-07-28 13:41:09.863893+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('60a8b3ae-8f99-4cea-9e04-2e01f120a382', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:41:16.866709+00', '2026-07-28 13:41:16.866709+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('78198abf-0c7c-457e-8120-ae534b06c733', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:41:18.960163+00', '2026-07-28 13:41:18.960163+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('fe2b6329-ce76-49db-893e-d51788af8d7e', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:41:33.186194+00', '2026-07-28 13:41:33.186194+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('e2005d8e-7033-4bfc-be80-e42d965730e1', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:41:34.443381+00', '2026-07-28 13:41:34.443381+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('3df7b1f5-eec1-4afb-baa8-641020c71120', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:41:36.250191+00', '2026-07-28 13:41:36.250191+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('5232a394-5a96-419d-b2ce-00a26201971f', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:41:51.324687+00', '2026-07-28 13:41:51.324687+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('b219ae0c-d9bc-4cfb-a6d5-963b15f7e484', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:41:54.916868+00', '2026-07-28 13:41:54.916868+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('f47630b2-03d6-4dab-b603-7cc861b355fd', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:42:02.826177+00', '2026-07-28 13:42:02.826177+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('2bc90967-823f-462e-8b30-447ee6da7eea', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:42:04.765709+00', '2026-07-28 13:42:04.765709+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('5b56eac8-2cec-4edd-9f3f-49ba72a3fce7', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:42:12.114773+00', '2026-07-28 13:42:12.114773+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('2c858f0b-69db-4845-89b7-9f9c74bf6ef0', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:42:17.279546+00', '2026-07-28 13:42:17.279546+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('347771ae-f447-4c87-a8d9-160329e45281', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:42:19.52333+00', '2026-07-28 13:42:19.52333+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('e5842a39-a4cd-42da-b133-8344179863d0', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:42:30.996248+00', '2026-07-28 13:42:30.996248+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('cbeff701-4826-4c54-aca8-f2a165b318c2', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:42:31.913731+00', '2026-07-28 13:42:31.913731+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('6c84e71f-747c-4e1c-ac08-79315866b621', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:02.280766+00', '2026-07-28 13:40:02.280766+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('6676d17f-c97c-4a25-9c6f-047a1c5f168f', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:09.367857+00', '2026-07-28 13:40:09.367857+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('968aba85-fef8-438a-8b3c-1b388c177a5d', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:34.858904+00', '2026-07-28 13:40:34.858904+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('466a5877-414d-48ec-ab5b-09fb04eed9f0', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:36.733636+00', '2026-07-28 13:40:36.733636+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('c09f4b25-b294-4a8b-a1b8-1c24eadee8e4', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:48.78192+00', '2026-07-28 13:40:48.78192+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('834dcd21-b5b7-4429-a252-e64b9f7b8258', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:50.094382+00', '2026-07-28 13:40:50.094382+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('d1d802ad-ba5b-4b3d-b4e8-dead32067b4a', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:41:04.881693+00', '2026-07-28 13:41:04.881693+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('a53e2116-149c-41c2-81dd-3f9f07f48e34', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:41:11.9307+00', '2026-07-28 13:41:11.9307+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('4600d9a5-fe55-42e9-a9cb-70c4d1fb24d8', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:42:16.384636+00', '2026-07-28 13:42:16.384636+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('4d9124d8-7860-42ae-ae21-ec7f7989f984', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:42:16.50489+00', '2026-07-28 13:42:16.50489+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('92ff3d0c-ac89-4120-aa5d-d7cb02a80e94', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:42:23.633346+00', '2026-07-28 13:42:23.633346+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('158a42f3-9e33-4a4c-a576-1c04dc9d2489', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:42:24.027035+00', '2026-07-28 13:42:24.027035+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('32b48048-c047-4003-825b-3b69cdaa8b89', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:42:26.832028+00', '2026-07-28 13:42:26.832028+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('0b83ca47-0747-4a6c-8c6f-4b584ad21e2f', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:42:41.666063+00', '2026-07-28 13:42:41.666063+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('2e6301d4-06f4-45bc-877c-5dd34be58767', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:40:56.982744+00', '2026-07-28 13:40:56.982744+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('f1b34a58-223b-4f48-baae-45cfe65ac539', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:41:08.573594+00', '2026-07-28 13:41:08.573594+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('19c6b14b-404b-4c17-b780-7ad0015a505a', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:41:11.098781+00', '2026-07-28 13:41:11.098781+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('e7c5f8b1-5e5a-4af5-8602-9137e9130128', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:41:15.619786+00', '2026-07-28 13:41:15.619786+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('6b4e7c39-84d9-4bb2-a123-f32fc2aca3c2', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:41:54.381052+00', '2026-07-28 13:41:54.381052+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('f3699643-2e2e-41fc-bc6f-cf47fd688499', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:42:09.943146+00', '2026-07-28 13:42:09.943146+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('c52fe9b7-0796-475b-8ae5-8ca335a09559', '11eb1389-f28d-4e34-aa5b-9909e382b328', '2026-07-28 13:42:24.660456+00', '2026-07-28 13:42:24.660456+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15', '72.202.185.98', NULL, NULL, NULL, NULL, NULL),
	('8ac83f73-a946-4d4e-9bb0-1cdde79ae61d', '17f90e39-a66e-41db-a994-622c9795464c', '2026-07-29 01:38:17.274845+00', '2026-07-29 01:38:17.274845+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.7922.34 Safari/537.36', '72.202.185.98', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('e3bd5b83-7b9b-40db-8a9a-1e0df3b310a3', '2026-07-21 05:11:39.56353+00', '2026-07-21 05:11:39.56353+00', 'password', '43be92fb-3e51-4db3-8b17-53aa21e1cdac'),
	('012c6bd9-190a-4c99-bf50-ee952bd34607', '2026-07-21 05:19:06.299916+00', '2026-07-21 05:19:06.299916+00', 'password', '40e24823-d0f0-4420-8391-10f9b9351a3c'),
	('6f96c0c0-3c86-494c-a21b-3bada55306b8', '2026-07-02 21:47:39.628486+00', '2026-07-02 21:47:39.628486+00', 'password', '0ebf937b-5364-415d-9c5e-3103f66813d7'),
	('2ad4508a-6e54-4255-8539-e34090d836bd', '2026-07-02 21:48:24.388449+00', '2026-07-02 21:48:24.388449+00', 'password', 'c40392f2-d106-4a96-aaf5-f8a217fed2b5'),
	('262cb7f4-27e3-4047-aacb-b11f7a6ab2a0', '2026-07-06 13:17:30.583085+00', '2026-07-06 13:17:30.583085+00', 'password', '4fd292f0-75de-4a32-87e6-6ad72800726e'),
	('dde6ac84-489a-4449-af9c-a556df6d637d', '2026-07-06 18:40:23.033026+00', '2026-07-06 18:40:23.033026+00', 'password', '5df45dab-b3f6-4bb6-9a54-147f0748d253'),
	('583024d2-b042-4ae4-94a5-ee613dda3cc9', '2026-07-22 01:08:42.045215+00', '2026-07-22 01:08:42.045215+00', 'password', '355fa618-35d2-4bf1-b72a-f125f0da8e15'),
	('d983c1b2-7d1a-4c10-bd72-257fd30badf6', '2026-07-23 04:49:06.27543+00', '2026-07-23 04:49:06.27543+00', 'password', '66d90844-ba88-42b1-a6ce-4657aaadcf5d'),
	('f88ec16d-c521-4f94-99b1-8664b4ca9819', '2026-07-23 04:49:22.432225+00', '2026-07-23 04:49:22.432225+00', 'password', '56d2788a-ff97-4637-8df3-6008e86cbed4'),
	('4a40f0f5-0d4b-4f79-ba1f-0c2d3c6a7cdd', '2026-07-23 04:50:05.167927+00', '2026-07-23 04:50:05.167927+00', 'password', 'f4d432a4-70ea-439a-9a04-ea7a7120567e'),
	('fbdf25eb-2388-4a0d-957f-db812d2aca34', '2026-07-23 04:50:37.444898+00', '2026-07-23 04:50:37.444898+00', 'password', '1f031019-7b64-4ef6-96e5-41968667846c'),
	('67972638-4fa0-4b84-8eb7-0016d2e0fb07', '2026-07-23 04:51:00.262393+00', '2026-07-23 04:51:00.262393+00', 'password', '46e156bb-0963-4041-ab05-de1c7894764a'),
	('7fc6a31c-8ed4-4e70-bdf1-8fcb1b7f6c18', '2026-07-23 10:23:42.965176+00', '2026-07-23 10:23:42.965176+00', 'password', 'ae91f863-5d83-450e-8311-bffff7632b32'),
	('45508066-d8f7-4fad-af7f-85fcc6057fe6', '2026-07-23 23:06:32.61194+00', '2026-07-23 23:06:32.61194+00', 'otp', '23450ec2-1242-4104-bd5a-a59fc1dd92a2'),
	('19e25cf7-ba21-4468-b932-6bf0b61c9974', '2026-07-24 11:36:51.171625+00', '2026-07-24 11:36:51.171625+00', 'password', 'd4f06f4d-db36-4184-a63d-5e1a8a9d60b8'),
	('3b02d88c-0615-4872-8ffc-857a8bcd782c', '2026-07-25 19:03:59.341233+00', '2026-07-25 19:03:59.341233+00', 'password', '1be8f482-acb4-431c-8b27-6a6b288b800d'),
	('919f17dd-989f-4008-abca-a37f5e603712', '2026-07-26 23:25:03.877133+00', '2026-07-26 23:25:03.877133+00', 'password', '2e2fcc47-9316-480c-8719-395da8e69511'),
	('514c088c-0642-4341-afe3-c8aaad81408b', '2026-07-26 23:28:02.66016+00', '2026-07-26 23:28:02.66016+00', 'password', 'f01afc9f-ade6-43da-b7ab-d52b48e90a3d'),
	('cb137e6a-e8ca-4fec-a963-fb12b8070e96', '2026-07-28 12:10:34.582003+00', '2026-07-28 12:10:34.582003+00', 'password', '83a19047-4361-4d9b-920d-afd93dece61b'),
	('62d0a333-2f52-4736-857f-86cb4a88c9c1', '2026-07-28 12:10:34.678664+00', '2026-07-28 12:10:34.678664+00', 'password', 'c7c2fc0e-0d0f-411c-97a9-8ecee1207698'),
	('8061bac0-f63a-411e-b62a-06cfc3d63f9a', '2026-07-28 12:10:30.397215+00', '2026-07-28 12:10:30.397215+00', 'password', '6478a59e-61ce-4506-933e-55131636b335'),
	('20436a27-392b-405f-8399-587524500d8c', '2026-07-28 12:10:31.118721+00', '2026-07-28 12:10:31.118721+00', 'password', '4d5eca46-aef6-4732-8173-922165fb783e'),
	('823a3b79-47da-4f4b-a049-d17b55a8838a', '2026-07-28 12:10:32.40569+00', '2026-07-28 12:10:32.40569+00', 'password', '92b22cfb-965c-44af-a78f-f02b0b258a43'),
	('106645a8-f68c-4a30-931a-5b00712a3bac', '2026-07-28 12:10:37.572518+00', '2026-07-28 12:10:37.572518+00', 'password', '6381c103-02a1-4ee4-8959-2173b0c83e30'),
	('f9876ace-11ea-4d30-93eb-08042564926f', '2026-07-28 12:10:38.006228+00', '2026-07-28 12:10:38.006228+00', 'password', '9ca975f9-cb46-4217-b351-75119f0b8db8'),
	('87d8efb5-ce98-413d-9065-ddc349ed5939', '2026-07-28 12:10:29.712054+00', '2026-07-28 12:10:29.712054+00', 'password', '7b593ae5-9e78-48e2-9c2e-2ce66a327db0'),
	('67706688-8bf0-40b5-97f1-d4f4740b0b38', '2026-07-28 12:10:39.556624+00', '2026-07-28 12:10:39.556624+00', 'password', '475cef5d-8545-49e6-8e0c-2d7ca061bf88'),
	('74cae454-02d9-4209-8903-7a49b7d6673b', '2026-07-28 12:10:43.002848+00', '2026-07-28 12:10:43.002848+00', 'password', '6ec7a118-ed87-489b-9c89-03935e3d97b5'),
	('1f97f4d5-d478-4ce5-acca-087ca65a16f4', '2026-07-28 12:10:43.390817+00', '2026-07-28 12:10:43.390817+00', 'password', 'a35b5407-b0fc-41da-98fc-0660ddc47120'),
	('24188082-6172-4b01-8c94-c36475d2a900', '2026-07-28 13:39:29.927848+00', '2026-07-28 13:39:29.927848+00', 'password', 'd8a6fc16-4beb-4244-bf04-3bc67f330912'),
	('7713b648-6f20-4be9-a784-9ce1c852291d', '2026-07-28 13:39:31.831736+00', '2026-07-28 13:39:31.831736+00', 'password', 'bdf01881-db8e-4f28-a8c7-e965ceef01f9'),
	('37b69f2b-2159-42ae-8f2a-945cc8c260fd', '2026-07-28 13:39:37.719208+00', '2026-07-28 13:39:37.719208+00', 'password', 'aa2cf01b-dff2-4fbf-bb70-7f368715ad9e'),
	('d66b5e90-76cf-4e3e-b02a-bc21c7fe2be3', '2026-07-28 12:10:40.26918+00', '2026-07-28 12:10:40.26918+00', 'password', '01cfe221-c2d2-41e5-8bc0-1c107f15cba6'),
	('32a98e27-136e-4bc5-82dc-9596e40a441f', '2026-07-28 12:10:44.789163+00', '2026-07-28 12:10:44.789163+00', 'password', '2db3f5d2-caf0-47b8-8af7-553389dc5b58'),
	('48f881ec-2ff3-4608-aacb-55cff04ff847', '2026-07-28 12:10:45.790646+00', '2026-07-28 12:10:45.790646+00', 'password', '104236d1-f038-4df7-88ee-1e70363c50b6'),
	('a55e2f43-167b-4617-a5d4-282e46039968', '2026-07-28 13:39:38.732578+00', '2026-07-28 13:39:38.732578+00', 'password', 'abe68499-5a9a-449e-8dd3-8e847668574b'),
	('9e852e45-9e94-4b52-813f-8bcecf202468', '2026-07-28 13:39:30.770666+00', '2026-07-28 13:39:30.770666+00', 'password', '5938c4d3-2d7c-4119-97d5-99038eb8e4f5'),
	('bd0c76aa-d4de-4635-896f-7d076f36c242', '2026-07-28 13:39:31.714363+00', '2026-07-28 13:39:31.714363+00', 'password', 'b14a6a7a-6622-47a8-a6fd-598811f8f466'),
	('bd5486cc-1a9e-46f5-ad7d-49ea72a3c9c0', '2026-07-28 13:39:44.831042+00', '2026-07-28 13:39:44.831042+00', 'password', '0b2622e4-96fd-45f3-8901-17916222f8aa'),
	('c68540bc-dd48-4527-850b-f0738a0622db', '2026-07-28 13:39:46.81191+00', '2026-07-28 13:39:46.81191+00', 'password', '54cd2c7c-79a1-4f3d-99c2-6203818fd400'),
	('47576d81-2fbb-4d05-9890-e62246e03e9f', '2026-07-28 13:39:45.840812+00', '2026-07-28 13:39:45.840812+00', 'password', '7cf5b36d-f333-47c1-afab-7906c754302d'),
	('53ae03f5-9325-47fc-b1c5-989db54b4570', '2026-07-28 13:39:48.869621+00', '2026-07-28 13:39:48.869621+00', 'password', '70e224a0-b38a-4922-bd09-8b1535ee4b34'),
	('871fb896-1d5b-466f-b133-3f5d50e1a25c', '2026-07-28 13:39:53.85543+00', '2026-07-28 13:39:53.85543+00', 'password', '9088120e-2e77-4ac0-bd4c-abec281ae3b0'),
	('8ab2931f-5a3e-4517-bff6-04419ff94250', '2026-07-28 13:40:31.658065+00', '2026-07-28 13:40:31.658065+00', 'password', '91e7f3c9-aa8c-4848-8110-5741e9d97c9c'),
	('26badbac-8e5c-42c4-abbb-fa14f575e7f7', '2026-07-28 13:40:41.689919+00', '2026-07-28 13:40:41.689919+00', 'password', '2031dfb8-201e-4644-b7f9-a0cb547d521a'),
	('edbc6bd1-e5ec-4d7c-bdfc-418e3be99516', '2026-07-28 13:40:43.477313+00', '2026-07-28 13:40:43.477313+00', 'password', '0f2d6e23-d895-4dd5-a50a-7c4e98034849'),
	('31be3648-7c16-4665-bb01-39f51d4652c1', '2026-07-28 13:40:43.883414+00', '2026-07-28 13:40:43.883414+00', 'password', '72b7b4de-20f9-4b34-a440-0766861325c1'),
	('2cbb3243-7f37-4be8-abac-f3a6f6980e8c', '2026-07-28 13:40:50.840243+00', '2026-07-28 13:40:50.840243+00', 'password', 'e22b4d7f-36b6-4b5e-9090-cfdfa51fd408'),
	('ba47acdc-ae6d-4e03-8479-ef15f84a5384', '2026-07-28 13:40:57.793376+00', '2026-07-28 13:40:57.793376+00', 'password', '39626ccb-0e34-4639-a126-ab1b834c7bc2'),
	('40b7476d-56be-4ffb-a652-b7fa69ca07d4', '2026-07-28 13:41:01.564207+00', '2026-07-28 13:41:01.564207+00', 'password', '794c201e-ee2a-4ea6-a873-074079f02894'),
	('742bb3f8-8376-4cd1-94b8-3d8c1d393edc', '2026-07-28 13:41:03.023626+00', '2026-07-28 13:41:03.023626+00', 'password', '275d1404-8bc5-4748-b98a-46d19769d2a6'),
	('beb02c60-34ef-4f77-b76e-0633363256c3', '2026-07-28 13:41:04.016967+00', '2026-07-28 13:41:04.016967+00', 'password', 'affb7773-0b94-498e-a81c-9b841d32d593'),
	('0a5670ae-a911-4d62-93a1-ca512acef2f5', '2026-07-28 13:41:18.360521+00', '2026-07-28 13:41:18.360521+00', 'password', '4d02f23d-2453-4bce-b8da-b25b5b739d3e'),
	('2a2253ef-23f1-488a-9af4-83d986dedbb4', '2026-07-28 13:41:36.926403+00', '2026-07-28 13:41:36.926403+00', 'password', 'b0462002-dd76-46f1-b01f-bf170b304de3'),
	('ea0df803-2f1f-4b68-8bfd-8646f37eb1c5', '2026-07-28 13:41:52.468614+00', '2026-07-28 13:41:52.468614+00', 'password', '7ff6b793-3200-4fac-9ae5-f947e8c40cd7'),
	('5cc5dc61-878d-4672-9b42-93c6a8ed636a', '2026-07-28 13:42:01.618095+00', '2026-07-28 13:42:01.618095+00', 'password', 'c35163b2-008e-4388-bfad-7dab3a9229f1'),
	('b5d163b6-2089-4d6e-9fe0-0963586fbba7', '2026-07-28 13:42:02.207983+00', '2026-07-28 13:42:02.207983+00', 'password', '1815817a-a4f8-4a94-907c-e9ef5fdc91b7'),
	('15c39021-9c69-4c14-b3c4-e807c7f93ee1', '2026-07-28 13:42:09.113652+00', '2026-07-28 13:42:09.113652+00', 'password', 'ef607eb1-d8df-4021-a7be-7849f9447ff8'),
	('68820722-dcff-4171-9909-f9145167a439', '2026-07-28 13:42:09.305781+00', '2026-07-28 13:42:09.305781+00', 'password', '5948f3bd-e5e2-4ee0-be78-b52f90f891d4'),
	('43e80ec7-f090-4451-8d9a-f3eefdda82b8', '2026-07-28 13:39:51.858519+00', '2026-07-28 13:39:51.858519+00', 'password', '64fdcdd1-7e70-4d81-9372-8c9ff476de11'),
	('5a838219-15ff-40d2-920f-ff6491977b7e', '2026-07-28 13:39:53.089458+00', '2026-07-28 13:39:53.089458+00', 'password', 'e12a433b-8ca1-44ea-85f6-2a7a89b34875'),
	('c9f04984-26d4-4835-b216-8908f55307d3', '2026-07-28 13:39:58.936914+00', '2026-07-28 13:39:58.936914+00', 'password', 'ec468541-7bae-43ca-bd64-65eef380938d'),
	('fa6f069f-b8a4-4a68-8047-0d5277d73f63', '2026-07-28 13:40:06.398216+00', '2026-07-28 13:40:06.398216+00', 'password', '2a64cc94-ac09-413a-8945-ae307ebe724e'),
	('d572fdce-7f5d-483d-8867-8e0ca7941ef2', '2026-07-28 13:40:07.015878+00', '2026-07-28 13:40:07.015878+00', 'password', 'e3def597-8c4e-4833-bd81-e1e9e749c4f8'),
	('ef2c5f3f-3c05-4e2a-9917-073983d06269', '2026-07-28 13:40:25.43551+00', '2026-07-28 13:40:25.43551+00', 'password', '9692761d-8d42-4167-8130-f77d819f3306'),
	('3abeba10-77b9-4698-aac9-4447cf10b8bf', '2026-07-28 13:40:25.526261+00', '2026-07-28 13:40:25.526261+00', 'password', 'e07e42bb-65a0-430c-9794-25b00114ec0d'),
	('cfa55879-66b3-4b8e-bc51-33668c0acf3f', '2026-07-28 13:40:55.756812+00', '2026-07-28 13:40:55.756812+00', 'password', '8dcddfa0-0210-4b7f-86c0-b9920331deab'),
	('9b368e06-69fd-43d2-be97-3aeb4aa9f102', '2026-07-28 13:40:00.926247+00', '2026-07-28 13:40:00.926247+00', 'password', 'fdc55b6c-6262-41d3-887a-767445e6dca7'),
	('6cf4c6ac-8019-45fe-8c17-b2af54c66cd8', '2026-07-28 13:40:13.584154+00', '2026-07-28 13:40:13.584154+00', 'password', '59ab149d-244f-49a1-a0d1-a98c647bcfb2'),
	('ae1396f3-e16a-4cfd-8bf7-7082a3657fea', '2026-07-28 13:40:16.308763+00', '2026-07-28 13:40:16.308763+00', 'password', '712ffdba-d2c6-4ec0-b482-72aaee0ec9d6'),
	('369c0e4f-2e14-45af-ac76-a2d32d232048', '2026-07-28 13:40:18.896942+00', '2026-07-28 13:40:18.896942+00', 'password', 'f1c92be9-352d-46d8-9f11-fc0ccd83be90'),
	('175b8da9-9690-4234-9053-d7fa8926fbe5', '2026-07-28 13:41:09.867459+00', '2026-07-28 13:41:09.867459+00', 'password', '48e2a656-c853-4438-be27-de82d63186d1'),
	('60a8b3ae-8f99-4cea-9e04-2e01f120a382', '2026-07-28 13:41:16.869001+00', '2026-07-28 13:41:16.869001+00', 'password', '88307788-1b1f-43d5-bfea-beed89b4cc48'),
	('78198abf-0c7c-457e-8120-ae534b06c733', '2026-07-28 13:41:18.962423+00', '2026-07-28 13:41:18.962423+00', 'password', '83f9bdd7-a164-4b58-adf0-01942a250150'),
	('fe2b6329-ce76-49db-893e-d51788af8d7e', '2026-07-28 13:41:33.188633+00', '2026-07-28 13:41:33.188633+00', 'password', 'e05c844c-b766-4446-858c-b5cec96c7b32'),
	('e2005d8e-7033-4bfc-be80-e42d965730e1', '2026-07-28 13:41:34.453234+00', '2026-07-28 13:41:34.453234+00', 'password', '3292d7df-9dc8-4a90-a5cc-646ab5ed115c'),
	('3df7b1f5-eec1-4afb-baa8-641020c71120', '2026-07-28 13:41:36.255868+00', '2026-07-28 13:41:36.255868+00', 'password', '76cd6669-b993-42ab-8987-092b4cf9f568'),
	('5232a394-5a96-419d-b2ce-00a26201971f', '2026-07-28 13:41:51.328279+00', '2026-07-28 13:41:51.328279+00', 'password', '3e5ecdc7-9a03-4356-955e-a3a8c6ef398b'),
	('b219ae0c-d9bc-4cfb-a6d5-963b15f7e484', '2026-07-28 13:41:54.919579+00', '2026-07-28 13:41:54.919579+00', 'password', '811777ad-e18c-43f0-a6bb-188d1e1b9fd4'),
	('f47630b2-03d6-4dab-b603-7cc861b355fd', '2026-07-28 13:42:02.831711+00', '2026-07-28 13:42:02.831711+00', 'password', '248a3326-12af-47e1-a183-ecd9240e06c3'),
	('2bc90967-823f-462e-8b30-447ee6da7eea', '2026-07-28 13:42:04.768247+00', '2026-07-28 13:42:04.768247+00', 'password', '36b219d7-d9be-4f62-b533-c74758ea193d'),
	('5b56eac8-2cec-4edd-9f3f-49ba72a3fce7', '2026-07-28 13:42:12.119414+00', '2026-07-28 13:42:12.119414+00', 'password', 'a897a07a-43c5-40f8-b4e0-1919e21c482b'),
	('2c858f0b-69db-4845-89b7-9f9c74bf6ef0', '2026-07-28 13:42:17.281659+00', '2026-07-28 13:42:17.281659+00', 'password', '253834c1-55d1-4ade-afb8-56bf4c3063bd'),
	('347771ae-f447-4c87-a8d9-160329e45281', '2026-07-28 13:42:19.525537+00', '2026-07-28 13:42:19.525537+00', 'password', 'cbaa2d4b-44a1-407c-8146-84ba9f4ea2a5'),
	('e5842a39-a4cd-42da-b133-8344179863d0', '2026-07-28 13:42:30.9985+00', '2026-07-28 13:42:30.9985+00', 'password', 'b8f89148-b32c-4318-9db4-c5d0afe4b31f'),
	('cbeff701-4826-4c54-aca8-f2a165b318c2', '2026-07-28 13:42:31.916825+00', '2026-07-28 13:42:31.916825+00', 'password', '9435f112-0f89-4050-925d-fad74f019957'),
	('6c84e71f-747c-4e1c-ac08-79315866b621', '2026-07-28 13:40:02.285308+00', '2026-07-28 13:40:02.285308+00', 'password', '2e516fb1-dddc-4dd9-8dcc-ddcc6362d35f'),
	('6676d17f-c97c-4a25-9c6f-047a1c5f168f', '2026-07-28 13:40:09.37013+00', '2026-07-28 13:40:09.37013+00', 'password', '92d5cad4-0bec-41b6-a38d-2dd86d87b7a5'),
	('968aba85-fef8-438a-8b3c-1b388c177a5d', '2026-07-28 13:40:34.861861+00', '2026-07-28 13:40:34.861861+00', 'password', '0d7952d6-dc25-4e05-a495-14bfba8de6ea'),
	('466a5877-414d-48ec-ab5b-09fb04eed9f0', '2026-07-28 13:40:36.735895+00', '2026-07-28 13:40:36.735895+00', 'password', 'c0acb67d-43f7-477c-9f51-d284cf4cb4b3'),
	('c09f4b25-b294-4a8b-a1b8-1c24eadee8e4', '2026-07-28 13:40:48.784627+00', '2026-07-28 13:40:48.784627+00', 'password', '7e88c554-6171-4914-a503-475b68761d16'),
	('834dcd21-b5b7-4429-a252-e64b9f7b8258', '2026-07-28 13:40:50.096688+00', '2026-07-28 13:40:50.096688+00', 'password', 'de4d53ae-dd41-4ec0-8c48-7cd2b97c7f84'),
	('d1d802ad-ba5b-4b3d-b4e8-dead32067b4a', '2026-07-28 13:41:04.88413+00', '2026-07-28 13:41:04.88413+00', 'password', 'e352f5f7-535a-41a0-9b29-ce2e06e3db9a'),
	('a53e2116-149c-41c2-81dd-3f9f07f48e34', '2026-07-28 13:41:11.933539+00', '2026-07-28 13:41:11.933539+00', 'password', '9f9c8edf-d189-46da-b444-d20781d1267f'),
	('4600d9a5-fe55-42e9-a9cb-70c4d1fb24d8', '2026-07-28 13:42:16.388592+00', '2026-07-28 13:42:16.388592+00', 'password', 'd738a819-b405-4758-947a-21a9c0833f81'),
	('4d9124d8-7860-42ae-ae21-ec7f7989f984', '2026-07-28 13:42:16.507754+00', '2026-07-28 13:42:16.507754+00', 'password', 'ec0f5184-1a10-464c-93ae-2a159f44afd1'),
	('92ff3d0c-ac89-4120-aa5d-d7cb02a80e94', '2026-07-28 13:42:23.636096+00', '2026-07-28 13:42:23.636096+00', 'password', '007db4ce-3c1b-4ffa-b125-22842d1a2e96'),
	('158a42f3-9e33-4a4c-a576-1c04dc9d2489', '2026-07-28 13:42:24.02927+00', '2026-07-28 13:42:24.02927+00', 'password', '61781886-1ca6-4b41-b8d0-a0222381f73a'),
	('32b48048-c047-4003-825b-3b69cdaa8b89', '2026-07-28 13:42:26.834324+00', '2026-07-28 13:42:26.834324+00', 'password', '5cf4e52c-14f1-466b-b4aa-ee27085262f7'),
	('0b83ca47-0747-4a6c-8c6f-4b584ad21e2f', '2026-07-28 13:42:41.66872+00', '2026-07-28 13:42:41.66872+00', 'password', 'dcb8e1fa-8629-475a-86d0-eaddfc83ca0e'),
	('2e6301d4-06f4-45bc-877c-5dd34be58767', '2026-07-28 13:40:56.991416+00', '2026-07-28 13:40:56.991416+00', 'password', 'e46df48f-00b8-4a10-8415-416f65f7b6a5'),
	('f1b34a58-223b-4f48-baae-45cfe65ac539', '2026-07-28 13:41:08.577461+00', '2026-07-28 13:41:08.577461+00', 'password', '618277fd-9bbd-4259-9707-c51a7482ecff'),
	('19c6b14b-404b-4c17-b780-7ad0015a505a', '2026-07-28 13:41:11.104431+00', '2026-07-28 13:41:11.104431+00', 'password', 'd0bf6c70-deba-47a9-a1ff-e47c85882bd0'),
	('e7c5f8b1-5e5a-4af5-8602-9137e9130128', '2026-07-28 13:41:15.622096+00', '2026-07-28 13:41:15.622096+00', 'password', '923eb749-4aea-41f0-a2db-8935f3dee42c'),
	('6b4e7c39-84d9-4bb2-a123-f32fc2aca3c2', '2026-07-28 13:41:54.384326+00', '2026-07-28 13:41:54.384326+00', 'password', '4030d28e-9199-4db0-b581-a7431303b5c2'),
	('f3699643-2e2e-41fc-bc6f-cf47fd688499', '2026-07-28 13:42:09.947489+00', '2026-07-28 13:42:09.947489+00', 'password', '7a86c36a-3d7e-41e9-b467-1d1f324b2431'),
	('c52fe9b7-0796-475b-8ae5-8ca335a09559', '2026-07-28 13:42:24.665763+00', '2026-07-28 13:42:24.665763+00', 'password', 'faadf46d-0abb-4e18-a403-8265438f1fc0'),
	('8ac83f73-a946-4d4e-9bb0-1cdde79ae61d', '2026-07-29 01:38:17.280725+00', '2026-07-29 01:38:17.280725+00', 'password', '19e644da-2605-4ead-ae82-0f6437004cf5');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") VALUES
	('e1d954b2-dc5f-4dbe-8427-542e63ed6f46', '6de24902-075d-4803-a025-3e1d555df542', 'recovery_token', '3687392eb39b139a20e9a1f001ac6f3ccda531b0ad15c5c1fbe73b33', 'patty.pineda.drl@gmail.com', '2026-07-29 01:38:23.924095', '2026-07-29 01:38:23.924095');


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 343, 'cgfnwhqrbqbs', '6a2bcb89-d37e-4d3c-af1f-a1809d323555', true, '2026-07-25 19:03:59.3306+00', '2026-07-25 22:32:21.046341+00', NULL, '3b02d88c-0615-4872-8ffc-857a8bcd782c'),
	('00000000-0000-0000-0000-000000000000', 344, '32khod5ayyc7', '6a2bcb89-d37e-4d3c-af1f-a1809d323555', true, '2026-07-25 22:32:21.066187+00', '2026-07-26 12:38:51.098937+00', 'cgfnwhqrbqbs', '3b02d88c-0615-4872-8ffc-857a8bcd782c'),
	('00000000-0000-0000-0000-000000000000', 345, 'zy743zqnlgjh', '6a2bcb89-d37e-4d3c-af1f-a1809d323555', false, '2026-07-26 12:38:51.117043+00', '2026-07-26 12:38:51.117043+00', '32khod5ayyc7', '3b02d88c-0615-4872-8ffc-857a8bcd782c'),
	('00000000-0000-0000-0000-000000000000', 346, 'b7ehqxn2uwe7', '6de24902-075d-4803-a025-3e1d555df542', false, '2026-07-26 23:25:03.825979+00', '2026-07-26 23:25:03.825979+00', NULL, '919f17dd-989f-4008-abca-a37f5e603712'),
	('00000000-0000-0000-0000-000000000000', 347, 'nun6xv6nqq5h', '6de24902-075d-4803-a025-3e1d555df542', false, '2026-07-26 23:28:02.653433+00', '2026-07-26 23:28:02.653433+00', NULL, '514c088c-0642-4341-afe3-c8aaad81408b'),
	('00000000-0000-0000-0000-000000000000', 298, '6ikohja2vjpy', '6a2bcb89-d37e-4d3c-af1f-a1809d323555', false, '2026-07-21 05:11:39.542381+00', '2026-07-21 05:11:39.542381+00', NULL, 'e3bd5b83-7b9b-40db-8a9a-1e0df3b310a3'),
	('00000000-0000-0000-0000-000000000000', 300, 'vcmxmb7mwh3i', '6a2bcb89-d37e-4d3c-af1f-a1809d323555', false, '2026-07-21 05:19:06.293724+00', '2026-07-21 05:19:06.293724+00', NULL, '012c6bd9-190a-4c99-bf50-ee952bd34607'),
	('00000000-0000-0000-0000-000000000000', 59, 'o6iz5fabelm4', 'e033845b-d182-435f-975d-983174ff20e5', false, '2026-07-02 21:47:39.607851+00', '2026-07-02 21:47:39.607851+00', NULL, '6f96c0c0-3c86-494c-a21b-3bada55306b8'),
	('00000000-0000-0000-0000-000000000000', 60, 'qegqrcibjv6r', 'e033845b-d182-435f-975d-983174ff20e5', true, '2026-07-02 21:48:24.387107+00', '2026-07-02 23:02:03.297565+00', NULL, '2ad4508a-6e54-4255-8539-e34090d836bd'),
	('00000000-0000-0000-0000-000000000000', 61, 'bpox473muq6w', 'e033845b-d182-435f-975d-983174ff20e5', false, '2026-07-02 23:02:03.31124+00', '2026-07-02 23:02:03.31124+00', 'qegqrcibjv6r', '2ad4508a-6e54-4255-8539-e34090d836bd'),
	('00000000-0000-0000-0000-000000000000', 62, 'ayvctokouwdb', 'a52a5b46-4ad1-4f63-9fed-e601b200f30b', false, '2026-07-06 13:17:30.553797+00', '2026-07-06 13:17:30.553797+00', NULL, '262cb7f4-27e3-4047-aacb-b11f7a6ab2a0'),
	('00000000-0000-0000-0000-000000000000', 63, 'efmncdzhu4pt', 'bc34afaa-ded5-4861-848d-5393423e9f33', false, '2026-07-06 18:40:23.018198+00', '2026-07-06 18:40:23.018198+00', NULL, 'dde6ac84-489a-4449-af9c-a556df6d637d'),
	('00000000-0000-0000-0000-000000000000', 324, 'gu6dip2qcuyl', '6a2bcb89-d37e-4d3c-af1f-a1809d323555', false, '2026-07-22 01:08:42.038808+00', '2026-07-22 01:08:42.038808+00', NULL, '583024d2-b042-4ae4-94a5-ee613dda3cc9'),
	('00000000-0000-0000-0000-000000000000', 325, 'nhf4rr35c5z2', '49047d6f-7976-4ee4-b79f-865480035f52', false, '2026-07-23 04:49:06.236285+00', '2026-07-23 04:49:06.236285+00', NULL, 'd983c1b2-7d1a-4c10-bd72-257fd30badf6'),
	('00000000-0000-0000-0000-000000000000', 326, 'fqbhs2tpxp6x', '49047d6f-7976-4ee4-b79f-865480035f52', false, '2026-07-23 04:49:22.430853+00', '2026-07-23 04:49:22.430853+00', NULL, 'f88ec16d-c521-4f94-99b1-8664b4ca9819'),
	('00000000-0000-0000-0000-000000000000', 327, 'bptgfxawmsgd', '49047d6f-7976-4ee4-b79f-865480035f52', false, '2026-07-23 04:50:05.159801+00', '2026-07-23 04:50:05.159801+00', NULL, '4a40f0f5-0d4b-4f79-ba1f-0c2d3c6a7cdd'),
	('00000000-0000-0000-0000-000000000000', 328, 'ucwbbqungiu4', '49047d6f-7976-4ee4-b79f-865480035f52', false, '2026-07-23 04:50:37.443403+00', '2026-07-23 04:50:37.443403+00', NULL, 'fbdf25eb-2388-4a0d-957f-db812d2aca34'),
	('00000000-0000-0000-0000-000000000000', 329, 'd4ip5w3sm4tq', '49047d6f-7976-4ee4-b79f-865480035f52', false, '2026-07-23 04:51:00.261004+00', '2026-07-23 04:51:00.261004+00', NULL, '67972638-4fa0-4b84-8eb7-0016d2e0fb07'),
	('00000000-0000-0000-0000-000000000000', 331, 'ih3vsynfn3zx', '6de24902-075d-4803-a025-3e1d555df542', false, '2026-07-23 10:23:42.943951+00', '2026-07-23 10:23:42.943951+00', NULL, '7fc6a31c-8ed4-4e70-bdf1-8fcb1b7f6c18'),
	('00000000-0000-0000-0000-000000000000', 332, 'g3e645i2x6ko', '144ab7dd-b1e2-4ff6-9b16-8fc5357a0d8d', false, '2026-07-23 23:06:32.589558+00', '2026-07-23 23:06:32.589558+00', NULL, '45508066-d8f7-4fad-af7f-85fcc6057fe6'),
	('00000000-0000-0000-0000-000000000000', 333, '2rybr5tc6h4r', '49047d6f-7976-4ee4-b79f-865480035f52', true, '2026-07-24 11:36:51.127584+00', '2026-07-24 12:35:07.597982+00', NULL, '19e25cf7-ba21-4468-b932-6bf0b61c9974'),
	('00000000-0000-0000-0000-000000000000', 334, 'ibh2iih2xu4u', '49047d6f-7976-4ee4-b79f-865480035f52', true, '2026-07-24 12:35:07.614356+00', '2026-07-24 13:33:13.285351+00', '2rybr5tc6h4r', '19e25cf7-ba21-4468-b932-6bf0b61c9974'),
	('00000000-0000-0000-0000-000000000000', 335, 'u3a4qtkvzfho', '49047d6f-7976-4ee4-b79f-865480035f52', true, '2026-07-24 13:33:13.306444+00', '2026-07-24 14:31:25.577936+00', 'ibh2iih2xu4u', '19e25cf7-ba21-4468-b932-6bf0b61c9974'),
	('00000000-0000-0000-0000-000000000000', 336, 'xt76yagjdhfk', '49047d6f-7976-4ee4-b79f-865480035f52', true, '2026-07-24 14:31:25.582328+00', '2026-07-24 15:29:43.283114+00', 'u3a4qtkvzfho', '19e25cf7-ba21-4468-b932-6bf0b61c9974'),
	('00000000-0000-0000-0000-000000000000', 337, 'htoztqh7klig', '49047d6f-7976-4ee4-b79f-865480035f52', true, '2026-07-24 15:29:43.291574+00', '2026-07-24 16:27:45.743571+00', 'xt76yagjdhfk', '19e25cf7-ba21-4468-b932-6bf0b61c9974'),
	('00000000-0000-0000-0000-000000000000', 338, '2rh4pq6mordx', '49047d6f-7976-4ee4-b79f-865480035f52', true, '2026-07-24 16:27:45.75694+00', '2026-07-24 17:26:08.566347+00', 'htoztqh7klig', '19e25cf7-ba21-4468-b932-6bf0b61c9974'),
	('00000000-0000-0000-0000-000000000000', 339, 'waunqwyhn5gv', '49047d6f-7976-4ee4-b79f-865480035f52', false, '2026-07-24 17:26:08.570608+00', '2026-07-24 17:26:08.570608+00', '2rh4pq6mordx', '19e25cf7-ba21-4468-b932-6bf0b61c9974'),
	('00000000-0000-0000-0000-000000000000', 2111, 'pv2kw47slv44', '24879a43-b402-4f88-82b6-44d66a67263b', false, '2026-07-28 12:10:34.580746+00', '2026-07-28 12:10:34.580746+00', NULL, 'cb137e6a-e8ca-4fec-a963-fb12b8070e96'),
	('00000000-0000-0000-0000-000000000000', 2112, 'ujclqvknhzfr', '24879a43-b402-4f88-82b6-44d66a67263b', false, '2026-07-28 12:10:34.677463+00', '2026-07-28 12:10:34.677463+00', NULL, '62d0a333-2f52-4736-857f-86cb4a88c9c1'),
	('00000000-0000-0000-0000-000000000000', 2108, 'bbbpfgnrt33d', '24879a43-b402-4f88-82b6-44d66a67263b', false, '2026-07-28 12:10:30.396006+00', '2026-07-28 12:10:30.396006+00', NULL, '8061bac0-f63a-411e-b62a-06cfc3d63f9a'),
	('00000000-0000-0000-0000-000000000000', 2109, 'dilw7ipatneu', '24879a43-b402-4f88-82b6-44d66a67263b', false, '2026-07-28 12:10:31.11741+00', '2026-07-28 12:10:31.11741+00', NULL, '20436a27-392b-405f-8399-587524500d8c'),
	('00000000-0000-0000-0000-000000000000', 2110, 'sn5dkazvi2dh', '24879a43-b402-4f88-82b6-44d66a67263b', false, '2026-07-28 12:10:32.404506+00', '2026-07-28 12:10:32.404506+00', NULL, '823a3b79-47da-4f4b-a049-d17b55a8838a'),
	('00000000-0000-0000-0000-000000000000', 2113, 'idukwmle44dq', '24879a43-b402-4f88-82b6-44d66a67263b', false, '2026-07-28 12:10:37.571342+00', '2026-07-28 12:10:37.571342+00', NULL, '106645a8-f68c-4a30-931a-5b00712a3bac'),
	('00000000-0000-0000-0000-000000000000', 2114, 'v2h6ch4fac7g', '24879a43-b402-4f88-82b6-44d66a67263b', false, '2026-07-28 12:10:38.004376+00', '2026-07-28 12:10:38.004376+00', NULL, 'f9876ace-11ea-4d30-93eb-08042564926f'),
	('00000000-0000-0000-0000-000000000000', 2107, 'ztlpv7yffbrn', '24879a43-b402-4f88-82b6-44d66a67263b', false, '2026-07-28 12:10:29.710418+00', '2026-07-28 12:10:29.710418+00', NULL, '87d8efb5-ce98-413d-9065-ddc349ed5939'),
	('00000000-0000-0000-0000-000000000000', 2115, 'n6lcqxt4lu3p', '24879a43-b402-4f88-82b6-44d66a67263b', false, '2026-07-28 12:10:39.554891+00', '2026-07-28 12:10:39.554891+00', NULL, '67706688-8bf0-40b5-97f1-d4f4740b0b38'),
	('00000000-0000-0000-0000-000000000000', 2117, '5z6ejuoqzooa', '24879a43-b402-4f88-82b6-44d66a67263b', false, '2026-07-28 12:10:43.001432+00', '2026-07-28 12:10:43.001432+00', NULL, '74cae454-02d9-4209-8903-7a49b7d6673b'),
	('00000000-0000-0000-0000-000000000000', 2118, 'drvbjpnlvyny', '24879a43-b402-4f88-82b6-44d66a67263b', false, '2026-07-28 12:10:43.389417+00', '2026-07-28 12:10:43.389417+00', NULL, '1f97f4d5-d478-4ce5-acca-087ca65a16f4'),
	('00000000-0000-0000-0000-000000000000', 2479, 'w2ev3hchktyy', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:39:38.731007+00', '2026-07-28 13:39:38.731007+00', NULL, 'a55e2f43-167b-4617-a5d4-282e46039968'),
	('00000000-0000-0000-0000-000000000000', 2116, 'qj2pjvnhpmgt', '24879a43-b402-4f88-82b6-44d66a67263b', false, '2026-07-28 12:10:40.267287+00', '2026-07-28 12:10:40.267287+00', NULL, 'd66b5e90-76cf-4e3e-b02a-bc21c7fe2be3'),
	('00000000-0000-0000-0000-000000000000', 2119, 'hymypz26vpni', '24879a43-b402-4f88-82b6-44d66a67263b', false, '2026-07-28 12:10:44.787934+00', '2026-07-28 12:10:44.787934+00', NULL, '32a98e27-136e-4bc5-82dc-9596e40a441f'),
	('00000000-0000-0000-0000-000000000000', 2120, '2o4rrjreiats', '24879a43-b402-4f88-82b6-44d66a67263b', false, '2026-07-28 12:10:45.787929+00', '2026-07-28 12:10:45.787929+00', NULL, '48f881ec-2ff3-4608-aacb-55cff04ff847'),
	('00000000-0000-0000-0000-000000000000', 2474, 'diihrh6ybkcv', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:39:29.926183+00', '2026-07-28 13:39:29.926183+00', NULL, '24188082-6172-4b01-8c94-c36475d2a900'),
	('00000000-0000-0000-0000-000000000000', 2477, 'wvtkfditk7x7', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:39:31.830479+00', '2026-07-28 13:39:31.830479+00', NULL, '7713b648-6f20-4be9-a784-9ce1c852291d'),
	('00000000-0000-0000-0000-000000000000', 2478, 'og7uw7ddae3h', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:39:37.717953+00', '2026-07-28 13:39:37.717953+00', NULL, '37b69f2b-2159-42ae-8f2a-945cc8c260fd'),
	('00000000-0000-0000-0000-000000000000', 2475, 'ncjfatpuqtwy', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:39:30.769343+00', '2026-07-28 13:39:30.769343+00', NULL, '9e852e45-9e94-4b52-813f-8bcecf202468'),
	('00000000-0000-0000-0000-000000000000', 2476, 'fqczwfuthgkn', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:39:31.71313+00', '2026-07-28 13:39:31.71313+00', NULL, 'bd0c76aa-d4de-4635-896f-7d076f36c242'),
	('00000000-0000-0000-0000-000000000000', 2480, '4hu66kcol43p', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:39:44.826669+00', '2026-07-28 13:39:44.826669+00', NULL, 'bd5486cc-1a9e-46f5-ad7d-49ea72a3c9c0'),
	('00000000-0000-0000-0000-000000000000', 2482, 'xmvcubr4xjhr', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:39:46.81055+00', '2026-07-28 13:39:46.81055+00', NULL, 'c68540bc-dd48-4527-850b-f0738a0622db'),
	('00000000-0000-0000-0000-000000000000', 2481, '2msupfi6spwq', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:39:45.838785+00', '2026-07-28 13:39:45.838785+00', NULL, '47576d81-2fbb-4d05-9890-e62246e03e9f'),
	('00000000-0000-0000-0000-000000000000', 2483, 'ma3lbc6ji5yc', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:39:48.868251+00', '2026-07-28 13:39:48.868251+00', NULL, '53ae03f5-9325-47fc-b1c5-989db54b4570'),
	('00000000-0000-0000-0000-000000000000', 2486, 'wzpmlwss4rla', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:39:53.853009+00', '2026-07-28 13:39:53.853009+00', NULL, '871fb896-1d5b-466f-b133-3f5d50e1a25c'),
	('00000000-0000-0000-0000-000000000000', 2498, 'sv3q7b3i2cvr', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:31.655982+00', '2026-07-28 13:40:31.655982+00', NULL, '8ab2931f-5a3e-4517-bff6-04419ff94250'),
	('00000000-0000-0000-0000-000000000000', 2501, 'spli7dlxzwk2', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:41.688297+00', '2026-07-28 13:40:41.688297+00', NULL, '26badbac-8e5c-42c4-abbb-fa14f575e7f7'),
	('00000000-0000-0000-0000-000000000000', 2502, 'mvepbvngyz2a', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:43.475888+00', '2026-07-28 13:40:43.475888+00', NULL, 'edbc6bd1-e5ec-4d7c-bdfc-418e3be99516'),
	('00000000-0000-0000-0000-000000000000', 2503, 't2ckav6mf4bt', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:43.88215+00', '2026-07-28 13:40:43.88215+00', NULL, '31be3648-7c16-4665-bb01-39f51d4652c1'),
	('00000000-0000-0000-0000-000000000000', 2506, 'zbh5rssgq4j6', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:50.839044+00', '2026-07-28 13:40:50.839044+00', NULL, '2cbb3243-7f37-4be8-abac-f3a6f6980e8c'),
	('00000000-0000-0000-0000-000000000000', 2509, 'q2kcvwcty3b4', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:57.792145+00', '2026-07-28 13:40:57.792145+00', NULL, 'ba47acdc-ae6d-4e03-8479-ef15f84a5384'),
	('00000000-0000-0000-0000-000000000000', 2510, 'voacdmouzxzx', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:41:01.562954+00', '2026-07-28 13:41:01.562954+00', NULL, '40b7476d-56be-4ffb-a652-b7fa69ca07d4'),
	('00000000-0000-0000-0000-000000000000', 2511, 'trguqwalyfoy', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:41:03.022328+00', '2026-07-28 13:41:03.022328+00', NULL, '742bb3f8-8376-4cd1-94b8-3d8c1d393edc'),
	('00000000-0000-0000-0000-000000000000', 2512, 'lfn5pcooulqo', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:41:04.012707+00', '2026-07-28 13:41:04.012707+00', NULL, 'beb02c60-34ef-4f77-b76e-0633363256c3'),
	('00000000-0000-0000-0000-000000000000', 2520, '6q6j4mrqtzkm', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:41:18.357476+00', '2026-07-28 13:41:18.357476+00', NULL, '0a5670ae-a911-4d62-93a1-ca512acef2f5'),
	('00000000-0000-0000-0000-000000000000', 2525, 'pbkcsc6twsov', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:41:36.924379+00', '2026-07-28 13:41:36.924379+00', NULL, '2a2253ef-23f1-488a-9af4-83d986dedbb4'),
	('00000000-0000-0000-0000-000000000000', 2527, 'qvcpukxbsffs', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:41:52.466374+00', '2026-07-28 13:41:52.466374+00', NULL, 'ea0df803-2f1f-4b68-8bfd-8646f37eb1c5'),
	('00000000-0000-0000-0000-000000000000', 2530, 'bktckznox6sy', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:42:01.605632+00', '2026-07-28 13:42:01.605632+00', NULL, '5cc5dc61-878d-4672-9b42-93c6a8ed636a'),
	('00000000-0000-0000-0000-000000000000', 2531, 'yjytqbx6gul5', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:42:02.205062+00', '2026-07-28 13:42:02.205062+00', NULL, 'b5d163b6-2089-4d6e-9fe0-0963586fbba7'),
	('00000000-0000-0000-0000-000000000000', 2534, 'c62gufjrcepm', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:42:09.112212+00', '2026-07-28 13:42:09.112212+00', NULL, '15c39021-9c69-4c14-b3c4-e807c7f93ee1'),
	('00000000-0000-0000-0000-000000000000', 2535, 'kjdyhsvouqez', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:42:09.304471+00', '2026-07-28 13:42:09.304471+00', NULL, '68820722-dcff-4171-9909-f9145167a439'),
	('00000000-0000-0000-0000-000000000000', 2484, 'n6vbjxo34qvx', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:39:51.855085+00', '2026-07-28 13:39:51.855085+00', NULL, '43e80ec7-f090-4451-8d9a-f3eefdda82b8'),
	('00000000-0000-0000-0000-000000000000', 2485, '6mwo532sahva', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:39:53.087449+00', '2026-07-28 13:39:53.087449+00', NULL, '5a838219-15ff-40d2-920f-ff6491977b7e'),
	('00000000-0000-0000-0000-000000000000', 2487, 'j6xcx2lbmft7', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:39:58.928966+00', '2026-07-28 13:39:58.928966+00', NULL, 'c9f04984-26d4-4835-b216-8908f55307d3'),
	('00000000-0000-0000-0000-000000000000', 2490, '67yc6vd7pbll', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:06.396787+00', '2026-07-28 13:40:06.396787+00', NULL, 'fa6f069f-b8a4-4a68-8047-0d5277d73f63'),
	('00000000-0000-0000-0000-000000000000', 2491, 'a7ms6i4bifgx', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:07.014477+00', '2026-07-28 13:40:07.014477+00', NULL, 'd572fdce-7f5d-483d-8867-8e0ca7941ef2'),
	('00000000-0000-0000-0000-000000000000', 2496, 'cp7p5wz62qim', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:25.432421+00', '2026-07-28 13:40:25.432421+00', NULL, 'ef2c5f3f-3c05-4e2a-9917-073983d06269'),
	('00000000-0000-0000-0000-000000000000', 2497, 'uielqsdnnkmp', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:25.523923+00', '2026-07-28 13:40:25.523923+00', NULL, '3abeba10-77b9-4698-aac9-4447cf10b8bf'),
	('00000000-0000-0000-0000-000000000000', 2507, 'yigxcvyvzew4', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:55.755362+00', '2026-07-28 13:40:55.755362+00', NULL, 'cfa55879-66b3-4b8e-bc51-33668c0acf3f'),
	('00000000-0000-0000-0000-000000000000', 2488, '5dcshcwj5vh6', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:00.920964+00', '2026-07-28 13:40:00.920964+00', NULL, '9b368e06-69fd-43d2-be97-3aeb4aa9f102'),
	('00000000-0000-0000-0000-000000000000', 2493, 'miim6fqdzfan', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:13.582892+00', '2026-07-28 13:40:13.582892+00', NULL, '6cf4c6ac-8019-45fe-8c17-b2af54c66cd8'),
	('00000000-0000-0000-0000-000000000000', 2494, '2pjtymu5q7cy', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:16.307515+00', '2026-07-28 13:40:16.307515+00', NULL, 'ae1396f3-e16a-4cfd-8bf7-7082a3657fea'),
	('00000000-0000-0000-0000-000000000000', 2495, 'pkvwknqhsayd', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:18.893268+00', '2026-07-28 13:40:18.893268+00', NULL, '369c0e4f-2e14-45af-ac76-a2d32d232048'),
	('00000000-0000-0000-0000-000000000000', 2515, 'yxfest237uw7', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:41:09.865731+00', '2026-07-28 13:41:09.865731+00', NULL, '175b8da9-9690-4234-9053-d7fa8926fbe5'),
	('00000000-0000-0000-0000-000000000000', 2519, '57xthnrqunfv', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:41:16.867693+00', '2026-07-28 13:41:16.867693+00', NULL, '60a8b3ae-8f99-4cea-9e04-2e01f120a382'),
	('00000000-0000-0000-0000-000000000000', 2521, 'd6quepcu5woi', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:41:18.961173+00', '2026-07-28 13:41:18.961173+00', NULL, '78198abf-0c7c-457e-8120-ae534b06c733'),
	('00000000-0000-0000-0000-000000000000', 2522, 'mzvfzf577a5w', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:41:33.18735+00', '2026-07-28 13:41:33.18735+00', NULL, 'fe2b6329-ce76-49db-893e-d51788af8d7e'),
	('00000000-0000-0000-0000-000000000000', 2523, 'rumu33s4bfdb', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:41:34.444735+00', '2026-07-28 13:41:34.444735+00', NULL, 'e2005d8e-7033-4bfc-be80-e42d965730e1'),
	('00000000-0000-0000-0000-000000000000', 2524, 'rv54wy3c73rw', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:41:36.251606+00', '2026-07-28 13:41:36.251606+00', NULL, '3df7b1f5-eec1-4afb-baa8-641020c71120'),
	('00000000-0000-0000-0000-000000000000', 2526, '6xlwbvbxjkoc', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:41:51.326016+00', '2026-07-28 13:41:51.326016+00', NULL, '5232a394-5a96-419d-b2ce-00a26201971f'),
	('00000000-0000-0000-0000-000000000000', 2529, 'w4ycg5245bl3', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:41:54.918048+00', '2026-07-28 13:41:54.918048+00', NULL, 'b219ae0c-d9bc-4cfb-a6d5-963b15f7e484'),
	('00000000-0000-0000-0000-000000000000', 2532, 'x6aq3rqzd7cm', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:42:02.829244+00', '2026-07-28 13:42:02.829244+00', NULL, 'f47630b2-03d6-4dab-b603-7cc861b355fd'),
	('00000000-0000-0000-0000-000000000000', 2533, 'joikn52gesq2', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:42:04.766918+00', '2026-07-28 13:42:04.766918+00', NULL, '2bc90967-823f-462e-8b30-447ee6da7eea'),
	('00000000-0000-0000-0000-000000000000', 2537, 'flwlr4tjho5e', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:42:12.115723+00', '2026-07-28 13:42:12.115723+00', NULL, '5b56eac8-2cec-4edd-9f3f-49ba72a3fce7'),
	('00000000-0000-0000-0000-000000000000', 2540, 'u7k65yv5ujfm', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:42:17.280356+00', '2026-07-28 13:42:17.280356+00', NULL, '2c858f0b-69db-4845-89b7-9f9c74bf6ef0'),
	('00000000-0000-0000-0000-000000000000', 2541, 'mww56mgjt5ro', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:42:19.524132+00', '2026-07-28 13:42:19.524132+00', NULL, '347771ae-f447-4c87-a8d9-160329e45281'),
	('00000000-0000-0000-0000-000000000000', 2546, 'fjyvl72a7plf', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:42:30.997181+00', '2026-07-28 13:42:30.997181+00', NULL, 'e5842a39-a4cd-42da-b133-8344179863d0'),
	('00000000-0000-0000-0000-000000000000', 2547, '4zst4vnchxxd', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:42:31.915196+00', '2026-07-28 13:42:31.915196+00', NULL, 'cbeff701-4826-4c54-aca8-f2a165b318c2'),
	('00000000-0000-0000-0000-000000000000', 2489, 'c6osqnsguh53', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:02.282786+00', '2026-07-28 13:40:02.282786+00', NULL, '6c84e71f-747c-4e1c-ac08-79315866b621'),
	('00000000-0000-0000-0000-000000000000', 2492, 'bd4boggo2iuv', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:09.368851+00', '2026-07-28 13:40:09.368851+00', NULL, '6676d17f-c97c-4a25-9c6f-047a1c5f168f'),
	('00000000-0000-0000-0000-000000000000', 2499, 'vfy6xfv6v7ua', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:34.860063+00', '2026-07-28 13:40:34.860063+00', NULL, '968aba85-fef8-438a-8b3c-1b388c177a5d'),
	('00000000-0000-0000-0000-000000000000', 2500, 'h7vx4cok5cfq', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:36.734531+00', '2026-07-28 13:40:36.734531+00', NULL, '466a5877-414d-48ec-ab5b-09fb04eed9f0'),
	('00000000-0000-0000-0000-000000000000', 2504, 'wfmq7g5orknk', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:48.783026+00', '2026-07-28 13:40:48.783026+00', NULL, 'c09f4b25-b294-4a8b-a1b8-1c24eadee8e4'),
	('00000000-0000-0000-0000-000000000000', 2505, 'ola7nr2aqwmc', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:50.095326+00', '2026-07-28 13:40:50.095326+00', NULL, '834dcd21-b5b7-4429-a252-e64b9f7b8258'),
	('00000000-0000-0000-0000-000000000000', 2513, '7sjfamni7qle', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:41:04.882657+00', '2026-07-28 13:41:04.882657+00', NULL, 'd1d802ad-ba5b-4b3d-b4e8-dead32067b4a'),
	('00000000-0000-0000-0000-000000000000', 2517, 'bwbstguhngar', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:41:11.931873+00', '2026-07-28 13:41:11.931873+00', NULL, 'a53e2116-149c-41c2-81dd-3f9f07f48e34'),
	('00000000-0000-0000-0000-000000000000', 2538, '5sjj5erlrg2v', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:42:16.386533+00', '2026-07-28 13:42:16.386533+00', NULL, '4600d9a5-fe55-42e9-a9cb-70c4d1fb24d8'),
	('00000000-0000-0000-0000-000000000000', 2539, 'kkh3va4dqep3', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:42:16.506524+00', '2026-07-28 13:42:16.506524+00', NULL, '4d9124d8-7860-42ae-ae21-ec7f7989f984'),
	('00000000-0000-0000-0000-000000000000', 2542, 'p7yqaawmytzx', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:42:23.634656+00', '2026-07-28 13:42:23.634656+00', NULL, '92ff3d0c-ac89-4120-aa5d-d7cb02a80e94'),
	('00000000-0000-0000-0000-000000000000', 2543, 'n6hxvas3rsan', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:42:24.028035+00', '2026-07-28 13:42:24.028035+00', NULL, '158a42f3-9e33-4a4c-a576-1c04dc9d2489'),
	('00000000-0000-0000-0000-000000000000', 2545, 'w6aaawey54vm', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:42:26.833051+00', '2026-07-28 13:42:26.833051+00', NULL, '32b48048-c047-4003-825b-3b69cdaa8b89'),
	('00000000-0000-0000-0000-000000000000', 2548, 'qykxyru4yeim', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:42:41.667302+00', '2026-07-28 13:42:41.667302+00', NULL, '0b83ca47-0747-4a6c-8c6f-4b584ad21e2f'),
	('00000000-0000-0000-0000-000000000000', 2508, 'jcpabbqssg7l', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:40:56.986362+00', '2026-07-28 13:40:56.986362+00', NULL, '2e6301d4-06f4-45bc-877c-5dd34be58767'),
	('00000000-0000-0000-0000-000000000000', 2514, 'dcm627kehext', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:41:08.574567+00', '2026-07-28 13:41:08.574567+00', NULL, 'f1b34a58-223b-4f48-baae-45cfe65ac539'),
	('00000000-0000-0000-0000-000000000000', 2516, 'vddmtgsm7vc2', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:41:11.101595+00', '2026-07-28 13:41:11.101595+00', NULL, '19c6b14b-404b-4c17-b780-7ad0015a505a'),
	('00000000-0000-0000-0000-000000000000', 2518, 'dedvz53dnlvc', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:41:15.620767+00', '2026-07-28 13:41:15.620767+00', NULL, 'e7c5f8b1-5e5a-4af5-8602-9137e9130128'),
	('00000000-0000-0000-0000-000000000000', 2528, 'fcbhljni2tzb', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:41:54.382445+00', '2026-07-28 13:41:54.382445+00', NULL, '6b4e7c39-84d9-4bb2-a123-f32fc2aca3c2'),
	('00000000-0000-0000-0000-000000000000', 2536, '2tc3lctbzo5i', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:42:09.944398+00', '2026-07-28 13:42:09.944398+00', NULL, 'f3699643-2e2e-41fc-bc6f-cf47fd688499'),
	('00000000-0000-0000-0000-000000000000', 2544, 'nem3ej5evir2', '11eb1389-f28d-4e34-aa5b-9909e382b328', false, '2026-07-28 13:42:24.662351+00', '2026-07-28 13:42:24.662351+00', NULL, 'c52fe9b7-0796-475b-8ae5-8ca335a09559'),
	('00000000-0000-0000-0000-000000000000', 2553, 'kp2els2o2ccw', '17f90e39-a66e-41db-a994-622c9795464c', false, '2026-07-29 01:38:17.27875+00', '2026-07-29 01:38:17.27875+00', NULL, '8ac83f73-a946-4d4e-9bb0-1cdde79ae61d');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."schools" ("id", "name", "address", "contact_email", "subscription_status", "created_by", "created_at", "updated_at", "slug", "is_active", "deleted_at", "city", "state", "postal_code", "contact_phone", "website", "timezone", "subscription_expires_at") VALUES
	('12b09747-7391-4811-bc22-db7eebbb12c1', 'RISE Program', NULL, NULL, 'active', NULL, '2026-07-06 17:35:33.005226+00', '2026-07-06 17:35:33.005226+00', NULL, true, NULL, NULL, NULL, NULL, NULL, NULL, 'America/Chicago', NULL),
	('11ab99a1-0f9d-4f9b-813e-d88a59e3f5d7', 'ASCYN PRO Pilot School', NULL, NULL, 'trial', NULL, '2026-07-12 06:50:36.749942+00', '2026-07-12 06:50:36.749942+00', NULL, true, NULL, NULL, NULL, NULL, NULL, NULL, 'America/Chicago', NULL);


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "email", "full_name", "role", "school_id", "barber_shop_name", "mentor_name", "avatar_url", "created_at", "updated_at", "approval_status", "is_disabled", "approved_by", "approved_at", "requires_password_change") VALUES
	('cbf437c3-fd62-4924-b3bb-5440cfbe8fe2', 'gabebot24@gmail.com', 'gabe bot', 'student', NULL, NULL, NULL, NULL, '2026-06-09 16:54:38.749137+00', '2026-06-09 16:54:38.749137+00', 'pending', false, NULL, NULL, false),
	('551936c2-c3fe-46fc-b76f-09ac6996854b', 'agabe510@gmail.com', 'gabriel arcaina', 'student', NULL, NULL, NULL, NULL, '2026-06-19 16:02:26.472315+00', '2026-06-19 16:02:26.472315+00', 'pending', false, NULL, NULL, false),
	('135e94df-f14e-4633-a5bf-1416d13357b0', 'garcaina510@gmail.com', 'tests student ', 'student', NULL, NULL, NULL, NULL, '2026-06-20 11:02:47.682989+00', '2026-06-20 11:02:47.682989+00', 'pending', false, NULL, NULL, false),
	('e033845b-d182-435f-975d-983174ff20e5', 'coark2015@gmail.com', 'Test Student', 'student', NULL, NULL, NULL, NULL, '2026-07-02 21:47:39.536507+00', '2026-07-02 21:47:39.536507+00', 'pending', false, NULL, NULL, false),
	('a52a5b46-4ad1-4f63-9fed-e601b200f30b', 'gabebot24+beta1@gmail.com', 'Test Student', 'student', NULL, NULL, NULL, NULL, '2026-07-06 13:17:30.432025+00', '2026-07-06 13:17:30.432025+00', 'pending', false, NULL, NULL, false),
	('bc34afaa-ded5-4861-848d-5393423e9f33', 'gabebot24+beta2@gmail.com', 'Test student', 'student', NULL, NULL, NULL, NULL, '2026-07-06 18:40:22.933581+00', '2026-07-06 18:40:22.933581+00', 'pending', false, NULL, NULL, false),
	('49047d6f-7976-4ee4-b79f-865480035f52', 'gabebot24+student@gmail.com', 'Pilot Student', 'student', '11ab99a1-0f9d-4f9b-813e-d88a59e3f5d7', NULL, NULL, NULL, '2026-07-12 03:07:03.496812+00', '2026-07-12 06:50:37.015719+00', 'approved', false, NULL, '2026-07-12 03:19:09.575+00', false),
	('6a2bcb89-d37e-4d3c-af1f-a1809d323555', 'gabebot24+instructor@gmail.com', 'Pilot Instructor', 'instructor', '11ab99a1-0f9d-4f9b-813e-d88a59e3f5d7', NULL, NULL, NULL, '2026-07-12 03:13:31.844115+00', '2026-07-12 06:50:37.015719+00', 'approved', false, NULL, '2026-07-12 03:19:10.103+00', false),
	('17f90e39-a66e-41db-a994-622c9795464c', 'pending-deep-1785289096741@ascyn-audit.test', 'pending-deep-1785289096741@ascyn-audit.test', 'student', NULL, NULL, NULL, NULL, '2026-07-29 01:38:16.662162+00', '2026-07-29 01:38:16.776275+00', 'pending', false, NULL, NULL, false),
	('24879a43-b402-4f88-82b6-44d66a67263b', 'student@ascyn-smoke.test', 'Test Student ', 'student', '11ab99a1-0f9d-4f9b-813e-d88a59e3f5d7', NULL, NULL, NULL, '2026-06-26 15:58:12.682023+00', '2026-07-21 13:10:57.48869+00', 'approved', false, NULL, '2026-07-21 01:35:06.210829+00', false),
	('261fcd4c-bbfe-4957-9efd-0dfca6cccdc1', 'ascynproofficial@gmail.com', 'ASCYN PRO Administrator', 'admin', NULL, NULL, NULL, NULL, '2026-07-31 13:00:29.661401+00', '2026-07-31 13:00:29.873563+00', 'approved', false, NULL, '2026-07-31 13:00:30.378+00', false),
	('6de24902-075d-4803-a025-3e1d555df542', 'patty.pineda.drl@gmail.com', 'Patty Pineda', 'student', '12b09747-7391-4811-bc22-db7eebbb12c1', NULL, NULL, NULL, '2026-07-23 10:23:42.454403+00', '2026-07-23 10:23:42.626997+00', 'approved', false, NULL, NULL, true),
	('144ab7dd-b1e2-4ff6-9b16-8fc5357a0d8d', 'tessamyers2911@gmail.com', 'Tessa Myers', 'instructor', '12b09747-7391-4811-bc22-db7eebbb12c1', NULL, NULL, NULL, '2026-07-23 17:13:03.857845+00', '2026-07-23 17:40:52.466759+00', 'approved', false, NULL, NULL, true),
	('669e0110-6a4a-4fa3-aeb1-dd774ae96b32', 'ascyn-qa-instructor-test@ascynpro.test', 'QA Test Instructor', 'instructor', '12b09747-7391-4811-bc22-db7eebbb12c1', NULL, NULL, NULL, '2026-07-24 11:38:10.477511+00', '2026-07-24 11:38:20.405259+00', 'approved', false, NULL, NULL, false),
	('534bc5e4-6151-4d49-83d6-78966cc0aaba', 'phase2-audit-1784906620@ascynpro.local', 'phase2-audit-1784906620@ascynpro.local', 'student', NULL, NULL, NULL, NULL, '2026-07-24 15:23:41.351523+00', '2026-07-24 15:23:41.351523+00', 'pending', false, NULL, NULL, false),
	('11eb1389-f28d-4e34-aa5b-9909e382b328', 'instructor@ascyn-smoke.test', 'Test Instructor', 'instructor', NULL, NULL, NULL, NULL, '2026-06-26 15:59:19.068046+00', '2026-07-28 05:31:14.706498+00', 'approved', false, NULL, NULL, false);


--
-- Data for Name: assessment_rubrics; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: attendance_records; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: attendance_audit_log; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: attendance_corrections; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: attendance_notes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: background_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: backup_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."backup_status" ("id", "last_backup_at", "status", "backup_location", "restore_ready", "notes", "updated_at", "updated_by") VALUES
	('10ede91c-91b1-4432-87f8-159354e25d76', NULL, 'unknown', NULL, false, 'Backup integration not configured. This row is managed by external backup tooling.', '2026-07-23 15:05:06.731585+00', NULL);


--
-- Data for Name: beta_agreements; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."beta_agreements" ("id", "user_id", "tester_name", "tester_email", "agreement_version", "accepted_at", "created_at") VALUES
	('86ea15d6-8ceb-484a-abf3-ec819505db2b', '49047d6f-7976-4ee4-b79f-865480035f52', 'gabebot24 student', 'gabebot24+student@gmail.com', 'v1.0', '2026-07-13 05:24:51.804+00', '2026-07-12 06:43:56.609102+00'),
	('18c23935-536b-4eaa-832f-20653575c120', '6a2bcb89-d37e-4d3c-af1f-a1809d323555', 'gabebot24 instructor', 'gabebot24+instructor@gmail.com', 'v1.0', '2026-07-13 05:24:51.907+00', '2026-07-12 06:43:57.60503+00'),
	('0852c95e-dd94-4207-89b9-59ee231fdd12', '24879a43-b402-4f88-82b6-44d66a67263b', 'Test Student', 'student@ascyn-smoke.test', 'v1.0', '2026-07-21 01:38:37.115+00', '2026-07-21 01:38:36.803328+00'),
	('94f3c236-08d8-4252-8286-1f3e845a3b2e', NULL, 'Deploy Test Student', 'ping-deploy-test-d2765faf@ascyn.pro', 'v1.0', '2026-07-25 13:24:57.775676+00', '2026-07-25 13:24:57.954726+00'),
	('01a77e5c-ad1c-463c-9ec2-1b005cdf0a30', NULL, 'gabebot24 admin-test', 'gabebot24+admin-test@ascynpro.test', 'v1.0', '2026-07-13 05:24:52.055+00', '2026-07-12 12:48:59.824646+00');


--
-- Data for Name: beta_feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: programs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."programs" ("id", "school_id", "name", "description", "required_hours", "required_assessments", "required_practicals", "duration_weeks", "is_active", "deleted_at", "created_at", "updated_at") VALUES
	('9becb774-9fcf-45b8-bdf9-c6cb779afe57', '12b09747-7391-4811-bc22-db7eebbb12c1', 'Barbering', 'RISE Program barbering curriculum — 1,200-hour professional licensing track.', 1200, 10, 20, 40, true, NULL, '2026-07-23 17:03:03.316821+00', '2026-07-23 17:03:03.316821+00');


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."students" ("id", "profile_id", "school_id", "student_number", "enrollment_date", "expected_graduation_date", "total_hours_completed", "is_active", "deleted_at", "created_at", "updated_at") VALUES
	('ec471f62-8268-449b-bd1b-db533d8f5c28', '6de24902-075d-4803-a025-3e1d555df542', '12b09747-7391-4811-bc22-db7eebbb12c1', 'RISE-001', '2026-07-23', '2027-04-29', 0, true, NULL, '2026-07-23 17:03:03.316821+00', '2026-07-23 17:03:03.316821+00');


--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."enrollments" ("id", "student_id", "program_id", "start_date", "expected_end_date", "status", "notes", "is_active", "deleted_at", "created_at", "updated_at") VALUES
	('1d64b91b-ba18-4f7a-854d-eca9d12f551e', 'ec471f62-8268-449b-bd1b-db533d8f5c28', '9becb774-9fcf-45b8-bdf9-c6cb779afe57', '2026-07-23', '2027-04-29', 'active', 'First RISE Program student pilot (migrated from auth metadata).', true, NULL, '2026-07-23 17:03:03.316821+00', '2026-07-23 17:03:03.316821+00');


--
-- Data for Name: feature_flags; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: grade_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: grades; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: hour_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: instructor_notes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: instructors; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."instructors" ("id", "profile_id", "school_id", "license_number", "bio", "hire_date", "specialization", "is_active", "deleted_at", "created_at", "updated_at") VALUES
	('dffe72bd-fcd7-4a13-bdd4-abbcba616357', '144ab7dd-b1e2-4ff6-9b16-8fc5357a0d8d', '12b09747-7391-4811-bc22-db7eebbb12c1', NULL, NULL, '2026-07-23', NULL, true, NULL, '2026-07-23 17:13:05.737591+00', '2026-07-23 17:13:05.943+00');


--
-- Data for Name: maintenance_mode; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."maintenance_mode" ("id", "enabled", "message", "allowed_roles", "updated_at", "updated_by") VALUES
	('cec9916e-5417-4991-957e-48352b38e267', false, 'ASCYN PRO is undergoing scheduled maintenance. Please check back soon.', '{platform_super_admin}', '2026-07-23 15:05:06.731585+00', NULL);


--
-- Data for Name: missed_questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."missed_questions" ("id", "user_id", "question_id", "quiz_id", "question_text", "correct_answer", "student_answer", "explanation", "chapter_id", "chapter_number", "category", "times_missed", "missed_at", "retaken_at", "created_at", "updated_at") VALUES
	('43c7060b-b3c8-4dba-a47a-c069541de7f9', '24879a43-b402-4f88-82b6-44d66a67263b', 'qq-1-021', 'quiz-1', 'What event in 1096 led to the formation of the first barber guild in France?', 'A. The Archbishop of Rouen prohibited clergy from wearing beards', 'B. A royal decree requiring all men to be clean-shaven', 'The Archbishop of Rouen prohibited clergy from wearing beards, which spurred the organization of barbers into a formal guild.', 'ch-1', 1, 'History & Professionalism', 1, '2026-07-21 03:14:06.651+00', NULL, '2026-07-21 03:14:06.238847+00', '2026-07-21 03:14:06.238847+00'),
	('4fe15e1e-bb5b-4772-b000-965d5396a8bc', '24879a43-b402-4f88-82b6-44d66a67263b', 'qq-1-002', 'quiz-1', 'Archaeological evidence supports barbering as one of the oldest professions. Which of the following is NOT mentioned as evidence?', 'D. Ancient coins', 'C. Tomb excavations', 'Evidence includes painted pottery, early sculptures, burial mound artifacts, written records, and tomb excavations. Ancient coins are not mentioned as barbering evidence.', 'ch-1', 1, 'History & Professionalism', 1, '2026-07-21 03:14:06.651+00', NULL, '2026-07-21 03:14:06.238847+00', '2026-07-21 03:14:06.238847+00'),
	('956a6e6f-d143-40d2-b0f4-57a6a24d7b74', '24879a43-b402-4f88-82b6-44d66a67263b', 'qq-1-017', 'quiz-1', 'Why did Egyptian priests shave their entire bodies every third day?', 'C. As a religious purification practice before rituals', 'B. To show allegiance to the pharaoh', 'Daily full-body shaving was a religious purification practice to maintain spiritual cleanliness before performing rituals.', 'ch-1', 1, 'History & Professionalism', 1, '2026-07-21 03:14:06.651+00', NULL, '2026-07-21 03:14:06.238847+00', '2026-07-21 03:14:06.238847+00'),
	('f2fcd65c-1b35-42ed-b7a8-ff73b90fb09c', '24879a43-b402-4f88-82b6-44d66a67263b', 'qq-1-020', 'quiz-1', 'What did Pythagoras believe about the relationship between hair and the brain?', 'A. Hair was the source of the brain''s inspiration', 'D. Hair blocked spiritual energy', 'Pythagoras believed hair was the source of the brain''s inspiration and that cutting it reduced intellectual capacity.', 'ch-1', 1, 'History & Professionalism', 1, '2026-07-21 03:14:06.651+00', NULL, '2026-07-21 03:14:06.238847+00', '2026-07-21 03:14:06.238847+00'),
	('452597dc-efc0-4dfe-9439-7831351e84e7', '24879a43-b402-4f88-82b6-44d66a67263b', 'qq-1-013', 'quiz-1', 'What did the Chinese queue hairstyle represent under Manchu rule?', 'D. Political submission and obedience to the ruling government', 'C. Wealth and merchant status', 'The forced queue hairstyle symbolized political submission and obedience to the ruling Manchu government.', 'ch-1', 1, 'History & Professionalism', 1, '2026-07-21 03:14:06.651+00', NULL, '2026-07-21 03:14:06.238847+00', '2026-07-21 03:14:06.238847+00');


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: owner_notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pilot_inquiries; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."pilot_inquiries" ("id", "school_name", "contact_name", "email", "phone", "program_type", "cohort_size", "preferred_onboarding_date", "message", "status", "admin_notes", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "referral_url", "created_at", "updated_at", "start_date", "ip_address", "user_agent", "is_test", "notes") VALUES
	('375da468-4704-411b-b949-8e71561e77f3', 'ASCYN PRO Production Test School', 'Ping Production Test', 'ping+prodtest@ascynpro.test', '555-0100', 'Barbering', 12, NULL, 'This is a production test submission from Ping. Please delete after verification.', 'new', NULL, 'ping_test', 'api', 'prod_verification_2026_07_13', NULL, NULL, NULL, '2026-07-13 19:01:47.292663+00', '2026-07-13 19:01:47.292663+00', '2026-09-01', '72.202.185.98', 'curl/8.5.0', true, NULL),
	('dcd7f70c-84a1-4ae8-a0a0-429c1b3b5662', 'Rise program', 'Gabriel o Arcaina', 'agabe510@gmail.com', '9044809422', 'Barbering', 1, NULL, 'Test test', 'new', NULL, 'oklahoma_board', 'qr_code', 'board_demo_2026', NULL, NULL, NULL, '2026-07-13 19:07:08.101605+00', '2026-07-13 19:07:08.101605+00', '2026-08-10', '98.175.175.7', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', false, NULL),
	('1ab57999-8e95-47e7-9c34-420012e0c68c', 'Final Production Test', 'Ping Final Test', 'ping+finaltest@ascynpro.test', '555-0200', 'Barbering', 5, NULL, 'Final production verification test. Please delete after confirmation.', 'new', NULL, 'ping_final_test', 'api', 'prod_final_verification', NULL, NULL, NULL, '2026-07-13 19:54:16.286886+00', '2026-07-13 19:54:16.286886+00', '2026-10-01', '72.202.185.98', 'curl/8.5.0', true, NULL),
	('f0d6934a-5883-4d82-a7f3-f8c170e6f384', 'QA Manual School', 'QA Manual', 'qa+test.manual@ascynpro.test', '555-0200', 'Barbering', 5, NULL, 'Manual QA', 'new', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-07-14 00:55:07.384119+00', '2026-07-14 00:55:07.384119+00', NULL, '72.202.185.98', 'curl/8.5.0', true, NULL),
	('7b44dd8e-e07f-4bb6-876d-85ada98df8dd', 'Malenny acadamy', 'Malenny Saenz', 'malennysaenz@gmail.com', '4059850600', 'Barbering', NULL, NULL, NULL, 'new', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-07-22 20:48:13.92125+00', '2026-07-22 20:48:13.92125+00', NULL, '72.202.185.98', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', false, NULL);


--
-- Data for Name: quiz_attempts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."quiz_attempts" ("id", "user_id", "quiz_id", "score", "total_questions", "percentage", "answers_json", "completed_at", "created_at", "updated_at") VALUES
	('444dc5c4-d403-4328-83c5-0c3b871527ef', '24879a43-b402-4f88-82b6-44d66a67263b', 'quiz-1', 25, 30, 83, '{"qq-1-001": "a", "qq-1-002": "d", "qq-1-003": "c", "qq-1-004": "c", "qq-1-005": "c", "qq-1-006": "d", "qq-1-007": "d", "qq-1-008": "d", "qq-1-009": "d", "qq-1-010": "c", "qq-1-011": "c", "qq-1-012": "c", "qq-1-013": "d", "qq-1-014": "c", "qq-1-015": "a", "qq-1-016": "c", "qq-1-017": "b", "qq-1-018": "c", "qq-1-019": "c", "qq-1-020": "a", "qq-1-021": "a", "qq-1-022": "c", "qq-1-023": "c", "qq-1-024": "c", "qq-1-025": "c", "qq-1-026": "c", "qq-1-027": "b", "qq-1-028": "c", "qq-1-029": "c", "qq-1-030": "c"}', '2026-07-21 03:14:05.997+00', '2026-07-21 03:14:05.846994+00', '2026-07-21 03:14:05.846994+00');


--
-- Data for Name: school_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: security_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."security_logs" ("id", "type", "user_id", "email", "role", "school_id", "resource", "resource_id", "action", "result", "reason", "metadata", "user_agent", "ip_address", "created_at") VALUES
	('86025908-e487-469e-9692-6176e1ffa8a2', 'failed_login', NULL, 'gabebot24+instructor@gmail.com', NULL, NULL, '/login', NULL, 'signInWithPassword', 'failure', 'Invalid login credentials', '{}', NULL, NULL, '2026-07-21 01:35:40.884567+00'),
	('c305800c-cae6-4d2d-a089-132a18a76797', 'logout', '24879a43-b402-4f88-82b6-44d66a67263b', 'student@ascyn-smoke.test', NULL, NULL, '/logout', NULL, 'signOut', 'success', 'User signed out', '{}', NULL, NULL, '2026-07-21 02:29:14.95508+00'),
	('27a6416c-ef0c-4eb1-91d6-13a618886306', 'failed_login', NULL, 'gabebot24+student@gmail.com', NULL, NULL, '/login', NULL, 'signInWithPassword', 'failure', 'Invalid login credentials', '{}', NULL, NULL, '2026-07-21 02:29:23.594858+00'),
	('85b7dfa4-bed4-4dc5-a655-311d599e9959', 'logout', '24879a43-b402-4f88-82b6-44d66a67263b', 'student@ascyn-smoke.test', NULL, NULL, '/logout', NULL, 'signOut', 'success', 'User signed out', '{}', NULL, NULL, '2026-07-21 03:20:15.650703+00'),
	('4347956b-8824-4907-8c85-843b22d9fb8e', 'logout', '24879a43-b402-4f88-82b6-44d66a67263b', 'student@ascyn-smoke.test', NULL, NULL, '/logout', NULL, 'signOut', 'success', 'User signed out', '{}', NULL, NULL, '2026-07-21 05:14:54.050813+00'),
	('9b4793fe-e52f-477f-80f7-cea8602eafe4', 'failed_login', NULL, 'gabebot24+instructor@gmail.com', NULL, NULL, '/login', NULL, 'signInWithPassword', 'failure', 'Invalid login credentials', '{}', NULL, NULL, '2026-07-21 05:15:31.192364+00'),
	('dbd46122-ae97-4bc9-ab7c-6368b529a28f', 'failed_login', NULL, 'gabebot24+instructor@gmail.com', NULL, NULL, '/login', NULL, 'signInWithPassword', 'failure', 'Invalid login credentials', '{}', NULL, NULL, '2026-07-21 05:15:57.055978+00'),
	('326926df-1d7d-4c42-8e2c-68f5231cb17c', 'failed_login', NULL, 'instructor@ascyn-smoke.test', NULL, NULL, '/login', NULL, 'signInWithPassword', 'failure', 'Invalid login credentials', '{}', NULL, NULL, '2026-07-21 05:18:52.557303+00'),
	('6e7e879c-6622-440f-8527-ade88bf6fc0a', 'logout', '24879a43-b402-4f88-82b6-44d66a67263b', 'student@ascyn-smoke.test', NULL, NULL, '/logout', NULL, 'signOut', 'success', 'User signed out', '{}', NULL, NULL, '2026-07-22 01:06:37.968782+00'),
	('4d840c8f-2999-4064-9cce-39d83a302446', 'failed_login', NULL, 'instructor@ascyn-smoke.test', NULL, NULL, '/login', NULL, 'signInWithPassword', 'failure', 'Invalid login credentials', '{}', NULL, NULL, '2026-07-22 01:07:05.334204+00'),
	('dbfd451b-3d28-4637-83da-01c032ad2798', 'failed_login', NULL, 'student@ascyn-smoke.test', NULL, NULL, '/login', NULL, 'signInWithPassword', 'failure', 'Invalid login credentials', '{}', NULL, NULL, '2026-07-24 11:36:30.197257+00'),
	('1d016424-b12d-40d2-bb9d-769985547991', 'logout', '24879a43-b402-4f88-82b6-44d66a67263b', 'student@ascyn-smoke.test', NULL, NULL, '/logout', NULL, 'signOut', 'success', 'User signed out', '{}', NULL, NULL, '2026-07-25 18:59:46.907385+00'),
	('ab4d3685-7c82-46dd-bfd0-bda3fd5d2d7b', 'logout', NULL, 'gabebot24+admin-test@ascynpro.test', NULL, NULL, '/logout', NULL, 'signOut', 'success', 'User signed out', '{}', NULL, NULL, '2026-07-22 01:02:36.04138+00'),
	('a46acc38-7949-4444-9ed5-537b3b260b71', 'logout', NULL, 'gabebot24+admin-test@ascynpro.test', NULL, NULL, '/logout', NULL, 'signOut', 'success', 'User signed out', '{}', NULL, NULL, '2026-07-22 01:08:28.517629+00'),
	('0db16f63-ff80-4721-ba1f-f1d7c10f3842', 'logout', NULL, 'gabebot24+admin-test@ascynpro.test', NULL, NULL, '/logout', NULL, 'signOut', 'success', 'User signed out', '{}', NULL, NULL, '2026-07-25 19:02:10.351329+00');


--
-- Data for Name: student_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."student_progress" ("id", "user_id", "chapter_id", "flashcards_completed", "quiz_completed", "best_quiz_score", "last_studied_at", "progress_percentage", "created_at", "updated_at") VALUES
	('ef958975-4f8a-4dba-9cfa-5ae33c3ab1bd', 'cbf437c3-fd62-4924-b3bb-5440cfbe8fe2', 'ch-1', true, true, 73, '2026-06-17 15:58:29.279+00', 100, '2026-06-16 05:34:53.236481+00', '2026-06-17 15:58:30.417638+00'),
	('cc1f56e3-da1e-4b3b-81d6-7bbc80c0494a', '551936c2-c3fe-46fc-b76f-09ac6996854b', 'ch-1', true, false, 20, '2026-06-20 10:50:58.258+00', 50, '2026-06-20 10:25:20.985527+00', '2026-06-20 10:51:00.148925+00'),
	('a04558ec-a338-417a-9f48-1bebead96b97', '135e94df-f14e-4633-a5bf-1416d13357b0', 'ch-1', true, true, 80, '2026-06-20 18:02:55.801+00', 100, '2026-06-20 11:23:42.502174+00', '2026-06-20 18:02:56.085823+00'),
	('2671cb95-e9c1-4486-82be-71c9129957eb', '135e94df-f14e-4633-a5bf-1416d13357b0', 'ch-15', true, false, 26, '2026-06-22 02:44:00.686+00', 50, '2026-06-22 02:39:37.744394+00', '2026-06-22 02:44:02.235073+00'),
	('aac3d6a8-7a2d-4f69-b79e-f7b6d529fcaa', 'e033845b-d182-435f-975d-983174ff20e5', 'ch-1', true, true, 27, '2026-07-02 21:54:54.227+00', 100, '2026-07-02 21:52:37.421481+00', '2026-07-02 21:54:53.957963+00'),
	('4eb62b14-05b2-4e73-8293-fc92564d2c7e', '49047d6f-7976-4ee4-b79f-865480035f52', 'ch-16', true, false, 40, '2026-07-12 18:14:27.819+00', 50, '2026-07-12 18:12:51.243001+00', '2026-07-12 18:14:27.444903+00'),
	('4ab3c474-fc80-4136-88c7-2792d0f2124f', '49047d6f-7976-4ee4-b79f-865480035f52', 'ch-2', true, false, NULL, '2026-07-13 01:09:46.613+00', 50, '2026-07-13 01:09:46.944956+00', '2026-07-13 01:09:46.613+00'),
	('614e0dee-1e36-4cbc-bdfe-a1fbef6304a8', '49047d6f-7976-4ee4-b79f-865480035f52', 'ch-1', false, false, NULL, NULL, 10, '2026-07-14 00:41:34.468342+00', '2026-07-14 00:41:34.468342+00'),
	('b73d8226-5ed4-42f4-8a1b-a9268d60cc9a', '49047d6f-7976-4ee4-b79f-865480035f52', 'qa-auth-1783996370553', true, false, NULL, '2026-07-14 02:32:50.553+00', 50, '2026-07-14 02:32:50.491975+00', '2026-07-14 02:32:50.491975+00'),
	('94edcfee-d7d5-4050-a461-3a2bca812dc8', '24879a43-b402-4f88-82b6-44d66a67263b', 'ch-1', true, true, 83, '2026-07-21 03:14:06.549+00', 100, '2026-07-21 02:31:42.726679+00', '2026-07-21 03:14:06.114882+00'),
	('aea99063-c009-4abb-a653-650f264a3329', '24879a43-b402-4f88-82b6-44d66a67263b', 'ch-18', true, false, NULL, '2026-07-23 05:18:13.765+00', 50, '2026-07-23 05:18:14.113051+00', '2026-07-23 05:18:13.769+00'),
	('9f1404c8-3dfa-40ea-9346-5ca1af0846a1', '6de24902-075d-4803-a025-3e1d555df542', 'ch-1', false, false, NULL, NULL, 0, '2026-07-23 10:23:42.740874+00', '2026-07-23 10:23:42.740874+00'),
	('d873f22f-7404-4db2-b71c-d9ae13d417de', '6de24902-075d-4803-a025-3e1d555df542', 'ch-2', false, false, NULL, NULL, 0, '2026-07-23 10:23:42.740874+00', '2026-07-23 10:23:42.740874+00'),
	('f05c8427-caab-4f5c-b156-2fb33fefd750', '6de24902-075d-4803-a025-3e1d555df542', 'ch-3', false, false, NULL, NULL, 0, '2026-07-23 10:23:42.740874+00', '2026-07-23 10:23:42.740874+00'),
	('ec32f138-c4e5-4e10-964d-ed538d791bed', '6de24902-075d-4803-a025-3e1d555df542', 'ch-4', false, false, NULL, NULL, 0, '2026-07-23 10:23:42.740874+00', '2026-07-23 10:23:42.740874+00'),
	('f9546a8c-45eb-4e82-9dc2-9b468c68974b', '6de24902-075d-4803-a025-3e1d555df542', 'ch-5', false, false, NULL, NULL, 0, '2026-07-23 10:23:42.740874+00', '2026-07-23 10:23:42.740874+00'),
	('2da3855d-36b4-402e-a70c-f509b458bc63', '6de24902-075d-4803-a025-3e1d555df542', 'ch-6', false, false, NULL, NULL, 0, '2026-07-23 10:23:42.740874+00', '2026-07-23 10:23:42.740874+00'),
	('622a262a-cfa2-4681-a19d-12f11b9a924a', '6de24902-075d-4803-a025-3e1d555df542', 'ch-7', false, false, NULL, NULL, 0, '2026-07-23 10:23:42.740874+00', '2026-07-23 10:23:42.740874+00'),
	('f627dddb-8a44-4d6c-beb3-cd565ad68004', '6de24902-075d-4803-a025-3e1d555df542', 'ch-8', false, false, NULL, NULL, 0, '2026-07-23 10:23:42.740874+00', '2026-07-23 10:23:42.740874+00'),
	('3dd1bdee-1ce6-4ee4-9ca1-74d837239e0f', '6de24902-075d-4803-a025-3e1d555df542', 'ch-9', false, false, NULL, NULL, 0, '2026-07-23 10:23:42.740874+00', '2026-07-23 10:23:42.740874+00'),
	('659bcd39-8c06-4eee-8f8d-a60b21606022', '6de24902-075d-4803-a025-3e1d555df542', 'ch-10', false, false, NULL, NULL, 0, '2026-07-23 10:23:42.740874+00', '2026-07-23 10:23:42.740874+00'),
	('ab577d52-d865-4f73-b708-7dfdf782e275', '6de24902-075d-4803-a025-3e1d555df542', 'ch-11', false, false, NULL, NULL, 0, '2026-07-23 10:23:42.740874+00', '2026-07-23 10:23:42.740874+00'),
	('9c9af572-bde5-475b-af0c-0192872acf47', '6de24902-075d-4803-a025-3e1d555df542', 'ch-12', false, false, NULL, NULL, 0, '2026-07-23 10:23:42.740874+00', '2026-07-23 10:23:42.740874+00'),
	('8757713a-9f26-4dec-af9b-4805ddc0dc3c', '6de24902-075d-4803-a025-3e1d555df542', 'ch-13', false, false, NULL, NULL, 0, '2026-07-23 10:23:42.740874+00', '2026-07-23 10:23:42.740874+00'),
	('15e7c589-6b4c-44ba-b0c1-24cae421f195', '6de24902-075d-4803-a025-3e1d555df542', 'ch-14', false, false, NULL, NULL, 0, '2026-07-23 10:23:42.740874+00', '2026-07-23 10:23:42.740874+00'),
	('2fbc89a2-d720-4a79-ae96-4be88a79822b', '6de24902-075d-4803-a025-3e1d555df542', 'ch-15', false, false, NULL, NULL, 0, '2026-07-23 10:23:42.740874+00', '2026-07-23 10:23:42.740874+00'),
	('4654146f-d4ae-4859-a844-860b0b6f3177', '6de24902-075d-4803-a025-3e1d555df542', 'ch-16', false, false, NULL, NULL, 0, '2026-07-23 10:23:42.740874+00', '2026-07-23 10:23:42.740874+00'),
	('4976625d-887e-41d2-9c97-fe62b2ae871c', '6de24902-075d-4803-a025-3e1d555df542', 'ch-17', false, false, NULL, NULL, 0, '2026-07-23 10:23:42.740874+00', '2026-07-23 10:23:42.740874+00'),
	('09003afd-27ce-4379-9be7-bca11a22c620', '6de24902-075d-4803-a025-3e1d555df542', 'ch-18', false, false, NULL, NULL, 0, '2026-07-23 10:23:42.740874+00', '2026-07-23 10:23:42.740874+00'),
	('3d88f0c5-01d6-4f5e-96b6-9d8a145ef772', '6de24902-075d-4803-a025-3e1d555df542', 'ch-19', false, false, NULL, NULL, 0, '2026-07-23 10:23:42.740874+00', '2026-07-23 10:23:42.740874+00');


--
-- Data for Name: user_management_audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 2556, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict HqXFVx8CfcinW9ztOz2Zx1kY6PZ374s2zF6mTPMJM5BsjKQjaENAFOfxsgYnefw

RESET ALL;
