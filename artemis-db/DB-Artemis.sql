--
-- PostgreSQL database dump
--

\restrict gQTR5Van7YLBHI8lLS0ION6mKYwSHjWeHAh3QyGLZpWR1Zbcy59oBfVT5YksTDG

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-08-10 14:45:54

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 229 (class 1259 OID 16492)
-- Name: board_recipes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.board_recipes (
    board_id integer NOT NULL,
    recipe_id integer NOT NULL,
    saved_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.board_recipes OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16441)
-- Name: recipe_ingredients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipe_ingredients (
    id integer NOT NULL,
    recipe_id integer NOT NULL,
    quantity character varying(50) NOT NULL,
    unit character varying(50),
    name character varying(150) NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.recipe_ingredients OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16440)
-- Name: recipe_ingredients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recipe_ingredients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recipe_ingredients_id_seq OWNER TO postgres;

--
-- TOC entry 5102 (class 0 OID 0)
-- Dependencies: 223
-- Name: recipe_ingredients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recipe_ingredients_id_seq OWNED BY public.recipe_ingredients.id;


--
-- TOC entry 226 (class 1259 OID 16459)
-- Name: recipe_steps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipe_steps (
    id integer NOT NULL,
    recipe_id integer NOT NULL,
    step_number integer NOT NULL,
    instruction_text text NOT NULL
);


ALTER TABLE public.recipe_steps OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16458)
-- Name: recipe_steps_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recipe_steps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recipe_steps_id_seq OWNER TO postgres;

--
-- TOC entry 5103 (class 0 OID 0)
-- Dependencies: 225
-- Name: recipe_steps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recipe_steps_id_seq OWNED BY public.recipe_steps.id;


--
-- TOC entry 222 (class 1259 OID 16415)
-- Name: recipes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    total_time_minutes integer DEFAULT 30 NOT NULL,
    servings integer DEFAULT 4 NOT NULL,
    image_url text,
    category character varying(50) DEFAULT 'Comidas y Platillos'::character varying,
    first_like_notified boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.recipes OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16414)
-- Name: recipes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recipes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recipes_id_seq OWNER TO postgres;

--
-- TOC entry 5104 (class 0 OID 0)
-- Dependencies: 221
-- Name: recipes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recipes_id_seq OWNED BY public.recipes.id;


--
-- TOC entry 228 (class 1259 OID 16477)
-- Name: saved_boards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.saved_boards (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.saved_boards OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16476)
-- Name: saved_boards_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.saved_boards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.saved_boards_id_seq OWNER TO postgres;

--
-- TOC entry 5105 (class 0 OID 0)
-- Dependencies: 227
-- Name: saved_boards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.saved_boards_id_seq OWNED BY public.saved_boards.id;


--
-- TOC entry 231 (class 1259 OID 16511)
-- Name: user_badges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_badges (
    id integer NOT NULL,
    user_id integer NOT NULL,
    badge_type character varying(50) NOT NULL,
    unlocked_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_badges OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16510)
-- Name: user_badges_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_badges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_badges_id_seq OWNER TO postgres;

--
-- TOC entry 5106 (class 0 OID 0)
-- Dependencies: 230
-- Name: user_badges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_badges_id_seq OWNED BY public.user_badges.id;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    website character varying(255),
    about_me text,
    avatar_url text,
    privacy_accepted boolean DEFAULT false NOT NULL,
    privacy_accepted_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    current_streak integer DEFAULT 0 NOT NULL,
    streak_saves_left integer DEFAULT 3 NOT NULL,
    last_login_date date,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5107 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4899 (class 2604 OID 16444)
-- Name: recipe_ingredients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_ingredients ALTER COLUMN id SET DEFAULT nextval('public.recipe_ingredients_id_seq'::regclass);


--
-- TOC entry 4901 (class 2604 OID 16462)
-- Name: recipe_steps id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_steps ALTER COLUMN id SET DEFAULT nextval('public.recipe_steps_id_seq'::regclass);


