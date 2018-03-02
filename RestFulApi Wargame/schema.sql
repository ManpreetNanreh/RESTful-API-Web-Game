create table wwuserinfo(uid SERIAL PRIMARY KEY NOT NULL, 
			username varchar(20) UNIQUE, 
			userpass varchar(40),
			firstname varchar(40), 
			lastname varchar(40), 
			email varchar(60)
);

create table highscore(
	uid INTEGER REFERENCES wwuserinfo(uid),
	score INTEGER
);