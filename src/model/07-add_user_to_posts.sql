SET FOREIGN_KEY_CHECKS = 0;
alter table posts add column user_id INTEGER UNSIGNED NOT NULL;
ALTER TABLE posts 
    ADD CONSTRAINT fk_posts_users FOREIGN KEY(user_id) 
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE;
SET FOREIGN_KEY_CHECKS = 1;


insert into users (first_name, last_name, email, `password`, token) values ('John', 'Doe', 'john@doe.fr', '1234', 'A1B2C3');
insert into posts (title, slug, content, user_id) values ('Mon super post', 'mon-super-blog', 'Mon super contenu', 1);