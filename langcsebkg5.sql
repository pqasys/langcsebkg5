-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 19, 2025 at 12:06 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `langcsebkg5`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_settings`
--

DROP TABLE IF EXISTS `admin_settings`;
CREATE TABLE IF NOT EXISTS `admin_settings` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `allowInstitutionPaymentApproval` tinyint(1) NOT NULL DEFAULT '1',
  `showInstitutionApprovalButtons` tinyint(1) NOT NULL DEFAULT '1',
  `defaultPaymentStatus` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `institutionApprovableMethods` json NOT NULL,
  `adminOnlyMethods` json NOT NULL,
  `institutionPaymentApprovalExemptions` json NOT NULL,
  `fileUploadMaxSizeMB` int NOT NULL DEFAULT '10',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_settings`
--

INSERT INTO `admin_settings` (`id`, `createdAt`, `updatedAt`, `allowInstitutionPaymentApproval`, `showInstitutionApprovalButtons`, `defaultPaymentStatus`, `institutionApprovableMethods`, `adminOnlyMethods`, `institutionPaymentApprovalExemptions`, `fileUploadMaxSizeMB`) VALUES
('1', '2025-06-23 00:12:12.357', '2025-06-23 15:46:42.013', 0, 0, 'PENDING', '[\"MANUAL\", \"BANK_TRANSFER\", \"CASH\", \"OFFLINE\"]', '[\"CREDIT_CARD\", \"PAYPAL\", \"STRIPE\"]', '[\"c5962019-07ca-4a78-a97f-3cf394e5bf94\", \"42308252-a934-4eef-b663-37a7076bb177\"]', 10);

-- --------------------------------------------------------

--
-- Table structure for table `advertising_items`
--

DROP TABLE IF EXISTS `advertising_items`;
CREATE TABLE IF NOT EXISTS `advertising_items` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageUrl` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ctaText` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ctaLink` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `targetAudience` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `targetLocation` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `targetDevice` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startDate` datetime(3) DEFAULT NULL,
  `endDate` datetime(3) DEFAULT NULL,
  `maxImpressions` int DEFAULT NULL,
  `currentImpressions` int NOT NULL DEFAULT '0',
  `maxClicks` int DEFAULT NULL,
  `currentClicks` int NOT NULL DEFAULT '0',
  `designConfigId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isApproved` tinyint(1) NOT NULL DEFAULT '0',
  `createdBy` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `advertising_items_designConfigId_fkey` (`designConfigId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `resource` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `resourceId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `details` json DEFAULT NULL,
  `ipAddress` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userAgent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `sessionId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `severity` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `metadata` json DEFAULT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `audit_logs_userId_idx` (`userId`),
  KEY `audit_logs_action_idx` (`action`),
  KEY `audit_logs_resource_idx` (`resource`),
  KEY `audit_logs_severity_idx` (`severity`),
  KEY `audit_logs_category_idx` (`category`),
  KEY `audit_logs_timestamp_idx` (`timestamp`),
  KEY `audit_logs_ipAddress_idx` (`ipAddress`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
CREATE TABLE IF NOT EXISTS `booking` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institutionId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `studentId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `stateVersion` int NOT NULL DEFAULT '1',
  `version` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `Booking_courseId_fkey` (`courseId`),
  KEY `Booking_institutionId_fkey` (`institutionId`),
  KEY `Booking_studentId_fkey` (`studentId`),
  KEY `Booking_userId_fkey` (`userId`),
  KEY `idx_booking_course_id` (`courseId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`id`, `courseId`, `institutionId`, `status`, `amount`, `createdAt`, `updatedAt`, `studentId`, `userId`, `stateVersion`, `version`) VALUES
('ec0af15d-517a-4ca5-aeb9-87b6a6eea36d', '12de3567-2474-4760-a8ff-f58d22cde02d', 'c5962019-07ca-4a78-a97f-3cf394e5bf94', 'COMPLETED', 11200, '2025-06-23 22:17:52.038', '2025-06-23 22:21:53.054', '5b5fbd13-8776-4f96-ada9-091973974873', '5b5fbd13-8776-4f96-ada9-091973974873', 1, 1),
('a5badc1a-bd86-47e8-ab57-21242c846c9b', 'd5975219-7eda-4507-bc4c-3fe2048dfc06', '42308252-a934-4eef-b663-37a7076bb177', 'COMPLETED', 2750, '2025-06-26 10:50:17.143', '2025-06-26 10:57:39.193', '5b5fbd13-8776-4f96-ada9-091973974873', '5b5fbd13-8776-4f96-ada9-091973974873', 1, 1),
('aca07f00-f420-4e10-a287-79e6aea6dcf6', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 'c5962019-07ca-4a78-a97f-3cf394e5bf94', 'COMPLETED', 2430, '2025-06-30 18:33:20.462', '2025-07-14 01:54:44.095', '5b5fbd13-8776-4f96-ada9-091973974873', '5b5fbd13-8776-4f96-ada9-091973974873', 1, 1),
('dec75da4-2aa7-491e-ae5d-4b82a107cc3c', '78bfbb28-7f43-423d-9454-1910b1fdabcf', '42308252-a934-4eef-b663-37a7076bb177', 'COMPLETED', 3500, '2025-07-23 12:18:46.974', '2025-08-08 16:56:10.944', '5b5fbd13-8776-4f96-ada9-091973974873', '5b5fbd13-8776-4f96-ada9-091973974873', 1, 1),
('e7dd0f1c-5f9a-4992-8303-0f1498d7a6cc', '7e806add-bd45-43f6-a28f-fb736707653c', '42308252-a934-4eef-b663-37a7076bb177', 'PENDING', 740, '2025-07-23 12:30:50.268', '2025-07-23 12:30:50.263', '5b5fbd13-8776-4f96-ada9-091973974873', '5b5fbd13-8776-4f96-ada9-091973974873', 1, 1),
('895800ac-ede6-452c-b28c-da240c405b2f', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 'c5962019-07ca-4a78-a97f-3cf394e5bf94', 'COMPLETED', 1360, '2025-07-23 16:22:57.272', '2025-08-08 16:14:55.257', '5b5fbd13-8776-4f96-ada9-091973974873', '5b5fbd13-8776-4f96-ada9-091973974873', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `slug` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_slug_key` (`slug`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`, `description`, `createdAt`, `updatedAt`, `slug`) VALUES
('cdaa1ca3-0e2d-4cc2-b2da-c5626b5888a0', 'Test Preparation', 'Courses for standardized language tests', '2025-06-05 23:29:09.420', '2025-06-05 23:29:09.420', 'test-preparation'),
('3f6ef397-0c98-4d1d-937f-e47fce5775a3', 'Exam Preparation', 'Courses for IELTS, TOEFL, Cambridge exams', '2025-06-06 00:21:37.373', '2025-06-06 00:21:37.373', 'exam-preparation'),
('ee97012a-5fca-47df-ab1c-86f4acc180c0', 'Specialized & Context-Based', 'Language courses for specific contexts, industries, and specialized purposes including business, academic, medical, legal, technical, cultural, and other professional or specialized domains', '2025-06-29 14:40:23.591', '2025-06-29 14:40:23.591', 'specialized-context-based'),
('f9ab03c0-acbe-4974-a1f5-1fff81e97269', 'Conversation & Speaking', 'Focus on oral communication, pronunciation, and conversational skills', '2025-06-29 14:33:23.765', '2025-06-29 14:33:23.765', 'conversation-speaking'),
('d75c3d08-20d2-445b-bca3-cb2c9b4c3a62', 'Grammar & Structure', 'In-depth study of language grammar, syntax, and sentence structure', '2025-06-29 14:33:23.773', '2025-06-29 14:33:23.773', 'grammar-structure'),
('62a98fdf-1b43-40b9-9f9a-880dd32978df', 'Vocabulary & Expressions', 'Expanding vocabulary knowledge, idioms, and common expressions', '2025-06-29 14:33:23.779', '2025-06-29 14:33:23.779', 'vocabulary-expressions'),
('5ac9fb50-c33f-477f-b4c1-60ca67bef120', 'Reading & Comprehension', 'Improving reading skills, text analysis, and comprehension strategies', '2025-06-29 14:33:23.785', '2025-06-29 14:33:23.785', 'reading-comprehension'),
('b910749d-3d96-4b98-9436-8abc2194b118', 'Writing & Composition', 'Developing writing skills for various purposes and contexts', '2025-06-29 14:33:23.791', '2025-06-29 14:33:23.791', 'writing-composition'),
('08a59a87-946a-410c-9eef-1440e7fa3138', 'Listening & Understanding', 'Enhancing listening comprehension and audio processing skills', '2025-06-29 14:33:23.795', '2025-06-29 14:33:23.795', 'listening-understanding'),
('a7028e20-0498-4ab8-aa50-e1be280a352d', 'Pronunciation & Accent', 'Perfecting pronunciation, intonation, and accent reduction', '2025-06-29 14:33:23.803', '2025-06-29 14:33:23.803', 'pronunciation-accent'),
('0b20b5fb-22a6-4e76-85d2-90cbbcb365b9', 'Young Learners', 'Specialized courses designed for children and teenagers', '2025-06-29 14:33:23.830', '2025-06-29 14:33:23.830', 'young-learners'),
('d160aaba-396a-42d6-acba-cedeb45f9382', 'Adult Learners', 'Courses tailored for adult learners with specific goals and schedules', '2025-06-29 14:33:23.837', '2025-06-29 14:33:23.837', 'adult-learners'),
('8c6c1424-e1f3-462b-8e3c-e35390ca7180', 'One-to-One Tutoring', 'Personalized individual lessons with customized learning plans', '2025-06-29 14:33:23.843', '2025-06-29 14:33:23.843', 'one-to-one-tutoring'),
('a0005960-7960-4fe3-9849-a51ff218670b', 'Group Classes', 'Interactive group learning environments for collaborative practice', '2025-06-29 14:33:23.848', '2025-06-29 14:33:23.848', 'group-classes'),
('9a8557e3-bb34-467c-90f8-6c621f338a19', 'Intensive Courses', 'Fast-paced, immersive courses for rapid language acquisition', '2025-06-29 14:33:23.854', '2025-06-29 14:33:23.854', 'intensive-courses'),
('8eb1f92f-3786-4017-9af4-6f6ff2babd05', 'Online & Virtual', 'Digital learning programs with flexible scheduling and remote access', '2025-06-29 14:33:23.858', '2025-06-29 14:33:23.858', 'online-virtual'),
('ce366ec5-bc1c-45c3-976e-11dd7c69600d', 'Blended Learning', 'Combined online and in-person learning experiences', '2025-06-29 14:33:23.862', '2025-06-29 14:33:23.862', 'blended-learning'),
('f38802ff-daee-4361-a92a-9116cd4da630', 'General English', 'Courses for everyday English communication', '2025-07-14 11:19:56.495', '2025-07-14 11:19:56.495', 'general-english'),
('67dd6c79-f824-426e-8edc-e78c2d32e85c', 'Business English', 'Courses for professional and business English', '2025-07-14 11:19:56.495', '2025-07-14 11:19:56.495', 'business-english'),
('c89ec824-2b38-435f-ae66-1f215663369b', 'Conversation Skills', 'Courses focused on speaking and listening', '2025-07-14 11:19:56.495', '2025-07-14 11:19:56.495', 'conversation-skills'),
('c7ee11f4-44e5-47f1-ad67-f497c5e89f11', 'General Language', 'Courses for everyday language communication', '2025-07-25 17:49:04.556', '2025-07-25 17:49:04.556', 'general-language'),
('a495e997-47b3-4e59-b88c-978cfe9a4c02', 'Business Language', 'Courses for professional and business language', '2025-07-25 17:49:04.556', '2025-07-25 17:49:04.556', 'business-language'),
('d8698c26-6c35-47bd-be7b-b6ba2e44cac4', 'Academic Language', 'Language courses designed for academic study and research', '2025-07-25 17:49:16.071', '2025-07-25 17:49:16.071', 'academic-language'),
('30bf6adc-96b7-4044-ba3b-afef6454c0d4', 'Conversation', 'Focus on speaking and listening skills for everyday communication', '2025-07-25 17:49:16.087', '2025-07-25 17:49:16.087', 'conversation'),
('0eb7c3de-6fe7-4979-bd39-d8e6403fda9b', 'Grammar', 'In-depth study of language grammar rules and structures', '2025-07-25 17:49:16.097', '2025-07-25 17:49:16.097', 'grammar'),
('61093101-5970-420b-8679-353e130043c0', 'Pronunciation', 'Courses focusing on correct pronunciation and accent reduction', '2025-07-25 17:49:16.103', '2025-07-25 17:49:16.103', 'pronunciation'),
('ae39b24c-a80e-4e54-958f-2d9862dbcb84', 'Writing Skills', 'Development of writing skills for various purposes and contexts', '2025-07-25 17:49:16.110', '2025-07-25 17:49:16.110', 'writing-skills'),
('a276b69a-247c-4f6d-83fa-4efbdda86b29', 'Listening Skills', 'Enhancing listening comprehension and note-taking abilities', '2025-07-25 17:49:16.116', '2025-07-25 17:49:16.116', 'listening-skills'),
('8cf0d4aa-0f31-4dcd-9dff-57add170b32d', 'Vocabulary Building', 'Expanding vocabulary knowledge and usage', '2025-07-25 17:49:16.120', '2025-07-25 17:49:16.120', 'vocabulary-building'),
('9832d2a5-ace9-4659-ba77-8a7512af4b9a', 'One-to-One', 'Personalized individual language lessons', '2025-07-25 17:49:16.123', '2025-07-25 17:49:16.123', 'one-to-one'),
('628bcc5b-ee35-43f1-b76a-7f5b5c71a062', 'Summer Courses', 'Seasonal language courses with cultural activities', '2025-07-25 17:49:16.135', '2025-07-25 17:49:16.135', 'summer-courses'),
('4d63ac99-29fa-46f2-9a48-1adabdba8465', 'Online Courses', 'Virtual language learning programs', '2025-07-25 17:49:16.141', '2025-07-25 17:49:16.141', 'online-courses'),
('427e6fb8-eeda-4921-844b-f94470af77e2', 'Specialized Language', 'Language courses for specific industries or purposes', '2025-07-25 17:49:16.154', '2025-07-25 17:49:16.154', 'specialized-language');

-- --------------------------------------------------------

--
-- Table structure for table `commissionratelog`
--

DROP TABLE IF EXISTS `commissionratelog`;
CREATE TABLE IF NOT EXISTS `commissionratelog` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institutionId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `previousRate` double NOT NULL,
  `newRate` double NOT NULL,
  `changedBy` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `changedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `CommissionRateLog_changedBy_idx` (`changedBy`),
  KEY `CommissionRateLog_institutionId_idx` (`institutionId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `commission_tiers`
--

DROP TABLE IF EXISTS `commission_tiers`;
CREATE TABLE IF NOT EXISTS `commission_tiers` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `planType` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `commissionRate` double NOT NULL,
  `features` json NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double NOT NULL,
  `currency` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `billingCycle` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MONTHLY',
  `maxStudents` int NOT NULL DEFAULT '10',
  `maxCourses` int NOT NULL DEFAULT '5',
  `maxTeachers` int NOT NULL DEFAULT '2',
  PRIMARY KEY (`id`),
  UNIQUE KEY `commission_tiers_planType_key` (`planType`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `commission_tiers`
--

INSERT INTO `commission_tiers` (`id`, `planType`, `commissionRate`, `features`, `isActive`, `createdAt`, `updatedAt`, `name`, `description`, `price`, `currency`, `billingCycle`, `maxStudents`, `maxCourses`, `maxTeachers`) VALUES
('cmcjo5f2b0000man3v5b54dxt', 'STARTER', 25, '{\"apiAccess\": false, \"maxCourses\": 5, \"whiteLabel\": false, \"maxStudents\": 50, \"maxTeachers\": 2, \"emailSupport\": true, \"mobileAccess\": true, \"basicAnalytics\": true, \"customBranding\": false, \"marketingTools\": false, \"prioritySupport\": false, \"studentProgress\": true, \"courseManagement\": true, \"advancedAnalytics\": false, \"paymentProcessing\": true, \"videoConferencing\": false, \"certificateGeneration\": true}', 1, '2025-06-30 22:26:59.075', '2025-07-28 19:53:13.667', 'Starter Plan', 'Perfect for small language schools getting started online', 99, 'USD', 'MONTHLY', 50, 5, 2),
('cmcjo5f2n0001man32g2nxct8', 'PROFESSIONAL', 15, '{\"apiAccess\": false, \"maxCourses\": 15, \"whiteLabel\": false, \"maxStudents\": 200, \"maxTeachers\": 5, \"emailSupport\": true, \"mobileAccess\": true, \"basicAnalytics\": true, \"customBranding\": true, \"marketingTools\": true, \"prioritySupport\": true, \"revenueTracking\": true, \"studentProgress\": true, \"courseManagement\": true, \"advancedAnalytics\": true, \"paymentProcessing\": true, \"studentManagement\": true, \"videoConferencing\": \"limited\", \"advancedCertificates\": true, \"multiLanguageSupport\": true, \"certificateGeneration\": true}', 1, '2025-06-30 22:26:59.087', '2025-07-28 19:53:13.669', 'Professional Plan', 'Ideal for growing institutions with multiple courses', 299, 'USD', 'MONTHLY', 200, 15, 5),
('cmcjo5f2s0002man3kimifkjj', 'ENTERPRISE', 10, '{\"apiAccess\": true, \"maxCourses\": 50, \"whiteLabel\": true, \"maxStudents\": 1000, \"maxTeachers\": 20, \"emailSupport\": true, \"mobileAccess\": true, \"basicAnalytics\": true, \"customBranding\": true, \"marketingTools\": true, \"customReporting\": true, \"prioritySupport\": true, \"revenueTracking\": true, \"studentProgress\": true, \"advancedSecurity\": true, \"courseManagement\": true, \"advancedAnalytics\": true, \"paymentProcessing\": true, \"studentManagement\": true, \"videoConferencing\": \"unlimited\", \"customIntegrations\": true, \"advancedCertificates\": true, \"multiLanguageSupport\": true, \"multiLocationSupport\": true, \"certificateGeneration\": true, \"dedicatedAccountManager\": true}', 1, '2025-06-30 22:26:59.092', '2025-07-28 19:53:13.670', 'Enterprise Plan', 'Complete solution for large language organizations', 799, 'USD', 'MONTHLY', 1000, 50, 20);

-- --------------------------------------------------------

--
-- Table structure for table `content_items`
--

DROP TABLE IF EXISTS `content_items`;
CREATE TABLE IF NOT EXISTS `content_items` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `module_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('VIDEO','AUDIO','IMAGE','DOCUMENT') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_index` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_content_items_module_id` (`module_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `content_items`
--

INSERT INTO `content_items` (`id`, `module_id`, `type`, `title`, `order_index`, `created_at`, `updated_at`, `content`) VALUES
('f0f5fd72-835c-441d-9988-4882882c26ee', '2070f139-4946-11f0-9f87-0a0027000007', 'VIDEO', 'Sample Listening Test', 0, '2025-06-18 16:34:11', '2025-06-18 16:34:11', '/uploads/42308252-a934-4eef-b663-37a7076bb177/e9b6464b-d232-4c5f-a2b4-f30865e9237d/videos/0d98997c-3fb2-4496-9217-0be77dda678f.mp4');

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
CREATE TABLE IF NOT EXISTS `course` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `duration` int NOT NULL,
  `level` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institutionId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoryId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `maxStudents` int NOT NULL DEFAULT '15',
  `base_price` double NOT NULL DEFAULT '0',
  `pricingPeriod` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'WEEKLY',
  `framework` enum('CEFR','ACTFL','JLPT','HSK','TOPIK') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CEFR',
  `isFeatured` tinyint(1) NOT NULL DEFAULT '0',
  `isSponsored` tinyint(1) NOT NULL DEFAULT '0',
  `priority` int NOT NULL DEFAULT '0',
  `isPlatformCourse` tinyint(1) NOT NULL DEFAULT '0',
  `liveClassFrequency` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `liveClassSchedule` json DEFAULT NULL,
  `requiresSubscription` tinyint(1) NOT NULL DEFAULT '0',
  `subscriptionTier` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hasLiveClasses` tinyint(1) NOT NULL DEFAULT '0',
  `liveClassType` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `marketingDescription` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `marketingType` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SELF_PACED',
  `slug` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `course_slug_key` (`slug`),
  UNIQUE KEY `Course_title_institutionId_key` (`title`,`institutionId`),
  KEY `Course_categoryId_fkey` (`categoryId`),
  KEY `Course_institutionId_fkey` (`institutionId`),
  KEY `Course_status_idx` (`status`),
  KEY `Course_level_idx` (`level`),
  KEY `Course_createdAt_idx` (`createdAt`),
  KEY `Course_institution_status_idx` (`institutionId`,`status`),
  KEY `idx_course_created_at` (`createdAt`),
  KEY `course_isPlatformCourse_idx` (`isPlatformCourse`),
  KEY `course_requiresSubscription_idx` (`requiresSubscription`),
  KEY `course_hasLiveClasses_idx` (`hasLiveClasses`),
  KEY `course_marketingType_idx` (`marketingType`),
  KEY `Course_slug_idx` (`slug`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`id`, `title`, `description`, `duration`, `level`, `status`, `institutionId`, `categoryId`, `createdAt`, `updatedAt`, `startDate`, `endDate`, `maxStudents`, `base_price`, `pricingPeriod`, `framework`, `isFeatured`, `isSponsored`, `priority`, `isPlatformCourse`, `liveClassFrequency`, `liveClassSchedule`, `requiresSubscription`, `subscriptionTier`, `hasLiveClasses`, `liveClassType`, `marketingDescription`, `marketingType`, `slug`) VALUES
('5002bdce-b66b-4be2-95b7-a1d08d8c0981', 'General English', 'General English language courses are designed to improve your general English language level for use in everyday situations...', 150, 'CEFR_A1', 'PUBLISHED', 'c5962019-07ca-4a78-a97f-3cf394e5bf94', 'f9ab03c0-acbe-4974-a1f5-1fff81e97269', '2025-06-06 16:06:22.981', '2025-08-17 16:19:03.757', '2025-07-10 23:15:00.877', '2026-09-05 00:00:00.000', 15, 210, 'WEEKLY', 'CEFR', 1, 0, 95, 0, NULL, NULL, 0, NULL, 0, NULL, 'General English - Self-paced learning', 'SELF_PACED', 'general-english'),
('e9b6464b-d232-4c5f-a2b4-f30865e9237d', 'IELTS Exam Preparation', 'The IELTS (International English Language Testing Systems) exam is a good choice if you\'re preparing to study or work in an English-speaking country.', 150, 'CEFR_A1', 'PUBLISHED', '42308252-a934-4eef-b663-37a7076bb177', '3f6ef397-0c98-4d1d-937f-e47fce5775a3', '2025-06-08 22:15:49.068', '2025-08-17 16:19:04.013', '2025-07-17 23:15:00.884', '2025-09-05 00:00:00.000', 15, 210, 'WEEKLY', 'CEFR', 0, 0, 85, 0, NULL, NULL, 0, NULL, 0, NULL, 'IELTS Exam Preparation - Self-paced learning', 'SELF_PACED', 'ielts-exam-preparation'),
('d5975219-7eda-4507-bc4c-3fe2048dfc06', 'Business English', 'The course will cover necessary business skills such as telephone language, English for business meetings, presentations, report writing, emailing, and liaising with clients.', 150, 'CEFR_B1', 'PUBLISHED', '42308252-a934-4eef-b663-37a7076bb177', 'a495e997-47b3-4e59-b88c-978cfe9a4c02', '2025-06-08 22:20:04.812', '2025-08-17 16:19:04.022', '2025-07-24 00:00:00.000', '2025-09-19 00:00:00.000', 15, 2750, 'FULL_COURSE', 'CEFR', 0, 0, 75, 0, NULL, NULL, 0, NULL, 0, NULL, 'Business English - Self-paced learning', 'SELF_PACED', 'business-english'),
('78bfbb28-7f43-423d-9454-1910b1fdabcf', 'One-to-One English', 'Our One to One English lessons give you the chance to follow a course that is entirely tailored to your requirements.', 10, 'CEFR_B1', 'PUBLISHED', '42308252-a934-4eef-b663-37a7076bb177', 'f9ab03c0-acbe-4974-a1f5-1fff81e97269', '2025-06-13 01:03:25.457', '2025-08-17 16:19:04.031', '2025-07-07 00:00:00.000', '2025-08-29 00:00:00.000', 25, 3500, 'FULL_COURSE', 'CEFR', 0, 0, 0, 0, NULL, NULL, 0, NULL, 0, NULL, 'One-to-One English - Self-paced learning', 'SELF_PACED', 'one-to-one-english'),
('12de3567-2474-4760-a8ff-f58d22cde02d', 'English for Academic Purposes', 'English for Academic Purposes (EAP) is an English language course for speakers of other languages. The course is designed to bring English skills to a level that will help students be successful in college courses.', 150, 'CEFR_B2', 'PUBLISHED', 'c5962019-07ca-4a78-a97f-3cf394e5bf94', 'ee97012a-5fca-47df-ab1c-86f4acc180c0', '2025-06-13 12:11:28.930', '2025-08-17 16:19:04.043', '2025-07-07 00:00:00.000', '2025-10-10 00:00:00.000', 15, 3500, 'MONTHLY', 'CEFR', 0, 0, 0, 0, NULL, NULL, 0, NULL, 0, NULL, 'English for Academic Purposes - Self-paced learning', 'SELF_PACED', 'english-for-academic-purposes'),
('9c8dc68e-b7b7-4362-b4cc-c3913682b4a8', 'IELTS Exam Preparation', 'The IELTS (International English Language Testing Systems) exam is a good choice if you\'re preparing to study or work in an English-speaking country....', 150, 'CEFR_B2', 'PUBLISHED', 'c5962019-07ca-4a78-a97f-3cf394e5bf94', '3f6ef397-0c98-4d1d-937f-e47fce5775a3', '2025-06-13 12:18:22.744', '2025-08-17 16:19:04.054', '2025-07-07 00:00:00.000', '2025-09-12 00:00:00.000', 25, 720, 'MONTHLY', 'CEFR', 0, 0, 0, 0, NULL, NULL, 0, NULL, 0, NULL, 'IELTS Exam Preparation - Self-paced learning', 'SELF_PACED', 'ielts-exam-preparation-1'),
('c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 'Cambridge Exams Preparation - CPE', 'The Cambridge examinations are recognised worldwide as a proof of your English language ability. They can be useful when applying for jobs where English Language competence is assessed, and, in some cases, for universities.', 150, 'CEFR_B2', 'PUBLISHED', 'c5962019-07ca-4a78-a97f-3cf394e5bf94', '3f6ef397-0c98-4d1d-937f-e47fce5775a3', '2025-06-13 12:32:01.989', '2025-08-17 16:19:04.063', '2025-07-07 00:00:00.000', '2025-09-12 00:00:00.000', 15, 270, 'WEEKLY', 'CEFR', 0, 0, 0, 0, NULL, 'null', 0, NULL, 0, NULL, NULL, 'IN_PERSON', 'cambridge-exams-preparation-cpe'),
('7e806add-bd45-43f6-a28f-fb736707653c', 'Conversation & Pronunciation', 'Our Conversation and Pronunciation classes take place in small groups to allow as much speaking time as possible.', 10, 'CEFR_A1', 'PUBLISHED', '42308252-a934-4eef-b663-37a7076bb177', 'f9ab03c0-acbe-4974-a1f5-1fff81e97269', '2025-06-13 17:12:21.300', '2025-08-17 16:19:04.069', '2025-07-07 00:00:00.000', '2025-09-12 00:00:00.000', 15, 100, 'WEEKLY', 'CEFR', 0, 0, 0, 0, NULL, NULL, 0, NULL, 0, NULL, 'Conversation & Pronunciation - Self-paced learning', 'SELF_PACED', 'conversation-pronunciation'),
('6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 'General French', 'Learn French in the heart of London on this lively interactive course for beginners. The course will be taught in French, with an emphasis on developing your speaking and listening skills.', 12, 'CEFR_A1', 'PUBLISHED', '42308252-a934-4eef-b663-37a7076bb177', 'c7ee11f4-44e5-47f1-ad67-f497c5e89f11', '2025-07-26 15:47:30.135', '2025-08-17 16:19:04.083', '2025-09-01 00:00:00.000', '2025-11-21 00:00:00.000', 15, 210, 'WEEKLY', 'CEFR', 0, 0, 0, 0, NULL, NULL, 0, NULL, 0, NULL, 'General French - Self-paced learning', 'SELF_PACED', 'general-french'),
('21058bb2-c9f3-4af1-90fc-235b350f5718', 'Advanced Spanish Conversation - Live Classes', 'Master Spanish conversation through interactive live sessions with native speakers. This intensive course features real-time practice, immediate feedback, and cultural immersion.', 12, 'ADVANCED', 'ACTIVE', '42308252-a934-4eef-b663-37a7076bb177', 'c7ee11f4-44e5-47f1-ad67-f497c5e89f11', '2025-08-07 16:04:17.203', '2025-08-17 16:19:04.094', '2024-02-01 00:00:00.000', '2024-04-30 00:00:00.000', 15, 299.99, 'WEEKLY', 'CEFR', 0, 0, 0, 0, 'WEEKLY', '{\"time\": \"19:00\", \"duration\": 90, \"timezone\": \"UTC-5\", \"dayOfWeek\": \"Wednesday\"}', 0, NULL, 1, 'CONVERSATION', 'Advanced Spanish Conversation - Live Classes - Interactive live conversation practice', 'LIVE_ONLINE', 'advanced-spanish-conversation-live-classes'),
('c35b2490-a08e-4c29-9d28-30735f91bd1f', 'Global English Mastery - Live Platform Course', 'Join learners worldwide in this comprehensive English course featuring live interactive sessions, peer practice, and expert instruction. Perfect for international students.', 8, 'CEFR_B1', 'PUBLISHED', '42308252-a934-4eef-b663-37a7076bb177', 'c7ee11f4-44e5-47f1-ad67-f497c5e89f11', '2025-08-07 16:04:17.331', '2025-08-18 21:32:36.452', '2024-02-01 00:00:00.000', '2024-03-31 00:00:00.000', 25, 99.99, 'MONTHLY', 'CEFR', 0, 0, 0, 1, 'BIWEEKLY', 'null', 1, 'PREMIUM', 1, 'COMPREHENSIVE', NULL, 'LIVE_ONLINE', 'global-english-mastery-live-platform-course');

-- --------------------------------------------------------

--
-- Table structure for table `coursetag`
--

DROP TABLE IF EXISTS `coursetag`;
CREATE TABLE IF NOT EXISTS `coursetag` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tagId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `coursetag_courseId_tagId_key` (`courseId`,`tagId`),
  KEY `coursetag_courseId_idx` (`courseId`),
  KEY `coursetag_tagId_idx` (`tagId`),
  KEY `idx_course_tag_course_id` (`courseId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coursetag`
--

INSERT INTO `coursetag` (`id`, `courseId`, `tagId`, `createdAt`, `updatedAt`) VALUES
('f5eac06e-3093-41aa-94fc-f8512befae3d', 'd5975219-7eda-4507-bc4c-3fe2048dfc06', '2e5ddcdf-7a6c-490b-a052-6b094e32ef12', '2025-07-25 22:38:11.274', '2025-07-25 22:38:11.274'),
('847a076a-5e67-41eb-8366-b556b88863a1', 'd5975219-7eda-4507-bc4c-3fe2048dfc06', '65c262ee-43e8-46e8-9be6-06c650a42d5e', '2025-07-25 22:38:11.274', '2025-07-25 22:38:11.274'),
('43a0a87d-2d98-4ffe-be4c-20bf28202ed9', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', '488913d7-8108-4926-a49e-c768d63f1bd6', '2025-06-21 23:29:14.304', '2025-06-21 23:29:14.304'),
('efd57bc3-9de9-4025-b514-ced614317cb9', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', '048f677e-0e5b-4704-9415-19d10a5be921', '2025-06-21 23:29:14.304', '2025-06-21 23:29:14.304'),
('ba97191e-383c-4f1f-96c9-2c96a6022f26', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', '4ad8fe74-dcb5-4a65-8184-a956b7c73d8c', '2025-06-21 23:29:14.304', '2025-06-21 23:29:14.304'),
('3d66513d-b400-444b-aae2-2cfb5909e5f7', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 'c7306dac-83f1-44d4-afbd-5719e1fdad5b', '2025-06-21 23:29:14.304', '2025-06-21 23:29:14.304'),
('a19957ec-3163-40b1-a68a-fdd96a17e5aa', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 'dda75544-c43a-422b-a994-748e396be685', '2025-06-21 23:29:14.304', '2025-06-21 23:29:14.304'),
('bcf7f2a3-cdbd-486b-a51f-2f4f5f85588a', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 'c7306dac-83f1-44d4-afbd-5719e1fdad5b', '2025-06-21 23:35:13.807', '2025-06-21 23:35:13.807'),
('91572074-ef43-4b23-b33f-3acca60fd7c4', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 'c124f18c-a86d-4d4b-b7fa-52519d3011ee', '2025-06-21 23:35:13.807', '2025-06-21 23:35:13.807'),
('49d8b306-7a1a-48a5-a8c0-e8b0a695f6af', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', '6724fbd1-241f-4ba5-9d5a-c2036d94b8fd', '2025-06-21 23:35:13.807', '2025-06-21 23:35:13.807'),
('ddb95703-c6cf-4620-a2cd-7b51a1fa248a', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', '4ad8fe74-dcb5-4a65-8184-a956b7c73d8c', '2025-06-21 23:35:13.807', '2025-06-21 23:35:13.807'),
('e7da2a1b-d8dc-456f-bd88-88f2ece144de', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', '488913d7-8108-4926-a49e-c768d63f1bd6', '2025-06-21 23:35:13.807', '2025-06-21 23:35:13.807'),
('5576b394-2719-4e30-8bf6-23eece745680', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', '048f677e-0e5b-4704-9415-19d10a5be921', '2025-06-21 23:35:13.807', '2025-06-21 23:35:13.807'),
('c65ccc8f-3992-4e06-aaca-4c7bc76fac8c', '78bfbb28-7f43-423d-9454-1910b1fdabcf', '048f677e-0e5b-4704-9415-19d10a5be921', '2025-07-12 01:00:24.865', '2025-07-12 01:00:24.865'),
('9798f291-b93a-4d54-8dd0-e70438dd8e5d', '78bfbb28-7f43-423d-9454-1910b1fdabcf', '488913d7-8108-4926-a49e-c768d63f1bd6', '2025-07-12 01:00:24.865', '2025-07-12 01:00:24.865'),
('92b47c51-9f18-4cb3-bac6-36dc1a0c3560', '78bfbb28-7f43-423d-9454-1910b1fdabcf', 'dda75544-c43a-422b-a994-748e396be685', '2025-07-12 01:00:24.865', '2025-07-12 01:00:24.865'),
('f505ea08-c14f-4962-95f4-1529ef03924b', '78bfbb28-7f43-423d-9454-1910b1fdabcf', 'c7306dac-83f1-44d4-afbd-5719e1fdad5b', '2025-07-12 01:00:24.865', '2025-07-12 01:00:24.865'),
('51a101f8-20e0-4488-ac02-6a1c060aa469', '78bfbb28-7f43-423d-9454-1910b1fdabcf', '67b01751-5587-4230-8d8c-118da2270485', '2025-07-12 01:00:24.865', '2025-07-12 01:00:24.865'),
('e9fa0552-936f-4b43-ab0c-ae68f76580d4', '78bfbb28-7f43-423d-9454-1910b1fdabcf', '6724fbd1-241f-4ba5-9d5a-c2036d94b8fd', '2025-07-12 01:00:24.865', '2025-07-12 01:00:24.865'),
('a9be82d4-ba7f-415b-a771-1e7e42ba79dc', '78bfbb28-7f43-423d-9454-1910b1fdabcf', '65c262ee-43e8-46e8-9be6-06c650a42d5e', '2025-07-12 01:00:24.865', '2025-07-12 01:00:24.865'),
('8b364015-c0cb-4e48-b685-a3be20479dad', '78bfbb28-7f43-423d-9454-1910b1fdabcf', '4ad8fe74-dcb5-4a65-8184-a956b7c73d8c', '2025-07-12 01:00:24.865', '2025-07-12 01:00:24.865'),
('836aefef-6a4c-49f3-acb0-244ed840ed70', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', '4ad8fe74-dcb5-4a65-8184-a956b7c73d8c', '2025-08-07 22:33:12.228', '2025-08-07 22:33:12.228'),
('71cb428f-c1e8-49d7-81cb-81bc6e16f166', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 'c7306dac-83f1-44d4-afbd-5719e1fdad5b', '2025-08-07 22:33:12.228', '2025-08-07 22:33:12.228'),
('465144b1-4d19-4f45-88ca-665e73066dbe', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', '65c262ee-43e8-46e8-9be6-06c650a42d5e', '2025-08-07 22:33:12.228', '2025-08-07 22:33:12.228'),
('4685d441-7d92-483e-888c-4c65a34ade12', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', '59a2614b-9279-46ca-a1d9-1e068f05dd96', '2025-08-07 22:33:12.228', '2025-08-07 22:33:12.228'),
('298b331a-0eed-4d35-af0a-0d730ae9f106', '7e806add-bd45-43f6-a28f-fb736707653c', '6724fbd1-241f-4ba5-9d5a-c2036d94b8fd', '2025-07-12 00:31:03.308', '2025-07-12 00:31:03.308'),
('337d4ffe-7ef3-4931-9475-143cf96f2dae', '7e806add-bd45-43f6-a28f-fb736707653c', '4ad8fe74-dcb5-4a65-8184-a956b7c73d8c', '2025-07-12 00:31:03.308', '2025-07-12 00:31:03.308'),
('6b2d8bea-1403-4636-ba77-7797e9c1c3af', '7e806add-bd45-43f6-a28f-fb736707653c', '488913d7-8108-4926-a49e-c768d63f1bd6', '2025-07-12 00:31:03.308', '2025-07-12 00:31:03.308'),
('3ade043c-2200-442e-b7a6-a9084ea6a15d', '7e806add-bd45-43f6-a28f-fb736707653c', '048f677e-0e5b-4704-9415-19d10a5be921', '2025-07-12 00:31:03.308', '2025-07-12 00:31:03.308'),
('5ba20168-4112-41cf-a19d-80491e0ab002', '7e806add-bd45-43f6-a28f-fb736707653c', '67b01751-5587-4230-8d8c-118da2270485', '2025-07-12 00:31:03.308', '2025-07-12 00:31:03.308'),
('d75a84f5-5a26-4910-92c1-89aabcd3b8fe', '9c8dc68e-b7b7-4362-b4cc-c3913682b4a8', 'c7306dac-83f1-44d4-afbd-5719e1fdad5b', '2025-07-12 01:05:19.618', '2025-07-12 01:05:19.618'),
('e8dd3600-33df-4cd6-9025-0ecb272c348d', '9c8dc68e-b7b7-4362-b4cc-c3913682b4a8', 'c124f18c-a86d-4d4b-b7fa-52519d3011ee', '2025-07-12 01:05:19.618', '2025-07-12 01:05:19.618'),
('9038a0da-394f-468e-8227-1ba9ae986918', '9c8dc68e-b7b7-4362-b4cc-c3913682b4a8', '4ad8fe74-dcb5-4a65-8184-a956b7c73d8c', '2025-07-12 01:05:19.618', '2025-07-12 01:05:19.618'),
('9482fe1d-8581-425b-9294-91d8d553342b', '9c8dc68e-b7b7-4362-b4cc-c3913682b4a8', '048f677e-0e5b-4704-9415-19d10a5be921', '2025-07-12 01:05:19.618', '2025-07-12 01:05:19.618'),
('66b02596-f751-4a7b-8d6a-d699f371438f', '12de3567-2474-4760-a8ff-f58d22cde02d', '048f677e-0e5b-4704-9415-19d10a5be921', '2025-07-12 00:44:52.006', '2025-07-12 00:44:52.006'),
('0b03455d-b252-4d59-9e73-747ade525b49', '12de3567-2474-4760-a8ff-f58d22cde02d', '65c262ee-43e8-46e8-9be6-06c650a42d5e', '2025-07-12 00:44:52.006', '2025-07-12 00:44:52.006'),
('d94d30e4-feee-4446-99a8-9caeee09a028', '12de3567-2474-4760-a8ff-f58d22cde02d', '4ad8fe74-dcb5-4a65-8184-a956b7c73d8c', '2025-07-12 00:44:52.006', '2025-07-12 00:44:52.006'),
('021624f5-c4c6-4c78-b857-380e9772ef10', '12de3567-2474-4760-a8ff-f58d22cde02d', 'dda75544-c43a-422b-a994-748e396be685', '2025-07-12 00:44:52.006', '2025-07-12 00:44:52.006'),
('0dfb0330-c50e-41b2-82f5-279e32145b8c', '12de3567-2474-4760-a8ff-f58d22cde02d', 'c7306dac-83f1-44d4-afbd-5719e1fdad5b', '2025-07-12 00:44:52.006', '2025-07-12 00:44:52.006'),
('7949797b-4c1f-464e-807f-a7ac4bc32e54', '12de3567-2474-4760-a8ff-f58d22cde02d', '6724fbd1-241f-4ba5-9d5a-c2036d94b8fd', '2025-07-12 00:44:52.006', '2025-07-12 00:44:52.006'),
('371c0f6e-fcfc-441f-a3b0-c2fba6b4c287', '7e806add-bd45-43f6-a28f-fb736707653c', 'c7306dac-83f1-44d4-afbd-5719e1fdad5b', '2025-07-12 00:31:03.308', '2025-07-12 00:31:03.308'),
('55beb5ae-ce97-4487-a2af-7432352d2de0', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', '488913d7-8108-4926-a49e-c768d63f1bd6', '2025-08-07 15:03:19.442', '2025-08-07 15:03:19.442'),
('e0b8538b-97fd-43c4-981b-354f758515cc', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', '048f677e-0e5b-4704-9415-19d10a5be921', '2025-08-07 15:03:19.442', '2025-08-07 15:03:19.442'),
('de64acf9-dd9f-485b-b331-f55ec62c2be5', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 'dda75544-c43a-422b-a994-748e396be685', '2025-08-07 15:03:19.442', '2025-08-07 15:03:19.442'),
('486a1eac-a237-4995-a65f-bf06fb67bed8', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', '67b01751-5587-4230-8d8c-118da2270485', '2025-08-07 15:03:19.442', '2025-08-07 15:03:19.442'),
('260f4f3f-3f2c-49e1-af44-ca8f44d397f0', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', '6724fbd1-241f-4ba5-9d5a-c2036d94b8fd', '2025-08-07 15:03:19.442', '2025-08-07 15:03:19.442'),
('946368c9-0cdd-4d68-a4a4-ed6011ce2e13', 'c35b2490-a08e-4c29-9d28-30735f91bd1f', '048f677e-0e5b-4704-9415-19d10a5be921', '2025-08-18 21:32:36.452', '2025-08-18 21:32:36.452'),
('bb4b9c48-d2a9-487b-a489-bf73341a74ed', 'c35b2490-a08e-4c29-9d28-30735f91bd1f', '67b01751-5587-4230-8d8c-118da2270485', '2025-08-18 21:32:36.452', '2025-08-18 21:32:36.452'),
('b9fad54b-e02d-4552-a4e6-4c0490183efd', 'c35b2490-a08e-4c29-9d28-30735f91bd1f', 'dda75544-c43a-422b-a994-748e396be685', '2025-08-18 21:32:36.452', '2025-08-18 21:32:36.452');

-- --------------------------------------------------------

--
-- Table structure for table `course_monthly_price`
--

DROP TABLE IF EXISTS `course_monthly_price`;
CREATE TABLE IF NOT EXISTS `course_monthly_price` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `monthNumber` int NOT NULL,
  `year` int NOT NULL,
  `price` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `CourseMonthlyPrice_courseId_monthNumber_year_key` (`courseId`,`monthNumber`,`year`),
  KEY `CourseMonthlyPrice_courseId_fkey` (`courseId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_pricing_rules`
--

DROP TABLE IF EXISTS `course_pricing_rules`;
CREATE TABLE IF NOT EXISTS `course_pricing_rules` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ruleType` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ruleValue` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `course_pricing_rules_courseId_idx` (`courseId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_weekly_prices`
--

DROP TABLE IF EXISTS `course_weekly_prices`;
CREATE TABLE IF NOT EXISTS `course_weekly_prices` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `weekNumber` int NOT NULL,
  `year` int NOT NULL,
  `price` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `course_weekly_prices_courseId_idx` (`courseId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_weekly_prices`
--

INSERT INTO `course_weekly_prices` (`id`, `courseId`, `weekNumber`, `year`, `price`, `createdAt`, `updatedAt`) VALUES
('c92fb432-6fae-40ce-a9c1-a08ec177068e', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 52, 2025, 7098, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('70b58aeb-3eac-4395-a84e-075ed3c4db96', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 51, 2025, 6962, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('de3d81e1-b752-419a-b93d-d358f08fc9ff', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 50, 2025, 6825, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('46cff915-1c60-4d1f-a050-473c54a6371c', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 49, 2025, 6689, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('6b914dd1-bfe5-4320-b142-23d4177f972f', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 48, 2025, 6804, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('9490d6c7-907d-4017-86f1-2b5eb4245771', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 47, 2025, 6662, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('259c6914-fd50-4596-a641-2a9a6e157105', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 46, 2025, 6521, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('7b46d0dc-2412-46e3-8dbe-f1f1781b6658', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 45, 2025, 6379, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('53c6e51a-d2d3-4a1e-94b3-3cb50598dceb', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 44, 2025, 6468, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('28263e3e-fd6e-416e-a4e8-ae901086826e', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 43, 2025, 6321, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('2a95c70d-ac92-4e92-b015-2c8d4a1872ad', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 42, 2025, 6174, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('5af5e01c-c2c8-4232-8f68-76238a676d86', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 41, 2025, 6027, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('585f373f-2497-4f0b-a1bf-23cab86f8c0e', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 40, 2025, 6090, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('b42115b0-fe79-498b-b1d5-a3cc4a417cf9', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 39, 2025, 5938, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('a5f90969-940f-4ef0-bbbf-1f64dc67e9fa', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 38, 2025, 5786, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('1720a7c4-abad-4438-a183-7cc4cec2d77a', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 37, 2025, 5633, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('1fa0b325-a523-4783-9b97-cd1dc2362710', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 36, 2025, 5670, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('4f280383-ecd1-40e9-9588-7fb3c87865c6', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 35, 2025, 5513, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('053762f4-bd2d-4442-acbf-ab1f8892bc5d', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 34, 2025, 5355, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('b6265c0d-9bec-42c3-9a44-2de7f63e2db2', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 33, 2025, 5198, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('4697f4ca-e8ac-4d7e-9c63-04a8ea03f097', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 32, 2025, 5208, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('35f75929-f677-43c2-a3ee-bf1528da5164', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 31, 2025, 5045, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('a74ecd70-26b9-4410-b709-d50fa5c64b2a', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 30, 2025, 4883, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('8608323a-d3a5-49dc-8b43-63732939e4fb', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 29, 2025, 4720, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('2d3c5e04-cb7a-44a4-9111-e6fb765922ef', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 28, 2025, 4704, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('865c79ef-4278-4552-92c4-ecd970f711da', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 27, 2025, 4536, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('8fc9cfef-4bfa-4153-a3f0-c186ae96c822', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 26, 2025, 4368, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('ce2ca34a-b058-4c91-9747-656db9beeb4c', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 25, 2025, 4200, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('30d56119-3f55-4b24-bcd8-79edc91784a5', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 24, 2025, 4158, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('4c0f99c7-6d27-4780-9945-38f9087fb18f', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 23, 2025, 3985, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('4fd5a8a8-5d8a-45db-b0b0-a21105af6389', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 22, 2025, 3812, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('ee3df3bf-6b18-40a6-8ba6-81698b192c3d', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 21, 2025, 3638, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('2f5c3c57-55b1-427e-9a11-c1037890f5c2', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 20, 2025, 3570, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('891c40ec-70dc-4b62-ba74-fc900b186a05', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 19, 2025, 3392, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('c86e1428-d283-4e77-b46e-2b4a9be06bc6', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 18, 2025, 3213, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('1d7d2ded-d93c-46ee-966d-ec08e4658f50', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 17, 2025, 3035, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('dd2d50dc-d784-4549-9b82-689b8518adee', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 16, 2025, 2940, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('b35717eb-004e-405c-b952-24bc577868e1', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 15, 2025, 2756, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('13b72b5b-6416-4a79-9c59-7d02a3946c56', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 14, 2025, 2573, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('6dd4ad15-98ac-423d-8aeb-e10289634810', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 13, 2025, 2389, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('0b1b2c30-70fe-42c8-b644-dd00069f2fb2', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 12, 2025, 2268, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('fcd735c4-39f3-4375-b3f0-a611f8086922', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 11, 2025, 2079, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('a33a0c7e-4724-43dc-b4af-e9601d211bd7', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 10, 2025, 1890, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('bcf081d1-0215-4dee-9ff2-18e221f1187e', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 9, 2025, 1701, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('0cfea1fa-c522-4213-b48d-abe55e900532', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 8, 2025, 1554, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('27a8a85a-a4db-4c6d-8bbc-1189a17f9c12', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 7, 2025, 1360, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('254e868b-59df-4eec-8cdd-699d6115b6dc', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 6, 2025, 1166, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('b92f7276-9c3a-47d6-8c89-f45c64ecb321', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 5, 2025, 971, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('5e468b8a-679c-4d59-8848-ce9a3f500417', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 4, 2025, 798, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('8404c40e-837a-44a6-a6bd-efff09b26f04', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 3, 2025, 599, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('984008a3-f7ac-42ac-9c6a-1630acd7ea69', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 2, 2025, 399, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('9b6d8920-c7a6-455d-94ae-834aaca42881', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 1, 2025, 200, '2025-06-21 23:35:09.060', '2025-06-21 23:35:09.060'),
('9e42b1aa-68e1-4910-bbb0-91f943848181', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 52, 2025, 7098, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('7eab1535-a4e5-405c-ab27-aebdbb31e48a', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 51, 2025, 6962, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('14de046c-6db5-4bae-bce2-667088f9d652', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 50, 2025, 6825, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('d38a7784-cd3e-4d7e-9267-e51bd38bf2b0', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 49, 2025, 6689, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('aeb21ef1-43e3-4116-ae88-a2607b6030e9', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 48, 2025, 6804, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('01396b48-ab77-4f73-9a61-2abcbc892d3f', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 47, 2025, 6662, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('5ed6a69e-714f-4b88-87a6-7daf676d48c0', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 46, 2025, 6521, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('11f545e3-1654-4ee7-a94a-72c87798802e', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 45, 2025, 6379, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('e95f73a8-eac7-42a9-a857-f3924995354c', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 44, 2025, 6468, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('56afd8a3-bf4b-4e51-9363-ac5acf677a21', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 43, 2025, 6321, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('ff9f4ca6-64e6-4406-b12f-4a4f39cbb32a', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 42, 2025, 6174, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('f2882d3e-b479-43d7-8716-fb8c21fac2cf', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 41, 2025, 6027, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('44173628-176b-49e7-b9ed-03794ab040b2', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 40, 2025, 6090, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('d217517e-c29d-404e-8d3e-adbb374a2d32', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 39, 2025, 5938, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('ff2d032e-aedc-40cd-9e98-db8291ee2cb8', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 38, 2025, 5786, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('024ced0f-b5c1-4105-943e-7a16f40f41ec', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 37, 2025, 5633, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('abf7c9d2-cd62-4db7-a605-2f6f897323c2', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 36, 2025, 5670, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('d181ef77-dc28-43af-b539-fa1885dd3c71', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 35, 2025, 5513, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('b94ff4cc-495a-432f-acd1-d1ace1727318', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 34, 2025, 5355, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('5be0c6bd-615c-4244-9981-35d5451ba6bf', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 33, 2025, 5198, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('36616eca-85f9-4616-b4de-0a873981d9c3', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 32, 2025, 5208, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('2c18d6e8-ecff-4f42-8d17-e106d9645213', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 31, 2025, 5045, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('49b78da7-fdc5-49f8-8522-3dac37e9e8a5', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 30, 2025, 4883, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('b42bd68e-012b-4261-990d-09219aee85ab', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 29, 2025, 4720, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('9f8a1449-7c71-47b8-a43b-ff8d79acbd61', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 28, 2025, 4704, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('7874ac06-41fc-4f76-bdda-98e72a09641d', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 27, 2025, 4536, '2025-06-21 23:29:08.277', '2025-06-21 23:29:08.277'),
('65986de0-0c7e-4463-b0f2-579d7cb71397', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 26, 2025, 4368, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.277'),
('bfee456a-68c7-4c68-9c26-b0e24bbaedfc', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 25, 2025, 4200, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('7e1f6e97-e876-4aa3-9e8a-de8008b1e122', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 24, 2025, 4158, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('4497b07d-dd08-4926-9eb6-284b0bb1e258', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 23, 2025, 3985, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('25bb33fc-b7d3-448a-971a-5bf3b8bae6e2', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 22, 2025, 3812, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('b41e497c-6aa6-455d-a752-407eecc8bf2b', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 21, 2025, 3638, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('21bade8a-fb26-4ea4-995c-8e11a376111b', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 20, 2025, 3570, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('0005d41a-c0b5-46c7-936e-528dd5a49697', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 19, 2025, 3392, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('ddccb817-4c1a-4259-91d6-6fc811f11c64', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 18, 2025, 3213, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('eac36041-c54f-4e81-b08c-830f2cae6ec8', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 17, 2025, 3035, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('99e4f8aa-2b36-4203-9cb0-e3b4a468b9f1', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 16, 2025, 2940, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('0655888c-f985-42d3-a355-ea502a5d321f', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 15, 2025, 2756, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('c166e13f-225f-45f1-9c4b-963791c1d04f', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 14, 2025, 2573, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('eeb7c1fe-c6ce-4738-9e5e-3bdf31879af9', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 13, 2025, 2389, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('48dcddf1-08bc-4bff-8b13-05b642d882db', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 12, 2025, 2268, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('7744ca9e-938c-48ef-b9e7-31cf874b9b2e', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 11, 2025, 2079, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('4b4fe11e-48e8-4f6d-b059-3fb48c80213c', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 10, 2025, 1890, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('ebcb6d02-a333-44bb-8b33-a725d5834620', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 9, 2025, 1701, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('540fa1c6-bd7c-4167-bcae-88f42f50c66f', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 8, 2025, 1554, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('f090e9a2-d9c8-4b74-9415-9f1b720f8f27', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 7, 2025, 1360, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('5aa25103-742b-40ac-9256-f84cc4e7f0d4', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 6, 2025, 1166, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('c2195d3f-284c-49a9-ab9d-358ff4b6688f', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 5, 2025, 971, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('db4d20a2-2f32-442a-9349-40794371b75f', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 4, 2025, 798, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('cc9b2931-7dc2-4b95-add9-0a5ffa21324c', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 3, 2025, 599, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('606b55ed-9bbb-444b-b4d0-4bc1f9f6f998', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 2, 2025, 399, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('e5245021-5f88-4b90-8de5-4af1756db17c', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 1, 2025, 200, '2025-06-21 23:29:08.276', '2025-06-21 23:29:08.276'),
('2484b46b-31ee-47e0-ad5a-8da0af133fca', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 52, 2025, 9126, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('75d62e00-c348-4661-ae6c-24a342850624', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 51, 2025, 8951, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('ec82eaf8-b020-4b05-97a6-d2831d68fd0b', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 50, 2025, 8775, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('e2cfb699-85ee-4641-9995-e7e5deb2aacb', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 49, 2025, 8600, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('d729c070-2514-46cd-9b6d-cecc2a674f98', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 48, 2025, 8748, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('8bb5b736-e384-4f99-baf6-acc3f6e97298', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 47, 2025, 8566, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('3dc318a8-868e-4e4f-8bce-e067849c2364', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 46, 2025, 8384, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('bb84ac53-610d-4cd7-b871-5e57839d32ce', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 45, 2025, 8201, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('57695de9-f67f-424c-8cdd-7ba997bd6b42', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 44, 2025, 8316, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('4679e5f8-201c-456c-a7f5-4dd4093dc77d', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 43, 2025, 8127, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('de7fc8c7-6636-4261-be1b-39f7ae2baebe', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 42, 2025, 7938, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('484bcfc1-e390-4182-8a34-6d2b8c32a736', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 41, 2025, 7749, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('7ae782e4-081a-40df-9d50-61b3665745e9', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 40, 2025, 7830, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('66abe898-f121-44b0-874d-aa5942e3788c', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 39, 2025, 7634, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('bbbe90fe-6827-44bb-834f-3315f2385f22', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 38, 2025, 7439, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('ce75a0ec-b158-4677-b548-d2d5e7aaf954', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 37, 2025, 7243, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('77edabf8-dfb9-453d-a02e-95fadb7a0ac9', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 36, 2025, 7290, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('9f0885fb-e7d6-4d05-90af-92141965eb27', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 35, 2025, 7088, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('aedb18ff-a8cc-4443-909f-59cfd8b3fa3e', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 34, 2025, 6885, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('f325838d-cfe2-4b2d-8a4a-0921fb65c9fe', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 33, 2025, 6683, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('d8486bc4-58e8-49c2-8ea8-09787b8199a7', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 32, 2025, 6696, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('d26aa82a-c16b-4486-8f5a-149e9aac3a05', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 31, 2025, 6487, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('6f5f63e4-2d0d-4086-9ab0-d98cafda1fc0', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 30, 2025, 6278, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('6ec22ed9-e772-467d-a813-2cf1922aab2e', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 29, 2025, 6068, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('7894c5f2-c99b-4f88-ae7b-5e6161f52d10', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 28, 2025, 6048, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('e7dbf6fa-2c65-41d6-890a-4de2741486ea', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 27, 2025, 5832, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('2a9d5449-faf5-4aad-a913-288ed90582d6', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 26, 2025, 5616, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('c5aafd59-4fe9-4c84-9e0c-3d132765ddaa', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 25, 2025, 5400, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('bb113606-f17a-44d7-98bb-817f3abfad93', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 24, 2025, 5346, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('9d048d06-948e-4080-8e2b-07f0cb64a2fb', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 23, 2025, 5123, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('db4a8e91-71e1-4daa-9be2-4070025787ce', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 22, 2025, 4901, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('911098b4-b636-428a-9f6d-47f9eb5f50cd', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 21, 2025, 4678, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('4fbb078a-9ee2-4655-ace1-aee0e8e9438b', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 20, 2025, 4590, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('1caec1b0-6be4-4774-938e-58295a4f33ba', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 19, 2025, 4361, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('60284f1e-5a2d-499f-826d-f93aeac3e39a', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 18, 2025, 4131, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('3f6780d4-c879-4cde-a862-12db1331a07f', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 17, 2025, 3902, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('28846b19-8ac2-4671-ab9f-02f23989aea4', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 16, 2025, 3780, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('1d97e578-6802-4822-a50c-0417501dc768', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 15, 2025, 3544, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('4cf6845b-4847-4b04-99fc-3c1f08556440', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 14, 2025, 3308, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('bfe04b39-1d25-424a-802f-f01ed33af056', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 13, 2025, 3071, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('8c2fdacd-98e3-42c6-be1b-7a58d1568f3d', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 12, 2025, 2916, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('3e8f97af-8065-4db9-9dea-8a57a901c0b8', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 11, 2025, 2673, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('8cdb8ff0-4fb5-43ca-8603-98449cb4e0be', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 10, 2025, 2430, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('1589afb3-3be4-41c7-bbd9-93fb0d9b5f86', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 9, 2025, 2187, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('f7552333-4c53-4d30-a079-f2f32f92840c', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 8, 2025, 1998, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('e06b5837-7d45-473d-9709-aaa51d5de805', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 7, 2025, 1748, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('1116a60c-459b-4bc5-8558-531c66516a4f', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 6, 2025, 1499, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('14864b6e-8fd9-46ca-b5f0-ff7c81bb925d', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 5, 2025, 1249, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('2a3b3232-5044-4d2f-af29-b3aba8afff1f', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 4, 2025, 1026, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('c335fadd-bee3-4411-87c2-f792ce25c834', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 3, 2025, 770, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('a634d00a-be4e-4cb1-9cd5-935cbde5fa2d', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 2, 2025, 513, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('afe3b6c4-952b-4517-8632-1fb01de822c5', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 1, 2025, 257, '2025-08-07 14:22:40.598', '2025-08-07 14:22:40.598'),
('dec4a63c-65ca-4b42-9179-7fd9be6fcf0e', '7e806add-bd45-43f6-a28f-fb736707653c', 52, 2025, 3380, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('158d2bcd-2de2-4328-871f-a79cff659872', '7e806add-bd45-43f6-a28f-fb736707653c', 51, 2025, 3315, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('d85bceca-4082-473d-a5c5-47045af38f9f', '7e806add-bd45-43f6-a28f-fb736707653c', 50, 2025, 3250, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('a809064e-b266-4496-b09d-dc38ff417ab3', '7e806add-bd45-43f6-a28f-fb736707653c', 49, 2025, 3185, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('0c39fe15-d54b-46d7-b3f1-cd3810cef7f6', '7e806add-bd45-43f6-a28f-fb736707653c', 48, 2025, 3240, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('d21d2e51-9a47-461d-87aa-bde5c506a4e5', '7e806add-bd45-43f6-a28f-fb736707653c', 47, 2025, 3173, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('48425533-547f-4cfd-83d8-2d590c72bd92', '7e806add-bd45-43f6-a28f-fb736707653c', 46, 2025, 3105, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('d1349ea0-0040-4c11-a6c4-5d0ca17630b2', '7e806add-bd45-43f6-a28f-fb736707653c', 45, 2025, 3038, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('988a78ee-ad82-4155-b038-f07c8d6a1a66', '7e806add-bd45-43f6-a28f-fb736707653c', 44, 2025, 3080, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('8fc4277a-e006-41b9-8d6c-9a366f0e479a', '7e806add-bd45-43f6-a28f-fb736707653c', 43, 2025, 3010, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('a7cc7521-78fc-4342-91d7-fd315529d53c', '7e806add-bd45-43f6-a28f-fb736707653c', 42, 2025, 2940, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('9e18972f-2b37-46b7-92d2-37db76b6936e', '7e806add-bd45-43f6-a28f-fb736707653c', 41, 2025, 2870, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('951e7850-3f2b-4d24-83be-616da500c915', '7e806add-bd45-43f6-a28f-fb736707653c', 40, 2025, 2900, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('aeab1512-5d78-41ca-8808-73222449ce89', '7e806add-bd45-43f6-a28f-fb736707653c', 39, 2025, 2828, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('3cbfd276-3feb-4124-83db-5419b31fb4b6', '7e806add-bd45-43f6-a28f-fb736707653c', 38, 2025, 2755, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('e1036fe1-18d5-4ff9-a0b7-f4843baf582d', '7e806add-bd45-43f6-a28f-fb736707653c', 37, 2025, 2683, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('d22a1d54-2bab-4ff4-8be1-569c1dfea765', '7e806add-bd45-43f6-a28f-fb736707653c', 36, 2025, 2700, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('9937dd32-3b31-428e-8e85-02c9a96d1111', '7e806add-bd45-43f6-a28f-fb736707653c', 35, 2025, 2625, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('f1a9b90a-eea5-4d9f-a400-71c7c6aba0f4', '7e806add-bd45-43f6-a28f-fb736707653c', 34, 2025, 2550, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('49202320-d6e6-468a-a90b-bf2b8b156ebd', '7e806add-bd45-43f6-a28f-fb736707653c', 33, 2025, 2475, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('c1f4436d-9979-46f9-a944-ecf9f22c161b', '7e806add-bd45-43f6-a28f-fb736707653c', 32, 2025, 2480, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('040efe1a-f72e-4a85-933b-00f91b8272cc', '7e806add-bd45-43f6-a28f-fb736707653c', 31, 2025, 2403, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('a04de229-0ed6-4c6d-bf65-e52c88fa7613', '7e806add-bd45-43f6-a28f-fb736707653c', 30, 2025, 2325, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('ea78be0a-53aa-48fc-be5c-75f436cf7f8f', '7e806add-bd45-43f6-a28f-fb736707653c', 29, 2025, 2248, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('d6f956f4-0bad-4df9-b5cd-4c64e00966a8', '7e806add-bd45-43f6-a28f-fb736707653c', 28, 2025, 2240, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('eab9f63e-8c73-4f4a-b2bc-2ab543273fb9', '7e806add-bd45-43f6-a28f-fb736707653c', 27, 2025, 2160, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('6e1f1b67-4f8b-4e9d-9769-cc09b4a08ba3', '7e806add-bd45-43f6-a28f-fb736707653c', 26, 2025, 2080, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('edbdf975-b049-4098-bb90-a016d597690e', '7e806add-bd45-43f6-a28f-fb736707653c', 25, 2025, 2000, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('ad2f5203-5770-40ee-8126-c477c583e40a', '7e806add-bd45-43f6-a28f-fb736707653c', 24, 2025, 1980, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('c28b4f03-18aa-44dd-a965-e01c826e9931', '7e806add-bd45-43f6-a28f-fb736707653c', 23, 2025, 1898, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('670f4b15-15d0-4726-a737-d41ec1d4131e', '7e806add-bd45-43f6-a28f-fb736707653c', 22, 2025, 1815, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('93123508-3ff3-45e8-97e1-e0228615c9d1', '7e806add-bd45-43f6-a28f-fb736707653c', 21, 2025, 1733, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('e216cab3-9472-45f0-89a8-408a3bb39b26', '7e806add-bd45-43f6-a28f-fb736707653c', 20, 2025, 1700, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('0cc77d02-49d4-41c2-8b18-9b64b75c0e79', '7e806add-bd45-43f6-a28f-fb736707653c', 19, 2025, 1615, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('a5059303-0ba4-42ac-97dd-e4ffc453d7e0', '7e806add-bd45-43f6-a28f-fb736707653c', 18, 2025, 1530, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('da9850fa-9430-4911-a8da-1827479c1c47', '7e806add-bd45-43f6-a28f-fb736707653c', 17, 2025, 1445, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('b72936a1-38a5-4e49-ac49-da7b8492c70a', '7e806add-bd45-43f6-a28f-fb736707653c', 16, 2025, 1400, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('34704d12-5cbe-47d5-8340-054fa4b26f45', '7e806add-bd45-43f6-a28f-fb736707653c', 15, 2025, 1313, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('f353cdd9-8300-4603-8a40-702d2f53f0f9', '7e806add-bd45-43f6-a28f-fb736707653c', 14, 2025, 1225, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('7b24ce6f-1a8e-48e2-8377-ff19401acf97', '7e806add-bd45-43f6-a28f-fb736707653c', 13, 2025, 1138, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('d98be468-4b60-440c-b9e2-51f7aa20e0fb', '7e806add-bd45-43f6-a28f-fb736707653c', 12, 2025, 1080, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('3a713ca5-3050-4cb8-8700-d074810758f2', '7e806add-bd45-43f6-a28f-fb736707653c', 11, 2025, 990, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('4f84f335-e10e-46bd-99f0-9c848d709258', '7e806add-bd45-43f6-a28f-fb736707653c', 10, 2025, 900, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('12cd04de-1428-45a3-b08f-e3b5506fea04', '7e806add-bd45-43f6-a28f-fb736707653c', 9, 2025, 810, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('97d53642-4e5c-4870-b3bd-8308175a7e4d', '7e806add-bd45-43f6-a28f-fb736707653c', 8, 2025, 740, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('6cf04c2b-9425-4545-979b-bb6120cb1b04', '7e806add-bd45-43f6-a28f-fb736707653c', 7, 2025, 648, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('8659fdaf-c885-406e-9833-3bdf0b161f46', '7e806add-bd45-43f6-a28f-fb736707653c', 6, 2025, 555, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('ea8fe710-bdd4-49d0-b2ed-70058f03c432', '7e806add-bd45-43f6-a28f-fb736707653c', 5, 2025, 463, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('7548681a-770f-47b5-b7e9-b182806c8c55', '7e806add-bd45-43f6-a28f-fb736707653c', 4, 2025, 380, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('b3b016d7-6b5c-4797-9312-b68a894f64ff', '7e806add-bd45-43f6-a28f-fb736707653c', 3, 2025, 285, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('0f6eb1c7-93ba-4469-8f6b-b71a8d0072a1', '7e806add-bd45-43f6-a28f-fb736707653c', 2, 2025, 190, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('a6e0f718-efd5-4352-8357-a362e8df640f', '7e806add-bd45-43f6-a28f-fb736707653c', 1, 2025, 95, '2025-07-11 22:47:28.892', '2025-07-11 22:47:28.892'),
('2c886a52-855f-4835-87d9-59699a45dbf6', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 52, 2025, 7098, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('13b202d0-931f-469c-be66-80a053c0b70d', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 51, 2025, 6962, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('6f56428f-a707-4b42-8657-25da2f5ac530', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 50, 2025, 6825, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('dbf4d9c0-dbf6-469b-9e92-c68dc5782ed8', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 49, 2025, 6689, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('84bc4794-39ab-479a-bd4d-a2ee19f54225', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 48, 2025, 6804, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('ab758f49-7022-4634-9726-8f471c581faf', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 47, 2025, 6662, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('d6090837-7568-481f-85ac-910b810df658', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 46, 2025, 6521, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('79762f80-9575-4344-a662-fa74dbc2fca8', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 45, 2025, 6379, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('e060c1b1-79aa-4625-b1f0-a27ce09789a7', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 44, 2025, 6468, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('b0d37ea2-a391-42b2-9a99-67d4419cd924', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 43, 2025, 6321, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('d86b0bd9-90ed-46b9-88b4-4bbf427caf50', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 42, 2025, 6174, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('3e2b9e16-74a8-45e8-83e6-6d958dccc157', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 41, 2025, 6027, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('1981292b-2f44-4710-b68d-cae8819bbbaa', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 40, 2025, 6090, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('d001cb9d-8047-469b-92f5-6f416bc6912b', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 39, 2025, 5938, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('b26885d3-1dc1-4992-9dca-ba72306fb8b8', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 38, 2025, 5786, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('927fd9ff-e92e-4d7b-81c0-e569c002e1c5', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 37, 2025, 5633, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('37754dd3-dead-4895-8913-4914d5c98690', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 36, 2025, 5670, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('fca5bffa-ee54-4f10-b784-e47bc366b75f', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 35, 2025, 5513, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('d3ff5095-0997-4c05-8e5a-589d1ff6d4ec', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 34, 2025, 5355, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('d1b642de-6e7c-4569-84cb-387943c5626c', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 33, 2025, 5198, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('5d88ac20-aa1e-453b-bded-2036e4c3321a', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 32, 2025, 5208, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('2166782a-5925-4f23-b9ba-d3f8e89ae2e1', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 31, 2025, 5045, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('588c14ab-501a-4288-922a-3861eacc86d5', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 30, 2025, 4883, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('ecbaa841-bff3-486d-b6bd-a5f753a6c6a3', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 29, 2025, 4720, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('65048fad-55ed-436a-8e85-b6d397d227dc', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 28, 2025, 4704, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('731e6ef1-d105-498e-9611-d4f389321f0e', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 27, 2025, 4536, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('c205cf65-92c5-4284-bf94-86a84e33ba8d', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 26, 2025, 4368, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('c1d305cb-b253-4b63-9687-e0417e2e5020', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 25, 2025, 4200, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('f3a6dce6-2ba5-4eca-9179-0cc0ecfc160c', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 24, 2025, 4158, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('2eec0217-9280-465e-ab44-c6b73ebe0953', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 23, 2025, 3985, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('c8471529-9ae4-4c2d-89e0-84d53dd2561a', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 22, 2025, 3812, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('201d8f88-d6ae-417f-a1c5-eb6867e2f254', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 21, 2025, 3638, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('efcb86fb-8ec0-41fb-b529-34a416845121', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 20, 2025, 3570, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('d13ac335-0551-4daa-acaa-d516741c707f', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 19, 2025, 3392, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('d592272c-f7c8-4088-b433-e06b95c1f1f3', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 18, 2025, 3213, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('2d76cfa6-2073-4922-ab53-69a2f1253712', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 17, 2025, 3035, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('b3def271-cf6e-42ce-86e1-555c75ac56a0', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 16, 2025, 2940, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('75a762a5-21a7-4501-b6af-9fef49f79301', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 15, 2025, 2756, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('2aad12d2-6540-44d7-9162-db0bbf782963', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 14, 2025, 2573, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('f40611f4-a16b-47f2-b0f4-175698c42d38', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 13, 2025, 2389, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('75f9486b-c433-47cf-b918-3535abbd5d5a', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 12, 2025, 2268, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('96c65478-4334-461d-b4c9-c33503c6aa06', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 11, 2025, 2079, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('69c95b7a-1d61-44e2-a2de-f316bd9e87df', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 10, 2025, 1890, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('a7be4160-055d-4987-9d47-3ca87f8c4f83', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 9, 2025, 1701, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('83cc82de-b954-4976-a612-f8ab9acbcbdd', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 8, 2025, 1554, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('a69caa65-44b9-4d64-a329-8f2d57947ec0', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 7, 2025, 1360, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('3dde73d2-2f95-419c-b372-0cfeed48c0a1', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 6, 2025, 1166, '2025-08-07 15:03:14.939', '2025-08-07 15:03:14.939'),
('31e9fc58-7068-41a4-b3ea-a57cc8f27595', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 5, 2025, 971, '2025-08-07 15:03:14.938', '2025-08-07 15:03:14.938'),
('17776211-185b-49a4-8d59-6df23b5e42af', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 4, 2025, 798, '2025-08-07 15:03:14.938', '2025-08-07 15:03:14.938'),
('44c1def4-a5aa-474c-b273-6d07734267c8', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 3, 2025, 599, '2025-08-07 15:03:14.938', '2025-08-07 15:03:14.938'),
('dde9c6f2-8992-4c68-b8e6-9eaf5168f891', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 2, 2025, 399, '2025-08-07 15:03:14.938', '2025-08-07 15:03:14.938'),
('061c990f-527d-43ed-82e7-0efd1ae12091', '6852a928-8dbe-46ec-b1cd-57cca8f1ed62', 1, 2025, 200, '2025-08-07 15:03:14.938', '2025-08-07 15:03:14.938');

-- --------------------------------------------------------

--
-- Table structure for table `design_configs`
--

DROP TABLE IF EXISTS `design_configs`;
CREATE TABLE IF NOT EXISTS `design_configs` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `backgroundType` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'solid',
  `backgroundColor` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#ffffff',
  `backgroundGradientFrom` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#667eea',
  `backgroundGradientTo` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#764ba2',
  `backgroundGradientDirection` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'to-r',
  `backgroundImage` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `backgroundPattern` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none',
  `backgroundOpacity` int NOT NULL DEFAULT '100',
  `titleFont` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'inter',
  `titleSize` int NOT NULL DEFAULT '16',
  `titleWeight` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'semibold',
  `titleColor` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#1f2937',
  `titleAlignment` json DEFAULT NULL,
  `titleShadow` tinyint(1) NOT NULL DEFAULT '0',
  `titleShadowColor` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#000000',
  `descriptionFont` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'inter',
  `descriptionSize` int NOT NULL DEFAULT '14',
  `descriptionColor` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#6b7280',
  `descriptionAlignment` json DEFAULT NULL,
  `padding` int NOT NULL DEFAULT '16',
  `borderRadius` int NOT NULL DEFAULT '8',
  `borderWidth` int NOT NULL DEFAULT '1',
  `borderColor` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#e5e7eb',
  `borderStyle` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'solid',
  `shadow` tinyint(1) NOT NULL DEFAULT '1',
  `shadowColor` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'rgba(0, 0, 0, 0.1)',
  `shadowBlur` int NOT NULL DEFAULT '10',
  `shadowOffset` int NOT NULL DEFAULT '4',
  `hoverEffect` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'scale',
  `animationDuration` int NOT NULL DEFAULT '300',
  `customCSS` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `createdBy` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `approvalNotes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `approvalStatus` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `approvedAt` datetime(3) DEFAULT NULL,
  `approvedBy` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isApproved` tinyint(1) NOT NULL DEFAULT '0',
  `itemId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `design_configs`
--

INSERT INTO `design_configs` (`id`, `name`, `description`, `backgroundType`, `backgroundColor`, `backgroundGradientFrom`, `backgroundGradientTo`, `backgroundGradientDirection`, `backgroundImage`, `backgroundPattern`, `backgroundOpacity`, `titleFont`, `titleSize`, `titleWeight`, `titleColor`, `titleAlignment`, `titleShadow`, `titleShadowColor`, `descriptionFont`, `descriptionSize`, `descriptionColor`, `descriptionAlignment`, `padding`, `borderRadius`, `borderWidth`, `borderColor`, `borderStyle`, `shadow`, `shadowColor`, `shadowBlur`, `shadowOffset`, `hoverEffect`, `animationDuration`, `customCSS`, `isActive`, `isDefault`, `createdBy`, `createdAt`, `updatedAt`, `approvalNotes`, `approvalStatus`, `approvedAt`, `approvedBy`, `isApproved`, `itemId`) VALUES
('cmedldmod00002osifrqhqssc', 'Design for institution-1', 'Custom design configuration for promotional item: institution-1', 'image', '#ffffff', '#ffffff', '#e0e0e0', 'to-r', 'http://localhost:3000/uploads/mainimage/9f71efc3-7b31-4953-b398-29f2197af202/6f0c2c89-9c5a-4eca-83c8-1e08ba7d4d7f.jpg', 'none', 12, 'inter', 24, 'bold', '#1f2937', '{\"padding\": {\"top\": 0, \"left\": 0, \"right\": 0, \"bottom\": 0}, \"vertical\": \"top\", \"horizontal\": \"left\"}', 0, '#000000', 'inter', 16, '#6b7280', '{\"padding\": {\"top\": 0, \"left\": 0, \"right\": 0, \"bottom\": 0}, \"vertical\": \"top\", \"horizontal\": \"left\"}', 20, 8, 1, '#e5e7eb', 'solid', 0, 'rgba(0, 0, 0, 0.1)', 10, 5, 'none', 300, '', 1, 0, '0e971fe1-d22a-446e-9fb9-f52149e29df3', '2025-08-16 01:42:10.957', '2025-08-16 22:28:13.801', NULL, 'PENDING', NULL, NULL, 0, 'institution-1'),
('cmedlf22400012osimi8uqmhj', 'Design for course-1', 'Custom design configuration for promotional item: course-1', 'gradient', '#ffffff', '#4e07f2', '#0d59f2', 'to-r', '', 'none', 12, 'inter', 24, 'bold', '#1f2937', '{\"padding\": {\"top\": 0, \"left\": 0, \"right\": 0, \"bottom\": 0}, \"vertical\": \"top\", \"horizontal\": \"left\"}', 0, '#000000', 'inter', 16, '#6b7280', '{\"padding\": {\"top\": 0, \"left\": 0, \"right\": 0, \"bottom\": 0}, \"vertical\": \"top\", \"horizontal\": \"left\"}', 20, 8, 1, '#e5e7eb', 'solid', 0, 'rgba(0, 0, 0, 0.1)', 10, 5, 'none', 300, '', 1, 0, '0e971fe1-d22a-446e-9fb9-f52149e29df3', '2025-08-16 01:43:17.548', '2025-08-16 22:28:13.801', NULL, 'PENDING', NULL, NULL, 0, 'course-1'),
('cmedlfhrk00022osio12o9rgk', 'Design for course-1', 'Custom design configuration for promotional item: course-1', 'gradient', '#ffffff', '#4e07f2', '#0d59f2', 'to-r', '', 'none', 12, 'inter', 24, 'bold', '#ffffff', '{\"padding\": {\"top\": 0, \"left\": 0, \"right\": 0, \"bottom\": 0}, \"vertical\": \"top\", \"horizontal\": \"left\"}', 0, '#000000', 'inter', 16, '#6b7280', '{\"padding\": {\"top\": 0, \"left\": 0, \"right\": 0, \"bottom\": 0}, \"vertical\": \"top\", \"horizontal\": \"left\"}', 20, 8, 1, '#e5e7eb', 'solid', 0, 'rgba(0, 0, 0, 0.1)', 10, 5, 'none', 300, '', 1, 0, '0e971fe1-d22a-446e-9fb9-f52149e29df3', '2025-08-16 01:43:37.904', '2025-08-16 22:28:13.801', NULL, 'PENDING', NULL, NULL, 0, 'course-1'),
('cmedlggvs00032osiv9x11bk7', 'Design for course-1', 'Custom design configuration for promotional item: course-1', 'gradient', '#ffffff', '#4e07f2', '#0d59f2', 'to-r', '', 'none', 12, 'inter', 24, 'bold', '#ffffff', '{\"padding\": {\"top\": 0, \"left\": 0, \"right\": 0, \"bottom\": 0}, \"vertical\": \"top\", \"horizontal\": \"left\"}', 0, '#000000', 'inter', 16, '#ffffff', '{\"padding\": {\"top\": 0, \"left\": 0, \"right\": 0, \"bottom\": 0}, \"vertical\": \"top\", \"horizontal\": \"left\"}', 20, 8, 1, '#e5e7eb', 'solid', 0, 'rgba(0, 0, 0, 0.1)', 10, 5, 'none', 300, '', 1, 0, '0e971fe1-d22a-446e-9fb9-f52149e29df3', '2025-08-16 01:44:23.416', '2025-08-16 22:28:13.801', NULL, 'PENDING', NULL, NULL, 0, 'course-1'),
('cmedmdjtb000012hgour7543d', 'Design for third-party-1', 'Custom design configuration for promotional item: third-party-1', 'image', '#ffffff', '#ffffff', '#e0e0e0', 'to-r', '/uploads/backgrounds/admin_0e971fe1-d22a-446e-9fb9-f52149e29df3/bg_1755310166823_mmap1kdg8b.png', 'none', 12, 'inter', 24, 'bold', '#1f2937', '{\"padding\": {\"top\": 0, \"left\": 0, \"right\": 0, \"bottom\": 0}, \"vertical\": \"top\", \"horizontal\": \"left\"}', 0, '#000000', 'inter', 16, '#6b7280', '{\"padding\": {\"top\": 0, \"left\": 0, \"right\": 0, \"bottom\": 0}, \"vertical\": \"top\", \"horizontal\": \"left\"}', 20, 8, 1, '#e5e7eb', 'solid', 0, 'rgba(0, 0, 0, 0.1)', 10, 5, 'none', 300, '', 1, 0, '0e971fe1-d22a-446e-9fb9-f52149e29df3', '2025-08-16 02:10:06.863', '2025-08-16 22:28:13.801', NULL, 'PENDING', NULL, NULL, 0, 'third-party-1'),
('cmedmpn9e000010g6050s57pr', 'Design for third-party-1', 'Custom design configuration for promotional item: third-party-1', 'image', '#ffffff', '#ffffff', '#e0e0e0', 'to-r', '/uploads/backgrounds/admin_0e971fe1-d22a-446e-9fb9-f52149e29df3/bg_1755310166823_mmap1kdg8b.png', 'none', 12, 'inter', 24, 'bold', '#1f2937', '{\"padding\": {\"top\": 0, \"left\": 0, \"right\": 0, \"bottom\": 0}, \"vertical\": \"top\", \"horizontal\": \"left\"}', 0, '#000000', 'inter', 16, '#6b7280', '{\"padding\": {\"top\": 0, \"left\": 0, \"right\": 0, \"bottom\": 0}, \"vertical\": \"top\", \"horizontal\": \"left\"}', 20, 8, 1, '#e5e7eb', 'solid', 0, 'rgba(0, 0, 0, 0.1)', 10, 5, 'none', 300, '', 1, 0, '0e971fe1-d22a-446e-9fb9-f52149e29df3', '2025-08-16 02:19:31.202', '2025-08-16 22:28:13.801', NULL, 'PENDING', NULL, NULL, 0, 'third-party-1'),
('cmedmqdtu000110g6lxh07i9z', 'Design for course-1', 'Custom design configuration for promotional item: course-1', 'gradient', '#ffffff', '#4e07f2', '#0d59f2', 'to-r', '', 'none', 12, 'inter', 24, 'bold', '#ffffff', '{\"padding\": {\"top\": 0, \"left\": 0, \"right\": 0, \"bottom\": 0}, \"vertical\": \"top\", \"horizontal\": \"left\"}', 0, '#000000', 'inter', 16, '#6b7280', '{\"padding\": {\"top\": 0, \"left\": 0, \"right\": 0, \"bottom\": 0}, \"vertical\": \"top\", \"horizontal\": \"left\"}', 20, 8, 1, '#e5e7eb', 'solid', 0, 'rgba(0, 0, 0, 0.1)', 10, 5, 'none', 300, '', 1, 0, '0e971fe1-d22a-446e-9fb9-f52149e29df3', '2025-08-16 02:20:05.634', '2025-08-16 22:28:13.801', NULL, 'PENDING', NULL, NULL, 0, 'course-1'),
('cmedms4o7000210g69vxq7thx', 'Design for course-1', 'Custom design configuration for promotional item: course-1', 'gradient', '#ffffff', '#4e07f2', '#0d59f2', 'to-r', '', 'none', 12, 'inter', 24, 'bold', '#ffffff', '{\"padding\": {\"top\": 0, \"left\": 0, \"right\": 0, \"bottom\": 0}, \"vertical\": \"top\", \"horizontal\": \"left\"}', 0, '#000000', 'inter', 16, '#ffffff', '{\"padding\": {\"top\": 0, \"left\": 0, \"right\": 0, \"bottom\": 0}, \"vertical\": \"top\", \"horizontal\": \"left\"}', 20, 8, 1, '#e5e7eb', 'solid', 0, 'rgba(0, 0, 0, 0.1)', 10, 5, 'none', 300, '', 1, 0, '0e971fe1-d22a-446e-9fb9-f52149e29df3', '2025-08-16 02:21:27.079', '2025-08-16 22:28:13.801', NULL, 'PENDING', NULL, NULL, 0, 'course-1'),
('cmedmzmpo0000g8lidhz9832x', 'Design for course-1', 'Custom design configuration for promotional item: course-1', 'gradient', '#ffffff', '#4e07f2', '#0d59f2', 'to-r', '', 'none', 12, 'inter', 24, 'bold', '#ffffff', '{\"padding\": {\"top\": 0, \"left\": 0, \"right\": 0, \"bottom\": 0}, \"vertical\": \"top\", \"horizontal\": \"left\"}', 0, '#000000', 'inter', 16, '#ffffff', '{\"padding\": {\"top\": 0, \"left\": 0, \"right\": 0, \"bottom\": 0}, \"vertical\": \"top\", \"horizontal\": \"left\"}', 20, 8, 1, '#e5e7eb', 'solid', 0, 'rgba(0, 0, 0, 0.1)', 10, 5, 'none', 300, '', 1, 0, '0e971fe1-d22a-446e-9fb9-f52149e29df3', '2025-08-16 02:27:17.052', '2025-08-16 22:28:13.801', NULL, 'PENDING', NULL, NULL, 0, 'course-1'),
('cmedn70780000953snz6bu1m6', 'Design for course-1', 'Custom design configuration for promotional item: course-1', 'gradient', '#ffffff', '#4e07f2', '#0a89ff', 'to-r', '', 'none', 12, 'inter', 24, 'bold', '#ffffff', '\"{\\\"horizontal\\\":\\\"left\\\",\\\"vertical\\\":\\\"top\\\",\\\"padding\\\":{\\\"top\\\":0,\\\"bottom\\\":0,\\\"left\\\":0,\\\"right\\\":0}}\"', 0, '#000000', 'inter', 16, '#ffffff', '\"{\\\"horizontal\\\":\\\"left\\\",\\\"vertical\\\":\\\"top\\\",\\\"padding\\\":{\\\"top\\\":0,\\\"bottom\\\":0,\\\"left\\\":0,\\\"right\\\":0}}\"', 20, 8, 1, '#e5e7eb', 'solid', 0, 'rgba(0, 0, 0, 0.1)', 10, 5, 'none', 300, '', 1, 0, '0e971fe1-d22a-446e-9fb9-f52149e29df3', '2025-08-16 02:33:01.123', '2025-08-16 22:28:13.801', NULL, 'PENDING', NULL, NULL, 0, 'course-1'),
('cmedn8nel0001953s1zyfs79b', 'Design for course-1', 'Custom design configuration for promotional item: course-1', 'gradient', '#ffffff', '#4e07f2', '#0d59f2', 'to-r', '', 'none', 12, 'inter', 24, 'bold', '#ffffff', '\"{\\\"horizontal\\\":\\\"left\\\",\\\"vertical\\\":\\\"top\\\",\\\"padding\\\":{\\\"top\\\":0,\\\"bottom\\\":0,\\\"left\\\":0,\\\"right\\\":0}}\"', 0, '#000000', 'inter', 16, '#ffffff', '\"{\\\"horizontal\\\":\\\"left\\\",\\\"vertical\\\":\\\"top\\\",\\\"padding\\\":{\\\"top\\\":0,\\\"bottom\\\":0,\\\"left\\\":0,\\\"right\\\":0}}\"', 20, 8, 1, '#e5e7eb', 'solid', 0, 'rgba(0, 0, 0, 0.1)', 10, 5, 'none', 300, '', 1, 0, '0e971fe1-d22a-446e-9fb9-f52149e29df3', '2025-08-16 02:34:17.852', '2025-08-16 22:28:13.801', NULL, 'PENDING', NULL, NULL, 0, 'course-1'),
('cmednkbig000052y0px0j549w', 'Design for course-1', 'Custom design configuration for promotional item: course-1', 'gradient', '#ffffff', '#4e07f2', '#0d59f2', 'to-r', '', 'none', 12, 'inter', 24, 'bold', '#ffffff', '\"{\\\"horizontal\\\":\\\"left\\\",\\\"vertical\\\":\\\"top\\\",\\\"padding\\\":{\\\"top\\\":0,\\\"bottom\\\":0,\\\"left\\\":0,\\\"right\\\":0}}\"', 0, '#000000', 'inter', 16, '#ffffff', '\"{\\\"horizontal\\\":\\\"left\\\",\\\"vertical\\\":\\\"top\\\",\\\"padding\\\":{\\\"top\\\":0,\\\"bottom\\\":0,\\\"left\\\":0,\\\"right\\\":0}}\"', 20, 8, 1, '#e5e7eb', 'solid', 0, 'rgba(0, 0, 0, 0.1)', 10, 5, 'none', 300, '', 1, 0, '0e971fe1-d22a-446e-9fb9-f52149e29df3', '2025-08-16 02:43:22.312', '2025-08-16 22:28:13.801', NULL, 'PENDING', NULL, NULL, 0, 'course-1'),
('cmeeftldb000029rqdl0yivqw', 'Admin Test Design', 'Test design created by admin', 'gradient', '#ffffff', '#667eea', '#764ba2', 'to-r', NULL, 'none', 100, 'inter', 16, 'semibold', '#1f2937', NULL, 0, '#000000', 'inter', 14, '#6b7280', NULL, 16, 8, 1, '#e5e7eb', 'solid', 1, 'rgba(0, 0, 0, 0.1)', 10, 4, 'scale', 300, NULL, 1, 0, 'bc4f00ee-c835-45f2-9738-e636750bcb5c', '2025-08-16 15:54:24.238', '2025-08-16 15:54:24.238', NULL, 'APPROVED', '2025-08-16 15:54:24.233', 'bc4f00ee-c835-45f2-9738-e636750bcb5c', 1, 'test-item-1'),
('cmeeftlem000129rqhzk5uhc0', 'Institution Test Design', 'Test design created by institution', 'solid', '#f3f4f6', '#667eea', '#764ba2', 'to-r', NULL, 'none', 100, 'inter', 16, 'semibold', '#374151', NULL, 0, '#000000', 'inter', 14, '#6b7280', NULL, 16, 8, 1, '#e5e7eb', 'solid', 1, 'rgba(0, 0, 0, 0.1)', 10, 4, 'scale', 300, NULL, 1, 0, '547f05f7-a4fb-4fe3-bb46-fcb984cabdef', '2025-08-16 15:54:24.286', '2025-08-16 15:54:24.309', 'Design approved by admin test', 'APPROVED', '2025-08-16 15:54:24.307', 'bc4f00ee-c835-45f2-9738-e636750bcb5c', 1, 'test-item-2'),
('cmeehxa3n0000a3ornb6gz3uf', 'Institution Course Design - Premium', 'Premium course design created by institution and approved by admin', 'gradient', '#ffffff', '#ff6b6b', '#4ecdc4', 'to-r', '', 'none', 12, 'inter', 28, 'bold', '#ffffff', '\"{\\\"horizontal\\\":\\\"center\\\",\\\"vertical\\\":\\\"top\\\",\\\"padding\\\":{\\\"top\\\":20,\\\"bottom\\\":10,\\\"left\\\":0,\\\"right\\\":0}}\"', 1, '#000000', 'inter', 16, '#ffffff', '\"{\\\"horizontal\\\":\\\"center\\\",\\\"vertical\\\":\\\"top\\\",\\\"padding\\\":{\\\"top\\\":10,\\\"bottom\\\":20,\\\"left\\\":0,\\\"right\\\":0}}\"', 20, 12, 2, '#ffffff', 'solid', 1, 'rgba(0, 0, 0, 0.2)', 15, 8, 'glow', 400, NULL, 1, 0, '547f05f7-a4fb-4fe3-bb46-fcb984cabdef', '2025-08-16 16:53:15.491', '2025-08-16 22:28:13.801', 'Approved by admin - high quality design for premium courses', 'APPROVED', '2025-08-16 16:53:15.485', '0e971fe1-d22a-446e-9fb9-f52149e29df3', 1, 'course-1'),
('cmeehxa4c0001a3orq1f8x1ug', 'Institution Third-Party Design - Modern', 'Modern third-party design created by institution and approved by admin', 'image', '#1a1a1a', '#667eea', '#764ba2', 'to-br', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800', 'none', 12, 'inter', 32, 'extrabold', '#ffffff', '\"{\\\"horizontal\\\":\\\"center\\\",\\\"vertical\\\":\\\"center\\\",\\\"padding\\\":{\\\"top\\\":0,\\\"bottom\\\":0,\\\"left\\\":0,\\\"right\\\":0}}\"', 1, '#000000', 'inter', 18, '#f3f4f6', '\"{\\\"horizontal\\\":\\\"center\\\",\\\"vertical\\\":\\\"center\\\",\\\"padding\\\":{\\\"top\\\":10,\\\"bottom\\\":0,\\\"left\\\":0,\\\"right\\\":0}}\"', 30, 16, 0, 'transparent', 'solid', 1, 'rgba(0, 0, 0, 0.3)', 20, 10, 'scale', 300, NULL, 1, 0, '547f05f7-a4fb-4fe3-bb46-fcb984cabdef', '2025-08-16 16:53:15.517', '2025-08-16 22:28:13.801', 'Approved by admin - modern and engaging design for third-party promotions', 'APPROVED', '2025-08-16 16:53:15.485', '0e971fe1-d22a-446e-9fb9-f52149e29df3', 1, 'third-party-1'),
('cmeej0x7w0000lxvhqi3ww5j8', 'Design for premium-course-banner', 'Custom design configuration for promotional item: premium-course-banner', 'image', '#8b5cf6', '#8b5cf6', '#ec4899', 'to-r', '/uploads/backgrounds/admin_0e971fe1-d22a-446e-9fb9-f52149e29df3/bg_1755393215657_x4nte0v4pu.png', 'none', 16, 'inter', 24, 'bold', '#062c60', '\"{\\\"horizontal\\\":\\\"left\\\",\\\"vertical\\\":\\\"top\\\",\\\"padding\\\":{\\\"top\\\":0,\\\"bottom\\\":0,\\\"left\\\":0,\\\"right\\\":0}}\"', 0, '#000000', 'inter', 16, '#4e525a', '\"{\\\"horizontal\\\":\\\"left\\\",\\\"vertical\\\":\\\"top\\\",\\\"padding\\\":{\\\"top\\\":0,\\\"bottom\\\":0,\\\"left\\\":0,\\\"right\\\":0}}\"', 20, 8, 1, '#e5e7eb', 'solid', 0, 'rgba(0, 0, 0, 0.1)', 10, 5, 'scale', 300, '', 1, 0, '0e971fe1-d22a-446e-9fb9-f52149e29df3', '2025-08-16 17:24:05.036', '2025-08-17 01:16:01.624', 'Default premium course banner design', 'APPROVED', '2025-08-17 01:16:01.622', '0e971fe1-d22a-446e-9fb9-f52149e29df3', 1, 'premium-course-banner'),
('cmeej0xak0001lxvhavazhpw2', 'Featured Institution Banner Design (Original)', 'Original design for featured institution advertising banner matching AdvertisingBanner styling', 'gradient', '#ffffff', '#f97316', '#ef4444', 'to-r', '', 'none', 15, 'inter', 20, 'bold', '#111827', '\"{\\\"horizontal\\\":\\\"left\\\",\\\"vertical\\\":\\\"top\\\",\\\"padding\\\":{\\\"top\\\":0,\\\"bottom\\\":8,\\\"left\\\":0,\\\"right\\\":0}}\"', 0, '#000000', 'inter', 14, '#4b5563', '\"{\\\"horizontal\\\":\\\"left\\\",\\\"vertical\\\":\\\"top\\\",\\\"padding\\\":{\\\"top\\\":8,\\\"bottom\\\":16,\\\"left\\\":0,\\\"right\\\":0}}\"', 24, 8, 0, '#e2e8f0', 'solid', 1, 'rgba(0, 0, 0, 0.1)', 10, 4, 'none', 300, NULL, 1, 1, '0e971fe1-d22a-446e-9fb9-f52149e29df3', '2025-08-16 17:24:05.132', '2025-08-16 22:28:13.662', 'Default featured institution banner design', 'APPROVED', '2025-08-16 17:24:05.028', '0e971fe1-d22a-446e-9fb9-f52149e29df3', 1, 'featured-institution-banner'),
('cmeej0xaz0002lxvhz281i29z', 'Promotional Banner Design (Original)', 'Original design for promotional advertising banner matching AdvertisingBanner styling', 'gradient', '#ffffff', '#10b981', '#059669', 'to-r', '', 'none', 15, 'inter', 20, 'bold', '#111827', '\"{\\\"horizontal\\\":\\\"center\\\",\\\"vertical\\\":\\\"top\\\",\\\"padding\\\":{\\\"top\\\":0,\\\"bottom\\\":10,\\\"left\\\":0,\\\"right\\\":0}}\"', 0, '#000000', 'inter', 14, '#4b5563', '\"{\\\"horizontal\\\":\\\"center\\\",\\\"vertical\\\":\\\"top\\\",\\\"padding\\\":{\\\"top\\\":10,\\\"bottom\\\":20,\\\"left\\\":0,\\\"right\\\":0}}\"', 24, 8, 0, 'transparent', 'solid', 1, 'rgba(0, 0, 0, 0.15)', 10, 4, 'none', 300, NULL, 1, 1, '0e971fe1-d22a-446e-9fb9-f52149e29df3', '2025-08-16 17:24:05.147', '2025-08-16 22:28:13.662', 'Default promotional banner design', 'APPROVED', '2025-08-16 17:24:05.028', '0e971fe1-d22a-446e-9fb9-f52149e29df3', 1, 'promotional-banner'),
('cmeeze4nn0000142nxu8fqssm', 'Default Premium Course Banner', 'Default styling for premium course banners with purple gradient', 'gradient', '#8b5cf6', '#8b5cf6', '#ec4899', 'to-r', '', 'none', 10, 'inter', 24, 'bold', '#1f2937', '\"{\\\"horizontal\\\":\\\"left\\\",\\\"vertical\\\":\\\"top\\\",\\\"padding\\\":{\\\"top\\\":0,\\\"bottom\\\":0,\\\"left\\\":0,\\\"right\\\":0}}\"', 0, '#000000', 'inter', 16, '#6b7280', '\"{\\\"horizontal\\\":\\\"left\\\",\\\"vertical\\\":\\\"top\\\",\\\"padding\\\":{\\\"top\\\":0,\\\"bottom\\\":0,\\\"left\\\":0,\\\"right\\\":0}}\"', 20, 8, 1, '#e5e7eb', 'solid', 0, 'rgba(0, 0, 0, 0.1)', 10, 5, 'none', 300, '', 1, 1, NULL, '2025-08-17 01:02:15.059', '2025-08-17 01:02:15.059', NULL, 'PENDING', NULL, NULL, 0, 'premium-course-banner');

-- --------------------------------------------------------

--
-- Table structure for table `design_templates`
--

DROP TABLE IF EXISTS `design_templates`;
CREATE TABLE IF NOT EXISTS `design_templates` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `config` json NOT NULL,
  `previewImage` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usageCount` int NOT NULL DEFAULT '0',
  `isPublic` tinyint(1) NOT NULL DEFAULT '0',
  `createdBy` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_settings`
--

DROP TABLE IF EXISTS `email_settings`;
CREATE TABLE IF NOT EXISTS `email_settings` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `host` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `port` int NOT NULL,
  `secure` tinyint(1) NOT NULL DEFAULT '1',
  `username` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fromEmail` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fromName` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `rejectUnauthorized` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `email_settings`
--

INSERT INTO `email_settings` (`id`, `host`, `port`, `secure`, `username`, `password`, `fromEmail`, `fromName`, `createdAt`, `updatedAt`, `rejectUnauthorized`) VALUES
('1', '', 587, 0, 'test-admin@sterlingcollegelondon.com', 'xepawim0661', 'admin@sterlingcollegelondon.com', 'Testing SCL Admin', '2025-06-15 19:39:18.480', '2025-06-26 12:24:53.280', 0);

-- --------------------------------------------------------

--
-- Table structure for table `exercises`
--

DROP TABLE IF EXISTS `exercises`;
CREATE TABLE IF NOT EXISTS `exercises` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `module_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('MULTIPLE_CHOICE','FILL_IN_BLANK','MATCHING','SHORT_ANSWER') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` json DEFAULT NULL,
  `order_index` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_exercises_module_id` (`module_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exercise_attempts`
--

DROP TABLE IF EXISTS `exercise_attempts`;
CREATE TABLE IF NOT EXISTS `exercise_attempts` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exerciseId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userAnswer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `isCorrect` tinyint(1) NOT NULL,
  `submittedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `exercise_attempts_exerciseId_idx` (`exerciseId`),
  KEY `exercise_attempts_studentId_idx` (`studentId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `institution`
--

DROP TABLE IF EXISTS `institution`;
CREATE TABLE IF NOT EXISTS `institution` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `postcode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `website` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `institutionEmail` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactJobTitle` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactPhone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactEmail` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logoUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `isApproved` tinyint(1) NOT NULL DEFAULT '0',
  `currency` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `commissionRate` float NOT NULL DEFAULT '10',
  `discountSettings` json DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `socialMedia` json DEFAULT NULL,
  `defaultMaxStudents` int NOT NULL DEFAULT '15',
  `stripeCustomerId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mainImageUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subscriptionPlan` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BASIC',
  `isFeatured` tinyint(1) NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `slug` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `institution_slug_key` (`slug`),
  KEY `Institution_slug_idx` (`slug`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `institution`
--

INSERT INTO `institution` (`id`, `name`, `description`, `address`, `city`, `state`, `country`, `postcode`, `email`, `website`, `createdAt`, `updatedAt`, `institutionEmail`, `telephone`, `contactName`, `contactJobTitle`, `contactPhone`, `contactEmail`, `logoUrl`, `facilities`, `status`, `isApproved`, `currency`, `commissionRate`, `discountSettings`, `metadata`, `socialMedia`, `defaultMaxStudents`, `stripeCustomerId`, `mainImageUrl`, `subscriptionPlan`, `isFeatured`, `isActive`, `slug`) VALUES
('42308252-a934-4eef-b663-37a7076bb177', 'XYZ Language School', 'XYZ Language School - Premium language education with personalized learning paths and certified instructors.', '12 Upper Road', 'London', 'England', 'United Kingdom', 'E17 1AA', 'jbloggs@xyz.com', 'https://www.xyz.com', '2025-06-05 23:50:18.379', '2025-08-17 15:53:57.858', 'info@xyz.com', '0123456789', 'Ed Burns', 'Admissions Manager', '01234567890', 'ed.burns@xyz.com', '/uploads/logo/42308252-a934-4eef-b663-37a7076bb177/f456af5c-8db6-46ad-a7b5-287899223a84.png', '[\"/uploads/facilities/42308252-a934-4eef-b663-37a7076bb177/1752600283429-3nayxhx4tkc.jpg\",\"/uploads/facilities/42308252-a934-4eef-b663-37a7076bb177/1752600291977-en752yzdgz.jpg\",\"/uploads/facilities/42308252-a934-4eef-b663-37a7076bb177/1752600302495-emrpa7gmo1r.jpg\",\"/uploads/facilities/42308252-a934-4eef-b663-37a7076bb177/1752600318752-fybviq0tky.jpg\",\"/uploads/facilities/42308252-a934-4eef-b663-37a7076bb177/1752600331468-a8htwjf1bhr.jpg\"]', 'ACTIVE', 1, 'USD', 20, '{\"enabled\": false, \"startingRate\": 5, \"incrementRate\": 2.5, \"maxDiscountCap\": 50, \"incrementPeriodWeeks\": 4}', NULL, NULL, 15, NULL, '/uploads/mainImage/42308252-a934-4eef-b663-37a7076bb177/dde1a58d-dc44-4fb1-b205-4932310edfad.jpg', 'ENTERPRISE', 1, 1, 'xyz-language-school'),
('c5962019-07ca-4a78-a97f-3cf394e5bf94', 'ABC Shool of English', 'ABC Shool of English - Professional language training with industry-focused curriculum.', '123 Test Street', 'Madison', 'Wisconsin', 'United States', '45678', 'tjones@abc.ac.uk', 'https://www.abc.ac.uk', '2025-06-05 23:50:57.130', '2025-08-17 15:53:57.870', 'info@abc.ac.uk', '0123456789', 'Andy Caperone', 'Admissions Manager', '0123456789', 'andy.caperon@abc.ac.uk', '/uploads/logo/c5962019-07ca-4a78-a97f-3cf394e5bf94/2dbe8c64-6ef4-4e52-88f4-3a3978ff44cb.png', '[\"/uploads/facility/c5962019-07ca-4a78-a97f-3cf394e5bf94/417fec33-6eab-45eb-9066-21cc0a4c734b.jpg\",\"/uploads/facility/c5962019-07ca-4a78-a97f-3cf394e5bf94/3ae0c44e-828f-4b83-97b1-3a4a35c88d77.jpg\",\"/uploads/facility/c5962019-07ca-4a78-a97f-3cf394e5bf94/03cde774-4146-4c1a-a4df-2d2e2fc32347.jpeg\",\"/uploads/facility/c5962019-07ca-4a78-a97f-3cf394e5bf94/15107098-eb8b-445a-9a83-34fca03abd63.jpg\",\"/uploads/facility/c5962019-07ca-4a78-a97f-3cf394e5bf94/7204facb-b09e-4077-b862-1ab84cd93804.jpg\"]', 'ACTIVE', 1, 'USD', 18, '{\"enabled\": false, \"startingRate\": 5, \"incrementRate\": 2.5, \"maxDiscountCap\": 50, \"incrementPeriodWeeks\": 4}', NULL, NULL, 15, NULL, '/uploads/mainImage/c5962019-07ca-4a78-a97f-3cf394e5bf94/179f2a8c-7be6-4921-8b7a-7ec7350a13b5.jpg', 'PROFESSIONAL', 0, 1, 'abc-shool-of-english'),
('9f71efc3-7b31-4953-b398-29f2197af202', 'GraceFul English School', 'Institution description will be updated after approval', '123 la Rue', 'Lorient', 'Brittany', 'France', '5621', 'grace@ges.ac.uk', 'https://www.ges.ac.uk', '2025-07-01 22:02:16.480', '2025-08-17 15:53:57.878', 'admin@ges.ac.uk', '0123456789', 'Fred Astire', 'Admissions', '0123456789', 'fred.astire@ges.ac.uk', '/uploads/logo/9f71efc3-7b31-4953-b398-29f2197af202/5a8067a3-54c2-4d40-8244-a3b20fd2ca19.png', '[\"/uploads/facility/9f71efc3-7b31-4953-b398-29f2197af202/654b7d7b-e606-4798-9b56-97e9876ac0b4.jpg\",\"/uploads/facility/9f71efc3-7b31-4953-b398-29f2197af202/454f373a-032b-4cf0-aff8-664a60929aef.jpg\",\"/uploads/facility/9f71efc3-7b31-4953-b398-29f2197af202/d7a53988-d3f2-4a7b-968a-3348a067b16c.jpg\",\"/uploads/facility/9f71efc3-7b31-4953-b398-29f2197af202/36afc99e-2e6a-4c08-8f95-bf6888f98c9e.jpg\",\"/uploads/facility/9f71efc3-7b31-4953-b398-29f2197af202/7ccdc57d-23f9-430b-8b91-7a7c610a38bf.jpg\"]', 'PENDING', 0, 'USD', 0, NULL, NULL, NULL, 15, NULL, '/uploads/mainImage/9f71efc3-7b31-4953-b398-29f2197af202/6f0c2c89-9c5a-4eca-83c8-1e08ba7d4d7f.jpg', 'BASIC', 0, 1, 'graceful-english-school');

-- --------------------------------------------------------

--
-- Table structure for table `institution_billing_history`
--

DROP TABLE IF EXISTS `institution_billing_history`;
CREATE TABLE IF NOT EXISTS `institution_billing_history` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subscriptionId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `billingDate` datetime(3) NOT NULL,
  `amount` double NOT NULL,
  `currency` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `paymentMethod` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transactionId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoiceNumber` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `institution_billing_history_subscriptionId_idx` (`subscriptionId`),
  KEY `institution_billing_history_billingDate_idx` (`billingDate`),
  KEY `institution_billing_history_status_idx` (`status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `institution_billing_history`
--

INSERT INTO `institution_billing_history` (`id`, `subscriptionId`, `billingDate`, `amount`, `currency`, `status`, `paymentMethod`, `transactionId`, `invoiceNumber`, `description`, `metadata`, `createdAt`) VALUES
('cmckkn4bh00003358tjh7zcc5', 'cmcjo5f3d0004man3v7v70r3h', '2025-06-01 13:36:32.665', 99, 'USD', 'PAID', 'CREDIT_CARD', 'TXN_1751376992665_779ptjf8w', NULL, 'Monthly subscription payment for STARTER plan', NULL, '2025-07-01 13:36:32.669'),
('cmckkn4bh000133583gtniaf5', 'cmcjo5f3d0004man3v7v70r3h', '2025-05-02 13:36:32.665', 99, 'USD', 'PAID', 'CREDIT_CARD', 'TXN_1751376992665_qu8yh79sl', NULL, 'Monthly subscription payment for STARTER plan', NULL, '2025-07-01 13:36:32.669'),
('cmckkn4cr00043358n71qtea4', 'cmcjo5f5n0006man304vivjzp', '2025-06-01 13:36:32.714', 99, 'USD', 'PAID', 'CREDIT_CARD', 'TXN_1751376992714_b80lwxenl', NULL, 'Monthly subscription payment for STARTER plan', NULL, '2025-07-01 13:36:32.716'),
('cmckkn4cr00053358uqq4ih7z', 'cmcjo5f5n0006man304vivjzp', '2025-05-02 13:36:32.714', 99, 'USD', 'PAID', 'CREDIT_CARD', 'TXN_1751376992714_milexkyi6', NULL, 'Monthly subscription payment for STARTER plan', NULL, '2025-07-01 13:36:32.716'),
('cmckkosfy0000cb32an8e1r4v', 'cmcjo5f3d0004man3v7v70r3h', '2025-06-01 13:37:50.581', 99, 'USD', 'PAID', 'CREDIT_CARD', 'TXN_1751377070581_ig4a7n5wi', NULL, 'Monthly subscription payment for STARTER plan', NULL, '2025-07-01 13:37:50.590'),
('cmckkosfy0001cb32jtwdh91n', 'cmcjo5f3d0004man3v7v70r3h', '2025-05-02 13:37:50.581', 99, 'USD', 'PAID', 'CREDIT_CARD', 'TXN_1751377070581_o1hw6nvln', NULL, 'Monthly subscription payment for STARTER plan', NULL, '2025-07-01 13:37:50.590'),
('cmckkosgj0004cb32akesmjzj', 'cmcjo5f5n0006man304vivjzp', '2025-06-01 13:37:50.609', 99, 'USD', 'PAID', 'CREDIT_CARD', 'TXN_1751377070609_259rs2w3c', NULL, 'Monthly subscription payment for STARTER plan', NULL, '2025-07-01 13:37:50.611'),
('cmckkosgj0005cb32gp2wsirc', 'cmcjo5f5n0006man304vivjzp', '2025-05-02 13:37:50.609', 99, 'USD', 'PAID', 'CREDIT_CARD', 'TXN_1751377070609_xf6qe04s7', NULL, 'Monthly subscription payment for STARTER plan', NULL, '2025-07-01 13:37:50.611'),
('cmcknp2ch00071fth0sz33ko6', 'cmcjo5f3d0004man3v7v70r3h', '2025-07-01 15:02:02.253', 399, 'USD', 'PAID', 'MANUAL', NULL, 'INV-1751382122271', 'Initial payment for PROFESSIONAL plan', NULL, '2025-07-01 15:02:02.273'),
('68bb1e61-2645-45c8-a79b-92f37010bed7', 'cmcjo5f3d0004man3v7v70r3h', '2025-07-14 13:43:13.387', 799, 'USD', 'PAID', 'CREDIT_CARD', 'txn_2f506700c53a4a77a4b9dc55f27a845e', 'INV-1752500593387', 'Monthly subscription for Enterprise Plan', NULL, '2025-07-14 13:43:13.390'),
('6139130f-c894-4033-b4ce-8ac1d75ad373', 'cmcjo5f5n0006man304vivjzp', '2025-07-14 13:43:13.481', 299, 'USD', 'PAID', 'CREDIT_CARD', 'txn_52375f6b9a88409e8504d989edda36e5', 'INV-1752500593481', 'Monthly subscription for Professional Plan', NULL, '2025-07-14 13:43:13.483'),
('c5ba955f-4095-4eb7-b17a-ab7b2d912f07', 'a2603de4-1d28-4004-8187-690a5732780a', '2025-07-14 13:43:13.490', 799, 'USD', 'PAID', 'CREDIT_CARD', 'txn_0464c668af24431c9863e01f67aba043', 'INV-1752500593490', 'Monthly subscription for Enterprise Plan', NULL, '2025-07-14 13:43:13.492'),
('7c200b56-47ee-48ed-b64d-3006bee76fcc', 'c8be9e96-ab00-4368-95eb-1c61f164b980', '2025-07-14 13:43:13.500', 299, 'USD', 'PAID', 'CREDIT_CARD', 'txn_515e68c31d064eb7b166ca55c2a9b047', 'INV-1752500593500', 'Monthly subscription for Professional Plan', NULL, '2025-07-14 13:43:13.502'),
('501bf523-f7fb-4cc6-8811-e44da2a4433b', '8592dc64-404e-45f8-82ca-be51ef90141c', '2025-07-14 13:43:13.510', 99, 'USD', 'PAID', 'CREDIT_CARD', 'txn_3f2bf379153541de9b26dc672535882d', 'INV-1752500593510', 'Monthly subscription for Starter Plan', NULL, '2025-07-14 13:43:13.513'),
('29b47569-3e4c-4b14-8901-323621c04d61', '9c535138-5f7f-483c-9cbc-624c11f2a07b', '2025-07-14 13:43:13.519', 99, 'USD', 'PAID', 'CREDIT_CARD', 'txn_2e117ef1aa554e389cd9a1812b63f746', 'INV-1752500593519', 'Monthly subscription for Starter Plan', NULL, '2025-07-14 13:43:13.521'),
('a8c59324-4874-4902-b026-c71064bfbbf1', '7fcfd1b6-2654-4e7f-b10f-5022f6bfa1e1', '2025-07-14 13:43:13.528', 299, 'USD', 'PAID', 'CREDIT_CARD', 'txn_1e2dc6c61ab64af89d4f16a7e84f0c9d', 'INV-1752500593528', 'Monthly subscription for Professional Plan', NULL, '2025-07-14 13:43:13.530'),
('4a0d675c-ff90-4bc2-937c-c63eaa63f923', '5a822799-076f-458a-b76a-1a2cabaeae36', '2025-07-14 13:43:13.536', 99, 'USD', 'PAID', 'CREDIT_CARD', 'txn_5416834e1bdf412cacbbde1ad073ce0f', 'INV-1752500593536', 'Monthly subscription for Starter Plan', NULL, '2025-07-14 13:43:13.538'),
('7e098cac-aa9a-4b9b-8cdc-a88fe44a8b09', 'b07596df-473f-4159-9670-08d45a1cfcbe', '2025-07-14 13:43:13.546', 299, 'USD', 'PAID', 'CREDIT_CARD', 'txn_0bcb01b72b5f4652b76e03c4ac8cebd2', 'INV-1752500593546', 'Monthly subscription for Professional Plan', NULL, '2025-07-14 13:43:13.548'),
('40f9f592-bffd-4075-8bb4-ade74177b5c8', 'cmcjo5f3d0004man3v7v70r3h', '2025-07-14 13:58:54.211', 99, 'USD', 'PAID', 'CREDIT_CARD', 'txn_fb766b2b71c746dbb4573e4132b0d9cc', 'INV-1752501534211', 'Monthly subscription for Starter Plan', NULL, '2025-07-14 13:58:54.214'),
('dffb57db-20ac-4715-9df3-c76d88e7cd2b', 'cmcjo5f5n0006man304vivjzp', '2025-07-14 13:58:54.229', 299, 'USD', 'PAID', 'CREDIT_CARD', 'txn_350fdd41123944d79eadde5438c48472', 'INV-1752501534229', 'Monthly subscription for Professional Plan', NULL, '2025-07-14 13:58:54.231'),
('3c017fa2-d1eb-4348-a0b5-f1e407fc78ea', 'a2603de4-1d28-4004-8187-690a5732780a', '2025-07-14 13:58:54.245', 299, 'USD', 'PAID', 'CREDIT_CARD', 'txn_ea9b55b355bb4429ab9ae357104de546', 'INV-1752501534245', 'Monthly subscription for Professional Plan', NULL, '2025-07-14 13:58:54.246'),
('b8cc3dbf-b2b6-4fb6-979c-d6d0d41e4942', 'c8be9e96-ab00-4368-95eb-1c61f164b980', '2025-07-14 13:58:54.251', 299, 'USD', 'PAID', 'CREDIT_CARD', 'txn_7db13673344145ba8fd06a171b848068', 'INV-1752501534251', 'Monthly subscription for Professional Plan', NULL, '2025-07-14 13:58:54.252'),
('61e9cd89-dd36-4a48-9104-2061c621e87c', '8592dc64-404e-45f8-82ca-be51ef90141c', '2025-07-14 13:58:54.263', 99, 'USD', 'PAID', 'CREDIT_CARD', 'txn_494f59e39414463fb668292e9c149305', 'INV-1752501534263', 'Monthly subscription for Starter Plan', NULL, '2025-07-14 13:58:54.264'),
('c7b806f1-cfbb-4c5b-b97d-bec083d1dc12', '9c535138-5f7f-483c-9cbc-624c11f2a07b', '2025-07-14 13:58:54.272', 99, 'USD', 'PAID', 'CREDIT_CARD', 'txn_f61a8c7c670e48e480fed97f714a14c7', 'INV-1752501534272', 'Monthly subscription for Starter Plan', NULL, '2025-07-14 13:58:54.274'),
('6ad20bd8-dfa6-4724-9e37-461fc1b66dee', '7fcfd1b6-2654-4e7f-b10f-5022f6bfa1e1', '2025-07-14 13:58:54.282', 299, 'USD', 'PAID', 'CREDIT_CARD', 'txn_0335cda4757e4e55a47b48719e3af678', 'INV-1752501534282', 'Monthly subscription for Professional Plan', NULL, '2025-07-14 13:58:54.283'),
('d4c8fa29-f2c2-4a86-b2be-79c1fe25c6e4', '5a822799-076f-458a-b76a-1a2cabaeae36', '2025-07-14 13:58:54.297', 799, 'USD', 'PAID', 'CREDIT_CARD', 'txn_efab98e4f23249148bbd97ea6cb708a8', 'INV-1752501534297', 'Monthly subscription for Enterprise Plan', NULL, '2025-07-14 13:58:54.298'),
('d8d1b764-1e5d-4dc9-a137-6f512b36e83d', 'b07596df-473f-4159-9670-08d45a1cfcbe', '2025-07-14 13:58:54.307', 799, 'USD', 'PAID', 'CREDIT_CARD', 'txn_933782e520b742f7bbed050b41511859', 'INV-1752501534307', 'Monthly subscription for Enterprise Plan', NULL, '2025-07-14 13:58:54.308');

-- --------------------------------------------------------

--
-- Table structure for table `institution_commissions`
--

DROP TABLE IF EXISTS `institution_commissions`;
CREATE TABLE IF NOT EXISTS `institution_commissions` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institutionId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rate` double NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `institution_commissions_institutionId_key` (`institutionId`),
  KEY `institution_commissions_institutionId_idx` (`institutionId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `institution_commissions`
--

INSERT INTO `institution_commissions` (`id`, `institutionId`, `rate`, `isActive`, `createdAt`, `updatedAt`) VALUES
('cmcjo5fgp0008man3k7r957mi', '42308252-a934-4eef-b663-37a7076bb177', 25, 1, '2025-06-30 22:26:59.593', '2025-06-30 22:26:59.593'),
('cmcjo5fgu000aman3v782uvxm', 'c5962019-07ca-4a78-a97f-3cf394e5bf94', 25, 1, '2025-06-30 22:26:59.599', '2025-06-30 22:26:59.599');

-- --------------------------------------------------------

--
-- Table structure for table `institution_payouts`
--

DROP TABLE IF EXISTS `institution_payouts`;
CREATE TABLE IF NOT EXISTS `institution_payouts` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institutionId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `enrollmentId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `institution_payouts_institutionId_idx` (`institutionId`),
  KEY `institution_payouts_enrollmentId_idx` (`enrollmentId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `institution_payouts`
--

INSERT INTO `institution_payouts` (`id`, `institutionId`, `enrollmentId`, `amount`, `status`, `metadata`, `createdAt`, `updatedAt`) VALUES
('cmc9nj0mm0006nfpudyrfcn8q', 'c5962019-07ca-4a78-a97f-3cf394e5bf94', 'cmc9mxh5h0002nfpuj5trp8e3', 1323, 'PENDING', '{\"paymentId\": \"ADMIN_1750716712173\", \"approvedAt\": \"2025-06-23T22:11:52.173Z\", \"approvedBy\": \"0e971fe1-d22a-446e-9fb9-f52149e29df3\", \"paymentMethod\": \"ADMIN_APPROVED\"}', '2025-06-23 22:11:52.174', '2025-06-23 22:11:52.174'),
('cmc9nvw9v000dnfpu8na9qy45', 'c5962019-07ca-4a78-a97f-3cf394e5bf94', 'cmc9nqqaf0009nfpuade5uuis', 7840, 'PENDING', '{\"paymentId\": \"ADMIN_1750717313057\", \"approvedAt\": \"2025-06-23T22:21:53.057Z\", \"approvedBy\": \"0e971fe1-d22a-446e-9fb9-f52149e29df3\", \"paymentMethod\": \"ADMIN_APPROVED\"}', '2025-06-23 22:21:53.059', '2025-06-23 22:21:53.059'),
('cmcd9rixp0006wifredv31k1k', '42308252-a934-4eef-b663-37a7076bb177', 'cmcd9i1td0002wifriuxiimz4', 2200, 'PENDING', '{\"paymentId\": \"ADMIN_1750935459226\", \"approvedAt\": \"2025-06-26T10:57:39.226Z\", \"approvedBy\": \"0e971fe1-d22a-446e-9fb9-f52149e29df3\", \"paymentMethod\": \"ADMIN_APPROVED\"}', '2025-06-26 10:57:39.229', '2025-06-26 10:57:39.229'),
('cmd2gant500005z9zxww2jbvh', 'c5962019-07ca-4a78-a97f-3cf394e5bf94', 'cmcjfsy7x0002hfzgyyaxhx3y', 1992.6, 'PENDING', '{\"paymentId\": \"ADMIN_1752458084102\", \"approvedAt\": \"2025-07-14T01:54:44.102Z\", \"approvedBy\": \"0e971fe1-d22a-446e-9fb9-f52149e29df3\", \"paymentMethod\": \"ADMIN_APPROVED\"}', '2025-07-14 01:54:44.104', '2025-07-14 01:54:44.104');

-- --------------------------------------------------------

--
-- Table structure for table `institution_permissions`
--

DROP TABLE IF EXISTS `institution_permissions`;
CREATE TABLE IF NOT EXISTS `institution_permissions` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institutionId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `canCreateCourses` tinyint(1) NOT NULL DEFAULT '0',
  `canEditCourses` tinyint(1) NOT NULL DEFAULT '0',
  `canDeleteCourses` tinyint(1) NOT NULL DEFAULT '0',
  `canPublishCourses` tinyint(1) NOT NULL DEFAULT '0',
  `canCreateContent` tinyint(1) NOT NULL DEFAULT '0',
  `canEditContent` tinyint(1) NOT NULL DEFAULT '0',
  `canDeleteContent` tinyint(1) NOT NULL DEFAULT '0',
  `canUploadMedia` tinyint(1) NOT NULL DEFAULT '0',
  `canCreateQuizzes` tinyint(1) NOT NULL DEFAULT '0',
  `canEditQuizzes` tinyint(1) NOT NULL DEFAULT '0',
  `canDeleteQuizzes` tinyint(1) NOT NULL DEFAULT '0',
  `canViewQuizResults` tinyint(1) NOT NULL DEFAULT '0',
  `canViewStudents` tinyint(1) NOT NULL DEFAULT '0',
  `canManageStudents` tinyint(1) NOT NULL DEFAULT '0',
  `canViewEnrollments` tinyint(1) NOT NULL DEFAULT '0',
  `canViewPayments` tinyint(1) NOT NULL DEFAULT '0',
  `canViewPayouts` tinyint(1) NOT NULL DEFAULT '0',
  `canManagePricing` tinyint(1) NOT NULL DEFAULT '0',
  `canViewAnalytics` tinyint(1) NOT NULL DEFAULT '0',
  `canViewReports` tinyint(1) NOT NULL DEFAULT '0',
  `canExportData` tinyint(1) NOT NULL DEFAULT '0',
  `canEditProfile` tinyint(1) NOT NULL DEFAULT '0',
  `canManageUsers` tinyint(1) NOT NULL DEFAULT '0',
  `canViewSettings` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `institution_permissions_institutionId_key` (`institutionId`),
  KEY `institution_permissions_institutionId_idx` (`institutionId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `institution_permissions`
--

INSERT INTO `institution_permissions` (`id`, `institutionId`, `createdAt`, `updatedAt`, `canCreateCourses`, `canEditCourses`, `canDeleteCourses`, `canPublishCourses`, `canCreateContent`, `canEditContent`, `canDeleteContent`, `canUploadMedia`, `canCreateQuizzes`, `canEditQuizzes`, `canDeleteQuizzes`, `canViewQuizResults`, `canViewStudents`, `canManageStudents`, `canViewEnrollments`, `canViewPayments`, `canViewPayouts`, `canManagePricing`, `canViewAnalytics`, `canViewReports`, `canExportData`, `canEditProfile`, `canManageUsers`, `canViewSettings`) VALUES
('cmc2i6z1c0001ojthwik3hhwz', '42308252-a934-4eef-b663-37a7076bb177', '2025-06-18 22:08:08.928', '2025-06-19 23:48:23.228', 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0),
('cmc40r4dq0001v0vugvnwq4sy', 'c5962019-07ca-4a78-a97f-3cf394e5bf94', '2025-06-19 23:35:28.238', '2025-06-28 19:03:20.841', 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `institution_subscriptions`
--

DROP TABLE IF EXISTS `institution_subscriptions`;
CREATE TABLE IF NOT EXISTS `institution_subscriptions` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institutionId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `startDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `endDate` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `autoRenew` tinyint(1) NOT NULL DEFAULT '1',
  `cancellationReason` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cancelledAt` datetime(3) DEFAULT NULL,
  `commissionTierId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `institution_subscriptions_institutionId_key` (`institutionId`),
  KEY `institution_subscriptions_institutionId_idx` (`institutionId`),
  KEY `institution_subscriptions_status_idx` (`status`),
  KEY `institution_subscriptions_endDate_idx` (`endDate`),
  KEY `institution_subscriptions_commissionTierId_fkey` (`commissionTierId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `institution_subscriptions`
--

INSERT INTO `institution_subscriptions` (`id`, `institutionId`, `status`, `startDate`, `endDate`, `createdAt`, `updatedAt`, `autoRenew`, `cancellationReason`, `cancelledAt`, `commissionTierId`) VALUES
('cmcjo5f3d0004man3v7v70r3h', '42308252-a934-4eef-b663-37a7076bb177', 'ACTIVE', '2025-07-01 15:02:02.349', '2025-08-01 15:02:02.349', '2025-06-30 22:26:59.113', '2025-07-04 23:25:05.589', 1, NULL, NULL, 'cmcjo5f2b0000man3v5b54dxt'),
('cmcjo5f5n0006man304vivjzp', 'c5962019-07ca-4a78-a97f-3cf394e5bf94', 'ACTIVE', '2025-06-30 22:26:59.193', '2026-06-30 22:26:59.193', '2025-06-30 22:26:59.195', '2025-07-04 23:25:05.743', 1, NULL, NULL, 'cmcjo5f2b0000man3v5b54dxt'),
('a2603de4-1d28-4004-8187-690a5732780a', '9f71efc3-7b31-4953-b398-29f2197af202', 'ACTIVE', '2025-07-14 13:43:13.484', '2026-07-14 13:43:13.484', '2025-07-14 13:43:13.486', '2025-07-14 13:43:13.486', 1, NULL, NULL, 'cmcjo5f2s0002man3kimifkjj');

-- --------------------------------------------------------

--
-- Table structure for table `institution_subscription_logs`
--

DROP TABLE IF EXISTS `institution_subscription_logs`;
CREATE TABLE IF NOT EXISTS `institution_subscription_logs` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subscriptionId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `oldPlan` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `newPlan` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oldAmount` double DEFAULT NULL,
  `newAmount` double DEFAULT NULL,
  `oldBillingCycle` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `newBillingCycle` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `institution_subscription_logs_subscriptionId_idx` (`subscriptionId`),
  KEY `institution_subscription_logs_action_idx` (`action`),
  KEY `institution_subscription_logs_createdAt_idx` (`createdAt`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `institution_subscription_logs`
--

INSERT INTO `institution_subscription_logs` (`id`, `subscriptionId`, `action`, `oldPlan`, `newPlan`, `oldAmount`, `newAmount`, `oldBillingCycle`, `newBillingCycle`, `userId`, `reason`, `metadata`, `createdAt`) VALUES
('cmckkn4ck00023358z9h075hk', 'cmcjo5f3d0004man3v7v70r3h', 'SUBSCRIPTION_CREATED', NULL, 'STARTER', NULL, 99, NULL, NULL, 'SYSTEM', 'Initial subscription created with STARTER plan', NULL, '2025-07-01 13:36:32.708'),
('cmckkn4ck00033358np1e9hzz', 'cmcjo5f3d0004man3v7v70r3h', 'PAYMENT_PROCESSED', 'STARTER', 'STARTER', 99, 99, NULL, NULL, 'SYSTEM', 'Payment processed for 99 USD', NULL, '2025-07-01 13:36:32.708'),
('cmckkn4cu000633584zv4f9r7', 'cmcjo5f5n0006man304vivjzp', 'SUBSCRIPTION_CREATED', NULL, 'STARTER', NULL, 99, NULL, NULL, 'SYSTEM', 'Initial subscription created with STARTER plan', NULL, '2025-07-01 13:36:32.718'),
('cmckkn4cu00073358xtxv5e0j', 'cmcjo5f5n0006man304vivjzp', 'PAYMENT_PROCESSED', 'STARTER', 'STARTER', 99, 99, NULL, NULL, 'SYSTEM', 'Payment processed for 99 USD', NULL, '2025-07-01 13:36:32.718'),
('cmckkosg40002cb32rb9kys6v', 'cmcjo5f3d0004man3v7v70r3h', 'SUBSCRIPTION_CREATED', NULL, 'STARTER', NULL, 99, NULL, NULL, 'SYSTEM', 'Initial subscription created with STARTER plan', NULL, '2025-07-01 13:37:50.596'),
('cmckkosg40003cb3237118c7i', 'cmcjo5f3d0004man3v7v70r3h', 'PAYMENT_PROCESSED', 'STARTER', 'STARTER', 99, 99, NULL, NULL, 'SYSTEM', 'Payment processed for 99 USD', NULL, '2025-07-01 13:37:50.596'),
('cmckkosgm0006cb32t7ubvs8c', 'cmcjo5f5n0006man304vivjzp', 'SUBSCRIPTION_CREATED', NULL, 'STARTER', NULL, 99, NULL, NULL, 'SYSTEM', 'Initial subscription created with STARTER plan', NULL, '2025-07-01 13:37:50.614'),
('cmckkosgm0007cb32d220o0ak', 'cmcjo5f5n0006man304vivjzp', 'PAYMENT_PROCESSED', 'STARTER', 'STARTER', 99, 99, NULL, NULL, 'SYSTEM', 'Payment processed for 99 USD', NULL, '2025-07-01 13:37:50.614'),
('cmckn9z1x0001148yvaxw6nim', 'cmcjo5f3d0004man3v7v70r3h', 'CANCEL', 'STARTER', NULL, 99, NULL, 'MONTHLY', NULL, 'SYSTEM', 'Test cancellation', NULL, '2025-07-01 14:50:18.165'),
('cmckn9z3i0003148yj8igs836', 'cmcjo5f3d0004man3v7v70r3h', 'REACTIVATE', NULL, 'STARTER', NULL, 99, NULL, 'MONTHLY', 'SYSTEM', 'Subscription reactivated', NULL, '2025-07-01 14:50:18.223'),
('cmcknkgjw00011yhtvkf2dxdf', 'cmcjo5f3d0004man3v7v70r3h', 'CANCEL', 'STARTER', NULL, 99, NULL, 'MONTHLY', NULL, 'SYSTEM', 'Test fallback demo', NULL, '2025-07-01 14:58:27.405'),
('cmcknkgmm00031yhtdcj206uq', 'cmcjo5f3d0004man3v7v70r3h', 'REACTIVATE', NULL, 'STARTER', NULL, 99, NULL, 'MONTHLY', 'SYSTEM', 'Subscription reactivated', NULL, '2025-07-01 14:58:27.502'),
('cmcknp2an00011fthwbwpe8bs', 'cmcjo5f3d0004man3v7v70r3h', 'CANCEL', 'STARTER', NULL, 99, NULL, 'MONTHLY', NULL, 'SYSTEM', 'Test fallback detailed', NULL, '2025-07-01 15:02:02.208'),
('cmcknp2cb00051fthsvhgobw7', 'cmcjo5f3d0004man3v7v70r3h', 'UPGRADE', 'STARTER', 'PROFESSIONAL', 99, 399, 'MONTHLY', 'MONTHLY', 'SYSTEM', 'Plan upgrade', NULL, '2025-07-01 15:02:02.268'),
('cmcknp2dr00091fthfslubok4', 'cmcjo5f3d0004man3v7v70r3h', 'CANCEL', 'PROFESSIONAL', NULL, 399, NULL, 'MONTHLY', NULL, 'SYSTEM', 'Test PROFESSIONAL cancellation', NULL, '2025-07-01 15:02:02.319'),
('cmcknp2ew000b1fthjl4t6359', 'cmcjo5f3d0004man3v7v70r3h', 'REACTIVATE', NULL, 'PROFESSIONAL', NULL, 399, NULL, 'MONTHLY', 'SYSTEM', 'Subscription reactivated', NULL, '2025-07-01 15:02:02.360');

-- --------------------------------------------------------

--
-- Table structure for table `language_proficiency_questions`
--

DROP TABLE IF EXISTS `language_proficiency_questions`;
CREATE TABLE IF NOT EXISTS `language_proficiency_questions` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bankId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `difficulty` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `question` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` json NOT NULL,
  `correctAnswer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `explanation` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `usageCount` int NOT NULL DEFAULT '0',
  `successRate` double NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `language_proficiency_questions_bankId_idx` (`bankId`),
  KEY `language_proficiency_questions_level_idx` (`level`),
  KEY `language_proficiency_questions_category_idx` (`category`),
  KEY `language_proficiency_questions_difficulty_idx` (`difficulty`),
  KEY `language_proficiency_questions_isActive_idx` (`isActive`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `language_proficiency_questions`
--

INSERT INTO `language_proficiency_questions` (`id`, `bankId`, `level`, `category`, `difficulty`, `question`, `options`, `correctAnswer`, `explanation`, `usageCount`, `successRate`, `isActive`, `createdAt`, `updatedAt`) VALUES
('28b2228a-048d-4675-9b0e-ce3a3eeb6865', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'A1', 'grammar', 'easy', '¿Cuál es la forma correcta del verbo \'ser\' en la frase: Yo ___ estudiante?', '[\"es\", \"eres\", \"soy\", \"somos\"]', 'soy', 'El verbo \'ser\' se conjuga como \'soy\' en primera persona singular.', 0, 0, 1, '2025-08-12 12:09:21.125', '2025-08-12 12:09:21.125'),
('00e9ffb7-de7f-4632-a7c9-d58ab77bdd5c', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'A1', 'grammar', 'easy', 'Selecciona el artículo definido para \'libro\'.', '[\"la\", \"el\", \"los\", \"las\"]', 'el', '\'Libro\' es masculino singular, por lo que usa el artículo \'el\'.', 0, 0, 1, '2025-08-12 12:09:21.417', '2025-08-12 12:09:21.417'),
('a4aa5152-8645-4d20-8d94-4e275bc21420', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'A1', 'grammar', 'easy', '¿Cómo se conjuga \'hablar\' con \'tú\' en presente?', '[\"hablas\", \"hablo\", \"habla\", \"hablamos\"]', 'hablas', 'El verbo \'hablar\' se conjuga como \'hablas\' en segunda persona singular.', 0, 0, 1, '2025-08-12 12:09:21.420', '2025-08-12 12:09:21.420'),
('3023978e-674d-4e5b-a80c-466d48ecf101', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'A1', 'grammar', 'easy', 'Completa: Nosotros ___ amigos.', '[\"soy\", \"es\", \"somos\", \"son\"]', 'somos', 'El verbo \'ser\' se conjuga como \'somos\' en primera persona plural.', 0, 0, 1, '2025-08-12 12:09:21.455', '2025-08-12 12:09:21.455'),
('18d0435f-fa9a-4bbe-88bc-71c821821ea2', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'A1', 'grammar', 'easy', '¿Qué pronombre corresponde a \'María y yo\'?', '[\"ellos\", \"nosotros\", \"tú\", \"usted\"]', 'nosotros', '\'María y yo\' se refiere a primera persona plural, por lo que es \'nosotros\'.', 0, 0, 1, '2025-08-12 12:09:21.457', '2025-08-12 12:09:21.457'),
('c0decb12-8c4b-4b33-bfe1-2b771663647a', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'A1', 'vocabulary', 'easy', '¿Qué palabra significa \'dog\'?', '[\"gato\", \"casa\", \"perro\", \"mesa\"]', 'perro', '\'Perro\' es la traducción de \'dog\' en español.', 0, 0, 1, '2025-08-12 12:09:21.460', '2025-08-12 12:09:21.460'),
('dbd12dcc-c3ef-42fb-8bf2-0f059b6757f2', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'A1', 'vocabulary', 'easy', '¿Cuál es un color?', '[\"silla\", \"azul\", \"mano\", \"calle\"]', 'azul', '\'Azul\' es un color en español.', 0, 0, 1, '2025-08-12 12:09:21.465', '2025-08-12 12:09:21.465'),
('0d1ebd73-908a-44d3-8c79-8be137f0087f', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'A1', 'vocabulary', 'easy', '¿Cuál es el antónimo de \'grande\'?', '[\"alto\", \"bajo\", \"pequeño\", \"largo\"]', 'pequeño', '\'Pequeño\' es el antónimo de \'grande\'.', 0, 0, 1, '2025-08-12 12:09:21.470', '2025-08-12 12:09:21.470'),
('5fc24410-c410-4846-bf67-a6374748099c', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'A1', 'vocabulary', 'easy', '¿Qué día sigue después del lunes?', '[\"martes\", \"jueves\", \"domingo\", \"viernes\"]', 'martes', 'El martes sigue después del lunes en la semana.', 0, 0, 1, '2025-08-12 12:09:21.473', '2025-08-12 12:09:21.473'),
('429005cb-74ea-4c75-93a5-5454c4e0280e', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'A1', 'vocabulary', 'easy', '¿Cuál de estas palabras es una bebida?', '[\"leche\", \"zapato\", \"coche\", \"papel\"]', 'leche', '\'Leche\' es una bebida en español.', 0, 0, 1, '2025-08-12 12:09:21.475', '2025-08-12 12:09:21.475'),
('16e98d47-43d0-4eb9-9988-9b92a0f7abea', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'A2', 'grammar', 'medium', '¿Cuál es la forma correcta: \'Ellos ___ al cine ayer\'?', '[\"fueron\", \"van\", \"irán\", \"iban\"]', 'fueron', 'Se usa el pretérito indefinido \'fueron\' para acciones completadas en el pasado.', 0, 0, 1, '2025-08-12 12:09:21.478', '2025-08-12 12:09:21.478'),
('b51e5f93-eb30-47b3-9372-5e080f8cb7be', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'A2', 'grammar', 'medium', 'Completa: ¿___ tú venir con nosotros?', '[\"Quieres\", \"Quiero\", \"Quiere\", \"Quieren\"]', 'Quieres', 'Se usa \'quieres\' para preguntar a la segunda persona singular.', 0, 0, 1, '2025-08-12 12:09:21.480', '2025-08-12 12:09:21.480'),
('38936515-1972-4d8f-92fd-9b8d4637aab9', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'A2', 'grammar', 'medium', '¿Cómo se dice \'We are going to eat\' en español?', '[\"Vamos a comer\", \"Iremos a comer\", \"Comemos ahora\", \"Estamos comiendo\"]', 'Vamos a comer', '\'Vamos a comer\' es la forma correcta de expresar futuro próximo.', 0, 0, 1, '2025-08-12 12:09:21.484', '2025-08-12 12:09:21.484'),
('ca195edb-d1ca-49eb-8329-39c31295ed79', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'A2', 'grammar', 'medium', 'Selecciona la preposición correcta: Estoy ___ la casa.', '[\"en\", \"con\", \"de\", \"por\"]', 'en', 'Se usa \'en\' para indicar ubicación dentro de un lugar.', 0, 0, 1, '2025-08-12 12:09:21.487', '2025-08-12 12:09:21.487'),
('1f21029d-4bc5-4b46-b7e7-d5589799442c', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'A2', 'grammar', 'medium', '¿Cuál es el pretérito de \'comer\' con \'él\'?', '[\"comía\", \"comerá\", \"comió\", \"come\"]', 'comió', 'El pretérito indefinido de \'comer\' en tercera persona singular es \'comió\'.', 0, 0, 1, '2025-08-12 12:09:21.490', '2025-08-12 12:09:21.490'),
('65c9d445-c3fa-43e9-9377-c01ebe20a151', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'A2', 'vocabulary', 'medium', '¿Cuál palabra se relaciona con la escuela?', '[\"cuaderno\", \"sartén\", \"sofá\", \"leche\"]', 'cuaderno', '\'Cuaderno\' es un objeto relacionado con la escuela.', 0, 0, 1, '2025-08-12 12:09:21.495', '2025-08-12 12:09:21.495'),
('c535db25-02cc-4379-b04b-7f8924674c6b', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'A2', 'vocabulary', 'medium', '¿Qué palabra es un verbo?', '[\"escribir\", \"mesa\", \"azul\", \"puerta\"]', 'escribir', '\'Escribir\' es un verbo en infinitivo.', 0, 0, 1, '2025-08-12 12:09:21.498', '2025-08-12 12:09:21.498'),
('ff7413f6-3275-4fa2-ad69-b6a8189337cd', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'A2', 'vocabulary', 'medium', '¿Qué objeto se usa para escribir?', '[\"lápiz\", \"silla\", \"pan\", \"mesa\"]', 'lápiz', '\'Lápiz\' es el objeto que se usa para escribir.', 0, 0, 1, '2025-08-12 12:09:21.501', '2025-08-12 12:09:21.501'),
('eff4b06c-238b-4088-ac1a-abd28e9b1f3d', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'A2', 'vocabulary', 'medium', '¿Cuál palabra es una prenda de vestir?', '[\"camisa\", \"libro\", \"agua\", \"papel\"]', 'camisa', '\'Camisa\' es una prenda de vestir.', 0, 0, 1, '2025-08-12 12:09:21.503', '2025-08-12 12:09:21.503'),
('857b7ce5-917b-46b6-b231-6d5e5bd9a64c', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'A2', 'vocabulary', 'medium', '¿Qué palabra es un sinónimo de \'contento\'?', '[\"feliz\", \"triste\", \"cansado\", \"preocupado\"]', 'feliz', '\'Feliz\' es un sinónimo de \'contento\'.', 0, 0, 1, '2025-08-12 12:09:21.505', '2025-08-12 12:09:21.505'),
('493da78b-94f1-4fb8-a6e1-e354fb01c49b', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'grammar', 'medium', 'Pregunta B1 Gramática 1: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.510', '2025-08-12 12:09:21.510'),
('9524d6ff-7b33-4331-ae17-bc1326ff225f', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'grammar', 'medium', 'Pregunta B1 Gramática 2: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.514', '2025-08-12 12:09:21.514'),
('a8315dd0-bb64-4039-995d-0540979fb96d', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'grammar', 'medium', 'Pregunta B1 Gramática 3: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.517', '2025-08-12 12:09:21.517'),
('2b8e9031-cea0-41c2-a0b9-ad148a950a12', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'grammar', 'medium', 'Pregunta B1 Gramática 4: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.519', '2025-08-12 12:09:21.519'),
('e59f5fe6-7944-4364-a071-aab66fdd6843', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'grammar', 'medium', 'Pregunta B1 Gramática 5: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.522', '2025-08-12 12:09:21.522'),
('9d474b73-77d0-471b-9f82-af09d02eb285', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'grammar', 'medium', 'Pregunta B1 Gramática 6: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.524', '2025-08-12 12:09:21.524'),
('46d21713-3782-43d6-ac19-a6e6491e7d49', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'grammar', 'medium', 'Pregunta B1 Gramática 7: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.528', '2025-08-12 12:09:21.528'),
('9a664457-33d2-480e-b1ef-90077171198b', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'grammar', 'medium', 'Pregunta B1 Gramática 8: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.532', '2025-08-12 12:09:21.532'),
('820b8a21-4357-47dd-9790-7e1455454a5c', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'grammar', 'medium', 'Pregunta B1 Gramática 9: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.536', '2025-08-12 12:09:21.536'),
('45c83805-a9af-4877-af3d-ebe6fd917b91', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'grammar', 'medium', 'Pregunta B1 Gramática 10: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.538', '2025-08-12 12:09:21.538'),
('d42e8498-b8d8-470a-8046-1a984d6b431d', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'grammar', 'medium', 'Pregunta B1 Gramática 11: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.541', '2025-08-12 12:09:21.541'),
('16d7fba8-8bdc-4c1e-8b2d-4293698d7e6e', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'grammar', 'medium', 'Pregunta B1 Gramática 12: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.543', '2025-08-12 12:09:21.543'),
('adfea5cd-100e-47b4-acdf-133bc6064bfa', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'grammar', 'medium', 'Pregunta B1 Gramática 13: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.545', '2025-08-12 12:09:21.545'),
('2c558e78-2fd5-4d11-b300-8050ec18a7ff', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'grammar', 'medium', 'Pregunta B1 Gramática 14: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.550', '2025-08-12 12:09:21.550'),
('162aeb8e-021e-4b7d-9e4b-5f37565d8b90', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'grammar', 'medium', 'Pregunta B1 Gramática 15: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.552', '2025-08-12 12:09:21.552'),
('e9b54ef1-5f8b-4778-8cfa-f08c1b3e2d77', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'grammar', 'medium', 'Pregunta B1 Gramática 16: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.556', '2025-08-12 12:09:21.556'),
('48b12b62-cf84-476f-a5fa-4285ab9a715f', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'grammar', 'medium', 'Pregunta B1 Gramática 17: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.561', '2025-08-12 12:09:21.561'),
('a060ffcf-8c01-420b-9891-b9cbf63c3ef4', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'grammar', 'medium', 'Pregunta B1 Gramática 18: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.565', '2025-08-12 12:09:21.565'),
('6ded477c-2f16-4d91-9636-4c5d5bf5eef5', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'vocabulary', 'medium', 'Pregunta B1 Vocabulario 1: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.568', '2025-08-12 12:09:21.568'),
('242423db-a9fa-49b4-9629-be1399f7448c', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'vocabulary', 'medium', 'Pregunta B1 Vocabulario 2: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.571', '2025-08-12 12:09:21.571'),
('fa60c30b-63e3-4a8d-9bd4-f4f5b036c69e', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'vocabulary', 'medium', 'Pregunta B1 Vocabulario 3: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.574', '2025-08-12 12:09:21.574'),
('c3395ce4-e846-4e3a-ac10-b12df274c00d', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'vocabulary', 'medium', 'Pregunta B1 Vocabulario 4: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.579', '2025-08-12 12:09:21.579'),
('03defb65-7ed4-4de6-8f5e-55d790f2261a', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'vocabulary', 'medium', 'Pregunta B1 Vocabulario 5: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.584', '2025-08-12 12:09:21.584'),
('2749c780-0b06-4a2a-a839-e7fae0efb867', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'vocabulary', 'medium', 'Pregunta B1 Vocabulario 6: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.588', '2025-08-12 12:09:21.588'),
('a50eeebc-a94a-460a-9eb5-d9f4c4b95722', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'vocabulary', 'medium', 'Pregunta B1 Vocabulario 7: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.591', '2025-08-12 12:09:21.591'),
('eb536291-4bd0-49f3-a3e4-9cd4cbf2b7bc', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'vocabulary', 'medium', 'Pregunta B1 Vocabulario 8: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.594', '2025-08-12 12:09:21.594'),
('9db04870-083d-4443-9326-4046fe94e516', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'vocabulary', 'medium', 'Pregunta B1 Vocabulario 9: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.601', '2025-08-12 12:09:21.601'),
('7ace933f-c0c2-4a00-83aa-413db3a3c1d4', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'vocabulary', 'medium', 'Pregunta B1 Vocabulario 10: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.607', '2025-08-12 12:09:21.607'),
('a326ea72-a02e-4bbe-9a01-5c632a42431d', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'vocabulary', 'medium', 'Pregunta B1 Vocabulario 11: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.610', '2025-08-12 12:09:21.610'),
('2ee1a6de-a59f-4525-838f-c85c1734232f', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'vocabulary', 'medium', 'Pregunta B1 Vocabulario 12: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.613', '2025-08-12 12:09:21.613'),
('29d47159-c77d-4223-952a-ec8f2018b51b', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'vocabulary', 'medium', 'Pregunta B1 Vocabulario 13: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.617', '2025-08-12 12:09:21.617'),
('bc8bd79a-d9c4-4571-90ca-8ce76bb0cbed', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'vocabulary', 'medium', 'Pregunta B1 Vocabulario 14: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.620', '2025-08-12 12:09:21.620'),
('c702f779-6d93-4f93-bc37-005514b23c54', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'vocabulary', 'medium', 'Pregunta B1 Vocabulario 15: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.625', '2025-08-12 12:09:21.625'),
('5fcc259e-22c9-448e-b4e0-63233952b202', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'vocabulary', 'medium', 'Pregunta B1 Vocabulario 16: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.629', '2025-08-12 12:09:21.629'),
('2f1eccfa-9313-412c-90eb-367c85973b30', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B1', 'vocabulary', 'medium', 'Pregunta B1 Vocabulario 17: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.633', '2025-08-12 12:09:21.633'),
('530a66be-8f00-4222-bd83-487e446277a7', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'grammar', 'hard', 'Pregunta B2 Gramática 1: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.636', '2025-08-12 12:09:21.636'),
('033d6650-7a8c-47a5-a692-2d55d103b6a6', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'grammar', 'hard', 'Pregunta B2 Gramática 2: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.638', '2025-08-12 12:09:21.638'),
('fc9e4d96-6f73-4e68-8a91-cc454d3af9b9', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'grammar', 'hard', 'Pregunta B2 Gramática 3: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.643', '2025-08-12 12:09:21.643'),
('b8a325b7-a8c2-4fb8-a409-ae733938c290', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'grammar', 'hard', 'Pregunta B2 Gramática 4: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.649', '2025-08-12 12:09:21.649'),
('3044460d-7085-4463-9eec-c91e9dfeef5f', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'grammar', 'hard', 'Pregunta B2 Gramática 5: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.655', '2025-08-12 12:09:21.655'),
('b7b4d3c2-156a-4283-ac94-f3dd03a14ff0', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'grammar', 'hard', 'Pregunta B2 Gramática 6: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.660', '2025-08-12 12:09:21.660'),
('1777b876-01fd-456e-ba56-639cf0ddc7cd', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'grammar', 'hard', 'Pregunta B2 Gramática 7: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.670', '2025-08-12 12:09:21.670'),
('134aa7c6-a2df-409b-9c40-495031a3ec45', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'grammar', 'hard', 'Pregunta B2 Gramática 8: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.675', '2025-08-12 12:09:21.675'),
('36921d80-cd15-4a3c-91db-79b3da93aeac', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'grammar', 'hard', 'Pregunta B2 Gramática 9: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.679', '2025-08-12 12:09:21.679'),
('3d28cd54-dc24-4d35-8377-5a230d93dfd8', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'grammar', 'hard', 'Pregunta B2 Gramática 10: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.686', '2025-08-12 12:09:21.686'),
('a9c33b93-8358-4efa-9f61-e049cf8c3b14', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'grammar', 'hard', 'Pregunta B2 Gramática 11: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.691', '2025-08-12 12:09:21.691'),
('0639e03c-d127-4d09-9170-72e158cca1aa', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'grammar', 'hard', 'Pregunta B2 Gramática 12: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.696', '2025-08-12 12:09:21.696'),
('ef6e4fa1-e35d-48b4-b8d7-7bace21bb658', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'grammar', 'hard', 'Pregunta B2 Gramática 13: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.699', '2025-08-12 12:09:21.699'),
('4c399a0c-35cc-4ed1-8411-ed3b23812c0a', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'grammar', 'hard', 'Pregunta B2 Gramática 14: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.702', '2025-08-12 12:09:21.702'),
('7f07b32e-c72d-45ff-b210-2cb571edb79d', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'grammar', 'hard', 'Pregunta B2 Gramática 15: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.705', '2025-08-12 12:09:21.705'),
('3e9dd1c9-d06d-4d4a-811c-322debf3e151', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'grammar', 'hard', 'Pregunta B2 Gramática 16: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.708', '2025-08-12 12:09:21.708'),
('1d3c8b75-8995-4c7b-8d8f-fddaee8c4f22', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'grammar', 'hard', 'Pregunta B2 Gramática 17: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.713', '2025-08-12 12:09:21.713'),
('93e33222-1099-465e-8057-beb51d383e44', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'grammar', 'hard', 'Pregunta B2 Gramática 18: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.718', '2025-08-12 12:09:21.718'),
('cebdf5f6-9c96-4f6b-8d84-07d304af49b7', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'vocabulary', 'hard', 'Pregunta B2 Vocabulario 1: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.721', '2025-08-12 12:09:21.721'),
('293b6be9-19df-4c91-9808-2396552a2fc7', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'vocabulary', 'hard', 'Pregunta B2 Vocabulario 2: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.724', '2025-08-12 12:09:21.724'),
('f375c035-fab1-47a0-9a21-4020ef9fe4f0', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'vocabulary', 'hard', 'Pregunta B2 Vocabulario 3: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.727', '2025-08-12 12:09:21.727'),
('8eeae367-02dc-4a08-89d7-23ec9bb935ca', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'vocabulary', 'hard', 'Pregunta B2 Vocabulario 4: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.738', '2025-08-12 12:09:21.738'),
('9eefced0-f60f-430a-8acf-5637fb7fc454', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'vocabulary', 'hard', 'Pregunta B2 Vocabulario 5: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.743', '2025-08-12 12:09:21.743'),
('b64dec35-8cd3-4e05-a412-a89a8b552f6b', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'vocabulary', 'hard', 'Pregunta B2 Vocabulario 6: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.750', '2025-08-12 12:09:21.750'),
('95fbf1ee-e0d4-4dc1-8ee7-a9714d3ad6d6', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'vocabulary', 'hard', 'Pregunta B2 Vocabulario 7: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.764', '2025-08-12 12:09:21.764'),
('f6189a45-aa6e-4361-b6a2-5745ea939743', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'vocabulary', 'hard', 'Pregunta B2 Vocabulario 8: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.768', '2025-08-12 12:09:21.768'),
('a2d11010-cc71-415d-b9f8-8722bb98a153', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'vocabulary', 'hard', 'Pregunta B2 Vocabulario 9: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.772', '2025-08-12 12:09:21.772'),
('1fa019d1-a726-4d6f-b574-bd7aa0eae079', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'vocabulary', 'hard', 'Pregunta B2 Vocabulario 10: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.782', '2025-08-12 12:09:21.782'),
('efad2a86-7a29-46c1-b61f-4d52fcc7e606', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'vocabulary', 'hard', 'Pregunta B2 Vocabulario 11: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.786', '2025-08-12 12:09:21.786'),
('fd596c49-48ba-4cc0-80a7-772d66d0c3fd', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'vocabulary', 'hard', 'Pregunta B2 Vocabulario 12: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.802', '2025-08-12 12:09:21.802'),
('b7b00109-dab1-4ec2-a70a-2dba4e8f06c6', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'vocabulary', 'hard', 'Pregunta B2 Vocabulario 13: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.808', '2025-08-12 12:09:21.808'),
('0507e849-e406-4070-9915-d3e44c63c35e', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'vocabulary', 'hard', 'Pregunta B2 Vocabulario 14: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.811', '2025-08-12 12:09:21.811'),
('b22e61bd-7748-4393-9492-e73a2c881090', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'vocabulary', 'hard', 'Pregunta B2 Vocabulario 15: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.818', '2025-08-12 12:09:21.818'),
('b3776edf-ded9-4bd7-ae83-75768bc02c50', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'vocabulary', 'hard', 'Pregunta B2 Vocabulario 16: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.821', '2025-08-12 12:09:21.821'),
('6a1451ba-7805-498f-85a5-ef7969540ca3', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'B2', 'vocabulary', 'hard', 'Pregunta B2 Vocabulario 17: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta B2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.827', '2025-08-12 12:09:21.827'),
('3f791e12-72a6-480f-b37e-c3ad067a2ca8', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'grammar', 'hard', 'Pregunta C1 Gramática 1: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.832', '2025-08-12 12:09:21.832'),
('b0911b1f-4ad8-4826-b1f5-f745bca42d05', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'grammar', 'hard', 'Pregunta C1 Gramática 2: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.836', '2025-08-12 12:09:21.836'),
('183c75c7-c43e-46b9-b4af-0a8b5924dac5', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'grammar', 'hard', 'Pregunta C1 Gramática 3: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.840', '2025-08-12 12:09:21.840'),
('2e1c0b26-9ffa-4705-84f5-9ec4b103b887', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'grammar', 'hard', 'Pregunta C1 Gramática 4: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.847', '2025-08-12 12:09:21.847'),
('bc455772-a767-4854-bc07-6155391413a0', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'grammar', 'hard', 'Pregunta C1 Gramática 5: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.854', '2025-08-12 12:09:21.854'),
('7c4cb17f-e28e-4c71-bb34-0c10047a5aa3', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'grammar', 'hard', 'Pregunta C1 Gramática 6: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.857', '2025-08-12 12:09:21.857'),
('48bc1106-c1c7-4d5c-97f9-56d9255c39dd', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'grammar', 'hard', 'Pregunta C1 Gramática 7: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.860', '2025-08-12 12:09:21.860'),
('27a46d20-d032-4557-90e1-0ee31ea80e48', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'grammar', 'hard', 'Pregunta C1 Gramática 8: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.865', '2025-08-12 12:09:21.865'),
('20aaa599-c1ec-4ddb-adf4-a7f8fe701b13', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'grammar', 'hard', 'Pregunta C1 Gramática 9: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.870', '2025-08-12 12:09:21.870'),
('c37121fa-808f-4324-866b-4ada53cf72d3', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'grammar', 'hard', 'Pregunta C1 Gramática 10: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.874', '2025-08-12 12:09:21.874'),
('a25d7632-ac47-48c3-ae19-e12ae105fe4e', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'grammar', 'hard', 'Pregunta C1 Gramática 11: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.876', '2025-08-12 12:09:21.876'),
('242ac33a-fb0f-4ddd-900b-32d649cc577a', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'grammar', 'hard', 'Pregunta C1 Gramática 12: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.879', '2025-08-12 12:09:21.879'),
('cb2fa9a5-1a38-49dd-8de9-5110c1d53897', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'grammar', 'hard', 'Pregunta C1 Gramática 13: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.883', '2025-08-12 12:09:21.883'),
('75e835f2-3da4-4945-8b84-118e5139809a', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'grammar', 'hard', 'Pregunta C1 Gramática 14: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.886', '2025-08-12 12:09:21.886'),
('55920b6d-9c2d-40fb-94ac-70e971eae282', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'grammar', 'hard', 'Pregunta C1 Gramática 15: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.890', '2025-08-12 12:09:21.890'),
('08694a54-4b4a-49b1-b1f5-9b439f746400', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'grammar', 'hard', 'Pregunta C1 Gramática 16: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.894', '2025-08-12 12:09:21.894'),
('7e59bce5-4e0e-43a6-ac85-ba5413b1e45d', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'grammar', 'hard', 'Pregunta C1 Gramática 17: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.899', '2025-08-12 12:09:21.899'),
('902910d4-0ba9-45c2-a6e7-5a4d80602fa0', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'grammar', 'hard', 'Pregunta C1 Gramática 18: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.902', '2025-08-12 12:09:21.902'),
('c9614502-64f0-41b5-bc81-ca0192ca77a0', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'vocabulary', 'hard', 'Pregunta C1 Vocabulario 1: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.905', '2025-08-12 12:09:21.905'),
('d47ff12c-2b51-4bc1-bbb0-f974718b08a7', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'vocabulary', 'hard', 'Pregunta C1 Vocabulario 2: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.910', '2025-08-12 12:09:21.910'),
('c781d9ae-6961-41b9-8721-40ee17c383cd', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'vocabulary', 'hard', 'Pregunta C1 Vocabulario 3: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.916', '2025-08-12 12:09:21.916'),
('25fe4c36-e238-45a6-b09c-9d7543f01907', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'vocabulary', 'hard', 'Pregunta C1 Vocabulario 4: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.920', '2025-08-12 12:09:21.920'),
('1ed32c51-30b1-4f3c-b1b2-02f3034bb566', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'vocabulary', 'hard', 'Pregunta C1 Vocabulario 5: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.923', '2025-08-12 12:09:21.923'),
('cc0bbd30-3c83-4102-9f5d-1dd89269fe6c', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'vocabulary', 'hard', 'Pregunta C1 Vocabulario 6: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.926', '2025-08-12 12:09:21.926'),
('d356351d-b8cc-4dd9-b195-b5923bd3518b', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'vocabulary', 'hard', 'Pregunta C1 Vocabulario 7: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.930', '2025-08-12 12:09:21.930'),
('3a370ed5-0f77-4a06-b9a2-a88e7fbeb24c', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'vocabulary', 'hard', 'Pregunta C1 Vocabulario 8: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.936', '2025-08-12 12:09:21.936'),
('59c8c5ec-719a-4f3e-9291-ed4c23f6aabc', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'vocabulary', 'hard', 'Pregunta C1 Vocabulario 9: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.941', '2025-08-12 12:09:21.941'),
('d2c67fb6-8528-4ad1-89a8-625950978bde', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'vocabulary', 'hard', 'Pregunta C1 Vocabulario 10: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.944', '2025-08-12 12:09:21.944'),
('ebecfb5f-0c1d-4957-a499-60657782da1a', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'vocabulary', 'hard', 'Pregunta C1 Vocabulario 11: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.946', '2025-08-12 12:09:21.946'),
('6e1b29e1-49e9-4f56-8e67-7fb5f637902f', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'vocabulary', 'hard', 'Pregunta C1 Vocabulario 12: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.950', '2025-08-12 12:09:21.950'),
('3fd81b62-0924-4232-8042-ef1956ea4be4', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'vocabulary', 'hard', 'Pregunta C1 Vocabulario 13: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.953', '2025-08-12 12:09:21.953'),
('e862f37d-c07d-44bc-bd4a-8caa76413837', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'vocabulary', 'hard', 'Pregunta C1 Vocabulario 14: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.957', '2025-08-12 12:09:21.957'),
('a5f55792-3e67-4020-b755-2291e628a112', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'vocabulary', 'hard', 'Pregunta C1 Vocabulario 15: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.962', '2025-08-12 12:09:21.962'),
('2edd44c1-2411-4ad6-b527-e8b422d2460b', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'vocabulary', 'hard', 'Pregunta C1 Vocabulario 16: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.966', '2025-08-12 12:09:21.966'),
('ce02b384-2bac-436c-bbe8-df23fa94dd0d', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C1', 'vocabulary', 'hard', 'Pregunta C1 Vocabulario 17: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C1 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:21.969', '2025-08-12 12:09:21.969'),
('11204240-5f85-4f4c-873e-07f0acb58824', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'grammar', 'hard', 'Pregunta C2 Gramática 1: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.972', '2025-08-12 12:09:21.972'),
('a71882fc-2790-4056-b4aa-fad18f1ae32e', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'grammar', 'hard', 'Pregunta C2 Gramática 2: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.978', '2025-08-12 12:09:21.978'),
('b209956a-3b32-4675-8576-023477a25c0e', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'grammar', 'hard', 'Pregunta C2 Gramática 3: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.983', '2025-08-12 12:09:21.983'),
('d6522b0b-69cc-4820-82a1-e16400d5de3d', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'grammar', 'hard', 'Pregunta C2 Gramática 4: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.987', '2025-08-12 12:09:21.987'),
('e4cc9c06-c462-4951-ad5d-a8fc7b30fe9f', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'grammar', 'hard', 'Pregunta C2 Gramática 5: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.990', '2025-08-12 12:09:21.990'),
('6072a578-b8ff-4d32-9c97-ba5744c6b826', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'grammar', 'hard', 'Pregunta C2 Gramática 6: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Gramática.', 0, 0, 1, '2025-08-12 12:09:21.993', '2025-08-12 12:09:21.993'),
('130ac241-beb8-467e-a09e-fb7234045dc8', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'grammar', 'hard', 'Pregunta C2 Gramática 7: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Gramática.', 0, 0, 1, '2025-08-12 12:09:22.003', '2025-08-12 12:09:22.003'),
('bb778a10-246d-4c9c-a906-a93232f2ff8a', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'grammar', 'hard', 'Pregunta C2 Gramática 8: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Gramática.', 0, 0, 1, '2025-08-12 12:09:22.007', '2025-08-12 12:09:22.007'),
('f99974a1-29c9-4df2-b557-95acbd429abc', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'grammar', 'hard', 'Pregunta C2 Gramática 9: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Gramática.', 0, 0, 1, '2025-08-12 12:09:22.010', '2025-08-12 12:09:22.010'),
('88538989-5fb4-4249-bfbf-a975007d39ad', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'grammar', 'hard', 'Pregunta C2 Gramática 10: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Gramática.', 0, 0, 1, '2025-08-12 12:09:22.012', '2025-08-12 12:09:22.012'),
('8a808d95-97cb-4812-a810-c73c0e4bf458', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'grammar', 'hard', 'Pregunta C2 Gramática 11: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Gramática.', 0, 0, 1, '2025-08-12 12:09:22.017', '2025-08-12 12:09:22.017'),
('69715efc-4adb-4309-8149-bab1f639c576', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'grammar', 'hard', 'Pregunta C2 Gramática 12: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Gramática.', 0, 0, 1, '2025-08-12 12:09:22.019', '2025-08-12 12:09:22.019'),
('f3acc9d2-a5a9-4bef-a7c6-e42da1176546', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'grammar', 'hard', 'Pregunta C2 Gramática 13: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Gramática.', 0, 0, 1, '2025-08-12 12:09:22.024', '2025-08-12 12:09:22.024'),
('84c53a43-1411-414d-8279-8ebeaee3335a', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'grammar', 'hard', 'Pregunta C2 Gramática 14: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Gramática.', 0, 0, 1, '2025-08-12 12:09:22.030', '2025-08-12 12:09:22.030'),
('886a89b5-e891-49a1-a293-e7c2ccdac554', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'grammar', 'hard', 'Pregunta C2 Gramática 15: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Gramática.', 0, 0, 1, '2025-08-12 12:09:22.033', '2025-08-12 12:09:22.033'),
('f09e83ca-2c07-4f20-9725-67da98adc4cb', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'grammar', 'hard', 'Pregunta C2 Gramática 16: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Gramática.', 0, 0, 1, '2025-08-12 12:09:22.036', '2025-08-12 12:09:22.036'),
('451a2f62-af77-4366-bc4e-1d628dda12cd', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'grammar', 'hard', 'Pregunta C2 Gramática 17: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Gramática.', 0, 0, 1, '2025-08-12 12:09:22.040', '2025-08-12 12:09:22.040'),
('6c2021c1-0eaf-4a89-8377-dfe9fa9cd0be', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'grammar', 'hard', 'Pregunta C2 Gramática 18: ¿Cuál es la forma correcta?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Gramática.', 0, 0, 1, '2025-08-12 12:09:22.046', '2025-08-12 12:09:22.046'),
('bdaf3e51-36ee-40ed-8fc0-db87211b23c9', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'vocabulary', 'hard', 'Pregunta C2 Vocabulario 1: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:22.051', '2025-08-12 12:09:22.051'),
('231765d3-d50a-4dd7-a16f-b1be67b0159a', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'vocabulary', 'hard', 'Pregunta C2 Vocabulario 2: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:22.055', '2025-08-12 12:09:22.055'),
('3c8b4aef-9ad2-4a40-b0e6-e8f276134340', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'vocabulary', 'hard', 'Pregunta C2 Vocabulario 3: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:22.058', '2025-08-12 12:09:22.058'),
('ee221a69-08fa-4e09-afdf-42d72fe0a689', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'vocabulary', 'hard', 'Pregunta C2 Vocabulario 4: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:22.062', '2025-08-12 12:09:22.062');
INSERT INTO `language_proficiency_questions` (`id`, `bankId`, `level`, `category`, `difficulty`, `question`, `options`, `correctAnswer`, `explanation`, `usageCount`, `successRate`, `isActive`, `createdAt`, `updatedAt`) VALUES
('33d90cda-31cd-4363-bc69-c97ad0ceeccd', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'vocabulary', 'hard', 'Pregunta C2 Vocabulario 5: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:22.067', '2025-08-12 12:09:22.067'),
('4812359e-dec7-4b9d-85d6-71ac4aa4dcb4', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'vocabulary', 'hard', 'Pregunta C2 Vocabulario 6: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:22.074', '2025-08-12 12:09:22.074'),
('3317f8e8-aa55-40ba-873d-91df00b2f8dc', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'vocabulary', 'hard', 'Pregunta C2 Vocabulario 7: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:22.077', '2025-08-12 12:09:22.077'),
('2b6a474c-1e3e-460b-b064-8ba06c53c575', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'vocabulary', 'hard', 'Pregunta C2 Vocabulario 8: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:22.084', '2025-08-12 12:09:22.084'),
('9ef06523-a3b7-488e-900b-a457c7a210af', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'vocabulary', 'hard', 'Pregunta C2 Vocabulario 9: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:22.086', '2025-08-12 12:09:22.086'),
('b908925c-111d-4b18-acac-3a5c17243740', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'vocabulary', 'hard', 'Pregunta C2 Vocabulario 10: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:22.090', '2025-08-12 12:09:22.090'),
('516e3574-d548-436e-b038-e4ec3c42a232', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'vocabulary', 'hard', 'Pregunta C2 Vocabulario 11: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:22.095', '2025-08-12 12:09:22.095'),
('066c5fe4-36c1-4b28-9763-3306fe11125b', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'vocabulary', 'hard', 'Pregunta C2 Vocabulario 12: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:22.098', '2025-08-12 12:09:22.098'),
('69b8e0bd-4608-4a2f-842b-743c1b6144fe', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'vocabulary', 'hard', 'Pregunta C2 Vocabulario 13: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:22.101', '2025-08-12 12:09:22.101'),
('09dacba3-e5d3-47ff-a62e-1f09c3dee6ae', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'vocabulary', 'hard', 'Pregunta C2 Vocabulario 14: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:22.104', '2025-08-12 12:09:22.104'),
('17fdfc6a-4013-4089-9127-396644459ce2', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'vocabulary', 'hard', 'Pregunta C2 Vocabulario 15: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:22.107', '2025-08-12 12:09:22.107'),
('0756464c-d61c-4889-910f-744f5e1c3de8', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'vocabulary', 'hard', 'Pregunta C2 Vocabulario 16: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:22.112', '2025-08-12 12:09:22.112'),
('87f6ff66-cac1-48b9-b86d-3c9dea61916f', '12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'C2', 'vocabulary', 'hard', 'Pregunta C2 Vocabulario 17: ¿Qué significa?', '[\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"]', 'Opción A', 'Explicación para pregunta C2 Vocabulario.', 0, 0, 1, '2025-08-12 12:09:22.117', '2025-08-12 12:09:22.117');

-- --------------------------------------------------------

--
-- Table structure for table `language_proficiency_question_banks`
--

DROP TABLE IF EXISTS `language_proficiency_question_banks`;
CREATE TABLE IF NOT EXISTS `language_proficiency_question_banks` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `languageCode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `totalQuestions` int NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `language_proficiency_question_banks_languageCode_key` (`languageCode`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `language_proficiency_question_banks`
--

INSERT INTO `language_proficiency_question_banks` (`id`, `languageCode`, `name`, `description`, `totalQuestions`, `isActive`, `createdAt`, `updatedAt`) VALUES
('12f0e9e9-ba58-4480-84bd-6756e8d2619d', 'es', 'ES Language Proficiency Test', 'Comprehensive ES proficiency test with questions covering all CEFR levels', 160, 1, '2025-08-12 12:09:19.886', '2025-08-12 12:09:22.120');

-- --------------------------------------------------------

--
-- Table structure for table `language_proficiency_test_attempts`
--

DROP TABLE IF EXISTS `language_proficiency_test_attempts`;
CREATE TABLE IF NOT EXISTS `language_proficiency_test_attempts` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `languageCode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `score` int NOT NULL,
  `level` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `answers` json NOT NULL,
  `timeSpent` int NOT NULL DEFAULT '0',
  `completedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `language_proficiency_test_attempts_userId_idx` (`userId`),
  KEY `language_proficiency_test_attempts_languageCode_idx` (`languageCode`),
  KEY `language_proficiency_test_attempts_completedAt_idx` (`completedAt`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lead_events`
--

DROP TABLE IF EXISTS `lead_events`;
CREATE TABLE IF NOT EXISTS `lead_events` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institutionId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `eventType` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `userAgent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `referrer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `sessionId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactType` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactValue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lead_events_institutionId_idx` (`institutionId`),
  KEY `lead_events_eventType_idx` (`eventType`),
  KEY `lead_events_timestamp_idx` (`timestamp`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lead_events`
--

INSERT INTO `lead_events` (`id`, `institutionId`, `eventType`, `timestamp`, `userAgent`, `referrer`, `sessionId`, `contactType`, `contactValue`, `metadata`) VALUES
('af393cfa-6c56-42dc-a39a-a697b4bd4b0d', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:01:49.277', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('951d7b10-90a1-44c7-a3eb-a072bad083d2', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:01:49.273', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('32f12eb5-aea4-48a7-81e0-5ae44c8f4e08', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:02:45.038', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('c78c9689-ad85-458b-a080-02f81fad17f9', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:02:45.046', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('5f1de8a1-af5c-4dbc-bb4b-b0ba062c14b2', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:23:23.375', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('65163e1e-6127-41a7-a5b8-3173d3fc9cba', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:23:23.373', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('ebbe8d3f-191a-41a5-92e4-89e9bb4a9a74', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:23:28.851', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('e313ca1f-02c2-40a3-9973-08e62c243541', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:23:28.853', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('2f0eabcb-4866-4f13-877d-fffc248021c9', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:24:28.488', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('b91de5fa-b0c7-4f11-b424-84ee2c23b77e', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:24:28.491', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('696a439e-bcbb-4622-bc20-ca8bb61a40ea', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:24:38.160', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('78ffe4ea-4c1f-4b79-ba6c-cd40d1bef410', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:24:38.163', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('065e8a91-4b88-4408-a80a-e485b809bcd1', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:26:08.196', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('6670ddf9-6cd3-4484-9aba-b1135d46b215', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:26:08.199', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('28ac6bce-995d-4295-b131-b578c901f185', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:26:14.076', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('7b08c441-8550-4c0c-8896-87594c13332b', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:26:14.106', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('6988e514-044d-4e80-a11c-a465da56a701', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:26:45.530', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('e9ab29a2-c33c-4672-be2f-25a9244dd4c7', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:26:45.533', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('b367bbe9-6706-40bc-876c-86a47692c7f1', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:35:49.895', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('9e982930-c35c-4163-9e8c-c233ea167872', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:35:49.914', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('d9bad08f-0844-47e9-b2f8-0028a02baa52', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:35:53.108', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('2996b655-d921-4be1-8a46-f2ce1ef45ea2', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:35:53.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('f0f9a0d8-07bf-4e83-99ce-7b35aba27cf4', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:38:08.874', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('5629affc-1c63-4deb-9856-77632c71ece1', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:38:08.877', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('e6fb2475-1d66-402d-a08a-e0dd0c6975f5', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:38:31.822', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('af5170db-be91-415c-bf68-f863d1522b84', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:38:31.825', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('08f87185-3d7f-4d11-9607-19190b04d2ed', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:39:20.145', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('9aafbf40-887f-42f8-ab0e-0686498731f0', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:39:20.147', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('10c51fd7-1a25-4b36-b2bb-7570bd3f033c', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:47:57.800', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('4b8549c0-bd57-4f94-a08e-adc0c0f66358', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:47:57.803', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('5d8459f0-f982-4956-82ef-7b07030eba2a', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:49:03.239', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('bd135623-3386-46e0-889b-edbb68e409a9', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:49:03.242', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('c4c9c68c-e274-4c16-97fd-da6d75d99244', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:52:04.094', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('750a78af-ee27-4aa9-bafb-752430b6ef01', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:52:04.091', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('04f47b38-e1d7-49c9-ba92-5a4b367c3bf4', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:53:41.633', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('d20fe480-9e8e-441e-aba0-082a52323353', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:53:41.636', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('7df2f28c-093d-4e0e-ab80-f69ad19ae263', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:54:03.131', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('3a4ad2d9-e7b6-4753-aaab-05ca0b527926', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:54:03.128', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('677a610d-078b-4983-886d-c92bff81fe46', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:54:24.715', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('02a4d54d-5cb4-4cbe-86d1-333c192a33d6', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:54:24.712', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('11971c01-6cfc-417e-8f4a-da1899ecbf83', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:55:24.223', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('fd9251d9-cf90-4fa7-9253-c8bb165930b6', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:55:24.226', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('6defb167-8547-4803-adea-6ac7c0adecdc', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:56:11.223', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('75a9066c-8a94-4111-9f1a-c4d5bfa17c10', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-15 18:56:11.221', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0', 'http://localhost:3000/institution/profile', 'cdf7520b-ef4b-4f2c-a0d4-591569dbdbfa', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/profile\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 CCleaner/137.0.0.0\"}'),
('4f3df313-908e-47f2-8d47-4ad5ea96b946', 'f34a92af-923f-4d43-af70-02ee407f53b4', 'view', '2025-07-25 11:26:50.419', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/auth/signin', 'fd30978e-4fd2-4aa1-a173-b898338a3d53', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/auth/signin\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('506dd9b6-db8a-4af6-997f-4cb97ff44a3b', 'f34a92af-923f-4d43-af70-02ee407f53b4', 'view', '2025-07-25 11:26:50.423', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/auth/signin', 'fd30978e-4fd2-4aa1-a173-b898338a3d53', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/auth/signin\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('2768316e-fee4-4e2b-82e1-afd4edc516ac', 'f34a92af-923f-4d43-af70-02ee407f53b4', 'view', '2025-07-25 11:28:29.305', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/auth/signin', 'fd30978e-4fd2-4aa1-a173-b898338a3d53', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/auth/signin\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('7bbdd137-ab8f-4442-89dc-061ab08f3f73', 'f34a92af-923f-4d43-af70-02ee407f53b4', 'view', '2025-07-25 11:28:29.309', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/auth/signin', 'fd30978e-4fd2-4aa1-a173-b898338a3d53', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/auth/signin\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('497d21cb-45a4-4c72-ac37-c19a18078d1d', 'f34a92af-923f-4d43-af70-02ee407f53b4', 'view', '2025-07-25 12:14:18.383', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/auth/signin', 'fd30978e-4fd2-4aa1-a173-b898338a3d53', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/auth/signin\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('cf613bea-f667-48b1-8d18-a9bd1da9201f', 'f34a92af-923f-4d43-af70-02ee407f53b4', 'view', '2025-07-25 12:14:18.389', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/auth/signin', 'fd30978e-4fd2-4aa1-a173-b898338a3d53', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/auth/signin\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('dfe4232a-7273-4561-af95-77a6e970387c', 'f34a92af-923f-4d43-af70-02ee407f53b4', 'view', '2025-07-25 12:15:25.352', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/auth/signin', 'fd30978e-4fd2-4aa1-a173-b898338a3d53', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/auth/signin\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('849a34d9-e0ec-4339-9afc-db7fb26a515f', 'f34a92af-923f-4d43-af70-02ee407f53b4', 'view', '2025-07-25 12:15:25.356', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/auth/signin', 'fd30978e-4fd2-4aa1-a173-b898338a3d53', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/auth/signin\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('4df74968-8d6d-45bc-a06c-7264058adad3', 'f34a92af-923f-4d43-af70-02ee407f53b4', 'view', '2025-07-25 12:15:42.487', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/auth/signin', 'fd30978e-4fd2-4aa1-a173-b898338a3d53', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/auth/signin\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('dd73d9db-16fa-49ff-bcdc-f7de0e72edc0', 'f34a92af-923f-4d43-af70-02ee407f53b4', 'view', '2025-07-25 12:15:42.486', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/auth/signin', 'fd30978e-4fd2-4aa1-a173-b898338a3d53', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/auth/signin\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('9b75c25d-cd39-46c5-9fe5-de550f56cbc3', 'f34a92af-923f-4d43-af70-02ee407f53b4', 'view', '2025-07-25 12:17:17.062', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/auth/signin', 'fd30978e-4fd2-4aa1-a173-b898338a3d53', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/auth/signin\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('2ab194f4-fdb0-46c0-88b5-dcc1b373067b', 'f34a92af-923f-4d43-af70-02ee407f53b4', 'view', '2025-07-25 12:17:17.063', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/auth/signin', 'fd30978e-4fd2-4aa1-a173-b898338a3d53', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/auth/signin\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('b24ad4d5-f0d3-4b24-ab34-1c4558f35e45', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-25 12:38:26.298', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/institution/analytics', '2661cdd4-7f64-4aef-8bd0-26565250f65c', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/analytics\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('05a9c8b9-e148-41cb-bfc9-a0f3f2c6a256', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-25 12:38:26.293', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/institution/analytics', '2661cdd4-7f64-4aef-8bd0-26565250f65c', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/analytics\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('dd5099de-4006-4a18-a60c-ee23f72dca39', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-25 12:38:40.955', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/institution/analytics', '2661cdd4-7f64-4aef-8bd0-26565250f65c', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/analytics\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('60579513-acb3-4585-b40d-96b84186545e', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-25 12:38:40.953', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/institution/analytics', '2661cdd4-7f64-4aef-8bd0-26565250f65c', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/analytics\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('4622477b-0c93-46cd-af5a-efbd5f8fe508', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-25 12:57:44.607', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/institution/analytics', '2661cdd4-7f64-4aef-8bd0-26565250f65c', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/analytics\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('698801d3-8abc-45e1-a930-2dd982d092ee', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-25 12:57:44.602', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/institution/analytics', '2661cdd4-7f64-4aef-8bd0-26565250f65c', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/analytics\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('4d4e8b1c-0c1a-4062-9a13-e37d0cbad8e3', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-25 12:58:22.057', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/institution/analytics', '2661cdd4-7f64-4aef-8bd0-26565250f65c', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/analytics\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('a7f17271-bf26-4305-89ee-5b7fee1a9268', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-25 12:58:22.053', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/institution/analytics', '2661cdd4-7f64-4aef-8bd0-26565250f65c', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/institution/analytics\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('4783be7f-39b5-4674-97cd-c0490c75b3cb', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-25 13:45:07.372', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/auth/signin', '77fe7d57-0432-4333-afcc-9f7a9e1667fe', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/auth/signin\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('a5972267-6147-4862-9c76-9a2736e63105', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-25 13:45:07.368', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/auth/signin', '77fe7d57-0432-4333-afcc-9f7a9e1667fe', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/auth/signin\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('ab2cbfae-f1a0-49fb-af73-5d20ea9e4c95', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-25 17:17:47.000', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/auth/signin', '1c5f5bee-027f-41b2-9058-c499cd5302e0', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/auth/signin\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}'),
('174d24cd-6e03-4858-a2a2-76c48e87e388', '42308252-a934-4eef-b663-37a7076bb177', 'view', '2025-07-25 17:17:47.004', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/auth/signin', '1c5f5bee-027f-41b2-9058-c499cd5302e0', NULL, NULL, '{\"ip\": \"::1\", \"referrer\": \"http://localhost:3000/auth/signin\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36\"}');

-- --------------------------------------------------------

--
-- Table structure for table `learning_sessions`
--

DROP TABLE IF EXISTS `learning_sessions`;
CREATE TABLE IF NOT EXISTS `learning_sessions` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `moduleProgressId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `startedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `endedAt` datetime(3) DEFAULT NULL,
  `duration` int NOT NULL DEFAULT '0',
  `activityType` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `learning_sessions_moduleProgressId_idx` (`moduleProgressId`),
  KEY `learning_sessions_startedAt_idx` (`startedAt`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `live_conversations`
--

DROP TABLE IF EXISTS `live_conversations`;
CREATE TABLE IF NOT EXISTS `live_conversations` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `conversationType` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `language` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `startTime` datetime(3) NOT NULL,
  `endTime` datetime(3) NOT NULL,
  `duration` int NOT NULL,
  `maxParticipants` int NOT NULL DEFAULT '8',
  `currentParticipants` int NOT NULL DEFAULT '0',
  `price` double NOT NULL DEFAULT '0',
  `isPublic` tinyint(1) NOT NULL DEFAULT '1',
  `isFree` tinyint(1) NOT NULL DEFAULT '0',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SCHEDULED',
  `meetingUrl` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meetingId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meetingPassword` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instructorId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hostId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `topic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `culturalNotes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `vocabularyList` json DEFAULT NULL,
  `grammarPoints` json DEFAULT NULL,
  `conversationPrompts` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `live_conversations_instructorId_idx` (`instructorId`),
  KEY `live_conversations_hostId_idx` (`hostId`),
  KEY `live_conversations_startTime_idx` (`startTime`),
  KEY `live_conversations_status_idx` (`status`),
  KEY `live_conversations_language_idx` (`language`),
  KEY `live_conversations_level_idx` (`level`),
  KEY `live_conversations_conversationType_idx` (`conversationType`),
  KEY `live_conversations_isFree_idx` (`isFree`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `live_conversations`
--

INSERT INTO `live_conversations` (`id`, `title`, `description`, `conversationType`, `language`, `level`, `startTime`, `endTime`, `duration`, `maxParticipants`, `currentParticipants`, `price`, `isPublic`, `isFree`, `status`, `meetingUrl`, `meetingId`, `meetingPassword`, `instructorId`, `hostId`, `topic`, `culturalNotes`, `vocabularyList`, `grammarPoints`, `conversationPrompts`, `createdAt`, `updatedAt`, `metadata`) VALUES
('conv-001', 'Beginner Spanish Conversation', 'Practice basic Spanish conversation skills with fellow beginners. We\'ll cover greetings, introductions, and everyday topics.', 'GROUP', 'es', 'CEFR_A1', '2025-07-29 01:38:20.000', '2025-07-29 02:38:20.000', 60, 8, 3, 0, 1, 1, 'SCHEDULED', NULL, NULL, NULL, NULL, '0e971fe1-d22a-446e-9fb9-f52149e29df3', 'Basic Introductions', NULL, NULL, NULL, NULL, '2025-07-28 23:38:20.264', '2025-07-28 23:38:20.264', NULL),
('conv-002', 'Business English Practice', 'Improve your business English skills through role-playing exercises and professional discussions.', 'PRACTICE', 'en', 'CEFR_B2', '2025-07-29 03:38:20.000', '2025-07-29 04:38:20.000', 60, 6, 2, 15.99, 1, 0, 'SCHEDULED', NULL, NULL, NULL, NULL, '0e971fe1-d22a-446e-9fb9-f52149e29df3', 'Business Meetings', NULL, NULL, NULL, NULL, '2025-07-28 23:38:20.264', '2025-07-28 23:38:20.264', NULL),
('conv-003', 'French Cultural Exchange', 'Learn about French culture while practicing your French language skills. We\'ll discuss traditions, food, and daily life.', 'CULTURAL', 'fr', 'CEFR_B1', '2025-07-29 23:38:20.000', '2025-07-30 00:38:20.000', 60, 10, 1, 0, 1, 1, 'SCHEDULED', NULL, NULL, NULL, NULL, '0e971fe1-d22a-446e-9fb9-f52149e29df3', 'French Culture', NULL, NULL, NULL, NULL, '2025-07-28 23:38:20.264', '2025-07-28 23:38:20.264', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `live_conversation_bookings`
--

DROP TABLE IF EXISTS `live_conversation_bookings`;
CREATE TABLE IF NOT EXISTS `live_conversation_bookings` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `conversationId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CONFIRMED',
  `bookedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `cancelledAt` datetime(3) DEFAULT NULL,
  `paymentStatus` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PAID',
  `amount` double NOT NULL DEFAULT '0',
  `currency` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `paymentMethod` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transactionId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refundReason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `live_conversation_bookings_conversationId_userId_key` (`conversationId`,`userId`),
  KEY `live_conversation_bookings_conversationId_idx` (`conversationId`),
  KEY `live_conversation_bookings_userId_idx` (`userId`),
  KEY `live_conversation_bookings_status_idx` (`status`),
  KEY `live_conversation_bookings_paymentStatus_idx` (`paymentStatus`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `live_conversation_bookings`
--

INSERT INTO `live_conversation_bookings` (`id`, `conversationId`, `userId`, `status`, `bookedAt`, `cancelledAt`, `paymentStatus`, `amount`, `currency`, `paymentMethod`, `transactionId`, `refundReason`, `metadata`) VALUES
('booking-001', 'conv-001', '0e971fe1-d22a-446e-9fb9-f52149e29df3', 'CONFIRMED', '2025-07-28 23:38:20.267', NULL, 'PAID', 0, 'USD', NULL, NULL, NULL, NULL),
('booking-002', 'conv-002', '0e971fe1-d22a-446e-9fb9-f52149e29df3', 'CONFIRMED', '2025-07-28 23:38:20.267', NULL, 'PAID', 15.99, 'USD', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `live_conversation_messages`
--

DROP TABLE IF EXISTS `live_conversation_messages`;
CREATE TABLE IF NOT EXISTS `live_conversation_messages` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `conversationId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `senderId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipientId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `messageType` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TEXT',
  `language` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `isTranslation` tinyint(1) NOT NULL DEFAULT '0',
  `originalMessage` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `live_conversation_messages_conversationId_idx` (`conversationId`),
  KEY `live_conversation_messages_senderId_idx` (`senderId`),
  KEY `live_conversation_messages_recipientId_idx` (`recipientId`),
  KEY `live_conversation_messages_timestamp_idx` (`timestamp`),
  KEY `live_conversation_messages_messageType_idx` (`messageType`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `live_conversation_participants`
--

DROP TABLE IF EXISTS `live_conversation_participants`;
CREATE TABLE IF NOT EXISTS `live_conversation_participants` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `conversationId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `joinedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `leftAt` datetime(3) DEFAULT NULL,
  `duration` int NOT NULL DEFAULT '0',
  `isInstructor` tinyint(1) NOT NULL DEFAULT '0',
  `isHost` tinyint(1) NOT NULL DEFAULT '0',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'JOINED',
  `speakingTime` int NOT NULL DEFAULT '0',
  `messageCount` int NOT NULL DEFAULT '0',
  `feedback` json DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `live_conversation_participants_conversationId_userId_key` (`conversationId`,`userId`),
  KEY `live_conversation_participants_conversationId_idx` (`conversationId`),
  KEY `live_conversation_participants_userId_idx` (`userId`),
  KEY `live_conversation_participants_status_idx` (`status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

DROP TABLE IF EXISTS `modules`;
CREATE TABLE IF NOT EXISTS `modules` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `level` enum('CEFR_A1','CEFR_A2','CEFR_B1','CEFR_B2','CEFR_C1','CEFR_C2','ACTFL_NOVICE_LOW','ACTFL_NOVICE_MID','ACTFL_NOVICE_HIGH','ACTFL_INTERMEDIATE_LOW','ACTFL_INTERMEDIATE_MID','ACTFL_INTERMEDIATE_HIGH','ACTFL_ADVANCED_LOW','ACTFL_ADVANCED_MID','ACTFL_ADVANCED_HIGH','ACTFL_SUPERIOR','JLPT_N5','JLPT_N4','JLPT_N3','JLPT_N2','JLPT_N1','HSK_1','HSK_2','HSK_3','HSK_4','HSK_5','HSK_6','TOPIK_1','TOPIK_2','TOPIK_3','TOPIK_4','TOPIK_5','TOPIK_6') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_index` int NOT NULL DEFAULT '0',
  `estimated_duration` int NOT NULL DEFAULT '0',
  `vocabulary_list` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `grammar_points` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cultural_notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_published` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_modules_course_id` (`course_id`),
  KEY `idx_modules_order_index` (`order_index`),
  KEY `idx_modules_course_order` (`course_id`,`order_index`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`id`, `course_id`, `title`, `description`, `level`, `order_index`, `estimated_duration`, `vocabulary_list`, `grammar_points`, `cultural_notes`, `is_published`, `created_at`, `updated_at`) VALUES
('207b4eeb-7e33-4707-86b8-50d2a5d54720', '9c8dc68e-b7b7-4362-b4cc-c3913682b4a8', 'Module 1: Academic Writing – Task 1 (Charts, Graphs, and Processes)', 'Objective: Learn how to describe visual information clearly, objectively, and accurately.', 'CEFR_B1', 0, 120, 'Trend language: increase, decrease, remain stable, fluctuate, peak, plummet\n\nComparative expressions: more than, less than, the highest, twice as much\n\nProcess verbs: followed by, begins with, is converted into, results in', 'Passive voice for process descriptions\n\nTime phrases: over a 10-year period, between 2000 and 2020\n\nComplex sentences with linkers: while, whereas, although', 'Academic tone and objectivity in UK educational settings\n\nImportance of clarity over creativity in IELTS writing\n\nExpectation to describe rather than interpret or explain cause', 1, '2025-06-05 23:21:38', '2025-06-14 13:23:01'),
('4eedc947-fbce-4042-992a-c0e3e442fe3e', '9c8dc68e-b7b7-4362-b4cc-c3913682b4a8', 'Module 2: Writing Task 2 – Essays (Opinion, Discussion, Problem-Solution)', 'Objective: Structure high-scoring essays with clear arguments, supported ideas, and cohesive devices.', 'CEFR_B1', 1, 150, 'Opinion phrases: I believe, in my view, it is often argued that\n\nContrast & agreement: on the other hand, however, in contrast, similarly\n\nTopic-specific lexis: urbanisation, globalisation, education reform, environmental sustainability', 'Complex sentence structures with conditionals\n\nSubordinating conjunctions: even though, because, unless, in case\n\nModal verbs for possibility and suggestion: should, might, could, must', 'Balanced argument styles preferred in British academic writing\n\nUse of formal tone and avoiding overly emotional language\n\nDifferences in essay expectations globally vs. UK academic style\n\n', 1, '2025-06-05 23:21:38', '2025-06-14 13:24:41'),
('de35bad5-9e6e-437d-97cc-c7893114dcf8', '9c8dc68e-b7b7-4362-b4cc-c3913682b4a8', 'Module 3: Speaking – Confidence & Coherence Across All Parts', 'Objective: Develop fluency and interactive communication skills for the 3-part IELTS Speaking test.', 'CEFR_B1', 2, 120, 'Everyday expressions: I’d say…, It depends…, To be honest…\n\nSpeculative language: It might be…, Perhaps…, I guess that…\n\nIdiomatic language: hit the books, once in a blue moon, break the ice', 'Accurate use of tenses: past experiences, future plans\n\nQuestion tags for interaction: It’s great, isn’t it?\n\nSentence starters to add fluency: What I mean is…, The thing is…', 'Being personal is encouraged in IELTS Speaking (vs. writing)\n\nBritish politeness and soft disagreement styles\n\nAccent is not graded, but clarity and naturalness are valued', 1, '2025-06-05 23:21:38', '2025-06-14 13:26:17'),
('6dc8b613-3f60-4dc7-9d3f-8752cf130c29', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 'Module 1: Advanced Reading & Use of English Strategies', 'Objective: Master all eight parts of the Reading & Use of English paper\n\n', 'CEFR_B1', 0, 180, '- Formal register phrases (e.g., “in the event of,” “at your earliest convenience”)\n- Idioms (e.g., “go the extra mile,” “burn the midnight oil”)\n- Collocations (e.g., “take precedence,” “pose a challenge”)\n- Abstract nouns and nominalisations', '- Inversions for emphasis (e.g., “Rarely had I seen…”)\n- Ellipsis and substitution\n- Advanced conditionals and mixed tenses\n- Passive transformations', '- British and global publications referenced in exam texts (e.g., The Guardian, National Geographic)\n- Reading for cultural bias and tone in journalistic writing\n- Role of the English press in shaping public discourse\n\n', 1, '2025-06-05 23:21:38', '2025-06-13 21:52:45'),
('993ea185-5d0a-4094-bb22-a88cf6cb4cda', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 'Module 2: High-Level Speaking Performance', 'Objective: Build fluency, accuracy, and interactive communication for Speaking Parts 1–3', 'CEFR_B1', 1, 120, '- Speculative language (e.g., “it could well be,” “there’s a good chance that…”)\n- Phrases for interaction (e.g., “What do you think?” “I see your point, but…”)\n- Topic-specific vocabulary: education, society, art, science, ethics', '- Modals of deduction and speculation (must have, might have, can’t have)\n- Question tags and discourse markers\n- Cleft sentences for emphasis', '- Acceptable ways of disagreement and politeness in UK/US discussions\n- Referencing cultural products (films, books, current issues) appropriately\n- Examining the role of debate in democratic societies', 1, '2025-06-05 23:21:38', '2025-06-13 21:55:28'),
('8ed6aeff-b87d-401a-83bf-c0cf9c7844aa', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 'Module 3: Proficient Writing for Impact', 'Objective: Learn to write high-scoring essays, reports, reviews, and proposals', 'CEFR_B1', 2, 180, '- Academic connectors (e.g., “notwithstanding,” “furthermore”)\n- Opinion and evaluation lexis (e.g., “from my perspective,” “of vital importance”)\n- Genre-specific language for reports and proposals', '- Nominalisation for academic tone\n- Embedded clauses and relative structures\n- Advanced punctuation (colons, semi-colons, em dashes)', '- Differences in formal writing between UK and US English\n- Referencing cultural institutions (e.g., The British Museum, BBC)\n- Essay styles in English-speaking universities', 1, '2025-06-05 23:21:38', '2025-06-13 21:58:13'),
('7c2b5c61-6ff2-46e6-bff7-5507ce3ad1ab', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 'Module 1: Introducing Yourself & Making Small Talk', 'Learn how to introduce yourself and engage in casual conversation in social and professional settings.', 'CEFR_B1', 0, 90, 'greetings, hometown, profession, hobbies, family, interests', 'Present simple, subject pronouns, question formation (yes/no and wh- questions)', 'How small talk is used in English-speaking cultures (safe topics, appropriate boundaries)', 1, '2025-06-05 23:21:38', '2025-06-14 13:38:59'),
('0c2ff584-7f7f-4a12-8cb0-47bf70483d98', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 'Module 4: Food, Cooking, and Eating Out', 'Learn how to talk about food, recipes, dietary habits, and restaurant interactions.', 'CEFR_B1', 1, 90, 'ingredients, main course, side dish, spicy, allergic, vegan, bill', 'Quantifiers (some, any, much, a few), imperatives (for instructions)', 'Mealtime customs in the UK; tipping etiquette in restaurants', 1, '2025-06-05 23:21:38', '2025-06-14 13:43:17'),
('b7d3881b-6abf-42f7-a9d1-6937d9ae8d5e', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 'Module 7: Describing People and Personalities', 'Learn to describe appearance and character in conversations, stories, or interviews.', 'CEFR_B1', 2, 90, 'tall, curly hair, cheerful, ambitious, polite, introverted', 'Adjective order, comparatives, verb “to be”', 'British indirectness in describing people; social appropriateness in different contexts', 1, '2025-06-05 23:21:38', '2025-06-14 13:49:50'),
('cdf6af63-2f9c-4552-902b-19cd227642ed', 'd5975219-7eda-4507-bc4c-3fe2048dfc06', 'Module 1 for ABC Academy Course 2', 'Description for module 1', 'CEFR_B1', 0, 2, 'Key vocabulary for this module', 'Key grammar for this module', 'Cultural insights for this module', 1, '2025-06-05 23:21:38', '2025-06-05 23:21:38'),
('34ead4f9-77c0-493f-9804-b5b26472dfd2', 'd5975219-7eda-4507-bc4c-3fe2048dfc06', 'Module 2 for ABC Academy Course 2', 'Description for module 2', 'CEFR_B1', 1, 2, 'Key vocabulary for this module', 'Key grammar for this module', 'Cultural insights for this module', 1, '2025-06-05 23:21:38', '2025-06-05 23:21:38'),
('6768235b-32cb-49bf-9e96-54f28dbbb47c', 'd5975219-7eda-4507-bc4c-3fe2048dfc06', 'Module 3 for ABC Academy Course 2', 'Description for module 3', 'CEFR_B1', 2, 2, 'Key vocabulary for this module', 'Key grammar for this module', 'Cultural insights for this module', 1, '2025-06-05 23:21:38', '2025-06-05 23:21:38'),
('579d4c74-3908-4386-bd39-9984159e7f0e', '78bfbb28-7f43-423d-9454-1910b1fdabcf', 'Module 1 for ABC Academy Course 3', 'Description for module 1', 'CEFR_B1', 0, 2, 'Key vocabulary for this module', 'Key grammar for this module', 'Cultural insights for this module', 1, '2025-06-05 23:21:38', '2025-06-05 23:21:38'),
('32133e34-6028-4310-b812-ddde0c18b778', '78bfbb28-7f43-423d-9454-1910b1fdabcf', 'Module 2 for ABC Academy Course 3', 'Description for module 2', 'CEFR_B1', 1, 2, 'Key vocabulary for this module', 'Key grammar for this module', 'Cultural insights for this module', 1, '2025-06-05 23:21:38', '2025-06-05 23:21:38'),
('3fa13dae-9fe4-4a11-b084-91604817859b', '78bfbb28-7f43-423d-9454-1910b1fdabcf', 'Module 3 for ABC Academy Course 3', 'Description for module 3', 'CEFR_B1', 2, 2, 'Key vocabulary for this module', 'Key grammar for this module', 'Cultural insights for this module', 1, '2025-06-05 23:21:38', '2025-06-05 23:21:38'),
('0e5aad0b-8c6c-4fdc-8ce2-c19ccdc2a657', '12de3567-2474-4760-a8ff-f58d22cde02d', 'Module 1: Understanding Academic Texts (Reading Skills)', 'Focuses on strategies for reading and understanding academic texts, including identifying arguments, summarizing, and scanning for information.', 'CEFR_B1', 0, 120, 'Thesis, argument, evidence, source, summary, paraphrase, citation', 'Passive voice (e.g., \"It is argued that...\")\n\nComplex sentence structures for cause and effect (e.g., \"Due to..., as a result of...\")', 'Emphasis on independent learning in UK universities\n\nExpected reading load and critical reading mindset', 1, '2025-06-05 23:22:24', '2025-06-14 13:59:54'),
('50abb2aa-4156-4d9a-90b9-7faa4acaf374', '7e806add-bd45-43f6-a28f-fb736707653c', 'Module 1 for XYZ Language School Course 2', 'Description for module 1', 'CEFR_B1', 0, 2, 'Key vocabulary for this module', 'Key grammar for this module', 'Cultural insights for this module', 1, '2025-06-05 23:22:24', '2025-07-25 16:28:23'),
('af2b6284-f275-4503-bbf1-d3f83906a358', '7e806add-bd45-43f6-a28f-fb736707653c', 'Module 2 for XYZ Language School Course 2', 'Description for module 2', 'CEFR_B1', 1, 2, 'Key vocabulary for this module', 'Key grammar for this module', 'Cultural insights for this module', 1, '2025-06-05 23:22:24', '2025-06-05 23:22:24'),
('f0961629-600f-4b14-8f6f-2c62983dd1bd', '7e806add-bd45-43f6-a28f-fb736707653c', 'Module 3 for XYZ Language School Course 2', 'Description for module 3', 'CEFR_B1', 2, 2, 'Key vocabulary for this module', 'Key grammar for this module', 'Cultural insights for this module', 1, '2025-06-05 23:22:24', '2025-06-05 23:22:24'),
('893b8b5b-c43b-46da-abee-845f9bef41b7', '12de3567-2474-4760-a8ff-f58d22cde02d', 'Module 2: Academic Writing – Structuring an Essay', 'Teaches students how to organize a basic academic essay, including introductions, body paragraphs, and conclusions.', 'CEFR_B1', 0, 120, 'Introduction, conclusion, topic sentence, supporting detail, coherence, cohesion', 'Linking devices (however, therefore, in contrast)\n\nParagraph unity and subject-verb agreement in formal writing', 'Plagiarism and referencing expectations in UK higher education\n\nTone and formality in academic writing', 1, '2025-06-05 23:22:24', '2025-06-14 14:04:08'),
('c635672c-5696-4287-8efb-0370fd773676', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 'Module 2: Asking for & Giving Directions', 'Practice how to ask for and give directions in towns, cities, or public spaces confidently.', 'CEFR_B1', 0, 90, 'left, right, straight ahead, across from, next to, traffic lights, roundabout', 'Imperatives, prepositions of place, polite question structures', 'British politeness when asking for help; typical UK landmarks (e.g., post office, tube stations)', 1, '2025-06-05 23:22:24', '2025-06-14 13:40:19'),
('17116ae2-7e17-4d22-8bed-ff704df33572', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 'Module 5: Travel & Holiday Plans', 'Discuss past holidays and make future travel plans using appropriate vocabulary and structures.', 'CEFR_B1', 1, 120, 'itinerary, accommodation, passport, sightseeing, delayed, travel insurance', 'Future forms (going to, will, present continuous), past simple', 'Popular UK destinations; types of holidays common among Brits; budget travel culture', 1, '2025-06-05 23:22:24', '2025-06-14 13:44:42'),
('8ca145d6-5c9e-4633-943d-8c46f803df3c', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 'Module 8: Work & Job Interviews', 'Develop vocabulary for job roles and workplace communication; practise interview situations.', 'CEFR_B1', 2, 90, 'CV, interview, position, promotion, skills, references', 'Present perfect continuous, question forms, past simple', 'CV vs. résumé; typical UK interview questions; workplace hierarchy and etiquette', 1, '2025-06-05 23:22:24', '2025-06-14 13:51:56'),
('e010cd94-1c2c-448d-8003-d1b0c8fd6235', '12de3567-2474-4760-a8ff-f58d22cde02d', 'Module 3: Participating in Seminars & Discussions', 'Prepares students to actively and respectfully take part in group discussions, using turn-taking language and expressing opinions.', 'CEFR_B1', 0, 90, 'Agree, disagree, clarify, interrupt, build on, summarise\n\nPhrases: “Can I just add…”, “I’d like to point out…”', 'Modal verbs for politeness and hedging (e.g., “might”, “could”, “seems”)\n\nIndirect questions (e.g., “I was wondering if…”)', 'Seminar culture in the UK: discussion-focused, not lecture-only\n\nEncouragement of critical thinking and respectful disagreement', 1, '2025-06-05 23:22:24', '2025-06-14 14:05:47'),
('2070f9bd-4946-11f0-9f87-0a0027000007', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 'Module 5: Reading – Skimming, Scanning & True/False/Not Given Mastery', 'Objective: Build speed and confidence with all IELTS reading question types, especially the most challenging ones.', 'CEFR_A1', 4, 0, NULL, NULL, NULL, 0, '2025-06-14 17:36:38', '2025-06-14 17:36:38'),
('2070f921-4946-11f0-9f87-0a0027000007', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 'Module 4: Listening – Strategies for Accuracy', 'Objective: Improve listening comprehension for all four sections, focusing on accuracy and speed.', 'CEFR_A1', 3, 0, NULL, NULL, NULL, 0, '2025-06-14 17:36:38', '2025-06-14 17:36:38'),
('c4d1602a-c590-4c7c-af3d-c065e54d33dd', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 'Module 3: Shopping & Money', 'Build vocabulary and expressions for shopping scenarios, prices, and dealing with transactions.', 'CEFR_B1', 0, 90, 'cashier, discount, refund, receipt, change, price, size', 'Countable/uncountable nouns, comparatives and superlatives', 'Sales culture in the UK (Boxing Day, seasonal sales); customer service and return policies', 1, '2025-06-06 07:53:52', '2025-06-14 13:41:51'),
('238ae916-d6cd-4d2e-a136-11a45a90838a', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 'Module 6: Media & Entertainment', 'Improve fluency by discussing favourite movies, music, books, and media consumption habits.', 'CEFR_B1', 1, 90, 'genre, review, series, stream, episode, host, channel', 'Present perfect vs. past simple, connectors (however, also, therefore)', 'BBC vs. commercial media; British humour; popular UK TV shows', 1, '2025-06-06 07:53:52', '2025-06-14 13:48:17'),
('ec59e3fc-cfb6-4a97-b8ca-04f26c85573c', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 'Module 9: Health, Fitness & Well-being', 'Gain confidence discussing physical and mental health, fitness routines, and healthy lifestyles.', 'CEFR_B1', 2, 90, 'symptoms, prescription, gym, stress, balanced diet, sleep schedule', 'Modals for advice (should, ought to, must), present continuous', 'UK healthcare system (NHS); health-related attitudes; GP appointments', 1, '2025-06-06 07:53:52', '2025-06-14 13:53:42'),
('eb1a6d58-7fde-4abc-92c4-2615f3ebfc96', '12de3567-2474-4760-a8ff-f58d22cde02d', 'Module 4: Describing Data & Trends', 'Helps students interpret and describe data from charts and graphs, commonly used in academic presentations and reports.', 'CEFR_B1', 0, 90, 'Increase, decrease, fluctuate, peak, plateau, sharp, gradual\n\nGraph, table, chart, figure, percentage', 'Past simple vs. present perfect for trends\n\nComparative structures (e.g., \"more than\", \"less than\")', 'Expectation of accuracy and objectivity in data description\n\nAvoiding assumptions or interpretations not supported by evidence', 1, '2025-06-06 07:53:52', '2025-06-14 14:08:21'),
('179a3b47-eea0-45ed-b2f3-ef86be81c06a', '12de3567-2474-4760-a8ff-f58d22cde02d', 'Module 5: Academic Presentations', 'Trains students to deliver structured, formal academic presentations using appropriate language, signposting, and visuals.', 'CEFR_B1', 0, 120, 'Outline, objective, findings, methodology, conclusion, slide, transition\n\nSignpost phrases: “Let’s move on to…”, “This brings us to…”', 'Present simple for describing structure (e.g., “This slide shows…”)\n\nFuture forms for previewing content (“I will explain...”)', 'UK expectations for individual presentations and group projects\n\nVisual clarity, timing, and Q&A etiquette', 1, '2025-06-06 07:53:52', '2025-06-14 14:11:18'),
('2070f87b-4946-11f0-9f87-0a0027000007', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 'Module 3: Speaking – Confidence & Coherence Across All Parts', 'Objective: Develop fluency and interactive communication skills for the 3-part IELTS Speaking test.', 'CEFR_B1', 2, 120, 'Everyday expressions: I’d say…, It depends…, To be honest…\n\nSpeculative language: It might be…, Perhaps…, I guess that…\n\nIdiomatic language: hit the books, once in a blue moon, break the ice', 'Accurate use of tenses: past experiences, future plans\n\nQuestion tags for interaction: It’s great, isn’t it?\n\nSentence starters to add fluency: What I mean is…, The thing is…', 'Being personal is encouraged in IELTS Speaking (vs. writing)\n\nBritish politeness and soft disagreement styles\n\nAccent is not graded, but clarity and naturalness are valued', 1, '2025-06-14 17:36:38', '2025-06-14 17:36:38'),
('2070f753-4946-11f0-9f87-0a0027000007', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 'Module 2: Writing Task 2 – Essays (Opinion, Discussion, Problem-Solution)', 'Objective: Structure high-scoring essays with clear arguments, supported ideas, and cohesive devices.', 'CEFR_B1', 1, 150, 'Opinion phrases: I believe, in my view, it is often argued that\n\nContrast & agreement: on the other hand, however, in contrast, similarly\n\nTopic-specific lexis: urbanisation, globalisation, education reform, environmental sustainability', 'Complex sentence structures with conditionals\n\nSubordinating conjunctions: even though, because, unless, in case\n\nModal verbs for possibility and suggestion: should, might, could, must', 'Balanced argument styles preferred in British academic writing\n\nUse of formal tone and avoiding overly emotional language\n\nDifferences in essay expectations globally vs. UK academic style\n\n', 1, '2025-06-14 17:36:38', '2025-06-14 17:36:38'),
('2070f139-4946-11f0-9f87-0a0027000007', 'e9b6464b-d232-4c5f-a2b4-f30865e9237d', 'Module 1: Academic Writing – Task 1 (Charts, Graphs, and Processes)', 'Objective: Learn how to describe visual information clearly, objectively, and accurately.', 'CEFR_B1', 0, 120, 'Trend language: increase, decrease, remain stable, fluctuate, peak, plummet\n\nComparative expressions: more than, less than, the highest, twice as much\n\nProcess verbs: followed by, begins with, is converted into, results in', 'Passive voice for process descriptions\n\nTime phrases: over a 10-year period, between 2000 and 2020\n\nComplex sentences with linkers: while, whereas, although', 'Academic tone and objectivity in UK educational settings\n\nImportance of clarity over creativity in IELTS writing\n\nExpectation to describe rather than interpret or explain cause', 1, '2025-06-14 17:36:38', '2025-06-18 18:53:29'),
('61359af2-999b-4dcf-8105-e02e52e4ddd6', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 'Module 4: Listening for Nuance & Detail', 'Objective: Train comprehension of accents, idiomatic expressions, and implied meaning', 'CEFR_B1', 3, 30, NULL, NULL, NULL, 0, '2025-06-13 22:01:12', '2025-06-13 22:03:26'),
('84ff9f6f-154d-4a7b-a935-304dcc9a1d5a', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 'Module 5: Exam Mastery & Performance Techniques', 'Objective: Develop exam confidence and optimise performance strategies', 'CEFR_B1', 4, 0, NULL, NULL, NULL, 0, '2025-06-13 22:03:14', '2025-06-13 22:03:14'),
('ef48d874-af61-4be9-b4f8-bc55a17dd809', '9c8dc68e-b7b7-4362-b4cc-c3913682b4a8', 'Module 4: Listening – Strategies for Accuracy', 'Objective: Improve listening comprehension for all four sections, focusing on accuracy and speed.', 'CEFR_A1', 3, 0, NULL, NULL, NULL, 0, '2025-06-14 13:27:41', '2025-06-14 13:27:41'),
('c850a525-c435-410f-a49d-84c1a19af95b', '9c8dc68e-b7b7-4362-b4cc-c3913682b4a8', 'Module 5: Reading – Skimming, Scanning & True/False/Not Given Mastery', 'Objective: Build speed and confidence with all IELTS reading question types, especially the most challenging ones.', 'CEFR_A1', 4, 0, NULL, NULL, NULL, 0, '2025-06-14 13:29:06', '2025-06-14 13:29:06'),
('d4784cb8-dab0-4030-9df6-f563daecc23e', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 'Module 10: Housing, Renting & Daily Life', 'Use functional English to talk about renting, chores, and home routines.', 'CEFR_B1', 3, 0, NULL, NULL, NULL, 0, '2025-06-14 13:54:55', '2025-06-14 13:54:55');

-- --------------------------------------------------------

--
-- Table structure for table `module_progress`
--

DROP TABLE IF EXISTS `module_progress`;
CREATE TABLE IF NOT EXISTS `module_progress` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `moduleId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contentCompleted` tinyint(1) NOT NULL DEFAULT '0',
  `exercisesCompleted` tinyint(1) NOT NULL DEFAULT '0',
  `quizCompleted` tinyint(1) NOT NULL DEFAULT '0',
  `startedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `completedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `difficultyRating` int DEFAULT NULL,
  `feedback` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastAccessedAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `quizScore` int DEFAULT NULL,
  `timeSpent` int NOT NULL DEFAULT '0',
  `achievementUnlocked` tinyint(1) NOT NULL DEFAULT '0',
  `averageSessionTime` int NOT NULL DEFAULT '0',
  `bestQuizScore` int DEFAULT NULL,
  `lastStudyDate` datetime(3) DEFAULT NULL,
  `learningStreak` int NOT NULL DEFAULT '0',
  `retryAttempts` int NOT NULL DEFAULT '0',
  `sessionCount` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `module_progress_moduleId_studentId_key` (`moduleId`,`studentId`),
  KEY `module_progress_module_id_idx` (`moduleId`),
  KEY `module_progress_student_id_idx` (`studentId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `module_progress`
--

INSERT INTO `module_progress` (`id`, `moduleId`, `studentId`, `contentCompleted`, `exercisesCompleted`, `quizCompleted`, `startedAt`, `completedAt`, `createdAt`, `updatedAt`, `difficultyRating`, `feedback`, `lastAccessedAt`, `notes`, `quizScore`, `timeSpent`, `achievementUnlocked`, `averageSessionTime`, `bestQuizScore`, `lastStudyDate`, `learningStreak`, `retryAttempts`, `sessionCount`) VALUES
('0307d747-edf9-4999-adc1-abc9e852ca3f', '0a299bf2-aad8-42c6-bf8b-22b27c63fd11', 'c2f1e601-cae7-4bcc-b9b0-6e10fdf869e5', 0, 0, 0, '2025-07-23 14:00:25.887', NULL, '2025-07-23 14:00:25.889', '2025-07-23 14:00:25.889', NULL, NULL, '2025-07-23 14:00:25.889', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('61139ede-f856-4a7c-90d9-841a6d5d3682', '2aff2a57-ed69-4b9c-a57c-46c3ae393cc2', 'c2f1e601-cae7-4bcc-b9b0-6e10fdf869e5', 0, 0, 0, '2025-07-23 14:00:25.884', NULL, '2025-07-23 14:00:25.885', '2025-07-23 14:00:25.885', NULL, NULL, '2025-07-23 14:00:25.885', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('eca3d11e-fb26-43f9-8d94-68f8d12bb494', 'fc1ba250-7b73-4600-be8f-fccc6653ecd3', 'c2f1e601-cae7-4bcc-b9b0-6e10fdf869e5', 0, 0, 0, '2025-07-23 14:00:25.880', NULL, '2025-07-23 14:00:25.881', '2025-07-23 14:00:25.881', NULL, NULL, '2025-07-23 14:00:25.881', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('d9c3aa16-2ed9-4756-b622-621922160fd6', 'd56d4462-2dd9-4c14-af40-56464df19192', '7fcd0b62-f5ba-4ea7-bfb4-0bab6653188f', 0, 0, 0, '2025-07-14 11:23:13.001', NULL, '2025-07-14 11:23:13.002', '2025-07-14 11:23:13.002', NULL, NULL, '2025-07-14 11:23:13.002', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('5254d815-1689-4611-930b-85238db29694', '8ef02b5d-e693-4957-821a-0f6122287278', '7fcd0b62-f5ba-4ea7-bfb4-0bab6653188f', 0, 0, 0, '2025-07-14 11:23:13.008', NULL, '2025-07-14 11:23:13.010', '2025-07-14 11:23:13.010', NULL, NULL, '2025-07-14 11:23:13.010', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('465b1350-ebd2-4912-bdf8-31ce2066474e', 'b975a94a-9272-4d8d-aa1c-a987cf5969a3', '7fcd0b62-f5ba-4ea7-bfb4-0bab6653188f', 0, 0, 0, '2025-07-14 11:23:13.017', NULL, '2025-07-14 11:23:13.018', '2025-07-14 11:23:13.018', NULL, NULL, '2025-07-14 11:23:13.018', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('bd7ac396-e940-40d9-8564-8c5570c7453f', '0a299bf2-aad8-42c6-bf8b-22b27c63fd11', 'e7b11e3e-7703-4fb5-9363-7b8cdc861a7c', 0, 0, 0, '2025-07-23 14:00:25.877', NULL, '2025-07-23 14:00:25.878', '2025-07-23 14:00:25.878', NULL, NULL, '2025-07-23 14:00:25.878', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('ad2c888c-a1a8-46e3-9967-da64e4359c59', '2aff2a57-ed69-4b9c-a57c-46c3ae393cc2', 'e7b11e3e-7703-4fb5-9363-7b8cdc861a7c', 0, 0, 0, '2025-07-23 14:00:25.873', NULL, '2025-07-23 14:00:25.874', '2025-07-23 14:00:25.874', NULL, NULL, '2025-07-23 14:00:25.874', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('26004c62-8960-44e8-ab24-4b5fc5dba653', 'fc1ba250-7b73-4600-be8f-fccc6653ecd3', 'e7b11e3e-7703-4fb5-9363-7b8cdc861a7c', 0, 0, 0, '2025-07-23 14:00:25.869', NULL, '2025-07-23 14:00:25.871', '2025-07-23 14:00:25.871', NULL, NULL, '2025-07-23 14:00:25.871', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('2d487871-e925-44db-b51b-ac404f260c2c', '18611de0-d82a-494a-bc85-8af8b921003c', '7fcd0b62-f5ba-4ea7-bfb4-0bab6653188f', 0, 0, 0, '2025-07-14 11:23:13.048', NULL, '2025-07-14 11:23:13.049', '2025-07-14 11:23:13.049', NULL, NULL, '2025-07-14 11:23:13.049', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('b1712f01-07a6-4d6c-aa3e-cbf7b86fa3b3', '08b392c9-92e2-4fe8-ac27-1be5037a7b2b', '7fcd0b62-f5ba-4ea7-bfb4-0bab6653188f', 0, 0, 0, '2025-07-14 11:23:13.054', NULL, '2025-07-14 11:23:13.055', '2025-07-14 11:23:13.055', NULL, NULL, '2025-07-14 11:23:13.055', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('53605409-7bff-4571-a181-3238718d0d4d', '09efd3bb-42b0-41e9-bf69-31edc0477c3a', '7fcd0b62-f5ba-4ea7-bfb4-0bab6653188f', 0, 0, 0, '2025-07-14 11:23:13.061', NULL, '2025-07-14 11:23:13.063', '2025-07-14 11:23:13.063', NULL, NULL, '2025-07-14 11:23:13.063', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('7d77ff2e-d68e-42bc-991f-c8dfe0d1d004', '6103afe4-c6da-4ad2-9a11-ec458a0e615a', 'c2f1e601-cae7-4bcc-b9b0-6e10fdf869e5', 0, 0, 0, '2025-07-23 14:00:25.866', NULL, '2025-07-23 14:00:25.867', '2025-07-23 14:00:25.867', NULL, NULL, '2025-07-23 14:00:25.867', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('d0d33787-78bc-47fd-bb43-281078e6f467', '38d0d39b-9d28-416b-bbfa-e4deccd076b0', 'c2f1e601-cae7-4bcc-b9b0-6e10fdf869e5', 0, 0, 0, '2025-07-23 14:00:25.861', NULL, '2025-07-23 14:00:25.863', '2025-07-23 14:00:25.863', NULL, NULL, '2025-07-23 14:00:25.863', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('f19ef400-9f60-4cf4-b2fc-55168ae97f29', 'b7130969-f79c-41e8-824a-d27f375d6639', 'c2f1e601-cae7-4bcc-b9b0-6e10fdf869e5', 0, 0, 0, '2025-07-23 14:00:25.852', NULL, '2025-07-23 14:00:25.854', '2025-07-23 14:00:25.854', NULL, NULL, '2025-07-23 14:00:25.854', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('bd42365c-66c3-4c95-970f-62a715c9a058', 'b5e01b36-4b15-42c1-b419-60ebf146e405', '7fcd0b62-f5ba-4ea7-bfb4-0bab6653188f', 0, 0, 0, '2025-07-14 11:23:13.090', NULL, '2025-07-14 11:23:13.091', '2025-07-14 11:23:13.091', NULL, NULL, '2025-07-14 11:23:13.091', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('29a24ce3-bca2-4bce-9fbc-dec3902f4383', 'aa0962eb-282f-42ba-acdf-2bcb55a23bf9', '7fcd0b62-f5ba-4ea7-bfb4-0bab6653188f', 0, 0, 0, '2025-07-14 11:23:13.098', NULL, '2025-07-14 11:23:13.099', '2025-07-14 11:23:13.099', NULL, NULL, '2025-07-14 11:23:13.099', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('94a4cc9c-746c-4489-a863-c3adbc1cfb76', 'e8b6e51a-1f91-4270-9911-262c4e9f52fb', '7fcd0b62-f5ba-4ea7-bfb4-0bab6653188f', 0, 0, 0, '2025-07-14 11:23:13.106', NULL, '2025-07-14 11:23:13.107', '2025-07-14 11:23:13.107', NULL, NULL, '2025-07-14 11:23:13.107', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('ba2018eb-f184-44a6-aeee-2c47676b4c5a', '761f72d3-aa72-4a9f-88f8-f7738d1aca16', 'e7b11e3e-7703-4fb5-9363-7b8cdc861a7c', 0, 0, 0, '2025-07-23 14:00:25.732', NULL, '2025-07-23 14:00:25.733', '2025-07-23 14:00:25.733', NULL, NULL, '2025-07-23 14:00:25.733', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('e5a5cc5f-1be1-49a4-a2cf-4bb64741678a', 'efcad497-e636-4c70-9e77-2280955dde34', 'e7b11e3e-7703-4fb5-9363-7b8cdc861a7c', 0, 0, 0, '2025-07-23 14:00:25.729', NULL, '2025-07-23 14:00:25.730', '2025-07-23 14:00:25.730', NULL, NULL, '2025-07-23 14:00:25.730', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('421f12d1-3bce-498d-93f2-a7629102fb05', '9d3a213c-6041-4648-ab45-54906181c8a7', 'e7b11e3e-7703-4fb5-9363-7b8cdc861a7c', 0, 0, 0, '2025-07-23 14:00:25.725', NULL, '2025-07-23 14:00:25.726', '2025-07-23 14:00:25.726', NULL, NULL, '2025-07-23 14:00:25.726', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('3a3e5233-5880-49a8-843f-75a0c57bf60f', '0fb88d7e-06ad-4b01-ac49-a1831112c180', '7fcd0b62-f5ba-4ea7-bfb4-0bab6653188f', 0, 0, 0, '2025-07-14 11:23:13.165', NULL, '2025-07-14 11:23:13.166', '2025-07-14 11:23:13.166', NULL, NULL, '2025-07-14 11:23:13.166', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('bf16de8c-72dc-4e1b-8c91-391cc7a50b09', '8f21ecbd-46d8-458d-8804-975e54b57729', '7fcd0b62-f5ba-4ea7-bfb4-0bab6653188f', 0, 0, 0, '2025-07-14 11:23:13.177', NULL, '2025-07-14 11:23:13.178', '2025-07-14 11:23:13.178', NULL, NULL, '2025-07-14 11:23:13.178', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('7a8bcbf2-6027-4959-9da4-48c5442cd997', '3fa1f676-1af4-4a57-abe7-78f910c4897b', '7fcd0b62-f5ba-4ea7-bfb4-0bab6653188f', 0, 0, 0, '2025-07-14 11:23:13.184', NULL, '2025-07-14 11:23:13.188', '2025-07-14 11:23:13.188', NULL, NULL, '2025-07-14 11:23:13.188', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('44d6a7d1-2e3f-41ce-b8f6-8368d4c0a7f1', '761f72d3-aa72-4a9f-88f8-f7738d1aca16', 'c2f1e601-cae7-4bcc-b9b0-6e10fdf869e5', 0, 0, 0, '2025-07-23 14:00:25.716', NULL, '2025-07-23 14:00:25.717', '2025-07-23 14:00:25.717', NULL, NULL, '2025-07-23 14:00:25.717', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('69021517-7de0-4527-9497-87220ae8fa41', 'efcad497-e636-4c70-9e77-2280955dde34', 'c2f1e601-cae7-4bcc-b9b0-6e10fdf869e5', 0, 0, 0, '2025-07-23 14:00:25.713', NULL, '2025-07-23 14:00:25.714', '2025-07-23 14:00:25.714', NULL, NULL, '2025-07-23 14:00:25.714', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('0c12d624-482b-40db-b707-1a4fce08aa94', '9d3a213c-6041-4648-ab45-54906181c8a7', 'c2f1e601-cae7-4bcc-b9b0-6e10fdf869e5', 0, 0, 0, '2025-07-23 14:00:25.709', NULL, '2025-07-23 14:00:25.710', '2025-07-23 14:00:25.710', NULL, NULL, '2025-07-23 14:00:25.710', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('a557c41b-e9b1-4c99-9497-87f1b4e8fcc4', '63f9479c-8e5a-4cfe-ac47-f588f686a9b3', '7fcd0b62-f5ba-4ea7-bfb4-0bab6653188f', 0, 0, 0, '2025-07-14 11:23:13.219', NULL, '2025-07-14 11:23:13.220', '2025-07-14 11:23:13.220', NULL, NULL, '2025-07-14 11:23:13.220', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('1a8641f1-108a-4574-9b55-aaace4e3bee1', 'e587d030-2656-419a-8f8a-60be5bf09757', '7fcd0b62-f5ba-4ea7-bfb4-0bab6653188f', 0, 0, 0, '2025-07-14 11:23:13.228', NULL, '2025-07-14 11:23:13.229', '2025-07-14 11:23:13.229', NULL, NULL, '2025-07-14 11:23:13.229', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('b05be85d-312d-48a5-a05f-cddd73c40e1a', '82af9f93-fd99-4db5-800e-97b669989c43', '7fcd0b62-f5ba-4ea7-bfb4-0bab6653188f', 0, 0, 0, '2025-07-14 11:23:13.236', NULL, '2025-07-14 11:23:13.237', '2025-07-14 11:23:13.237', NULL, NULL, '2025-07-14 11:23:13.237', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('39121965-f740-4256-878d-f3b3d9e58e15', '6103afe4-c6da-4ad2-9a11-ec458a0e615a', 'e7b11e3e-7703-4fb5-9363-7b8cdc861a7c', 0, 0, 0, '2025-07-23 14:00:25.692', NULL, '2025-07-23 14:00:25.693', '2025-07-23 14:00:25.693', NULL, NULL, '2025-07-23 14:00:25.693', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('3f30d560-b1fb-462b-9207-47e523aec63c', '38d0d39b-9d28-416b-bbfa-e4deccd076b0', 'e7b11e3e-7703-4fb5-9363-7b8cdc861a7c', 0, 0, 0, '2025-07-23 14:00:25.685', NULL, '2025-07-23 14:00:25.687', '2025-07-23 14:00:25.687', NULL, NULL, '2025-07-23 14:00:25.687', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('32b398e3-d0ba-490e-be68-1175932f4f3b', 'b7130969-f79c-41e8-824a-d27f375d6639', 'e7b11e3e-7703-4fb5-9363-7b8cdc861a7c', 0, 0, 0, '2025-07-23 14:00:25.676', NULL, '2025-07-23 14:00:25.677', '2025-07-23 14:00:25.677', NULL, NULL, '2025-07-23 14:00:25.677', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('bd6e2351-8a4f-4eb4-a652-29bc55d34206', '806ecccf-4455-46dc-97a9-67219cb5637c', '7fcd0b62-f5ba-4ea7-bfb4-0bab6653188f', 0, 0, 0, '2025-07-14 11:23:13.262', NULL, '2025-07-14 11:23:13.263', '2025-07-14 11:23:13.263', NULL, NULL, '2025-07-14 11:23:13.263', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('8f0daad1-3c81-4f92-964a-c76ea200b7ad', '522d5359-0b0a-47f4-9d6d-843cfa0de5d7', '7fcd0b62-f5ba-4ea7-bfb4-0bab6653188f', 0, 0, 0, '2025-07-14 11:23:13.271', NULL, '2025-07-14 11:23:13.272', '2025-07-14 11:23:13.272', NULL, NULL, '2025-07-14 11:23:13.272', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('2273df94-ebf7-4a5b-b768-410661d9af49', 'eb07f2d7-04b3-4152-b475-fb5e7efb73f4', '7fcd0b62-f5ba-4ea7-bfb4-0bab6653188f', 0, 0, 0, '2025-07-14 11:23:13.275', NULL, '2025-07-14 11:23:13.276', '2025-07-14 11:23:13.276', NULL, NULL, '2025-07-14 11:23:13.276', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('a4d28997-383e-4032-bbba-b54464975a41', '37b61f0b-680b-41ce-80df-191622566f83', '34a7acdd-4760-4dfe-9c2b-4ed6be2c1e4a', 0, 0, 0, '2025-07-14 11:23:13.286', NULL, '2025-07-14 11:23:13.287', '2025-07-14 11:23:13.287', NULL, NULL, '2025-07-14 11:23:13.287', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('aa95dcd8-0931-423c-9f03-b5034aa7564a', '47652aa9-9065-486f-b90f-c8e03a974bea', '34a7acdd-4760-4dfe-9c2b-4ed6be2c1e4a', 0, 0, 0, '2025-07-14 11:23:13.292', NULL, '2025-07-14 11:23:13.294', '2025-07-14 11:23:13.294', NULL, NULL, '2025-07-14 11:23:13.294', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('458ad03e-9f33-4cb0-a618-f27700139447', '98e26eb3-e382-4308-ab03-5c4e204b2bc3', '34a7acdd-4760-4dfe-9c2b-4ed6be2c1e4a', 0, 0, 0, '2025-07-14 11:23:13.298', NULL, '2025-07-14 11:23:13.299', '2025-07-14 11:23:13.299', NULL, NULL, '2025-07-14 11:23:13.299', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('23d1fe02-49f2-4200-a85d-42a4a00a50da', '37b61f0b-680b-41ce-80df-191622566f83', 'df6e1734-896a-4290-abb3-a3a8fd9cc0a5', 0, 0, 0, '2025-07-14 11:23:13.308', NULL, '2025-07-14 11:23:13.310', '2025-07-14 11:23:13.310', NULL, NULL, '2025-07-14 11:23:13.310', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('cce156b0-9ad5-4812-885e-2d3faa796195', '47652aa9-9065-486f-b90f-c8e03a974bea', 'df6e1734-896a-4290-abb3-a3a8fd9cc0a5', 0, 0, 0, '2025-07-14 11:23:13.316', NULL, '2025-07-14 11:23:13.319', '2025-07-14 11:23:13.319', NULL, NULL, '2025-07-14 11:23:13.319', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('28aed54d-a778-4d25-96db-971ef5c3ee1d', '98e26eb3-e382-4308-ab03-5c4e204b2bc3', 'df6e1734-896a-4290-abb3-a3a8fd9cc0a5', 0, 0, 0, '2025-07-14 11:23:13.324', NULL, '2025-07-14 11:23:13.325', '2025-07-14 11:23:13.325', NULL, NULL, '2025-07-14 11:23:13.325', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('56b04996-abd2-4a31-bdce-8b88b661e4f9', 'd3c19b76-534b-4a25-9ef6-75ef62657cd9', '34a7acdd-4760-4dfe-9c2b-4ed6be2c1e4a', 0, 0, 0, '2025-07-14 11:23:13.328', NULL, '2025-07-14 11:23:13.330', '2025-07-14 11:23:13.330', NULL, NULL, '2025-07-14 11:23:13.330', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('21a14370-d843-4ee4-b288-dc8a51ff45ad', '1086d1f5-4453-41f7-90e7-afa6a00d4188', '34a7acdd-4760-4dfe-9c2b-4ed6be2c1e4a', 0, 0, 0, '2025-07-14 11:23:13.338', NULL, '2025-07-14 11:23:13.339', '2025-07-14 11:23:13.339', NULL, NULL, '2025-07-14 11:23:13.339', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('610aef9c-0ea3-48c7-9eb6-1ec0fa495b52', '9ebeb56f-292b-4331-8bc5-07669a5e182e', '34a7acdd-4760-4dfe-9c2b-4ed6be2c1e4a', 0, 0, 0, '2025-07-14 11:23:13.345', NULL, '2025-07-14 11:23:13.347', '2025-07-14 11:23:13.347', NULL, NULL, '2025-07-14 11:23:13.347', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('ceba5b50-07cc-4686-bed4-bf643e5e9bf6', 'd3c19b76-534b-4a25-9ef6-75ef62657cd9', 'df6e1734-896a-4290-abb3-a3a8fd9cc0a5', 0, 0, 0, '2025-07-14 11:23:13.354', NULL, '2025-07-14 11:23:13.355', '2025-07-14 11:23:13.355', NULL, NULL, '2025-07-14 11:23:13.355', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('d005797f-6201-4000-bb0c-64a3ec3e0202', '1086d1f5-4453-41f7-90e7-afa6a00d4188', 'df6e1734-896a-4290-abb3-a3a8fd9cc0a5', 0, 0, 0, '2025-07-14 11:23:13.359', NULL, '2025-07-14 11:23:13.361', '2025-07-14 11:23:13.361', NULL, NULL, '2025-07-14 11:23:13.361', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('266282be-86c1-4c2c-9a25-8d3ced01786d', '9ebeb56f-292b-4331-8bc5-07669a5e182e', 'df6e1734-896a-4290-abb3-a3a8fd9cc0a5', 0, 0, 0, '2025-07-14 11:23:13.370', NULL, '2025-07-14 11:23:13.372', '2025-07-14 11:23:13.372', NULL, NULL, '2025-07-14 11:23:13.372', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('b6ce0328-fc5e-4493-b437-33a20f686bf5', 'a9b31a9c-1135-497b-ad0f-6a155c783e87', '34a7acdd-4760-4dfe-9c2b-4ed6be2c1e4a', 0, 0, 0, '2025-07-14 11:23:13.377', NULL, '2025-07-14 11:23:13.379', '2025-07-14 11:23:13.379', NULL, NULL, '2025-07-14 11:23:13.379', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('086fbf9e-3606-4c8f-aeab-9ad5ea478a73', '26c37ae8-dcf4-48ba-8d46-1ba43665c372', '34a7acdd-4760-4dfe-9c2b-4ed6be2c1e4a', 0, 0, 0, '2025-07-14 11:23:13.383', NULL, '2025-07-14 11:23:13.384', '2025-07-14 11:23:13.384', NULL, NULL, '2025-07-14 11:23:13.384', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('cba1195e-ed70-4e09-959a-238c811163c0', 'ff4f885d-5e57-4a09-80db-aa4f75bce26f', '34a7acdd-4760-4dfe-9c2b-4ed6be2c1e4a', 0, 0, 0, '2025-07-14 11:23:13.388', NULL, '2025-07-14 11:23:13.392', '2025-07-14 11:23:13.392', NULL, NULL, '2025-07-14 11:23:13.392', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('1ee276fd-c079-4295-9b4a-3db11e55efdc', 'a9b31a9c-1135-497b-ad0f-6a155c783e87', 'df6e1734-896a-4290-abb3-a3a8fd9cc0a5', 0, 0, 0, '2025-07-14 11:23:13.400', NULL, '2025-07-14 11:23:13.401', '2025-07-14 11:23:13.401', NULL, NULL, '2025-07-14 11:23:13.401', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('5d460c05-c2a1-4cc7-8dbb-ac7cfa9b5f41', '26c37ae8-dcf4-48ba-8d46-1ba43665c372', 'df6e1734-896a-4290-abb3-a3a8fd9cc0a5', 0, 0, 0, '2025-07-14 11:23:13.408', NULL, '2025-07-14 11:23:13.409', '2025-07-14 11:23:13.409', NULL, NULL, '2025-07-14 11:23:13.409', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('6a01d7b9-ead3-437e-b958-c55ccf9c7de3', 'ff4f885d-5e57-4a09-80db-aa4f75bce26f', 'df6e1734-896a-4290-abb3-a3a8fd9cc0a5', 0, 0, 0, '2025-07-14 11:23:13.413', NULL, '2025-07-14 11:23:13.414', '2025-07-14 11:23:13.414', NULL, NULL, '2025-07-14 11:23:13.414', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('8b8187fb-ed4f-4de3-aaac-c1c10b813cfd', 'dfc3041b-d4e8-458e-89bc-17fc54423d8e', '34a7acdd-4760-4dfe-9c2b-4ed6be2c1e4a', 0, 0, 0, '2025-07-14 11:23:13.425', NULL, '2025-07-14 11:23:13.427', '2025-07-14 11:23:13.427', NULL, NULL, '2025-07-14 11:23:13.427', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('8ca45dd2-2924-4ecd-96ed-3e5140c5c462', '39d89345-4b8a-436c-922c-b5cb8d119b7c', '34a7acdd-4760-4dfe-9c2b-4ed6be2c1e4a', 0, 0, 0, '2025-07-14 11:23:13.437', NULL, '2025-07-14 11:23:13.438', '2025-07-14 11:23:13.438', NULL, NULL, '2025-07-14 11:23:13.438', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('2b70de86-3502-4c16-a549-bd6ce3ecf033', '472ee19c-c097-4b87-9d0e-33e85e3c8d76', '34a7acdd-4760-4dfe-9c2b-4ed6be2c1e4a', 0, 0, 0, '2025-07-14 11:23:13.442', NULL, '2025-07-14 11:23:13.443', '2025-07-14 11:23:13.443', NULL, NULL, '2025-07-14 11:23:13.443', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('a956c61f-e707-49b4-a70d-5e2b3b2994d2', 'dfc3041b-d4e8-458e-89bc-17fc54423d8e', 'df6e1734-896a-4290-abb3-a3a8fd9cc0a5', 0, 0, 0, '2025-07-14 11:23:13.454', NULL, '2025-07-14 11:23:13.456', '2025-07-14 11:23:13.456', NULL, NULL, '2025-07-14 11:23:13.456', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('0321bc70-ee87-4931-ab9d-50b0c9bebb29', '39d89345-4b8a-436c-922c-b5cb8d119b7c', 'df6e1734-896a-4290-abb3-a3a8fd9cc0a5', 0, 0, 0, '2025-07-14 11:23:13.462', NULL, '2025-07-14 11:23:13.463', '2025-07-14 11:23:13.463', NULL, NULL, '2025-07-14 11:23:13.463', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('ff778363-c886-4a77-8862-046cb74aeb54', '472ee19c-c097-4b87-9d0e-33e85e3c8d76', 'df6e1734-896a-4290-abb3-a3a8fd9cc0a5', 0, 0, 0, '2025-07-14 11:23:13.469', NULL, '2025-07-14 11:23:13.470', '2025-07-14 11:23:13.470', NULL, NULL, '2025-07-14 11:23:13.470', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('e4e9bea0-c6c3-4d26-992d-4e5d53497526', '645eedbf-ebbf-4b09-9bef-dae6e41c230e', '34a7acdd-4760-4dfe-9c2b-4ed6be2c1e4a', 0, 0, 0, '2025-07-14 11:23:13.486', NULL, '2025-07-14 11:23:13.487', '2025-07-14 11:23:13.487', NULL, NULL, '2025-07-14 11:23:13.487', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('dfee4336-631b-4954-908d-a60d3abe33d8', 'a61aa291-7a8b-4e21-a48e-e7e52ec530ba', '34a7acdd-4760-4dfe-9c2b-4ed6be2c1e4a', 0, 0, 0, '2025-07-14 11:23:13.493', NULL, '2025-07-14 11:23:13.495', '2025-07-14 11:23:13.495', NULL, NULL, '2025-07-14 11:23:13.495', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('1b072fff-8119-4515-9db5-da838b306153', '55df426c-b48d-4783-ab0b-efb140738630', '34a7acdd-4760-4dfe-9c2b-4ed6be2c1e4a', 0, 0, 0, '2025-07-14 11:23:13.498', NULL, '2025-07-14 11:23:13.500', '2025-07-14 11:23:13.500', NULL, NULL, '2025-07-14 11:23:13.500', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('1de97301-f431-4e08-8dcd-673af2c9a99d', '645eedbf-ebbf-4b09-9bef-dae6e41c230e', 'df6e1734-896a-4290-abb3-a3a8fd9cc0a5', 0, 0, 0, '2025-07-14 11:23:13.509', NULL, '2025-07-14 11:23:13.511', '2025-07-14 11:23:13.511', NULL, NULL, '2025-07-14 11:23:13.511', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('e0aaab07-e356-4a06-b5b5-32d20097f243', 'a61aa291-7a8b-4e21-a48e-e7e52ec530ba', 'df6e1734-896a-4290-abb3-a3a8fd9cc0a5', 0, 0, 0, '2025-07-14 11:23:13.518', NULL, '2025-07-14 11:23:13.520', '2025-07-14 11:23:13.520', NULL, NULL, '2025-07-14 11:23:13.520', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('cb9e5371-db0e-46c5-ac3a-9fc37058ab70', '55df426c-b48d-4783-ab0b-efb140738630', 'df6e1734-896a-4290-abb3-a3a8fd9cc0a5', 0, 0, 0, '2025-07-14 11:23:13.524', NULL, '2025-07-14 11:23:13.525', '2025-07-14 11:23:13.525', NULL, NULL, '2025-07-14 11:23:13.525', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('013e4367-c4b2-4fd8-9e7f-5326493b2452', 'f21aae0b-fb19-452f-85fe-3d27dc853247', '34a7acdd-4760-4dfe-9c2b-4ed6be2c1e4a', 0, 0, 0, '2025-07-14 11:23:13.533', NULL, '2025-07-14 11:23:13.535', '2025-07-14 11:23:13.535', NULL, NULL, '2025-07-14 11:23:13.535', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('e5ac756c-c7b9-4b48-a6fd-5f81ceb054ea', '603c6a51-6446-4627-8cf0-40663446d2d5', '34a7acdd-4760-4dfe-9c2b-4ed6be2c1e4a', 0, 0, 0, '2025-07-14 11:23:13.540', NULL, '2025-07-14 11:23:13.541', '2025-07-14 11:23:13.541', NULL, NULL, '2025-07-14 11:23:13.541', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('125d410a-7dbc-4a3f-8894-15baba51e23a', '021b4fb5-c333-48b8-ade7-1ef610eb2c56', '34a7acdd-4760-4dfe-9c2b-4ed6be2c1e4a', 0, 0, 0, '2025-07-14 11:23:13.548', NULL, '2025-07-14 11:23:13.549', '2025-07-14 11:23:13.549', NULL, NULL, '2025-07-14 11:23:13.549', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('c388a7d8-ddde-4bb7-b299-6ee363727d70', 'f21aae0b-fb19-452f-85fe-3d27dc853247', 'df6e1734-896a-4290-abb3-a3a8fd9cc0a5', 0, 0, 0, '2025-07-14 11:23:13.554', NULL, '2025-07-14 11:23:13.555', '2025-07-14 11:23:13.555', NULL, NULL, '2025-07-14 11:23:13.555', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('7a3f3bcd-b4ca-4d12-994f-dd46f2e05c82', '603c6a51-6446-4627-8cf0-40663446d2d5', 'df6e1734-896a-4290-abb3-a3a8fd9cc0a5', 0, 0, 0, '2025-07-14 11:23:13.564', NULL, '2025-07-14 11:23:13.565', '2025-07-14 11:23:13.565', NULL, NULL, '2025-07-14 11:23:13.565', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('19bfa40d-550b-4683-8f0c-6b897be5b714', '021b4fb5-c333-48b8-ade7-1ef610eb2c56', 'df6e1734-896a-4290-abb3-a3a8fd9cc0a5', 0, 0, 0, '2025-07-14 11:23:13.571', NULL, '2025-07-14 11:23:13.572', '2025-07-14 11:23:13.572', NULL, NULL, '2025-07-14 11:23:13.572', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('c69265b1-be68-4e3a-9a27-9e58f6baef23', '4acb389f-28f3-4b3d-a718-e8320386d99e', '76bb3338-2c72-49c3-b7f0-0c4fc1b879e1', 0, 0, 0, '2025-07-14 13:40:32.392', NULL, '2025-07-14 13:40:32.394', '2025-07-14 13:40:32.394', NULL, NULL, '2025-07-14 13:40:32.394', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('c2839da2-7417-4bae-b349-b3f5503e68e7', '04027961-5060-4c53-90e9-39598263b436', '76bb3338-2c72-49c3-b7f0-0c4fc1b879e1', 0, 0, 0, '2025-07-14 13:40:32.400', NULL, '2025-07-14 13:40:32.403', '2025-07-14 13:40:32.403', NULL, NULL, '2025-07-14 13:40:32.403', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('1626c53c-c238-489f-9daa-9582f07f9460', '642fc769-7f87-402b-ba07-c51897a98fa7', '76bb3338-2c72-49c3-b7f0-0c4fc1b879e1', 0, 0, 0, '2025-07-14 13:40:32.409', NULL, '2025-07-14 13:40:32.410', '2025-07-14 13:40:32.410', NULL, NULL, '2025-07-14 13:40:32.410', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('6e48e110-6007-453c-966a-d828db20fbca', '4acb389f-28f3-4b3d-a718-e8320386d99e', '5d98866e-14dc-4937-955d-22a7c10494b5', 0, 0, 0, '2025-07-14 13:40:32.510', NULL, '2025-07-14 13:40:32.512', '2025-07-14 13:40:32.512', NULL, NULL, '2025-07-14 13:40:32.512', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('ce14172c-a48a-47b3-b159-0848826342eb', '04027961-5060-4c53-90e9-39598263b436', '5d98866e-14dc-4937-955d-22a7c10494b5', 0, 0, 0, '2025-07-14 13:40:32.518', NULL, '2025-07-14 13:40:32.521', '2025-07-14 13:40:32.521', NULL, NULL, '2025-07-14 13:40:32.521', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('0d386304-73bb-41d9-bf9e-fbd168702860', '642fc769-7f87-402b-ba07-c51897a98fa7', '5d98866e-14dc-4937-955d-22a7c10494b5', 0, 0, 0, '2025-07-14 13:40:32.528', NULL, '2025-07-14 13:40:32.530', '2025-07-14 13:40:32.530', NULL, NULL, '2025-07-14 13:40:32.530', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('78344690-1053-463b-9b40-85093c89dd8f', '84d1d0b1-b37d-444d-b05a-179a6863368e', '76bb3338-2c72-49c3-b7f0-0c4fc1b879e1', 0, 0, 0, '2025-07-14 13:40:32.535', NULL, '2025-07-14 13:40:32.537', '2025-07-14 13:40:32.537', NULL, NULL, '2025-07-14 13:40:32.537', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('b232b1d4-e9bc-4ce8-b00e-b18968ed7c50', 'bc4bc807-a126-455a-84f9-64bfb2b4ff3f', '76bb3338-2c72-49c3-b7f0-0c4fc1b879e1', 0, 0, 0, '2025-07-14 13:40:32.540', NULL, '2025-07-14 13:40:32.541', '2025-07-14 13:40:32.541', NULL, NULL, '2025-07-14 13:40:32.541', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('e5c98890-f65d-4d99-8f9c-faf124ca6efa', '2d24ac7e-c86a-4695-802e-df1c829c879a', '76bb3338-2c72-49c3-b7f0-0c4fc1b879e1', 0, 0, 0, '2025-07-14 13:40:32.547', NULL, '2025-07-14 13:40:32.549', '2025-07-14 13:40:32.549', NULL, NULL, '2025-07-14 13:40:32.549', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('eb1116b1-5b17-496f-80a0-645492b47482', '84d1d0b1-b37d-444d-b05a-179a6863368e', '5d98866e-14dc-4937-955d-22a7c10494b5', 0, 0, 0, '2025-07-14 13:40:32.555', NULL, '2025-07-14 13:40:32.557', '2025-07-14 13:40:32.557', NULL, NULL, '2025-07-14 13:40:32.557', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('3e8bf2c7-564d-487e-8bfd-10734cabadd4', 'bc4bc807-a126-455a-84f9-64bfb2b4ff3f', '5d98866e-14dc-4937-955d-22a7c10494b5', 0, 0, 0, '2025-07-14 13:40:32.562', NULL, '2025-07-14 13:40:32.564', '2025-07-14 13:40:32.564', NULL, NULL, '2025-07-14 13:40:32.564', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('07f6d73e-d46a-4687-b5b5-ac3aa39a8b84', '2d24ac7e-c86a-4695-802e-df1c829c879a', '5d98866e-14dc-4937-955d-22a7c10494b5', 0, 0, 0, '2025-07-14 13:40:32.568', NULL, '2025-07-14 13:40:32.569', '2025-07-14 13:40:32.569', NULL, NULL, '2025-07-14 13:40:32.569', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('b5e3dffe-a24a-4b4e-a390-e213fddca543', '952ab8e9-a89b-43ff-a3b1-70233bf417a2', '76bb3338-2c72-49c3-b7f0-0c4fc1b879e1', 0, 0, 0, '2025-07-14 13:40:32.577', NULL, '2025-07-14 13:40:32.579', '2025-07-14 13:40:32.579', NULL, NULL, '2025-07-14 13:40:32.579', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('a9d1ee4b-b240-49ab-a3fd-a90302098be5', 'bd5dc629-64f8-408f-a0bc-5dc6f7bedaa1', '76bb3338-2c72-49c3-b7f0-0c4fc1b879e1', 0, 0, 0, '2025-07-14 13:40:32.583', NULL, '2025-07-14 13:40:32.585', '2025-07-14 13:40:32.585', NULL, NULL, '2025-07-14 13:40:32.585', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('048eed2c-5970-4bfb-8232-f42bed04937b', '95f2c6d8-9b8d-47bf-9063-e66252f5eecb', '76bb3338-2c72-49c3-b7f0-0c4fc1b879e1', 0, 0, 0, '2025-07-14 13:40:32.588', NULL, '2025-07-14 13:40:32.590', '2025-07-14 13:40:32.590', NULL, NULL, '2025-07-14 13:40:32.590', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('1546f527-c5ea-4aef-b3e5-e5637db620d7', '952ab8e9-a89b-43ff-a3b1-70233bf417a2', '5d98866e-14dc-4937-955d-22a7c10494b5', 0, 0, 0, '2025-07-14 13:40:32.596', NULL, '2025-07-14 13:40:32.597', '2025-07-14 13:40:32.597', NULL, NULL, '2025-07-14 13:40:32.597', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('2e2d1bba-6740-4488-b600-e109f440235f', 'bd5dc629-64f8-408f-a0bc-5dc6f7bedaa1', '5d98866e-14dc-4937-955d-22a7c10494b5', 0, 0, 0, '2025-07-14 13:40:32.603', NULL, '2025-07-14 13:40:32.605', '2025-07-14 13:40:32.605', NULL, NULL, '2025-07-14 13:40:32.605', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('863d3b44-6e94-4c6b-93d2-0229bfbff507', '95f2c6d8-9b8d-47bf-9063-e66252f5eecb', '5d98866e-14dc-4937-955d-22a7c10494b5', 0, 0, 0, '2025-07-14 13:40:32.610', NULL, '2025-07-14 13:40:32.612', '2025-07-14 13:40:32.612', NULL, NULL, '2025-07-14 13:40:32.612', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('174ec62c-c428-46c1-8d3d-e5872675d3d5', '91b80f8a-ba80-436a-847f-4b79003083c1', '76bb3338-2c72-49c3-b7f0-0c4fc1b879e1', 0, 0, 0, '2025-07-14 13:40:32.617', NULL, '2025-07-14 13:40:32.619', '2025-07-14 13:40:32.619', NULL, NULL, '2025-07-14 13:40:32.619', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('6d883329-af83-45d9-80d8-37f8f817d4d9', '56c74ea0-5b4f-4df9-a2e5-74a7292d6bd8', '76bb3338-2c72-49c3-b7f0-0c4fc1b879e1', 0, 0, 0, '2025-07-14 13:40:32.626', NULL, '2025-07-14 13:40:32.628', '2025-07-14 13:40:32.628', NULL, NULL, '2025-07-14 13:40:32.628', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('5657cf2d-9420-4f46-a765-e43412b264ba', '91256414-dc0a-4f5a-903f-cc429eec2b10', '76bb3338-2c72-49c3-b7f0-0c4fc1b879e1', 0, 0, 0, '2025-07-14 13:40:32.633', NULL, '2025-07-14 13:40:32.635', '2025-07-14 13:40:32.635', NULL, NULL, '2025-07-14 13:40:32.635', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('32952b38-eabd-4799-9b69-ea4c70f5e3dc', '91b80f8a-ba80-436a-847f-4b79003083c1', '5d98866e-14dc-4937-955d-22a7c10494b5', 0, 0, 0, '2025-07-14 13:40:32.639', NULL, '2025-07-14 13:40:32.641', '2025-07-14 13:40:32.641', NULL, NULL, '2025-07-14 13:40:32.641', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('8c81bc97-2040-478a-80b2-8a7ed6a61607', '56c74ea0-5b4f-4df9-a2e5-74a7292d6bd8', '5d98866e-14dc-4937-955d-22a7c10494b5', 0, 0, 0, '2025-07-14 13:40:32.646', NULL, '2025-07-14 13:40:32.647', '2025-07-14 13:40:32.647', NULL, NULL, '2025-07-14 13:40:32.647', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('e6c4b8b8-1d02-41d1-a1ba-91361f723941', '91256414-dc0a-4f5a-903f-cc429eec2b10', '5d98866e-14dc-4937-955d-22a7c10494b5', 0, 0, 0, '2025-07-14 13:40:32.654', NULL, '2025-07-14 13:40:32.656', '2025-07-14 13:40:32.656', NULL, NULL, '2025-07-14 13:40:32.656', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('455511ca-1015-44eb-9686-3345371946cf', '0593748f-9687-4e74-a1ef-76107c3f7c56', '76bb3338-2c72-49c3-b7f0-0c4fc1b879e1', 0, 0, 0, '2025-07-14 13:40:32.664', NULL, '2025-07-14 13:40:32.666', '2025-07-14 13:40:32.666', NULL, NULL, '2025-07-14 13:40:32.666', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('0b5b5c7f-e10f-406a-999c-00b3e663f763', 'dbc36add-5019-4bc7-95c9-fa021721e373', '76bb3338-2c72-49c3-b7f0-0c4fc1b879e1', 0, 0, 0, '2025-07-14 13:40:32.671', NULL, '2025-07-14 13:40:32.673', '2025-07-14 13:40:32.673', NULL, NULL, '2025-07-14 13:40:32.673', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('6bad2f4b-39d9-4da9-9232-d74832967666', 'dc00c537-3e30-4012-bd95-7412a072a36a', '76bb3338-2c72-49c3-b7f0-0c4fc1b879e1', 0, 0, 0, '2025-07-14 13:40:32.681', NULL, '2025-07-14 13:40:32.683', '2025-07-14 13:40:32.683', NULL, NULL, '2025-07-14 13:40:32.683', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('0b29de35-dbcc-4a2a-b455-e6b22e077583', '0593748f-9687-4e74-a1ef-76107c3f7c56', '5d98866e-14dc-4937-955d-22a7c10494b5', 0, 0, 0, '2025-07-14 13:40:32.688', NULL, '2025-07-14 13:40:32.690', '2025-07-14 13:40:32.690', NULL, NULL, '2025-07-14 13:40:32.690', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('e62e747b-1f8d-4857-a672-44af0338fddb', 'dbc36add-5019-4bc7-95c9-fa021721e373', '5d98866e-14dc-4937-955d-22a7c10494b5', 0, 0, 0, '2025-07-14 13:40:32.706', NULL, '2025-07-14 13:40:32.708', '2025-07-14 13:40:32.708', NULL, NULL, '2025-07-14 13:40:32.708', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('d59b838b-8407-409f-921f-f22962495061', 'dc00c537-3e30-4012-bd95-7412a072a36a', '5d98866e-14dc-4937-955d-22a7c10494b5', 0, 0, 0, '2025-07-14 13:40:32.713', NULL, '2025-07-14 13:40:32.715', '2025-07-14 13:40:32.715', NULL, NULL, '2025-07-14 13:40:32.715', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('3d66ff31-d32f-4442-8315-7b158221bd24', '1c2f230b-526a-4d94-9e66-3a4824a91e07', '76bb3338-2c72-49c3-b7f0-0c4fc1b879e1', 0, 0, 0, '2025-07-14 13:40:32.719', NULL, '2025-07-14 13:40:32.721', '2025-07-14 13:40:32.721', NULL, NULL, '2025-07-14 13:40:32.721', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('9bb51f09-3fc4-46eb-ad22-aceef7855d2f', 'd61a23b3-3e21-44ab-9073-042c33b96dac', '76bb3338-2c72-49c3-b7f0-0c4fc1b879e1', 0, 0, 0, '2025-07-14 13:40:32.778', NULL, '2025-07-14 13:40:32.780', '2025-07-14 13:40:32.780', NULL, NULL, '2025-07-14 13:40:32.780', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('12448389-dc02-4edc-8271-0f706cebe44a', 'd0f8a120-c63f-4a10-9647-b437e08bd4cf', '76bb3338-2c72-49c3-b7f0-0c4fc1b879e1', 0, 0, 0, '2025-07-14 13:40:32.825', NULL, '2025-07-14 13:40:32.827', '2025-07-14 13:40:32.827', NULL, NULL, '2025-07-14 13:40:32.827', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('f9c0ae33-f7ea-4596-a8aa-dd17a90da1dd', '1c2f230b-526a-4d94-9e66-3a4824a91e07', '5d98866e-14dc-4937-955d-22a7c10494b5', 0, 0, 0, '2025-07-14 13:40:32.847', NULL, '2025-07-14 13:40:32.849', '2025-07-14 13:40:32.849', NULL, NULL, '2025-07-14 13:40:32.849', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('2aa58967-064f-4b56-bf08-5d106ecc6341', 'd61a23b3-3e21-44ab-9073-042c33b96dac', '5d98866e-14dc-4937-955d-22a7c10494b5', 0, 0, 0, '2025-07-14 13:40:32.854', NULL, '2025-07-14 13:40:32.856', '2025-07-14 13:40:32.856', NULL, NULL, '2025-07-14 13:40:32.856', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('b68f9653-48f7-4de4-8921-0755008a5cc9', 'd0f8a120-c63f-4a10-9647-b437e08bd4cf', '5d98866e-14dc-4937-955d-22a7c10494b5', 0, 0, 0, '2025-07-14 13:40:32.864', NULL, '2025-07-14 13:40:32.865', '2025-07-14 13:40:32.865', NULL, NULL, '2025-07-14 13:40:32.865', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('191174d8-0ba6-4037-ae2e-7fc8ef39aa2d', '7d94af2c-9791-4043-9e66-6c2672153034', 'e7b11e3e-7703-4fb5-9363-7b8cdc861a7c', 0, 0, 0, '2025-07-23 14:00:25.891', NULL, '2025-07-23 14:00:25.893', '2025-07-23 14:00:25.893', NULL, NULL, '2025-07-23 14:00:25.893', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('19dc3a10-5089-4e26-afc6-b6a8a0cfbaff', '1daa5bfe-1ae7-49b6-a9b9-4451174ef741', 'e7b11e3e-7703-4fb5-9363-7b8cdc861a7c', 0, 0, 0, '2025-07-23 14:00:25.895', NULL, '2025-07-23 14:00:25.898', '2025-07-23 14:00:25.898', NULL, NULL, '2025-07-23 14:00:25.898', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('3a5af586-31cb-4abe-81f8-e14332891127', '646c918b-229b-4a90-8d17-d5241a8e4b56', 'e7b11e3e-7703-4fb5-9363-7b8cdc861a7c', 0, 0, 0, '2025-07-23 14:00:25.903', NULL, '2025-07-23 14:00:25.904', '2025-07-23 14:00:25.904', NULL, NULL, '2025-07-23 14:00:25.904', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('5075f091-54ff-4f55-b9c3-4ea4c33139ea', '7d94af2c-9791-4043-9e66-6c2672153034', 'c2f1e601-cae7-4bcc-b9b0-6e10fdf869e5', 0, 0, 0, '2025-07-23 14:00:25.910', NULL, '2025-07-23 14:00:25.912', '2025-07-23 14:00:25.912', NULL, NULL, '2025-07-23 14:00:25.912', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('5a3aefb3-2e18-4124-9c31-8004d6cf1662', '1daa5bfe-1ae7-49b6-a9b9-4451174ef741', 'c2f1e601-cae7-4bcc-b9b0-6e10fdf869e5', 0, 0, 0, '2025-07-23 14:00:25.917', NULL, '2025-07-23 14:00:25.918', '2025-07-23 14:00:25.918', NULL, NULL, '2025-07-23 14:00:25.918', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('e98c85a8-2551-431e-82c5-83d049cfd02b', '646c918b-229b-4a90-8d17-d5241a8e4b56', 'c2f1e601-cae7-4bcc-b9b0-6e10fdf869e5', 0, 0, 0, '2025-07-23 14:00:25.921', NULL, '2025-07-23 14:00:25.922', '2025-07-23 14:00:25.922', NULL, NULL, '2025-07-23 14:00:25.922', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('3bcb201c-4089-40a1-ae5e-2c15a90437af', '26045e1f-7e37-4f24-94bd-24cf27390056', 'e7b11e3e-7703-4fb5-9363-7b8cdc861a7c', 0, 0, 0, '2025-07-23 14:00:25.925', NULL, '2025-07-23 14:00:25.926', '2025-07-23 14:00:25.926', NULL, NULL, '2025-07-23 14:00:25.926', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('14575007-0bab-4487-a4dc-17137532be35', 'c76b8593-2f26-4be1-aa88-073a3aace93b', 'e7b11e3e-7703-4fb5-9363-7b8cdc861a7c', 0, 0, 0, '2025-07-23 14:00:25.928', NULL, '2025-07-23 14:00:25.930', '2025-07-23 14:00:25.930', NULL, NULL, '2025-07-23 14:00:25.930', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('68012316-e175-4462-95b9-3ab1fbb51d6e', '98749d6c-bb86-464d-b5cf-46d013c94f5a', 'e7b11e3e-7703-4fb5-9363-7b8cdc861a7c', 0, 0, 0, '2025-07-23 14:00:25.932', NULL, '2025-07-23 14:00:25.933', '2025-07-23 14:00:25.933', NULL, NULL, '2025-07-23 14:00:25.933', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('890c5245-e51f-48b6-83a9-3f31fa262173', '26045e1f-7e37-4f24-94bd-24cf27390056', 'c2f1e601-cae7-4bcc-b9b0-6e10fdf869e5', 0, 0, 0, '2025-07-23 14:00:25.936', NULL, '2025-07-23 14:00:25.937', '2025-07-23 14:00:25.937', NULL, NULL, '2025-07-23 14:00:25.937', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('2dd4bd09-6569-4cf9-acfd-323db563a7b9', 'c76b8593-2f26-4be1-aa88-073a3aace93b', 'c2f1e601-cae7-4bcc-b9b0-6e10fdf869e5', 0, 0, 0, '2025-07-23 14:00:25.939', NULL, '2025-07-23 14:00:25.940', '2025-07-23 14:00:25.940', NULL, NULL, '2025-07-23 14:00:25.940', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('b6dba582-1efc-41d6-8850-21ff2a3d0a53', '98749d6c-bb86-464d-b5cf-46d013c94f5a', 'c2f1e601-cae7-4bcc-b9b0-6e10fdf869e5', 0, 0, 0, '2025-07-23 14:00:25.942', NULL, '2025-07-23 14:00:25.944', '2025-07-23 14:00:25.944', NULL, NULL, '2025-07-23 14:00:25.944', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('8e9119fd-ac9c-4f9a-a8bf-b28639a59f25', '60c42b80-39c0-4aba-9aae-978351e394af', 'e7b11e3e-7703-4fb5-9363-7b8cdc861a7c', 0, 0, 0, '2025-07-23 14:00:25.946', NULL, '2025-07-23 14:00:25.947', '2025-07-23 14:00:25.947', NULL, NULL, '2025-07-23 14:00:25.947', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('a743fc99-e5e0-431b-bbb9-ac084fc24134', '70d09bc6-0f45-4591-a62f-d6b0480ff224', 'e7b11e3e-7703-4fb5-9363-7b8cdc861a7c', 0, 0, 0, '2025-07-23 14:00:25.955', NULL, '2025-07-23 14:00:25.957', '2025-07-23 14:00:25.957', NULL, NULL, '2025-07-23 14:00:25.957', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('de4445ec-c415-4cb8-be78-068783cc7a40', '3f31b445-6211-434a-a780-630342acc104', 'e7b11e3e-7703-4fb5-9363-7b8cdc861a7c', 0, 0, 0, '2025-07-23 14:00:25.962', NULL, '2025-07-23 14:00:25.963', '2025-07-23 14:00:25.963', NULL, NULL, '2025-07-23 14:00:25.963', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('4d9af978-c24e-4cb1-9172-3cf721cf2d0e', '60c42b80-39c0-4aba-9aae-978351e394af', 'c2f1e601-cae7-4bcc-b9b0-6e10fdf869e5', 0, 0, 0, '2025-07-23 14:00:25.970', NULL, '2025-07-23 14:00:25.971', '2025-07-23 14:00:25.971', NULL, NULL, '2025-07-23 14:00:25.971', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('2bea522d-50bc-483b-a01f-85b4e49ae83b', '70d09bc6-0f45-4591-a62f-d6b0480ff224', 'c2f1e601-cae7-4bcc-b9b0-6e10fdf869e5', 0, 0, 0, '2025-07-23 14:00:25.974', NULL, '2025-07-23 14:00:25.975', '2025-07-23 14:00:25.975', NULL, NULL, '2025-07-23 14:00:25.975', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('6f6b151c-bfd8-499e-b5a0-36b75798cd4c', '3f31b445-6211-434a-a780-630342acc104', 'c2f1e601-cae7-4bcc-b9b0-6e10fdf869e5', 0, 0, 0, '2025-07-23 14:00:25.977', NULL, '2025-07-23 14:00:25.979', '2025-07-23 14:00:25.979', NULL, NULL, '2025-07-23 14:00:25.979', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('e2667e95-96e9-4e90-879b-4bdd692b7f2a', '87ea5ff9-fc8c-4bc3-a306-e1cb7ead2458', 'e0712c36-0a17-425c-8a6d-83f2440ef7da', 0, 0, 0, '2025-07-25 17:49:07.456', NULL, '2025-07-25 17:49:07.458', '2025-07-25 17:49:07.458', NULL, NULL, '2025-07-25 17:49:07.458', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('c2c44d6f-561d-490e-b6ff-9f634f3951b6', '956da477-67c2-486a-9560-e558cd595996', 'e0712c36-0a17-425c-8a6d-83f2440ef7da', 0, 0, 0, '2025-07-25 17:49:07.469', NULL, '2025-07-25 17:49:07.471', '2025-07-25 17:49:07.471', NULL, NULL, '2025-07-25 17:49:07.471', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('126616a5-640f-4d9c-b5d8-52308219dde7', '7d5bb1db-ede9-478e-8655-79bf996e699a', 'e0712c36-0a17-425c-8a6d-83f2440ef7da', 0, 0, 0, '2025-07-25 17:49:07.477', NULL, '2025-07-25 17:49:07.479', '2025-07-25 17:49:07.479', NULL, NULL, '2025-07-25 17:49:07.479', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('804ede03-cdd7-4ecf-b2e8-f8ca3a84b36b', '87ea5ff9-fc8c-4bc3-a306-e1cb7ead2458', 'ee72dab2-1301-44b5-a701-0dc96801133d', 0, 0, 0, '2025-07-25 17:49:07.485', NULL, '2025-07-25 17:49:07.487', '2025-07-25 17:49:07.487', NULL, NULL, '2025-07-25 17:49:07.487', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('f79977ff-0ef0-48e8-8033-9f3645ce10d8', '956da477-67c2-486a-9560-e558cd595996', 'ee72dab2-1301-44b5-a701-0dc96801133d', 0, 0, 0, '2025-07-25 17:49:07.490', NULL, '2025-07-25 17:49:07.492', '2025-07-25 17:49:07.492', NULL, NULL, '2025-07-25 17:49:07.492', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('f374e892-c2ff-4668-83f0-5e060b201fbb', '7d5bb1db-ede9-478e-8655-79bf996e699a', 'ee72dab2-1301-44b5-a701-0dc96801133d', 0, 0, 0, '2025-07-25 17:49:07.502', NULL, '2025-07-25 17:49:07.504', '2025-07-25 17:49:07.504', NULL, NULL, '2025-07-25 17:49:07.504', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('e1cc4752-7570-4372-a59a-757908534282', '5617037b-f5d5-4ada-a6bb-052d264f2624', 'e0712c36-0a17-425c-8a6d-83f2440ef7da', 0, 0, 0, '2025-07-25 17:49:07.514', NULL, '2025-07-25 17:49:07.516', '2025-07-25 17:49:07.516', NULL, NULL, '2025-07-25 17:49:07.516', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('4b6a446c-b3ce-4f49-9edb-1a042f971625', 'cd83c941-e6f3-4e41-81a0-d93be23bf425', 'e0712c36-0a17-425c-8a6d-83f2440ef7da', 0, 0, 0, '2025-07-25 17:49:07.523', NULL, '2025-07-25 17:49:07.525', '2025-07-25 17:49:07.525', NULL, NULL, '2025-07-25 17:49:07.525', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('27de28b4-d612-4c18-90e5-24e7a9aef6be', '51e938b4-be1b-40b6-9df9-400d4efb1357', 'e0712c36-0a17-425c-8a6d-83f2440ef7da', 0, 0, 0, '2025-07-25 17:49:07.534', NULL, '2025-07-25 17:49:07.536', '2025-07-25 17:49:07.536', NULL, NULL, '2025-07-25 17:49:07.536', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('127fb545-bb34-453a-a477-48172ea072c3', '5617037b-f5d5-4ada-a6bb-052d264f2624', 'ee72dab2-1301-44b5-a701-0dc96801133d', 0, 0, 0, '2025-07-25 17:49:07.541', NULL, '2025-07-25 17:49:07.543', '2025-07-25 17:49:07.543', NULL, NULL, '2025-07-25 17:49:07.543', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('ec6ce26e-5943-4550-a847-6aa804069143', 'cd83c941-e6f3-4e41-81a0-d93be23bf425', 'ee72dab2-1301-44b5-a701-0dc96801133d', 0, 0, 0, '2025-07-25 17:49:07.553', NULL, '2025-07-25 17:49:07.554', '2025-07-25 17:49:07.554', NULL, NULL, '2025-07-25 17:49:07.554', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('48bb4feb-b3f1-4a3d-9b76-34291396d9bb', '51e938b4-be1b-40b6-9df9-400d4efb1357', 'ee72dab2-1301-44b5-a701-0dc96801133d', 0, 0, 0, '2025-07-25 17:49:07.562', NULL, '2025-07-25 17:49:07.563', '2025-07-25 17:49:07.563', NULL, NULL, '2025-07-25 17:49:07.563', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('475c6556-a39c-421a-bf56-2faa36a60753', '74009bd0-3937-4e16-b95c-6b722faffd5f', 'e0712c36-0a17-425c-8a6d-83f2440ef7da', 0, 0, 0, '2025-07-25 17:49:07.568', NULL, '2025-07-25 17:49:07.569', '2025-07-25 17:49:07.569', NULL, NULL, '2025-07-25 17:49:07.569', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('2e5030f7-ba70-4a38-89ff-8222da009f7c', '00248171-85ff-4814-8396-a82ef2bff4d3', 'e0712c36-0a17-425c-8a6d-83f2440ef7da', 0, 0, 0, '2025-07-25 17:49:07.572', NULL, '2025-07-25 17:49:07.574', '2025-07-25 17:49:07.574', NULL, NULL, '2025-07-25 17:49:07.574', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('ac3c4730-e334-437f-83b8-daabb6dfddd9', 'f7367bf0-1f91-4c70-8be1-c0dd0c547b22', 'e0712c36-0a17-425c-8a6d-83f2440ef7da', 0, 0, 0, '2025-07-25 17:49:07.577', NULL, '2025-07-25 17:49:07.579', '2025-07-25 17:49:07.579', NULL, NULL, '2025-07-25 17:49:07.579', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('5f70ccb3-307f-4242-b703-71acbb06d9de', '74009bd0-3937-4e16-b95c-6b722faffd5f', 'ee72dab2-1301-44b5-a701-0dc96801133d', 0, 0, 0, '2025-07-25 17:49:07.589', NULL, '2025-07-25 17:49:07.591', '2025-07-25 17:49:07.591', NULL, NULL, '2025-07-25 17:49:07.591', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('7655cf94-fbc9-46c1-81a9-e6f38524bab1', '00248171-85ff-4814-8396-a82ef2bff4d3', 'ee72dab2-1301-44b5-a701-0dc96801133d', 0, 0, 0, '2025-07-25 17:49:07.602', NULL, '2025-07-25 17:49:07.604', '2025-07-25 17:49:07.604', NULL, NULL, '2025-07-25 17:49:07.604', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('68384959-9342-4d4c-96fb-fbd3d4f59d97', 'f7367bf0-1f91-4c70-8be1-c0dd0c547b22', 'ee72dab2-1301-44b5-a701-0dc96801133d', 0, 0, 0, '2025-07-25 17:49:07.608', NULL, '2025-07-25 17:49:07.610', '2025-07-25 17:49:07.610', NULL, NULL, '2025-07-25 17:49:07.610', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('677e7d9a-e7bd-459a-b908-063d91ce67ee', 'e360bc4e-c128-4d9f-9faa-1544b38b7ab4', 'e0712c36-0a17-425c-8a6d-83f2440ef7da', 0, 0, 0, '2025-07-25 17:49:07.621', NULL, '2025-07-25 17:49:07.623', '2025-07-25 17:49:07.623', NULL, NULL, '2025-07-25 17:49:07.623', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('4fba9a7d-c2a9-4654-b1c2-94647cda9f45', '81993f71-c2ef-467c-b484-c6d9d5d07e49', 'e0712c36-0a17-425c-8a6d-83f2440ef7da', 0, 0, 0, '2025-07-25 17:49:07.636', NULL, '2025-07-25 17:49:07.638', '2025-07-25 17:49:07.638', NULL, NULL, '2025-07-25 17:49:07.638', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('b89ebf97-f6da-44b1-97b3-3c6d464ffcf7', '56eaba9f-cb3e-4f35-bc9c-962df0c842e9', 'e0712c36-0a17-425c-8a6d-83f2440ef7da', 0, 0, 0, '2025-07-25 17:49:07.644', NULL, '2025-07-25 17:49:07.650', '2025-07-25 17:49:07.650', NULL, NULL, '2025-07-25 17:49:07.650', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('f1949f39-39be-4137-9df6-0e652906dd6d', 'e360bc4e-c128-4d9f-9faa-1544b38b7ab4', 'ee72dab2-1301-44b5-a701-0dc96801133d', 0, 0, 0, '2025-07-25 17:49:07.656', NULL, '2025-07-25 17:49:07.658', '2025-07-25 17:49:07.658', NULL, NULL, '2025-07-25 17:49:07.658', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('43d97723-9550-4ca7-ba6d-d8d92c2d1248', '81993f71-c2ef-467c-b484-c6d9d5d07e49', 'ee72dab2-1301-44b5-a701-0dc96801133d', 0, 0, 0, '2025-07-25 17:49:07.664', NULL, '2025-07-25 17:49:07.666', '2025-07-25 17:49:07.666', NULL, NULL, '2025-07-25 17:49:07.666', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('58bc4d7c-9124-4dd1-8309-79d9de65185a', '56eaba9f-cb3e-4f35-bc9c-962df0c842e9', 'ee72dab2-1301-44b5-a701-0dc96801133d', 0, 0, 0, '2025-07-25 17:49:07.670', NULL, '2025-07-25 17:49:07.672', '2025-07-25 17:49:07.672', NULL, NULL, '2025-07-25 17:49:07.672', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('5f88c24b-6022-4657-a25c-5fca13239550', '57e09744-ec7f-4fb2-a846-a55733356b97', 'e0712c36-0a17-425c-8a6d-83f2440ef7da', 0, 0, 0, '2025-07-25 17:49:07.675', NULL, '2025-07-25 17:49:07.676', '2025-07-25 17:49:07.676', NULL, NULL, '2025-07-25 17:49:07.676', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('6d79b13f-1b69-4a13-bd59-6792a18ff6d4', '37e27bed-7b6e-44af-8986-a178a3c8854a', 'e0712c36-0a17-425c-8a6d-83f2440ef7da', 0, 0, 0, '2025-07-25 17:49:07.685', NULL, '2025-07-25 17:49:07.687', '2025-07-25 17:49:07.687', NULL, NULL, '2025-07-25 17:49:07.687', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('96cde4e9-ffc5-494d-a13b-16235d9ae459', '00cb776b-cc9f-47c8-a45a-204e6bcaa2ba', 'e0712c36-0a17-425c-8a6d-83f2440ef7da', 0, 0, 0, '2025-07-25 17:49:07.692', NULL, '2025-07-25 17:49:07.694', '2025-07-25 17:49:07.694', NULL, NULL, '2025-07-25 17:49:07.694', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('7db206e3-6056-4aa5-b63d-cecd1be7bfd9', '57e09744-ec7f-4fb2-a846-a55733356b97', 'ee72dab2-1301-44b5-a701-0dc96801133d', 0, 0, 0, '2025-07-25 17:49:07.706', NULL, '2025-07-25 17:49:07.708', '2025-07-25 17:49:07.708', NULL, NULL, '2025-07-25 17:49:07.708', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('59be4ea7-3281-45c3-9e74-d4167fa791ca', '37e27bed-7b6e-44af-8986-a178a3c8854a', 'ee72dab2-1301-44b5-a701-0dc96801133d', 0, 0, 0, '2025-07-25 17:49:07.720', NULL, '2025-07-25 17:49:07.721', '2025-07-25 17:49:07.721', NULL, NULL, '2025-07-25 17:49:07.721', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('27ff0981-9128-44b5-a86f-269a2c6032af', '00cb776b-cc9f-47c8-a45a-204e6bcaa2ba', 'ee72dab2-1301-44b5-a701-0dc96801133d', 0, 0, 0, '2025-07-25 17:49:07.727', NULL, '2025-07-25 17:49:07.734', '2025-07-25 17:49:07.734', NULL, NULL, '2025-07-25 17:49:07.734', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('cc5d52e0-1f34-4aab-a813-1ff2fd9cdf2b', 'ab627f1e-818e-4924-bd34-617c322327d3', 'e0712c36-0a17-425c-8a6d-83f2440ef7da', 0, 0, 0, '2025-07-25 17:49:07.738', NULL, '2025-07-25 17:49:07.740', '2025-07-25 17:49:07.740', NULL, NULL, '2025-07-25 17:49:07.740', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('1e7215b8-cef3-462f-aa6d-d0623ae54a2f', '7f1f689c-2f21-4e93-b993-5949aa6be86c', 'e0712c36-0a17-425c-8a6d-83f2440ef7da', 0, 0, 0, '2025-07-25 17:49:07.746', NULL, '2025-07-25 17:49:07.748', '2025-07-25 17:49:07.748', NULL, NULL, '2025-07-25 17:49:07.748', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('de8b302d-2dc0-44c8-9bed-4bdc8d332e77', '2c059d6d-8c2c-43c2-83f1-4923e792d5bc', 'e0712c36-0a17-425c-8a6d-83f2440ef7da', 0, 0, 0, '2025-07-25 17:49:07.753', NULL, '2025-07-25 17:49:07.755', '2025-07-25 17:49:07.755', NULL, NULL, '2025-07-25 17:49:07.755', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('78211100-0051-4d20-a5d8-17b0e2acaea5', 'ab627f1e-818e-4924-bd34-617c322327d3', 'ee72dab2-1301-44b5-a701-0dc96801133d', 0, 0, 0, '2025-07-25 17:49:08.056', NULL, '2025-07-25 17:49:08.057', '2025-07-25 17:49:08.057', NULL, NULL, '2025-07-25 17:49:08.057', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('4703c2a6-f6e6-4868-8c15-8c5877af2fed', '7f1f689c-2f21-4e93-b993-5949aa6be86c', 'ee72dab2-1301-44b5-a701-0dc96801133d', 0, 0, 0, '2025-07-25 17:49:08.060', NULL, '2025-07-25 17:49:08.063', '2025-07-25 17:49:08.063', NULL, NULL, '2025-07-25 17:49:08.063', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0),
('3d4094f3-8a7e-4b2d-88c8-3f7716012f09', '2c059d6d-8c2c-43c2-83f1-4923e792d5bc', 'ee72dab2-1301-44b5-a701-0dc96801133d', 0, 0, 0, '2025-07-25 17:49:08.070', NULL, '2025-07-25 17:49:08.072', '2025-07-25 17:49:08.072', NULL, NULL, '2025-07-25 17:49:08.072', NULL, NULL, 0, 0, 0, NULL, NULL, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `module_skills`
--

DROP TABLE IF EXISTS `module_skills`;
CREATE TABLE IF NOT EXISTS `module_skills` (
  `module_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `skill` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`module_id`,`skill`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `module_skills`
--

INSERT INTO `module_skills` (`module_id`, `skill`) VALUES
('00248171-85ff-4814-8396-a82ef2bff4d3', 'Listening'),
('00248171-85ff-4814-8396-a82ef2bff4d3', 'Reading'),
('00248171-85ff-4814-8396-a82ef2bff4d3', 'Speaking'),
('00cb776b-cc9f-47c8-a45a-204e6bcaa2ba', 'Listening'),
('00cb776b-cc9f-47c8-a45a-204e6bcaa2ba', 'Reading'),
('00cb776b-cc9f-47c8-a45a-204e6bcaa2ba', 'Speaking'),
('04027961-5060-4c53-90e9-39598263b436', 'Listening'),
('04027961-5060-4c53-90e9-39598263b436', 'Reading'),
('04027961-5060-4c53-90e9-39598263b436', 'Speaking'),
('0593748f-9687-4e74-a1ef-76107c3f7c56', 'Listening'),
('0593748f-9687-4e74-a1ef-76107c3f7c56', 'Reading'),
('0593748f-9687-4e74-a1ef-76107c3f7c56', 'Speaking'),
('08b392c9-92e2-4fe8-ac27-1be5037a7b2b', 'Listening'),
('08b392c9-92e2-4fe8-ac27-1be5037a7b2b', 'Reading'),
('08b392c9-92e2-4fe8-ac27-1be5037a7b2b', 'Speaking'),
('09efd3bb-42b0-41e9-bf69-31edc0477c3a', 'Listening'),
('09efd3bb-42b0-41e9-bf69-31edc0477c3a', 'Reading'),
('09efd3bb-42b0-41e9-bf69-31edc0477c3a', 'Speaking'),
('0a299bf2-aad8-42c6-bf8b-22b27c63fd11', 'Listening'),
('0a299bf2-aad8-42c6-bf8b-22b27c63fd11', 'Reading'),
('0a299bf2-aad8-42c6-bf8b-22b27c63fd11', 'Speaking'),
('0c2ff584-7f7f-4a12-8cb0-47bf70483d98', 'Listening'),
('0e5aad0b-8c6c-4fdc-8ce2-c19ccdc2a657', 'Listening'),
('0e5aad0b-8c6c-4fdc-8ce2-c19ccdc2a657', 'Reading'),
('0e5aad0b-8c6c-4fdc-8ce2-c19ccdc2a657', 'Speaking'),
('0fb88d7e-06ad-4b01-ac49-a1831112c180', 'Listening'),
('0fb88d7e-06ad-4b01-ac49-a1831112c180', 'Reading'),
('0fb88d7e-06ad-4b01-ac49-a1831112c180', 'Speaking'),
('17116ae2-7e17-4d22-8bed-ff704df33572', 'Listening'),
('17116ae2-7e17-4d22-8bed-ff704df33572', 'Reading'),
('17116ae2-7e17-4d22-8bed-ff704df33572', 'Speaking'),
('179a3b47-eea0-45ed-b2f3-ef86be81c06a', 'Listening'),
('179a3b47-eea0-45ed-b2f3-ef86be81c06a', 'Reading'),
('179a3b47-eea0-45ed-b2f3-ef86be81c06a', 'Speaking'),
('18611de0-d82a-494a-bc85-8af8b921003c', 'Listening'),
('18611de0-d82a-494a-bc85-8af8b921003c', 'Reading'),
('18611de0-d82a-494a-bc85-8af8b921003c', 'Speaking'),
('1c2f230b-526a-4d94-9e66-3a4824a91e07', 'Listening'),
('1c2f230b-526a-4d94-9e66-3a4824a91e07', 'Reading'),
('1c2f230b-526a-4d94-9e66-3a4824a91e07', 'Speaking'),
('1daa5bfe-1ae7-49b6-a9b9-4451174ef741', 'Listening'),
('1daa5bfe-1ae7-49b6-a9b9-4451174ef741', 'Reading'),
('1daa5bfe-1ae7-49b6-a9b9-4451174ef741', 'Speaking'),
('2070f139-4946-11f0-9f87-0a0027000007', 'Listening'),
('2070f139-4946-11f0-9f87-0a0027000007', 'Reading'),
('2070f139-4946-11f0-9f87-0a0027000007', 'Speaking'),
('2070f139-4946-11f0-9f87-0a0027000007', 'Writing'),
('2070f753-4946-11f0-9f87-0a0027000007', 'Listening'),
('2070f87b-4946-11f0-9f87-0a0027000007', 'Listening'),
('2070f921-4946-11f0-9f87-0a0027000007', 'Listening'),
('2070f9bd-4946-11f0-9f87-0a0027000007', 'Listening'),
('207b4eeb-7e33-4707-86b8-50d2a5d54720', 'Skill 1 for Module 1 for XYZ Language School Cours'),
('238ae916-d6cd-4d2e-a136-11a45a90838a', 'Listening'),
('238ae916-d6cd-4d2e-a136-11a45a90838a', 'Reading'),
('238ae916-d6cd-4d2e-a136-11a45a90838a', 'Speaking'),
('26045e1f-7e37-4f24-94bd-24cf27390056', 'Listening'),
('26045e1f-7e37-4f24-94bd-24cf27390056', 'Reading'),
('26045e1f-7e37-4f24-94bd-24cf27390056', 'Speaking'),
('2aff2a57-ed69-4b9c-a57c-46c3ae393cc2', 'Listening'),
('2aff2a57-ed69-4b9c-a57c-46c3ae393cc2', 'Reading'),
('2aff2a57-ed69-4b9c-a57c-46c3ae393cc2', 'Speaking'),
('2c059d6d-8c2c-43c2-83f1-4923e792d5bc', 'Listening'),
('2c059d6d-8c2c-43c2-83f1-4923e792d5bc', 'Reading'),
('2c059d6d-8c2c-43c2-83f1-4923e792d5bc', 'Speaking'),
('2d24ac7e-c86a-4695-802e-df1c829c879a', 'Listening'),
('2d24ac7e-c86a-4695-802e-df1c829c879a', 'Reading'),
('2d24ac7e-c86a-4695-802e-df1c829c879a', 'Speaking'),
('32133e34-6028-4310-b812-ddde0c18b778', 'Listening'),
('34ead4f9-77c0-493f-9804-b5b26472dfd2', 'Listening'),
('37e27bed-7b6e-44af-8986-a178a3c8854a', 'Listening'),
('37e27bed-7b6e-44af-8986-a178a3c8854a', 'Reading'),
('37e27bed-7b6e-44af-8986-a178a3c8854a', 'Speaking'),
('38d0d39b-9d28-416b-bbfa-e4deccd076b0', 'Listening'),
('38d0d39b-9d28-416b-bbfa-e4deccd076b0', 'Reading'),
('38d0d39b-9d28-416b-bbfa-e4deccd076b0', 'Speaking'),
('3f31b445-6211-434a-a780-630342acc104', 'Listening'),
('3f31b445-6211-434a-a780-630342acc104', 'Reading'),
('3f31b445-6211-434a-a780-630342acc104', 'Speaking'),
('3fa13dae-9fe4-4a11-b084-91604817859b', 'Listening'),
('3fa1f676-1af4-4a57-abe7-78f910c4897b', 'Listening'),
('3fa1f676-1af4-4a57-abe7-78f910c4897b', 'Reading'),
('3fa1f676-1af4-4a57-abe7-78f910c4897b', 'Speaking'),
('4acb389f-28f3-4b3d-a718-e8320386d99e', 'Listening'),
('4acb389f-28f3-4b3d-a718-e8320386d99e', 'Reading'),
('4acb389f-28f3-4b3d-a718-e8320386d99e', 'Speaking'),
('4eedc947-fbce-4042-992a-c0e3e442fe3e', 'Listening'),
('50abb2aa-4156-4d9a-90b9-7faa4acaf374', 'Listening'),
('50abb2aa-4156-4d9a-90b9-7faa4acaf374', 'Reading'),
('50abb2aa-4156-4d9a-90b9-7faa4acaf374', 'Speaking'),
('51e938b4-be1b-40b6-9df9-400d4efb1357', 'Listening'),
('51e938b4-be1b-40b6-9df9-400d4efb1357', 'Reading'),
('51e938b4-be1b-40b6-9df9-400d4efb1357', 'Speaking'),
('5617037b-f5d5-4ada-a6bb-052d264f2624', 'Listening'),
('5617037b-f5d5-4ada-a6bb-052d264f2624', 'Reading'),
('5617037b-f5d5-4ada-a6bb-052d264f2624', 'Speaking'),
('56c74ea0-5b4f-4df9-a2e5-74a7292d6bd8', 'Listening'),
('56c74ea0-5b4f-4df9-a2e5-74a7292d6bd8', 'Reading'),
('56c74ea0-5b4f-4df9-a2e5-74a7292d6bd8', 'Speaking'),
('56eaba9f-cb3e-4f35-bc9c-962df0c842e9', 'Listening'),
('56eaba9f-cb3e-4f35-bc9c-962df0c842e9', 'Reading'),
('56eaba9f-cb3e-4f35-bc9c-962df0c842e9', 'Speaking'),
('579d4c74-3908-4386-bd39-9984159e7f0e', 'Listening'),
('57e09744-ec7f-4fb2-a846-a55733356b97', 'Listening'),
('57e09744-ec7f-4fb2-a846-a55733356b97', 'Reading'),
('57e09744-ec7f-4fb2-a846-a55733356b97', 'Speaking'),
('60c42b80-39c0-4aba-9aae-978351e394af', 'Listening'),
('60c42b80-39c0-4aba-9aae-978351e394af', 'Reading'),
('60c42b80-39c0-4aba-9aae-978351e394af', 'Speaking'),
('6103afe4-c6da-4ad2-9a11-ec458a0e615a', 'Listening'),
('6103afe4-c6da-4ad2-9a11-ec458a0e615a', 'Reading'),
('6103afe4-c6da-4ad2-9a11-ec458a0e615a', 'Speaking'),
('61359af2-999b-4dcf-8105-e02e52e4ddd6', 'Listening'),
('63f9479c-8e5a-4cfe-ac47-f588f686a9b3', 'Listening'),
('63f9479c-8e5a-4cfe-ac47-f588f686a9b3', 'Reading'),
('63f9479c-8e5a-4cfe-ac47-f588f686a9b3', 'Speaking'),
('642fc769-7f87-402b-ba07-c51897a98fa7', 'Listening'),
('642fc769-7f87-402b-ba07-c51897a98fa7', 'Reading'),
('642fc769-7f87-402b-ba07-c51897a98fa7', 'Speaking'),
('646c918b-229b-4a90-8d17-d5241a8e4b56', 'Listening'),
('646c918b-229b-4a90-8d17-d5241a8e4b56', 'Reading'),
('646c918b-229b-4a90-8d17-d5241a8e4b56', 'Speaking'),
('6768235b-32cb-49bf-9e96-54f28dbbb47c', 'Listening'),
('6dc8b613-3f60-4dc7-9d3f-8752cf130c29', 'Listening'),
('70d09bc6-0f45-4591-a62f-d6b0480ff224', 'Listening'),
('70d09bc6-0f45-4591-a62f-d6b0480ff224', 'Reading'),
('70d09bc6-0f45-4591-a62f-d6b0480ff224', 'Speaking'),
('74009bd0-3937-4e16-b95c-6b722faffd5f', 'Listening'),
('74009bd0-3937-4e16-b95c-6b722faffd5f', 'Reading'),
('74009bd0-3937-4e16-b95c-6b722faffd5f', 'Speaking'),
('761f72d3-aa72-4a9f-88f8-f7738d1aca16', 'Listening'),
('761f72d3-aa72-4a9f-88f8-f7738d1aca16', 'Reading'),
('761f72d3-aa72-4a9f-88f8-f7738d1aca16', 'Speaking'),
('7c2b5c61-6ff2-46e6-bff7-5507ce3ad1ab', 'Listening'),
('7d5bb1db-ede9-478e-8655-79bf996e699a', 'Listening'),
('7d5bb1db-ede9-478e-8655-79bf996e699a', 'Reading'),
('7d5bb1db-ede9-478e-8655-79bf996e699a', 'Speaking'),
('7d94af2c-9791-4043-9e66-6c2672153034', 'Listening'),
('7d94af2c-9791-4043-9e66-6c2672153034', 'Reading'),
('7d94af2c-9791-4043-9e66-6c2672153034', 'Speaking'),
('7f1f689c-2f21-4e93-b993-5949aa6be86c', 'Listening'),
('7f1f689c-2f21-4e93-b993-5949aa6be86c', 'Reading'),
('7f1f689c-2f21-4e93-b993-5949aa6be86c', 'Speaking'),
('81993f71-c2ef-467c-b484-c6d9d5d07e49', 'Listening'),
('81993f71-c2ef-467c-b484-c6d9d5d07e49', 'Reading'),
('81993f71-c2ef-467c-b484-c6d9d5d07e49', 'Speaking'),
('82af9f93-fd99-4db5-800e-97b669989c43', 'Listening'),
('82af9f93-fd99-4db5-800e-97b669989c43', 'Reading'),
('82af9f93-fd99-4db5-800e-97b669989c43', 'Speaking'),
('84d1d0b1-b37d-444d-b05a-179a6863368e', 'Listening'),
('84d1d0b1-b37d-444d-b05a-179a6863368e', 'Reading'),
('84d1d0b1-b37d-444d-b05a-179a6863368e', 'Speaking'),
('84ff9f6f-154d-4a7b-a935-304dcc9a1d5a', 'Listening'),
('87ea5ff9-fc8c-4bc3-a306-e1cb7ead2458', 'Listening'),
('87ea5ff9-fc8c-4bc3-a306-e1cb7ead2458', 'Reading'),
('87ea5ff9-fc8c-4bc3-a306-e1cb7ead2458', 'Speaking'),
('893b8b5b-c43b-46da-abee-845f9bef41b7', 'Listening'),
('893b8b5b-c43b-46da-abee-845f9bef41b7', 'Reading'),
('893b8b5b-c43b-46da-abee-845f9bef41b7', 'Speaking'),
('8ca145d6-5c9e-4633-943d-8c46f803df3c', 'Listening'),
('8ca145d6-5c9e-4633-943d-8c46f803df3c', 'Reading'),
('8ca145d6-5c9e-4633-943d-8c46f803df3c', 'Speaking'),
('8ed6aeff-b87d-401a-83bf-c0cf9c7844aa', 'Listening'),
('8ef02b5d-e693-4957-821a-0f6122287278', 'Listening'),
('8ef02b5d-e693-4957-821a-0f6122287278', 'Reading'),
('8ef02b5d-e693-4957-821a-0f6122287278', 'Speaking'),
('8f21ecbd-46d8-458d-8804-975e54b57729', 'Listening'),
('8f21ecbd-46d8-458d-8804-975e54b57729', 'Reading'),
('8f21ecbd-46d8-458d-8804-975e54b57729', 'Speaking'),
('91256414-dc0a-4f5a-903f-cc429eec2b10', 'Listening'),
('91256414-dc0a-4f5a-903f-cc429eec2b10', 'Reading'),
('91256414-dc0a-4f5a-903f-cc429eec2b10', 'Speaking'),
('91b80f8a-ba80-436a-847f-4b79003083c1', 'Listening'),
('91b80f8a-ba80-436a-847f-4b79003083c1', 'Reading'),
('91b80f8a-ba80-436a-847f-4b79003083c1', 'Speaking'),
('952ab8e9-a89b-43ff-a3b1-70233bf417a2', 'Listening'),
('952ab8e9-a89b-43ff-a3b1-70233bf417a2', 'Reading'),
('952ab8e9-a89b-43ff-a3b1-70233bf417a2', 'Speaking'),
('956da477-67c2-486a-9560-e558cd595996', 'Listening'),
('956da477-67c2-486a-9560-e558cd595996', 'Reading'),
('956da477-67c2-486a-9560-e558cd595996', 'Speaking'),
('95f2c6d8-9b8d-47bf-9063-e66252f5eecb', 'Listening'),
('95f2c6d8-9b8d-47bf-9063-e66252f5eecb', 'Reading'),
('95f2c6d8-9b8d-47bf-9063-e66252f5eecb', 'Speaking'),
('98749d6c-bb86-464d-b5cf-46d013c94f5a', 'Listening'),
('98749d6c-bb86-464d-b5cf-46d013c94f5a', 'Reading'),
('98749d6c-bb86-464d-b5cf-46d013c94f5a', 'Speaking'),
('993ea185-5d0a-4094-bb22-a88cf6cb4cda', 'Listening'),
('9d3a213c-6041-4648-ab45-54906181c8a7', 'Listening'),
('9d3a213c-6041-4648-ab45-54906181c8a7', 'Reading'),
('9d3a213c-6041-4648-ab45-54906181c8a7', 'Speaking'),
('ab627f1e-818e-4924-bd34-617c322327d3', 'Listening'),
('ab627f1e-818e-4924-bd34-617c322327d3', 'Reading'),
('ab627f1e-818e-4924-bd34-617c322327d3', 'Speaking'),
('af2b6284-f275-4503-bbf1-d3f83906a358', 'Listening'),
('af2b6284-f275-4503-bbf1-d3f83906a358', 'Reading'),
('af2b6284-f275-4503-bbf1-d3f83906a358', 'Speaking'),
('b7130969-f79c-41e8-824a-d27f375d6639', 'Listening'),
('b7130969-f79c-41e8-824a-d27f375d6639', 'Reading'),
('b7130969-f79c-41e8-824a-d27f375d6639', 'Speaking'),
('b7d3881b-6abf-42f7-a9d1-6937d9ae8d5e', 'Listening'),
('b975a94a-9272-4d8d-aa1c-a987cf5969a3', 'Listening'),
('b975a94a-9272-4d8d-aa1c-a987cf5969a3', 'Reading'),
('b975a94a-9272-4d8d-aa1c-a987cf5969a3', 'Speaking'),
('bc4bc807-a126-455a-84f9-64bfb2b4ff3f', 'Listening'),
('bc4bc807-a126-455a-84f9-64bfb2b4ff3f', 'Reading'),
('bc4bc807-a126-455a-84f9-64bfb2b4ff3f', 'Speaking'),
('bd5dc629-64f8-408f-a0bc-5dc6f7bedaa1', 'Listening'),
('bd5dc629-64f8-408f-a0bc-5dc6f7bedaa1', 'Reading'),
('bd5dc629-64f8-408f-a0bc-5dc6f7bedaa1', 'Speaking'),
('c4d1602a-c590-4c7c-af3d-c065e54d33dd', 'Listening'),
('c4d1602a-c590-4c7c-af3d-c065e54d33dd', 'Reading'),
('c4d1602a-c590-4c7c-af3d-c065e54d33dd', 'Speaking'),
('c635672c-5696-4287-8efb-0370fd773676', 'Listening'),
('c635672c-5696-4287-8efb-0370fd773676', 'Reading'),
('c635672c-5696-4287-8efb-0370fd773676', 'Speaking'),
('c76b8593-2f26-4be1-aa88-073a3aace93b', 'Listening'),
('c76b8593-2f26-4be1-aa88-073a3aace93b', 'Reading'),
('c76b8593-2f26-4be1-aa88-073a3aace93b', 'Speaking'),
('c850a525-c435-410f-a49d-84c1a19af95b', 'Listening'),
('cd83c941-e6f3-4e41-81a0-d93be23bf425', 'Listening'),
('cd83c941-e6f3-4e41-81a0-d93be23bf425', 'Reading'),
('cd83c941-e6f3-4e41-81a0-d93be23bf425', 'Speaking'),
('cdf6af63-2f9c-4552-902b-19cd227642ed', 'Listening'),
('d0f8a120-c63f-4a10-9647-b437e08bd4cf', 'Listening'),
('d0f8a120-c63f-4a10-9647-b437e08bd4cf', 'Reading'),
('d0f8a120-c63f-4a10-9647-b437e08bd4cf', 'Speaking'),
('d4784cb8-dab0-4030-9df6-f563daecc23e', 'Listening'),
('d56d4462-2dd9-4c14-af40-56464df19192', 'Listening'),
('d56d4462-2dd9-4c14-af40-56464df19192', 'Reading'),
('d56d4462-2dd9-4c14-af40-56464df19192', 'Speaking'),
('d61a23b3-3e21-44ab-9073-042c33b96dac', 'Listening'),
('d61a23b3-3e21-44ab-9073-042c33b96dac', 'Reading'),
('d61a23b3-3e21-44ab-9073-042c33b96dac', 'Speaking'),
('dbc36add-5019-4bc7-95c9-fa021721e373', 'Listening'),
('dbc36add-5019-4bc7-95c9-fa021721e373', 'Reading'),
('dbc36add-5019-4bc7-95c9-fa021721e373', 'Speaking'),
('dc00c537-3e30-4012-bd95-7412a072a36a', 'Listening'),
('dc00c537-3e30-4012-bd95-7412a072a36a', 'Reading'),
('dc00c537-3e30-4012-bd95-7412a072a36a', 'Speaking'),
('de35bad5-9e6e-437d-97cc-c7893114dcf8', 'Listening'),
('e010cd94-1c2c-448d-8003-d1b0c8fd6235', 'Listening'),
('e010cd94-1c2c-448d-8003-d1b0c8fd6235', 'Reading'),
('e010cd94-1c2c-448d-8003-d1b0c8fd6235', 'Speaking'),
('e360bc4e-c128-4d9f-9faa-1544b38b7ab4', 'Listening'),
('e360bc4e-c128-4d9f-9faa-1544b38b7ab4', 'Reading'),
('e360bc4e-c128-4d9f-9faa-1544b38b7ab4', 'Speaking'),
('e587d030-2656-419a-8f8a-60be5bf09757', 'Listening'),
('e587d030-2656-419a-8f8a-60be5bf09757', 'Reading'),
('e587d030-2656-419a-8f8a-60be5bf09757', 'Speaking'),
('eb1a6d58-7fde-4abc-92c4-2615f3ebfc96', 'Listening'),
('eb1a6d58-7fde-4abc-92c4-2615f3ebfc96', 'Reading'),
('eb1a6d58-7fde-4abc-92c4-2615f3ebfc96', 'Speaking'),
('ec59e3fc-cfb6-4a97-b8ca-04f26c85573c', 'Listening'),
('ec59e3fc-cfb6-4a97-b8ca-04f26c85573c', 'Reading'),
('ec59e3fc-cfb6-4a97-b8ca-04f26c85573c', 'Speaking'),
('ef48d874-af61-4be9-b4f8-bc55a17dd809', 'Listening'),
('efcad497-e636-4c70-9e77-2280955dde34', 'Listening'),
('efcad497-e636-4c70-9e77-2280955dde34', 'Reading'),
('efcad497-e636-4c70-9e77-2280955dde34', 'Speaking'),
('f0961629-600f-4b14-8f6f-2c62983dd1bd', 'Listening'),
('f0961629-600f-4b14-8f6f-2c62983dd1bd', 'Reading'),
('f0961629-600f-4b14-8f6f-2c62983dd1bd', 'Speaking'),
('f7367bf0-1f91-4c70-8be1-c0dd0c547b22', 'Listening'),
('f7367bf0-1f91-4c70-8be1-c0dd0c547b22', 'Reading'),
('f7367bf0-1f91-4c70-8be1-c0dd0c547b22', 'Speaking'),
('fc1ba250-7b73-4600-be8f-fccc6653ecd3', 'Listening'),
('fc1ba250-7b73-4600-be8f-fccc6653ecd3', 'Reading'),
('fc1ba250-7b73-4600-be8f-fccc6653ecd3', 'Speaking');

-- --------------------------------------------------------

--
-- Table structure for table `notification_logs`
--

DROP TABLE IF EXISTS `notification_logs`;
CREATE TABLE IF NOT EXISTS `notification_logs` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `templateId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recipientId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipientEmail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipientName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `errorMessage` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `sentAt` datetime(3) DEFAULT NULL,
  `readAt` datetime(3) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdBy` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notification_logs_recipientId_idx` (`recipientId`),
  KEY `notification_logs_type_idx` (`type`),
  KEY `notification_logs_status_idx` (`status`),
  KEY `notification_logs_sentAt_idx` (`sentAt`),
  KEY `notification_logs_templateId_idx` (`templateId`),
  KEY `notification_logs_createdBy_fkey` (`createdBy`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notification_logs`
--

INSERT INTO `notification_logs` (`id`, `templateId`, `recipientId`, `recipientEmail`, `recipientName`, `type`, `subject`, `title`, `content`, `status`, `errorMessage`, `sentAt`, `readAt`, `metadata`, `createdAt`, `createdBy`) VALUES
('ea60c4b6-0e78-4c84-a57a-557e4897b783', '8e6df81d-0463-4401-9359-eedca6f9c174', 'c98a0b89-011b-482f-843e-a5522de40b1e', 'nisha@sterlingcollegelondon.com', 'Nisha Test', 'email', 'Payment Confirmation', 'Payment Confirmation', '\n          <h1>Payment Confirmation</h1>\n          <p>Dear Nisha Test,</p>\n          <p>Your payment has been confirmed. Here are the details:</p>\n          <ul>\n            <li>Amount: $24.99</li>\n            <li>Reference: SUB-1752356437680</li>\n            <li>Date: 12/07/2025</li>\n          </ul>\n          <p>Thank you for your payment!</p>\n          <p>Best regards,<br>The Team</p>\n        ', 'sent', NULL, '2025-07-12 21:40:39.530', NULL, '{\"isTrial\": true, \"planType\": \"PREMIUM\", \"billingCycle\": \"MONTHLY\", \"trialEndDate\": \"2025-07-19T21:39:11.423Z\", \"subscriptionId\": \"PREMIUM\"}', '2025-07-12 21:40:37.692', 'SYSTEM'),
('6ae49e0b-89dc-471d-9c85-5cc89fe3ed83', '14696092-53da-4d43-a3c4-d4b4d713e7b3', 'c98a0b89-011b-482f-843e-a5522de40b1e', 'nisha@sterlingcollegelondon.com', 'Nisha Test', 'email', 'Welcome to Our Platform!', 'Welcome to Our Platform!', '\n          <h1>Welcome to Our Platform!</h1>\n          <p>Dear Nisha Test,</p>\n          <p>Thank you for joining our platform. We\'re excited to have you on board!</p>\n          <p>If you have any questions, feel free to reach out to our support team.</p>\n          <p>Best regards,<br>The Team</p>\n        ', 'sent', NULL, '2025-07-12 21:40:37.666', NULL, '{\"billingCycle\": \"MONTHLY\", \"hasSubscription\": true, \"registrationType\": \"student\", \"subscriptionPlan\": \"PREMIUM\"}', '2025-07-12 21:39:11.453', 'SYSTEM'),
('8ebc01fe-48fa-42c6-9fe0-39c1060a04eb', '8e6df81d-0463-4401-9359-eedca6f9c174', 'bcd7ab98-0a9f-414f-b4f3-3307de06219e', 'patrickmorgan002@gmail.com', 'Patrick Morgan Test', 'email', 'Payment Confirmation', 'Payment Confirmation', '\n          <h1>Payment Confirmation</h1>\n          <p>Dear Patrick Morgan Test,</p>\n          <p>Your payment has been confirmed. Here are the details:</p>\n          <ul>\n            <li>Amount: $12.99</li>\n            <li>Reference: SUB-1752355497308</li>\n            <li>Date: 12/07/2025</li>\n          </ul>\n          <p>Thank you for your payment!</p>\n          <p>Best regards,<br>The Team</p>\n        ', 'sent', NULL, '2025-07-12 21:24:59.766', NULL, '{\"isTrial\": true, \"planType\": \"BASIC\", \"billingCycle\": \"MONTHLY\", \"trialEndDate\": \"2025-07-19T21:24:54.498Z\", \"subscriptionId\": \"BASIC\"}', '2025-07-12 21:24:57.342', 'SYSTEM'),
('330e1c6e-4c28-4b13-9937-d35c46638b0e', '14696092-53da-4d43-a3c4-d4b4d713e7b3', 'bcd7ab98-0a9f-414f-b4f3-3307de06219e', 'patrickmorgan002@gmail.com', 'Patrick Morgan Test', 'email', 'Welcome to Our Platform!', 'Welcome to Our Platform!', '\n          <h1>Welcome to Our Platform!</h1>\n          <p>Dear Patrick Morgan Test,</p>\n          <p>Thank you for joining our platform. We\'re excited to have you on board!</p>\n          <p>If you have any questions, feel free to reach out to our support team.</p>\n          <p>Best regards,<br>The Team</p>\n        ', 'sent', NULL, '2025-07-12 21:24:57.205', NULL, '{\"billingCycle\": \"MONTHLY\", \"hasSubscription\": true, \"registrationType\": \"student\", \"subscriptionPlan\": \"BASIC\"}', '2025-07-12 21:24:54.541', 'SYSTEM'),
('bdcaba93-5711-440f-8526-7c987baf78ab', '4073a636-6f37-4061-bbeb-a589e780427b', '5b5fbd13-8776-4f96-ada9-091973974873', 'patrickmorgan001@gmail.com', 'Student One', 'email', 'Course Enrollment Confirmation', 'Course Enrollment Confirmation', '\n          <h1>Course Enrollment Confirmation</h1>\n          <p>Dear Student One,</p>\n          <p>You have been successfully enrolled in the course: <strong>Conversation & Pronunciation</strong></p>\n          <p>Course details:</p>\n          <ul>\n            <li>Institution: XYZ Language School</li>\n            <li>Duration: {{duration}}</li>\n            <li>Start Date: 23/07/2025</li>\n          </ul>\n          <p>You can now access your course materials and begin learning!</p>\n          <p>Best regards,<br>The Team</p>\n        ', 'failed', 'Invalid login: 535 Authentication credentials invalid', NULL, NULL, '{\"amount\": 740, \"courseName\": \"Conversation & Pronunciation\", \"enrollmentId\": \"cmdfxzczf0007b4ejk2ggjy0u\"}', '2025-07-23 12:30:50.324', 'SYSTEM'),
('93a38dc7-2ad3-4580-8cf6-8527cb45fdbd', '4073a636-6f37-4061-bbeb-a589e780427b', '5b5fbd13-8776-4f96-ada9-091973974873', 'patrickmorgan001@gmail.com', 'Student One', 'email', 'Course Enrollment Confirmation', 'Course Enrollment Confirmation', '\n          <h1>Course Enrollment Confirmation</h1>\n          <p>Dear Student One,</p>\n          <p>You have been successfully enrolled in the course: <strong>General English</strong></p>\n          <p>Course details:</p>\n          <ul>\n            <li>Institution: ABC Shool of English</li>\n            <li>Duration: {{duration}}</li>\n            <li>Start Date: 23/07/2025</li>\n          </ul>\n          <p>You can now access your course materials and begin learning!</p>\n          <p>Best regards,<br>The Team</p>\n        ', 'failed', 'Invalid login: 535 Authentication credentials invalid', NULL, NULL, '{\"amount\": 1360, \"courseName\": \"General English\", \"enrollmentId\": \"cmdg69uuh00029kkxm7wbnam0\"}', '2025-07-23 16:22:57.328', 'SYSTEM'),
('acf9fe0a-4cf2-4a44-8e12-6a6e03d3da3c', '14696092-53da-4d43-a3c4-d4b4d713e7b3', '25e01806-ae0f-433b-8a38-a97021e0e3b8', 'live@test.com', 'Live Tester', 'email', 'Welcome to Our Platform!', 'Welcome to Our Platform!', '\n          <h1>Welcome to Our Platform!</h1>\n          <p>Dear Live Tester,</p>\n          <p>Thank you for joining our platform. We\'re excited to have you on board!</p>\n          <p>If you have any questions, feel free to reach out to our support team.</p>\n          <p>Best regards,<br>The Team</p>\n        ', 'failed', 'connect ECONNREFUSED 127.0.0.1:587', NULL, NULL, '{\"billingCycle\": \"MONTHLY\", \"hasSubscription\": false, \"registrationType\": \"student\", \"subscriptionPlan\": \"none\"}', '2025-08-09 17:14:07.805', 'SYSTEM'),
('bd5b28e1-129a-4349-803d-7235a86432bf', '4073a636-6f37-4061-bbeb-a589e780427b', '25e01806-ae0f-433b-8a38-a97021e0e3b8', 'live@test.com', 'Live Tester', 'email', 'Course Enrollment Confirmation', 'Course Enrollment Confirmation', '\n          <h1>Course Enrollment Confirmation</h1>\n          <p>Dear Live Tester,</p>\n          <p>You have been successfully enrolled in the course: <strong>Global English Mastery - Live Platform Course</strong></p>\n          <p>Course details:</p>\n          <ul>\n            <li>Institution: Test Language Institute</li>\n            <li>Duration: 9 weeks</li>\n            <li>Start Date: 01/02/2024</li>\n          </ul>\n          <p>You can now access your course materials and begin learning!</p>\n          <p>Best regards,<br>The Team</p>\n        ', 'failed', 'connect ECONNREFUSED 127.0.0.1:587', NULL, NULL, '{\"courseId\": \"c35b2490-a08e-4c29-9d28-30735f91bd1f\", \"enrollmentId\": \"cmeascn27000r49m9wt4jyg8k\", \"institutionId\": \"f3346c7f-1b4a-4a11-8eeb-5e943c98c9ea\", \"paymentAmount\": 99.99}', '2025-08-14 02:34:03.673', 'SYSTEM'),
('86b0a281-93c9-417a-9cea-3923c0900e5b', '14696092-53da-4d43-a3c4-d4b4d713e7b3', 'd47324a8-c823-49bc-b2dc-c567727ebafd', 'live2@test.com', 'Live2 Tester', 'email', 'Welcome to Our Platform!', 'Welcome to Our Platform!', '\n          <h1>Welcome to Our Platform!</h1>\n          <p>Dear Live2 Tester,</p>\n          <p>Thank you for joining our platform. We\'re excited to have you on board!</p>\n          <p>If you have any questions, feel free to reach out to our support team.</p>\n          <p>Best regards,<br>The Team</p>\n        ', 'failed', 'connect ECONNREFUSED 127.0.0.1:587', NULL, NULL, '{\"billingCycle\": \"MONTHLY\", \"hasSubscription\": false, \"registrationType\": \"student\", \"subscriptionPlan\": \"none\"}', '2025-08-14 02:37:19.945', 'SYSTEM'),
('2e251522-438a-48f7-96ff-bd76a1a94507', '4073a636-6f37-4061-bbeb-a589e780427b', 'd47324a8-c823-49bc-b2dc-c567727ebafd', 'live2@test.com', 'Live2 Tester', 'email', 'Course Enrollment Confirmation', 'Course Enrollment Confirmation', '\n          <h1>Course Enrollment Confirmation</h1>\n          <p>Dear Live2 Tester,</p>\n          <p>You have been successfully enrolled in the course: <strong>Global English Mastery - Live Platform Course</strong></p>\n          <p>Course details:</p>\n          <ul>\n            <li>Institution: Test Language Institute</li>\n            <li>Duration: 9 weeks</li>\n            <li>Start Date: 01/02/2024</li>\n          </ul>\n          <p>You can now access your course materials and begin learning!</p>\n          <p>Best regards,<br>The Team</p>\n        ', 'failed', 'connect ECONNREFUSED 127.0.0.1:587', NULL, NULL, '{\"courseId\": \"c35b2490-a08e-4c29-9d28-30735f91bd1f\", \"enrollmentId\": \"cmeat1fb7001849m9xatoysda\", \"institutionId\": \"f3346c7f-1b4a-4a11-8eeb-5e943c98c9ea\", \"paymentAmount\": 99.99}', '2025-08-14 02:53:19.950', 'SYSTEM');

-- --------------------------------------------------------

--
-- Table structure for table `notification_templates`
--

DROP TABLE IF EXISTS `notification_templates`;
CREATE TABLE IF NOT EXISTS `notification_templates` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `variables` json DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `createdBy` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedBy` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `notification_templates_name_key` (`name`),
  KEY `notification_templates_type_idx` (`type`),
  KEY `notification_templates_category_idx` (`category`),
  KEY `notification_templates_isActive_idx` (`isActive`),
  KEY `notification_templates_createdBy_fkey` (`createdBy`),
  KEY `notification_templates_updatedBy_fkey` (`updatedBy`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notification_templates`
--

INSERT INTO `notification_templates` (`id`, `name`, `type`, `subject`, `title`, `content`, `variables`, `isActive`, `isDefault`, `category`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`) VALUES
('14696092-53da-4d43-a3c4-d4b4d713e7b3', 'welcome_email', 'email', 'Welcome to Our Platform!', 'Welcome to Our Platform!', '\n          <h1>Welcome to Our Platform!</h1>\n          <p>Dear {{name}},</p>\n          <p>Thank you for joining our platform. We\'re excited to have you on board!</p>\n          <p>If you have any questions, feel free to reach out to our support team.</p>\n          <p>Best regards,<br>The Team</p>\n        ', NULL, 1, 1, 'system', '2025-06-25 23:57:06.770', '2025-06-25 23:57:06.770', '0e971fe1-d22a-446e-9fb9-f52149e29df3', NULL),
('db8f4148-ee7c-448b-9d68-a085f7b213c5', 'password_reset', 'email', 'Password Reset Request', 'Password Reset Request', '\n          <h1>Password Reset Request</h1>\n          <p>Dear {{name}},</p>\n          <p>You requested a password reset. Click the link below to reset your password:</p>\n          <p><a href=\"{{resetUrl}}\">Reset Password</a></p>\n          <p>If you didn\'t request this, please ignore this email.</p>\n          <p>Best regards,<br>The Team</p>\n        ', NULL, 1, 1, 'security', '2025-06-25 23:57:06.776', '2025-06-25 23:57:06.776', '0e971fe1-d22a-446e-9fb9-f52149e29df3', NULL),
('8e6df81d-0463-4401-9359-eedca6f9c174', 'payment_confirmation', 'email', 'Payment Confirmation', 'Payment Confirmation', '\n          <h1>Payment Confirmation</h1>\n          <p>Dear {{name}},</p>\n          <p>Your payment has been confirmed. Here are the details:</p>\n          <ul>\n            <li>Amount: {{amount}}</li>\n            <li>Reference: {{referenceNumber}}</li>\n            <li>Date: {{date}}</li>\n          </ul>\n          <p>Thank you for your payment!</p>\n          <p>Best regards,<br>The Team</p>\n        ', NULL, 1, 1, 'payment', '2025-06-25 23:57:06.787', '2025-06-25 23:57:06.787', '0e971fe1-d22a-446e-9fb9-f52149e29df3', NULL),
('8c6d6dd2-1b5d-4aab-9441-2ac03afe6711', 'payment_failed', 'email', 'Payment Failed', 'Payment Failed', '\n          <h1>Payment Failed</h1>\n          <p>Dear {{name}},</p>\n          <p>We were unable to process your payment. Here are the details:</p>\n          <ul>\n            <li>Amount: {{amount}}</li>\n            <li>Reference: {{referenceNumber}}</li>\n            <li>Error: {{error}}</li>\n          </ul>\n          <p>Please try again or contact support if the issue persists.</p>\n          <p>Best regards,<br>The Team</p>\n        ', NULL, 1, 1, 'payment', '2025-06-25 23:57:06.800', '2025-06-25 23:57:06.800', '0e971fe1-d22a-446e-9fb9-f52149e29df3', NULL),
('85bdc87e-5680-41a9-9a43-fdd4f218b257', 'payment_reminder', 'email', 'Payment Reminder', 'Payment Reminder', '\n          <h1>Payment Reminder</h1>\n          <p>Dear {{name}},</p>\n          <p>This is a reminder that your payment is due. Here are the details:</p>\n          <ul>\n            <li>Amount: {{amount}}</li>\n            <li>Due Date: {{dueDate}}</li>\n            <li>Days Remaining: {{daysRemaining}}</li>\n          </ul>\n          <p>Please complete your payment to maintain your enrollment.</p>\n          <p>Best regards,<br>The Team</p>\n        ', NULL, 1, 1, 'payment', '2025-06-25 23:57:06.807', '2025-06-25 23:57:06.807', '0e971fe1-d22a-446e-9fb9-f52149e29df3', NULL),
('4073a636-6f37-4061-bbeb-a589e780427b', 'course_enrollment', 'email', 'Course Enrollment Confirmation', 'Course Enrollment Confirmation', '\n          <h1>Course Enrollment Confirmation</h1>\n          <p>Dear {{name}},</p>\n          <p>You have been successfully enrolled in the course: <strong>{{courseName}}</strong></p>\n          <p>Course details:</p>\n          <ul>\n            <li>Institution: {{institutionName}}</li>\n            <li>Duration: {{duration}}</li>\n            <li>Start Date: {{startDate}}</li>\n          </ul>\n          <p>You can now access your course materials and begin learning!</p>\n          <p>Best regards,<br>The Team</p>\n        ', NULL, 1, 1, 'course', '2025-06-25 23:57:06.815', '2025-06-25 23:57:06.815', '0e971fe1-d22a-446e-9fb9-f52149e29df3', NULL),
('f2650865-4ae1-4494-b41d-2c1c845efc34', 'course_completion', 'email', 'Course Completion Certificate', 'Course Completion Certificate', '\n          <h1>Congratulations on Completing Your Course!</h1>\n          <p>Dear {{name}},</p>\n          <p>Congratulations! You have successfully completed the course: <strong>{{courseName}}</strong></p>\n          <p>Your final score: {{score}}%</p>\n          <p>You can download your certificate from your dashboard.</p>\n          <p>Keep up the great work!</p>\n          <p>Best regards,<br>The Team</p>\n        ', NULL, 1, 1, 'course', '2025-06-25 23:57:06.819', '2025-06-25 23:57:06.819', '0e971fe1-d22a-446e-9fb9-f52149e29df3', NULL),
('7cea22c3-df9a-445c-82f2-bfd8d784c1ee', 'quiz_reminder', 'email', 'Quiz Reminder', 'Quiz Reminder', '\n          <h1>Quiz Reminder</h1>\n          <p>Dear {{name}},</p>\n          <p>This is a reminder that you have a quiz due: <strong>{{quizName}}</strong></p>\n          <p>Quiz details:</p>\n          <ul>\n            <li>Module: {{moduleName}}</li>\n            <li>Due Date: {{dueDate}}</li>\n            <li>Time Limit: {{timeLimit}} minutes</li>\n          </ul>\n          <p>Please complete the quiz to continue your progress.</p>\n          <p>Best regards,<br>The Team</p>\n        ', NULL, 1, 1, 'course', '2025-06-25 23:57:06.821', '2025-06-25 23:57:06.821', '0e971fe1-d22a-446e-9fb9-f52149e29df3', NULL),
('b8d7d79e-3c54-4f8b-8960-82433bae41cc', 'commission_earned', 'email', 'Commission Earned - {{institutionName}}', 'Commission Earned', '\n      <h1>Commission Earned</h1>\n      <p>Dear {{institutionName}},</p>\n      <p>Congratulations! You have earned a commission from a student enrollment.</p>\n      <p>Commission details:</p>\n      <ul>\n        <li>Student: {{studentName}}</li>\n        <li>Course: {{courseName}}</li>\n        <li>Enrollment Amount: {{enrollmentAmount}}</li>\n        <li>Commission Rate: {{commissionRate}}%</li>\n        <li>Commission Amount: {{commissionAmount}}</li>\n        <li>Date: {{date}}</li>\n      </ul>\n      <p>Your commission will be processed and added to your next payout.</p>\n      <p>Best regards,<br>The Platform Team</p>\n    ', NULL, 1, 1, 'commission', '2025-07-06 21:59:16.787', '2025-07-07 01:46:57.055', '0e971fe1-d22a-446e-9fb9-f52149e29df3', NULL),
('be373c88-111d-42f2-8686-186cea51f740', 'commission_payout', 'email', 'Commission Payout - {{institutionName}}', 'Commission Payout', '\n      <h1>Commission Payout</h1>\n      <p>Dear {{institutionName}},</p>\n      <p>Your commission payout has been processed successfully.</p>\n      <p>Payout details:</p>\n      <ul>\n        <li>Payout Amount: {{payoutAmount}}</li>\n        <li>Period: {{startDate}} to {{endDate}}</li>\n        <li>Total Commissions: {{totalCommissions}}</li>\n        <li>Transaction ID: {{transactionId}}</li>\n        <li>Date: {{date}}</li>\n      </ul>\n      <p>The funds should appear in your account within 3-5 business days.</p>\n      <p>Best regards,<br>The Platform Team</p>\n    ', NULL, 1, 1, 'commission', '2025-07-06 21:59:17.808', '2025-07-07 01:46:59.880', '0e971fe1-d22a-446e-9fb9-f52149e29df3', NULL),
('4a7e7be8-df14-4ea3-a169-4b44fd855d10', 'commission_rate_changed', 'email', 'Commission Rate Updated - {{institutionName}}', 'Commission Rate Updated', '\n      <h1>Commission Rate Updated</h1>\n      <p>Dear {{institutionName}},</p>\n      <p>Your commission rate has been updated by the platform administrator.</p>\n      <p>Rate change details:</p>\n      <ul>\n        <li>Previous Rate: {{oldRate}}%</li>\n        <li>New Rate: {{newRate}}%</li>\n        <li>Effective Date: {{effectiveDate}}</li>\n        <li>Reason: {{reason}}</li>\n      </ul>\n      <p>This change will apply to all future enrollments.</p>\n      <p>Best regards,<br>The Platform Team</p>\n    ', NULL, 1, 1, 'commission', '2025-07-06 21:59:17.813', '2025-07-07 01:46:59.885', '0e971fe1-d22a-446e-9fb9-f52149e29df3', NULL),
('b9fcf663-8620-4d0f-96ef-7acc0b9dd5c3', 'subscription_renewal_reminder', 'email', 'Subscription Renewal Reminder - {{institutionName}}', 'Subscription Renewal Reminder', '\n      <h1>Subscription Renewal Reminder</h1>\n      <p>Dear {{institutionName}},</p>\n      <p>This is a friendly reminder that your subscription will renew soon.</p>\n      <p>Subscription details:</p>\n      <ul>\n        <li>Current Plan: {{planName}}</li>\n        <li>Renewal Date: {{renewalDate}}</li>\n        <li>Amount: {{amount}}</li>\n        <li>Days Remaining: {{daysRemaining}}</li>\n      </ul>\n      <p>Your subscription will automatically renew unless cancelled before the renewal date.</p>\n      <p>Best regards,<br>The Platform Team</p>\n    ', NULL, 1, 1, 'subscription', '2025-07-06 21:59:17.818', '2025-07-07 01:46:59.901', '0e971fe1-d22a-446e-9fb9-f52149e29df3', NULL),
('5300dd46-dd06-4296-b5a0-a2a9b49879fb', 'subscription_expired', 'email', 'Subscription Expired - {{institutionName}}', 'Subscription Expired', '\n      <h1>Subscription Expired</h1>\n      <p>Dear {{institutionName}},</p>\n      <p>Your subscription has expired. Some features may be limited until you renew.</p>\n      <p>Subscription details:</p>\n      <ul>\n        <li>Previous Plan: {{planName}}</li>\n        <li>Expired Date: {{expiredDate}}</li>\n        <li>Renewal Amount: {{amount}}</li>\n      </ul>\n      <p>Please renew your subscription to continue enjoying all platform features.</p>\n      <p>Best regards,<br>The Platform Team</p>\n    ', NULL, 1, 1, 'subscription', '2025-07-06 21:59:17.875', '2025-07-07 01:46:59.963', '0e971fe1-d22a-446e-9fb9-f52149e29df3', NULL),
('3ae0a2e1-7767-48be-8280-d3e169babf9f', 'subscription_upgraded', 'email', 'Subscription Upgraded - {{institutionName}}', 'Subscription Upgraded', '\n      <h1>Subscription Upgraded</h1>\n      <p>Dear {{institutionName}},</p>\n      <p>Your subscription has been successfully upgraded!</p>\n      <p>Upgrade details:</p>\n      <ul>\n        <li>New Plan: {{newPlanName}}</li>\n        <li>Previous Plan: {{oldPlanName}}</li>\n        <li>Upgrade Amount: {{upgradeAmount}}</li>\n        <li>Effective Date: {{effectiveDate}}</li>\n        <li>New Features: {{newFeatures}}</li>\n      </ul>\n      <p>You now have access to additional features and benefits.</p>\n      <p>Best regards,<br>The Platform Team</p>\n    ', NULL, 1, 1, 'subscription', '2025-07-06 21:59:17.881', '2025-07-07 01:47:00.011', '0e971fe1-d22a-446e-9fb9-f52149e29df3', NULL),
('3e7a8198-c568-4544-90dd-0f24b4a2cab7', 'subscription_downgraded', 'email', 'Subscription Downgraded - {{institutionName}}', 'Subscription Downgraded', '\n      <h1>Subscription Downgraded</h1>\n      <p>Dear {{institutionName}},</p>\n      <p>Your subscription has been downgraded as requested.</p>\n      <p>Downgrade details:</p>\n      <ul>\n        <li>New Plan: {{newPlanName}}</li>\n        <li>Previous Plan: {{oldPlanName}}</li>\n        <li>Effective Date: {{effectiveDate}}</li>\n        <li>Changes: {{changes}}</li>\n      </ul>\n      <p>Some features may no longer be available. You can upgrade again anytime.</p>\n      <p>Best regards,<br>The Platform Team</p>\n    ', NULL, 1, 1, 'subscription', '2025-07-06 21:59:17.885', '2025-07-07 01:47:00.094', '0e971fe1-d22a-446e-9fb9-f52149e29df3', NULL),
('fa020a36-a804-46cf-bd1d-06b00edcd9b2', 'subscription_payment_failed', 'email', 'Subscription Payment Failed - {{institutionName}}', 'Subscription Payment Failed', '\n      <h1>Subscription Payment Failed</h1>\n      <p>Dear {{institutionName}},</p>\n      <p>We were unable to process your subscription payment.</p>\n      <p>Payment details:</p>\n      <ul>\n        <li>Plan: {{planName}}</li>\n        <li>Amount: {{amount}}</li>\n        <li>Due Date: {{dueDate}}</li>\n        <li>Error: {{error}}</li>\n      </ul>\n      <p>Please update your payment method to avoid service interruption.</p>\n      <p>Best regards,<br>The Platform Team</p>\n    ', NULL, 1, 1, 'subscription', '2025-07-06 21:59:17.898', '2025-07-07 01:47:00.150', '0e971fe1-d22a-446e-9fb9-f52149e29df3', NULL),
('6ac7abc6-cba0-4ddc-8a5d-5895dafbbf63', 'quiz_passed', 'email', 'Quiz Passed!', 'Quiz Passed!', '\n      <h1>Congratulations! You Passed the Quiz</h1>\n      <p>Dear {{name}},</p>\n      <p>Great job! You\'ve successfully passed the quiz: <strong>{{quizName}}</strong></p>\n      <p>Quiz details:</p>\n      <ul>\n        <li>Module: {{moduleName}}</li>\n        <li>Course: {{courseName}}</li>\n        <li>Score: {{score}}</li>\n        <li>Questions: {{totalQuestions}}</li>\n        <li>Correct Answers: {{correctAnswers}}</li>\n        <li>Time Taken: {{timeTaken}}</li>\n      </ul>\n      <p>Keep up the excellent work!</p>\n      <p>Best regards,<br>The Team</p>\n    ', NULL, 1, 1, 'course', '2025-07-12 21:58:25.087', '2025-07-12 21:58:25.087', 'SYSTEM', NULL),
('71e30019-0fcf-45df-8bd6-757fa6b872de', 'quiz_failed', 'email', 'Quiz Result - Keep Learning!', 'Quiz Result - Keep Learning!', '\n      <h1>Quiz Result</h1>\n      <p>Dear {{name}},</p>\n      <p>You\'ve completed the quiz: <strong>{{quizName}}</strong></p>\n      <p>Quiz details:</p>\n      <ul>\n        <li>Module: {{moduleName}}</li>\n        <li>Course: {{courseName}}</li>\n        <li>Score: {{score}}</li>\n        <li>Questions: {{totalQuestions}}</li>\n        <li>Correct Answers: {{correctAnswers}}</li>\n        <li>Time Taken: {{timeTaken}}</li>\n      </ul>\n      <p>Don\'t worry! You can retake the quiz to improve your score. Review the module content and try again.</p>\n      <p>Best regards,<br>The Team</p>\n    ', NULL, 1, 1, 'course', '2025-07-12 21:58:25.113', '2025-07-12 21:58:25.113', 'SYSTEM', NULL),
('cbda2c5c-9bc9-4a9c-85cf-45cab06b087a', 'achievement_unlocked', 'email', 'Achievement Unlocked!', 'Achievement Unlocked!', '\n      <h1>🎉 Achievement Unlocked!</h1>\n      <p>Dear {{name}},</p>\n      <p>Congratulations! You\'ve earned a new achievement:</p>\n      <div style=\"background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;\">\n        <h2 style=\"color: #0066cc; margin-top: 0;\">{{achievementName}}</h2>\n        <p><strong>Description:</strong> {{achievementDescription}}</p>\n        <p><strong>Type:</strong> {{type}}</p>\n        <p><strong>Points Earned:</strong> {{points}}</p>\n      </div>\n      <p>Keep up the great work and continue your learning journey!</p>\n      <p>Best regards,<br>The Team</p>\n    ', NULL, 1, 1, 'achievement', '2025-07-12 21:58:25.126', '2025-07-12 21:58:25.126', 'SYSTEM', NULL),
('bae24e98-3834-4288-a5b1-6ef9b7094e2e', 'subscription_activated', 'email', 'Subscription Activated', 'Subscription Activated', '\n      <h1>Subscription Activated</h1>\n      <p>Dear {{name}},</p>\n      <p>Your subscription has been successfully activated!</p>\n      <p>Subscription details:</p>\n      <ul>\n        <li>Plan: {{planName}}</li>\n        <li>Status: {{newStatus}}</li>\n        <li>Effective Date: {{effectiveDate}}</li>\n      </ul>\n      <p>You now have access to all the features included in your plan.</p>\n      <p>Best regards,<br>The Team</p>\n    ', NULL, 1, 1, 'subscription', '2025-07-12 21:58:25.135', '2025-07-12 21:58:25.135', 'SYSTEM', NULL),
('bc65ff3c-9a67-41f1-bc97-dc59015da1b5', 'subscription_cancelled', 'email', 'Subscription Cancelled', 'Subscription Cancelled', '\n      <h1>Subscription Cancelled</h1>\n      <p>Dear {{name}},</p>\n      <p>Your subscription has been cancelled as requested.</p>\n      <p>Subscription details:</p>\n      <ul>\n        <li>Plan: {{planName}}</li>\n        <li>Previous Status: {{oldStatus}}</li>\n        <li>New Status: {{newStatus}}</li>\n        <li>Effective Date: {{effectiveDate}}</li>\n        <li>Reason: {{reason}}</li>\n      </ul>\n      <p>You will continue to have access until the end of your current billing period.</p>\n      <p>Best regards,<br>The Team</p>\n    ', NULL, 1, 1, 'subscription', '2025-07-12 21:58:25.148', '2025-07-12 21:58:25.148', 'SYSTEM', NULL),
('521fe38b-38fd-442a-9e68-8ff6a16b353b', 'subscription_past_due', 'email', 'Payment Past Due', 'Payment Past Due', '\n      <h1>Payment Past Due</h1>\n      <p>Dear {{name}},</p>\n      <p>Your subscription payment is past due.</p>\n      <p>Subscription details:</p>\n      <ul>\n        <li>Plan: {{planName}}</li>\n        <li>Previous Status: {{oldStatus}}</li>\n        <li>New Status: {{newStatus}}</li>\n        <li>Effective Date: {{effectiveDate}}</li>\n      </ul>\n      <p>Please update your payment method to avoid service interruption.</p>\n      <p>Best regards,<br>The Team</p>\n    ', NULL, 1, 1, 'subscription', '2025-07-12 21:58:25.171', '2025-07-12 21:58:25.171', 'SYSTEM', NULL),
('14fbef0f-66bd-4c14-b8b3-7e4d307734a5', 'subscription_trial', 'email', 'Trial Started', 'Trial Started', '\n      <h1>Trial Started</h1>\n      <p>Dear {{name}},</p>\n      <p>Your free trial has started!</p>\n      <p>Subscription details:</p>\n      <ul>\n        <li>Plan: {{planName}}</li>\n        <li>Status: {{newStatus}}</li>\n        <li>Effective Date: {{effectiveDate}}</li>\n      </ul>\n      <p>Enjoy your trial period. You can upgrade to a paid plan at any time.</p>\n      <p>Best regards,<br>The Team</p>\n    ', NULL, 1, 1, 'subscription', '2025-07-12 21:58:25.179', '2025-07-12 21:58:25.179', 'SYSTEM', NULL),
('46df15c7-8b13-4530-92e4-27eaef539d76', 'subscription_update', 'email', 'Subscription Updated', 'Subscription Updated', '\n      <h1>Subscription Updated</h1>\n      <p>Dear {{name}},</p>\n      <p>Your subscription has been updated.</p>\n      <p>Subscription details:</p>\n      <ul>\n        <li>Plan: {{planName}}</li>\n        <li>Previous Status: {{oldStatus}}</li>\n        <li>New Status: {{newStatus}}</li>\n        <li>Effective Date: {{effectiveDate}}</li>\n        <li>Reason: {{reason}}</li>\n      </ul>\n      <p>Best regards,<br>The Team</p>\n    ', NULL, 1, 1, 'subscription', '2025-07-12 21:58:25.187', '2025-07-12 21:58:25.187', 'SYSTEM', NULL),
('f9aa3d75-1322-4b00-95e9-743de10b5ca9', 'account_update', 'email', 'Account Updated', 'Account Updated', '\n      <h1>Account Updated</h1>\n      <p>Dear {{name}},</p>\n      <p>Your account has been updated successfully.</p>\n      <p>Update details:</p>\n      <ul>\n        <li>Update Type: {{updateType}}</li>\n        <li>Update Date: {{updateDate}}</li>\n        <li>Details: {{details}}</li>\n      </ul>\n      <p>If you didn\'t make this change, please contact support immediately.</p>\n      <p>Best regards,<br>The Team</p>\n    ', NULL, 1, 1, 'security', '2025-07-12 21:58:25.208', '2025-07-12 21:58:25.208', 'SYSTEM', NULL),
('96f09017-35ae-4c88-986b-26e9df8c5c01', 'course_payment_reminder', 'email', 'Course Payment Reminder', 'Course Payment Reminder', '\n      <h1>Course Payment Reminder</h1>\n      <p>Dear {{name}},</p>\n      <p>This is a reminder that your course payment is due.</p>\n      <p>Payment details:</p>\n      <ul>\n        <li>Course: {{courseName}}</li>\n        <li>Amount: {{amount}}</li>\n        <li>Due Date: {{dueDate}}</li>\n        <li>Days Remaining: {{daysRemaining}}</li>\n      </ul>\n      <p>Please complete your payment to maintain access to the course.</p>\n      <p>Best regards,<br>The Team</p>\n    ', NULL, 1, 1, 'payment', '2025-07-12 21:58:25.237', '2025-07-12 21:58:25.237', 'SYSTEM', NULL),
('bf4101d1-72bd-41eb-ac02-44376a303e12', 'subscription_payment_reminder', 'email', 'Subscription Payment Reminder', 'Subscription Payment Reminder', '\n      <h1>Subscription Payment Reminder</h1>\n      <p>Dear {{name}},</p>\n      <p>This is a reminder that your subscription payment is due.</p>\n      <p>Payment details:</p>\n      <ul>\n        <li>Plan: {{subscriptionPlan}}</li>\n        <li>Amount: {{amount}}</li>\n        <li>Due Date: {{dueDate}}</li>\n        <li>Days Remaining: {{daysRemaining}}</li>\n      </ul>\n      <p>Please update your payment method to avoid service interruption.</p>\n      <p>Best regards,<br>The Team</p>\n    ', NULL, 1, 1, 'payment', '2025-07-12 21:58:25.255', '2025-07-12 21:58:25.255', 'SYSTEM', NULL),
('f313c30f-dc81-497e-ad4b-c361af5f128e', 'module_completion', 'email', 'Module Completed!', 'Module Completed!', '\n      <h1>Module Completed!</h1>\n      <p>Dear {{name}},</p>\n      <p>Congratulations! You\'ve completed the module: <strong>{{moduleName}}</strong></p>\n      <p>Module details:</p>\n      <ul>\n        <li>Course: {{courseName}}</li>\n        <li>Progress: {{progress}}</li>\n        <li>Content Completed: {{completedContent}}/{{totalContent}}</li>\n      </ul>\n      <p>Keep up the great work!</p>\n      <p>Best regards,<br>The Team</p>\n    ', NULL, 1, 1, 'course', '2025-07-12 21:58:25.261', '2025-07-12 21:58:25.261', 'SYSTEM', NULL),
('0c6917cb-65e9-419b-8fee-56fb1c2b2ef8', 'learning_streak', 'email', 'Learning Streak Milestone!', 'Learning Streak Milestone!', '\n      <h1>🔥 Learning Streak Milestone!</h1>\n      <p>Dear {{name}},</p>\n      <p>Amazing! You\'ve reached a learning streak milestone!</p>\n      <p>Streak details:</p>\n      <ul>\n        <li>Current Streak: {{currentStreak}} days</li>\n        <li>Previous Best: {{previousStreak}} days</li>\n        <li>Milestone: {{milestone}} days</li>\n      </ul>\n      <p>Keep the momentum going! Consistency is key to learning success.</p>\n      <p>Best regards,<br>The Team</p>\n    ', NULL, 1, 1, 'achievement', '2025-07-12 21:58:25.269', '2025-07-12 21:58:25.269', 'SYSTEM', NULL),
('24171c30-3a8b-4c2f-9fe2-1cc04246bf9e', 'refund_confirmation', 'email', 'Refund Confirmation', 'Refund Confirmation', '\n      <h1>Refund Confirmation</h1>\n      <p>Dear {{name}},</p>\n      <p>Your refund has been processed successfully.</p>\n      <p>Refund details:</p>\n      <ul>\n        <li>Original Amount: {{originalAmount}}</li>\n        <li>Refund Amount: {{refundAmount}}</li>\n        <li>Reference: {{referenceNumber}}</li>\n        <li>Course: {{courseName}}</li>\n        <li>Refund Date: {{refundedAt}}</li>\n      </ul>\n      <p>The refund will be credited to your original payment method within 5-10 business days.</p>\n      <p>Best regards,<br>The Team</p>\n    ', NULL, 1, 1, 'payment', '2025-07-12 22:07:45.534', '2025-07-12 22:07:45.534', 'SYSTEM', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `paidAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `metadata` json DEFAULT NULL,
  `institutionId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `enrollmentId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `commissionAmount` double NOT NULL DEFAULT '0',
  `institutionAmount` double NOT NULL,
  `payoutId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentMethod` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referenceNumber` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `idempotencyKey` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stateVersion` int NOT NULL DEFAULT '1',
  `version` int NOT NULL DEFAULT '1',
  `currency` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `paymentId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refundAmount` double DEFAULT NULL,
  `refundedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payments_idempotencyKey_key` (`idempotencyKey`),
  KEY `payments_institutionId_idx` (`institutionId`),
  KEY `payments_enrollmentId_idx` (`enrollmentId`),
  KEY `payments_payoutId_idx` (`payoutId`),
  KEY `payments_status_idx` (`status`),
  KEY `payments_createdAt_idx` (`createdAt`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `amount`, `status`, `paidAt`, `createdAt`, `updatedAt`, `metadata`, `institutionId`, `enrollmentId`, `commissionAmount`, `institutionAmount`, `payoutId`, `paymentMethod`, `referenceNumber`, `notes`, `idempotencyKey`, `stateVersion`, `version`, `currency`, `paymentId`, `refundAmount`, `refundedAt`) VALUES
('cmcjfsy950004hfzgaln59igb', 2430, 'COMPLETED', '2025-07-14 01:54:43.371', '2025-06-30 18:33:20.490', '2025-07-14 01:54:43.452', '{\"type\": \"COURSE_ENROLLMENT\", \"bookingId\": \"aca07f00-f420-4e10-a287-79e6aea6dcf6\", \"updatedAt\": \"2025-06-30T18:33:32.836Z\", \"approvedAt\": \"2025-07-14T01:54:43.371Z\", \"approvedBy\": \"0e971fe1-d22a-446e-9fb9-f52149e29df3\", \"courseTitle\": \"Cambridge Exams Preparation - CPE\", \"paymentMethod\": \"BANK_TRANSFER\", \"commissionRate\": 18, \"approvedByAdmin\": true, \"institutionName\": \"ABC Shool of English\", \"commissionAmount\": 437.4, \"institutionAmount\": 1992.6}', 'c5962019-07ca-4a78-a97f-3cf394e5bf94', 'cmcjfsy7x0002hfzgyyaxhx3y', 437.4, 1992.6, NULL, 'BANK_TRANSFER', NULL, NULL, '3bd3f8e2-d566-4b13-b924-35f0c59e8389', 1, 1, 'USD', NULL, NULL, NULL),
('cmc9nqqba000bnfpudhezlj5t', 11200, 'COMPLETED', '2025-06-23 22:21:53.046', '2025-06-23 22:17:52.054', '2025-06-23 22:21:53.048', '{\"type\": \"COURSE_ENROLLMENT\", \"bookingId\": \"ec0af15d-517a-4ca5-aeb9-87b6a6eea36d\", \"updatedAt\": \"2025-06-23T22:18:07.528Z\", \"approvedAt\": \"2025-06-23T22:21:53.046Z\", \"approvedBy\": \"0e971fe1-d22a-446e-9fb9-f52149e29df3\", \"courseTitle\": \"English for Academic Purposes\", \"paymentMethod\": \"OFFLINE\", \"commissionRate\": 30, \"approvedByAdmin\": true, \"institutionName\": \"ABC Shool of English\", \"commissionAmount\": 3360, \"institutionAmount\": 7840}', 'c5962019-07ca-4a78-a97f-3cf394e5bf94', 'cmc9nqqaf0009nfpuade5uuis', 3360, 7840, NULL, 'OFFLINE', NULL, NULL, 'e6ec26c1-5106-4069-9bfe-5cf1c7631300', 1, 1, 'USD', NULL, NULL, NULL),
('cmcd9i1to0004wifrjv8g1pio', 2750, 'COMPLETED', '2025-06-26 10:57:39.178', '2025-06-26 10:50:17.148', '2025-06-26 10:57:39.181', '{\"type\": \"COURSE_ENROLLMENT\", \"bookingId\": \"a5badc1a-bd86-47e8-ab57-21242c846c9b\", \"updatedAt\": \"2025-06-26T10:53:37.877Z\", \"approvedAt\": \"2025-06-26T10:57:39.178Z\", \"approvedBy\": \"0e971fe1-d22a-446e-9fb9-f52149e29df3\", \"courseTitle\": \"Business English\", \"paymentMethod\": \"OFFLINE\", \"commissionRate\": 20, \"approvedByAdmin\": true, \"institutionName\": \"XYZ Language School\", \"commissionAmount\": 550, \"institutionAmount\": 2200}', '42308252-a934-4eef-b663-37a7076bb177', 'cmcd9i1td0002wifriuxiimz4', 550, 2200, NULL, 'OFFLINE', NULL, NULL, '3d0001e4-772a-42e6-a06d-2a3f81986d95', 1, 1, 'USD', NULL, NULL, NULL),
('cmdfxjuwy0004b4ejpngmhslp', 3500, 'COMPLETED', '2025-08-08 16:56:10.935', '2025-07-23 12:18:46.978', '2025-08-08 16:56:10.937', '{\"type\": \"COURSE_ENROLLMENT\", \"bookingId\": \"dec75da4-2aa7-491e-ae5d-4b82a107cc3c\", \"approvedAt\": \"2025-08-08T16:56:10.935Z\", \"approvedBy\": \"0e971fe1-d22a-446e-9fb9-f52149e29df3\", \"courseTitle\": \"One-to-One English\", \"commissionRate\": 20, \"approvedByAdmin\": true, \"institutionName\": \"XYZ Language School\", \"commissionAmount\": 700, \"institutionAmount\": 2800}', '42308252-a934-4eef-b663-37a7076bb177', 'cmdfxjuwr0002b4ejo5suxfwp', 700, 2800, NULL, NULL, NULL, NULL, '2a0f4ea8-6e96-4b75-8cff-7481d0e5bfe9', 1, 1, 'USD', NULL, NULL, NULL),
('cmdfxzd0r0009b4ej9zqv3gem', 740, 'PROCESSING', NULL, '2025-07-23 12:30:50.284', '2025-07-23 23:50:33.388', '{\"type\": \"COURSE_ENROLLMENT\", \"bookingId\": \"e7dd0f1c-5f9a-4992-8303-0f1498d7a6cc\", \"updatedAt\": \"2025-07-23T23:50:33.387Z\", \"courseTitle\": \"Conversation & Pronunciation\", \"paymentMethod\": \"CREDIT_CARD\", \"institutionName\": \"XYZ Language School\"}', '42308252-a934-4eef-b663-37a7076bb177', 'cmdfxzczf0007b4ejk2ggjy0u', 0, 740, NULL, 'CREDIT_CARD', NULL, NULL, '4b7a7dc1-a182-4466-8abd-9ffe244d3df7', 1, 1, 'USD', NULL, NULL, NULL),
('cmdg69v5q00049kkx923r1o0a', 1360, 'COMPLETED', '2025-08-08 16:14:55.096', '2025-07-23 16:22:57.278', '2025-08-08 16:14:55.135', '{\"type\": \"COURSE_ENROLLMENT\", \"bookingId\": \"895800ac-ede6-452c-b28c-da240c405b2f\", \"approvedAt\": \"2025-08-08T16:14:55.096Z\", \"approvedBy\": \"0e971fe1-d22a-446e-9fb9-f52149e29df3\", \"courseTitle\": \"General English\", \"commissionRate\": 18, \"approvedByAdmin\": true, \"institutionName\": \"ABC Shool of English\", \"commissionAmount\": 244.8, \"institutionAmount\": 1115.2}', 'c5962019-07ca-4a78-a97f-3cf394e5bf94', 'cmdg69uuh00029kkxm7wbnam0', 244.8, 1115.2, NULL, NULL, NULL, NULL, 'cfaf5e48-90e9-4174-bd5d-7f41a914f039', 1, 1, 'USD', NULL, NULL, NULL),
('cmeascn2a000s49m9ctpt9r9f', 99.99, 'COMPLETED', '2025-08-14 02:34:03.585', '2025-08-14 02:34:03.586', '2025-08-14 02:34:03.586', '{\"type\": \"COURSE_ENROLLMENT\", \"courseTitle\": \"Global English Mastery - Live Platform Course\", \"institutionName\": \"Test Language Institute\", \"subscriptionPlan\": \"PREMIUM\", \"isSubscriptionBased\": true}', 'f3346c7f-1b4a-4a11-8eeb-5e943c98c9ea', 'cmeascn27000r49m9wt4jyg8k', 0, 99.99, NULL, 'SUBSCRIPTION', NULL, NULL, NULL, 1, 1, 'USD', 'SUB_1755138843585_yqq7c1upc', NULL, NULL),
('cmeat1fb9001949m9q69gy7ro', 99.99, 'COMPLETED', '2025-08-14 02:53:19.940', '2025-08-14 02:53:19.942', '2025-08-14 02:53:19.942', '{\"type\": \"COURSE_ENROLLMENT\", \"courseTitle\": \"Global English Mastery - Live Platform Course\", \"institutionName\": \"Test Language Institute\", \"subscriptionPlan\": \"PREMIUM\", \"isSubscriptionBased\": true}', 'f3346c7f-1b4a-4a11-8eeb-5e943c98c9ea', 'cmeat1fb7001849m9xatoysda', 0, 99.99, NULL, 'SUBSCRIPTION', NULL, NULL, NULL, 1, 1, 'USD', 'SUB_1755139999940_j8vy9jg2k', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pending_websocket_notifications`
--

DROP TABLE IF EXISTS `pending_websocket_notifications`;
CREATE TABLE IF NOT EXISTS `pending_websocket_notifications` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` json NOT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `sent` tinyint(1) NOT NULL DEFAULT '0',
  `sentAt` datetime(3) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pending_websocket_notifications_userId_idx` (`userId`),
  KEY `pending_websocket_notifications_sent_idx` (`sent`),
  KEY `pending_websocket_notifications_timestamp_idx` (`timestamp`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `promotional_items`
--

DROP TABLE IF EXISTS `promotional_items`;
CREATE TABLE IF NOT EXISTS `promotional_items` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageUrl` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ctaText` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ctaLink` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `students` int DEFAULT NULL,
  `courses` int DEFAULT NULL,
  `rating` double DEFAULT NULL,
  `priority` int NOT NULL DEFAULT '0',
  `isSponsored` tinyint(1) NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `designConfigId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdBy` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `badge` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `promotional_items_designConfigId_fkey` (`designConfigId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `question_banks`
--

DROP TABLE IF EXISTS `question_banks`;
CREATE TABLE IF NOT EXISTS `question_banks` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `question_banks_created_by_idx` (`created_by`),
  KEY `question_banks_category_idx` (`category`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `question_bank_items`
--

DROP TABLE IF EXISTS `question_bank_items`;
CREATE TABLE IF NOT EXISTS `question_bank_items` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `addedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `addedBy` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderIndex` int NOT NULL DEFAULT '0',
  `questionBankId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `questionId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `question_bank_items_questionBankId_questionId_key` (`questionBankId`,`questionId`),
  KEY `question_bank_items_questionBankId_idx` (`questionBankId`),
  KEY `question_bank_items_questionId_idx` (`questionId`),
  KEY `question_bank_items_addedBy_fkey` (`addedBy`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `question_options`
--

DROP TABLE IF EXISTS `question_options`;
CREATE TABLE IF NOT EXISTS `question_options` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `question_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `option_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `media_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_index` int NOT NULL DEFAULT '0',
  `is_correct` tinyint(1) NOT NULL DEFAULT '0',
  `points` int NOT NULL DEFAULT '0',
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `question_options_question_id_idx` (`question_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `question_templates`
--

DROP TABLE IF EXISTS `question_templates`;
CREATE TABLE IF NOT EXISTS `question_templates` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type` enum('MULTIPLE_CHOICE','FILL_IN_BLANK','MATCHING','SHORT_ANSWER','TRUE_FALSE','ESSAY','DRAG_AND_DROP','HOTSPOT') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `template_config` json NOT NULL,
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `difficulty` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MEDIUM',
  `tags` json DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `version` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `question_templates_created_by_idx` (`created_by`),
  KEY `question_templates_type_idx` (`type`),
  KEY `question_templates_category_idx` (`category`),
  KEY `question_templates_version_idx` (`version`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `question_template_suggestions`
--

DROP TABLE IF EXISTS `question_template_suggestions`;
CREATE TABLE IF NOT EXISTS `question_template_suggestions` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `confidence` double NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `implementedAt` datetime(3) DEFAULT NULL,
  `reviewedAt` datetime(3) DEFAULT NULL,
  `reviewedBy` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `suggestedChanges` json NOT NULL,
  `suggestionType` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `templateId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `question_template_suggestions_status_idx` (`status`),
  KEY `question_template_suggestions_templateId_idx` (`templateId`),
  KEY `question_template_suggestions_reviewedBy_idx` (`reviewedBy`),
  KEY `question_template_suggestions_createdAt_idx` (`createdAt`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `question_template_usage`
--

DROP TABLE IF EXISTS `question_template_usage`;
CREATE TABLE IF NOT EXISTS `question_template_usage` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `customizationLevel` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none',
  `institutionId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `metadata` json DEFAULT NULL,
  `targetQuestionBankId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `templateId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `usageContext` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `usedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `usedBy` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `question_template_usage_templateId_idx` (`templateId`),
  KEY `question_template_usage_usedBy_idx` (`usedBy`),
  KEY `question_template_usage_institutionId_idx` (`institutionId`),
  KEY `question_template_usage_usageContext_idx` (`usageContext`),
  KEY `question_template_usage_usedAt_idx` (`usedAt`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `question_template_versions`
--

DROP TABLE IF EXISTS `question_template_versions`;
CREATE TABLE IF NOT EXISTS `question_template_versions` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `changes` json NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdBy` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `templateId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `versionNumber` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `question_template_versions_templateId_versionNumber_key` (`templateId`,`versionNumber`),
  KEY `question_template_versions_templateId_idx` (`templateId`),
  KEY `question_template_versions_createdBy_idx` (`createdBy`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

DROP TABLE IF EXISTS `quizzes`;
CREATE TABLE IF NOT EXISTS `quizzes` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `module_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `passing_score` int NOT NULL,
  `time_limit` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `mediaUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `allow_retry` tinyint(1) NOT NULL DEFAULT '1',
  `average_score` double NOT NULL DEFAULT '0',
  `average_time` double NOT NULL DEFAULT '0',
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `difficulty` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MEDIUM',
  `instructions` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `max_attempts` int NOT NULL DEFAULT '3',
  `quiz_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'STANDARD',
  `show_explanations` tinyint(1) NOT NULL DEFAULT '0',
  `show_results` tinyint(1) NOT NULL DEFAULT '1',
  `shuffle_questions` tinyint(1) NOT NULL DEFAULT '0',
  `success_rate` double NOT NULL DEFAULT '0',
  `tags` json DEFAULT NULL,
  `total_attempts` int NOT NULL DEFAULT '0',
  `total_completions` int NOT NULL DEFAULT '0',
  `adaptive_config` json DEFAULT NULL,
  `initial_ability` double NOT NULL DEFAULT '0',
  `max_questions` int NOT NULL DEFAULT '20',
  `min_questions` int NOT NULL DEFAULT '5',
  `target_precision` double NOT NULL DEFAULT '0.3',
  PRIMARY KEY (`id`),
  KEY `idx_quizzes_module_id` (`module_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `quizzes`
--

INSERT INTO `quizzes` (`id`, `module_id`, `title`, `description`, `passing_score`, `time_limit`, `created_at`, `updated_at`, `mediaUrl`, `allow_retry`, `average_score`, `average_time`, `category`, `difficulty`, `instructions`, `max_attempts`, `quiz_type`, `show_explanations`, `show_results`, `shuffle_questions`, `success_rate`, `tags`, `total_attempts`, `total_completions`, `adaptive_config`, `initial_ability`, `max_questions`, `min_questions`, `target_precision`) VALUES
('fb47e6fb-4fb7-49b0-b557-8ab39306732a', '2070f139-4946-11f0-9f87-0a0027000007', 'Sample Listening Test', 'Listen to four people talking about things they did and now regret. For questions 1–8, choose the correct answer (A, B, or C).', 70, 5, '2025-06-18 16:34:13', '2025-06-19 11:11:00', NULL, 1, 0, 0, NULL, 'MEDIUM', NULL, 3, 'STANDARD', 0, 1, 0, 0, NULL, 0, 0, '{\"enabled\": false, \"max_questions\": 20, \"min_questions\": 5, \"initial_ability\": 0, \"target_precision\": 0.3}', 0, 20, 5, 0.3),
('888aa4a2-8b4b-4443-95c7-0d491711c098', '7c2b5c61-6ff2-46e6-bff7-5507ce3ad1ab', 'Test Adaptive Quiz - Mathematics', 'A comprehensive adaptive quiz to test the IRT-based system', 70, 30, '2025-06-19 11:17:50', '2025-06-19 11:17:50', NULL, 1, 0, 0, 'Mathematics', 'MEDIUM', 'This quiz will adapt to your skill level. Answer each question to the best of your ability.', 3, 'ADAPTIVE', 1, 1, 0, 0, NULL, 0, 0, '{\"enabled\": true, \"max_questions\": 15, \"min_questions\": 5, \"initial_ability\": 0, \"target_precision\": 0.3}', 0, 15, 5, 0.3),
('8bc8ad6c-db4c-44dd-bbbc-4825c76b5339', '7c2b5c61-6ff2-46e6-bff7-5507ce3ad1ab', 'Test Adaptive Quiz - Mathematics', 'A comprehensive adaptive quiz to test the IRT-based system', 70, 30, '2025-06-19 11:18:57', '2025-06-19 11:18:57', NULL, 1, 0, 0, 'Mathematics', 'MEDIUM', 'This quiz will adapt to your skill level. Answer each question to the best of your ability.', 3, 'ADAPTIVE', 1, 1, 0, 0, NULL, 0, 0, '{\"enabled\": true, \"max_questions\": 15, \"min_questions\": 5, \"initial_ability\": 0, \"target_precision\": 0.3}', 0, 15, 5, 0.3),
('test-quiz-id', '2070f9bd-4946-11f0-9f87-0a0027000007', 'Test Quiz', 'Test quiz for API testing', 70, 30, '2025-06-19 22:52:13', '2025-06-19 22:52:13', NULL, 1, 0, 0, NULL, 'MEDIUM', NULL, 3, 'STANDARD', 0, 1, 0, 0, NULL, 0, 0, NULL, 0, 20, 5, 0.3),
('91194b83-0fb5-425b-9f1a-9467e5e3ad0a', 'eb1a6d58-7fde-4abc-92c4-2615f3ebfc96', '🔍 Describing Data & Trends', 'An adaptive quiz designed to test the learning objectives of Module 4: Describing Data & Trends. It adjusts in difficulty based on the learner’s performance. \n✅ The quiz targets:\nInterpreting and describing data\nUsing comparative structures and trend-related vocabulary\nApplying accurate grammar in context\n\n✅ Instructions:\nBegin at Level 1.\nIf the student answers correctly, move to the next level.\nIf incorrect, repeat a similar question or drop a level (if above Level 1).', 70, 30, '2025-06-20 17:10:11', '2025-06-20 17:14:41', NULL, 1, 0, 0, 'Academic', 'MEDIUM', NULL, 3, 'ADAPTIVE', 0, 1, 1, 0, '\"interpreting,describing data,comparative structures,trend-related vocabulary\"', 0, 0, NULL, 0, 20, 5, 0.3),
('daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', '7c2b5c61-6ff2-46e6-bff7-5507ce3ad1ab', 'Test de Proficience en Français (A1-C2)', 'Un test complet de compétence en français basé sur le cadre européen commun de référence (CEFR)', 70, 60, '2025-07-30 09:39:04', '2025-07-30 09:39:04', NULL, 1, 0, 0, 'French Language', 'MEDIUM', 'Ce test évalue votre niveau de français selon le cadre européen commun de référence (A1-C2). Répondez à toutes les questions du mieux que vous pouvez.', 3, 'STANDARD', 1, 1, 1, 0, '\"[\\\"french\\\",\\\"cefr\\\",\\\"proficiency\\\",\\\"language-test\\\"]\"', 0, 0, NULL, 0, 20, 5, 0.3);

-- --------------------------------------------------------

--
-- Table structure for table `quiz_attempts`
--

DROP TABLE IF EXISTS `quiz_attempts`;
CREATE TABLE IF NOT EXISTS `quiz_attempts` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `score` int NOT NULL,
  `percentage` double NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IN_PROGRESS',
  `ability_estimate` double DEFAULT NULL,
  `adaptive_history` json DEFAULT NULL,
  `attempt_number` int NOT NULL DEFAULT '1',
  `completed_at` timestamp NULL DEFAULT NULL,
  `confidence_level` double DEFAULT NULL,
  `device_info` json DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_adaptive` tinyint(1) NOT NULL DEFAULT '0',
  `passed` tinyint(1) NOT NULL,
  `questions_answered` int NOT NULL DEFAULT '0',
  `quiz_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `started_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `student_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `termination_reason` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `time_spent` int DEFAULT NULL,
  `total_points` int NOT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `idx_quiz_attempts_quiz_id` (`quiz_id`),
  KEY `idx_quiz_attempts_student_id` (`student_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `quiz_attempts`
--

INSERT INTO `quiz_attempts` (`id`, `score`, `percentage`, `status`, `ability_estimate`, `adaptive_history`, `attempt_number`, `completed_at`, `confidence_level`, `device_info`, `ip_address`, `is_adaptive`, `passed`, `questions_answered`, `quiz_id`, `started_at`, `student_id`, `termination_reason`, `time_spent`, `total_points`, `user_agent`) VALUES
('b613422c-00fe-4334-a194-a93475cedce0', 6, 55, 'COMPLETED', NULL, NULL, 1, '2025-06-24 10:56:25', NULL, NULL, NULL, 0, 0, 0, '91194b83-0fb5-425b-9f1a-9467e5e3ad0a', '2025-06-24 10:01:31', '5b5fbd13-8776-4f96-ada9-091973974873', NULL, 178, 11, NULL),
('9bea2efa-19a8-44d8-838b-232997c44e96', 0, 0, 'IN_PROGRESS', NULL, NULL, 2, NULL, NULL, NULL, NULL, 0, 0, 0, '91194b83-0fb5-425b-9f1a-9467e5e3ad0a', '2025-07-23 23:26:18', '5b5fbd13-8776-4f96-ada9-091973974873', NULL, NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `quiz_questions`
--

DROP TABLE IF EXISTS `quiz_questions`;
CREATE TABLE IF NOT EXISTS `quiz_questions` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `quiz_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('MULTIPLE_CHOICE','FILL_IN_BLANK','MATCHING','SHORT_ANSWER','TRUE_FALSE','ESSAY','DRAG_AND_DROP','HOTSPOT') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MULTIPLE_CHOICE',
  `question` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` json DEFAULT NULL,
  `correct_answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `points` int NOT NULL DEFAULT '1',
  `order_index` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `average_time_spent` int NOT NULL DEFAULT '0',
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `difficulty` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MEDIUM',
  `explanation` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `hints` json DEFAULT NULL,
  `success_rate` double NOT NULL DEFAULT '0',
  `tags` json DEFAULT NULL,
  `times_asked` int NOT NULL DEFAULT '0',
  `times_correct` int NOT NULL DEFAULT '0',
  `irt_difficulty` double DEFAULT NULL,
  `irt_discrimination` double DEFAULT NULL,
  `irt_guessing` double DEFAULT NULL,
  `irt_last_updated` timestamp NULL DEFAULT NULL,
  `media_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `media_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `question_config` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_quiz_questions_quiz_id` (`quiz_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `quiz_questions`
--

INSERT INTO `quiz_questions` (`id`, `quiz_id`, `type`, `question`, `options`, `correct_answer`, `points`, `order_index`, `created_at`, `updated_at`, `average_time_spent`, `category`, `difficulty`, `explanation`, `hints`, `success_rate`, `tags`, `times_asked`, `times_correct`, `irt_difficulty`, `irt_discrimination`, `irt_guessing`, `irt_last_updated`, `media_type`, `media_url`, `question_config`) VALUES
('cf2e927e-b8da-4875-b8a6-d11dd5df83f0', 'fb47e6fb-4fb7-49b0-b557-8ab39306732a', 'MULTIPLE_CHOICE', 'Which of these things did Emma do?', '[\"Left home early\", \" Take a train\", \"Made a good impression with her interviewer\"]', 'Left home early', 1, 0, '2025-06-18 16:34:13', '2025-06-19 11:11:00', 0, NULL, 'MEDIUM', NULL, NULL, 0, NULL, 0, 0, 0, 1, 0.25, '2025-06-19 11:11:00', NULL, NULL, NULL),
('641a6dcc-c986-4289-8f3e-141a2bc98147', 'fb47e6fb-4fb7-49b0-b557-8ab39306732a', 'MULTIPLE_CHOICE', 'Which of these things did Emma NOT do?', '[\"Book a taxi\", \"Pack her things in the morning\", \" Reschedule the interview\"]', 'Pack her things in the morning', 1, 1, '2025-06-18 16:34:13', '2025-06-19 11:11:00', 0, NULL, 'MEDIUM', NULL, NULL, 0, NULL, 0, 0, 0, 1, 0.25, '2025-06-19 11:11:00', NULL, NULL, NULL),
('db278538-308b-4628-8ca9-084b84716558', '888aa4a2-8b4b-4443-95c7-0d491711c098', 'MULTIPLE_CHOICE', 'What is 2 + 3?', '\"[\\\"4\\\",\\\"5\\\",\\\"6\\\",\\\"7\\\"]\"', '5', 1, 0, '2025-06-19 11:17:50', '2025-06-19 11:17:50', 0, 'Basic Arithmetic', 'EASY', '2 + 3 = 5. This is basic addition.', '\"[\\\"Count on your fingers\\\",\\\"Think of 2 objects plus 3 objects\\\"]\"', 0, NULL, 0, 0, -1.5, 0.8, 0.25, '2025-06-19 11:17:50', NULL, NULL, NULL),
('95006fbb-da03-48e4-8a6b-80cedc412320', '888aa4a2-8b4b-4443-95c7-0d491711c098', 'TRUE_FALSE', 'Is 10 greater than 5?', 'null', 'true', 1, 1, '2025-06-19 11:17:50', '2025-06-19 11:17:50', 0, 'Number Comparison', 'EASY', 'Yes, 10 is greater than 5.', '\"[\\\"Look at the number line\\\"]\"', 0, NULL, 0, 0, -1.2, 0.7, 0.5, '2025-06-19 11:17:50', NULL, NULL, NULL),
('c82c5653-927c-4afd-9eee-a12429247b94', '8bc8ad6c-db4c-44dd-bbbc-4825c76b5339', 'MULTIPLE_CHOICE', 'What is 2 + 3?', '\"[\\\"4\\\",\\\"5\\\",\\\"6\\\",\\\"7\\\"]\"', '5', 1, 0, '2025-06-19 11:18:58', '2025-06-19 11:18:58', 0, 'Basic Arithmetic', 'EASY', '2 + 3 = 5. This is basic addition.', '\"[\\\"Count on your fingers\\\",\\\"Think of 2 objects plus 3 objects\\\"]\"', 0, NULL, 0, 0, -1.5, 0.8, 0.25, '2025-06-19 11:18:58', NULL, NULL, NULL),
('14f8e7e8-c7f2-4e4e-b8cc-553c7b8042c1', '8bc8ad6c-db4c-44dd-bbbc-4825c76b5339', 'TRUE_FALSE', 'Is 10 greater than 5?', 'null', 'true', 1, 1, '2025-06-19 11:18:58', '2025-06-19 11:18:58', 0, 'Number Comparison', 'EASY', 'Yes, 10 is greater than 5.', '\"[\\\"Look at the number line\\\"]\"', 0, NULL, 0, 0, -1.2, 0.7, 0.5, '2025-06-19 11:18:58', NULL, NULL, NULL),
('3dd34720-d4af-45c7-9c8c-5b23e8e67121', '8bc8ad6c-db4c-44dd-bbbc-4825c76b5339', 'FILL_IN_BLANK', 'Fill in the blank: 5 × ___ = 25', 'null', '5', 1, 2, '2025-06-19 11:18:58', '2025-06-19 11:18:58', 0, 'Multiplication', 'EASY', '5 × 5 = 25. This is basic multiplication.', '\"[\\\"What number times 5 equals 25?\\\"]\"', 0, NULL, 0, 0, -1, 0.9, 0.1, '2025-06-19 11:18:58', NULL, NULL, NULL),
('fd1b3165-c41b-42d5-a8e9-e9e53c12a7c5', '8bc8ad6c-db4c-44dd-bbbc-4825c76b5339', 'MULTIPLE_CHOICE', 'What is 15 × 4?', '\"[\\\"45\\\",\\\"50\\\",\\\"60\\\",\\\"65\\\"]\"', '60', 2, 3, '2025-06-19 11:18:58', '2025-06-19 11:18:58', 0, 'Multiplication', 'MEDIUM', '15 × 4 = 60. You can break this down as 10 × 4 + 5 × 4 = 40 + 20 = 60.', '\"[\\\"Break it down: 10 × 4 + 5 × 4\\\"]\"', 0, NULL, 0, 0, 0, 1, 0.25, '2025-06-19 11:18:58', NULL, NULL, NULL),
('bce4f09f-81f6-43fc-9f85-5e66496c6525', '8bc8ad6c-db4c-44dd-bbbc-4825c76b5339', 'FILL_IN_BLANK', 'What is half of 86?', 'null', '43', 2, 4, '2025-06-19 11:18:58', '2025-06-19 11:18:58', 0, 'Division', 'MEDIUM', 'Half of 86 is 43. 86 ÷ 2 = 43.', '\"[\\\"Divide 86 by 2\\\"]\"', 0, NULL, 0, 0, 0.2, 1.1, 0.1, '2025-06-19 11:18:58', NULL, NULL, NULL),
('df70875b-4c36-4ed0-841a-61379fbb6550', '8bc8ad6c-db4c-44dd-bbbc-4825c76b5339', 'TRUE_FALSE', 'Is 3² equal to 6?', 'null', 'false', 2, 5, '2025-06-19 11:18:58', '2025-06-19 11:18:58', 0, 'Exponents', 'MEDIUM', 'No, 3² = 3 × 3 = 9, not 6.', '\"[\\\"Remember: 3² means 3 × 3\\\"]\"', 0, NULL, 0, 0, 0.1, 1.2, 0.5, '2025-06-19 11:18:58', NULL, NULL, NULL),
('20ff2678-f2e9-45e5-8d47-c650b0e52069', '8bc8ad6c-db4c-44dd-bbbc-4825c76b5339', 'MULTIPLE_CHOICE', 'What is the square root of 144?', '\"[\\\"10\\\",\\\"11\\\",\\\"12\\\",\\\"13\\\"]\"', '12', 3, 6, '2025-06-19 11:18:58', '2025-06-19 11:18:58', 0, 'Square Roots', 'HARD', 'The square root of 144 is 12 because 12 × 12 = 144.', '\"[\\\"Think: what number times itself equals 144?\\\"]\"', 0, NULL, 0, 0, 1.2, 1.3, 0.25, '2025-06-19 11:18:58', NULL, NULL, NULL),
('3e73112f-cffc-4cc5-b395-72fa87ec12d0', '8bc8ad6c-db4c-44dd-bbbc-4825c76b5339', 'FILL_IN_BLANK', 'What is 25% of 80?', 'null', '20', 3, 7, '2025-06-19 11:18:58', '2025-06-19 11:18:58', 0, 'Percentages', 'HARD', '25% of 80 = 0.25 × 80 = 20.', '\"[\\\"Convert 25% to decimal: 0.25, then multiply by 80\\\"]\"', 0, NULL, 0, 0, 1, 1.4, 0.1, '2025-06-19 11:18:58', NULL, NULL, NULL),
('b4618c0c-6037-42c0-a227-8a2dcda8f388', '8bc8ad6c-db4c-44dd-bbbc-4825c76b5339', 'TRUE_FALSE', 'Is the sum of angles in a triangle always 180 degrees?', 'null', 'true', 3, 8, '2025-06-19 11:18:58', '2025-06-19 11:18:58', 0, 'Geometry', 'HARD', 'Yes, the sum of interior angles in any triangle is always 180 degrees.', '\"[\\\"This is a fundamental geometric property\\\"]\"', 0, NULL, 0, 0, 1.5, 1.1, 0.5, '2025-06-19 11:18:58', NULL, NULL, NULL),
('07e52390-f81c-4c25-b30a-ebd229c5c766', '8bc8ad6c-db4c-44dd-bbbc-4825c76b5339', 'MULTIPLE_CHOICE', 'What is 3³?', '\"[\\\"6\\\",\\\"9\\\",\\\"27\\\",\\\"81\\\"]\"', '27', 3, 9, '2025-06-19 11:18:58', '2025-06-19 11:18:58', 0, 'Exponents', 'HARD', '3³ = 3 × 3 × 3 = 27.', '\"[\\\"3³ means 3 × 3 × 3\\\"]\"', 0, NULL, 0, 0, 1.3, 1.2, 0.25, '2025-06-19 11:18:58', NULL, NULL, NULL),
('test-question-id', 'test-quiz-id', 'MULTIPLE_CHOICE', 'What is 2 + 2?', '\"[\\\"3\\\",\\\"4\\\",\\\"5\\\",\\\"6\\\"]\"', '4', 1, 0, '2025-06-19 22:52:13', '2025-06-19 22:52:13', 0, NULL, 'EASY', '2 + 2 equals 4', NULL, 0, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('333d769d-b612-495b-929b-509be14bbd89', '91194b83-0fb5-425b-9f1a-9467e5e3ad0a', 'MULTIPLE_CHOICE', 'What does the phrase \"a steady increase\" mean?', '[\"A sudden drop\", \"A sharp rise\", \"A gradual upward movement\", \"A fluctuating trend\"]', 'A gradual upward movement', 1, 0, '2025-06-20 17:10:12', '2025-06-20 17:10:12', 0, NULL, 'MEDIUM', NULL, 'null', 0, 'null', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('0e639854-8785-4786-b1ff-8ef34ab32251', '91194b83-0fb5-425b-9f1a-9467e5e3ad0a', 'MULTIPLE_CHOICE', 'Choose the correct sentence:', '\"[\\\"Sales rose rapid last quarter.\\\",\\\"The data shows a increase in profits.\\\",\\\"Profits have been rising steadily since 2020.\\\",\\\"The graph illustrate an upward trend.\\\"]\"', 'Profits have been rising steadily since 2020.', 1, 0, '2025-06-20 17:19:09', '2025-06-20 17:19:09', 0, NULL, 'MEDIUM', '', NULL, 0, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 'null'),
('61ed8779-bb11-467f-b99c-393f31d504e1', '91194b83-0fb5-425b-9f1a-9467e5e3ad0a', 'MULTIPLE_CHOICE', 'Complete the sentence: “Between 2018 and 2020, smartphone usage __________ by 25%.”', '\"[\\\"was increased\\\",\\\"has increased\\\",\\\"increased\\\",\\\"increasing\\\"]\"', 'increased', 2, 0, '2025-06-21 12:56:15', '2025-06-21 12:56:15', 0, NULL, 'MEDIUM', '', NULL, 0, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 'null'),
('925998ea-113a-46eb-9bfc-ed9f0e4bbeda', '91194b83-0fb5-425b-9f1a-9467e5e3ad0a', 'MULTIPLE_CHOICE', 'Which of the following best describes this trend in a graph: 📉\n\"The number of paper-based applications dropped suddenly in 2022.\"', '\"[\\\"There was a sharp decline in 2022.\\\",\\\"The applications gradually increased.\\\",\\\"There was a slight rise in 2022.\\\",\\\"The number fluctuated dramatically.\\\"]\"', 'There was a sharp decline in 2022.', 2, 0, '2025-06-21 12:52:56', '2025-06-21 12:52:56', 0, NULL, 'MEDIUM', '', NULL, 0, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 'null'),
('3020727e-fa1d-4a96-bea1-ec74b2b3ee1c', '91194b83-0fb5-425b-9f1a-9467e5e3ad0a', 'SHORT_ANSWER', 'Write a sentence describing this data trend: \"Online course enrollments rose from 10,000 to 60,000 between 2020 and 2023.\"', '\"[]\"', 'Sample Answer: “Online course enrollments increased sixfold between 2020 and 2023.”', 1, 0, '2025-06-21 15:13:25', '2025-06-21 15:13:25', 0, '', 'MEDIUM', '', '\"\"', 0, NULL, 0, 0, 0, 1, 0.05, '2025-06-21 15:13:25', '', '', '\"{}\"'),
('70e0d563-7e8e-4b0c-816a-fa28ac2693ab', '91194b83-0fb5-425b-9f1a-9467e5e3ad0a', 'MULTIPLE_CHOICE', 'Identify the comparative structure:\n“In 2023, more students enrolled in online courses than in traditional classrooms.”', '\"[\\\"Passive voice\\\",\\\"Trend verb\\\",\\\"Comparative structure\\\",\\\"Present perfect tense\\\"]\"', 'Comparative structure', 1, 0, '2025-06-21 15:33:01', '2025-06-21 15:35:22', 0, NULL, 'MEDIUM', NULL, 'null', 0, NULL, 0, 0, 0, 1, 0.25, '2025-06-21 15:35:22', NULL, NULL, '\"{\\\"dragItems\\\":[\\\"Passive voice\\\",\\\"Trend verb\\\",\\\"Comparative structure\\\",\\\"Present perfect tense\\\"],\\\"dropZones\\\":[\\\"Passive voice: Red\\\",\\\"Trend verb: Yellow\\\",\\\"Comparative structure: Blue\\\",\\\"Present perfect tense: Green\\\"]}\"'),
('24206fc0-4c8c-418a-b335-f1530769a3c5', '91194b83-0fb5-425b-9f1a-9467e5e3ad0a', 'SHORT_ANSWER', 'Write 3–4 sentences describing a chart that shows the following:\n- Steady rise in renewable energy use\n- Sharp decline in coal dependency\n- Slight fluctuations in natural gas usage', '\"[]\"', '✅ Assessed for:\n- Use of trend-related vocabulary\n- Comparative language\n- Grammar accuracy', 3, 0, '2025-06-21 15:37:47', '2025-06-21 15:37:47', 0, '', 'MEDIUM', '', '\"\"', 0, NULL, 0, 0, 0, 1, 0.05, '2025-06-21 15:37:47', '', '', '\"{}\"'),
('d6a54a4c-a342-408b-b940-0aafb5686e45', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Quelle est la forme correcte du verbe \"être\" à la première personne du singulier ?', '\"[\\\"es\\\",\\\"est\\\",\\\"suis\\\",\\\"sont\\\"]\"', 'suis', 1, 0, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'La première personne du singulier du verbe \"être\" est \"je suis\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('d14296e2-017e-44b2-8696-4a57f229cf3e', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"I am\" en français ?', '\"[\\\"Je es\\\",\\\"Je suis\\\",\\\"Je est\\\",\\\"Je sont\\\"]\"', 'Je suis', 1, 1, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'La traduction correcte de \"I am\" est \"Je suis\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('d8f9310e-6f40-4db9-8d40-b94ec60eb567', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Quelle est la forme correcte du verbe \"avoir\" à la troisième personne du singulier ?', '\"[\\\"as\\\",\\\"a\\\",\\\"ont\\\",\\\"avez\\\"]\"', 'a', 1, 2, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'La troisième personne du singulier du verbe \"avoir\" est \"il/elle a\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('7236e873-b585-40ed-adb3-9e906640180c', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"I have\" en français ?', '\"[\\\"Je as\\\",\\\"J\'ai\\\",\\\"Je a\\\",\\\"Je ont\\\"]\"', 'J\'ai', 1, 3, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'La traduction correcte de \"I have\" est \"J\'ai\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('fac20214-4b43-4252-895e-e959385b9f67', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Quelle est la forme correcte du verbe \"aller\" à la première personne du singulier ?', '\"[\\\"vas\\\",\\\"va\\\",\\\"vais\\\",\\\"vont\\\"]\"', 'vais', 1, 4, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'La première personne du singulier du verbe \"aller\" est \"je vais\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('4f548ce0-e10c-4d34-8cef-aff62cb77fd9', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"I go\" en français ?', '\"[\\\"Je vas\\\",\\\"Je vais\\\",\\\"Je va\\\",\\\"Je vont\\\"]\"', 'Je vais', 1, 5, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'La traduction correcte de \"I go\" est \"Je vais\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('28ec8b0a-a1fd-4ae8-875b-63b116ff00d2', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Quelle est la forme correcte du verbe \"faire\" à la première personne du singulier ?', '\"[\\\"fais\\\",\\\"fait\\\",\\\"font\\\",\\\"faisez\\\"]\"', 'fais', 1, 6, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'La première personne du singulier du verbe \"faire\" est \"je fais\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('3294acea-e80c-4bc5-b7f2-af18cde93ad0', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"I do\" en français ?', '\"[\\\"Je fait\\\",\\\"Je fais\\\",\\\"Je font\\\",\\\"Je faisez\\\"]\"', 'Je fais', 1, 7, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'La traduction correcte de \"I do\" est \"Je fais\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('8a27249d-503a-4829-8e3b-906a427c1d51', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Quelle est la forme correcte du verbe \"venir\" à la première personne du singulier ?', '\"[\\\"viens\\\",\\\"vient\\\",\\\"viennent\\\",\\\"venez\\\"]\"', 'viens', 1, 8, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'La première personne du singulier du verbe \"venir\" est \"je viens\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('2c2877a7-f1c7-4c44-a9f6-8162dfc4742d', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"I come\" en français ?', '\"[\\\"Je vient\\\",\\\"Je viens\\\",\\\"Je viennent\\\",\\\"Je venez\\\"]\"', 'Je viens', 1, 9, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'La traduction correcte de \"I come\" est \"Je viens\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('898bc5d7-064b-4935-8ebb-ee0cdd3fc6b1', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Quelle est la forme correcte du verbe \"voir\" à la première personne du singulier ?', '\"[\\\"vois\\\",\\\"voit\\\",\\\"voient\\\",\\\"voyez\\\"]\"', 'vois', 1, 10, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'La première personne du singulier du verbe \"voir\" est \"je vois\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('9f2e804d-edcc-49a9-bf14-d863e7ac45e1', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"I see\" en français ?', '\"[\\\"Je voit\\\",\\\"Je vois\\\",\\\"Je voient\\\",\\\"Je voyez\\\"]\"', 'Je vois', 1, 11, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'La traduction correcte de \"I see\" est \"Je vois\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('3e752cf3-f839-4036-9d71-91ffdb4f1cdd', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"hello\" en français ?', '\"[\\\"Au revoir\\\",\\\"Bonjour\\\",\\\"Merci\\\",\\\"S\'il vous plaît\\\"]\"', 'Bonjour', 1, 12, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"hello\" est \"Bonjour\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('d7d9abc6-5b7f-43fc-9c5a-006b28daeb64', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"goodbye\" en français ?', '\"[\\\"Bonjour\\\",\\\"Au revoir\\\",\\\"Merci\\\",\\\"S\'il vous plaît\\\"]\"', 'Au revoir', 1, 13, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"goodbye\" est \"Au revoir\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('9acb321f-3d6b-43e5-a23e-be42f76600e6', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"thank you\" en français ?', '\"[\\\"Bonjour\\\",\\\"Au revoir\\\",\\\"Merci\\\",\\\"S\'il vous plaît\\\"]\"', 'Merci', 1, 14, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"thank you\" est \"Merci\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('4fda459a-52cd-4c87-85b2-ba15cd7e3400', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"please\" en français ?', '\"[\\\"Bonjour\\\",\\\"Au revoir\\\",\\\"Merci\\\",\\\"S\'il vous plaît\\\"]\"', 'S\'il vous plaît', 1, 15, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"please\" est \"S\'il vous plaît\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('8f31061e-1e1c-4aa9-bddd-77254246a829', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"yes\" en français ?', '\"[\\\"Non\\\",\\\"Oui\\\",\\\"Peut-être\\\",\\\"Jamais\\\"]\"', 'Oui', 1, 16, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"yes\" est \"Oui\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('da28857f-487b-4370-bd10-a381cef87e05', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"no\" en français ?', '\"[\\\"Oui\\\",\\\"Non\\\",\\\"Peut-être\\\",\\\"Jamais\\\"]\"', 'Non', 1, 17, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"no\" est \"Non\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('d22d949e-6990-4e24-9fa1-b2589000ed06', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"water\" en français ?', '\"[\\\"Pain\\\",\\\"Eau\\\",\\\"Vin\\\",\\\"Café\\\"]\"', 'Eau', 1, 18, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"water\" est \"Eau\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('f28b90c6-62d7-4673-bf23-8c61696bb25b', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"bread\" en français ?', '\"[\\\"Eau\\\",\\\"Pain\\\",\\\"Vin\\\",\\\"Café\\\"]\"', 'Pain', 1, 19, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"bread\" est \"Pain\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('78a13a83-f17d-428f-9d78-ae39f96ca171', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"house\" en français ?', '\"[\\\"Voiture\\\",\\\"Maison\\\",\\\"Appartement\\\",\\\"Bureau\\\"]\"', 'Maison', 1, 20, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"house\" est \"Maison\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('7eb07e0d-9776-48b9-9ecc-eb6a930b8055', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"car\" en français ?', '\"[\\\"Maison\\\",\\\"Voiture\\\",\\\"Appartement\\\",\\\"Bureau\\\"]\"', 'Voiture', 1, 21, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"car\" est \"Voiture\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('0479613a-ed7f-46c6-b979-12ab8447b54f', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"book\" en français ?', '\"[\\\"Magazine\\\",\\\"Livre\\\",\\\"Journal\\\",\\\"Revue\\\"]\"', 'Livre', 1, 22, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"book\" est \"Livre\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('42664029-3496-4193-8a98-626e25188c89', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"time\" en français ?', '\"[\\\"Heure\\\",\\\"Temps\\\",\\\"Moment\\\",\\\"Période\\\"]\"', 'Temps', 1, 23, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"time\" est \"Temps\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('47d5ff5f-942f-44aa-8de6-41099de3945c', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"day\" en français ?', '\"[\\\"Nuit\\\",\\\"Jour\\\",\\\"Matin\\\",\\\"Soir\\\"]\"', 'Jour', 1, 24, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"day\" est \"Jour\".', '\"[]\"', 0, '\"[\\\"A1\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -2, 0.8, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('a1ad3ff3-e8e3-437b-a933-2013782e7fd6', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Quelle est la forme correcte du verbe \"être\" au passé composé à la première personne ?', '\"[\\\"J\'ai été\\\",\\\"Je suis été\\\",\\\"J\'étais\\\",\\\"Je serai\\\"]\"', 'J\'ai été', 1, 25, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'Le passé composé du verbe \"être\" est \"j\'ai été\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('eca5f743-5d2f-4137-bec4-b73dc80ca593', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"I was\" en français ?', '\"[\\\"Je suis\\\",\\\"J\'étais\\\",\\\"J\'ai été\\\",\\\"Je serai\\\"]\"', 'J\'étais', 1, 26, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'La traduction correcte de \"I was\" est \"J\'étais\" (imparfait).', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('4a153ae7-a50a-40b3-86f6-79d973c8e26c', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Quelle est la forme correcte du verbe \"avoir\" au passé composé à la première personne ?', '\"[\\\"J\'ai eu\\\",\\\"Je suis eu\\\",\\\"J\'avais\\\",\\\"J\'aurai\\\"]\"', 'J\'ai eu', 1, 27, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'Le passé composé du verbe \"avoir\" est \"j\'ai eu\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('aeee3729-0ac0-4b20-8be5-b8bee81bee06', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"I had\" en français ?', '\"[\\\"J\'ai\\\",\\\"J\'avais\\\",\\\"J\'ai eu\\\",\\\"J\'aurai\\\"]\"', 'J\'avais', 1, 28, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'La traduction correcte de \"I had\" est \"J\'avais\" (imparfait).', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('ed7fa98a-7438-4043-a806-aca457339e01', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Quelle est la forme correcte du verbe \"aller\" au passé composé à la première personne ?', '\"[\\\"J\'ai allé\\\",\\\"Je suis allé\\\",\\\"J\'allais\\\",\\\"J\'irai\\\"]\"', 'Je suis allé', 1, 29, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'Le passé composé du verbe \"aller\" est \"je suis allé\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('9e741ac0-ba03-4f32-9104-49c2d3372ec3', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"I went\" en français ?', '\"[\\\"Je vais\\\",\\\"Je suis allé\\\",\\\"J\'allais\\\",\\\"J\'irai\\\"]\"', 'Je suis allé', 1, 30, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'La traduction correcte de \"I went\" est \"Je suis allé\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('9aba4e76-93cf-4b35-ac5e-c0eed292adb8', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Quelle est la forme correcte du verbe \"faire\" au passé composé à la première personne ?', '\"[\\\"J\'ai fait\\\",\\\"Je suis fait\\\",\\\"Je faisais\\\",\\\"Je ferai\\\"]\"', 'J\'ai fait', 1, 31, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'Le passé composé du verbe \"faire\" est \"j\'ai fait\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('e1fd03fb-52c7-4290-9c45-23a717b0f331', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"I did\" en français ?', '\"[\\\"Je fais\\\",\\\"J\'ai fait\\\",\\\"Je faisais\\\",\\\"Je ferai\\\"]\"', 'J\'ai fait', 1, 32, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'La traduction correcte de \"I did\" est \"J\'ai fait\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('3efcf04f-1ecf-4a43-bd0c-50f9ee020a0b', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Quelle est la forme correcte du verbe \"venir\" au passé composé à la première personne ?', '\"[\\\"J\'ai venu\\\",\\\"Je suis venu\\\",\\\"Je venais\\\",\\\"Je viendrai\\\"]\"', 'Je suis venu', 1, 33, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'Le passé composé du verbe \"venir\" est \"je suis venu\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('1a7afb6d-a312-413c-adac-1973f29b9920', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"I came\" en français ?', '\"[\\\"Je viens\\\",\\\"Je suis venu\\\",\\\"Je venais\\\",\\\"Je viendrai\\\"]\"', 'Je suis venu', 1, 34, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'La traduction correcte de \"I came\" est \"Je suis venu\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('bb32a512-d1a6-4939-8ea8-f60abaf3134d', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Quelle est la forme correcte du verbe \"voir\" au passé composé à la première personne ?', '\"[\\\"J\'ai vu\\\",\\\"Je suis vu\\\",\\\"Je voyais\\\",\\\"Je verrai\\\"]\"', 'J\'ai vu', 1, 35, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'Le passé composé du verbe \"voir\" est \"j\'ai vu\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('c9c82713-ecee-4136-a9f6-79ff7e5f8bb2', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"I saw\" en français ?', '\"[\\\"Je vois\\\",\\\"J\'ai vu\\\",\\\"Je voyais\\\",\\\"Je verrai\\\"]\"', 'J\'ai vu', 1, 36, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'La traduction correcte de \"I saw\" est \"J\'ai vu\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('d2f96c31-fc75-4761-bd20-7e48b7190603', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Quelle est la forme correcte du verbe \"être\" au futur simple à la première personne ?', '\"[\\\"Je suis\\\",\\\"Je serai\\\",\\\"J\'étais\\\",\\\"J\'ai été\\\"]\"', 'Je serai', 1, 37, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'Le futur simple du verbe \"être\" est \"je serai\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('5be8bd19-0b6c-4d78-955e-8d0ddaf0eb3f', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"I will be\" en français ?', '\"[\\\"Je suis\\\",\\\"Je serai\\\",\\\"J\'étais\\\",\\\"J\'ai été\\\"]\"', 'Je serai', 1, 38, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'La traduction correcte de \"I will be\" est \"Je serai\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('d87ac8e5-5ba1-41e8-81fa-50bca23f3b93', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Quelle est la forme correcte du verbe \"avoir\" au futur simple à la première personne ?', '\"[\\\"J\'ai\\\",\\\"J\'aurai\\\",\\\"J\'avais\\\",\\\"J\'ai eu\\\"]\"', 'J\'aurai', 1, 39, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'grammar', 'EASY', 'Le futur simple du verbe \"avoir\" est \"j\'aurai\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"grammar\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('7bbb2d88-c2ce-4819-8a34-6238a2060d81', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"morning\" en français ?', '\"[\\\"Soir\\\",\\\"Matin\\\",\\\"Après-midi\\\",\\\"Nuit\\\"]\"', 'Matin', 1, 40, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"morning\" est \"Matin\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('37c93789-6f2d-4c1e-83b3-33b2c34ac5bc', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"evening\" en français ?', '\"[\\\"Matin\\\",\\\"Soir\\\",\\\"Après-midi\\\",\\\"Nuit\\\"]\"', 'Soir', 1, 41, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"evening\" est \"Soir\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('17d13375-8280-4876-b592-04768515f0b5', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"night\" en français ?', '\"[\\\"Matin\\\",\\\"Soir\\\",\\\"Après-midi\\\",\\\"Nuit\\\"]\"', 'Nuit', 1, 42, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"night\" est \"Nuit\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('afadf9af-bf5d-4cd9-9107-13a096668389', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"afternoon\" en français ?', '\"[\\\"Matin\\\",\\\"Soir\\\",\\\"Après-midi\\\",\\\"Nuit\\\"]\"', 'Après-midi', 1, 43, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"afternoon\" est \"Après-midi\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('9d1e4f1f-7682-46a5-978a-890c7758e2e2', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"week\" en français ?', '\"[\\\"Mois\\\",\\\"Semaine\\\",\\\"Année\\\",\\\"Jour\\\"]\"', 'Semaine', 1, 44, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"week\" est \"Semaine\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('d4a42a33-2446-44f1-8d72-8675647d7ff9', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"month\" en français ?', '\"[\\\"Semaine\\\",\\\"Mois\\\",\\\"Année\\\",\\\"Jour\\\"]\"', 'Mois', 1, 45, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"month\" est \"Mois\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('f031b1fc-de6b-4c79-b906-6979c8120854', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"year\" en français ?', '\"[\\\"Semaine\\\",\\\"Mois\\\",\\\"Année\\\",\\\"Jour\\\"]\"', 'Année', 1, 46, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"year\" est \"Année\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('c3833c0a-d666-4cb5-82d9-4a8c62d2afdb', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"family\" en français ?', '\"[\\\"Ami\\\",\\\"Famille\\\",\\\"Groupe\\\",\\\"Équipe\\\"]\"', 'Famille', 1, 47, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"family\" est \"Famille\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('8b4f8c49-48e1-410b-8886-71ccfa56a340', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"friend\" en français ?', '\"[\\\"Famille\\\",\\\"Ami\\\",\\\"Groupe\\\",\\\"Équipe\\\"]\"', 'Ami', 1, 48, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"friend\" est \"Ami\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('c55f72d0-939b-4fec-a57e-c60e8f4a7ec5', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"work\" en français ?', '\"[\\\"Travail\\\",\\\"Bureau\\\",\\\"École\\\",\\\"Maison\\\"]\"', 'Travail', 1, 49, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"work\" est \"Travail\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('45f799e1-83c7-4d17-b4ca-14d2debd63e6', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"school\" en français ?', '\"[\\\"Travail\\\",\\\"Bureau\\\",\\\"École\\\",\\\"Maison\\\"]\"', 'École', 1, 50, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"school\" est \"École\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('43cf8bca-95a1-4886-81ff-ed8ef1021aa4', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"office\" en français ?', '\"[\\\"Travail\\\",\\\"Bureau\\\",\\\"École\\\",\\\"Maison\\\"]\"', 'Bureau', 1, 51, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"office\" est \"Bureau\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('b04f557f-ce2e-4b17-9be0-f9f55e07650e', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"city\" en français ?', '\"[\\\"Ville\\\",\\\"Pays\\\",\\\"Région\\\",\\\"Quartier\\\"]\"', 'Ville', 1, 52, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"city\" est \"Ville\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('cfbacc5b-e26a-4cd8-9e08-23de07e4df5e', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"country\" en français ?', '\"[\\\"Ville\\\",\\\"Pays\\\",\\\"Région\\\",\\\"Quartier\\\"]\"', 'Pays', 1, 53, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"country\" est \"Pays\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL),
('2cfd6169-bea8-40cd-95bb-a763da302199', 'daf5ad40-cc5d-4f5d-8883-a1ce7cffa7b4', 'MULTIPLE_CHOICE', 'Comment dit-on \"language\" en français ?', '\"[\\\"Mot\\\",\\\"Langue\\\",\\\"Parole\\\",\\\"Discours\\\"]\"', 'Langue', 1, 54, '2025-07-30 09:39:04', '2025-07-30 09:39:04', 0, 'vocabulary', 'EASY', 'La traduction correcte de \"language\" est \"Langue\".', '\"[]\"', 0, '\"[\\\"A2\\\",\\\"vocabulary\\\",\\\"french\\\"]\"', 0, 0, -1.5, 0.9, 0.25, '2025-07-30 09:39:04', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `quiz_responses`
--

DROP TABLE IF EXISTS `quiz_responses`;
CREATE TABLE IF NOT EXISTS `quiz_responses` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attemptId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `questionId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `isCorrect` tinyint(1) DEFAULT NULL,
  `pointsEarned` int NOT NULL DEFAULT '0',
  `timeSpent` int NOT NULL DEFAULT '0',
  `answeredAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `quiz_responses_attemptId_questionId_key` (`attemptId`,`questionId`),
  KEY `quiz_responses_attemptId_idx` (`attemptId`),
  KEY `quiz_responses_questionId_idx` (`questionId`),
  KEY `quiz_responses_studentId_idx` (`studentId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `quiz_responses`
--

INSERT INTO `quiz_responses` (`id`, `attemptId`, `questionId`, `studentId`, `answer`, `isCorrect`, `pointsEarned`, `timeSpent`, `answeredAt`) VALUES
('fb8a7f19-befc-4e98-a38d-c47e66c8726d', 'f62d1b4c-b7d0-42a7-af88-4ba6ff9d59a0', '333d769d-b612-495b-929b-509be14bbd89', '5b5fbd13-8776-4f96-ada9-091973974873', 'A gradual upward movement', 1, 1, 0, '2025-06-24 10:05:58.966'),
('c2e17a40-acb2-412a-b656-97c5f2734294', 'f62d1b4c-b7d0-42a7-af88-4ba6ff9d59a0', '0e639854-8785-4786-b1ff-8ef34ab32251', '5b5fbd13-8776-4f96-ada9-091973974873', NULL, 0, 0, 0, '2025-06-24 10:05:58.997'),
('3e2cfa21-9fdd-4d6e-bca4-a912c9bf9ee0', 'f62d1b4c-b7d0-42a7-af88-4ba6ff9d59a0', '61ed8779-bb11-467f-b99c-393f31d504e1', '5b5fbd13-8776-4f96-ada9-091973974873', NULL, 0, 0, 0, '2025-06-24 10:05:58.999'),
('e0a1c526-38de-46a4-9634-693c159379b0', 'f62d1b4c-b7d0-42a7-af88-4ba6ff9d59a0', '925998ea-113a-46eb-9bfc-ed9f0e4bbeda', '5b5fbd13-8776-4f96-ada9-091973974873', NULL, 0, 0, 0, '2025-06-24 10:05:59.002'),
('f9a51a17-9ce6-4f44-bf9b-ea57b918728e', 'f62d1b4c-b7d0-42a7-af88-4ba6ff9d59a0', '3020727e-fa1d-4a96-bea1-ec74b2b3ee1c', '5b5fbd13-8776-4f96-ada9-091973974873', NULL, NULL, 0, 0, '2025-06-24 10:05:59.004'),
('9580a38b-b136-430c-82d6-c9b054d01fbe', 'f62d1b4c-b7d0-42a7-af88-4ba6ff9d59a0', '70e0d563-7e8e-4b0c-816a-fa28ac2693ab', '5b5fbd13-8776-4f96-ada9-091973974873', NULL, 0, 0, 0, '2025-06-24 10:05:59.045'),
('72ae3cec-a3f9-4ce7-83d1-737d6cf9a4fa', 'f62d1b4c-b7d0-42a7-af88-4ba6ff9d59a0', '24206fc0-4c8c-418a-b335-f1530769a3c5', '5b5fbd13-8776-4f96-ada9-091973974873', NULL, NULL, 0, 0, '2025-06-24 10:05:59.048'),
('a8cc7d99-8050-4c52-82dc-6b1791b03d46', '4745a41e-15e4-4870-9539-50a5a27e286f', '333d769d-b612-495b-929b-509be14bbd89', '5b5fbd13-8776-4f96-ada9-091973974873', 'A gradual upward movement', 1, 1, 0, '2025-06-24 10:36:04.549'),
('739786f8-62c4-499e-81cf-a3ee0ef0ebbc', '4745a41e-15e4-4870-9539-50a5a27e286f', '0e639854-8785-4786-b1ff-8ef34ab32251', '5b5fbd13-8776-4f96-ada9-091973974873', 'The graph illustrate an upward trend.', 0, 0, 0, '2025-06-24 10:36:04.553'),
('c71917e3-117c-408c-8fdb-b6defdbe7a77', '4745a41e-15e4-4870-9539-50a5a27e286f', '61ed8779-bb11-467f-b99c-393f31d504e1', '5b5fbd13-8776-4f96-ada9-091973974873', 'increased', 1, 2, 0, '2025-06-24 10:36:04.557'),
('a646690e-47de-461c-8f63-298c482f82b3', '4745a41e-15e4-4870-9539-50a5a27e286f', '925998ea-113a-46eb-9bfc-ed9f0e4bbeda', '5b5fbd13-8776-4f96-ada9-091973974873', 'There was a sharp decline in 2022.', 1, 2, 0, '2025-06-24 10:36:04.566'),
('913fb7ab-2b89-4bb4-9e24-1e42ece34934', '4745a41e-15e4-4870-9539-50a5a27e286f', '3020727e-fa1d-4a96-bea1-ec74b2b3ee1c', '5b5fbd13-8776-4f96-ada9-091973974873', '2020 to 2023 saw a sharp increase in online course enrollments', NULL, 0, 0, '2025-06-24 10:36:04.575'),
('61450412-725a-40f0-bf5b-df4a4b49e7ef', '4745a41e-15e4-4870-9539-50a5a27e286f', '70e0d563-7e8e-4b0c-816a-fa28ac2693ab', '5b5fbd13-8776-4f96-ada9-091973974873', 'Comparative structure', 1, 1, 0, '2025-06-24 10:36:04.587'),
('99454fd3-087b-447e-8864-ca12bf94d568', '4745a41e-15e4-4870-9539-50a5a27e286f', '24206fc0-4c8c-418a-b335-f1530769a3c5', '5b5fbd13-8776-4f96-ada9-091973974873', NULL, NULL, 0, 0, '2025-06-24 10:36:04.599'),
('20a7d271-1373-46ca-9f8c-05e36ce26ccf', 'eb368e4f-ccc9-467b-ac7e-fceacb2550a0', '333d769d-b612-495b-929b-509be14bbd89', '5b5fbd13-8776-4f96-ada9-091973974873', 'A gradual upward movement', 1, 1, 0, '2025-06-24 10:44:01.798'),
('a0841165-dd1f-4245-af63-aff57f65dfd8', 'eb368e4f-ccc9-467b-ac7e-fceacb2550a0', '0e639854-8785-4786-b1ff-8ef34ab32251', '5b5fbd13-8776-4f96-ada9-091973974873', 'Profits have been rising steadily since 2020.', 1, 1, 0, '2025-06-24 10:44:01.805'),
('53ea300b-1ca2-4a77-8f1b-936e09d810e2', 'eb368e4f-ccc9-467b-ac7e-fceacb2550a0', '61ed8779-bb11-467f-b99c-393f31d504e1', '5b5fbd13-8776-4f96-ada9-091973974873', 'increased', 1, 2, 0, '2025-06-24 10:44:01.807'),
('9d21174f-8cba-4488-a44b-3b5b1a9bae50', 'eb368e4f-ccc9-467b-ac7e-fceacb2550a0', '925998ea-113a-46eb-9bfc-ed9f0e4bbeda', '5b5fbd13-8776-4f96-ada9-091973974873', 'There was a sharp decline in 2022.', 1, 2, 0, '2025-06-24 10:44:01.814'),
('109bee3d-8840-4595-a253-d199f6d67527', 'eb368e4f-ccc9-467b-ac7e-fceacb2550a0', '3020727e-fa1d-4a96-bea1-ec74b2b3ee1c', '5b5fbd13-8776-4f96-ada9-091973974873', NULL, NULL, 0, 0, '2025-06-24 10:44:01.826'),
('1671b787-c5f6-488f-8c51-78e392f72bc3', 'eb368e4f-ccc9-467b-ac7e-fceacb2550a0', '70e0d563-7e8e-4b0c-816a-fa28ac2693ab', '5b5fbd13-8776-4f96-ada9-091973974873', 'Comparative structure', 1, 1, 0, '2025-06-24 10:44:01.850'),
('e2eb66ad-834f-4c95-a245-ded62df38481', 'eb368e4f-ccc9-467b-ac7e-fceacb2550a0', '24206fc0-4c8c-418a-b335-f1530769a3c5', '5b5fbd13-8776-4f96-ada9-091973974873', NULL, NULL, 0, 0, '2025-06-24 10:44:01.865'),
('491b38ac-0fa7-4dd7-81a5-157d9e61f104', '2fc03de2-d20f-4522-bc45-ca5b37cd5f22', '333d769d-b612-495b-929b-509be14bbd89', '5b5fbd13-8776-4f96-ada9-091973974873', 'A gradual upward movement', 1, 1, 0, '2025-06-24 10:53:24.206'),
('91cffe0a-d109-486a-9a15-76101bb3e4e2', '2fc03de2-d20f-4522-bc45-ca5b37cd5f22', '0e639854-8785-4786-b1ff-8ef34ab32251', '5b5fbd13-8776-4f96-ada9-091973974873', 'Profits have been rising steadily since 2020.', 1, 1, 0, '2025-06-24 10:53:24.211'),
('4205eef9-3f48-4498-ad71-95a0392fc51d', '2fc03de2-d20f-4522-bc45-ca5b37cd5f22', '61ed8779-bb11-467f-b99c-393f31d504e1', '5b5fbd13-8776-4f96-ada9-091973974873', 'increased', 1, 2, 0, '2025-06-24 10:53:24.218'),
('cec24036-ea48-42ca-b3f5-b29fb5f73104', '2fc03de2-d20f-4522-bc45-ca5b37cd5f22', '925998ea-113a-46eb-9bfc-ed9f0e4bbeda', '5b5fbd13-8776-4f96-ada9-091973974873', 'There was a sharp decline in 2022.', 1, 2, 0, '2025-06-24 10:53:24.235'),
('2b5944d0-1cdc-45f0-8283-7ca3b6a33b80', '2fc03de2-d20f-4522-bc45-ca5b37cd5f22', '3020727e-fa1d-4a96-bea1-ec74b2b3ee1c', '5b5fbd13-8776-4f96-ada9-091973974873', '2020 to 2023 saw an increase in online course enrollments.', NULL, 0, 0, '2025-06-24 10:53:24.245'),
('9bfaf69b-f9c6-4089-ad9d-639af92f7f61', '2fc03de2-d20f-4522-bc45-ca5b37cd5f22', '70e0d563-7e8e-4b0c-816a-fa28ac2693ab', '5b5fbd13-8776-4f96-ada9-091973974873', 'Comparative structure', 1, 1, 0, '2025-06-24 10:53:24.248'),
('8b4d5470-d099-43dd-a0e6-42ee067b796a', '2fc03de2-d20f-4522-bc45-ca5b37cd5f22', '24206fc0-4c8c-418a-b335-f1530769a3c5', '5b5fbd13-8776-4f96-ada9-091973974873', 'Whilst there was a steady increase renewable energy use, coal energy usage declined with natural gas experiencing up and downs.', NULL, 0, 0, '2025-06-24 10:53:24.252'),
('026951a2-3a60-49d8-b72e-b2470d3fbf4f', 'b85d1891-c9ab-4242-972c-367e0a980d65', '333d769d-b612-495b-929b-509be14bbd89', '5b5fbd13-8776-4f96-ada9-091973974873', 'A gradual upward movement', 1, 1, 0, '2025-06-24 10:58:04.753'),
('dbec87c2-5812-4133-ba3e-9957734b04d6', 'b85d1891-c9ab-4242-972c-367e0a980d65', '0e639854-8785-4786-b1ff-8ef34ab32251', '5b5fbd13-8776-4f96-ada9-091973974873', 'The graph illustrate an upward trend.', 0, 0, 0, '2025-06-24 10:58:04.757'),
('8c9f26ce-a48e-4261-be3c-06b4a6349f57', 'b85d1891-c9ab-4242-972c-367e0a980d65', '61ed8779-bb11-467f-b99c-393f31d504e1', '5b5fbd13-8776-4f96-ada9-091973974873', 'increased', 1, 2, 0, '2025-06-24 10:58:04.762'),
('46b7d0a8-8a0f-4761-9c40-8dcbd9569c92', 'b85d1891-c9ab-4242-972c-367e0a980d65', '925998ea-113a-46eb-9bfc-ed9f0e4bbeda', '5b5fbd13-8776-4f96-ada9-091973974873', 'There was a sharp decline in 2022.', 1, 2, 0, '2025-06-24 10:58:04.765'),
('224923b9-766b-4f3d-a3dd-7eabe151c373', 'b85d1891-c9ab-4242-972c-367e0a980d65', '3020727e-fa1d-4a96-bea1-ec74b2b3ee1c', '5b5fbd13-8776-4f96-ada9-091973974873', NULL, NULL, 0, 0, '2025-06-24 10:58:04.775'),
('7e33ccae-697d-4fbd-ade5-7454c8774cc4', 'b85d1891-c9ab-4242-972c-367e0a980d65', '70e0d563-7e8e-4b0c-816a-fa28ac2693ab', '5b5fbd13-8776-4f96-ada9-091973974873', 'Comparative structure', 1, 1, 0, '2025-06-24 10:58:04.791'),
('ba7608a6-8b91-4c5e-b6e2-498599ed4912', 'b85d1891-c9ab-4242-972c-367e0a980d65', '24206fc0-4c8c-418a-b335-f1530769a3c5', '5b5fbd13-8776-4f96-ada9-091973974873', NULL, NULL, 0, 0, '2025-06-24 10:58:04.808'),
('7718b0d5-026c-4b28-b95e-63a4b5559ed2', 'b613422c-00fe-4334-a194-a93475cedce0', '333d769d-b612-495b-929b-509be14bbd89', '5b5fbd13-8776-4f96-ada9-091973974873', 'A gradual upward movement', 1, 1, 0, '2025-06-24 11:56:24.809'),
('673f057a-fcd7-423a-820f-e4c001903fc4', 'b613422c-00fe-4334-a194-a93475cedce0', '0e639854-8785-4786-b1ff-8ef34ab32251', '5b5fbd13-8776-4f96-ada9-091973974873', 'The graph illustrate an upward trend.', 0, 0, 0, '2025-06-24 11:56:24.815'),
('163a2197-d83d-4346-9552-d50dbd2a1338', 'b613422c-00fe-4334-a194-a93475cedce0', '61ed8779-bb11-467f-b99c-393f31d504e1', '5b5fbd13-8776-4f96-ada9-091973974873', 'increased', 1, 2, 0, '2025-06-24 11:56:24.821'),
('2628f003-d2b3-47d9-b1e7-a8bca46b61a2', 'b613422c-00fe-4334-a194-a93475cedce0', '925998ea-113a-46eb-9bfc-ed9f0e4bbeda', '5b5fbd13-8776-4f96-ada9-091973974873', 'There was a sharp decline in 2022.', 1, 2, 0, '2025-06-24 11:56:24.832'),
('0f85165b-b380-4f42-b695-f811c5fb45f8', 'b613422c-00fe-4334-a194-a93475cedce0', '3020727e-fa1d-4a96-bea1-ec74b2b3ee1c', '5b5fbd13-8776-4f96-ada9-091973974873', 'Online course enrollments rose from 10,000 to 60,000 between 2020 and 2023', NULL, 0, 0, '2025-06-24 11:56:24.851'),
('e36510b6-b6bd-488f-990e-095b61b69bf4', 'b613422c-00fe-4334-a194-a93475cedce0', '70e0d563-7e8e-4b0c-816a-fa28ac2693ab', '5b5fbd13-8776-4f96-ada9-091973974873', 'Comparative structure', 1, 1, 0, '2025-06-24 11:56:24.868'),
('600eacc2-1141-4620-89d4-01839c93b571', 'b613422c-00fe-4334-a194-a93475cedce0', '24206fc0-4c8c-418a-b335-f1530769a3c5', '5b5fbd13-8776-4f96-ada9-091973974873', NULL, NULL, 0, 0, '2025-06-24 11:56:24.877');

-- --------------------------------------------------------

--
-- Table structure for table `rate_limit_logs`
--

DROP TABLE IF EXISTS `rate_limit_logs`;
CREATE TABLE IF NOT EXISTS `rate_limit_logs` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `identifier` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `count` int NOT NULL DEFAULT '1',
  `allowed` tinyint(1) NOT NULL DEFAULT '1',
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rate_limit_logs_name_idx` (`name`),
  KEY `rate_limit_logs_identifier_idx` (`identifier`(250)),
  KEY `rate_limit_logs_timestamp_idx` (`timestamp`),
  KEY `rate_limit_logs_allowed_idx` (`allowed`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recurring_session_patterns`
--

DROP TABLE IF EXISTS `recurring_session_patterns`;
CREATE TABLE IF NOT EXISTS `recurring_session_patterns` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `patternType` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `frequency` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dayOfWeek` int DEFAULT NULL,
  `timeOfDay` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` int NOT NULL,
  `timezone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UTC',
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `maxParticipants` int NOT NULL DEFAULT '10',
  `isPublic` tinyint(1) NOT NULL DEFAULT '0',
  `isRecorded` tinyint(1) NOT NULL DEFAULT '0',
  `allowChat` tinyint(1) NOT NULL DEFAULT '1',
  `allowScreenShare` tinyint(1) NOT NULL DEFAULT '1',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `autoGenerate` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `recurring_session_patterns_courseId_idx` (`courseId`),
  KEY `recurring_session_patterns_isActive_idx` (`isActive`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_active` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `stripeCustomerId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interests` json DEFAULT NULL,
  `learning_goals` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `native_language` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `social_links` json DEFAULT NULL,
  `social_visibility` enum('PUBLIC','PRIVATE','FRIENDS_ONLY') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PRIVATE',
  `spoken_languages` json DEFAULT NULL,
  `timezone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_students_email` (`email`),
  KEY `students_native_language_idx` (`native_language`),
  KEY `students_social_visibility_idx` (`social_visibility`),
  KEY `students_location_idx` (`location`(250))
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `name`, `email`, `phone`, `address`, `bio`, `status`, `created_at`, `updated_at`, `last_active`, `stripeCustomerId`, `date_of_birth`, `gender`, `interests`, `learning_goals`, `location`, `native_language`, `social_links`, `social_visibility`, `spoken_languages`, `timezone`, `website`) VALUES
('5b5fbd13-8776-4f96-ada9-091973974873', 'James Maybank', 'patrickmorgan001@gmail.com', '074234567112', '12 Test Avenue, London NE16', NULL, 'active', '2025-06-05 22:51:23', '2025-07-24 09:30:13', '2025-07-24 09:30:13', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PRIVATE', NULL, NULL, NULL),
('ccb77175-fa66-4d1f-bbb9-0701df84384d', 'Student4', 'rodrigo@amitycollege.co.uk', NULL, NULL, NULL, 'active', '2025-07-12 20:13:09', '2025-07-12 20:13:09', '2025-07-12 20:13:09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PRIVATE', NULL, NULL, NULL),
('bcd7ab98-0a9f-414f-b4f3-3307de06219e', 'Patrick Morgan Test', 'patrickmorgan002@gmail.com', NULL, NULL, NULL, 'active', '2025-07-12 20:24:54', '2025-07-12 20:24:54', '2025-07-12 20:24:54', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PRIVATE', NULL, NULL, NULL),
('c98a0b89-011b-482f-843e-a5522de40b1e', 'Nisha Test', 'nisha@sterlingcollegelondon.com', NULL, NULL, NULL, 'active', '2025-07-12 20:39:11', '2025-07-12 20:39:11', '2025-07-12 20:39:11', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PRIVATE', NULL, NULL, NULL),
('2e09fa89-ce41-47f4-9e50-28776cd92141', 'Test Student', 'test.student@example.com', NULL, NULL, NULL, 'active', '2025-07-23 22:48:24', '2025-07-23 22:48:37', '2025-07-23 22:48:24', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PRIVATE', NULL, NULL, NULL),
('ee72dab2-1301-44b5-a701-0dc96801133d', 'Student One', 'student1@test.com', '+44 20 1234 5678', '789 Student Lane, London', 'Learning English for work', 'active', '2025-07-25 16:49:05', '2025-07-25 16:49:05', '2025-07-25 16:49:05', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PRIVATE', NULL, NULL, NULL),
('e0712c36-0a17-425c-8a6d-83f2440ef7da', 'Student Two', 'student2@test.com', '+44 20 8765 4321', '101 Student Road, Manchester', 'Learning English for travel', 'active', '2025-07-25 16:49:05', '2025-07-25 16:49:05', '2025-07-25 16:49:05', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PRIVATE', NULL, NULL, NULL),
('25e01806-ae0f-433b-8a38-a97021e0e3b8', 'Live Tester', 'live@test.com', NULL, NULL, NULL, 'active', '2025-08-09 16:14:08', '2025-08-10 17:03:22', '2025-08-10 17:03:22', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PRIVATE', NULL, NULL, NULL),
('d47324a8-c823-49bc-b2dc-c567727ebafd', 'Live2 Tester', 'live2@test.com', NULL, NULL, NULL, 'active', '2025-08-14 01:37:20', '2025-08-14 01:37:20', '2025-08-14 01:37:20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PRIVATE', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `student_achievements`
--

DROP TABLE IF EXISTS `student_achievements`;
CREATE TABLE IF NOT EXISTS `student_achievements` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `metadata` json DEFAULT NULL,
  `achievement` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `earnedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `student_achievements_studentId_idx` (`studentId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_billing_history`
--

DROP TABLE IF EXISTS `student_billing_history`;
CREATE TABLE IF NOT EXISTS `student_billing_history` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subscriptionId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `billingDate` datetime(3) NOT NULL,
  `amount` double NOT NULL,
  `currency` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `paymentMethod` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transactionId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoiceNumber` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `student_billing_history_subscriptionId_idx` (`subscriptionId`),
  KEY `student_billing_history_billingDate_idx` (`billingDate`),
  KEY `student_billing_history_status_idx` (`status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_billing_history`
--

INSERT INTO `student_billing_history` (`id`, `subscriptionId`, `billingDate`, `amount`, `currency`, `status`, `paymentMethod`, `transactionId`, `invoiceNumber`, `description`, `metadata`, `createdAt`) VALUES
('cmckkosh1000bcb320zyk6vni', 'cmckkosgt0009cb32hkzlxg54', '2025-06-01 13:37:50.626', 12.99, 'USD', 'PAID', 'CREDIT_CARD', 'STU_TXN_1751377070626_7a89vedbr', NULL, 'Monthly subscription payment for BASIC plan', NULL, '2025-07-01 13:37:50.629'),
('cmckkosir000hcb32in6tx8zi', 'cmckkosii000fcb32gnc3lkmb', '2025-06-01 13:37:50.689', 12.99, 'USD', 'PAID', 'CREDIT_CARD', 'STU_TXN_1751377070689_p6quauimo', NULL, 'Monthly subscription payment for BASIC plan', NULL, '2025-07-01 13:37:50.692'),
('cmckkosls000ncb32okapo0nt', 'cmckkoslo000lcb323d05as3r', '2025-06-01 13:37:50.798', 12.99, 'USD', 'PAID', 'CREDIT_CARD', 'STU_TXN_1751377070798_fjog326w5', NULL, 'Monthly subscription payment for BASIC plan', NULL, '2025-07-01 13:37:50.800'),
('cmd0oxm2e0007p73dqyya5lvr', 'cmd0oxm270005p73d7ocblu46', '2025-07-12 20:20:59.501', 12.99, 'USD', 'PAID', 'MANUAL', NULL, 'STU-INV-1752351659508', 'Initial payment for BASIC plan', NULL, '2025-07-12 20:20:59.511'),
('cmd0qsoth000ep73doe7jd63e', 'cmd0qsotc000cp73dw0kd2rmy', '2025-07-12 21:13:09.023', 12.99, 'USD', 'PAID', 'MANUAL', NULL, 'STU-INV-1752354789028', 'Initial payment for BASIC plan', NULL, '2025-07-12 21:13:09.029'),
('cmd0r7t61000lp73dzwdrrxnt', 'cmd0r7t5x000jp73dpf3kdduh', '2025-07-12 21:24:54.498', 12.99, 'USD', 'PAID', 'MANUAL', NULL, 'STU-INV-1752355494503', 'Initial payment for BASIC plan', NULL, '2025-07-12 21:24:54.505'),
('cmd0rq6dl000sp73d9grc9dqt', 'cmd0rq6de000qp73dn3b3o498', '2025-07-12 21:39:11.423', 24.99, 'USD', 'PAID', 'MANUAL', NULL, 'STU-INV-1752356351431', 'Initial payment for PREMIUM plan', NULL, '2025-07-12 21:39:11.434'),
('03e9ae86-8362-4a71-82eb-6bdc8c3246e5', 'cmckkosgt0009cb32hkzlxg54', '2025-07-14 13:58:54.330', 49.99, 'USD', 'PAID', 'CREDIT_CARD', 'txn_1c1da33588cc45bda44c48c223525635', 'INV-1752501534330', 'Monthly subscription for Pro Plan', NULL, '2025-07-14 13:58:54.332'),
('f7cef743-d904-4a7b-a09f-4f178962c358', 'cmckkosii000fcb32gnc3lkmb', '2025-07-14 13:58:54.338', 12.99, 'USD', 'PAID', 'CREDIT_CARD', 'txn_23448247a10a4d45ad238efdf2f84382', 'INV-1752501534338', 'Monthly subscription for Basic Plan', NULL, '2025-07-14 13:58:54.339'),
('b61461ca-51ad-4043-9aea-bfc6ebbf5538', '0c20dc4a-afa5-4c40-a041-5fa049fc6725', '2025-07-14 13:58:54.358', 24.99, 'USD', 'PAID', 'CREDIT_CARD', 'txn_c0601b5f802e43c3a49a893868e3d5f6', 'INV-1752501534358', 'Monthly subscription for Premium Plan', NULL, '2025-07-14 13:58:54.362'),
('8a630212-1048-4fa8-9c2a-97ead9abe024', 'edb159a5-6722-4539-9581-af008f1cfaca', '2025-07-14 13:58:54.367', 12.99, 'USD', 'PAID', 'CREDIT_CARD', 'txn_b3396097b1bf42778d7c07d8ae61dc21', 'INV-1752501534367', 'Monthly subscription for Basic Plan', NULL, '2025-07-14 13:58:54.368'),
('e573a788-546d-482a-9159-ee13a08dca0b', 'cmd0oxm270005p73d7ocblu46', '2025-07-14 13:58:54.378', 12.99, 'USD', 'PAID', 'CREDIT_CARD', 'txn_6488fbfc5a9e4f3f9a5d19b46f78514b', 'INV-1752501534378', 'Monthly subscription for Basic Plan', NULL, '2025-07-14 13:58:54.379'),
('e73a8826-20cf-42f9-9283-6a5125b76fc9', 'cmd0qsotc000cp73dw0kd2rmy', '2025-07-14 13:58:54.386', 12.99, 'USD', 'PAID', 'CREDIT_CARD', 'txn_f925e6ea0bbe4e25b892e5132826ebd2', 'INV-1752501534386', 'Monthly subscription for Basic Plan', NULL, '2025-07-14 13:58:54.388'),
('97be7e8e-3382-4499-98a9-9af2f702f61b', 'cmd0r7t5x000jp73dpf3kdduh', '2025-07-14 13:58:54.395', 12.99, 'USD', 'PAID', 'CREDIT_CARD', 'txn_7b9a9bbc418346859aeea501bcaf4912', 'INV-1752501534395', 'Monthly subscription for Basic Plan', NULL, '2025-07-14 13:58:54.397'),
('994d74de-e749-4238-8449-0b4a8fa752c5', 'cmd0rq6de000qp73dn3b3o498', '2025-07-14 13:58:54.411', 12.99, 'USD', 'PAID', 'CREDIT_CARD', 'txn_8fff4b45b3e34e75b06b8d54968e0a51', 'INV-1752501534411', 'Monthly subscription for Basic Plan', NULL, '2025-07-14 13:58:54.412'),
('f6d3da3c-a705-4692-8b6d-7643c32e66db', '0b370e62-e185-4337-b025-2148ae36bbce', '2025-07-14 13:58:54.417', 24.99, 'USD', 'PAID', 'CREDIT_CARD', 'txn_98b29635900d4ffd85f7ef53a7450933', 'INV-1752501534417', 'Monthly subscription for Premium Plan', NULL, '2025-07-14 13:58:54.419'),
('cmdgrmrfv0005li90zs52igk7', 'cmckkosgt0009cb32hkzlxg54', '2025-07-24 02:20:50.909', 12.99, 'USD', 'PAID', 'MANUAL', NULL, 'STU-INV-1753323650923', 'Initial payment for BASIC plan', NULL, '2025-07-24 02:20:50.924'),
('cmdgrp6he000bli90blk8mqne', 'cmckkosgt0009cb32hkzlxg54', '2025-07-24 02:22:43.721', 24.99, 'USD', 'PAID', 'MANUAL', NULL, 'STU-INV-1753323763728', 'Initial payment for PREMIUM plan', NULL, '2025-07-24 02:22:43.730'),
('cmdw7ud9c000254pr51hjy8a5', 'cmckkosgt0009cb32hkzlxg54', '2025-08-03 21:51:12.265', 24.99, 'USD', 'PAID', 'MANUAL', NULL, 'STU-INV-1754257872287', 'Initial payment for PREMIUM plan', NULL, '2025-08-03 21:51:12.288'),
('cmea3fqgj0003pl5iqrw7km4u', 'cmea3fq7g0001pl5ibe9w523c', '2025-08-13 14:56:37.176', 24.99, 'USD', 'TRIAL', 'MANUAL', NULL, 'STU-INV-1755096997554', 'Trial subscription for PREMIUM plan', NULL, '2025-08-13 14:56:37.555'),
('cmea83nuw0003lbe617xm925o', 'cmea83ntw0001lbe6wmct4vrq', '2025-08-13 17:07:12.353', 24.99, 'USD', 'TRIAL', 'MANUAL', NULL, 'STU-INV-1755104832391', 'Trial subscription for PREMIUM plan', NULL, '2025-08-13 17:07:12.393'),
('cmea8v3l90003r2ssvjj32yev', 'cmea8v3l10001r2sse5nbhf3e', '2025-08-13 17:28:32.481', 24.99, 'USD', 'TRIAL', 'MANUAL', NULL, 'STU-INV-1755106112491', 'Trial subscription for PREMIUM plan', NULL, '2025-08-13 17:28:32.493'),
('cmeap394000037wv9wmnwgig1', 'cmeap393t00017wv95vi0xhv1', '2025-08-14 01:02:46.743', 24.99, 'USD', 'TRIAL', 'MANUAL', NULL, 'STU-INV-1755133366752', 'Trial subscription for PREMIUM plan', NULL, '2025-08-14 01:02:46.753'),
('cmeapofm30003110gmwzcnxmo', 'cmeapofly0001110grc5p93iw', '2025-08-14 01:19:14.947', 24.99, 'USD', 'TRIAL', 'MANUAL', NULL, 'STU-INV-1755134354955', 'Trial subscription for PREMIUM plan', NULL, '2025-08-14 01:19:14.956'),
('cmeaq26mg000380y64f65byn2', 'cmeaq26m9000180y6tpgs2yx6', '2025-08-14 01:29:56.479', 24.99, 'USD', 'TRIAL', 'MANUAL', NULL, 'STU-INV-1755134996487', 'Trial subscription for PREMIUM plan', NULL, '2025-08-14 01:29:56.488'),
('cmearlqa4000349m9tq7nfb67', 'cmearlq9x000149m9k2ki9u2g', '2025-08-14 02:13:08.035', 24.99, 'USD', 'TRIAL', 'MANUAL', NULL, 'STU-INV-1755137588044', 'Trial subscription for PREMIUM plan', NULL, '2025-08-14 02:13:08.045'),
('cmeasi401000x49m9cn3v16dr', 'cmeasi3zv000v49m9oy6kkqjf', '2025-08-14 02:38:18.809', 24.99, 'USD', 'TRIAL', 'MANUAL', NULL, 'STU-INV-1755139098817', 'Trial subscription for PREMIUM plan', NULL, '2025-08-14 02:38:18.818'),
('cmeaswfxc001149m9qk00wwql', 'cmeaswfx2000z49m981oqmynv', '2025-08-14 02:49:27.444', 24.99, 'USD', 'TRIAL', 'MANUAL', NULL, 'STU-INV-1755139767455', 'Trial subscription for PREMIUM plan', NULL, '2025-08-14 02:49:27.456'),
('cmeat16ou001549m9xt8b1die', 'cmeat16op001349m9b8vhe604', '2025-08-14 02:53:08.758', 24.99, 'USD', 'TRIAL', 'MANUAL', NULL, 'STU-INV-1755139988765', 'Trial subscription for PREMIUM plan', NULL, '2025-08-14 02:53:08.767');

-- --------------------------------------------------------

--
-- Table structure for table `student_course_completions`
--

DROP TABLE IF EXISTS `student_course_completions`;
CREATE TABLE IF NOT EXISTS `student_course_completions` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `StudentCourseCompletion_studentId_fkey` (`studentId`),
  KEY `StudentCourseCompletion_courseId_fkey` (`courseId`),
  KEY `idx_completion_course_id` (`courseId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_course_enrollments`
--

DROP TABLE IF EXISTS `student_course_enrollments`;
CREATE TABLE IF NOT EXISTS `student_course_enrollments` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING_PAYMENT',
  `progress` double NOT NULL DEFAULT '0',
  `startDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `endDate` datetime(3) DEFAULT NULL,
  `paymentStatus` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `paymentDate` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `stateVersion` int NOT NULL DEFAULT '1',
  `version` int NOT NULL DEFAULT '1',
  `accessExpiry` datetime(3) DEFAULT NULL,
  `accessMethod` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DIRECT',
  `attendanceQuotaUsed` int NOT NULL DEFAULT '0',
  `enrollmentQuotaUsed` tinyint(1) NOT NULL DEFAULT '0',
  `enrollmentType` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'COURSE_BASED',
  `hasLiveClassAccess` tinyint(1) NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isPlatformCourse` tinyint(1) NOT NULL DEFAULT '0',
  `liveClassAccessExpiry` datetime(3) DEFAULT NULL,
  `subscriptionId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subscriptionTier` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_course_enrollments_studentId_idx` (`studentId`),
  KEY `student_course_enrollments_courseId_idx` (`courseId`),
  KEY `idx_enrollment_course_id` (`courseId`),
  KEY `student_course_enrollments_enrollmentType_idx` (`enrollmentType`),
  KEY `student_course_enrollments_accessMethod_idx` (`accessMethod`),
  KEY `student_course_enrollments_subscriptionId_idx` (`subscriptionId`),
  KEY `student_course_enrollments_isPlatformCourse_idx` (`isPlatformCourse`),
  KEY `student_course_enrollments_isActive_idx` (`isActive`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_course_enrollments`
--

INSERT INTO `student_course_enrollments` (`id`, `studentId`, `courseId`, `status`, `progress`, `startDate`, `endDate`, `paymentStatus`, `paymentDate`, `createdAt`, `updatedAt`, `stateVersion`, `version`, `accessExpiry`, `accessMethod`, `attendanceQuotaUsed`, `enrollmentQuotaUsed`, `enrollmentType`, `hasLiveClassAccess`, `isActive`, `isPlatformCourse`, `liveClassAccessExpiry`, `subscriptionId`, `subscriptionTier`) VALUES
('cmc9nqqaf0009nfpuade5uuis', '5b5fbd13-8776-4f96-ada9-091973974873', '12de3567-2474-4760-a8ff-f58d22cde02d', 'ENROLLED', 0, '2025-07-07 00:00:00.000', '2025-10-07 00:00:00.000', 'PAID', '2025-06-23 22:21:53.050', '2025-06-23 22:17:52.023', '2025-08-05 16:23:06.781', 1, 1, NULL, 'INSTITUTION', 0, 0, 'COURSE_BASED', 0, 1, 0, NULL, NULL, NULL),
('cmcd9i1td0002wifriuxiimz4', '5b5fbd13-8776-4f96-ada9-091973974873', 'd5975219-7eda-4507-bc4c-3fe2048dfc06', 'ENROLLED', 0, '2025-07-07 00:00:00.000', '2025-09-19 00:00:00.000', 'PAID', '2025-06-26 10:57:39.184', '2025-06-26 10:50:17.081', '2025-08-05 16:23:06.786', 1, 1, NULL, 'INSTITUTION', 0, 0, 'COURSE_BASED', 0, 1, 0, NULL, NULL, NULL),
('cmcjfsy7x0002hfzgyyaxhx3y', '5b5fbd13-8776-4f96-ada9-091973974873', 'c5f5c533-6eef-4b50-8bee-47e4cfaa4d15', 'ENROLLED', 0, '2025-07-07 00:00:00.000', '2025-09-12 00:00:00.000', 'PAID', '2025-07-14 01:54:44.089', '2025-06-30 18:33:20.445', '2025-08-05 16:23:06.794', 1, 1, NULL, 'INSTITUTION', 0, 0, 'COURSE_BASED', 0, 1, 0, NULL, NULL, NULL),
('cmdfxzczf0007b4ejk2ggjy0u', '5b5fbd13-8776-4f96-ada9-091973974873', '7e806add-bd45-43f6-a28f-fb736707653c', 'PENDING_PAYMENT', 0, '2025-07-23 12:30:15.839', '2025-09-12 00:00:00.000', 'PENDING', NULL, '2025-07-23 12:30:50.236', '2025-08-05 16:23:06.800', 1, 1, NULL, 'INSTITUTION', 0, 0, 'COURSE_BASED', 0, 1, 0, NULL, NULL, NULL),
('cmdfxjuwr0002b4ejo5suxfwp', '5b5fbd13-8776-4f96-ada9-091973974873', '78bfbb28-7f43-423d-9454-1910b1fdabcf', 'ENROLLED', 0, '2025-07-23 12:18:19.570', '2025-08-29 00:00:00.000', 'PAID', '2025-08-08 16:56:10.940', '2025-07-23 12:18:46.971', '2025-08-08 16:56:10.941', 1, 1, NULL, 'INSTITUTION', 0, 0, 'COURSE_BASED', 0, 1, 0, NULL, NULL, NULL),
('cmdg69uuh00029kkxm7wbnam0', '5b5fbd13-8776-4f96-ada9-091973974873', '5002bdce-b66b-4be2-95b7-a1d08d8c0981', 'ENROLLED', 0, '2025-07-23 15:46:54.128', '2025-09-05 00:00:00.000', 'PAID', '2025-08-08 16:14:55.237', '2025-07-23 16:22:56.186', '2025-08-08 16:14:55.239', 1, 1, NULL, 'INSTITUTION', 0, 0, 'COURSE_BASED', 0, 1, 0, NULL, NULL, NULL),
('cmeascn27000r49m9wt4jyg8k', '25e01806-ae0f-433b-8a38-a97021e0e3b8', 'c35b2490-a08e-4c29-9d28-30735f91bd1f', 'ENROLLED', 0, '2025-08-14 02:34:03.580', '2024-03-31 00:00:00.000', 'PAID', '2025-08-14 02:34:03.582', '2025-08-14 02:34:03.583', '2025-08-14 02:34:03.583', 1, 1, NULL, 'DIRECT', 0, 0, 'COURSE_BASED', 0, 1, 0, NULL, NULL, NULL),
('cmeat1fb7001849m9xatoysda', 'd47324a8-c823-49bc-b2dc-c567727ebafd', 'c35b2490-a08e-4c29-9d28-30735f91bd1f', 'ENROLLED', 0, '2025-08-14 02:53:19.937', '2024-03-31 00:00:00.000', 'PAID', '2025-08-14 02:53:19.938', '2025-08-14 02:53:19.940', '2025-08-14 02:53:19.940', 1, 1, NULL, 'DIRECT', 0, 0, 'COURSE_BASED', 0, 1, 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `student_institutions`
--

DROP TABLE IF EXISTS `student_institutions`;
CREATE TABLE IF NOT EXISTS `student_institutions` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institution_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` enum('INQUIRY','APPLIED','REVIEWING','ACCEPTED','REJECTED','ENROLLED','ALUMNI','MEMBER') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INQUIRY',
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_institutions_student_id_institution_id_key` (`student_id`,`institution_id`),
  KEY `student_institutions_student_id_idx` (`student_id`),
  KEY `student_institutions_institution_id_idx` (`institution_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_notification_preferences`
--

DROP TABLE IF EXISTS `student_notification_preferences`;
CREATE TABLE IF NOT EXISTS `student_notification_preferences` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_notifications` tinyint(1) NOT NULL DEFAULT '1',
  `push_notifications` tinyint(1) NOT NULL DEFAULT '1',
  `sms_notifications` tinyint(1) NOT NULL DEFAULT '0',
  `course_updates` tinyint(1) NOT NULL DEFAULT '1',
  `assignment_reminders` tinyint(1) NOT NULL DEFAULT '1',
  `payment_reminders` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `achievement_alerts` tinyint(1) NOT NULL DEFAULT '1',
  `assignment_deadlines` tinyint(1) NOT NULL DEFAULT '1',
  `assignment_feedback` tinyint(1) NOT NULL DEFAULT '1',
  `assignment_grades` tinyint(1) NOT NULL DEFAULT '1',
  `course_announcements` tinyint(1) NOT NULL DEFAULT '1',
  `course_reminders` tinyint(1) NOT NULL DEFAULT '1',
  `course_schedule` tinyint(1) NOT NULL DEFAULT '1',
  `group_messages` tinyint(1) NOT NULL DEFAULT '1',
  `instructor_messages` tinyint(1) NOT NULL DEFAULT '1',
  `milestone_reached` tinyint(1) NOT NULL DEFAULT '1',
  `notification_frequency` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DAILY',
  `payment_confirmation` tinyint(1) NOT NULL DEFAULT '1',
  `payment_failed` tinyint(1) NOT NULL DEFAULT '1',
  `payment_receipts` tinyint(1) NOT NULL DEFAULT '1',
  `progress_updates` tinyint(1) NOT NULL DEFAULT '1',
  `system_announcements` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_notification_preferences_student_id_key` (`student_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_notification_preferences`
--

INSERT INTO `student_notification_preferences` (`id`, `student_id`, `email_notifications`, `push_notifications`, `sms_notifications`, `course_updates`, `assignment_reminders`, `payment_reminders`, `created_at`, `updated_at`, `achievement_alerts`, `assignment_deadlines`, `assignment_feedback`, `assignment_grades`, `course_announcements`, `course_reminders`, `course_schedule`, `group_messages`, `instructor_messages`, `milestone_reached`, `notification_frequency`, `payment_confirmation`, `payment_failed`, `payment_receipts`, `progress_updates`, `system_announcements`) VALUES
('f4291130-275b-45af-9c70-c1bb1dcfb487', '5b5fbd13-8776-4f96-ada9-091973974873', 1, 1, 0, 1, 1, 1, '2025-06-24 15:59:32', '2025-06-24 15:59:32', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'DAILY', 1, 1, 1, 1, 1),
('4086f729-ff70-4341-b821-775564cef97b', 'bcd7ab98-0a9f-414f-b4f3-3307de06219e', 1, 1, 0, 1, 1, 1, '2025-07-12 20:25:00', '2025-07-12 20:25:00', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'DAILY', 1, 1, 1, 1, 1),
('313b2d5e-12fc-4505-9c1f-9768a3b267aa', 'c98a0b89-011b-482f-843e-a5522de40b1e', 1, 1, 0, 1, 1, 1, '2025-07-12 20:40:40', '2025-07-12 20:40:40', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'DAILY', 1, 1, 1, 1, 1),
('ee0e0fe9-12eb-437c-8407-5d47598e36e8', '25e01806-ae0f-433b-8a38-a97021e0e3b8', 1, 1, 0, 1, 1, 1, '2025-08-09 16:14:08', '2025-08-09 16:14:08', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'DAILY', 1, 1, 1, 1, 1),
('33a7fa3c-2a47-414d-a434-26f603a67662', 'd47324a8-c823-49bc-b2dc-c567727ebafd', 1, 1, 0, 1, 1, 1, '2025-08-14 01:37:20', '2025-08-14 01:37:20', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'DAILY', 1, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `student_progress`
--

DROP TABLE IF EXISTS `student_progress`;
CREATE TABLE IF NOT EXISTS `student_progress` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `module_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_completed` tinyint(1) DEFAULT '0',
  `exercises_completed` tinyint(1) DEFAULT '0',
  `quiz_completed` tinyint(1) DEFAULT '0',
  `quiz_score` int DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_module` (`student_id`,`module_id`),
  KEY `idx_student_progress_module_id` (`module_id`),
  KEY `idx_student_progress_student_id` (`student_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_progress`
--

INSERT INTO `student_progress` (`id`, `student_id`, `module_id`, `content_completed`, `exercises_completed`, `quiz_completed`, `quiz_score`, `started_at`, `completed_at`) VALUES
('888e3e9d-1d7a-4458-80c1-87da4bc67fff', '5b5fbd13-8776-4f96-ada9-091973974873', 'eb1a6d58-7fde-4abc-92c4-2615f3ebfc96', 0, 0, 1, NULL, '2025-06-24 09:44:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `student_subscriptions`
--

DROP TABLE IF EXISTS `student_subscriptions`;
CREATE TABLE IF NOT EXISTS `student_subscriptions` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `startDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `endDate` datetime(3) NOT NULL,
  `autoRenew` tinyint(1) NOT NULL DEFAULT '1',
  `cancellationReason` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cancelledAt` datetime(3) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `studentTierId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attendanceQuota` int NOT NULL DEFAULT '10',
  `canAccessLiveClasses` tinyint(1) NOT NULL DEFAULT '0',
  `canAccessRecordings` tinyint(1) NOT NULL DEFAULT '0',
  `canUseHDVideo` tinyint(1) NOT NULL DEFAULT '0',
  `currentEnrollments` int NOT NULL DEFAULT '0',
  `enrollmentQuota` int NOT NULL DEFAULT '1',
  `maxActiveCourses` int NOT NULL DEFAULT '1',
  `maxEnrollments` int NOT NULL DEFAULT '1',
  `monthlyAttendance` int NOT NULL DEFAULT '0',
  `monthlyEnrollments` int NOT NULL DEFAULT '0',
  `planType` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BASIC',
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_subscriptions_studentId_key` (`studentId`),
  KEY `student_subscriptions_studentId_idx` (`studentId`),
  KEY `student_subscriptions_status_idx` (`status`),
  KEY `student_subscriptions_endDate_idx` (`endDate`),
  KEY `student_subscriptions_studentTierId_fkey` (`studentTierId`),
  KEY `student_subscriptions_planType_idx` (`planType`),
  KEY `student_subscriptions_currentEnrollments_idx` (`currentEnrollments`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_subscriptions`
--

INSERT INTO `student_subscriptions` (`id`, `studentId`, `status`, `startDate`, `endDate`, `autoRenew`, `cancellationReason`, `cancelledAt`, `metadata`, `createdAt`, `updatedAt`, `studentTierId`, `attendanceQuota`, `canAccessLiveClasses`, `canAccessRecordings`, `canUseHDVideo`, `currentEnrollments`, `enrollmentQuota`, `maxActiveCourses`, `maxEnrollments`, `monthlyAttendance`, `monthlyEnrollments`, `planType`) VALUES
('cmckkosgt0009cb32hkzlxg54', '5b5fbd13-8776-4f96-ada9-091973974873', 'ACTIVE', '2025-06-01 13:37:50.617', '2025-09-03 21:51:12.265', 1, NULL, NULL, '{}', '2025-07-01 13:37:50.621', '2025-08-05 16:23:06.081', 'premium-tier', 30, 0, 0, 0, 6, 10, 1, 10, 1, 0, 'BASIC'),
('cmckkoslo000lcb323d05as3r', 'e6c31370-dc9c-4aae-b9c5-db40c4d9584a', 'ACTIVE', '2025-06-01 13:37:50.794', '2025-07-31 13:37:50.794', 1, NULL, NULL, NULL, '2025-07-01 13:37:50.797', '2025-08-05 16:23:06.095', 'basic-tier', 10, 0, 0, 0, 0, 3, 1, 3, 0, 0, 'BASIC'),
('cmd0qsotc000cp73dw0kd2rmy', 'ccb77175-fa66-4d1f-bbb9-0701df84384d', 'ACTIVE', '2025-07-12 21:13:09.023', '2026-07-14 13:58:54.381', 1, NULL, NULL, '{\"isTrial\": true, \"billingCycle\": \"MONTHLY\", \"trialEndDate\": \"2025-07-19T21:13:09.023Z\"}', '2025-07-12 21:13:09.024', '2025-08-05 16:23:06.119', 'basic-tier', 10, 0, 0, 0, 0, 3, 1, 3, 0, 0, 'BASIC'),
('cmd0r7t5x000jp73dpf3kdduh', 'bcd7ab98-0a9f-414f-b4f3-3307de06219e', 'ACTIVE', '2025-07-12 21:24:54.498', '2026-07-14 13:58:54.390', 1, NULL, NULL, '{\"isTrial\": true, \"billingCycle\": \"MONTHLY\", \"trialEndDate\": \"2025-07-19T21:24:54.498Z\"}', '2025-07-12 21:24:54.501', '2025-08-05 16:23:06.135', 'basic-tier', 10, 0, 0, 0, 0, 3, 1, 3, 0, 0, 'BASIC'),
('cmd0rq6de000qp73dn3b3o498', 'c98a0b89-011b-482f-843e-a5522de40b1e', 'ACTIVE', '2025-07-12 21:39:11.423', '2026-07-14 13:58:54.404', 1, NULL, NULL, '{\"isTrial\": true, \"billingCycle\": \"MONTHLY\", \"trialEndDate\": \"2025-07-19T21:39:11.423Z\"}', '2025-07-12 21:39:11.427', '2025-08-05 16:23:06.150', 'basic-tier', 10, 0, 0, 0, 0, 3, 1, 3, 0, 0, 'BASIC'),
('0c20dc4a-afa5-4c40-a041-5fa049fc6725', 'bdcbbab6-9436-43d1-80e6-b9543b48dd06', 'ACTIVE', '2025-07-14 13:58:54.344', '2026-07-14 13:58:54.344', 1, NULL, NULL, NULL, '2025-07-14 13:58:54.346', '2025-08-05 16:23:06.166', 'premium-tier', 30, 0, 0, 0, 0, 10, 1, 10, 0, 0, 'BASIC'),
('cmearlq9x000149m9k2ki9u2g', '25e01806-ae0f-433b-8a38-a97021e0e3b8', 'TRIAL', '2025-08-14 02:13:08.035', '2025-08-21 02:13:08.035', 1, NULL, NULL, '{\"isTrial\": true, \"trialEndDate\": \"2025-08-21T02:13:08.035Z\"}', '2025-08-14 02:13:08.037', '2025-08-14 02:13:08.037', 'premium-tier', 10, 0, 0, 0, 0, 1, 1, 1, 0, 0, 'PREMIUM'),
('cmeat16op001349m9b8vhe604', 'd47324a8-c823-49bc-b2dc-c567727ebafd', 'TRIAL', '2025-08-14 02:53:08.758', '2025-08-21 02:53:08.758', 1, NULL, NULL, '{\"isTrial\": true, \"trialEndDate\": \"2025-08-21T02:53:08.758Z\"}', '2025-08-14 02:53:08.761', '2025-08-14 02:53:08.761', 'premium-tier', 10, 0, 0, 0, 0, 1, 1, 1, 0, 0, 'PREMIUM');

-- --------------------------------------------------------

--
-- Table structure for table `student_tiers`
--

DROP TABLE IF EXISTS `student_tiers`;
CREATE TABLE IF NOT EXISTS `student_tiers` (
  `id` varchar(191) NOT NULL,
  `planType` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `price` double NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'USD',
  `billingCycle` varchar(20) NOT NULL DEFAULT 'MONTHLY',
  `features` json NOT NULL,
  `maxCourses` int NOT NULL DEFAULT '5',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `maxLiveClasses` int NOT NULL DEFAULT '10',
  `maxStudents` int NOT NULL DEFAULT '1',
  `maxInstructors` int NOT NULL DEFAULT '1',
  `enrollmentQuota` int NOT NULL DEFAULT '5',
  `attendanceQuota` int NOT NULL DEFAULT '20',
  `gracePeriodDays` int NOT NULL DEFAULT '7',
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_tiers_planType_key` (`planType`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `student_tiers`
--

INSERT INTO `student_tiers` (`id`, `planType`, `name`, `description`, `price`, `currency`, `billingCycle`, `features`, `maxCourses`, `isActive`, `createdAt`, `updatedAt`, `maxLiveClasses`, `maxStudents`, `maxInstructors`, `enrollmentQuota`, `attendanceQuota`, `gracePeriodDays`) VALUES
('basic-tier', 'BASIC', 'Basic Plan', 'Perfect for beginners starting their language journey', 12.99, 'USD', 'MONTHLY', '{\"maxCourses\": 5, \"aiAssistant\": false, \"basicLessons\": true, \"certificates\": false, \"emailSupport\": true, \"maxLanguages\": 5, \"mobileAccess\": true, \"offlineAccess\": false, \"personalTutoring\": false, \"progressTracking\": true, \"liveConversations\": false, \"videoConferencing\": false, \"customLearningPaths\": false}', 5, 1, '2025-07-05 02:45:40.000', '2025-08-05 16:23:05.936', 5, 1, 1, 3, 10, 7),
('premium-tier', 'PREMIUM', 'Premium Plan', 'Most popular choice for serious language learners', 24.99, 'USD', 'MONTHLY', '{\"maxCourses\": 20, \"aiAssistant\": true, \"basicLessons\": true, \"certificates\": true, \"maxLanguages\": -1, \"mobileAccess\": true, \"videoLessons\": true, \"offlineAccess\": true, \"culturalContent\": true, \"prioritySupport\": true, \"personalTutoring\": false, \"progressTracking\": true, \"liveConversations\": true, \"videoConferencing\": \"limited\", \"customLearningPaths\": false}', 20, 1, '2025-07-05 02:45:40.000', '2025-08-05 16:23:05.941', 15, 2, 2, 10, 30, 14),
('pro-tier', 'PRO', 'Pro Plan', 'Complete language learning experience with personal tutoring', 49.99, 'USD', 'MONTHLY', '{\"maxCourses\": -1, \"aiAssistant\": true, \"basicLessons\": true, \"certificates\": true, \"maxLanguages\": -1, \"mobileAccess\": true, \"videoLessons\": true, \"offlineAccess\": true, \"careerGuidance\": true, \"culturalContent\": true, \"dedicatedSupport\": true, \"exclusiveContent\": true, \"personalTutoring\": true, \"progressTracking\": true, \"liveConversations\": true, \"portfolioBuilding\": true, \"videoConferencing\": \"unlimited\", \"advancedAssessment\": true, \"groupStudySessions\": true, \"customLearningPaths\": true}', -1, 1, '2025-07-05 02:45:40.000', '2025-08-05 16:23:05.946', 10, 1, 1, 5, 20, 7),
('cmdyr057b00007ld1die1tpon', 'ENTERPRISE', 'Enterprise Plan', 'Complete solution for institutions and organizations', 49.99, 'USD', 'MONTHLY', '{\"hdVideo\": true, \"analytics\": true, \"apiAccess\": true, \"recordings\": true, \"liveClasses\": true, \"customBranding\": true, \"prioritySupport\": true, \"selfPacedCourses\": true}', 50, 1, '2025-08-05 16:23:06.839', '2025-08-05 16:23:06.839', 50, 5, 5, 25, 100, 30);

-- --------------------------------------------------------

--
-- Table structure for table `subscription_logs`
--

DROP TABLE IF EXISTS `subscription_logs`;
CREATE TABLE IF NOT EXISTS `subscription_logs` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subscriptionId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `oldPlan` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `newPlan` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oldAmount` double DEFAULT NULL,
  `newAmount` double DEFAULT NULL,
  `oldBillingCycle` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `newBillingCycle` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `subscription_logs_subscriptionId_idx` (`subscriptionId`),
  KEY `subscription_logs_action_idx` (`action`),
  KEY `subscription_logs_createdAt_idx` (`createdAt`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subscription_logs`
--

INSERT INTO `subscription_logs` (`id`, `subscriptionId`, `action`, `oldPlan`, `newPlan`, `oldAmount`, `newAmount`, `oldBillingCycle`, `newBillingCycle`, `userId`, `reason`, `metadata`, `createdAt`) VALUES
('cmckkosh6000dcb3280d2whch', 'cmckkosgt0009cb32hkzlxg54', 'SUBSCRIPTION_CREATED', NULL, 'BASIC', NULL, 12.99, NULL, NULL, 'SYSTEM', 'Student subscription created with BASIC plan', NULL, '2025-07-01 13:37:50.635'),
('cmckkosju000jcb32qg2c4dej', 'cmckkosii000fcb32gnc3lkmb', 'SUBSCRIPTION_CREATED', NULL, 'BASIC', NULL, 12.99, NULL, NULL, 'SYSTEM', 'Student subscription created with BASIC plan', NULL, '2025-07-01 13:37:50.730'),
('cmckkosm5000pcb32biuej7m4', 'cmckkoslo000lcb323d05as3r', 'SUBSCRIPTION_CREATED', NULL, 'BASIC', NULL, 12.99, NULL, NULL, 'SYSTEM', 'Student subscription created with BASIC plan', NULL, '2025-07-01 13:37:50.813'),
('cmd0oxm2w0009p73d6nk4ouzc', 'cmd0oxm270005p73d7ocblu46', 'CREATE', NULL, 'BASIC', NULL, 12.99, NULL, 'MONTHLY', '692cfd1b-6dad-40cb-9163-956ef4bdc9f3', 'New subscription created during registration', NULL, '2025-07-12 20:20:59.529'),
('cmd0qsotk000gp73dhezbwxw5', 'cmd0qsotc000cp73dw0kd2rmy', 'CREATE', NULL, 'BASIC', NULL, 12.99, NULL, 'MONTHLY', 'ccb77175-fa66-4d1f-bbb9-0701df84384d', 'New subscription created during registration', NULL, '2025-07-12 21:13:09.033'),
('cmd0r7t65000np73d78oxgj95', 'cmd0r7t5x000jp73dpf3kdduh', 'CREATE', NULL, 'BASIC', NULL, 12.99, NULL, 'MONTHLY', 'bcd7ab98-0a9f-414f-b4f3-3307de06219e', 'New subscription created during registration', NULL, '2025-07-12 21:24:54.509'),
('cmd0rq6dq000up73dno46dlih', 'cmd0rq6de000qp73dn3b3o498', 'CREATE', NULL, 'PREMIUM', NULL, 24.99, NULL, 'MONTHLY', 'c98a0b89-011b-482f-843e-a5522de40b1e', 'New subscription created during registration', NULL, '2025-07-12 21:39:11.438'),
('cmdgrmrfr0003li90rh5ald4z', 'cmckkosgt0009cb32hkzlxg54', 'UPGRADE', 'PRO', 'BASIC', 49.99, 12.99, 'MONTHLY', 'MONTHLY', '5b5fbd13-8776-4f96-ada9-091973974873', 'Plan upgrade', NULL, '2025-07-24 02:20:50.920'),
('cmdgrp6ha0009li90gmli39l9', 'cmckkosgt0009cb32hkzlxg54', 'UPGRADE', 'BASIC', 'PREMIUM', 12.99, 24.99, 'MONTHLY', 'MONTHLY', '5b5fbd13-8776-4f96-ada9-091973974873', 'Plan upgrade', NULL, '2025-07-24 02:22:43.727'),
('cmdw7ud98000154prgz1eujct', 'cmckkosgt0009cb32hkzlxg54', 'UPGRADE', NULL, 'PREMIUM', NULL, 24.99, NULL, 'MONTHLY', '5b5fbd13-8776-4f96-ada9-091973974873', 'Plan upgrade', NULL, '2025-08-03 21:51:12.284'),
('cmea3fqet0002pl5iznrtw4jt', 'cmea3fq7g0001pl5ibe9w523c', 'CREATE', NULL, 'PREMIUM', 0, 24.99, 'MONTHLY', 'MONTHLY', '25e01806-ae0f-433b-8a38-a97021e0e3b8', 'Trial subscription created', NULL, '2025-08-13 14:56:37.494'),
('cmea83nu00002lbe645dliwhc', 'cmea83ntw0001lbe6wmct4vrq', 'CREATE', NULL, 'PREMIUM', 0, 24.99, 'MONTHLY', 'MONTHLY', '25e01806-ae0f-433b-8a38-a97021e0e3b8', 'Trial subscription created', NULL, '2025-08-13 17:07:12.361'),
('cmea8v3l50002r2ssrx4hy5su', 'cmea8v3l10001r2sse5nbhf3e', 'CREATE', NULL, 'PREMIUM', 0, 24.99, 'MONTHLY', 'MONTHLY', '25e01806-ae0f-433b-8a38-a97021e0e3b8', 'Trial subscription created', NULL, '2025-08-13 17:28:32.490'),
('cmeap393y00027wv9uibi3um1', 'cmeap393t00017wv95vi0xhv1', 'CREATE', NULL, 'PREMIUM', 0, 24.99, 'MONTHLY', 'MONTHLY', '25e01806-ae0f-433b-8a38-a97021e0e3b8', 'Trial subscription created', NULL, '2025-08-14 01:02:46.751'),
('cmeapofm10002110gixiv5bb0', 'cmeapofly0001110grc5p93iw', 'CREATE', NULL, 'PREMIUM', 0, 24.99, 'MONTHLY', 'MONTHLY', '25e01806-ae0f-433b-8a38-a97021e0e3b8', 'Trial subscription created', NULL, '2025-08-14 01:19:14.953'),
('cmeaq26mc000280y630k4nlz5', 'cmeaq26m9000180y6tpgs2yx6', 'CREATE', NULL, 'PREMIUM', 0, 24.99, 'MONTHLY', 'MONTHLY', '25e01806-ae0f-433b-8a38-a97021e0e3b8', 'Trial subscription created', NULL, '2025-08-14 01:29:56.485'),
('cmearlqa2000249m9ahu9yu9e', 'cmearlq9x000149m9k2ki9u2g', 'CREATE', NULL, 'PREMIUM', 0, 24.99, 'MONTHLY', 'MONTHLY', '25e01806-ae0f-433b-8a38-a97021e0e3b8', 'Trial subscription created', NULL, '2025-08-14 02:13:08.042'),
('cmeasi3zy000w49m93u4rrcmc', 'cmeasi3zv000v49m9oy6kkqjf', 'CREATE', NULL, 'PREMIUM', 0, 24.99, 'MONTHLY', 'MONTHLY', 'd47324a8-c823-49bc-b2dc-c567727ebafd', 'Trial subscription created', NULL, '2025-08-14 02:38:18.815'),
('cmeaswfx6001049m91cajxccc', 'cmeaswfx2000z49m981oqmynv', 'CREATE', NULL, 'PREMIUM', 0, 24.99, 'MONTHLY', 'MONTHLY', 'd47324a8-c823-49bc-b2dc-c567727ebafd', 'Trial subscription created', NULL, '2025-08-14 02:49:27.451'),
('cmeat16os001449m9xc0p5mgv', 'cmeat16op001349m9b8vhe604', 'CREATE', NULL, 'PREMIUM', 0, 24.99, 'MONTHLY', 'MONTHLY', 'd47324a8-c823-49bc-b2dc-c567727ebafd', 'Trial subscription created', NULL, '2025-08-14 02:53:08.765');

-- --------------------------------------------------------

--
-- Table structure for table `system_notifications`
--

DROP TABLE IF EXISTS `system_notifications`;
CREATE TABLE IF NOT EXISTS `system_notifications` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isGlobal` tinyint(1) NOT NULL DEFAULT '0',
  `targetRoles` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `targetInstitutions` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startDate` datetime(3) DEFAULT NULL,
  `endDate` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `createdBy` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedBy` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `system_notifications_type_idx` (`type`),
  KEY `system_notifications_priority_idx` (`priority`),
  KEY `system_notifications_isActive_idx` (`isActive`),
  KEY `system_notifications_isGlobal_idx` (`isGlobal`),
  KEY `system_notifications_startDate_idx` (`startDate`),
  KEY `system_notifications_endDate_idx` (`endDate`),
  KEY `system_notifications_createdBy_fkey` (`createdBy`),
  KEY `system_notifications_updatedBy_fkey` (`updatedBy`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
CREATE TABLE IF NOT EXISTS `tag` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `categoryId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `parentId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usageCount` int NOT NULL DEFAULT '0',
  `color` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  `priority` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `tag_slug_key` (`slug`),
  KEY `tag_categoryId_idx` (`categoryId`),
  KEY `tag_parentId_idx` (`parentId`),
  KEY `tag_name_idx` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tag`
--

INSERT INTO `tag` (`id`, `name`, `description`, `createdAt`, `updatedAt`, `categoryId`, `slug`, `parentId`, `usageCount`, `color`, `icon`, `featured`, `priority`) VALUES
('488913d7-8108-4926-a49e-c768d63f1bd6', 'Beginner', 'For beginners', '2025-06-06 00:21:37.425', '2025-07-15 11:51:09.832', NULL, 'beginner', NULL, 0, NULL, NULL, 1, 0),
('65c262ee-43e8-46e8-9be6-06c650a42d5e', 'Intermediate', 'For intermediate learners', '2025-06-06 00:21:37.438', '2025-07-15 11:51:09.845', NULL, 'intermediate', NULL, 0, NULL, NULL, 1, 0),
('2bfbd3cc-61ca-433f-99e2-81f4e14ff894', 'Advanced', 'For advanced learners', '2025-06-06 00:21:37.442', '2025-07-15 11:52:50.575', NULL, 'advanced', NULL, 0, '#000000', '', 1, 0),
('c124f18c-a86d-4d4b-b7fa-52519d3011ee', 'IELTS', 'IELTS exam prep', '2025-06-06 00:21:37.445', '2025-06-06 00:21:37.445', NULL, 'ielts', NULL, 0, NULL, NULL, 0, 0),
('175196e4-91a8-42ca-94e8-b297bfc9c896', 'TOEFL', 'TOEFL exam prep', '2025-06-06 00:21:37.450', '2025-06-06 00:21:37.450', NULL, 'toefl', NULL, 0, NULL, NULL, 0, 0),
('59a2614b-9279-46ca-a1d9-1e068f05dd96', 'Cambridge', 'Cambridge exam prep', '2025-06-06 00:21:37.456', '2025-06-06 00:21:37.456', NULL, 'cambridge', NULL, 0, NULL, NULL, 0, 0),
('dda75544-c43a-422b-a994-748e396be685', 'Speaking', 'Speaking skills', '2025-06-06 00:21:37.460', '2025-07-15 12:27:15.753', NULL, 'speaking', NULL, 0, NULL, NULL, 1, 0),
('4ad8fe74-dcb5-4a65-8184-a956b7c73d8c', 'Writing', 'Writing skills', '2025-06-06 00:21:37.465', '2025-07-15 11:51:09.476', NULL, 'writing', NULL, 0, NULL, NULL, 1, 0),
('048f677e-0e5b-4704-9415-19d10a5be921', 'Listening', 'Listening skills', '2025-06-06 00:21:37.470', '2025-07-15 11:51:09.823', NULL, 'listening', NULL, 0, NULL, NULL, 1, 0),
('c7306dac-83f1-44d4-afbd-5719e1fdad5b', 'Reading', 'Reading skills', '2025-06-06 00:21:37.481', '2025-07-15 11:51:09.817', NULL, 'reading', NULL, 0, NULL, NULL, 1, 0),
('2e5ddcdf-7a6c-490b-a052-6b094e32ef12', 'Business', 'Business English', '2025-06-06 00:21:37.488', '2025-06-06 00:21:37.489', NULL, 'business', NULL, 0, NULL, NULL, 0, 0),
('6724fbd1-241f-4ba5-9d5a-c2036d94b8fd', 'Grammar', 'Grammar focus', '2025-06-06 00:21:37.495', '2025-06-06 00:21:37.495', NULL, 'grammar', NULL, 0, NULL, NULL, 0, 0),
('67b01751-5587-4230-8d8c-118da2270485', 'Vocabulary', 'Vocabulary building', '2025-06-06 00:21:37.502', '2025-06-06 00:21:37.502', NULL, 'vocabulary', NULL, 0, NULL, NULL, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tagrelation`
--

DROP TABLE IF EXISTS `tagrelation`;
CREATE TABLE IF NOT EXISTS `tagrelation` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tagId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relatedId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `strength` int NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `tagRelation_tagId_relatedId_key` (`tagId`,`relatedId`),
  KEY `tagRelation_relatedId_idx` (`relatedId`),
  KEY `tagRelation_tagId_idx` (`tagId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `emailVerified` datetime(3) DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'STUDENT',
  `institutionId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `forcePasswordReset` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_key` (`email`),
  KEY `user_institutionId_fkey` (`institutionId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `emailVerified`, `image`, `password`, `role`, `institutionId`, `createdAt`, `updatedAt`, `status`, `forcePasswordReset`) VALUES
('0e971fe1-d22a-446e-9fb9-f52149e29df3', 'Admin User', 'pqasys@yahoo.com', NULL, NULL, '$2b$10$J4a67NQWfZdybMW2lMyf2OJbPzIBs3L2ENavPwV0PpN/04siIGEQC', 'ADMIN', NULL, '2025-06-05 23:48:39.235', '2025-06-25 14:01:40.593', 'ACTIVE', 0),
('45396883-3706-4911-82a7-440ea99655df', 'Joe Bloggs', 'jbloggs@xyz.com', NULL, NULL, '$2b$10$Gt/d1xcYXIfkSvEbgB.AP.DTjpWbPPCZ9Yb7aA3xYcan.aQaub6eK', 'INSTITUTION', '42308252-a934-4eef-b663-37a7076bb177', '2025-06-05 23:50:18.379', '2025-06-05 23:50:19.156', 'ACTIVE', 0),
('6eb107bf-b7bc-4f20-a625-a9613e0b3433', 'Tom Jones', 'tjones@abc.ac.uk', NULL, NULL, '$2b$10$BI9zqx9R6Ne5OchrGUdgX.HbdKQHJ64jVH617KpW4qa95KPPglJiu', 'INSTITUTION', 'c5962019-07ca-4a78-a97f-3cf394e5bf94', '2025-06-05 23:50:57.130', '2025-06-05 23:50:57.145', 'ACTIVE', 0),
('5b5fbd13-8776-4f96-ada9-091973974873', 'James Maybank', 'patrickmorgan001@gmail.com', NULL, '/uploads/profiles/5b5fbd13-8776-4f96-ada9-091973974873_1753302598374.jpg', '$2b$10$96BG0UkutzZF.bkxgjKQMOTlKxC/AgIHYcerN5be3TaumuKEuclcW', 'STUDENT', NULL, '2025-06-05 23:51:22.597', '2025-07-24 10:30:13.056', 'ACTIVE', 0),
('b1c0e68c-31c0-45c6-9745-4481ce5e6045', 'Grace Jones', 'grace@ges.ac.uk', NULL, NULL, '$2b$10$qdok6/a/wo9IWZcsnw2Y3On3hDBVTiAc7TTDE9X.mr6vV.8zgZABm', 'INSTITUTION', '9f71efc3-7b31-4953-b398-29f2197af202', '2025-07-01 22:02:16.480', '2025-07-01 22:02:17.507', 'ACTIVE', 0),
('c98a0b89-011b-482f-843e-a5522de40b1e', 'Nisha Test', 'nisha@sterlingcollegelondon.com', NULL, NULL, '$2b$10$270rbxzD7QcM.Csbl71mROab8x4i3hJmAPYyoLBo3Fq.GIn9VAsQq', 'STUDENT', NULL, '2025-07-12 21:39:11.400', '2025-07-12 21:39:11.400', 'ACTIVE', 0),
('ccb77175-fa66-4d1f-bbb9-0701df84384d', 'Student4', 'rodrigo@amitycollege.co.uk', NULL, NULL, '$2b$10$Y1xb73MSRSoxH/8Iyk5ch.CN3SK8YrAFX4ZmVsWuSPxl4dHT69tjG', 'STUDENT', NULL, '2025-07-12 21:13:08.978', '2025-07-12 21:13:08.978', 'ACTIVE', 0),
('5c39be61-c09b-4fb0-b6da-fad403dd2470', 'Admin User', 'admin@example.com', NULL, NULL, '$2b$10$FoPDZ6moKaZnRFy.e95wXeHjtzZB1svOepg0ms4a9K7pNDKfCfkRK', 'ADMIN', NULL, '2025-07-14 11:19:57.030', '2025-07-14 11:19:57.030', 'ACTIVE', 0),
('d00a7d05-f380-46f1-8cb4-344f0d04c0f2', 'Sarah Johnson', 'sarah.johnson@example.com', NULL, NULL, '$2b$10$LrsxTIhW3TEmcjGVM1Ce0.GAgC8iQFOcJFoPRY9hnfm6MhRvbOqau', 'INSTRUCTOR', NULL, '2025-08-02 02:28:34.380', '2025-08-02 02:28:34.380', 'ACTIVE', 0),
('4bbffaa9-d10a-446b-a837-ce9fbf5b9e4b', 'Michael Chen', 'michael.chen@example.com', NULL, NULL, '$2b$10$A22lepI2Mzy8UrokQlH5SuaLQk7GuQzOSyumjxTvag.jdDssrYdYq', 'INSTRUCTOR', NULL, '2025-08-02 02:28:34.460', '2025-08-02 02:28:34.460', 'ACTIVE', 0),
('1cd8b0b9-7976-4fb4-bff8-a47982da2d8a', 'Emma Rodriguez', 'emma.rodriguez@example.com', NULL, NULL, '$2b$10$FP35FMCtoCTFCNnXhSFjk.KtZfmjUmPkMIHC80ga7cbVEfjASPi.C', 'INSTRUCTOR', NULL, '2025-08-02 02:28:34.530', '2025-08-02 02:28:34.530', 'ACTIVE', 0),
('57e9928e-4118-4563-aea4-57b0136c52cd', 'Dr. Maria Garcia', 'maria.garcia@example.com', NULL, NULL, '$2b$10$jI640yfalClNogPqPLAKiuPptasY33GVOb.b2loVuyGMGzc.HopRi', 'INSTRUCTOR', '42308252-a934-4eef-b663-37a7076bb177', '2025-08-02 02:36:48.085', '2025-08-02 02:36:48.085', 'ACTIVE', 0),
('94dfaf16-10eb-4918-a129-185e8da28473', 'Prof. David Kim', 'david.kim@example.com', NULL, NULL, '$2b$10$dvWH82LLeOqqghNy5CNZvu9ECoWgY.w2gUFBq9rdeltXjH7VHXypm', 'INSTRUCTOR', '42308252-a934-4eef-b663-37a7076bb177', '2025-08-02 02:36:48.164', '2025-08-02 02:36:48.164', 'ACTIVE', 0),
('0339a71c-92d8-4e75-9c28-62d394d041af', 'Dr. Lisa Thompson', 'lisa.thompson@example.com', NULL, NULL, '$2b$10$UTmAQ7w5Hevq460xirr/M.SVsB2VqC5a67Yyc20lk/BzqC3ztq.Ce', 'INSTRUCTOR', 'c5962019-07ca-4a78-a97f-3cf394e5bf94', '2025-08-02 02:36:48.235', '2025-08-02 02:36:48.235', 'ACTIVE', 0),
('16fbfb4b-3854-4091-bbbe-5355e5ec2b3c', 'Test Admin', 'integration.test.admin@example.com', NULL, NULL, '$2b$10$IFomMRJ2UCUIeF0cLFk26OoM.qECeh/XuHbbyJXDycPGy4M18Eak2', 'ADMIN', NULL, '2025-08-08 00:09:00.359', '2025-08-08 00:09:00.359', 'ACTIVE', 0),
('be41ba5f-4ebf-4f8e-9344-009646ab3283', 'Test Student', 'integration.test.student@example.com', NULL, NULL, '$2b$10$IFomMRJ2UCUIeF0cLFk26OoM.qECeh/XuHbbyJXDycPGy4M18Eak2', 'STUDENT', NULL, '2025-08-08 00:09:00.366', '2025-08-08 00:09:00.366', 'ACTIVE', 0),
('5b56f446-0ec4-415d-b8b1-c2dd86ba0958', 'Test Institution', 'test@institution.com', NULL, NULL, '$2b$10$IFomMRJ2UCUIeF0cLFk26OoM.qECeh/XuHbbyJXDycPGy4M18Eak2', 'STUDENT', NULL, '2025-08-08 00:09:00.368', '2025-08-16 16:22:20.748', 'ACTIVE', 0),
('25e01806-ae0f-433b-8a38-a97021e0e3b8', 'Live Tester', 'live@test.com', NULL, NULL, '$2b$10$ry/cwlk4lG.xN4tdojVYn.6SUPHeqrj8IkWqMVXLc.DskM7.h1g22', 'STUDENT', NULL, '2025-08-09 17:14:07.747', '2025-08-10 18:03:21.914', 'ACTIVE', 0),
('d47324a8-c823-49bc-b2dc-c567727ebafd', 'Live2 Tester', 'live2@test.com', NULL, NULL, '$2b$10$UffTVPwN9KxKPEWNBGaMKO9Arz9cuQD9kbKR.yelgtHLPlF7kMW0i', 'STUDENT', NULL, '2025-08-14 02:37:19.933', '2025-08-14 02:37:19.933', 'ACTIVE', 0),
('bc4f00ee-c835-45f2-9738-e636750bcb5c', 'Test Admin', 'admin@test.com', NULL, NULL, 'hashedpassword', 'ADMIN', NULL, '2025-08-16 15:54:23.188', '2025-08-16 15:54:23.188', 'ACTIVE', 0),
('547f05f7-a4fb-4fe3-bb46-fcb984cabdef', 'Test Institution', 'institution@test.com', NULL, NULL, 'hashedpassword', 'INSTITUTION_STAFF', NULL, '2025-08-16 15:54:24.230', '2025-08-16 15:54:24.230', 'ACTIVE', 0),
('a7d8265d-f2f5-4b3d-969b-d90c4a7064bf', 'Test Suspended User', 'test@suspended.com', NULL, NULL, 'hashedpassword', 'STUDENT', NULL, '2025-08-16 16:09:09.920', '2025-08-16 16:09:09.989', 'ACTIVE', 0);

-- --------------------------------------------------------

--
-- Table structure for table `video_sessions`
--

DROP TABLE IF EXISTS `video_sessions`;
CREATE TABLE IF NOT EXISTS `video_sessions` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `sessionType` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `language` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `maxParticipants` int NOT NULL DEFAULT '10',
  `startTime` datetime(3) NOT NULL,
  `endTime` datetime(3) NOT NULL,
  `duration` int NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SCHEDULED',
  `meetingUrl` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meetingId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recordingUrl` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instructorId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institutionId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `courseId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `moduleId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` double NOT NULL DEFAULT '0',
  `isPublic` tinyint(1) NOT NULL DEFAULT '0',
  `isRecorded` tinyint(1) NOT NULL DEFAULT '0',
  `allowChat` tinyint(1) NOT NULL DEFAULT '1',
  `allowScreenShare` tinyint(1) NOT NULL DEFAULT '1',
  `allowRecording` tinyint(1) NOT NULL DEFAULT '0',
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `currency` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `features` json DEFAULT NULL,
  `isBooked` tinyint(1) NOT NULL DEFAULT '0',
  `isCancelled` tinyint(1) NOT NULL DEFAULT '0',
  `isCompleted` tinyint(1) NOT NULL DEFAULT '0',
  `materials` json DEFAULT NULL,
  `rating` float DEFAULT NULL,
  `reviews` int NOT NULL DEFAULT '0',
  `tags` json DEFAULT NULL,
  `isAutoGenerated` tinyint(1) NOT NULL DEFAULT '0',
  `isRecurring` tinyint(1) NOT NULL DEFAULT '0',
  `recurringPatternId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sessionNumber` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `video_sessions_instructorId_idx` (`instructorId`),
  KEY `video_sessions_institutionId_idx` (`institutionId`),
  KEY `video_sessions_courseId_idx` (`courseId`),
  KEY `video_sessions_startTime_idx` (`startTime`),
  KEY `video_sessions_status_idx` (`status`),
  KEY `video_sessions_language_idx` (`language`),
  KEY `video_sessions_level_idx` (`level`),
  KEY `video_sessions_moduleId_fkey` (`moduleId`),
  KEY `video_sessions_recurringPatternId_idx` (`recurringPatternId`),
  KEY `video_sessions_isRecurring_idx` (`isRecurring`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `video_sessions`
--

INSERT INTO `video_sessions` (`id`, `title`, `description`, `sessionType`, `language`, `level`, `maxParticipants`, `startTime`, `endTime`, `duration`, `status`, `meetingUrl`, `meetingId`, `recordingUrl`, `instructorId`, `institutionId`, `courseId`, `moduleId`, `price`, `isPublic`, `isRecorded`, `allowChat`, `allowScreenShare`, `allowRecording`, `metadata`, `createdAt`, `updatedAt`, `currency`, `features`, `isBooked`, `isCancelled`, `isCompleted`, `materials`, `rating`, `reviews`, `tags`, `isAutoGenerated`, `isRecurring`, `recurringPatternId`, `sessionNumber`) VALUES
('f0e07224-3bc0-4254-8b53-f0123d2052a2', 'Week 1: Spanish Conversation Practice', 'Live Spanish conversation session covering week 1 topics and vocabulary.', 'LIVE_CLASS', 'Spanish', 'ADVANCED', 15, '2024-02-07 19:00:00.000', '2024-02-07 20:30:00.000', 90, 'SCHEDULED', NULL, NULL, NULL, 'd00a7d05-f380-46f1-8cb4-344f0d04c0f2', '42308252-a934-4eef-b663-37a7076bb177', '21058bb2-c9f3-4af1-90fc-235b350f5718', NULL, 0, 0, 1, 1, 1, 0, NULL, '2025-08-07 16:04:17.358', '2025-08-07 16:04:17.358', 'USD', NULL, 0, 0, 0, NULL, NULL, 0, NULL, 0, 0, NULL, NULL),
('67368613-bbee-494d-92f7-d4f7ec4d11c8', 'Week 2: Spanish Conversation Practice', 'Live Spanish conversation session covering week 2 topics and vocabulary.', 'LIVE_CLASS', 'Spanish', 'ADVANCED', 15, '2024-02-14 19:00:00.000', '2024-02-14 20:30:00.000', 90, 'SCHEDULED', NULL, NULL, NULL, 'd00a7d05-f380-46f1-8cb4-344f0d04c0f2', '42308252-a934-4eef-b663-37a7076bb177', '21058bb2-c9f3-4af1-90fc-235b350f5718', NULL, 0, 0, 1, 1, 1, 0, NULL, '2025-08-07 16:04:17.372', '2025-08-07 16:04:17.372', 'USD', NULL, 0, 0, 0, NULL, NULL, 0, NULL, 0, 0, NULL, NULL),
('04a1530c-32fd-420b-a15b-3f24bd9eed77', 'Week 3: Spanish Conversation Practice', 'Live Spanish conversation session covering week 3 topics and vocabulary.', 'LIVE_CLASS', 'Spanish', 'ADVANCED', 15, '2024-02-21 19:00:00.000', '2024-02-21 20:30:00.000', 90, 'SCHEDULED', NULL, NULL, NULL, 'd00a7d05-f380-46f1-8cb4-344f0d04c0f2', '42308252-a934-4eef-b663-37a7076bb177', '21058bb2-c9f3-4af1-90fc-235b350f5718', NULL, 0, 0, 1, 1, 1, 0, NULL, '2025-08-07 16:04:17.376', '2025-08-07 16:04:17.376', 'USD', NULL, 0, 0, 0, NULL, NULL, 0, NULL, 0, 0, NULL, NULL),
('6aa35708-2e97-4f35-974f-2a3fe0baa9d0', 'Week 4: Spanish Conversation Practice', 'Live Spanish conversation session covering week 4 topics and vocabulary.', 'LIVE_CLASS', 'Spanish', 'ADVANCED', 15, '2024-02-28 19:00:00.000', '2024-02-28 20:30:00.000', 90, 'SCHEDULED', NULL, NULL, NULL, 'd00a7d05-f380-46f1-8cb4-344f0d04c0f2', '42308252-a934-4eef-b663-37a7076bb177', '21058bb2-c9f3-4af1-90fc-235b350f5718', NULL, 0, 0, 1, 1, 1, 0, NULL, '2025-08-07 16:04:17.382', '2025-08-07 16:04:17.382', 'USD', NULL, 0, 0, 0, NULL, NULL, 0, NULL, 0, 0, NULL, NULL),
('d4c6ec04-e601-4ee6-ab04-721ad946db0e', 'Week 5: Spanish Conversation Practice', 'Live Spanish conversation session covering week 5 topics and vocabulary.', 'LECTURE', 'es', 'ADVANCED', 15, '2025-10-28 19:00:00.000', '2025-12-20 20:30:00.000', 90, 'SCHEDULED', NULL, NULL, NULL, 'd00a7d05-f380-46f1-8cb4-344f0d04c0f2', '42308252-a934-4eef-b663-37a7076bb177', '21058bb2-c9f3-4af1-90fc-235b350f5718', NULL, 0, 0, 1, 1, 1, 1, NULL, '2025-08-07 16:04:17.386', '2025-08-19 00:04:17.829', 'USD', '[\"File Sharing\", \"Breakout Rooms\"]', 0, 0, 0, '[]', NULL, 0, '[]', 0, 0, NULL, NULL),
('bf03aae4-02a1-45b1-9c0e-e8bafb057c7f', 'Week 6: Spanish Conversation Practice', 'Live Spanish conversation session covering week 6 topics and vocabulary.', 'LIVE_CLASS', 'Spanish', 'ADVANCED', 15, '2024-03-13 19:00:00.000', '2024-03-13 20:30:00.000', 90, 'SCHEDULED', NULL, NULL, NULL, 'd00a7d05-f380-46f1-8cb4-344f0d04c0f2', '42308252-a934-4eef-b663-37a7076bb177', '21058bb2-c9f3-4af1-90fc-235b350f5718', NULL, 0, 0, 1, 1, 1, 0, NULL, '2025-08-07 16:04:17.395', '2025-08-07 16:04:17.395', 'USD', NULL, 0, 0, 0, NULL, NULL, 0, NULL, 0, 0, NULL, NULL),
('262123b0-55f8-47f2-909b-623ff84ee6ce', 'Week 7: Spanish Conversation Practice', 'Live Spanish conversation session covering week 7 topics and vocabulary.', 'LIVE_CLASS', 'Spanish', 'ADVANCED', 15, '2024-03-20 19:00:00.000', '2024-03-20 20:30:00.000', 90, 'SCHEDULED', NULL, NULL, NULL, 'd00a7d05-f380-46f1-8cb4-344f0d04c0f2', '42308252-a934-4eef-b663-37a7076bb177', '21058bb2-c9f3-4af1-90fc-235b350f5718', NULL, 0, 0, 1, 1, 1, 0, NULL, '2025-08-07 16:04:17.402', '2025-08-07 16:04:17.402', 'USD', NULL, 0, 0, 0, NULL, NULL, 0, NULL, 0, 0, NULL, NULL),
('1900d994-3fb5-43bc-8e47-2d7fd15ccb42', 'Week 8: Spanish Conversation Practice', 'Live Spanish conversation session covering week 8 topics and vocabulary.', 'LIVE_CLASS', 'Spanish', 'ADVANCED', 15, '2024-03-27 19:00:00.000', '2024-03-27 20:30:00.000', 90, 'SCHEDULED', NULL, NULL, NULL, 'd00a7d05-f380-46f1-8cb4-344f0d04c0f2', '42308252-a934-4eef-b663-37a7076bb177', '21058bb2-c9f3-4af1-90fc-235b350f5718', NULL, 0, 0, 1, 1, 1, 0, NULL, '2025-08-07 16:04:17.408', '2025-08-07 16:04:17.408', 'USD', NULL, 0, 0, 0, NULL, NULL, 0, NULL, 0, 0, NULL, NULL),
('773a6a7d-7cb5-405a-9bcb-93cb09bc55c4', 'Week 9: Spanish Conversation Practice', 'Live Spanish conversation session covering week 9 topics and vocabulary.', 'LIVE_CLASS', 'Spanish', 'ADVANCED', 15, '2024-04-03 18:00:00.000', '2024-04-03 19:30:00.000', 90, 'SCHEDULED', NULL, NULL, NULL, 'd00a7d05-f380-46f1-8cb4-344f0d04c0f2', '42308252-a934-4eef-b663-37a7076bb177', '21058bb2-c9f3-4af1-90fc-235b350f5718', NULL, 0, 0, 1, 1, 1, 0, NULL, '2025-08-07 16:04:17.413', '2025-08-07 16:04:17.413', 'USD', NULL, 0, 0, 0, NULL, NULL, 0, NULL, 0, 0, NULL, NULL),
('0b943d34-96f8-42a3-9030-942c8b3baeb8', 'Week 10: Spanish Conversation Practice', 'Live Spanish conversation session covering week 10 topics and vocabulary.', 'LIVE_CLASS', 'Spanish', 'ADVANCED', 15, '2024-04-10 18:00:00.000', '2024-04-10 19:30:00.000', 90, 'SCHEDULED', NULL, NULL, NULL, 'd00a7d05-f380-46f1-8cb4-344f0d04c0f2', '42308252-a934-4eef-b663-37a7076bb177', '21058bb2-c9f3-4af1-90fc-235b350f5718', NULL, 0, 0, 1, 1, 1, 0, NULL, '2025-08-07 16:04:17.428', '2025-08-07 16:04:17.428', 'USD', NULL, 0, 0, 0, NULL, NULL, 0, NULL, 0, 0, NULL, NULL),
('9123d065-46fa-4c13-8a94-154806eb19f8', 'Week 11: Spanish Conversation Practice', 'Live Spanish conversation session covering week 11 topics and vocabulary.', 'LIVE_CLASS', 'Spanish', 'ADVANCED', 15, '2024-04-17 18:00:00.000', '2024-04-17 19:30:00.000', 90, 'SCHEDULED', NULL, NULL, NULL, 'd00a7d05-f380-46f1-8cb4-344f0d04c0f2', '42308252-a934-4eef-b663-37a7076bb177', '21058bb2-c9f3-4af1-90fc-235b350f5718', NULL, 0, 0, 1, 1, 1, 0, NULL, '2025-08-07 16:04:17.432', '2025-08-07 16:04:17.432', 'USD', NULL, 0, 0, 0, NULL, NULL, 0, NULL, 0, 0, NULL, NULL),
('d98d1298-cf3a-4e20-a687-e92ed364019e', 'Week 12: Spanish Conversation Practice', 'Live Spanish conversation session covering week 12 topics and vocabulary.', 'LIVE_CLASS', 'Spanish', 'ADVANCED', 15, '2024-04-24 18:00:00.000', '2024-04-24 19:30:00.000', 90, 'SCHEDULED', NULL, NULL, NULL, 'd00a7d05-f380-46f1-8cb4-344f0d04c0f2', '42308252-a934-4eef-b663-37a7076bb177', '21058bb2-c9f3-4af1-90fc-235b350f5718', NULL, 0, 0, 1, 1, 1, 0, NULL, '2025-08-07 16:04:17.435', '2025-08-07 16:04:17.435', 'USD', NULL, 0, 0, 0, NULL, NULL, 0, NULL, 0, 0, NULL, NULL),
('4c7f9e24-24e4-4b05-a710-30caa99a7025', 'Week 1: Global English Mastery', 'Live English learning session with international participants.', 'LIVE_CLASS', 'English', 'INTERMEDIATE', 25, '2024-02-03 14:00:00.000', '2024-02-03 16:00:00.000', 120, 'SCHEDULED', NULL, NULL, NULL, 'd00a7d05-f380-46f1-8cb4-344f0d04c0f2', NULL, 'c35b2490-a08e-4c29-9d28-30735f91bd1f', NULL, 0, 1, 1, 1, 1, 0, NULL, '2025-08-07 16:04:17.446', '2025-08-07 16:04:17.446', 'USD', NULL, 0, 0, 0, NULL, NULL, 0, NULL, 0, 0, NULL, NULL),
('e92c3b99-19f3-4c35-80e3-e6c2ff449528', 'Week 2: Global English Mastery', 'Live English learning session with international participants.', 'LIVE_CLASS', 'English', 'INTERMEDIATE', 25, '2024-02-17 14:00:00.000', '2024-02-17 16:00:00.000', 120, 'SCHEDULED', NULL, NULL, NULL, 'd00a7d05-f380-46f1-8cb4-344f0d04c0f2', NULL, 'c35b2490-a08e-4c29-9d28-30735f91bd1f', NULL, 0, 1, 1, 1, 1, 0, NULL, '2025-08-07 16:04:17.451', '2025-08-07 16:04:17.451', 'USD', NULL, 0, 0, 0, NULL, NULL, 0, NULL, 0, 0, NULL, NULL),
('81d7352e-8ede-4552-a65d-5f470825cedf', 'Week 3: Global English Mastery', 'Live English learning session with international participants.', 'LIVE_CLASS', 'English', 'INTERMEDIATE', 25, '2024-03-02 14:00:00.000', '2024-03-02 16:00:00.000', 120, 'SCHEDULED', NULL, NULL, NULL, 'd00a7d05-f380-46f1-8cb4-344f0d04c0f2', NULL, 'c35b2490-a08e-4c29-9d28-30735f91bd1f', NULL, 0, 1, 1, 1, 1, 0, NULL, '2025-08-07 16:04:17.456', '2025-08-07 16:04:17.456', 'USD', NULL, 0, 0, 0, NULL, NULL, 0, NULL, 0, 0, NULL, NULL),
('02672128-23a1-4968-ac68-c790830ac30a', 'Week 4: Global English Mastery', 'Live English learning session with international participants.', 'LIVE_CLASS', 'English', 'INTERMEDIATE', 25, '2024-03-16 14:00:00.000', '2024-03-16 16:00:00.000', 120, 'SCHEDULED', NULL, NULL, NULL, 'd00a7d05-f380-46f1-8cb4-344f0d04c0f2', NULL, 'c35b2490-a08e-4c29-9d28-30735f91bd1f', NULL, 0, 1, 1, 1, 1, 0, NULL, '2025-08-07 16:04:17.461', '2025-08-07 16:04:17.461', 'USD', NULL, 0, 0, 0, NULL, NULL, 0, NULL, 0, 0, NULL, NULL),
('c3b6a20f-6881-40b3-bd09-96afdc24f9c1', 'Week 5: Global English Mastery', 'Live English learning session with international participants.', 'LIVE_CLASS', 'English', 'INTERMEDIATE', 25, '2024-03-30 14:00:00.000', '2024-03-30 16:00:00.000', 120, 'SCHEDULED', NULL, NULL, NULL, 'd00a7d05-f380-46f1-8cb4-344f0d04c0f2', NULL, 'c35b2490-a08e-4c29-9d28-30735f91bd1f', NULL, 0, 1, 1, 1, 1, 0, NULL, '2025-08-07 16:04:17.465', '2025-08-07 16:04:17.465', 'USD', NULL, 0, 0, 0, NULL, NULL, 0, NULL, 0, 0, NULL, NULL),
('c314db13-f3f1-42fc-96c9-64039dfca93e', 'Week 6: Global English Mastery', 'Live English learning session with international participants.', 'LIVE_CLASS', 'English', 'INTERMEDIATE', 25, '2024-04-13 13:00:00.000', '2024-04-13 15:00:00.000', 120, 'SCHEDULED', NULL, NULL, NULL, 'd00a7d05-f380-46f1-8cb4-344f0d04c0f2', NULL, 'c35b2490-a08e-4c29-9d28-30735f91bd1f', NULL, 0, 1, 1, 1, 1, 0, NULL, '2025-08-07 16:04:17.468', '2025-08-07 16:04:17.468', 'USD', NULL, 0, 0, 0, NULL, NULL, 0, NULL, 0, 0, NULL, NULL),
('58485146-963e-4ef7-9cfe-bd7b415b5d0f', 'Week 7: Global English Mastery', 'Live English learning session with international participants.', 'LIVE_CLASS', 'English', 'INTERMEDIATE', 25, '2024-01-27 13:00:00.000', '2024-04-27 22:00:00.000', 118, 'SCHEDULED', NULL, NULL, NULL, 'd00a7d05-f380-46f1-8cb4-344f0d04c0f2', NULL, 'c35b2490-a08e-4c29-9d28-30735f91bd1f', NULL, 0, 1, 1, 1, 1, 0, NULL, '2025-08-07 16:04:17.476', '2025-08-18 23:01:51.599', 'USD', NULL, 0, 0, 0, NULL, NULL, 0, NULL, 0, 0, NULL, NULL),
('6d610fd7-00c6-4c2c-8942-46f446df812c', 'Week 8: Global English Mastery', 'Live English learning session with international participants.', 'LIVE_CLASS', 'English', 'INTERMEDIATE', 25, '2024-08-19 11:00:00.000', '2024-12-19 15:00:00.000', 120, 'SCHEDULED', NULL, NULL, NULL, 'd00a7d05-f380-46f1-8cb4-344f0d04c0f2', NULL, 'c35b2490-a08e-4c29-9d28-30735f91bd1f', NULL, 0, 1, 1, 1, 1, 0, NULL, '2025-08-07 16:04:17.481', '2025-08-18 23:00:34.061', 'USD', NULL, 0, 0, 0, NULL, NULL, 0, NULL, 0, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `video_session_messages`
--

DROP TABLE IF EXISTS `video_session_messages`;
CREATE TABLE IF NOT EXISTS `video_session_messages` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sessionId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `messageType` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `isPrivate` tinyint(1) NOT NULL DEFAULT '0',
  `recipientId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `video_session_messages_sessionId_idx` (`sessionId`),
  KEY `video_session_messages_userId_idx` (`userId`),
  KEY `video_session_messages_timestamp_idx` (`timestamp`),
  KEY `video_session_messages_recipientId_fkey` (`recipientId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `video_session_participants`
--

DROP TABLE IF EXISTS `video_session_participants`;
CREATE TABLE IF NOT EXISTS `video_session_participants` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sessionId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PARTICIPANT',
  `joinedAt` datetime(3) DEFAULT NULL,
  `leftAt` datetime(3) DEFAULT NULL,
  `duration` int NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '0',
  `deviceInfo` json DEFAULT NULL,
  `connectionQuality` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastSeen` datetime(3) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `attendanceType` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'REGULAR',
  `quotaUsed` tinyint(1) NOT NULL DEFAULT '0',
  `subscriptionId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `video_session_participants_sessionId_userId_key` (`sessionId`,`userId`),
  KEY `video_session_participants_sessionId_idx` (`sessionId`),
  KEY `video_session_participants_userId_idx` (`userId`),
  KEY `video_session_participants_isActive_idx` (`isActive`),
  KEY `video_session_participants_subscriptionId_idx` (`subscriptionId`),
  KEY `video_session_participants_quotaUsed_idx` (`quotaUsed`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `video_session_recordings`
--

DROP TABLE IF EXISTS `video_session_recordings`;
CREATE TABLE IF NOT EXISTS `video_session_recordings` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sessionId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `recordingUrl` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` int NOT NULL,
  `fileSize` int NOT NULL,
  `quality` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PROCESSING',
  `thumbnailUrl` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transcript` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `video_session_recordings_sessionId_idx` (`sessionId`),
  KEY `video_session_recordings_status_idx` (`status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('0249bcf8-13b8-4657-93f3-2d3708995f1c', '0e4b9e0585223293ab765ccdba72a034b6decfd2ff8efaff77b4e3d5318d3aed', '2025-06-05 23:28:43.237', '20250605232703_init', NULL, NULL, '2025-06-05 23:28:36.626', 1),
('8ecc09ef-2b8e-46d5-a193-a1692856bc85', '151f6ee737722a2fe2d8b8d70070fb9ac3258aeffc2fec0ca9c2a270785b247a', '2025-06-05 23:29:03.417', '20250605232858_institution_model_update', NULL, NULL, '2025-06-05 23:28:58.877', 1),
('f36f5961-c20a-4b41-b7b5-62da4b940df7', '3a64e911a1809c9040ee6766ef0da884fa02b387dea3dc7172277204f04767d5', '2025-06-05 23:42:20.025', '20250605234215_add_discount_settings', NULL, NULL, '2025-06-05 23:42:15.657', 1),
('6519370f-3186-479d-816d-473603eb6041', '8fa39024aadd79858c4a2273e81461fa32350a254b90ea2f6fe64030c529dedb', '2025-06-06 17:41:44.001', '20250606174122_add_changed_by_user_relation', NULL, NULL, '2025-06-06 17:41:22.495', 1),
('57cf47f5-ed0d-4037-954a-be7d5eccedc4', '83a41b833063d93f8760a4746185f9af3f31b02fe6d6ed80fcb2bb23374b7bfe', '2025-06-07 03:01:19.506', '20250607030057_add_monthly_prices_relation', NULL, NULL, '2025-06-07 03:00:57.976', 1),
('4ba779f4-f2a8-4125-be72-213e2ad9e086', '9d86efd8be7ce3515988795d6c6d13abd0696798c5f61183149a6552397693ce', '2025-06-13 22:31:28.979', '20250613223050_add_module_relations', NULL, NULL, '2025-06-13 22:30:50.413', 1),
('b96d3633-cff5-4a4b-b5c5-32ac62c7790d', '2faeb77e437e12382fe945d342b20f86488b3372ee356e676cf4328feefb7de8', '2025-08-15 10:19:12.897', '20240320000001_add_module_progress_safe', '', NULL, '2025-08-15 10:19:12.897', 0),
('7284963b-c0b1-4d56-8de2-ce3140eb493d', '6dc0977158a372e0157f3913d252eecf047c745712c00455ec4b66bde1a3d500', '2025-08-15 10:19:19.419', '20250101000000_add_pending_websocket_notifications', '', NULL, '2025-08-15 10:19:19.419', 0),
('96f4fb57-62ea-4e45-9b22-efc30fc48e96', '293c45beb835c3940d76d13ed560eac930cc0c665a70e0c81f757ddd8e0faf7b', '2025-08-15 10:19:26.939', '20250101000001_add_course_performance_indexes', '', NULL, '2025-08-15 10:19:26.939', 0),
('55cf0881-2fc4-4dd3-924b-71746c6eda5b', 'f2cfd7c352e8f8dda4b30471ddc3fd4ff345aae0144b4eea797096d691ee9b05', '2025-08-15 10:19:33.748', '20250616005425_init', '', NULL, '2025-08-15 10:19:33.748', 0);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
