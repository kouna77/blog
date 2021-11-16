create table posts (
    id int auto_increment,
    title varchar(200),
    slug varchar(100),
    content text,
    constraint pk_posts PRIMARY KEY (id)    
);