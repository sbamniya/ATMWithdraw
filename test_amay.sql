-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 22, 2018 at 09:33 PM
-- Server version: 10.1.30-MariaDB
-- PHP Version: 7.2.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test_amay`
--

-- --------------------------------------------------------

--
-- Table structure for table `atm_details`
--

CREATE TABLE `atm_details` (
  `id` int(11) NOT NULL,
  `atm_id` varchar(20) NOT NULL,
  `currency_denomination` int(11) NOT NULL,
  `count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `atm_details`
--

INSERT INTO `atm_details` (`id`, `atm_id`, `currency_denomination`, `count`) VALUES
(1, 'SBIN0012346', 2000, 15),
(2, 'SBIN0012346', 500, 43),
(3, 'SBIN0012346', 100, 93);

-- --------------------------------------------------------

--
-- Table structure for table `card_details`
--

CREATE TABLE `card_details` (
  `card_id` int(11) NOT NULL,
  `card_number` varchar(16) NOT NULL,
  `pin` int(11) NOT NULL,
  `balance` float(16,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `card_details`
--

INSERT INTO `card_details` (`card_id`, `card_number`, `pin`, `balance`) VALUES
(1, '1234567891011123', 1234, 12100.00),
(2, '3121110987654321', 1234, 150000.00);

-- --------------------------------------------------------

--
-- Table structure for table `transaction_deails`
--

CREATE TABLE `transaction_deails` (
  `transaction_id` int(11) NOT NULL,
  `card_id` int(11) DEFAULT NULL,
  `atm_id` varchar(20) NOT NULL,
  `denomination_details` text NOT NULL,
  `transaction_date` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `transaction_deails`
--

INSERT INTO `transaction_deails` (`transaction_id`, `card_id`, `atm_id`, `denomination_details`, `transaction_date`) VALUES
(3, 1, '\'SBIN0012346\'', '\'[{\"currency\":2000,\"count\":2},{\"currency\":500,\"count\":2},{\"currency\":100,\"count\":3}]\'', 0),
(4, 1, '\'SBIN0012346\'', '\'[{\"currency\":2000,\"count\":1}]\'', 0),
(5, 1, '\'SBIN0012346\'', '\'[{\"currency\":2000,\"count\":0},{\"currency\":500,\"count\":0},{\"currency\":100,\"count\":1}]\'', 0),
(6, 1, 'SBIN0012346', '[{\"currency\":2000,\"count\":0},{\"currency\":500,\"count\":3}]', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `atm_details`
--
ALTER TABLE `atm_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `card_details`
--
ALTER TABLE `card_details`
  ADD PRIMARY KEY (`card_id`);

--
-- Indexes for table `transaction_deails`
--
ALTER TABLE `transaction_deails`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `card_id` (`card_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `atm_details`
--
ALTER TABLE `atm_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `card_details`
--
ALTER TABLE `card_details`
  MODIFY `card_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transaction_deails`
--
ALTER TABLE `transaction_deails`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transaction_deails`
--
ALTER TABLE `transaction_deails`
  ADD CONSTRAINT `card_id` FOREIGN KEY (`card_id`) REFERENCES `card_details` (`card_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
