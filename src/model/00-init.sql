CREATE DATABASE blog_db charset utf8 collate utf8_general_ci;

create user 'blog'@'localhost' identified by 'blog';

grant all privileges on blog_db.* to "blog"@"localhost";