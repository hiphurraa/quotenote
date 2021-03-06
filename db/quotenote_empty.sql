-- --------------------------------------------------------
-- Verkkotietokone:              localhost
-- Palvelinversio:               PostgreSQL 13.1, compiled by Visual C++ build 1914, 64-bit
-- Server OS:                    
-- HeidiSQL Versio:              11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for taulu skeema.category
CREATE TABLE IF NOT EXISTS "category" (
	"id" SERIAL,
	"name" TEXT NOT NULL,
	PRIMARY KEY ("id")
);

-- Dumping structure for taulu skeema.role
CREATE TABLE IF NOT EXISTS "role" (
	"id" SERIAL,
	"name" TEXT NOT NULL,
	PRIMARY KEY ("id")
);

-- Dumping structure for taulu skeema.user
CREATE TABLE IF NOT EXISTS "user" (
	"id" SERIAL,
	"name" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	"password" TEXT NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"is_active" BOOLEAN NOT NULL,
	"last_activity" TIMESTAMP NULL DEFAULT NULL,
	"is_banned" BOOLEAN NOT NULL DEFAULT 'f',
	"ban_ends_at" TIMESTAMP NULL,
	PRIMARY KEY ("id")
);

-- Dumping structure for taulu skeema.user_role
CREATE TABLE IF NOT EXISTS "user_role" (
	"user_id" INTEGER NOT NULL,
	"role_id" INTEGER NOT NULL,
	PRIMARY KEY ("user_id", "role_id"),
	CONSTRAINT "fk_role_id" FOREIGN KEY ("role_id") REFERENCES "public"."role" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);

