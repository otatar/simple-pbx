-- MySQL dump 10.13  Distrib 8.0.25, for Linux (x86_64)
--
-- Host: localhost    Database: asterisk
-- ------------------------------------------------------
-- Server version	8.0.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Cdr`
--

DROP TABLE IF EXISTS `Cdr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Cdr` (
  `id` int NOT NULL AUTO_INCREMENT,
  `startTime` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `duration` int DEFAULT '0',
  `dialStatus` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `origANumber` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `origBNumber` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `manANumber` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `manBNumber` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `sourceType` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `destinationType` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `sourceTrunk` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `destinationTrunk` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cdr`
--

LOCK TABLES `Cdr` WRITE;
/*!40000 ALTER TABLE `Cdr` DISABLE KEYS */;
INSERT INTO `Cdr` VALUES (1,'2025-06-12 08:50:34.340',0,'CHANUNAVAIL','103','101','103','101','extension','extension','','');
/*!40000 ALTER TABLE `Cdr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ClassOfService`
--

DROP TABLE IF EXISTS `ClassOfService`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ClassOfService` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cos` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ClassOfService`
--

LOCK TABLES `ClassOfService` WRITE;
/*!40000 ALTER TABLE `ClassOfService` DISABLE KEYS */;
INSERT INTO `ClassOfService` VALUES (1,'Extensions',0,'2025-04-25 09:50:26.672','system'),(5,'test',6,'2025-05-28 07:53:39.115',NULL);
/*!40000 ALTER TABLE `ClassOfService` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Extension`
--

DROP TABLE IF EXISTS `Extension`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Extension` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extension` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cosId` int NOT NULL,
  `callRecord` enum('yes','no') COLLATE utf8mb4_unicode_ci DEFAULT 'no',
  `language` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `phoneBook` enum('yes','no') COLLATE utf8mb4_unicode_ci DEFAULT 'yes',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Extension_extension_key` (`extension`),
  KEY `Extension_cosId_fkey` (`cosId`),
  CONSTRAINT `Extension_cosId_fkey` FOREIGN KEY (`cosId`) REFERENCES `ClassOfService` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Extension`
--

LOCK TABLES `Extension` WRITE;
/*!40000 ALTER TABLE `Extension` DISABLE KEYS */;
INSERT INTO `Extension` VALUES (3,'dfasd','101','Qi,^f7aZ','2025-04-25 13:51:51.690',NULL,'fdsafds@gmail.com',1,'no','en','yes'),(4,'Test','103','K?n+4y+<','2025-04-28 06:37:45.657',NULL,'test@gmail.com',5,'yes','en','no');
/*!40000 ALTER TABLE `Extension` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GlobalSettings`
--

DROP TABLE IF EXISTS `GlobalSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GlobalSettings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ringTimeout` int DEFAULT '40',
  `maxCallDuration` int DEFAULT '18000',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subBranding` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GlobalSettings`
--

LOCK TABLES `GlobalSettings` WRITE;
/*!40000 ALTER TABLE `GlobalSettings` DISABLE KEYS */;
INSERT INTO `GlobalSettings` VALUES (1,40,18000,'2025-04-25 09:50:26.684','system','Simple PBX');
/*!40000 ALTER TABLE `GlobalSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IncomingRoute`
--

DROP TABLE IF EXISTS `IncomingRoute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `IncomingRoute` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prefix` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `destinationType` enum('extension','trunk','trunkGroup','queue') COLLATE utf8mb4_unicode_ci NOT NULL,
  `trunkId` int DEFAULT NULL,
  `trunkGroupId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extensionId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IncomingRoute_prefix_key` (`prefix`),
  KEY `IncomingRoute_trunkGroupId_fkey` (`trunkGroupId`),
  KEY `IncomingRoute_trunkId_fkey` (`trunkId`),
  KEY `IncomingRoute_extensionId_fkey` (`extensionId`),
  CONSTRAINT `IncomingRoute_extensionId_fkey` FOREIGN KEY (`extensionId`) REFERENCES `Extension` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `IncomingRoute_trunkGroupId_fkey` FOREIGN KEY (`trunkGroupId`) REFERENCES `TrunkGroup` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `IncomingRoute_trunkId_fkey` FOREIGN KEY (`trunkId`) REFERENCES `Trunk` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IncomingRoute`
--

LOCK TABLES `IncomingRoute` WRITE;
/*!40000 ALTER TABLE `IncomingRoute` DISABLE KEYS */;
/*!40000 ALTER TABLE `IncomingRoute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `NumberManipulation`
--

DROP TABLE IF EXISTS `NumberManipulation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NumberManipulation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('aNumber','bNumber') COLLATE utf8mb4_unicode_ci NOT NULL,
  `stripBegin` int NOT NULL DEFAULT '0',
  `stripEnd` int NOT NULL DEFAULT '0',
  `prepend` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `append` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `trunkId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `match` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `priority` int NOT NULL DEFAULT '1',
  `direction` enum('inbound','outbound') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'inbound',
  PRIMARY KEY (`id`),
  UNIQUE KEY `NumberManipulation_name_key` (`name`),
  KEY `NumberManipulation_trunkId_fkey` (`trunkId`),
  CONSTRAINT `NumberManipulation_trunkId_fkey` FOREIGN KEY (`trunkId`) REFERENCES `Trunk` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `NumberManipulation`
--

LOCK TABLES `NumberManipulation` WRITE;
/*!40000 ALTER TABLE `NumberManipulation` DISABLE KEYS */;
/*!40000 ALTER TABLE `NumberManipulation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OutgoingRoute`
--

DROP TABLE IF EXISTS `OutgoingRoute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OutgoingRoute` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prefix` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `destinationType` enum('extension','trunk','trunkGroup','queue') COLLATE utf8mb4_unicode_ci NOT NULL,
  `trunkId` int DEFAULT NULL,
  `trunkGroupId` int DEFAULT NULL,
  `cosId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `OutgoingRoute_prefix_key` (`prefix`),
  KEY `OutgoingRoute_cosId_fkey` (`cosId`),
  KEY `OutgoingRoute_trunkId_fkey` (`trunkId`),
  KEY `OutgoingRoute_trunkGroupId_fkey` (`trunkGroupId`),
  CONSTRAINT `OutgoingRoute_cosId_fkey` FOREIGN KEY (`cosId`) REFERENCES `ClassOfService` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `OutgoingRoute_trunkGroupId_fkey` FOREIGN KEY (`trunkGroupId`) REFERENCES `TrunkGroup` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `OutgoingRoute_trunkId_fkey` FOREIGN KEY (`trunkId`) REFERENCES `Trunk` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OutgoingRoute`
--

LOCK TABLES `OutgoingRoute` WRITE;
/*!40000 ALTER TABLE `OutgoingRoute` DISABLE KEYS */;
INSERT INTO `OutgoingRoute` VALUES (2,'Test2','00387XX','trunk',NULL,NULL,1,'2025-06-04 07:08:32.720',NULL);
/*!40000 ALTER TABLE `OutgoingRoute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Trunk`
--

DROP TABLE IF EXISTS `Trunk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Trunk` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `registration` enum('yes','no') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'no',
  `clientUri` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `host` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `port` int DEFAULT '5060',
  `serverUri` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `password` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `qualifyFrequency` int DEFAULT '60',
  `username` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `accountCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Trunk_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Trunk`
--

LOCK TABLES `Trunk` WRITE;
/*!40000 ALTER TABLE `Trunk` DISABLE KEYS */;
INSERT INTO `Trunk` VALUES (5,'Missnet','2025-06-18 13:25:01.415',NULL,'Missnet','no','','81.118.0.3',5061,'','fdsafdfsdfsd',60,'dfsdfdsf','');
/*!40000 ALTER TABLE `Trunk` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TrunkGroup`
--

DROP TABLE IF EXISTS `TrunkGroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TrunkGroup` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TrunkGroup`
--

LOCK TABLES `TrunkGroup` WRITE;
/*!40000 ALTER TABLE `TrunkGroup` DISABLE KEYS */;
/*!40000 ALTER TABLE `TrunkGroup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WebUser`
--

DROP TABLE IF EXISTS `WebUser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WebUser` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `lastName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `lastLoginAt` datetime(3) DEFAULT NULL,
  `passwordChanged` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `WebUser_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WebUser`
--

LOCK TABLES `WebUser` WRITE;
/*!40000 ALTER TABLE `WebUser` DISABLE KEYS */;
INSERT INTO `WebUser` VALUES (1,'2025-07-01 12:34:40.180','2025-07-02 13:20:00.495','admin@gmail.com','Test.01','Omer','Tatar','admin',1,NULL,0);
/*!40000 ALTER TABLE `WebUser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_TrunkToTrunkGroup`
--

DROP TABLE IF EXISTS `_TrunkToTrunkGroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_TrunkToTrunkGroup` (
  `A` int NOT NULL,
  `B` int NOT NULL,
  UNIQUE KEY `_TrunkToTrunkGroup_AB_unique` (`A`,`B`),
  KEY `_TrunkToTrunkGroup_B_index` (`B`),
  CONSTRAINT `_TrunkToTrunkGroup_A_fkey` FOREIGN KEY (`A`) REFERENCES `Trunk` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_TrunkToTrunkGroup_B_fkey` FOREIGN KEY (`B`) REFERENCES `TrunkGroup` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_TrunkToTrunkGroup`
--

LOCK TABLES `_TrunkToTrunkGroup` WRITE;
/*!40000 ALTER TABLE `_TrunkToTrunkGroup` DISABLE KEYS */;
/*!40000 ALTER TABLE `_TrunkToTrunkGroup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('02c496d1-f22a-45e9-8f51-462189bfa5ea','59bd34f688c28b4f1fed02f0b6dda352044b0617126844f70a039069d161fa3e','2025-05-08 11:39:42.613','20250508113942_addded_priority_to_number_manipulation',NULL,NULL,'2025-05-08 11:39:42.563',1),('0507af33-b512-4dc8-a265-607e95a36934','2ad424ea110c967c42bd9c2b76160c5d4df4f334d6d2349f925078f99a0882c6','2025-04-25 12:22:06.384','20250425122206_some_extension_changes',NULL,NULL,'2025-04-25 12:22:06.340',1),('05c0e06b-cede-4ac3-a625-f822a7e0f5b1','82531e95daa45fdae5b06d178e1ee92061c7b3488ca6246d8a592b8fff83db91','2025-04-24 11:08:18.924','20250423130216_corrected_append_and_prepend',NULL,NULL,'2025-04-24 11:08:18.911',1),('1ed54731-de5d-4185-ab25-439685677f8d','50aebb2b5ea7a615059b4c6a3c2ae975eeb974a82a8c5a6b2b421ce60dd998ae','2025-06-19 09:16:26.546','20250619091624_added_account_code_to_trunk_model',NULL,NULL,'2025-06-19 09:16:26.520',1),('1f9dcf3a-3480-43a1-8775-595532dc62f7','11bef9e350a9ccdf85a9f174da8ba93d4862c938e9eb821885e18a3a9fd65aa9','2025-04-24 11:08:18.712','20250417130211_fix_outgoingroute',NULL,NULL,'2025-04-24 11:08:18.656',1),('3a392b61-7e16-478b-8ff8-678ae36163b2','2f88128196bcd35f443538b74d5c4b015751e5b8d5ba809ccd16c098d114d90a','2025-04-24 11:08:18.985','20250424110224_add_cos_to_extension',NULL,NULL,'2025-04-24 11:08:18.928',1),('59344d1e-a4ce-4036-b85e-7a5062b93d88','781d30cec4ad679d184c9df1f973adabd8109a2051305330b71cee563ba5a94b','2025-06-09 07:29:38.889','20250609072938_added_incoming_route_model',NULL,NULL,'2025-06-09 07:29:38.778',1),('668c2a09-7c48-433e-b702-6c7c5af3203e','f22da40d644a80988da2c8c38c5433b7c3938482d9897be6b779efb5281e57f7','2025-04-24 11:08:18.304','20250318123543_init',NULL,NULL,'2025-04-24 11:08:18.152',1),('683a48a1-0f4e-47dc-add0-b9a4c92d8771','9b5687d946c51f0def1e4fbde457566bebb15632188a99be27687205ff769037','2025-04-29 10:23:24.413','20250429102324_added_ps_registrations',NULL,NULL,'2025-04-29 10:23:24.382',1),('691b0ad7-2d2e-4c2e-a66f-bca8cd7fbaf5','92fbb981b258e20d7094259efa2b5bc36b6f94e5485b5cbabd2280b1a9a80f5a','2025-04-24 11:08:18.907','20250423120539_corrected_strip_end_field',NULL,NULL,'2025-04-24 11:08:18.865',1),('6e4df56c-ca62-41c0-954d-02ddf12fea27','01c2183ea4074dbdc7134037f4de7165360daff450f0567c7fd61c53268997f7','2025-04-28 09:44:40.919','20250428094440_additional_fileds_on_trunk_table',NULL,NULL,'2025-04-28 09:44:40.892',1),('71016085-273f-46c4-902a-71d4894813aa','e1529a9899ca19e56d414346e2adea7f7c10ad5737ec500d8637e5eec64e73b4','2025-04-24 11:08:18.800','20250423115824_added_number_manipulation',NULL,NULL,'2025-04-24 11:08:18.716',1),('72b1f24a-f5a2-457c-a107-9ab8e41bab57','f9d2c048153f8cb2b0a8a9c5ba3a1b4e386fd0b3ba5e138ff26b6aef76fb57e7','2025-06-18 13:16:44.134','20250618131642_changes_to_trunk_model',NULL,NULL,'2025-06-18 13:16:44.012',1),('746566c2-3a0e-4215-a575-f3f2b8f659a9','da9962c6423d53d0cd53428f03e4600327dc1226f3159a25052d45ae8145753f','2025-04-24 11:08:18.367','20250321075746_add_extension',NULL,NULL,'2025-04-24 11:08:18.339',1),('77edf127-267c-4e63-ad12-7e7c3f316511','e0e55441195235d606243f289c5b7aa5f2874b6fa24d9a4a5f27c90cf337311d','2025-04-28 13:16:12.284','20250428131612_many_to_many_relation_on_trunk_and_trunkgroups',NULL,NULL,'2025-04-28 13:16:12.119',1),('8369cf51-ab69-488a-804a-03cb9d061bfb','3ee4033fc4c3ec476b1537eef940d07619d0efcbc8b563d57f68282065cd09af','2025-06-03 12:55:54.305','20250603125554_fix_for_outgoing_route',NULL,NULL,'2025-06-03 12:55:54.145',1),('87bf5e78-2593-40d0-8aa4-dcf887f96f46','5a14c80178293672da54c9f34632efb31974a67ef3cd425037125b6b52b29ffc','2025-04-24 11:08:18.411','20250327094310_remove',NULL,NULL,'2025-04-24 11:08:18.372',1),('8e5724ce-6a53-48f4-a19d-a7c91a2076bf','4b1c694cb83fd7b4f847416ce2291337cd8f3376d47b88954ece59ae34aa6bf3','2025-04-24 11:08:18.335','20250318124030_extension_tamplate',NULL,NULL,'2025-04-24 11:08:18.310',1),('a5644952-4489-4848-93cd-77cbc2d3d602','4e219086d38e10ee97d211ab438c89205648ae64853283536e7077ec6b60dcf3','2025-04-25 10:05:12.782','20250425100512_added_recordc_calls_cos_id_phone_book_options_to_extension_model',NULL,NULL,'2025-04-25 10:05:12.759',1),('aa2f7a3f-23bb-451e-bf05-f259c381293d','9730e6596f9661308ef5d8b09fa55a734cc871546ac31e62dc3437be61fc91b2','2025-09-01 12:24:20.633','20250901122418_addes_better_auth_models',NULL,NULL,'2025-09-01 12:24:20.469',1),('b3f9f1b3-e550-4d3e-aaf7-39090e92f96e','856b74606ac48f7b41c5959ea84cdea26027478e6c9744df154e0411ea9b03b5','2025-06-10 12:03:13.518','20250610120313_modified_global_settings_model',NULL,NULL,'2025-06-10 12:03:13.496',1),('bba9e350-3bc4-45d2-90d6-a84574b904f1','7009d165e5b602ab025700228602a6b4b52f3be47e9635dc85e9eeec6cc44e52','2025-04-28 09:51:35.758','20250428095135_additional_fields_for_trunk_model',NULL,NULL,'2025-04-28 09:51:35.733',1),('bc2b480e-e40c-4ec9-b160-74c2fbd58d40','37cc75b5ab04727f5a727163a46ae33f283c6c106b9f4c8e2004681ab63d1ea6','2025-04-24 11:08:18.651','20250417065141_added_route_trunk_trunk_group',NULL,NULL,'2025-04-24 11:08:18.415',1),('be204d31-4891-4b20-ade6-43f3350a666d','655ccc96c81e6cf9c2ebdcfb1cafe4bc03385e1c2126104434b17c973e8e6b4f','2025-04-25 06:40:31.042','20250425064031_added_global_settings',NULL,NULL,'2025-04-25 06:40:31.018',1),('c10d068e-fe6a-4435-a929-f03a1e45ef5b','313dd2e977bd5bb8a543a75a6a4df6618477ff9d982170364ef260c6c4ca86f3','2025-07-01 08:56:59.825','20250701085657_added_user',NULL,NULL,'2025-07-01 08:56:59.786',1),('c5c59217-ec28-478c-adfd-c809cdf98c3d','a6cc96e08c993dc372e7ef6c70e423b6269ef7b1a34e763f2af0fe077f567569','2025-04-25 12:08:50.205','20250425120850_changed_filed_type_for_call_record_and_phone_book',NULL,NULL,'2025-04-25 12:08:50.154',1),('c7a12662-755a-4238-9ec1-691f42883507','d306c2335235f5583f4b025624bb6927ce7585af79d73cd753086c0585af8c7b','2025-06-09 09:44:01.904','20250609094401_added_cdr_model',NULL,NULL,'2025-06-09 09:44:01.880',1),('c92fec28-e0e0-4415-9346-40445afec3a6','a70dcf8dc05610e6efc95e7783e6c29105f44aedac22cf00573e7cee93acbe08','2025-06-18 13:19:03.295','20250618131901_relation_update',NULL,NULL,'2025-06-18 13:19:03.224',1),('d8df73c7-3b86-4da7-accf-1fcefc263877','af0da2885383788a958f54cc9df69bd6daac7b9cea71e9799cf2b87dfc4ce1f3','2025-05-21 07:32:49.183','20250521073249_add_direction_to_number_manipulation_model',NULL,NULL,'2025-05-21 07:32:49.159',1),('dd05d5e2-86e0-4078-93c1-d81e1d2d3346','9252a9c6078ef4267c99e3711b95d0102327441c0086d7b75e2e78dc64565ccd','2025-09-02 14:00:10.328','20250902140008_added_admin_to_user_model',NULL,NULL,'2025-09-02 14:00:10.302',1),('de5c5959-93fe-4eee-8939-bf7a9f0b044a','428099133c1a98d8945bcc107a6586ff6d2508f78981fd6513ab5c35605e9bcd','2025-04-29 12:50:42.654','20250429125042_added_match_to_number_manipulation_model',NULL,NULL,'2025-04-29 12:50:42.632',1),('df3e72d9-874d-4922-9f49-a8b7260fb598','49256b1af43ee0553e690088623034a4b849d5618aa534d00a29cf7490198afb','2025-06-19 11:17:38.936','20250619111737_added_extension_relation_to_incoming_route_model',NULL,NULL,'2025-06-19 11:17:38.863',1),('e20a6f60-b2b2-425a-9da9-aa79a64f4f89','ae737f7d94bf2ea18c697ce38503518ac632edef658264e85159b6fd29acaba5','2025-04-28 07:55:59.104','20250428075559_added_provider_and_registration_for_trunk',NULL,NULL,'2025-04-28 07:55:59.044',1),('fa761a8c-3b55-4b8d-b092-904f621199d7','c71d040a64664b1dd4da4ef8c3787c3a87c14b9d1ad7bda5e33a4caedb6443e1','2025-04-24 11:08:18.861','20250423120414_corrected_strip_begin_and_strip_end',NULL,NULL,'2025-04-24 11:08:18.805',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `accountId` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `providerId` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `accessToken` text COLLATE utf8mb4_unicode_ci,
  `refreshToken` text COLLATE utf8mb4_unicode_ci,
  `idToken` text COLLATE utf8mb4_unicode_ci,
  `accessTokenExpiresAt` datetime(3) DEFAULT NULL,
  `refreshTokenExpiresAt` datetime(3) DEFAULT NULL,
  `scope` text COLLATE utf8mb4_unicode_ci,
  `password` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `account_userId_fkey` (`userId`),
  CONSTRAINT `account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES ('yRHtPkwmHdXtRpK3g1BJPBRQuZbs3XNj','PaN4sxf2aA67hyL0gCkW2VgMLmyXQz7j','credential','PaN4sxf2aA67hyL0gCkW2VgMLmyXQz7j',NULL,NULL,NULL,NULL,NULL,NULL,'ecc0dc2d9fcc157e09dc20af3fa1ef71:e6a221b5411b45d9b27b02c2f38806a988fe0b102e6ac0c261dfbb5647316f8a253796b25d963cff7bc605333bcb8c97a68a4db5e6acc278ee6efb01d003ba17','2025-09-05 09:45:27.632','2025-09-05 09:45:27.632');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cdr`
--

DROP TABLE IF EXISTS `cdr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cdr` (
  `accountcode` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `src` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dst` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dcontext` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clid` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `channel` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dstchannel` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastapp` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastdata` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start` datetime DEFAULT NULL,
  `answer` datetime DEFAULT NULL,
  `end` datetime DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `billsec` int DEFAULT NULL,
  `disposition` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amaflags` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userfield` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uniqueid` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkedid` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `peeraccount` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sequence` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cdr`
--

LOCK TABLES `cdr` WRITE;
/*!40000 ALTER TABLE `cdr` DISABLE KEYS */;
/*!40000 ALTER TABLE `cdr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ps_aors`
--

DROP TABLE IF EXISTS `ps_aors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ps_aors` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `default_expiration` int DEFAULT NULL,
  `mailboxes` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `max_contacts` int DEFAULT NULL,
  `minimum_expiration` int DEFAULT NULL,
  `remove_existing` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qualify_frequency` int DEFAULT NULL,
  `authenticate_qualify` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `maximum_expiration` int DEFAULT NULL,
  `outbound_proxy` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `support_path` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qualify_timeout` float DEFAULT NULL,
  `voicemail_extension` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remove_unavailable` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  UNIQUE KEY `id` (`id`),
  KEY `ps_aors_id` (`id`),
  KEY `ps_aors_qualifyfreq_contact` (`qualify_frequency`,`contact`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ps_aors`
--

LOCK TABLES `ps_aors` WRITE;
/*!40000 ALTER TABLE `ps_aors` DISABLE KEYS */;
INSERT INTO `ps_aors` VALUES ('101',NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('103',NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('Missnet',NULL,NULL,NULL,1,NULL,NULL,60,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `ps_aors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ps_auths`
--

DROP TABLE IF EXISTS `ps_auths`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ps_auths` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `auth_type` enum('md5','userpass','google_oauth') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nonce_lifetime` int DEFAULT NULL,
  `md5_cred` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `realm` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refresh_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oauth_clientid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oauth_secret` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  UNIQUE KEY `id` (`id`),
  KEY `ps_auths_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ps_auths`
--

LOCK TABLES `ps_auths` WRITE;
/*!40000 ALTER TABLE `ps_auths` DISABLE KEYS */;
INSERT INTO `ps_auths` VALUES ('101','userpass',NULL,NULL,'Qi,^f7aZ',NULL,'101',NULL,NULL,NULL),('103','userpass',NULL,NULL,'K?n+4y+<',NULL,'103',NULL,NULL,NULL),('Missnet','userpass',NULL,NULL,'fdsafdfsdfsd',NULL,'dfsdfdsf',NULL,NULL,NULL);
/*!40000 ALTER TABLE `ps_auths` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ps_contacts`
--

DROP TABLE IF EXISTS `ps_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ps_contacts` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uri` varchar(511) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expiration_time` bigint DEFAULT NULL,
  `qualify_frequency` int DEFAULT NULL,
  `outbound_proxy` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `path` text COLLATE utf8mb4_unicode_ci,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qualify_timeout` float DEFAULT NULL,
  `reg_server` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `authenticate_qualify` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `via_addr` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `via_port` int DEFAULT NULL,
  `call_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endpoint` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prune_on_boot` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `ps_contacts_uq` (`id`,`reg_server`),
  KEY `ps_contacts_id` (`id`),
  KEY `ps_contacts_qualifyfreq_exp` (`qualify_frequency`,`expiration_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ps_contacts`
--

LOCK TABLES `ps_contacts` WRITE;
/*!40000 ALTER TABLE `ps_contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `ps_contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ps_domain_aliases`
--

DROP TABLE IF EXISTS `ps_domain_aliases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ps_domain_aliases` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `domain` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  UNIQUE KEY `id` (`id`),
  KEY `ps_domain_aliases_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ps_domain_aliases`
--

LOCK TABLES `ps_domain_aliases` WRITE;
/*!40000 ALTER TABLE `ps_domain_aliases` DISABLE KEYS */;
/*!40000 ALTER TABLE `ps_domain_aliases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ps_endpoint_id_ips`
--

DROP TABLE IF EXISTS `ps_endpoint_id_ips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ps_endpoint_id_ips` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `endpoint` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `match` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `match_header` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `match_request_uri` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `srv_lookups` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  UNIQUE KEY `id` (`id`),
  KEY `ps_endpoint_id_ips_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ps_endpoint_id_ips`
--

LOCK TABLES `ps_endpoint_id_ips` WRITE;
/*!40000 ALTER TABLE `ps_endpoint_id_ips` DISABLE KEYS */;
INSERT INTO `ps_endpoint_id_ips` VALUES ('Missnet',NULL,'81.118.0.3',NULL,NULL,NULL);
/*!40000 ALTER TABLE `ps_endpoint_id_ips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ps_endpoints`
--

DROP TABLE IF EXISTS `ps_endpoints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ps_endpoints` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transport` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aors` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `auth` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `context` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `disallow` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `allow` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direct_media` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `connected_line_method` enum('invite','reinvite','update') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direct_media_method` enum('invite','reinvite','update') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direct_media_glare_mitigation` enum('none','outgoing','incoming') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `disable_direct_media_on_nat` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dtmf_mode` enum('rfc4733','inband','info','auto') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `external_media_address` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `force_rport` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ice_support` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `identify_by` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mailboxes` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `moh_suggest` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `outbound_auth` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `outbound_proxy` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rewrite_contact` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rtp_ipv6` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rtp_symmetric` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `send_diversion` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `send_pai` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `send_rpid` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timers_min_se` int DEFAULT NULL,
  `timers` enum('forced','no','required','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timers_sess_expires` int DEFAULT NULL,
  `callerid` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `callerid_privacy` enum('allowed_not_screened','allowed_passed_screened','allowed_failed_screened','allowed','prohib_not_screened','prohib_passed_screened','prohib_failed_screened','prohib','unavailable') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `callerid_tag` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `100rel` enum('no','required','peer_supported','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aggregate_mwi` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trust_id_inbound` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trust_id_outbound` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `use_ptime` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `use_avpf` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `media_encryption` enum('no','sdes','dtls') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inband_progress` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `call_group` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pickup_group` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `named_call_group` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `named_pickup_group` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_state_busy_at` int DEFAULT NULL,
  `fax_detect` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `t38_udptl` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `t38_udptl_ec` enum('none','fec','redundancy') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `t38_udptl_maxdatagram` int DEFAULT NULL,
  `t38_udptl_nat` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `t38_udptl_ipv6` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tone_zone` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `language` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `one_touch_recording` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `record_on_feature` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `record_off_feature` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rtp_engine` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `allow_transfer` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `allow_subscribe` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sdp_owner` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sdp_session` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tos_audio` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tos_video` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cos_audio` int DEFAULT NULL,
  `cos_video` int DEFAULT NULL,
  `sub_min_expiry` int DEFAULT NULL,
  `from_domain` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `from_user` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mwi_from_user` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dtls_verify` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dtls_rekey` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dtls_cert_file` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dtls_private_key` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dtls_cipher` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dtls_ca_file` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dtls_ca_path` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dtls_setup` enum('active','passive','actpass') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `srtp_tag_32` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `media_address` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redirect_method` enum('user','uri_core','uri_pjsip') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `set_var` text COLLATE utf8mb4_unicode_ci,
  `message_context` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `force_avp` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `media_use_received_transport` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accountcode` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_eq_phone` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `moh_passthrough` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `media_encryption_optimistic` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rpid_immediate` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `g726_non_standard` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rtp_keepalive` int DEFAULT NULL,
  `rtp_timeout` int DEFAULT NULL,
  `rtp_timeout_hold` int DEFAULT NULL,
  `bind_rtp_to_media_address` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `voicemail_extension` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deny` varchar(95) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `permit` varchar(95) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `acl` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_deny` varchar(95) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_permit` varchar(95) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_acl` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subscribe_context` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fax_detect_timeout` int DEFAULT NULL,
  `contact_user` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferred_codec_only` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `asymmetric_rtp_codec` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rtcp_mux` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `allow_overlap` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refer_blind_progress` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notify_early_inuse_ringing` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `max_audio_streams` int DEFAULT NULL,
  `max_video_streams` int DEFAULT NULL,
  `webrtc` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dtls_fingerprint` enum('SHA-1','SHA-256') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `incoming_mwi_mailbox` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bundle` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dtls_auto_generate_cert` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `follow_early_media_fork` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accept_multiple_sdp_answers` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `suppress_q850_reason_headers` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mwi_subscribe_replaces_unsolicited` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trust_connected_line` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `send_connected_line` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ignore_183_without_sdp` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codec_prefs_incoming_offer` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codec_prefs_outgoing_offer` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codec_prefs_incoming_answer` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codec_prefs_outgoing_answer` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stir_shaken` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `send_history_info` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `allow_unauthenticated_options` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `t38_bind_udptl_to_media_address` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `geoloc_incoming_call_profile` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `geoloc_outgoing_call_profile` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `incoming_call_offer_pref` enum('local','local_first','remote','remote_first') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `outgoing_call_offer_pref` enum('local','local_merge','local_first','remote','remote_merge','remote_first') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stir_shaken_profile` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `security_negotiation` enum('no','mediasec') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `security_mechanisms` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `send_aoc` enum('off','on','false','true','no','yes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `overlap_context` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tenantid` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  UNIQUE KEY `id` (`id`),
  KEY `ps_endpoints_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ps_endpoints`
--

LOCK TABLES `ps_endpoints` WRITE;
/*!40000 ALTER TABLE `ps_endpoints` DISABLE KEYS */;
INSERT INTO `ps_endpoints` VALUES ('101','transport-tcp','101','101','internal','all','alaw,ulaw,g722,gsm','no',NULL,'invite',NULL,NULL,'auto',NULL,NULL,'no',NULL,NULL,NULL,NULL,NULL,'no',NULL,NULL,'no','yes','yes',NULL,NULL,NULL,'dfasd <101>',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'no',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('103','transport-udp','103','103','internal','all','alaw,ulaw,g722,gsm','no',NULL,'invite',NULL,NULL,'auto',NULL,NULL,'no',NULL,NULL,NULL,NULL,NULL,'no',NULL,NULL,'no','yes','yes',NULL,NULL,NULL,'Test <103>',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'no',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('Missnet','transport-udp','Missnet','Missnet','internal','all','alaw,ulaw,g722,gsm','no',NULL,'invite',NULL,NULL,'auto',NULL,NULL,'no',NULL,NULL,NULL,NULL,NULL,'no',NULL,NULL,'no','yes','yes',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,'no',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `ps_endpoints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ps_registrations`
--

DROP TABLE IF EXISTS `ps_registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ps_registrations` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transport` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `outbound_auth` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_user` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_uri` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `server_uri` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `retry_interval` int DEFAULT NULL,
  `expiration` int DEFAULT NULL,
  `forbidden_retry_interval` int DEFAULT NULL,
  `max_retries` int DEFAULT NULL,
  `endpoint` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  UNIQUE KEY `id` (`id`),
  KEY `ps_registrations_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ps_registrations`
--

LOCK TABLES `ps_registrations` WRITE;
/*!40000 ALTER TABLE `ps_registrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `ps_registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `session` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL,
  `updatedAt` datetime(3) NOT NULL,
  `ipAddress` text COLLATE utf8mb4_unicode_ci,
  `userAgent` text COLLATE utf8mb4_unicode_ci,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_token_key` (`token`),
  KEY `session_userId_fkey` (`userId`),
  CONSTRAINT `session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
INSERT INTO `session` VALUES ('1uDStCM4yhQXc6k9cj5dTkLCiVA32vMK','2026-01-21 13:57:54.362','TRD8SeBueG71B3FJAV6Q0D0cCSCHZ6ke','2026-01-14 13:57:54.362','2026-01-14 13:57:54.362','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','PaN4sxf2aA67hyL0gCkW2VgMLmyXQz7j'),('BJkaqPVoP2lP5BuUE10TPglu3V4Mw5I5','2026-01-19 10:34:41.053','mT984VyCzISIMKwTI7WpzTBBFBauq2OV','2026-01-12 10:34:41.054','2026-01-12 10:34:41.054','','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','PaN4sxf2aA67hyL0gCkW2VgMLmyXQz7j'),('dWiFGpQDAX2Eau44eQWrBJDnQHmJOyWd','2026-01-20 12:00:03.862','MQYjUBlMfDaTByOIpNtWRLYJboDc1ooq','2026-01-13 12:00:03.863','2026-01-13 12:00:03.863','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','PaN4sxf2aA67hyL0gCkW2VgMLmyXQz7j'),('g6WqpKT1i9OfcEPpkN9DMuHQcZlzGBsE','2026-01-22 09:47:19.724','2n2Q0lAG3z90yGRJ9q31eIz0P7qyH9Zi','2026-01-15 09:47:19.724','2026-01-15 09:47:19.724','','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','PaN4sxf2aA67hyL0gCkW2VgMLmyXQz7j'),('hU32z0AUIYwCBA8GEGHUb6Y1dfW2qaLO','2026-01-26 08:53:56.052','iqCqO1S8pYLJynCuTzvkqD0u0eQvoN2R','2026-01-19 08:53:56.052','2026-01-19 08:53:56.052','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','PaN4sxf2aA67hyL0gCkW2VgMLmyXQz7j'),('iyA2lIV9wuVHXFvZQRIMRiX6YfbKwzAN','2026-01-16 13:48:55.252','2dIBwhXKoee8uM5xkhbRbzGjjcVYfWpd','2026-01-09 13:48:55.253','2026-01-09 13:48:55.253','','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','PaN4sxf2aA67hyL0gCkW2VgMLmyXQz7j'),('JzksGmREkS727cIuro2hv20AWk5VLtI9','2026-01-19 08:05:03.059','2u697OZFU3PMl6VrzzXAVeBYVL9439MQ','2026-01-12 08:05:03.059','2026-01-12 08:05:03.059','','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','PaN4sxf2aA67hyL0gCkW2VgMLmyXQz7j'),('lDfm9OsQ4MmkaIQ8DaeQmoLeJAsIhCze','2026-01-26 11:37:43.173','Ikgzw1hZpmmrhOAw4y617evar38h8dU7','2026-01-19 11:37:43.173','2026-01-19 11:37:43.173','','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','PaN4sxf2aA67hyL0gCkW2VgMLmyXQz7j'),('macJOj00i7HjYbsAEYwu9a6q8dnViLvG','2026-01-19 12:20:29.491','qHLdYYFNsaN6LTKr9Iypbbis2n4LsgPV','2026-01-12 12:20:29.504','2026-01-12 12:20:29.504','','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','PaN4sxf2aA67hyL0gCkW2VgMLmyXQz7j'),('Qnnr03KBkeL0Q7fzg7pNAFQp0DoTn51v','2026-01-16 13:49:10.242','hGQwNIttJOLwd3OgUHWLtNo4Bcsknfgv','2026-01-09 13:49:10.242','2026-01-09 13:49:10.242','','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','PaN4sxf2aA67hyL0gCkW2VgMLmyXQz7j'),('RoAeW3JsKofzEQLmM2DJcs2cIhcbcW0G','2026-01-20 12:44:22.877','gt76tQVG20VdbaH9zsRnjrmjcuHmRF0d','2026-01-13 12:44:22.877','2026-01-13 12:44:22.877','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','PaN4sxf2aA67hyL0gCkW2VgMLmyXQz7j'),('uatvnCU92MWElndHB8WbYam64K0p5dmX','2026-01-23 07:27:43.268','lBAs7YPnObn8fJ0aCmtEGhsPOOx5UjSp','2026-01-16 07:27:43.269','2026-01-16 07:27:43.269','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','PaN4sxf2aA67hyL0gCkW2VgMLmyXQz7j');
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `emailVerified` tinyint(1) NOT NULL,
  `image` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL,
  `updatedAt` datetime(3) NOT NULL,
  `banExpires` datetime(3) DEFAULT NULL,
  `banReason` text COLLATE utf8mb4_unicode_ci,
  `banned` tinyint(1) DEFAULT NULL,
  `role` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('PaN4sxf2aA67hyL0gCkW2VgMLmyXQz7j','Admin Admin','admin@gmail.com',1,'/avatars/default_avatar.jpg','2025-09-05 09:45:27.616','2025-09-05 09:45:27.616',NULL,NULL,0,'admin');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verification`
--

DROP TABLE IF EXISTS `verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verification` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `identifier` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `createdAt` datetime(3) DEFAULT NULL,
  `updatedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verification`
--

LOCK TABLES `verification` WRITE;
/*!40000 ALTER TABLE `verification` DISABLE KEYS */;
/*!40000 ALTER TABLE `verification` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-19 14:57:04
