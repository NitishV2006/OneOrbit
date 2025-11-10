
import React, { useState, useCallback, useMemo } from 'react';

import { useAuth } from './hooks/useAuth';
import { useUserData } from './hooks/useUserData';
import { OrbitId, UserData, NewTask, Reflection, Goal, Task } from './types';

import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';

import { HomeOrbit } from './orbits/HomeOrbit';
import { LearnOrbit } from './orbits/LearnOrbit';
import { TasksOrbit } from './orbits/TasksOrbit';
import { FinanceOrbit } from './orbits/FinanceOrbit';
import { HealthOrbit } from './orbits/HealthOrbit';
import { ReflectOrbit } from './orbits/ReflectOrbit';
import { ConnectOrbit } from './orbits/ConnectOrbit';
import { ProfileOrbit } from './orbits/ProofOfWorkOrbit';
import { AuthOrbit } from './orbits/AuthOrbit';
import { Notification } from './components/Notification';
import { Notification as NotificationType } from './types';
import { Confetti } from './components/Confetti';
import { AuroraBackground } from './components/ui/AuroraBackground';


const App: React.FC = () => {
  const { user, loading: authLoading, login, logout, signup, updateUser } = useAuth();
  const { userData, setUserData, loading: userDataLoading } = useUserData(user?.id);
  
  const [activeOrbit, setActiveOrbit] = useState<OrbitId>(OrbitId.Home);
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSetNotification = (title: string, message: string, type: NotificationType['type'] = 'info') => {
    setNotification({ id: Date.now().toString(), title, message, type });
  };
  
  const handleAddTask = useCallback((task: NewTask) => {
    if (!userData) return;
    const newTaskWithId = { ...task, id: Date.now().toString(), completed_at: null };
    setUserData({ ...userData, tasks: [newTaskWithId, ...userData.tasks] });
    handleSetNotification("Task Added!", `"${task.title}" has been added to your list.`, 'success');
  }, [userData, setUserData]);

  const handleCompleteTask = useCallback((id: string) => {
    if (!userData) return;
    const updatedTasks = userData.tasks.map(t => t.id === id ? { ...t, completed_at: new Date().toISOString() } : t);
    setUserData({ ...userData, tasks: updatedTasks });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000); // Confetti lasts 4 seconds
    handleSetNotification("Task Completed!", "Great job, keep up the momentum!", 'success');
  }, [userData, setUserData]);

  const addReflectionAndTasks = useCallback((reflectionContent: Reflection['content'], goals: string[]) => {
    if (!userData) return;
    const newGoals: Goal[] = goals.map(g => ({ id: Date.now().toString() + g, text: g, created_at: new Date().toISOString() }));
    
    const newReflection: Reflection = {
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      content: reflectionContent,
      goals: newGoals,
    };

    const newTasks: Task[] = newGoals.map(goal => ({
      id: Date.now().toString() + goal.id,
      title: goal.text,
      category: 'Personal',
      priority: 'Medium',
      duration: 30,
      due_date: new Date().toISOString(),
      completed_at: null,
      goalId: goal.id,
    }));

    setUserData({
      ...userData,
      reflections: [newReflection, ...userData.reflections],
      tasks: [...newTasks, ...userData.tasks],
    });

  }, [userData, setUserData]);

  const streak = useMemo(() => {
    if (!userData) return 0;
    // This is a simplified streak calculation
    const completedTasks = userData.tasks.filter(t => t.completed_at).length;
    return Math.floor(completedTasks / 2); // e.g. 1 day streak for every 2 tasks
  }, [userData]);


  const renderOrbit = () => {
    if (!userData) return <div className="p-6">Loading user data...</div>;

    switch (activeOrbit) {
      case OrbitId.Home: return <HomeOrbit setActiveOrbit={setActiveOrbit} userData={userData} />;
      case OrbitId.Learn: return <LearnOrbit userData={userData} setUserData={setUserData as (data: UserData) => void} />;
      case OrbitId.Tasks: return <TasksOrbit userData={userData} streak={streak} onCompleteTask={handleCompleteTask} onAddTask={handleAddTask} />;
      case OrbitId.Finance: return <FinanceOrbit userData={userData} setUserData={setUserData as (data: UserData) => void} />;
      case OrbitId.Health: return <HealthOrbit userData={userData} setUserData={setUserData as (data: UserData) => void} />;
      case OrbitId.Reflect: return <ReflectOrbit addReflectionAndTasks={addReflectionAndTasks} />;
      case OrbitId.Connect: return <ConnectOrbit user={user!} userData={userData} setUserData={setUserData as (data: UserData) => void} />;
      case OrbitId.Profile: return <ProfileOrbit user={user!} updateUser={updateUser} userData={userData} setUserData={setUserData as (data: UserData) => void} />;
      default: return <HomeOrbit setActiveOrbit={setActiveOrbit} userData={userData} />;
    }
  };

  const loading = authLoading || userDataLoading;

  if (loading) {
     return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
            <div className="animate-spin" style={{ borderRadius: '50%', width: '4rem', height: '4rem', borderTop: '4px solid var(--color-primary)', borderRight: '4px solid transparent', borderBottom: '4px solid var(--color-primary)', borderLeft: '4px solid transparent' }} />
        </div>
    );
  }


  return (
    <div className="w-screen h-screen bg-bg-primary text-text-primary overflow-hidden">
      {notification && <Notification notification={notification} onDismiss={() => setNotification(null)} />}
      {showConfetti && <Confetti />}
      
      {!user ? (
        <AuroraBackground>
          <AuthOrbit onLogin={login} onSignup={signup} />
        </AuroraBackground>
      ) : (
        <div className="flex h-full">
          <Sidebar activeOrbit={activeOrbit} setActiveOrbit={setActiveOrbit} />
          <main className="flex-1 flex flex-col overflow-hidden">
            <Header activeOrbit={activeOrbit} onLogout={logout} />
            <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
              {renderOrbit()}
            </div>
          </main>
          <BottomNav activeOrbit={activeOrbit} setActiveOrbit={setActiveOrbit} />
        </div>
      )}
    </div>
  );
};

export default App;