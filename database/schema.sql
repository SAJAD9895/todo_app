-- TodoApp Database Schema
-- PostgreSQL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Todos table
-- Note: Sequelize manages its own enum types (enum_todos_priority, enum_todos_status).
-- Use VARCHAR here if running schema.sql manually alongside Sequelize sync.
CREATE TABLE IF NOT EXISTS todos (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId"       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title          VARCHAR(255) NOT NULL,
    description    TEXT,
    priority       VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status         VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    category       VARCHAR(100),
    "dueDate"      TIMESTAMP WITH TIME ZONE,
    "reminderTime" TIMESTAMP WITH TIME ZONE,
    "createdAt"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_todos_user_id    ON todos("userId");
CREATE INDEX IF NOT EXISTS idx_todos_status     ON todos(status);
CREATE INDEX IF NOT EXISTS idx_todos_priority   ON todos(priority);
CREATE INDEX IF NOT EXISTS idx_todos_due_date   ON todos("dueDate");

-- Auto-update updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todos_updated_at
    BEFORE UPDATE ON todos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
