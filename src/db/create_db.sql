DROP DATABASE wimb;

CREATE DATABASE wimb;

USE wimb;

CREATE TABLE bus (
  id          INT          NOT NULL AUTO_INCREMENT,
  number      VARCHAR(100) NOT NULL,
  description VARCHAR(100) NOT NULL,
  isActive    BOOLEAN      NOT NULL,
  PRIMARY KEY (id)
);
INSERT INTO bus (number, description, isActive) VALUES ('AI2011EE', 'Mitsubishi Pajero Sport 2013', TRUE);

CREATE TABLE gps_device (
  id          INT          NOT NULL AUTO_INCREMENT,
  serial      VARCHAR(100) NOT NULL,
  description VARCHAR(100) NOT NULL,
  isActive    BOOLEAN      NOT NULL,
  PRIMARY KEY (id)
);
INSERT INTO gps_device (serial, description, isActive) VALUES ('LGD856cd544cf6', 'Andrews mobile', TRUE);

CREATE TABLE bus_to_gps_device (
  id            INT      NOT NULL AUTO_INCREMENT,
  date_start    DATETIME NOT NULL,
  date_end      DATETIME NOT NULL,
  bus_id        INT      NOT NULL,
  gps_device_id INT      NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (bus_id) REFERENCES bus (id),
  FOREIGN KEY (gps_device_id) REFERENCES gps_device (id)
);
INSERT into bus_to_gps_device (date_start, date_end, bus_id, gps_device_id) VALUES ('1970-01-01 00:00:00','2070-01-01 00:00:00', 1, 1);

CREATE TABLE route_point_type (
  id   INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100),
  PRIMARY KEY (id)
);
INSERT INTO route_point_type (name) VALUES ("bus-stop");
INSERT INTO route_point_type (name) VALUES ("route-marker");

CREATE TABLE route (
  id     INT                     NOT NULL AUTO_INCREMENT,
  number VARCHAR(30)             NOT NULL,
  name   VARCHAR(100)
         CHARACTER SET utf8
         COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE route_direction (
  id       INT                     NOT NULL AUTO_INCREMENT,
  route_id INT                     NOT NULL,
  name     VARCHAR(30)
           CHARACTER SET utf8
           COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (route_id) REFERENCES route (id)
);

CREATE TABLE route_point (
  id                  INT                     NOT NULL AUTO_INCREMENT,
  route_direction_id  INT                     NOT NULL,
  route_point_type_id INT                     NOT NULL,
  name                VARCHAR(100)
                      CHARACTER SET utf8
                      COLLATE utf8_general_ci NOT NULL,
  lat                 DOUBLE                  NOT NULL,
  lon                 DOUBLE                  NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (route_direction_id) REFERENCES route_direction (id)
);

CREATE TABLE bus_data (
  id                  BIGINT NOT NULL AUTO_INCREMENT,
  client_addr         VARCHAR(30),
  server_time         DATETIME,
  local_time          DATETIME,
  lat                 DOUBLE,
  lon                 DOUBLE,
  alt                 DOUBLE,
  speed               DOUBLE,
  accuracy            DOUBLE,
  direction           DOUBLE,
  datasrc             INT,
  satellites          INT,
  battery             INT,
  descr               VARCHAR(1000),
  android_id          VARCHAR(30),
  serialno          VARCHAR(30),
  PRIMARY KEY (id)
);

USE mysql;

