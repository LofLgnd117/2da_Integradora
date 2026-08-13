--
-- PostgreSQL database dump
--

\restrict AXNaKgaM6rxeQoav3Pw0ve0Dg4u7x5ar7xygzV9n0LoNPHggQxkOWh0tKhrN7so

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

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
-- Name: fn_count_recipe_ingredients(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_count_recipe_ingredients(p_recipe_id integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_count INT;
BEGIN
    SELECT COUNT(*)
    INTO v_count
    FROM recipe_ingredients
    WHERE recipe_id = p_recipe_id;
    
    RETURN v_count;
END;
$$;


--
-- Name: fn_update_recipes_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_update_recipes_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


--
-- Name: sp_create_saved_board(integer, character varying); Type: PROCEDURE; Schema: public; Owner: -
--

CREATE PROCEDURE public.sp_create_saved_board(IN p_user_id integer, IN p_title character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Validar que el título no esté vacío
    IF TRIM(p_title) = '' THEN
        RAISE EXCEPTION 'El título del tablero no puede estar vacío.';
    END IF;

    -- Insertar el nuevo tablero
    INSERT INTO saved_boards (user_id, title, created_at)
    VALUES (p_user_id, p_title, CURRENT_TIMESTAMP);
    
    COMMIT;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: board_recipes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.board_recipes (
    board_id integer NOT NULL,
    recipe_id integer NOT NULL,
    saved_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: recipe_ingredients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipe_ingredients (
    id integer NOT NULL,
    recipe_id integer NOT NULL,
    quantity character varying(50) NOT NULL,
    unit character varying(50),
    name character varying(150) NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


--
-- Name: recipe_ingredients_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recipe_ingredients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recipe_ingredients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recipe_ingredients_id_seq OWNED BY public.recipe_ingredients.id;


--
-- Name: recipe_steps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipe_steps (
    id integer NOT NULL,
    recipe_id integer NOT NULL,
    step_number integer NOT NULL,
    instruction_text text NOT NULL
);


--
-- Name: recipe_steps_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recipe_steps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recipe_steps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recipe_steps_id_seq OWNED BY public.recipe_steps.id;


--
-- Name: recipes; Type: TABLE; Schema: public; Owner: -
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
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    chef_tips text
);


--
-- Name: recipes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recipes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recipes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recipes_id_seq OWNED BY public.recipes.id;


--
-- Name: saved_boards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.saved_boards (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: saved_boards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.saved_boards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: saved_boards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.saved_boards_id_seq OWNED BY public.saved_boards.id;


--
-- Name: seq_folio_recetas; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.seq_folio_recetas
    START WITH 1000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 10;


--
-- Name: seq_recipe_share_folio; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.seq_recipe_share_folio
    START WITH 1000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 10;


--
-- Name: user_badges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_badges (
    id integer NOT NULL,
    user_id integer NOT NULL,
    badge_type character varying(50) NOT NULL,
    unlocked_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: user_badges_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_badges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_badges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_badges_id_seq OWNED BY public.user_badges.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: view_featured_recipes; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.view_featured_recipes AS
 SELECT r.id AS recipe_id,
    r.title AS recipe_title,
    (((u.first_name)::text || ' '::text) || (u.last_name)::text) AS chef_name,
    r.total_time_minutes,
    r.category
   FROM (public.recipes r
     JOIN public.users u ON ((r.user_id = u.id)));


--
-- Name: recipe_ingredients id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_ingredients ALTER COLUMN id SET DEFAULT nextval('public.recipe_ingredients_id_seq'::regclass);


--
-- Name: recipe_steps id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_steps ALTER COLUMN id SET DEFAULT nextval('public.recipe_steps_id_seq'::regclass);


--
-- Name: recipes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes ALTER COLUMN id SET DEFAULT nextval('public.recipes_id_seq'::regclass);


--
-- Name: saved_boards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_boards ALTER COLUMN id SET DEFAULT nextval('public.saved_boards_id_seq'::regclass);


--
-- Name: user_badges id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badges ALTER COLUMN id SET DEFAULT nextval('public.user_badges_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: board_recipes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.board_recipes (board_id, recipe_id, saved_at) FROM stdin;
1	1	2026-08-06 08:38:49.339763-06
\.


--
-- Data for Name: recipe_ingredients; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipe_ingredients (id, recipe_id, quantity, unit, name, sort_order) FROM stdin;
1	1	500	g	Pechuga de pollo en cubos	1
2	1	1/2	taza	Cacahuates tostados	2
3	2	2	tazas	Espinacas frescas y lechuga	1
4	2	100	g	Queso panela o feta	2
\.


--
-- Data for Name: recipe_steps; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipe_steps (id, recipe_id, step_number, instruction_text) FROM stdin;
1	1	1	Prepara tu espacio de trabajo lavando y cortando todos los ingredientes frescos según las medidas indicadas.
2	1	2	Calienta un sartén grande o wok a fuego medio-alto con un chorrito de aceite de tu preferencia.
3	1	3	Agrega los ingredientes principales y cocina mezclando constantemente para integrar todos los sabores del sazón.
4	1	4	Sirve caliente de inmediato y decora con un toque final fresco para presentar en la mesa.
\.


--
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipes (id, user_id, title, description, total_time_minutes, servings, image_url, category, first_like_notified, created_at, updated_at, chef_tips) FROM stdin;
2	1	Ensalada Verde Mediterránea	Receta fresca y ligera, ideal para cuidar la digestión y el corazón.	15	2	https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80	Dietas	f	2026-08-05 08:17:34.401533-06	2026-08-05 08:17:34.401533-06	\N
1	1	Pollo Kung Pao Casero	Un clásico con toque casero, verduras frescas y salsa agridulce.	45	4	https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80	Comidas y Platillos	f	2026-08-05 08:17:34.401533-06	2026-08-11 23:05:48.683979-06	Para obtener un sabor aún más intenso, puedes marinar los ingredientes durante 15 minutos en el refrigerador antes de llevarlos al sartén caliente.
\.


--
-- Data for Name: saved_boards; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.saved_boards (id, user_id, title, created_at) FROM stdin;
1	1	Mis Favoritas	2026-08-05 20:24:19.518951-06
\.


--
-- Data for Name: user_badges; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_badges (id, user_id, badge_type, unlocked_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, first_name, last_name, email, password_hash, website, about_me, avatar_url, privacy_accepted, privacy_accepted_at, current_streak, streak_saves_left, last_login_date, created_at, updated_at) FROM stdin;
1	Alina	Cruz	alina.cruz@example.com	hash_demo_123	\N	\N	\N	t	2026-08-05 08:17:34.401533-06	0	3	\N	2026-08-05 08:17:34.401533-06	2026-08-05 08:17:34.401533-06
\.


--
-- Name: recipe_ingredients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recipe_ingredients_id_seq', 21, true);


--
-- Name: recipe_steps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recipe_steps_id_seq', 7, true);


--
-- Name: recipes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recipes_id_seq', 8, true);


--
-- Name: saved_boards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.saved_boards_id_seq', 5, true);


--
-- Name: seq_folio_recetas; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.seq_folio_recetas', 1009, true);


--
-- Name: seq_recipe_share_folio; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.seq_recipe_share_folio', 1009, true);


--
-- Name: user_badges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_badges_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- Name: board_recipes board_recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.board_recipes
    ADD CONSTRAINT board_recipes_pkey PRIMARY KEY (board_id, recipe_id);


--
-- Name: recipe_ingredients recipe_ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_ingredients
    ADD CONSTRAINT recipe_ingredients_pkey PRIMARY KEY (id);


--
-- Name: recipe_steps recipe_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_steps
    ADD CONSTRAINT recipe_steps_pkey PRIMARY KEY (id);


--
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);


--
-- Name: saved_boards saved_boards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_boards
    ADD CONSTRAINT saved_boards_pkey PRIMARY KEY (id);


--
-- Name: user_badges unique_user_badge; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT unique_user_badge UNIQUE (user_id, badge_type);


--
-- Name: user_badges user_badges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_recipe_ingredients_recipe_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_recipe_ingredients_recipe_id ON public.recipe_ingredients USING btree (recipe_id);


--
-- Name: idx_recipe_steps_recipe_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_recipe_steps_recipe_id ON public.recipe_steps USING btree (recipe_id);


--
-- Name: idx_recipes_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_recipes_category ON public.recipes USING btree (category);


--
-- Name: idx_recipes_search_title; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_recipes_search_title ON public.recipes USING btree (title);


--
-- Name: idx_recipes_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_recipes_user_id ON public.recipes USING btree (user_id);


--
-- Name: idx_saved_boards_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_saved_boards_user_id ON public.saved_boards USING btree (user_id);


--
-- Name: recipes trg_update_recipes_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_recipes_timestamp BEFORE UPDATE ON public.recipes FOR EACH ROW EXECUTE FUNCTION public.fn_update_recipes_timestamp();


--
-- Name: board_recipes board_recipes_board_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.board_recipes
    ADD CONSTRAINT board_recipes_board_id_fkey FOREIGN KEY (board_id) REFERENCES public.saved_boards(id) ON DELETE CASCADE;


--
-- Name: board_recipes board_recipes_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.board_recipes
    ADD CONSTRAINT board_recipes_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;


--
-- Name: recipe_ingredients recipe_ingredients_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_ingredients
    ADD CONSTRAINT recipe_ingredients_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;


--
-- Name: recipe_steps recipe_steps_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_steps
    ADD CONSTRAINT recipe_steps_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;


--
-- Name: recipes recipes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: saved_boards saved_boards_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_boards
    ADD CONSTRAINT saved_boards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_badges user_badges_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict AXNaKgaM6rxeQoav3Pw0ve0Dg4u7x5ar7xygzV9n0LoNPHggQxkOWh0tKhrN7so