-- Dumping structure for taulu skeema.quote
CREATE TABLE IF NOT EXISTS "quote" (
	"id" SERIAL,
	"quotetext" TEXT NOT NULL,
	"when" DATE NULL DEFAULT NULL,
	"when_string" TEXT NULL DEFAULT NULL,
	"said_by" TEXT NOT NULL,
	"location" TEXT NULL DEFAULT NULL,
	"user_id" INTEGER NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY ("id"),
	CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Dumping data for table skeema.category: 0 rows
/*!40000 ALTER TABLE "category" DISABLE KEYS */;
/*!40000 ALTER TABLE "category" ENABLE KEYS */;

-- Dumping structure for taulu skeema.comment
CREATE TABLE IF NOT EXISTS "comment" (
	"id" SERIAL,
	"commenttext" TEXT NOT NULL,
	"posted" TIMESTAMP NOT NULL,
	"user_id" INTEGER NOT NULL,
	"quote_id" INTEGER NOT NULL,
	PRIMARY KEY ("id"),
	CONSTRAINT "fk_quote_id" FOREIGN KEY ("quote_id") REFERENCES "public"."quote" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);

-- Dumping data for table skeema.comment: 0 rows
/*!40000 ALTER TABLE "comment" DISABLE KEYS */;
/*!40000 ALTER TABLE "comment" ENABLE KEYS */;

-- Dumping structure for taulu skeema.comment_like
CREATE TABLE IF NOT EXISTS "comment_like" (
	"user_id" INTEGER NOT NULL,
	"comment_id" INTEGER NOT NULL,
	"is_negative" BOOLEAN NOT NULL,
	PRIMARY KEY ("user_id", "comment_id"),
	CONSTRAINT "fk_comment_id" FOREIGN KEY ("comment_id") REFERENCES "public"."comment" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Dumping data for table skeema.comment_like: 0 rows
/*!40000 ALTER TABLE "comment_like" DISABLE KEYS */;
/*!40000 ALTER TABLE "comment_like" ENABLE KEYS */;

-- Dumping structure for taulu skeema.favorite
CREATE TABLE IF NOT EXISTS "favorite" (
	"user_id" INTEGER NOT NULL,
	"quote_id" INTEGER NOT NULL,
	"added_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY ("user_id", "quote_id"),
	CONSTRAINT "fk_quote_id" FOREIGN KEY ("quote_id") REFERENCES "public"."quote" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);

-- Dumping structure for taulu skeema.quote_category
CREATE TABLE IF NOT EXISTS "quote_category" (
	"quote_id" INTEGER NOT NULL,
	"category_id" INTEGER NOT NULL,
	PRIMARY KEY ("quote_id", "category_id"),
	CONSTRAINT "fk_category_id" FOREIGN KEY ("category_id") REFERENCES "public"."category" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT "fk_quote_id" FOREIGN KEY ("quote_id") REFERENCES "public"."quote" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);

-- Dumping structure for taulu skeema.quote_like
CREATE TABLE IF NOT EXISTS "quote_like" (
	"user_id" INTEGER NOT NULL,
	"quote_id" INTEGER NOT NULL,
	"is_negative" BOOLEAN NOT NULL,
	PRIMARY KEY ("user_id", "quote_id"),
	CONSTRAINT "fk_quote_id" FOREIGN KEY ("quote_id") REFERENCES "public"."quote" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);



CREATE OR REPLACE FUNCTION getCategoriesById(quoteId int) RETURNS TEXT[]
LANGUAGE plpgsql
AS
$$
DECLARE tulos TEXT ARRAY;
DECLARE numCategories INT;
DECLARE rivi RECORD;  
BEGIN		
	BEGIN 
		FOR rivi IN (SELECT category.name FROM category LEFT JOIN quote_category ON category.id = quote_category.category_id WHERE quote_category.quote_id = quoteId)
   	LOOP
   		tulos := ARRAY_APPEND(tulos, rivi.name);
	   END LOOP;
	END;
	
	RETURN tulos;
END;
$$;

DROP VIEW IF EXISTS quote_extended;
CREATE VIEW quote_extended AS SELECT DISTINCT quote.id, quote.quotetext, quote.when, quote.when_string, quote.said_by, quote.location, quote.user_id, PUBLIC.user.name AS user_name, (SELECT((SELECT COUNT(*) FROM quote_like WHERE quote_id = quote.id AND is_negative = FALSE) - (SELECT COUNT(*) FROM quote_like WHERE quote_id = quote.id AND is_negative = TRUE))) AS likes, (SELECT COUNT(*) FROM favorite WHERE quote_id = quote.id) AS favorites, (SELECT COUNT(*) FROM comment WHERE quote_id = quote.id) AS comments, (SELECT getCategoriesById(quote.id)) AS categories FROM quote LEFT JOIN PUBLIC.user ON quote.user_id = PUBLIC.user.id LEFT JOIN favorite ON PUBLIC.user.id = favorite.user_id LEFT JOIN quote_category ON quote.id = quote_category.quote_id;

-- Dumping data for table skeema.favorite: 0 rows
/*!40000 ALTER TABLE "favorite" DISABLE KEYS */;
/*!40000 ALTER TABLE "favorite" ENABLE KEYS */;

-- Dumping data for table skeema.user: 0 rows
/*!40000 ALTER TABLE "user" DISABLE KEYS */;
INSERT INTO "user" ("name", "email", "password", "created_at", "is_active", "last_activity") VALUES
	('admin', 'admin@admin.com', 'password', '2021-02-14 21:22:01.741045', 'true', NULL);
/*!40000 ALTER TABLE "user" ENABLE KEYS */;


-- Dumping data for table skeema.quote: 2??082 rows
/*!40000 ALTER TABLE "quote" DISABLE KEYS */;
INSERT INTO "quote" ("quotetext", "when", "when_string", "said_by", "location", "user_id") VALUES
	('This is an example quote. Enjoy. :)', NULL, NULL, 'Quotenote Developers', NULL, 1);


/*!40000 ALTER TABLE "quote" ENABLE KEYS */;



-- Dumping data for table skeema.quote_category: 0 rows
/*!40000 ALTER TABLE "quote_category" DISABLE KEYS */;
/*!40000 ALTER TABLE "quote_category" ENABLE KEYS */;



-- Dumping data for table skeema.quote_like: 0 rows
/*!40000 ALTER TABLE "quote_like" DISABLE KEYS */;
/*!40000 ALTER TABLE "quote_like" ENABLE KEYS */;



-- Dumping data for table skeema.role: 0 rows
/*!40000 ALTER TABLE "role" DISABLE KEYS */;
/*!40000 ALTER TABLE "role" ENABLE KEYS */;


-- Dumping data for table skeema.user_role: 0 rows
/*!40000 ALTER TABLE "user_role" DISABLE KEYS */;
/*!40000 ALTER TABLE "user_role" ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
