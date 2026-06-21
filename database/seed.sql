-- Seed data for development
-- Password for all demo users: Demo@1234

INSERT INTO users (id, name, email, password, "createdAt", "updatedAt") VALUES
(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Demo User',
    'demo@todoapp.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/3KJrklAne', -- Demo@1234
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO todos (id, "userId", title, description, priority, status, category, "dueDate", "createdAt", "updatedAt") VALUES
(
    uuid_generate_v4(),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Set up project repository',
    'Initialize Git repo, configure CI/CD pipeline',
    'high',
    'completed',
    'Work',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '2 days'
),
(
    uuid_generate_v4(),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Write unit tests',
    'Cover all API endpoints with integration tests',
    'high',
    'in_progress',
    'Work',
    NOW() + INTERVAL '3 days',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '1 day'
),
(
    uuid_generate_v4(),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Buy groceries',
    'Milk, eggs, bread, vegetables',
    'medium',
    'pending',
    'Personal',
    NOW() + INTERVAL '1 day',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
),
(
    uuid_generate_v4(),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Morning workout',
    '30-minute cardio + strength training',
    'low',
    'pending',
    'Health',
    NOW() + INTERVAL '6 hours',
    NOW(),
    NOW()
),
(
    uuid_generate_v4(),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Review monthly budget',
    'Analyze expenses and update savings plan',
    'medium',
    'pending',
    'Finance',
    NOW() + INTERVAL '7 days',
    NOW(),
    NOW()
)
ON CONFLICT DO NOTHING;
