CREATE TABLE IF NOT EXISTS migrations (name VARCHAR(255) PRIMARY KEY, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user','moderator','admin') NOT NULL DEFAULT 'user',
  status ENUM('active','suspended','deleted') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE private_identities (
  user_id CHAR(36) PRIMARY KEY,
  full_name VARCHAR(160) NOT NULL,
  phone VARCHAR(30),
  latitude DECIMAL(10,7), longitude DECIMAL(10,7),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE public_profiles (
  user_id CHAR(36) PRIMARY KEY,
  alias_name VARCHAR(80) NOT NULL,
  region VARCHAR(100), bio VARCHAR(400),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE verifications (
  id CHAR(36) PRIMARY KEY, user_id CHAR(36) NOT NULL,
  kind ENUM('identity','phone','professional') NOT NULL,
  status ENUM('pending','verified','rejected') DEFAULT 'pending',
  verified_at DATETIME, UNIQUE KEY uq_verification (user_id, kind),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE categories (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(80) NOT NULL UNIQUE, slug VARCHAR(80) NOT NULL UNIQUE);
CREATE TABLE posts (
  id CHAR(36) PRIMARY KEY, user_id CHAR(36) NOT NULL, category_id INT NOT NULL,
  type ENUM('need','offer') NOT NULL, title VARCHAR(140) NOT NULL, description TEXT NOT NULL,
  modality ENUM('in_person','remote','either') NOT NULL DEFAULT 'either',
  urgency ENUM('low','medium','high') NOT NULL DEFAULT 'medium', region VARCHAR(100),
  latitude DECIMAL(10,7), longitude DECIMAL(10,7), available_from DATETIME, available_until DATETIME,
  status ENUM('open','matched','completed','closed','moderation') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_posts_feed (status, type, category_id, created_at),
  FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (category_id) REFERENCES categories(id)
);
CREATE TABLE cooperations (
  id CHAR(36) PRIMARY KEY, need_post_id CHAR(36) NOT NULL, offer_post_id CHAR(36) NOT NULL,
  initiated_by CHAR(36) NOT NULL, status ENUM('proposed','accepted','declined','completed','cancelled') DEFAULT 'proposed',
  identity_sharing ENUM('protected','verified','shared') DEFAULT 'protected',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, completed_at DATETIME,
  UNIQUE KEY uq_pair (need_post_id, offer_post_id),
  FOREIGN KEY (need_post_id) REFERENCES posts(id), FOREIGN KEY (offer_post_id) REFERENCES posts(id), FOREIGN KEY (initiated_by) REFERENCES users(id)
);
CREATE TABLE blocks (blocker_id CHAR(36), blocked_id CHAR(36), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(blocker_id, blocked_id), FOREIGN KEY(blocker_id) REFERENCES users(id), FOREIGN KEY(blocked_id) REFERENCES users(id));
CREATE TABLE reports (
  id CHAR(36) PRIMARY KEY, reporter_id CHAR(36) NOT NULL, reported_user_id CHAR(36), post_id CHAR(36),
  reason VARCHAR(80) NOT NULL, details VARCHAR(1000), status ENUM('open','reviewing','resolved','dismissed') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(reporter_id) REFERENCES users(id), FOREIGN KEY(reported_user_id) REFERENCES users(id), FOREIGN KEY(post_id) REFERENCES posts(id)
);
CREATE TABLE security_events (id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id CHAR(36), event_type VARCHAR(80) NOT NULL, ip_hash CHAR(64), metadata JSON, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX idx_security (event_type, created_at));
CREATE TABLE votes (id CHAR(36) PRIMARY KEY, user_id CHAR(36) NOT NULL UNIQUE, abuse_key CHAR(64) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id));
CREATE TABLE contributions (id CHAR(36) PRIMARY KEY, user_id CHAR(36), amount_cents INT NOT NULL, currency CHAR(3) DEFAULT 'BRL', status ENUM('intent','pending','confirmed','failed','refunded') DEFAULT 'intent', provider VARCHAR(40), provider_reference VARCHAR(190), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id));
CREATE TABLE transparency_updates (
  id CHAR(36) PRIMARY KEY, kind ENUM('goal','expense','milestone','update','result') NOT NULL, title VARCHAR(160) NOT NULL,
  description TEXT NOT NULL, amount_cents INT, status VARCHAR(40), occurred_on DATE NOT NULL, published BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
