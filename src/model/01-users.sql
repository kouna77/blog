USE blog_db;

create table users (
    id int auto_increment,
    first_name varchar(60),
    last_name varchar(30),
    email varchar(100),
    `password` varchar(255),
    constraint pk_users PRIMARY KEY (id)    
);