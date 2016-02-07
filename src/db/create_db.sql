drop database wimb;

create database wimb;

use wimb;

create table bus_data(
    id bigint not null auto_increment,
	client_addr varchar(30),
    server_time datetime,
    local_time datetime,
    lat double,
    lon double,
    alt double,
    speed double,
    accuracy double,
    direction double,
    datasrc int,
    satellites int,
    battery int,
    descr varchar(1000),
    android_id varchar(30),
    serialno varchar(30),
    primary key (id)
);

create table route_point_type(
    id int not null auto_increment,
    name varchar(100),
    primary key (id)
);
insert into route_point_type(name) values ("bus-stop");
insert into route_point_type(name) values ("route-marker");

create table route(
    id int not null auto_increment,
    number varchar(30) not null,
    name varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci not null,
    primary key (id)
);

create table route_direction(
    id int not null auto_increment,
    route_id int not null,
    name varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci not null,
    primary key (id),
    foreign key (route_id) references route(id)
);

create table route_point(
    id int not null auto_increment,
    route_direction_id int not null,
    route_point_type_id int not null,
    name varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci not null,
    lat double not null,
    lon double not null,
    primary key (id),
    foreign key (route_direction_id) references route_direction(id)
);

use mysql;

