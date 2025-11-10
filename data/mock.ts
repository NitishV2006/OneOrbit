import { User, UserData } from '../types';

export const MOCK_USERS: User[] = [
    {
        id: '1',
        username: 'demo',
        password: 'password',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&h=256&fit=crop&crop=faces',
    },
    {
        id: '2',
        username: 'alex',
        password: 'password',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop&crop=faces'
    },
    {
        id: '3',
        username: 'casey',
        password: 'password',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&h=256&fit=crop&crop=faces'
    },
    {
        id: '4',
        username: 'jordan',
        password: 'password',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&fit=crop&crop=faces'
    },
    {
        id: '5',
        username: 'riley',
        password: 'password',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&fit=crop&crop=faces'
    },
     {
        id: '6',
        username: 'morgan',
        password: 'password',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&h=256&fit=crop&crop=faces'
    }
];

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const trio = [
    {
        id: 'trio-1',
        username: 'gnanendra',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&h=256&fit=crop&crop=faces'
    },
    {
        id: 'trio-2',
        username: 'manohar',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop&crop=faces'
    }
];


export const MOCK_USER_DATA: { [key: string]: UserData } = {
    '1': {
        profile: {
            bio: "Lifelong learner and productivity enthusiast. Exploring the intersection of technology and self-improvement.",
            skills: ['React', 'TypeScript', 'Node.js', 'Productivity', 'Time Management'],
            projects: [
                { title: 'Personal Portfolio', description: 'A React-based website to showcase my work.' },
                { title: 'Task Management CLI', description: 'A command-line tool for managing daily tasks.' },
            ],
        },
        tasks: [
            { id: 't1', title: 'Complete Chapter 5 of History book', category: 'Study', priority: 'High', duration: 60, due_date: today.toISOString(), completed_at: null, goalId: 'g1' },
            { id: 't2', title: 'Go for a 30-min run', category: 'Fitness', priority: 'Medium', duration: 30, due_date: today.toISOString(), completed_at: null },
            { id: 't3', title: 'Submit project proposal', category: 'Work', priority: 'High', duration: 120, due_date: today.toISOString(), completed_at: null },
            { id: 't4', title: 'Grocery shopping', category: 'Personal', priority: 'Low', duration: 45, due_date: yesterday.toISOString(), completed_at: yesterday.toISOString() },
        ],
        learningItems: [
            { id: 'l1', title: 'Quantum Computing Basics', difficulty: 'Hard', mastery_score: 25, streak: 2, time_invested_minutes: 120 },
            { id: 'l2', title: 'Advanced CSS Selectors', difficulty: 'Easy', mastery_score: 85, streak: 5, time_invested_minutes: 300 },
            { id: 'l3', title: 'Data Structures in Python', difficulty: 'Medium', mastery_score: 60, streak: 3, time_invested_minutes: 450 },
        ],
        studySessions: [
             { id: 'ss1', learning_item_id: 'l1', start_time: yesterday.toISOString(), end_time: new Date(yesterday.getTime() + 25 * 60000).toISOString(), duration: 25, quality_rating: 4 }
        ],
        expenses: [
            { id: 'e1', amount: 250.00, category: 'Food', note: 'Lunch with team', created_at: today.toISOString() },
            { id: 'e2', amount: 85.50, category: 'Transport', note: 'Metro card recharge', created_at: today.toISOString() },
            { id: 'e3', amount: 1200.00, category: 'Supplies', note: 'New textbooks', created_at: yesterday.toISOString() },
        ],
        healthLogs: {
            [yesterday.toISOString().split('T')[0]]: { id: 'h1', logged_date: yesterday.toISOString().split('T')[0], sleep_hours: 7.5, water_cups: 8, stress_rating: 3, focus_hours: 6, energy_score: 74 },
        },
        financeSettings: {
            weeklyBudget: 5000,
        },
        reflections: [
            {
                id: 'r1',
                created_at: yesterday.toISOString(),
                content: {
                    worked_well: "Managed to stick to my study schedule and completed all planned tasks.",
                    failed_items: "Procrastinated on my workout routine and overspent on food.",
                    next_goals: "My main goal is to finish the history book and start preparing for the exam."
                },
                goals: [
                    { id: 'g1', text: 'Finish history book for exam preparation', created_at: yesterday.toISOString() }
                ]
            }
        ],
        trioMembers: trio,
        checkIns: [
             {
                userId: 'trio-1',
                username: 'gnanendra',
                avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&h=256&fit=crop&crop=faces',
                message: "Ready for another productive week!",
                timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 hours ago
            },
            {
                userId: '1',
                username: 'demo',
                avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&h=256&fit=crop&crop=faces',
                message: "Just finished my history chapter. On to the next task!",
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
            },
            {
                userId: 'trio-2',
                username: 'manohar',
                avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop&crop=faces',
                message: "Awesome job, demo! I'm about to start my workout.",
                timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
            }
        ],
    },
    'new': { // Default data for new signups
         profile: { bio: "Ready to start my journey!", skills: [], projects: [] },
         tasks: [],
         learningItems: [],
         studySessions: [],
         expenses: [],
         healthLogs: {},
         financeSettings: { weeklyBudget: 3000 },
         reflections: [],
         trioMembers: [],
         checkIns: [],
    }
};