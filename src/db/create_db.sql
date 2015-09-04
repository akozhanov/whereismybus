drop database wimb;

create database wimb;

use wimb;

create table bus_data(
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
    serialno varchar(30)
)
