-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 14, 2025 at 09:11 PM
-- Server version: 8.0.31
-- PHP Version: 8.1.13

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
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `allowInstitutionPaymentApproval` tinyint(1) NOT NULL DEFAULT '1',
  `showInstitutionApprovalButtons` tinyint(1) NOT NULL DEFAULT '1',
  `defaultPaymentStatus` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `institutionApprovableMethods` json NOT NULL,
  `adminOnlyMethods` json NOT NULL,
  `institutionPaymentApprovalExemptions` json NOT NULL,
  `fileUploadMaxSizeMB` int NOT NULL DEFAULT '10',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `advertising_items`
--

DROP TABLE IF EXISTS `advertising_items`;
CREATE TABLE IF NOT EXISTS `advertising_items` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ctaText` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ctaLink` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `targetAudience` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `targetLocation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `targetDevice` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startDate` datetime(3) DEFAULT NULL,
  `endDate` datetime(3) DEFAULT NULL,
  `maxImpressions` int DEFAULT NULL,
  `currentImpressions` int NOT NULL DEFAULT '0',
  `maxClicks` int DEFAULT NULL,
  `currentClicks` int NOT NULL DEFAULT '0',
  `designConfigId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isApproved` tinyint(1) NOT NULL DEFAULT '0',
  `createdBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resource` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resourceId` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `details` json DEFAULT NULL,
  `ipAddress` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userAgent` text COLLATE utf8mb4_unicode_ci,
  `sessionId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `severity` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institutionId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `studentId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stateVersion` int NOT NULL DEFAULT '1',
  `version` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `Booking_courseId_fkey` (`courseId`),
  KEY `Booking_institutionId_fkey` (`institutionId`),
  KEY `Booking_studentId_fkey` (`studentId`),
  KEY `Booking_userId_fkey` (`userId`),
  KEY `idx_booking_course_id` (`courseId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `slug` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_slug_key` (`slug`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `commissionratelog`
--

DROP TABLE IF EXISTS `commissionratelog`;
CREATE TABLE IF NOT EXISTS `commissionratelog` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institutionId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `previousRate` double NOT NULL,
  `newRate` double NOT NULL,
  `changedBy` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci,
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
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `planType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `commissionRate` double NOT NULL,
  `features` json NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `billingCycle` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MONTHLY',
  `maxStudents` int NOT NULL DEFAULT '10',
  `maxCourses` int NOT NULL DEFAULT '5',
  `maxTeachers` int NOT NULL DEFAULT '2',
  PRIMARY KEY (`id`),
  UNIQUE KEY `commission_tiers_planType_key` (`planType`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `content_items`
--

DROP TABLE IF EXISTS `content_items`;
CREATE TABLE IF NOT EXISTS `content_items` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('VIDEO','AUDIO','IMAGE','DOCUMENT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_index` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_content_items_module_id` (`module_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
CREATE TABLE IF NOT EXISTS `course` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `duration` int NOT NULL,
  `level` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institutionId` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoryId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `maxStudents` int NOT NULL DEFAULT '15',
  `base_price` double NOT NULL DEFAULT '0',
  `pricingPeriod` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'WEEKLY',
  `framework` enum('CEFR','ACTFL','JLPT','HSK','TOPIK') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CEFR',
  `isFeatured` tinyint(1) NOT NULL DEFAULT '0',
  `isSponsored` tinyint(1) NOT NULL DEFAULT '0',
  `priority` int NOT NULL DEFAULT '0',
  `hasLiveClasses` tinyint(1) NOT NULL DEFAULT '0',
  `liveClassType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `liveClassFrequency` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `liveClassSchedule` json DEFAULT NULL,
  `isPlatformCourse` tinyint(1) NOT NULL DEFAULT '0',
  `requiresSubscription` tinyint(1) NOT NULL DEFAULT '0',
  `subscriptionTier` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `marketingType` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SELF_PACED',
  `marketingDescription` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
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
  KEY `course_marketingType_idx` (`marketingType`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coursetag`
--

DROP TABLE IF EXISTS `coursetag`;
CREATE TABLE IF NOT EXISTS `coursetag` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tagId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `coursetag_courseId_tagId_key` (`courseId`,`tagId`),
  KEY `coursetag_courseId_idx` (`courseId`),
  KEY `coursetag_tagId_idx` (`tagId`),
  KEY `idx_course_tag_course_id` (`courseId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_monthly_price`
--

DROP TABLE IF EXISTS `course_monthly_price`;
CREATE TABLE IF NOT EXISTS `course_monthly_price` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ruleType` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `weekNumber` int NOT NULL,
  `year` int NOT NULL,
  `price` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `course_weekly_prices_courseId_idx` (`courseId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `design_configs`
--

DROP TABLE IF EXISTS `design_configs`;
CREATE TABLE IF NOT EXISTS `design_configs` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `backgroundType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'solid',
  `backgroundColor` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#ffffff',
  `backgroundGradientFrom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#667eea',
  `backgroundGradientTo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#764ba2',
  `backgroundGradientDirection` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'to-r',
  `backgroundImage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `backgroundPattern` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none',
  `backgroundOpacity` int NOT NULL DEFAULT '100',
  `titleFont` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'inter',
  `titleSize` int NOT NULL DEFAULT '16',
  `titleWeight` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'semibold',
  `titleColor` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#1f2937',
  `titleAlignment` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'left',
  `titleShadow` tinyint(1) NOT NULL DEFAULT '0',
  `titleShadowColor` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#000000',
  `descriptionFont` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'inter',
  `descriptionSize` int NOT NULL DEFAULT '14',
  `descriptionColor` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#6b7280',
  `descriptionAlignment` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'left',
  `padding` int NOT NULL DEFAULT '16',
  `borderRadius` int NOT NULL DEFAULT '8',
  `borderWidth` int NOT NULL DEFAULT '1',
  `borderColor` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#e5e7eb',
  `borderStyle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'solid',
  `shadow` tinyint(1) NOT NULL DEFAULT '1',
  `shadowColor` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'rgba(0, 0, 0, 0.1)',
  `shadowBlur` int NOT NULL DEFAULT '10',
  `shadowOffset` int NOT NULL DEFAULT '4',
  `hoverEffect` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'scale',
  `animationDuration` int NOT NULL DEFAULT '300',
  `customCSS` text COLLATE utf8mb4_unicode_ci,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `createdBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `design_templates`
--

DROP TABLE IF EXISTS `design_templates`;
CREATE TABLE IF NOT EXISTS `design_templates` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `config` json NOT NULL,
  `previewImage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usageCount` int NOT NULL DEFAULT '0',
  `isPublic` tinyint(1) NOT NULL DEFAULT '0',
  `createdBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `host` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `port` int NOT NULL,
  `secure` tinyint(1) NOT NULL DEFAULT '1',
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fromEmail` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fromName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `rejectUnauthorized` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exercises`
--

DROP TABLE IF EXISTS `exercises`;
CREATE TABLE IF NOT EXISTS `exercises` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('MULTIPLE_CHOICE','FILL_IN_BLANK','MATCHING','SHORT_ANSWER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` json DEFAULT NULL,
  `order_index` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `answer` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_exercises_module_id` (`module_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exercise_attempts`
--

DROP TABLE IF EXISTS `exercise_attempts`;
CREATE TABLE IF NOT EXISTS `exercise_attempts` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `exerciseId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userAnswer` text COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postcode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `institutionEmail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactJobTitle` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactPhone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactEmail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logoUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facilities` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `isApproved` tinyint(1) NOT NULL DEFAULT '0',
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `commissionRate` float NOT NULL DEFAULT '10',
  `discountSettings` json DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `socialMedia` json DEFAULT NULL,
  `defaultMaxStudents` int NOT NULL DEFAULT '15',
  `stripeCustomerId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mainImageUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subscriptionPlan` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BASIC',
  `isFeatured` tinyint(1) NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `institution_billing_history`
--

DROP TABLE IF EXISTS `institution_billing_history`;
CREATE TABLE IF NOT EXISTS `institution_billing_history` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subscriptionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `billingDate` datetime(3) NOT NULL,
  `amount` double NOT NULL,
  `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `paymentMethod` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transactionId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoiceNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `institution_billing_history_subscriptionId_idx` (`subscriptionId`),
  KEY `institution_billing_history_billingDate_idx` (`billingDate`),
  KEY `institution_billing_history_status_idx` (`status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `institution_commissions`
--

DROP TABLE IF EXISTS `institution_commissions`;
CREATE TABLE IF NOT EXISTS `institution_commissions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institutionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rate` double NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `institution_commissions_institutionId_key` (`institutionId`),
  KEY `institution_commissions_institutionId_idx` (`institutionId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `institution_payouts`
--

DROP TABLE IF EXISTS `institution_payouts`;
CREATE TABLE IF NOT EXISTS `institution_payouts` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institutionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `enrollmentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `institution_payouts_enrollmentId_idx` (`enrollmentId`),
  KEY `institution_payouts_institutionId_idx` (`institutionId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `institution_permissions`
--

DROP TABLE IF EXISTS `institution_permissions`;
CREATE TABLE IF NOT EXISTS `institution_permissions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institutionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
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

-- --------------------------------------------------------

--
-- Table structure for table `institution_subscriptions`
--

DROP TABLE IF EXISTS `institution_subscriptions`;
CREATE TABLE IF NOT EXISTS `institution_subscriptions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institutionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `startDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `endDate` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `autoRenew` tinyint(1) NOT NULL DEFAULT '1',
  `cancellationReason` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cancelledAt` datetime(3) DEFAULT NULL,
  `commissionTierId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `institution_subscriptions_institutionId_key` (`institutionId`),
  KEY `institution_subscriptions_institutionId_idx` (`institutionId`),
  KEY `institution_subscriptions_status_idx` (`status`),
  KEY `institution_subscriptions_endDate_idx` (`endDate`),
  KEY `institution_subscriptions_commissionTierId_fkey` (`commissionTierId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `institution_subscription_logs`
--

DROP TABLE IF EXISTS `institution_subscription_logs`;
CREATE TABLE IF NOT EXISTS `institution_subscription_logs` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subscriptionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `oldPlan` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `newPlan` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oldAmount` double DEFAULT NULL,
  `newAmount` double DEFAULT NULL,
  `oldBillingCycle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `newBillingCycle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `institution_subscription_logs_subscriptionId_idx` (`subscriptionId`),
  KEY `institution_subscription_logs_action_idx` (`action`),
  KEY `institution_subscription_logs_createdAt_idx` (`createdAt`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `language_proficiency_questions`
--

DROP TABLE IF EXISTS `language_proficiency_questions`;
CREATE TABLE IF NOT EXISTS `language_proficiency_questions` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bankId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `difficulty` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `question` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` json NOT NULL,
  `correctAnswer` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `explanation` text COLLATE utf8mb4_unicode_ci,
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

-- --------------------------------------------------------

--
-- Table structure for table `language_proficiency_question_banks`
--

DROP TABLE IF EXISTS `language_proficiency_question_banks`;
CREATE TABLE IF NOT EXISTS `language_proficiency_question_banks` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `languageCode` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `totalQuestions` int NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `language_proficiency_question_banks_languageCode_key` (`languageCode`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `language_proficiency_test_attempts`
--

DROP TABLE IF EXISTS `language_proficiency_test_attempts`;
CREATE TABLE IF NOT EXISTS `language_proficiency_test_attempts` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `languageCode` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `score` int NOT NULL,
  `level` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institutionId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `eventType` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `userAgent` text COLLATE utf8mb4_unicode_ci,
  `referrer` text COLLATE utf8mb4_unicode_ci,
  `sessionId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactValue` text COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lead_events_institutionId_idx` (`institutionId`),
  KEY `lead_events_eventType_idx` (`eventType`),
  KEY `lead_events_timestamp_idx` (`timestamp`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `learning_sessions`
--

DROP TABLE IF EXISTS `learning_sessions`;
CREATE TABLE IF NOT EXISTS `learning_sessions` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `moduleProgressId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `endedAt` datetime(3) DEFAULT NULL,
  `duration` int NOT NULL DEFAULT '0',
  `activityType` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  `notes` text COLLATE utf8mb4_unicode_ci,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `conversationType` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `language` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startTime` datetime(3) NOT NULL,
  `endTime` datetime(3) NOT NULL,
  `duration` int NOT NULL,
  `maxParticipants` int NOT NULL DEFAULT '8',
  `currentParticipants` int NOT NULL DEFAULT '0',
  `price` double NOT NULL DEFAULT '0',
  `isPublic` tinyint(1) NOT NULL DEFAULT '1',
  `isFree` tinyint(1) NOT NULL DEFAULT '0',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SCHEDULED',
  `meetingUrl` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meetingId` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meetingPassword` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instructorId` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hostId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `topic` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `culturalNotes` text COLLATE utf8mb4_unicode_ci,
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

-- --------------------------------------------------------

--
-- Table structure for table `live_conversation_bookings`
--

DROP TABLE IF EXISTS `live_conversation_bookings`;
CREATE TABLE IF NOT EXISTS `live_conversation_bookings` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `conversationId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CONFIRMED',
  `bookedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `cancelledAt` datetime(3) DEFAULT NULL,
  `paymentStatus` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PAID',
  `amount` double NOT NULL DEFAULT '0',
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `paymentMethod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transactionId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refundReason` text COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `live_conversation_bookings_conversationId_userId_key` (`conversationId`,`userId`),
  KEY `live_conversation_bookings_conversationId_idx` (`conversationId`),
  KEY `live_conversation_bookings_status_idx` (`status`),
  KEY `live_conversation_bookings_paymentStatus_idx` (`paymentStatus`),
  KEY `live_conversation_bookings_userId_idx` (`userId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `live_conversation_messages`
--

DROP TABLE IF EXISTS `live_conversation_messages`;
CREATE TABLE IF NOT EXISTS `live_conversation_messages` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `conversationId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `senderId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipientId` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `messageType` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TEXT',
  `language` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isTranslation` tinyint(1) NOT NULL DEFAULT '0',
  `originalMessage` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `conversationId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `joinedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `leftAt` datetime(3) DEFAULT NULL,
  `duration` int NOT NULL DEFAULT '0',
  `isInstructor` tinyint(1) NOT NULL DEFAULT '0',
  `isHost` tinyint(1) NOT NULL DEFAULT '0',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'JOINED',
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `level` enum('CEFR_A1','CEFR_A2','CEFR_B1','CEFR_B2','CEFR_C1','CEFR_C2','ACTFL_NOVICE_LOW','ACTFL_NOVICE_MID','ACTFL_NOVICE_HIGH','ACTFL_INTERMEDIATE_LOW','ACTFL_INTERMEDIATE_MID','ACTFL_INTERMEDIATE_HIGH','ACTFL_ADVANCED_LOW','ACTFL_ADVANCED_MID','ACTFL_ADVANCED_HIGH','ACTFL_SUPERIOR','JLPT_N5','JLPT_N4','JLPT_N3','JLPT_N2','JLPT_N1','HSK_1','HSK_2','HSK_3','HSK_4','HSK_5','HSK_6','TOPIK_1','TOPIK_2','TOPIK_3','TOPIK_4','TOPIK_5','TOPIK_6') COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_index` int NOT NULL DEFAULT '0',
  `estimated_duration` int NOT NULL DEFAULT '0',
  `vocabulary_list` text COLLATE utf8mb4_unicode_ci,
  `grammar_points` text COLLATE utf8mb4_unicode_ci,
  `cultural_notes` text COLLATE utf8mb4_unicode_ci,
  `is_published` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_modules_course_id` (`course_id`),
  KEY `idx_modules_order_index` (`order_index`),
  KEY `idx_modules_course_order` (`course_id`,`order_index`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `module_progress`
--

DROP TABLE IF EXISTS `module_progress`;
CREATE TABLE IF NOT EXISTS `module_progress` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `moduleId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contentCompleted` tinyint(1) NOT NULL DEFAULT '0',
  `exercisesCompleted` tinyint(1) NOT NULL DEFAULT '0',
  `quizCompleted` tinyint(1) NOT NULL DEFAULT '0',
  `startedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `completedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `difficultyRating` int DEFAULT NULL,
  `feedback` text COLLATE utf8mb4_unicode_ci,
  `lastAccessedAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `notes` text COLLATE utf8mb4_unicode_ci,
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

-- --------------------------------------------------------

--
-- Table structure for table `module_skills`
--

DROP TABLE IF EXISTS `module_skills`;
CREATE TABLE IF NOT EXISTS `module_skills` (
  `module_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skill` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`module_id`,`skill`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification_logs`
--

DROP TABLE IF EXISTS `notification_logs`;
CREATE TABLE IF NOT EXISTS `notification_logs` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `templateId` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recipientId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipientEmail` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipientName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `errorMessage` text COLLATE utf8mb4_unicode_ci,
  `sentAt` datetime(3) DEFAULT NULL,
  `readAt` datetime(3) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdBy` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notification_logs_recipientId_idx` (`recipientId`),
  KEY `notification_logs_type_idx` (`type`),
  KEY `notification_logs_status_idx` (`status`),
  KEY `notification_logs_sentAt_idx` (`sentAt`),
  KEY `notification_logs_templateId_idx` (`templateId`),
  KEY `notification_logs_createdBy_fkey` (`createdBy`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification_templates`
--

DROP TABLE IF EXISTS `notification_templates`;
CREATE TABLE IF NOT EXISTS `notification_templates` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `variables` json DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `createdBy` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedBy` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `notification_templates_name_key` (`name`),
  KEY `notification_templates_type_idx` (`type`),
  KEY `notification_templates_category_idx` (`category`),
  KEY `notification_templates_isActive_idx` (`isActive`),
  KEY `notification_templates_createdBy_fkey` (`createdBy`),
  KEY `notification_templates_updatedBy_fkey` (`updatedBy`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `paidAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `metadata` json DEFAULT NULL,
  `institutionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `enrollmentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `commissionAmount` double NOT NULL DEFAULT '0',
  `institutionAmount` double NOT NULL,
  `payoutId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentMethod` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referenceNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `idempotencyKey` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stateVersion` int NOT NULL DEFAULT '1',
  `version` int NOT NULL DEFAULT '1',
  `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `paymentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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

-- --------------------------------------------------------

--
-- Table structure for table `pending_websocket_notifications`
--

DROP TABLE IF EXISTS `pending_websocket_notifications`;
CREATE TABLE IF NOT EXISTS `pending_websocket_notifications` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ctaText` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ctaLink` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `badge` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `students` int DEFAULT NULL,
  `courses` int DEFAULT NULL,
  `rating` double DEFAULT NULL,
  `priority` int NOT NULL DEFAULT '0',
  `isSponsored` tinyint(1) NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `designConfigId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `promotional_items_designConfigId_fkey` (`designConfigId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `question_banks`
--

DROP TABLE IF EXISTS `question_banks`;
CREATE TABLE IF NOT EXISTS `question_banks` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `addedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `addedBy` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderIndex` int NOT NULL DEFAULT '0',
  `questionBankId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `questionId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `question_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `option_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `media_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `type` enum('MULTIPLE_CHOICE','FILL_IN_BLANK','MATCHING','SHORT_ANSWER','TRUE_FALSE','ESSAY','DRAG_AND_DROP','HOTSPOT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `template_config` json NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `difficulty` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MEDIUM',
  `tags` json DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `confidence` double NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `implementedAt` datetime(3) DEFAULT NULL,
  `reviewedAt` datetime(3) DEFAULT NULL,
  `reviewedBy` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `suggestedChanges` json NOT NULL,
  `suggestionType` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `templateId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `question_template_suggestions_templateId_idx` (`templateId`),
  KEY `question_template_suggestions_reviewedBy_idx` (`reviewedBy`),
  KEY `question_template_suggestions_status_idx` (`status`),
  KEY `question_template_suggestions_createdAt_idx` (`createdAt`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `question_template_usage`
--

DROP TABLE IF EXISTS `question_template_usage`;
CREATE TABLE IF NOT EXISTS `question_template_usage` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customizationLevel` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none',
  `institutionId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `metadata` json DEFAULT NULL,
  `targetQuestionBankId` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `templateId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usageContext` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `usedBy` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `changes` json NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdBy` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `templateId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `passing_score` int NOT NULL,
  `time_limit` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `mediaUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `allow_retry` tinyint(1) NOT NULL DEFAULT '1',
  `average_score` double NOT NULL DEFAULT '0',
  `average_time` double NOT NULL DEFAULT '0',
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `difficulty` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MEDIUM',
  `instructions` text COLLATE utf8mb4_unicode_ci,
  `max_attempts` int NOT NULL DEFAULT '3',
  `quiz_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'STANDARD',
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

-- --------------------------------------------------------

--
-- Table structure for table `quiz_attempts`
--

DROP TABLE IF EXISTS `quiz_attempts`;
CREATE TABLE IF NOT EXISTS `quiz_attempts` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `score` int NOT NULL,
  `percentage` double NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IN_PROGRESS',
  `ability_estimate` double DEFAULT NULL,
  `adaptive_history` json DEFAULT NULL,
  `attempt_number` int NOT NULL DEFAULT '1',
  `completed_at` timestamp NULL DEFAULT NULL,
  `confidence_level` double DEFAULT NULL,
  `device_info` json DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_adaptive` tinyint(1) NOT NULL DEFAULT '0',
  `passed` tinyint(1) NOT NULL,
  `questions_answered` int NOT NULL DEFAULT '0',
  `quiz_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `started_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `student_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `termination_reason` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `time_spent` int DEFAULT NULL,
  `total_points` int NOT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `idx_quiz_attempts_quiz_id` (`quiz_id`),
  KEY `idx_quiz_attempts_student_id` (`student_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_questions`
--

DROP TABLE IF EXISTS `quiz_questions`;
CREATE TABLE IF NOT EXISTS `quiz_questions` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quiz_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('MULTIPLE_CHOICE','FILL_IN_BLANK','MATCHING','SHORT_ANSWER','TRUE_FALSE','ESSAY','DRAG_AND_DROP','HOTSPOT') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MULTIPLE_CHOICE',
  `question` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` json DEFAULT NULL,
  `correct_answer` text COLLATE utf8mb4_unicode_ci,
  `points` int NOT NULL DEFAULT '1',
  `order_index` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `average_time_spent` int NOT NULL DEFAULT '0',
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `difficulty` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MEDIUM',
  `explanation` text COLLATE utf8mb4_unicode_ci,
  `hints` json DEFAULT NULL,
  `success_rate` double NOT NULL DEFAULT '0',
  `tags` json DEFAULT NULL,
  `times_asked` int NOT NULL DEFAULT '0',
  `times_correct` int NOT NULL DEFAULT '0',
  `irt_difficulty` double DEFAULT NULL,
  `irt_discrimination` double DEFAULT NULL,
  `irt_guessing` double DEFAULT NULL,
  `irt_last_updated` timestamp NULL DEFAULT NULL,
  `media_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `media_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `question_config` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_quiz_questions_quiz_id` (`quiz_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_responses`
--

DROP TABLE IF EXISTS `quiz_responses`;
CREATE TABLE IF NOT EXISTS `quiz_responses` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attemptId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `questionId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` text COLLATE utf8mb4_unicode_ci,
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

-- --------------------------------------------------------

--
-- Table structure for table `rate_limit_logs`
--

DROP TABLE IF EXISTS `rate_limit_logs`;
CREATE TABLE IF NOT EXISTS `rate_limit_logs` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `identifier` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `patternType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `frequency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dayOfWeek` int DEFAULT NULL,
  `timeOfDay` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` int NOT NULL,
  `timezone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UTC',
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_active` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `stripeCustomerId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interests` json DEFAULT NULL,
  `learning_goals` text COLLATE utf8mb4_unicode_ci,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `native_language` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `social_links` json DEFAULT NULL,
  `social_visibility` enum('PUBLIC','PRIVATE','FRIENDS_ONLY') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PRIVATE',
  `spoken_languages` json DEFAULT NULL,
  `timezone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_students_email` (`email`),
  KEY `students_native_language_idx` (`native_language`),
  KEY `students_social_visibility_idx` (`social_visibility`),
  KEY `students_location_idx` (`location`(250))
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_achievements`
--

DROP TABLE IF EXISTS `student_achievements`;
CREATE TABLE IF NOT EXISTS `student_achievements` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `metadata` json DEFAULT NULL,
  `achievement` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subscriptionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `billingDate` datetime(3) NOT NULL,
  `amount` double NOT NULL,
  `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `paymentMethod` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transactionId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoiceNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `student_billing_history_subscriptionId_idx` (`subscriptionId`),
  KEY `student_billing_history_billingDate_idx` (`billingDate`),
  KEY `student_billing_history_status_idx` (`status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_course_completions`
--

DROP TABLE IF EXISTS `student_course_completions`;
CREATE TABLE IF NOT EXISTS `student_course_completions` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING_PAYMENT',
  `progress` double NOT NULL DEFAULT '0',
  `startDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `endDate` datetime(3) DEFAULT NULL,
  `paymentStatus` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `paymentDate` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `stateVersion` int NOT NULL DEFAULT '1',
  `version` int NOT NULL DEFAULT '1',
  `accessExpiry` datetime(3) DEFAULT NULL,
  `accessMethod` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DIRECT',
  `attendanceQuotaUsed` int NOT NULL DEFAULT '0',
  `enrollmentQuotaUsed` tinyint(1) NOT NULL DEFAULT '0',
  `enrollmentType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'COURSE_BASED',
  `hasLiveClassAccess` tinyint(1) NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isPlatformCourse` tinyint(1) NOT NULL DEFAULT '0',
  `liveClassAccessExpiry` datetime(3) DEFAULT NULL,
  `subscriptionId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subscriptionTier` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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

-- --------------------------------------------------------

--
-- Table structure for table `student_institutions`
--

DROP TABLE IF EXISTS `student_institutions`;
CREATE TABLE IF NOT EXISTS `student_institutions` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institution_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `status` enum('INQUIRY','APPLIED','REVIEWING','ACCEPTED','REJECTED','ENROLLED','ALUMNI','MEMBER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INQUIRY',
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_institutions_student_id_institution_id_key` (`student_id`,`institution_id`),
  KEY `student_institutions_institution_id_idx` (`institution_id`),
  KEY `student_institutions_student_id_idx` (`student_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_notification_preferences`
--

DROP TABLE IF EXISTS `student_notification_preferences`;
CREATE TABLE IF NOT EXISTS `student_notification_preferences` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `notification_frequency` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DAILY',
  `payment_confirmation` tinyint(1) NOT NULL DEFAULT '1',
  `payment_failed` tinyint(1) NOT NULL DEFAULT '1',
  `payment_receipts` tinyint(1) NOT NULL DEFAULT '1',
  `progress_updates` tinyint(1) NOT NULL DEFAULT '1',
  `system_announcements` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_notification_preferences_student_id_key` (`student_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_progress`
--

DROP TABLE IF EXISTS `student_progress`;
CREATE TABLE IF NOT EXISTS `student_progress` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
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

-- --------------------------------------------------------

--
-- Table structure for table `student_subscriptions`
--

DROP TABLE IF EXISTS `student_subscriptions`;
CREATE TABLE IF NOT EXISTS `student_subscriptions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `startDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `endDate` datetime(3) NOT NULL,
  `autoRenew` tinyint(1) NOT NULL DEFAULT '1',
  `cancellationReason` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cancelledAt` datetime(3) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `studentTierId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `planType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BASIC',
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_subscriptions_studentId_key` (`studentId`),
  KEY `student_subscriptions_studentId_idx` (`studentId`),
  KEY `student_subscriptions_status_idx` (`status`),
  KEY `student_subscriptions_endDate_idx` (`endDate`),
  KEY `student_subscriptions_studentTierId_fkey` (`studentTierId`),
  KEY `student_subscriptions_planType_idx` (`planType`),
  KEY `student_subscriptions_currentEnrollments_idx` (`currentEnrollments`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_tiers`
--

DROP TABLE IF EXISTS `student_tiers`;
CREATE TABLE IF NOT EXISTS `student_tiers` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `planType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `billingCycle` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MONTHLY',
  `maxCourses` int NOT NULL DEFAULT '5',
  `maxLiveClasses` int NOT NULL DEFAULT '10',
  `maxStudents` int NOT NULL DEFAULT '1',
  `maxInstructors` int NOT NULL DEFAULT '1',
  `features` json NOT NULL,
  `enrollmentQuota` int NOT NULL DEFAULT '5',
  `attendanceQuota` int NOT NULL DEFAULT '20',
  `gracePeriodDays` int NOT NULL DEFAULT '7',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_tiers_planType_key` (`planType`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscription_logs`
--

DROP TABLE IF EXISTS `subscription_logs`;
CREATE TABLE IF NOT EXISTS `subscription_logs` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subscriptionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `oldPlan` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `newPlan` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oldAmount` double DEFAULT NULL,
  `newAmount` double DEFAULT NULL,
  `oldBillingCycle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `newBillingCycle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `subscription_logs_subscriptionId_idx` (`subscriptionId`),
  KEY `subscription_logs_action_idx` (`action`),
  KEY `subscription_logs_createdAt_idx` (`createdAt`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_notifications`
--

DROP TABLE IF EXISTS `system_notifications`;
CREATE TABLE IF NOT EXISTS `system_notifications` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isGlobal` tinyint(1) NOT NULL DEFAULT '0',
  `targetRoles` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `targetInstitutions` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startDate` datetime(3) DEFAULT NULL,
  `endDate` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `createdBy` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedBy` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `categoryId` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parentId` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usageCount` int NOT NULL DEFAULT '0',
  `color` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  `priority` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `tag_slug_key` (`slug`),
  KEY `tag_categoryId_idx` (`categoryId`),
  KEY `tag_parentId_idx` (`parentId`),
  KEY `tag_name_idx` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tagrelation`
--

DROP TABLE IF EXISTS `tagrelation`;
CREATE TABLE IF NOT EXISTS `tagrelation` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tagId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `relatedId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `emailVerified` datetime(3) DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'STUDENT',
  `institutionId` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `forcePasswordReset` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_key` (`email`),
  KEY `user_institutionId_fkey` (`institutionId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `video_sessions`
--

DROP TABLE IF EXISTS `video_sessions`;
CREATE TABLE IF NOT EXISTS `video_sessions` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `sessionType` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `language` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `maxParticipants` int NOT NULL DEFAULT '10',
  `startTime` datetime(3) NOT NULL,
  `endTime` datetime(3) NOT NULL,
  `duration` int NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SCHEDULED',
  `meetingUrl` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meetingId` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recordingUrl` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instructorId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institutionId` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `courseId` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `moduleId` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` double NOT NULL DEFAULT '0',
  `isPublic` tinyint(1) NOT NULL DEFAULT '0',
  `isRecorded` tinyint(1) NOT NULL DEFAULT '0',
  `allowChat` tinyint(1) NOT NULL DEFAULT '1',
  `allowScreenShare` tinyint(1) NOT NULL DEFAULT '1',
  `allowRecording` tinyint(1) NOT NULL DEFAULT '0',
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
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
  `recurringPatternId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sessionNumber` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `video_sessions_instructorId_idx` (`instructorId`),
  KEY `video_sessions_courseId_idx` (`courseId`),
  KEY `video_sessions_institutionId_idx` (`institutionId`),
  KEY `video_sessions_startTime_idx` (`startTime`),
  KEY `video_sessions_status_idx` (`status`),
  KEY `video_sessions_language_idx` (`language`),
  KEY `video_sessions_level_idx` (`level`),
  KEY `video_sessions_moduleId_fkey` (`moduleId`),
  KEY `video_sessions_recurringPatternId_idx` (`recurringPatternId`),
  KEY `video_sessions_isRecurring_idx` (`isRecurring`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `video_session_messages`
--

DROP TABLE IF EXISTS `video_session_messages`;
CREATE TABLE IF NOT EXISTS `video_session_messages` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sessionId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `messageType` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `isPrivate` tinyint(1) NOT NULL DEFAULT '0',
  `recipientId` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `video_session_messages_sessionId_idx` (`sessionId`),
  KEY `video_session_messages_timestamp_idx` (`timestamp`),
  KEY `video_session_messages_recipientId_fkey` (`recipientId`),
  KEY `video_session_messages_userId_idx` (`userId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `video_session_participants`
--

DROP TABLE IF EXISTS `video_session_participants`;
CREATE TABLE IF NOT EXISTS `video_session_participants` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sessionId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PARTICIPANT',
  `joinedAt` datetime(3) DEFAULT NULL,
  `leftAt` datetime(3) DEFAULT NULL,
  `duration` int NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '0',
  `deviceInfo` json DEFAULT NULL,
  `connectionQuality` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastSeen` datetime(3) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `attendanceType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'REGULAR',
  `quotaUsed` tinyint(1) NOT NULL DEFAULT '0',
  `subscriptionId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sessionId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recordingUrl` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` int NOT NULL,
  `fileSize` int NOT NULL,
  `quality` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PROCESSING',
  `thumbnailUrl` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transcript` text COLLATE utf8mb4_unicode_ci,
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('967e591f-dc7c-4b96-996c-613928db67b6', 'f2cfd7c352e8f8dda4b30471ddc3fd4ff345aae0144b4eea797096d691ee9b05', '2025-08-14 20:56:20.744', '20250616005425_init', '', NULL, '2025-08-14 20:56:20.744', 0),
('01181acd-9941-4e69-9906-01c393370aa0', '2faeb77e437e12382fe945d342b20f86488b3372ee356e676cf4328feefb7de8', '2025-08-14 20:56:28.381', '20240320000001_add_module_progress_safe', '', NULL, '2025-08-14 20:56:28.381', 0),
('374b95cb-3537-4214-82a7-87113da204a7', '6dc0977158a372e0157f3913d252eecf047c745712c00455ec4b66bde1a3d500', '2025-08-14 20:56:36.248', '20250101000000_add_pending_websocket_notifications', '', NULL, '2025-08-14 20:56:36.248', 0),
('c33bf2b3-746d-4bf5-850e-15a4e7a23546', '293c45beb835c3940d76d13ed560eac930cc0c665a70e0c81f757ddd8e0faf7b', '2025-08-14 21:03:47.607', '20250101000001_add_course_performance_indexes', '', NULL, '2025-08-14 21:03:47.607', 0),
('d21a1dc9-7e7a-4a05-a898-c0f35586c45b', '024ac577d7b9f2095d4bbca58ab5fc885fbd5262245611e95f089aa90a801aa8', '2025-08-14 21:03:56.000', '20250605232703_init', '', NULL, '2025-08-14 21:03:56.000', 0),
('be8a2648-70f2-4bcb-b6f9-bf8cd9759797', '6bc043517342b89ea21b768da69e6fee72ab4b70661e7fd740a51e76fad4f58b', '2025-08-14 21:04:02.470', '20250605232858_institution_model_update', '', NULL, '2025-08-14 21:04:02.470', 0),
('9faab97e-9979-4c3e-b6ae-7446ceddd657', '7961fa6d63145672d4b4f5b0e2e06ac7756286c6e57eb622526eab24458aa79e', '2025-08-14 21:04:08.635', '20250613223050_add_module_relations', '', NULL, '2025-08-14 21:04:08.635', 0),
('da911c72-9712-4f7d-9f63-0f467c9fcc82', '113774980e6a4ab40a320c98d1e9274c2c57b213d909510205cb4e25e820d138', '2025-08-14 21:04:23.096', '20250605234215_add_discount_settings', '', NULL, '2025-08-14 21:04:23.096', 0),
('df401959-0f04-453f-ba8b-c3f807c54e3f', '28605a58ca4da1685575e67b0dd3c24c0cc2a29abff859bbc2d7d143d87c4ce8', '2025-08-14 21:04:30.499', '20250606174122_add_changed_by_user_relation', '', NULL, '2025-08-14 21:04:30.499', 0),
('64cbed18-7cc0-4ec7-90c6-8bf6b17b91d9', '8d5545dc7229846448048fc247f5391fa5677f385f7b470c5604026d2bcdc484', '2025-08-14 21:04:38.004', '20250607030057_add_monthly_prices_relation', '', NULL, '2025-08-14 21:04:38.004', 0);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
