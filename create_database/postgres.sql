CREATE TABLE company (
	id_company serial4 NOT NULL,
	company varchar NOT NULL,
	"document" varchar NOT NULL,
	country int4 NOT NULL,
	city varchar NOT NULL,
	address1 varchar NULL,
	address2 varchar NULL,
	zip varchar NULL,
	province varchar NULL,
	CONSTRAINT company_pkey PRIMARY KEY (id_company)
);
ALTER TABLE public.company ADD CONSTRAINT company_un UNIQUE ("document");

CREATE TABLE public.users (
	id_user serial NOT NULL,
	"name" varchar NOT NULL,
	"password" varchar NOT NULL,
	email varchar NULL,
	CONSTRAINT users_pk PRIMARY KEY (id_user)
);

CREATE TABLE public.company_access_user (
	id_company_access_user serial4 NOT NULL,
	id_company integer NOT NULL,
	id_user integer NOT NULL,
	CONSTRAINT company_access_user_pk PRIMARY KEY (id_company_access_user),
	CONSTRAINT company_access_user_un UNIQUE (id_company,id_user)
);

ALTER TABLE public.company_access_user ADD CONSTRAINT company_access_user_fk FOREIGN KEY (id_user) REFERENCES public.users(id_user) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public.company_access_user ADD CONSTRAINT company_access_company_fk FOREIGN KEY (id_company) REFERENCES public.company(id_company) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public.users RENAME COLUMN name TO username;
ALTER TABLE public.users ADD name varchar NULL;
ALTER TABLE public.users ADD "document" varchar NULL;
ALTER TABLE public.users ADD created_at timestamp NULL;
ALTER TABLE public.users ADD updated_at timestamp NULL;
CREATE TABLE public.vehicle_parts (
	id_part serial4 NOT NULL,
	part_code varchar NOT NULL,
	id_company integer NULL,
	CONSTRAINT vehicle_parts_pk PRIMARY KEY (id_part)
);
ALTER TABLE public.vehicle_parts ADD CONSTRAINT vehicle_parts_un UNIQUE (id_part,id_company);
ALTER TABLE public.vehicle_parts ADD CONSTRAINT vehicle_parts_fk FOREIGN KEY (id_company) REFERENCES public.company(id_company) ON DELETE CASCADE ON UPDATE CASCADE;
