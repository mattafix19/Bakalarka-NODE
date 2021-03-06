PGDMP     7                    u            Martin2    9.6.2    9.6.2 7    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                       false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                       false            �           1262    16462    Martin2    DATABASE     �   CREATE DATABASE "Martin2" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'Slovak_Slovakia.1250' LC_CTYPE = 'Slovak_Slovakia.1250';
    DROP DATABASE "Martin2";
             Martin    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
             postgres    false            �           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                  postgres    false    3                        3079    12387    plpgsql 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;
    DROP EXTENSION plpgsql;
                  false            �           0    0    EXTENSION plpgsql    COMMENT     @   COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';
                       false    1            �            1259    16463    cdn_interface    TABLE     �  CREATE TABLE cdn_interface (
    id integer NOT NULL,
    name character varying(20),
    url character varying(100),
    url_translator character varying(100),
    url_cdn character varying(100),
    port_cdn integer,
    login character varying(20),
    pass character varying(20),
    priority integer,
    endpoint_type_id integer,
    endpoint_gateway_type_id integer,
    offer_status numeric(1,0) DEFAULT 4
);
 !   DROP TABLE public.cdn_interface;
       public         Martin    false    3            �            1259    16467    cdninterface_id_seq    SEQUENCE     u   CREATE SEQUENCE cdninterface_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.cdninterface_id_seq;
       public       Martin    false    3    185            �           0    0    cdninterface_id_seq    SEQUENCE OWNED BY     >   ALTER SEQUENCE cdninterface_id_seq OWNED BY cdn_interface.id;
            public       Martin    false    186            �            1259    16469    endpoint_gateway_type    TABLE     y   CREATE TABLE endpoint_gateway_type (
    id_gateway integer NOT NULL,
    endpoint_gateway_type character varying(20)
);
 )   DROP TABLE public.endpoint_gateway_type;
       public         Martin    false    3            �            1259    16472    endpoint_gateway_type_id_seq    SEQUENCE     ~   CREATE SEQUENCE endpoint_gateway_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.endpoint_gateway_type_id_seq;
       public       Martin    false    3    187            �           0    0    endpoint_gateway_type_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE endpoint_gateway_type_id_seq OWNED BY endpoint_gateway_type.id_gateway;
            public       Martin    false    188            �            1259    16474    endpoint_type    TABLE     e   CREATE TABLE endpoint_type (
    id_type integer NOT NULL,
    endpoint_type character varying(6)
);
 !   DROP TABLE public.endpoint_type;
       public         Martin    false    3            �            1259    16477    endpoint_type_id_seq    SEQUENCE     v   CREATE SEQUENCE endpoint_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.endpoint_type_id_seq;
       public       Martin    false    3    189            �           0    0    endpoint_type_id_seq    SEQUENCE OWNED BY     D   ALTER SEQUENCE endpoint_type_id_seq OWNED BY endpoint_type.id_type;
            public       Martin    false    190            �            1259    16479 	   footprint    TABLE     �   CREATE TABLE footprint (
    id integer NOT NULL,
    endpoint_id integer,
    subnet_num bigint,
    mask_num bigint,
    subnet_ip character varying(15),
    prefix integer
);
    DROP TABLE public.footprint;
       public         Martin    false    3            �            1259    16482    footprint_id_seq    SEQUENCE     r   CREATE SEQUENCE footprint_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.footprint_id_seq;
       public       Martin    false    3    191            �           0    0    footprint_id_seq    SEQUENCE OWNED BY     7   ALTER SEQUENCE footprint_id_seq OWNED BY footprint.id;
            public       Martin    false    192            �            1259    16484    offer_status    TABLE     u   CREATE TABLE offer_status (
    status character varying(100) NOT NULL,
    id_offer_status numeric(1,0) NOT NULL
);
     DROP TABLE public.offer_status;
       public         Martin    false    3            �            1259    16487    offer_status_id_type_seq    SEQUENCE     z   CREATE SEQUENCE offer_status_id_type_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.offer_status_id_type_seq;
       public       Martin    false    3    193            �           0    0    offer_status_id_type_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE offer_status_id_type_seq OWNED BY offer_status.id_offer_status;
            public       Martin    false    194            �            1259    16489    users    TABLE     �   CREATE TABLE users (
    id integer NOT NULL,
    login character varying(100) NOT NULL,
    pass character varying(100) NOT NULL,
    admin boolean NOT NULL
);
    DROP TABLE public.users;
       public         Martin    false    3            �            1259    16492    users_id_seq    SEQUENCE     n   CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public       Martin    false    3    195            �           0    0    users_id_seq    SEQUENCE OWNED BY     /   ALTER SEQUENCE users_id_seq OWNED BY users.id;
            public       Martin    false    196            �           2604    16494    cdn_interface id    DEFAULT     e   ALTER TABLE ONLY cdn_interface ALTER COLUMN id SET DEFAULT nextval('cdninterface_id_seq'::regclass);
 ?   ALTER TABLE public.cdn_interface ALTER COLUMN id DROP DEFAULT;
       public       Martin    false    186    185            �           2604    16495     endpoint_gateway_type id_gateway    DEFAULT     ~   ALTER TABLE ONLY endpoint_gateway_type ALTER COLUMN id_gateway SET DEFAULT nextval('endpoint_gateway_type_id_seq'::regclass);
 O   ALTER TABLE public.endpoint_gateway_type ALTER COLUMN id_gateway DROP DEFAULT;
       public       Martin    false    188    187            �           2604    16496    endpoint_type id_type    DEFAULT     k   ALTER TABLE ONLY endpoint_type ALTER COLUMN id_type SET DEFAULT nextval('endpoint_type_id_seq'::regclass);
 D   ALTER TABLE public.endpoint_type ALTER COLUMN id_type DROP DEFAULT;
       public       Martin    false    190    189            �           2604    16497    footprint id    DEFAULT     ^   ALTER TABLE ONLY footprint ALTER COLUMN id SET DEFAULT nextval('footprint_id_seq'::regclass);
 ;   ALTER TABLE public.footprint ALTER COLUMN id DROP DEFAULT;
       public       Martin    false    192    191            �           2604    16498    offer_status id_offer_status    DEFAULT     v   ALTER TABLE ONLY offer_status ALTER COLUMN id_offer_status SET DEFAULT nextval('offer_status_id_type_seq'::regclass);
 K   ALTER TABLE public.offer_status ALTER COLUMN id_offer_status DROP DEFAULT;
       public       Martin    false    194    193            �           2604    16499    users id    DEFAULT     V   ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public       Martin    false    196    195            }          0    16463    cdn_interface 
   TABLE DATA                     public       Martin    false    185   0:       �           0    0    cdninterface_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('cdninterface_id_seq', 8, true);
            public       Martin    false    186                      0    16469    endpoint_gateway_type 
   TABLE DATA                     public       Martin    false    187   9;       �           0    0    endpoint_gateway_type_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('endpoint_gateway_type_id_seq', 2, true);
            public       Martin    false    188            �          0    16474    endpoint_type 
   TABLE DATA                     public       Martin    false    189   �;       �           0    0    endpoint_type_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('endpoint_type_id_seq', 2, true);
            public       Martin    false    190            �          0    16479 	   footprint 
   TABLE DATA                     public       Martin    false    191   <       �           0    0    footprint_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('footprint_id_seq', 101, true);
            public       Martin    false    192            �          0    16484    offer_status 
   TABLE DATA                     public       Martin    false    193   �<       �           0    0    offer_status_id_type_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('offer_status_id_type_seq', 1, false);
            public       Martin    false    194            �          0    16489    users 
   TABLE DATA                     public       Martin    false    195   O=       �           0    0    users_id_seq    SEQUENCE SET     3   SELECT pg_catalog.setval('users_id_seq', 3, true);
            public       Martin    false    196            �           2606    16501    cdn_interface cdninterface_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY cdn_interface
    ADD CONSTRAINT cdninterface_pkey PRIMARY KEY (id);
 I   ALTER TABLE ONLY public.cdn_interface DROP CONSTRAINT cdninterface_pkey;
       public         Martin    false    185    185            �           2606    16503 0   endpoint_gateway_type endpoint_gateway_type_pkey 
   CONSTRAINT     o   ALTER TABLE ONLY endpoint_gateway_type
    ADD CONSTRAINT endpoint_gateway_type_pkey PRIMARY KEY (id_gateway);
 Z   ALTER TABLE ONLY public.endpoint_gateway_type DROP CONSTRAINT endpoint_gateway_type_pkey;
       public         Martin    false    187    187            �           2606    16505     endpoint_type endpoint_type_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY endpoint_type
    ADD CONSTRAINT endpoint_type_pkey PRIMARY KEY (id_type);
 J   ALTER TABLE ONLY public.endpoint_type DROP CONSTRAINT endpoint_type_pkey;
       public         Martin    false    189    189            �           2606    16507    footprint footprint_pkey 
   CONSTRAINT     O   ALTER TABLE ONLY footprint
    ADD CONSTRAINT footprint_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.footprint DROP CONSTRAINT footprint_pkey;
       public         Martin    false    191    191                       2606    16511    offer_status offer_status_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY offer_status
    ADD CONSTRAINT offer_status_pkey PRIMARY KEY (id_offer_status);
 H   ALTER TABLE ONLY public.offer_status DROP CONSTRAINT offer_status_pkey;
       public         Martin    false    193    193                       2606    16513    users users_pkey 
   CONSTRAINT     G   ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public         Martin    false    195    195            �           1259    16514 &   fki_cdn_interface_offer_status_id_fkey    INDEX     a   CREATE INDEX fki_cdn_interface_offer_status_id_fkey ON cdn_interface USING btree (offer_status);
 :   DROP INDEX public.fki_cdn_interface_offer_status_id_fkey;
       public         Martin    false    185            �           1259    16633    fki_fk_cdn_interface_id    INDEX     M   CREATE INDEX fki_fk_cdn_interface_id ON footprint USING btree (endpoint_id);
 +   DROP INDEX public.fki_fk_cdn_interface_id;
       public         Martin    false    191                       2606    16515 9   cdn_interface cdn_interface_endpoint_gateway_type_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY cdn_interface
    ADD CONSTRAINT cdn_interface_endpoint_gateway_type_id_fkey FOREIGN KEY (endpoint_gateway_type_id) REFERENCES endpoint_gateway_type(id_gateway);
 c   ALTER TABLE ONLY public.cdn_interface DROP CONSTRAINT cdn_interface_endpoint_gateway_type_id_fkey;
       public       Martin    false    185    187    2042                       2606    16520 1   cdn_interface cdn_interface_endpoint_type_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY cdn_interface
    ADD CONSTRAINT cdn_interface_endpoint_type_id_fkey FOREIGN KEY (endpoint_type_id) REFERENCES endpoint_type(id_type);
 [   ALTER TABLE ONLY public.cdn_interface DROP CONSTRAINT cdn_interface_endpoint_type_id_fkey;
       public       Martin    false    2044    189    185                       2606    16525 0   cdn_interface cdn_interface_offer_status_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY cdn_interface
    ADD CONSTRAINT cdn_interface_offer_status_id_fkey FOREIGN KEY (offer_status) REFERENCES offer_status(id_offer_status);
 Z   ALTER TABLE ONLY public.cdn_interface DROP CONSTRAINT cdn_interface_offer_status_id_fkey;
       public       Martin    false    185    193    2049                       2606    16628    footprint fk_cdn_interface_id    FK CONSTRAINT     z   ALTER TABLE ONLY footprint
    ADD CONSTRAINT fk_cdn_interface_id FOREIGN KEY (endpoint_id) REFERENCES cdn_interface(id);
 G   ALTER TABLE ONLY public.footprint DROP CONSTRAINT fk_cdn_interface_id;
       public       Martin    false    185    191    2039            }   �   x�Ր1k�0�w�
