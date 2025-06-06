--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: orders_dashboard; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.orders_dashboard AS
SELECT
    NULL::integer AS order_id,
    NULL::integer AS user_id,
    NULL::character varying(50) AS name,
    NULL::character varying(50) AS email,
    NULL::character varying(25) AS order_date,
    NULL::bigint AS total_item_qty,
    NULL::bigint AS subtotal,
    NULL::numeric AS shipping,
    NULL::numeric AS tax,
    NULL::numeric AS order_total;


ALTER VIEW public.orders_dashboard OWNER TO postgres;

--
-- Name: avg_order_total; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.avg_order_total AS
 SELECT round(avg(order_total)) AS round
   FROM public.orders_dashboard;


ALTER VIEW public.avg_order_total OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    user_id integer,
    completed boolean DEFAULT false,
    order_date character varying(25) DEFAULT NULL::character varying
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    product_id integer NOT NULL,
    name character varying(100),
    price integer,
    quantity integer,
    img_url character varying(255)
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: get_subtotal; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.get_subtotal AS
 SELECT orders.order_id,
    orders.order_date,
    products.name,
    order_items.product_id,
    order_items.quantity,
    products.price,
    (order_items.quantity * products.price) AS subtotal
   FROM ((public.orders
     JOIN public.order_items ON ((order_items.order_id = orders.order_id)))
     JOIN public.products ON ((order_items.product_id = products.product_id)));


ALTER VIEW public.get_subtotal OWNER TO postgres;

--
-- Name: last7_daily_totals; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.last7_daily_totals AS
 SELECT order_date,
    sum(order_total) AS daily_total
   FROM public.orders_dashboard
  GROUP BY order_date
  ORDER BY order_date DESC
 LIMIT 7;


ALTER VIEW public.last7_daily_totals OWNER TO postgres;

--
-- Name: num_orders; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.num_orders AS
 SELECT count(*) AS count
   FROM public.orders;


ALTER VIEW public.num_orders OWNER TO postgres;

--
-- Name: orders_info; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.orders_info AS
SELECT
    NULL::integer AS order_id,
    NULL::integer AS user_id,
    NULL::character varying(50) AS name,
    NULL::character varying(50) AS email,
    NULL::character varying(25) AS order_date,
    NULL::bigint AS total_item_qty,
    NULL::bigint AS subtotal;


ALTER VIEW public.orders_info OWNER TO postgres;

--
-- Name: order_calcs; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.order_calcs AS
 SELECT order_id,
    subtotal,
    round(((subtotal)::numeric * 0.2)) AS shipping,
    round(((((subtotal)::numeric * 0.2) + (subtotal)::numeric) * 0.1)) AS tax,
    ((round(((subtotal)::numeric * 0.2)) + round(((((subtotal)::numeric * 0.2) + (subtotal)::numeric) * 0.1))) + (subtotal)::numeric) AS order_total
   FROM public.orders_info
  ORDER BY order_id DESC;


ALTER VIEW public.order_calcs OWNER TO postgres;

--
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_order_id_seq OWNER TO postgres;

--
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- Name: products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_product_id_seq OWNER TO postgres;

--
-- Name: products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;


--
-- Name: site_hits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.site_hits (
    num_hits integer
);


ALTER TABLE public.site_hits OWNER TO postgres;

--
-- Name: total_sales; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.total_sales AS
 SELECT sum(order_total) AS total_sales
   FROM public.orders_dashboard;


ALTER VIEW public.total_sales OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(50),
    password character varying(25),
    email character varying(50),
    address_line_1 character varying(50),
    address_line_2 character varying(50),
    phone character varying(16),
    prefers_email_notifications boolean,
    prefers_phone_notifications boolean,
    avatar_path character varying(255),
    is_admin boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO postgres;

