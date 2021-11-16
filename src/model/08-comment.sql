create table comments (
   id int auto_increment,
   content text,
   created_at timestamp,
   user_id INTEGER NOT NULL,
   post_id INTEGER NOT NULL,
   constraint pk_comments PRIMARY KEY (id),
   FOREIGN KEY (user_id) REFERENCES users(id),
   FOREIGN KEY (post_id) REFERENCES posts(id)
);