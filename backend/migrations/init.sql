-- init.sql

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(128) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar TEXT,
  role VARCHAR(50) DEFAULT 'Parent',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS generations (
  id VARCHAR(50) PRIMARY KEY,
  sport VARCHAR(50) NOT NULL,
  age INTEGER NOT NULL CHECK (age BETWEEN 6 AND 25),
  height DECIMAL(5,1),
  height_unit VARCHAR(5) DEFAULT 'cm',
  player_level VARCHAR(20),
  current_equipment TEXT NOT NULL,
  budget_min INTEGER,
  budget_max INTEGER,
  goals TEXT[],
  coach_name VARCHAR(100),
  prompt_version VARCHAR(10),
  ai_response JSONB,
  response_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  planning_mode VARCHAR(20) DEFAULT 'Parent',
  player_weight DECIMAL(5,1),
  player_experience VARCHAR(50),
  user_id VARCHAR(128) REFERENCES users(id),
  player_name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  generation_id VARCHAR(50) REFERENCES generations(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  thumbs VARCHAR(5) CHECK (thumbs IN ('up', 'down')),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS templates (
  id VARCHAR(20) PRIMARY KEY,
  label VARCHAR(100),
  emoji VARCHAR(10),
  color VARCHAR(20),
  sport VARCHAR(50),
  age INTEGER,
  height DECIMAL(5,1),
  height_unit VARCHAR(5) DEFAULT 'cm',
  player_level VARCHAR(20),
  current_equipment TEXT,
  budget_min INTEGER,
  budget_max INTEGER,
  goals TEXT[],
  is_active BOOLEAN DEFAULT TRUE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_generations_sport ON generations(sport);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_generation_id ON feedback(generation_id);
