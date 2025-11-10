
import React, { useState, useEffect } from 'react';
import { UserData } from '../types';
import { Modal } from './Modal';
import { Button } from './Button';
import { Card } from './Card';

interface EditProfileModalProps {
    profile: UserData['profile'];
    onSave: (newProfile: UserData['profile']) => void;
    onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ profile, onSave, onClose }) => {
    const [bio, setBio] = useState(profile.bio);
    const [skills, setSkills] = useState([...profile.skills]);
    const [projects, setProjects] = useState([...profile.projects]);
    const [newSkill, setNewSkill] = useState('');

    const [isAddingProject, setIsAddingProject] = useState(false);
    const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
    const [currentProject, setCurrentProject] = useState({ title: '', description: '' });

    useEffect(() => {
        setBio(profile.bio);
        setSkills([...profile.skills]);
        setProjects([...profile.projects]);
    }, [profile]);

    const handleAddSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const handleRemoveProject = (index: number) => {
        setProjects(projects.filter((_, i) => i !== index));
    };
    
    const handleStartAddingProject = () => {
        setCurrentProject({ title: '', description: '' });
        setIsAddingProject(true);
        setEditingProjectIndex(null);
    };

    const handleStartEditingProject = (index: number) => {
        setCurrentProject(projects[index]);
        setEditingProjectIndex(index);
        setIsAddingProject(false);
    }

    const handleSaveProject = () => {
        if (!currentProject.title.trim()) return;

        if (editingProjectIndex !== null) {
            const updatedProjects = [...projects];
            updatedProjects[editingProjectIndex] = currentProject;
            setProjects(updatedProjects);
        } else {
            setProjects([...projects, currentProject]);
        }
        setEditingProjectIndex(null);
        setIsAddingProject(false);
        setCurrentProject({ title: '', description: '' });
    };

    const handleCancelProjectEdit = () => {
        setIsAddingProject(false);
        setEditingProjectIndex(null);
        setCurrentProject({ title: '', description: '' });
    }

    const handleSaveChanges = () => {
        onSave({
            ...profile, // Persist any profile properties not being edited
            bio,
            skills,
            projects,
        });
    };

    return (
        <Modal title="Edit Profile" onClose={onClose}>
            <div className="space-y-6 max-h-[70vh] overflow-y-auto p-1 -mr-2 pr-2">
                {/* Bio Section */}
                <div>
                    <label htmlFor="bio" className="block text-sm font-bold text-text-secondary mb-1">Bio</label>
                    <textarea
                        id="bio"
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg focus:ring-primary focus:border-primary"
                        placeholder="Tell us about yourself..."
                    />
                </div>

                {/* Skills Section */}
                <div>
                    <label htmlFor="skills" className="block text-sm font-bold text-text-secondary mb-1">Skills</label>
                    <div className="flex flex-wrap gap-2 mb-2 min-h-[2.5rem] items-center">
                        {skills.length === 0 && <p className="text-sm text-text-secondary italic">No skills added yet.</p>}
                        {skills.map(skill => (
                            <span key={skill} className="bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-2">
                                {skill}
                                <button onClick={() => handleRemoveSkill(skill)} className="font-bold text-primary hover:text-danger">&times;</button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                            placeholder="Add a new skill"
                            className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg focus:ring-primary focus:border-primary"
                        />
                        <Button type="button" onClick={handleAddSkill}>Add</Button>
                    </div>
                </div>

                {/* Projects Section */}
                <div>
                    <label className="block text-sm font-bold text-text-secondary mb-2">Projects</label>
                    <div className="space-y-3">
                        {projects.length === 0 && !isAddingProject && editingProjectIndex === null && (
                            <p className="text-text-secondary text-center py-4 italic">No projects yet. Add your first one!</p>
                        )}
                        {projects.map((proj, index) => (
                             <Card key={index} className="p-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-text-primary">{proj.title}</h4>
                                        <p className="text-sm text-text-secondary">{proj.description}</p>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0 ml-2">
                                        <Button variant="secondary" className="text-xs !p-1.5" onClick={() => handleStartEditingProject(index)}>Edit</Button>
                                        <Button variant="danger" className="text-xs !p-1.5" onClick={() => handleRemoveProject(index)}>Delete</Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        
                        {(isAddingProject || editingProjectIndex !== null) && (
                            <Card className="p-4 bg-bg-primary">
                                <h4 className="font-bold mb-2">{editingProjectIndex !== null ? 'Edit Project' : 'Add New Project'}</h4>
                                <div className="space-y-3">
                                    <input type="text" placeholder="Project Title" value={currentProject.title} onChange={(e) => setCurrentProject(p => ({...p, title: e.target.value}))} className="w-full px-3 py-2 bg-bg-secondary border border-border-default rounded-lg" />
                                    <textarea placeholder="Project Description" rows={2} value={currentProject.description} onChange={(e) => setCurrentProject(p => ({...p, description: e.target.value}))} className="w-full px-3 py-2 bg-bg-secondary border border-border-default rounded-lg" />
                                    <div className="flex justify-end gap-2">
                                        <Button variant="secondary" className="bg-gray-200 text-gray-800" onClick={handleCancelProjectEdit}>Cancel</Button>
                                        <Button onClick={handleSaveProject}>Save Project</Button>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {!isAddingProject && editingProjectIndex === null && (
                            <Button type="button" className="w-full" variant="success" onClick={handleStartAddingProject}>Add Project</Button>
                        )}
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-border-default mt-6">
                    <Button type="button" variant="secondary" onClick={onClose} className="bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</Button>
                    <Button type="button" onClick={handleSaveChanges}>Save Changes</Button>
                </div>
            </div>
        </Modal>
    );
};