--
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
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- Name: products product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (order_id, product_id, quantity) FROM stdin;
5379205	12	3
5379205	13	2
5379205	3	1
5379205	19	1
5379206	15	2
5379206	16	100
5379207	17	5
5379207	12	3
5379207	18	5
5379208	19	2
5379208	15	3
5379208	2	1
5379209	18	3
5379209	4	2
5379209	1	3
5379209	15	1
5379209	16	1
5379210	3	5
5379211	2	3
5379211	16	5
5379211	15	3
5379212	18	5
5379212	16	100
5379212	12	5
5379212	15	3
5379213	15	2
5379213	19	3
5379214	14	8
5379214	3	6
5379215	12	3
5379215	3	3
5379216	19	8
5379217	17	8
5379217	15	4
5379218	12	5
5379219	14	3
5379219	12	3
5379220	12	5
5379220	16	10
5379220	3	3
5379221	16	15
5379221	19	5
5379221	13	7
5379221	2	2
5379222	14	5
5379222	18	3
5379222	15	2
5379223	19	8
5379223	4	1
5379223	15	1
5379224	17	1
5379224	18	2
5379224	15	5
5379225	17	2
5379225	3	3
5379225	12	5
5379226	14	6
5379226	17	2
5379227	16	8
5379227	15	5
5379227	1	3
5379227	18	1
5379228	14	5
5379228	1	1
5379203	19	3
5379203	18	1
5379203	16	5
5379204	15	6
5379204	2	1
5379228	15	4
5379229	17	4
5379230	15	5
5379230	19	60
5379231	17	4
5379231	14	3
5379232	16	1000
5379232	1	2
5379232	12	1
5379233	15	20
5379233	1	50
5379233	18	50
5379234	13	30
5379234	4	25
5379234	18	10
5379235	17	4
5379236	17	3
5379236	3	10
5379237	12	5
5379237	3	6
5379238	1	3
5379238	15	1
5379238	16	5
5379239	16	2
5379240	18	3
5379240	15	5
5379241	14	3
5379241	12	5
5379242	18	5
5379242	1	6
5379243	19	8
5379243	17	1
5379243	14	5
5379244	17	3
5379244	2	3
5379245	14	4
5379245	15	2
5379246	17	1
5379246	15	3
5379247	17	2
5379247	12	2
5379247	16	20
5379247	15	1
5379248	18	2
5379248	1	1
5379248	15	3
5379248	3	5
5379249	17	1
5379249	14	5
5379249	12	3
5379249	15	2
5379250	17	1
5379250	15	2
5379251	15	3
5379252	17	1
5379252	15	2
5379253	16	1
5379254	15	3
5379254	14	5
5379255	3	7
5379255	18	3
5379255	4	2
5379256	17	1
5379257	19	10
5379257	18	3
5379257	15	5
5379258	16	50
5379258	1	5
5379258	18	10
5379258	15	4
5379259	15	2
5379259	3	5
5379260	18	2
5379260	15	1
5379261	15	3
5379261	1	1
5379261	16	100
5379261	12	2
5379261	19	1
5379262	14	5
5379262	15	2
5379263	13	5
5379263	4	3
5379263	18	2
5379264	14	10
5379265	3	3
5379266	17	1
5379267	19	6
5379268	13	6
5379269	16	50
5379270	2	3
5379271	19	10
5379272	15	3
5379272	16	50
5379272	12	2
5379273	17	1
5379274	15	3
5379275	13	10
5379276	19	10
5379276	4	5
5379276	15	2
5379277	15	4
5379278	17	1
5379279	12	5
5379280	3	8
5379281	4	5
5379282	16	50
5379282	15	3
5379283	14	5
5379284	18	10
5379285	1	10
5379285	15	1
5379285	4	2
5379286	19	10
5379286	4	1
5379286	3	1
5379286	15	2
5379286	16	50
5379287	14	3
5379287	17	1
5379288	18	10
5379288	15	5
5379288	19	6
5379289	14	5
5379290	17	1
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (order_id, user_id, completed, order_date) FROM stdin;
5379221	10	f	3/23/2025
5379220	10	f	3/21/2025
5379219	53	f	3/21/2025
5379218	46	f	3/21/2025
5379217	46	f	3/20/2025
5379216	51	f	3/20/2025
5379215	46	f	3/20/2025
5379214	46	f	3/20/2025
5379213	10	f	3/20/2025
5379212	10	f	3/20/2025
5379211	51	f	3/19/2025
5379210	51	f	3/19/2025
5379209	6	f	3/19/2025
5379208	6	f	3/19/2025
5379207	7	f	3/19/2025
5379206	53	f	3/19/2025
5379205	47	f	3/19/2025
5379204	51	f	3/19/2025
5379203	46	f	3/19/2025
5379222	51	f	3/23/2025
5379223	46	f	3/23/2025
5379224	47	f	3/23/2025
5379225	46	f	3/22/2025
5379226	46	f	3/24/2025
5379227	47	f	3/25/2025
5379228	51	f	3/25/2025
5379229	46	f	3/26/2025
5379230	46	f	4/23/2025
5379231	53	f	4/22/2025
5379232	10	f	4/22/2025
5379233	46	f	4/21/2025
5379234	51	f	4/20/2025
5379235	53	f	4/20/2025
5379236	46	f	4/19/2025
5379237	47	f	4/23/2025
5379238	53	f	4/23/2025
5379239	53	f	4/23/2025
5379240	50	f	4/23/2025
5379241	46	f	4/24/2025
5379242	51	f	4/24/2025
5379243	46	f	4/24/2025
5379244	46	f	4/24/2025
5379245	53	f	4/24/2025
5379246	51	f	4/23/2025
5379247	10	f	4/18/2025
5379248	47	f	4/25/2025
5379249	10	f	4/25/2025
5379250	47	f	4/25/2025
5379251	46	f	4/25/2025
5379252	53	f	4/25/2025
5379253	53	f	4/25/2025
5379254	10	f	4/26/2025
5379255	47	f	4/26/2025
5379256	51	f	4/26/2025
5379257	50	f	4/26/2025
5379258	46	f	4/26/2025
5379259	46	f	4/26/2025
5379260	2	f	4/26/2025
5379261	10	f	4/27/2025
5379262	51	f	4/27/2025
5379263	47	f	4/27/2025
5379264	10	f	4/27/2025
5379265	51	f	4/27/2025
5379266	46	f	4/27/2025
5379267	53	f	4/27/2025
5379268	53	f	4/27/2025
5379269	10	f	4/27/2025
5379270	47	f	4/27/2025
5379271	51	f	4/27/2025
5379272	10	f	4/27/2025
5379273	46	f	4/27/2025
5379274	46	f	4/27/2025
5379275	46	f	4/27/2025
5379276	46	f	4/28/2025
5379277	10	f	4/28/2025
5379278	47	f	4/28/2025
5379279	53	f	4/28/2025
5379280	47	f	4/28/2025
5379281	46	f	4/28/2025
5379282	6	f	4/28/2025
5379283	53	f	4/28/2025
5379284	46	f	4/28/2025
5379285	51	f	4/28/2025
5379286	10	f	5/3/2025
5379287	47	f	5/3/2025
5379288	51	f	5/3/2025
5379289	53	f	5/3/2025
5379290	10	f	5/3/2025
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (product_id, name, price, quantity, img_url) FROM stdin;
4	Stereo	45	17	/assets/images/stereo.jpg
3	Computer	750	3	/assets/images/laptop.png
1	Television	500	5	/assets/images/tv.png
2	Microwave	100	7	/assets/images/microwave.png
12	Cartoon Couch	600	3	/assets/images/couch.png
13	Chess Set	50	6	/assets/images/chess.jpg
14	Cartoon Car	750	2	/assets/images/car.png
17	Boat	75000	3	/assets/images/boat.png
15	Zebra	10000	10	/assets/images/zebra.png
16	Toast	5	45	/assets/images/bread.png
19	Crazy Cactus	345	47	/assets/images/cactus.png
18	Guard Dog	1000	1	/assets/images/dog-suit.jpg
\.


