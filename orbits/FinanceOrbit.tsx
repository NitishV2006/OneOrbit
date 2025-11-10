
import React, { useState, useMemo } from 'react';
import { Expense, UserData, NewExpense } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Modal } from '../components/Modal';

const categoryIcons: {[key: string]: string} = { Food: '🍔', Transport: '🚌', Supplies: '📚', Entertainment: '🎬', Other: '📦' };
const COLORS = ['var(--color-primary)', 'var(--color-success)', 'var(--color-secondary)', 'var(--color-danger)', '#A855F7'];


const AddExpenseForm: React.FC<{ onAdd: (expense: NewExpense) => void; onCancel: () => void; }> = ({ onAdd, onCancel }) => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<Expense['category']>('Food');
    const [note, setNote] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || Number(amount) <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
        onAdd({ amount: Number(amount), category, note });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-text-secondary mb-1">Amount (₹)</label>
                <input
                    id="amount" type="number" value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="0.00" required step="0.01"
                />
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg focus:ring-primary focus:border-primary"
                >
                    {Object.keys(categoryIcons).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="note" className="block text-sm font-medium text-text-secondary mb-1">Note</label>
                <input id="note" type="text" value={note} onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="e.g., Lunch with friends" required
                />
            </div>
            <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel} className="bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</Button>
                <Button type="submit">Add Expense</Button>
            </div>
        </form>
    );
};


export const FinanceOrbit: React.FC<{ userData: UserData, setUserData: (data: UserData) => void }> = ({ userData, setUserData }) => {
    const [isAdding, setIsAdding] = useState(false);
    const { expenses, financeSettings } = userData;
    const WEEKLY_BUDGET = financeSettings.weeklyBudget;
    
    const { totalSpent, budgetPercentage, pieData } = useMemo(() => {
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const percentage = WEEKLY_BUDGET > 0 ? Math.min((total / WEEKLY_BUDGET) * 100, 100) : 0;
        
        const dataByCategory = expenses.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        }, {} as Record<string, number>);
        
        const pie = Object.entries(dataByCategory).map(([name, value]) => ({ name, value }));
        
        return { totalSpent: total, budgetPercentage: percentage, pieData: pie };
    }, [expenses, WEEKLY_BUDGET]);
    
    const handleAddExpense = (expense: NewExpense) => {
        const newExpense: Expense = {
            ...expense,
            id: Date.now().toString(),
            created_at: new Date().toISOString()
        };
        setUserData({
            ...userData,
            expenses: [newExpense, ...userData.expenses]
        });
        setIsAdding(false);
    };
    
    const daysRemaining = 7 - new Date().getDay();
    const dailySpendingRate = (WEEKLY_BUDGET - totalSpent) > 0 && daysRemaining > 0 ? (WEEKLY_BUDGET - totalSpent) / daysRemaining : 0;

    let budgetColor = 'bg-success';
    if (budgetPercentage > 85) budgetColor = 'bg-danger';
    else if (budgetPercentage > 70) budgetColor = 'bg-secondary';

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {isAdding && (
                <Modal title="Add New Expense" onClose={() => setIsAdding(false)}>
                    <AddExpenseForm onAdd={handleAddExpense} onCancel={() => setIsAdding(false)} />
                </Modal>
            )}

            <div className="flex justify-end items-center mb-6">
                <Button onClick={() => setIsAdding(true)}>Add Expense</Button>
            </div>

            <Card title="Weekly Budget">
                <div className="space-y-2">
                    <div className="flex justify-between font-bold text-text-primary">
                        <span>₹{totalSpent.toFixed(2)} spent</span>
                        <span>₹{(WEEKLY_BUDGET - totalSpent).toFixed(2)} remaining</span>
                    </div>
                    <div className="w-full bg-bg-primary rounded-full h-4">
                        <div className={`${budgetColor} h-4 rounded-full transition-all duration-500`} style={{ width: `${budgetPercentage}%` }}></div>
                    </div>
                    <div className="text-right text-text-secondary text-sm mt-1">
                        You can spend ~<span className="font-bold text-text-primary">₹{dailySpendingRate.toFixed(2)}</span> per day for the next {daysRemaining} days.
                    </div>
                </div>
            </Card>
            
            {budgetPercentage > 85 && (
                <div className="bg-danger/10 border-l-4 border-danger text-danger p-4" role="alert">
                    <p className="font-bold">Budget Alert!</p>
                    <p>You've used over 85% of your budget. You have overspent on Food. Consider some budget-friendly meal plans.</p>
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
                <Card title="Expense Breakdown">
                    <div style={{ width: '100%', height: 250 }}>
                       {pieData.length > 0 ? (
                        <ResponsiveContainer>
                            <PieChart>
                                {/* FIX: The 'percent' prop from recharts can be undefined. Added a fallback to 0 to prevent a TypeScript error on the arithmetic operation. */}
                                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" labelLine={false} label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
                            </PieChart>
                        </ResponsiveContainer>
                        ) : <p className="text-center text-text-secondary pt-20">No expenses logged yet.</p>}
                    </div>
                </Card>
                 <Card title="Recent Expenses">
                    <div className="space-y-3 max-h-[250px] overflow-y-auto">
                        {expenses.length > 0 ? expenses.map(exp => (
                            <div key={exp.id} className="flex items-center justify-between p-2 rounded-md hover:bg-bg-primary">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{categoryIcons[exp.category]}</span>
                                    <div>
                                        <p className="font-semibold text-text-primary">{exp.note}</p>
                                        <p className="text-sm text-text-secondary">{exp.category}</p>
                                    </div>
                                </div>
                                <p className="font-bold text-lg text-danger">-₹{exp.amount.toFixed(2)}</p>
                            </div>
                        )) : <p className="text-center text-text-secondary pt-20">No recent expenses.</p>}
                    </div>
                </Card>
            </div>
        </div>
    );
};
