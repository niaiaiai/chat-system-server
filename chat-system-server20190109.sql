-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: chat_system
-- ------------------------------------------------------
-- Server version	5.7.24-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `group`
--

DROP TABLE IF EXISTS `group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group` (
  `id` int(11) NOT NULL,
  `group_id` varchar(45) NOT NULL,
  `group_name` varchar(60) NOT NULL,
  `leader` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `group_id_UNIQUE` (`group_id`),
  KEY `GROUP_LEADER_idx` (`leader`),
  CONSTRAINT `GROUP_LEADER` FOREIGN KEY (`leader`) REFERENCES `user` (`user_email`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group`
--

LOCK TABLES `group` WRITE;
/*!40000 ALTER TABLE `group` DISABLE KEYS */;
INSERT INTO `group` VALUES (6,'8622','oz大乱斗','1641084984@qq.com',NULL),(11,'5574','bbb','2233436144@qq.com',NULL),(12,'6065','123','2233436144@qq.com',NULL),(13,'1820','吹水','1641084984@qq.com',NULL);
/*!40000 ALTER TABLE `group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relationship`
--

DROP TABLE IF EXISTS `relationship`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relationship` (
  `id` int(11) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `friend_email` varchar(255) DEFAULT NULL,
  `group_id` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FRIEND_EMAIL_idx` (`user_email`),
  KEY `FRIEND_EMAIL_idx1` (`friend_email`),
  KEY `GROUP_ID_idx` (`group_id`),
  CONSTRAINT `FRIEND_EMAIL` FOREIGN KEY (`friend_email`) REFERENCES `user` (`user_email`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `GROUP_ID` FOREIGN KEY (`group_id`) REFERENCES `group` (`group_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `USER_EMAIL` FOREIGN KEY (`user_email`) REFERENCES `user` (`user_email`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relationship`
--

LOCK TABLES `relationship` WRITE;
/*!40000 ALTER TABLE `relationship` DISABLE KEYS */;
INSERT INTO `relationship` VALUES (14,'1641084984@qq.com',NULL,'8622'),(19,'1641084984@qq.com','2233436144@qq.com',NULL),(20,'2233436144@qq.com','1641084984@qq.com',NULL),(21,'2233436144@qq.com',NULL,'8622'),(26,'2233436144@qq.com',NULL,'5574'),(27,'2233436144@qq.com',NULL,'6065'),(28,'1641084984@qq.com',NULL,'1820');
/*!40000 ALTER TABLE `relationship` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'1641084984@qq.com','123123','123','http://47.107.155.139:8360/static/avatar/1641084984@qq.com.jpg?8302c1d8-1d4f-4d1b-a3ad-d474a4c80eda'),(2,'2233436144@qq.com','666','123123','http://47.107.155.139:8360/static/avatar/2233436144@qq.com.jpg?f891bd3c-f5c0-437e-b7fb-b2d0c5e1aa80'),(3,'1111111@qq.com','abb','aaa',NULL),(4,'11@qq.com','00','00',NULL),(5,'123@qq.com','abcd','00',NULL),(6,'555@hotmail.com','aaa','123','https://i.loli.net/2017/08/21/599a521472424.jpg'),(7,'e2r4000@hotmail.com','aaaaabbb','123','');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-01-09 15:14:40