--
-- Data for Name: site_hits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.site_hits (num_hits) FROM stdin;
91
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, password, email, address_line_1, address_line_2, phone, prefers_email_notifications, prefers_phone_notifications, avatar_path, is_admin) FROM stdin;
10	Homer Simpson	doh_nuts	doughnut@mail.com	1341 Evergreen Terrace	Springfield	123-456-1234	t	f	/assets/avatars/homer.png	f
53	John Doe	john_doe	johnDoe@email.com	538 Washington Ave	Albany, NY 12248	518-555-1212	t	t	/assets/avatars/Abraham Baker.webp	f
52	A	a	a@email.com	1 st	Place	3	f	f	/assets/avatars/Katy Fuller.webp	f
51	Princess Sparkle	sparkle47	sparkle@email.com	123 Sparkle St.	Sparks, NV	123-456-5432	t	t	/assets/avatars/Kaitlin Hale.webp	f
47	Beethoven	music_sucks	beethoven@email.com	1564 Some Blvd.	City, Place	555-669-7451	f	t	/assets/avatars/Maxwell Tan.webp	f
18	You	your_password	you@email.com	654 Avenue St.	City, State	654-756-6543	t	t	/assets/avatars/generic_user_avatar.png	f
17	Me	my_password	me@email.com	654 Street	City, State	987-987-9876	t	t	/assets/avatars/generic_user_avatar.png	f
16	Miss Another User	miss_another_user	miss_user@email.com	123 Address Street	City, State	555-555-6666	t	f	/assets/avatars/generic_user_avatar.png	f
12	Jane Doe's Cousin	cousin_doe	cousin_doe@email.com	852 Street Blvd	City, Place	518-477-5854	f	t	/assets/avatars/generic_user_avatar.png	f
11	iPad user	ipassword	pad@email.com	123 some avenue	City state, US	518-182-2288	t	f	/assets/avatars/generic_user_avatar.png	f
50	A son of a bitch	funky_chicken	bitchy@email.com	777 tree road	City, state	567-666-7869	f	t	/assets/avatars/generic_user_avatar.png	f
49	Gustav Mahler	music_music	mahler@email.com	654 Blvd. of Broken Dreams	City, Place	654-258-4697	t	t	/assets/avatars/generic_user_avatar.png	f
48	Johann Sebastian Bach	bach_bach	bach@email.com	123 Street	City, Place	123-456-6543	t	t	/assets/avatars/generic_user_avatar.png	f
19	Super User	super_super	super@email.com	333 Address St.	City, State	655-422-1596	t	t	/assets/avatars/generic_user_avatar.png	f
3	Mickey Mouse	crazy_goofy_shit	mickey@dis.com	343243 Main St	Orlando, Fl 	999-777-4747	f	f	/assets/avatars/generic_user_avatar.png	f
4	Another User	password	anotherEmail@someEmail.com	987 Street of Main	Colorado, US	123-456-7895	t	t	/assets/avatars/generic_user_avatar.png	f
6	Jane Doe	janes_password	janesEmail@email.com	8968567 Avenue of Unnnnh	Nebraska, US	444-222-8875	f	f	/assets/avatars/generic_user_avatar.png	f
7	Tony Bennett	SanFranBaby	tony@mail.com	868768 jkfsdjkh	over there	123-456-7894	t	t	/assets/avatars/generic_user_avatar.png	f
8	Snow Princess	LetMeTheFuckIn	snowmail@email.com	north Pole	blah blah	123-456-7854	f	f	/assets/avatars/generic_user_avatar.png	f
9	Tiger Fluff	letsgo	someother@email.com	32432 some street	place, state	3456776645	t	t	/assets/avatars/generic_user_avatar.png	f
1	Steve the great	fluffy_bunnies	someEmail@yadayada.com	123 main st	Schenectady, NY 12306	(518) 857-0600	t	t	/assets/avatars/generic_user_avatar.png	f
2	Heather	crazy_kitties	crazycatlady@someemail.com	123 main st	some city, some where 12345	(518) 779-1365	t	t	/assets/avatars/generic_user_avatar.png	f
5	John Doe jr	johns_password	johns_email@email.com	354242 dsuifhdsui St	Some state	555-555-5555	f	t	/assets/avatars/generic_user_avatar.png	f
46	Yoda	the_force	yoda@email.com	Far Away	Faaaar Away	555-999-9966	f	f	/assets/avatars/yoda.png	t
\.


