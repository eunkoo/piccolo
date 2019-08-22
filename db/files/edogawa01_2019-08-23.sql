# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.26)
# Database: edogawa01
# Generation Time: 2019-08-22 16:27:56 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table attendee
# ------------------------------------------------------------

DROP TABLE IF EXISTS `attendee`;

CREATE TABLE `attendee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mid` int(11) NOT NULL,
  `eid` int(11) NOT NULL,
  `attended` int(11) DEFAULT NULL,
  `paragraph` int(1) DEFAULT NULL,
  `bible` int(11) DEFAULT NULL,
  `comment` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `offering` int(11) DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  `grade` int(11) DEFAULT NULL,
  `connected` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table events
# ------------------------------------------------------------

DROP TABLE IF EXISTS `events`;

CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(20) DEFAULT NULL,
  `place` varchar(20) DEFAULT NULL,
  `day` date DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `director` int(11) DEFAULT NULL,
  `belongs` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `notice` text,
  `offering` int(11) DEFAULT '0',
  `birthes` text,
  `newes` text,
  `totalmember` int(11) DEFAULT NULL,
  `totalmorning` int(11) DEFAULT NULL,
  `totalnoon` int(11) DEFAULT NULL,
  `calendar` text,
  `eday` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table members
# ------------------------------------------------------------

DROP TABLE IF EXISTS `members`;

CREATE TABLE `members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `address` varchar(50) DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `birth` date DEFAULT NULL,
  `gender` int(4) DEFAULT NULL,
  `offrate` int(11) DEFAULT '4',
  `belong` int(11) DEFAULT NULL,
  `grade` int(11) DEFAULT '1',
  `organization` varchar(20) DEFAULT NULL,
  `regdate` date DEFAULT NULL,
  `tag` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `connected` varchar(20) DEFAULT NULL,
  `photo` varchar(20) DEFAULT NULL,
  `baptism` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table organization
# ------------------------------------------------------------

DROP TABLE IF EXISTS `organization`;

CREATE TABLE `organization` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `belongs` int(11) NOT NULL,
  `name` varchar(11) NOT NULL DEFAULT '',
  `role` varchar(20) DEFAULT NULL,
  `year` int(11) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table schedule
# ------------------------------------------------------------

DROP TABLE IF EXISTS `schedule`;

CREATE TABLE `schedule` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `eid` int(11) DEFAULT NULL,
  `mid` int(11) DEFAULT NULL,
  `title` varchar(20) DEFAULT NULL,
  `date` int(11) DEFAULT NULL,
  `time` time DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `color` varchar(11) DEFAULT NULL,
  `link` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `iduser` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `apellidos` varchar(50) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `grade` int(11) DEFAULT NULL,
  PRIMARY KEY (`iduser`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
