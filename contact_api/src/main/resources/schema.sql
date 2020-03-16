

CREATE TABLE contact
(
id integer NOT NULL,
name varchar(100) NOT NULL,
email varchar(100) DEFAULT NULL,
 PRIMARY KEY (id)
);

CREATE TABLE phones
(
id integer NOT NULL SERIAL,
type varchar(100),
number varchar(20),
contact_id integer DEFAULT NULL,
PRIMARY KEY (id),
FOREIGN KEY (contact_id) REFERENCES contact (id) ON DELETE CASCADE
);