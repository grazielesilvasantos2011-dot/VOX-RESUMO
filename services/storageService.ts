import { Project, UserPlanType, DailyUsageEntry } from "../types";

const STORAGE_KEY = 'voxresumo_projects';
const USER_PLAN_KEY = 'voxresumo_user_plan';
const USER_ID_KEY = 'voxresumo_user_id';
const DAILY_USAGE_PREFIX = 'voxresumo_daily_usage_';

export const getProjects = (): Project[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveProject = (project: Project) => {
  const projects = getProjects();
  const updatedProjects = [project, ...projects];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
};

export const deleteProject = (id: string) => {
  const projects = getProjects();
  const updated = projects.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getProjectById = (id: string): Project | undefined => {
  const projects = getProjects();
  return projects.find(p => p.id === id);
};

// Simple UUID generator for demo
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const getOrCreateUserId = (): string => {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = generateUUID();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};

export const saveUserPlan = (plan: UserPlanType) => {
  // Ensure a user ID exists when saving a plan (e.g., after signup/login)
  getOrCreateUserId();
  localStorage.setItem(USER_PLAN_KEY, plan);
};

export const getUserPlan = (): UserPlanType => {
  // If no user ID, user is truly unauthenticated
  if (!localStorage.getItem(USER_ID_KEY)) {
    return 'unauthenticated';
  }
  // Default to 'free' if logged in but no plan set
  return (localStorage.getItem(USER_PLAN_KEY) as UserPlanType) || 'free'; 
};

export const clearUserSession = () => {
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_PLAN_KEY);
  // In a real app, you might also clear associated daily usage keys for this user
  // For this demo, we'll leave them to illustrate usage tracking per day.
};

// Helper to get today's date in YYYY-MM-DD format
export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const saveDailyUsage = (userId: string, entry: DailyUsageEntry) => {
  const today = getTodayDateString();
  const key = `${DAILY_USAGE_PREFIX}${userId}_${today}`;
  const stored = localStorage.getItem(key);
  const entries: DailyUsageEntry[] = stored ? JSON.parse(stored) : [];
  entries.push(entry);
  localStorage.setItem(key, JSON.stringify(entries));
};

export const getDailyConsumedSeconds = (userId: string): number => {
  const today = getTodayDateString();
  const key = `${DAILY_USAGE_PREFIX}${userId}_${today}`;
  const stored = localStorage.getItem(key);
  const entries: DailyUsageEntry[] = stored ? JSON.parse(stored) : [];
  return entries.reduce((total, entry) => total + entry.durationSeconds, 0);
};