mI@8�m�I�`2Lu�U\,9�%#](�����%p<�ޓ�+����D��&��\i���V���h$%7���тv=����ߠd4�]o.*��W��U8Q"��_�q%k�����71]'-wxs+��Y2JE���7�i����|����A���ۮ׭pC��9v>ɳ,�9�A�p���3gI�'6WBI��E�S������W����4�����x���hl��F}e`f         ]   x���v
Q���WH�K)���+�OO,I-O��/�,HU��L�	�`W�������a�����������i��IU��ƻ���F���� �>�      �   Q   x���v
Q���WH�K)���+�/�,HU��L3tP�5�}B]�4u�s�s�5��<�7�hNQjn~I*� .. .�/�      �   �   x���;�0��_q7Bȍy(�:8�B�]��B(����}�.�s�n�饄,/����FcgLC����VmeZj�Ε]z�}z|�w5����<C�O״�@+H���NQ�)��)<x�n��g�͖{����G2�J
���(�Ě}��(�Ҕ�>�y/��r8      �      x���v
Q���W�OKK-�/.I,)-VЀ�:
�)���
a�>���
�~���:
���\��☜�ZP��4ʐB��A�`��(4�%59'3l�1�F�� �eB��r�/�+.)JM�j4�� 4y�-      �   ^   x���v
Q���W(-N-*V��L�Q��O���Q(H,.�QHL����Ts�	uV�0�QP�#1J�JS5��<I7�h
H�:�NK�)��� �/     