--
-- TOC entry 4892 (class 2604 OID 16418)
-- Name: recipes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes ALTER COLUMN id SET DEFAULT nextval('public.recipes_id_seq'::regclass);


--
-- TOC entry 4902 (class 2604 OID 16480)
-- Name: saved_boards id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saved_boards ALTER COLUMN id SET DEFAULT nextval('public.saved_boards_id_seq'::regclass);


--
-- TOC entry 4905 (class 2604 OID 16514)
-- Name: user_badges id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_badges ALTER COLUMN id SET DEFAULT nextval('public.user_badges_id_seq'::regclass);


--
-- TOC entry 4885 (class 2604 OID 16393)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5094 (class 0 OID 16492)
-- Dependencies: 229
-- Data for Name: board_recipes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.board_recipes (board_id, recipe_id, saved_at) FROM stdin;
1	1	2026-08-06 08:38:49.339763-06
\.


--
-- TOC entry 5089 (class 0 OID 16441)
-- Dependencies: 224
-- Data for Name: recipe_ingredients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recipe_ingredients (id, recipe_id, quantity, unit, name, sort_order) FROM stdin;
1	1	500	g	Pechuga de pollo en cubos	1
2	1	1/2	taza	Cacahuates tostados	2
3	2	2	tazas	Espinacas frescas y lechuga	1
4	2	100	g	Queso panela o feta	2
\.


--
-- TOC entry 5091 (class 0 OID 16459)
-- Dependencies: 226
-- Data for Name: recipe_steps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recipe_steps (id, recipe_id, step_number, instruction_text) FROM stdin;
\.


--
-- TOC entry 5087 (class 0 OID 16415)
-- Dependencies: 222
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recipes (id, user_id, title, description, total_time_minutes, servings, image_url, category, first_like_notified, created_at, updated_at) FROM stdin;
1	1	Pollo Kung Pao Casero	Un clásico con toque casero, verduras frescas y salsa agridulce.	25	4	https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80	Comidas y Platillos	f	2026-08-05 08:17:34.401533-06	2026-08-05 08:17:34.401533-06
2	1	Ensalada Verde Mediterránea	Receta fresca y ligera, ideal para cuidar la digestión y el corazón.	15	2	https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80	Dietas	f	2026-08-05 08:17:34.401533-06	2026-08-05 08:17:34.401533-06
\.


--
-- TOC entry 5093 (class 0 OID 16477)
-- Dependencies: 228
-- Data for Name: saved_boards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.saved_boards (id, user_id, title, created_at) FROM stdin;
1	1	Mis Favoritas	2026-08-05 20:24:19.518951-06
\.


--
-- TOC entry 5096 (class 0 OID 16511)
-- Dependencies: 231
-- Data for Name: user_badges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_badges (id, user_id, badge_type, unlocked_at) FROM stdin;
\.


--
-- TOC entry 5085 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, first_name, last_name, email, password_hash, website, about_me, avatar_url, privacy_accepted, privacy_accepted_at, current_streak, streak_saves_left, last_login_date, created_at, updated_at) FROM stdin;
1	Alina	Cruz	alina.cruz@example.com	hash_demo_123	\N	\N	\N	t	2026-08-05 08:17:34.401533-06	0	3	\N	2026-08-05 08:17:34.401533-06	2026-08-05 08:17:34.401533-06
\.


--
-- TOC entry 5108 (class 0 OID 0)
-- Dependencies: 223
-- Name: recipe_ingredients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recipe_ingredients_id_seq', 18, true);


--
-- TOC entry 5109 (class 0 OID 0)
-- Dependencies: 225
-- Name: recipe_steps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recipe_steps_id_seq', 1, false);


--
-- TOC entry 5110 (class 0 OID 0)
-- Dependencies: 221
-- Name: recipes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recipes_id_seq', 4, true);


