USE `opa`;

DROP TABLE IF EXISTS customer;
CREATE TABLE customer (
  customer_id INT NOT NULL AUTO_INCREMENT,
  business_name VARCHAR(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  first_name VARCHAR(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  last_name VARCHAR(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  address_line1 VARCHAR(60) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  address_line2 VARCHAR(60) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  city VARCHAR(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  province VARCHAR(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  pc VARCHAR(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  country VARCHAR(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  email VARCHAR(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  phone VARCHAR(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_created VARCHAR(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
 
  primary_flag BOOLEAN NOT NULL DEFAULT 0,
  communication_allowed_flag BOOLEAN NOT NULL DEFAULT 1,

  PRIMARY KEY (Customer_Id)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

drop table if exists users;
CREATE TABLE `users` (
  `customer_id` int  NOT NULL AUTO_INCREMENT,
  `username` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `password` varchar(80) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `active_flag` varchar(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `date_end` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
drop table if exists inventory;
CREATE TABLE `inventory` (
  `seqno` int  NOT NULL,
  `product_id` int  NOT NULL,
  `quantity` double NOT NULL,
  `year` int NOT NULL,
  `unit` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'kg, lbs, etc.',
 `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_updated` varchar(30) DEFAULT NULL,  
  `batch_no` int  NOT NULL COMMENT 'To mark periodic releases of new honey products',
  PRIMARY KEY (`seqno`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--

dopp table if exists menu;
CREATE TABLE `menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `type` enum('breakfast','lunch','dinner','main','takeout') NOT NULL,
  `date_from` date NOT NULL,
  `date_to` date NOT NULL,
  `flag_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_updated` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `chk_date_range` CHECK ((`date_from` <= `date_to`))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_menu_location
    ON menu(customer_id);

CREATE INDEX idx_menu_active_dates
    ON menu(flag_active, date_from, date_to);


--

drop table if exists menu_items;

CREATE TABLE menu_items (
    id INT NOT NULL AUTO_INCREMENT,
    menu_id INT NOT NULL,
    language VARCHAR(10) NOT NULL,

    name VARCHAR(255) NOT NULL,
    description TEXT,
    ingredients TEXT,
    `price` INT not null,
    calories INT not null,
    weight INT not null,
    min_order INT,
    max_order INT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    user_updated VARCHAR(30),

    PRIMARY KEY (id),
    UNIQUE KEY uq_menu_language (menu_id, language)
);

CREATE INDEX idx_menu_items_menu
    ON menu_items(menu_id);

CREATE INDEX idx_menu_items_menu_language
    ON menu_items(menu_id, language);

--


drop table if exists business;

CREATE TABLE business (
    id INT NOT NULL AUTO_INCREMENT,
    company VARCHAR(255) NOT NULL,
    business_number INT NOT NULL,
    customer_id INT NOT NULL,
    head_office_id INT NOT NULL,
    
    type ENUM('restaurant', 'farmer', 'real estate') NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    user_updated VARCHAR(30),

    PRIMARY KEY (id)
);

-- Index on head_office_id
CREATE INDEX idx_business_head_office
    ON business(head_office_id);

--
drop table if exists product;
CREATE TABLE product (
    product_id INT NOT NULL AUTO_INCREMENT,
    description VARCHAR(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
    period VARCHAR(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
    date_ended TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_created VARCHAR(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_updated VARCHAR(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    url_link VARCHAR(60) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
    name VARCHAR(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
    language VARCHAR(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,

    PRIMARY KEY (product_id, language)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_product_language ON product(language);
CREATE INDEX idx_product_name ON product(name);


-- 
drop table if exists orders;

CREATE TABLE `orders` (
  `order_id` int  NOT NULL AUTO_INCREMENT,
  `product_id` int  NOT NULL,
  `customer_id` int  NOT NULL,
  `quantity` double NOT NULL,
  `unit` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_created` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='customer orders';


--
drop table if exists order_address;
-- Opa.Inventory definition
CREATE TABLE `order_address` (
  `order_id` int  NOT NULL,
  `business_name` varchar(60) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `first_name` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `last_name` varchar(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `address_line1` varchar(60) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `address_line2` varchar(60) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `city` varchar(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `province` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
 `pc` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `country` varchar(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `email` varchar(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `phone` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_created` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='stores shipping address per order';


--
drop table if exists reviews;

CREATE TABLE reviews (
    id INT NOT NULL AUTO_INCREMENT,
    language VARCHAR(10) NOT NULL,
    menu_id INT NOT NULL,

    description TEXT NOT NULL,

    rating INT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    user_updated VARCHAR(30),

    PRIMARY KEY (id, language),

    CONSTRAINT chk_rating_range CHECK (rating BETWEEN 1 AND 5)
);

