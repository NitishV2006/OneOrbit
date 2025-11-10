import React from 'react';
// FIX: react-three-fiber is an optional dependency, so we use a type import
// to avoid a hard dependency if it's not installed.
import type { ThreeElements } from '@react-three/fiber';

// FIX: The global JSX namespace declaration is placed here to ensure it's loaded correctly
// across the app, fixing intrinsic element errors. By merging with react-three-fiber's 
// ThreeElements, we support both standard HTML and R3F canvas elements.
declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface IntrinsicElements extends React.JSX.IntrinsicElements, ThreeElements {}
  }
}

export enum OrbitId {
  Home = 'home',
  Learn = 'learn',
  Tasks = 'tasks',
  Finance = 'finance',
  Health = 'health',
  Reflect = 'reflect',
  Connect = 'connect',
  Profile = 'profile',
}

export interface User {
  id: string;
  username: string;
  password?: string; // Should be hashed in a real app
  avatarUrl: string;
}

export type NewUser = Omit<User, 'id'>;

export interface Goal {
  id: string;
  text: string;
  created_at: string;
}

export type ReflectionTask = Goal; // Alias for clarity in ReflectOrbit

export interface Reflection {
  id: string;
  created_at: string;
  content: {
    worked_well: string;
    failed_items: string;
    next_goals: string;
  };
  goals: Goal[];
}

export interface Task {
  id: string;
  title: string;
  category: 'Study' | 'Work' | 'Personal' | 'Fitness';
  priority: 'Low' | 'Medium' | 'High';
  duration: number; // in minutes
  due_date: string;
  completed_at: string | null;
  goalId?: string; // Link to a reflection goal
}

export type NewTask = Omit<Task, 'id' | 'completed_at'>;

export interface LearningItem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  mastery_score: number; // 0-100
  streak: number; // consecutive days studied
  time_invested_minutes: number;
}

export type NewLearningItem = Omit<LearningItem, 'id' | 'mastery_score' | 'streak' | 'time_invested_minutes'>;

export interface StudySession {
    id: string;
    learning_item_id: string;
    start_time: string;
    end_time: string;
    duration: number; // in minutes
    quality_rating: 1 | 2 | 3 | 4 | 5;
}

export interface Expense {
  id: string;
  amount: number;
  category: 'Food' | 'Transport' | 'Supplies' | 'Entertainment' | 'Other';
  note: string;
  created_at: string;
}

export type NewExpense = Omit<Expense, 'id' | 'created_at'>;

export interface HealthLog {
  id: string;
  logged_date: string; // YYYY-MM-DD
  sleep_hours: number;
  water_cups: number;
  stress_rating: number; // 1-5
  focus_hours: number;
  energy_score: number; // 0-100 calculated
}

export interface FinanceSettings {
    weeklyBudget: number;
}

export interface DailyMetrics {
    date: string; // YYYY-MM-DD
    tasksCompleted: number;
    studyMinutes: number;
    moneySpent: number;
    energyScore: number;
}

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
}

export interface TrioMember {
    id: string;
    username: string;
    avatarUrl: string;
}

export interface CheckIn {
    userId: string;
    username: string;
    avatarUrl: string;
    message: string;
    timestamp: string;
}

export interface UserData {
    profile: {
        bio: string;
        skills: string[];
        projects: { title: string; description: string }[];
    };
    tasks: Task[];
    learningItems: LearningItem[];
    studySessions: StudySession[];
    expenses: Expense[];
    healthLogs: { [date: string]: HealthLog };
    financeSettings: FinanceSettings;
    reflections: Reflection[];
    trioMembers: TrioMember[];
    checkIns: CheckIn[];
}