--
-- TOC entry 5111 (class 0 OID 0)
-- Dependencies: 227
-- Name: saved_boards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.saved_boards_id_seq', 1, true);


--
-- TOC entry 5112 (class 0 OID 0)
-- Dependencies: 230
-- Name: user_badges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_badges_id_seq', 1, false);


--
-- TOC entry 5113 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- TOC entry 4925 (class 2606 OID 16499)
-- Name: board_recipes board_recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.board_recipes
    ADD CONSTRAINT board_recipes_pkey PRIMARY KEY (board_id, recipe_id);


--
-- TOC entry 4917 (class 2606 OID 16452)
-- Name: recipe_ingredients recipe_ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_ingredients
    ADD CONSTRAINT recipe_ingredients_pkey PRIMARY KEY (id);


--
-- TOC entry 4920 (class 2606 OID 16470)
-- Name: recipe_steps recipe_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_steps
    ADD CONSTRAINT recipe_steps_pkey PRIMARY KEY (id);


--
-- TOC entry 4914 (class 2606 OID 16434)
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);


--
-- TOC entry 4923 (class 2606 OID 16486)
-- Name: saved_boards saved_boards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saved_boards
    ADD CONSTRAINT saved_boards_pkey PRIMARY KEY (id);


--
-- TOC entry 4927 (class 2606 OID 16522)
-- Name: user_badges unique_user_badge; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT unique_user_badge UNIQUE (user_id, badge_type);


--
-- TOC entry 4929 (class 2606 OID 16520)
-- Name: user_badges user_badges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_pkey PRIMARY KEY (id);


--
-- TOC entry 4908 (class 2606 OID 16413)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4910 (class 2606 OID 16411)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4915 (class 1259 OID 16530)
-- Name: idx_recipe_ingredients_recipe_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recipe_ingredients_recipe_id ON public.recipe_ingredients USING btree (recipe_id);


--
-- TOC entry 4918 (class 1259 OID 16531)
-- Name: idx_recipe_steps_recipe_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recipe_steps_recipe_id ON public.recipe_steps USING btree (recipe_id);


--
-- TOC entry 4911 (class 1259 OID 16529)
-- Name: idx_recipes_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recipes_category ON public.recipes USING btree (category);


--
-- TOC entry 4912 (class 1259 OID 16528)
-- Name: idx_recipes_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recipes_user_id ON public.recipes USING btree (user_id);


--
-- TOC entry 4921 (class 1259 OID 16532)
-- Name: idx_saved_boards_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_saved_boards_user_id ON public.saved_boards USING btree (user_id);


--
-- TOC entry 4934 (class 2606 OID 16500)
-- Name: board_recipes board_recipes_board_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.board_recipes
    ADD CONSTRAINT board_recipes_board_id_fkey FOREIGN KEY (board_id) REFERENCES public.saved_boards(id) ON DELETE CASCADE;


--
-- TOC entry 4935 (class 2606 OID 16505)
-- Name: board_recipes board_recipes_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.board_recipes
    ADD CONSTRAINT board_recipes_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;


--
-- TOC entry 4931 (class 2606 OID 16453)
-- Name: recipe_ingredients recipe_ingredients_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_ingredients
    ADD CONSTRAINT recipe_ingredients_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;


--
-- TOC entry 4932 (class 2606 OID 16471)
-- Name: recipe_steps recipe_steps_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_steps
    ADD CONSTRAINT recipe_steps_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;


--
-- TOC entry 4930 (class 2606 OID 16435)
-- Name: recipes recipes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4933 (class 2606 OID 16487)
-- Name: saved_boards saved_boards_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saved_boards
    ADD CONSTRAINT saved_boards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4936 (class 2606 OID 16523)
-- Name: user_badges user_badges_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-08-10 14:45:55

--
-- PostgreSQL database dump complete
--

\unrestrict gQTR5Van7YLBHI8lLS0ION6mKYwSHjWeHAh3QyGLZpWR1Zbcy59oBfVT5YksTDG

