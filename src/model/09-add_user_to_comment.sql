SET FOREIGN_KEY_CHECKS = 0;
alter table comments add column user_id INTEGER UNSIGNED NOT NULL;
ALTER TABLE comments
    ADD CONSTRAINT fk_comments_users FOREIGN KEY(user_id) 
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE;
SET FOREIGN_KEY_CHECKS = 1;