--
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 5379290, true);


--
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_product_id_seq', 19, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 53, true);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (order_id, product_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: orders_info _RETURN; Type: RULE; Schema: public; Owner: postgres
--

CREATE OR REPLACE VIEW public.orders_info AS
 SELECT orders.order_id,
    orders.user_id,
    users.name,
    users.email,
    orders.order_date,
    sum(get_subtotal.quantity) AS total_item_qty,
    sum(get_subtotal.subtotal) AS subtotal
   FROM ((public.orders
     JOIN public.users ON ((orders.user_id = users.id)))
     JOIN public.get_subtotal ON ((get_subtotal.order_id = orders.order_id)))
  GROUP BY orders.order_id, users.name, users.email;


--
-- Name: orders_dashboard _RETURN; Type: RULE; Schema: public; Owner: postgres
--

CREATE OR REPLACE VIEW public.orders_dashboard AS
 SELECT orders.order_id,
    orders.user_id,
    users.name,
    users.email,
    orders.order_date,
    sum(get_subtotal.quantity) AS total_item_qty,
    order_calcs.subtotal,
    order_calcs.shipping,
    order_calcs.tax,
    order_calcs.order_total
   FROM (((public.orders
     JOIN public.users ON ((orders.user_id = users.id)))
     JOIN public.get_subtotal ON ((get_subtotal.order_id = orders.order_id)))
     JOIN public.order_calcs ON ((order_calcs.order_id = orders.order_id)))
  GROUP BY orders.order_id, users.name, users.email, order_calcs.subtotal, order_calcs.shipping, order_calcs.tax, order_calcs.order_total
  ORDER BY orders.order_id DESC;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

