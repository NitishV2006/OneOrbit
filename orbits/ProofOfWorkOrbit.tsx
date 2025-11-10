
import React, { useRef, useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { User, UserData } from '../types';
import { resizeImage } from '../lib/utils';
import { EditProfileModal } from '../components/EditProfileModal';

export const ProfileOrbit: React.FC<{ 
    user: User; 
    updateUser: (user: User) => void;
    userData: UserData;
    setUserData: (data: UserData) => void;
}> = ({ user, updateUser, userData, setUserData }) => {

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resizedBase64 = await resizeImage(file, 256);
        updateUser({ ...user, avatarUrl: resizedBase64 });
      } catch (error) {
        console.error("Error resizing image:", error);
        // Optionally, show an error message to the user
      }
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleProfileSave = (newProfile: UserData['profile']) => {
    setUserData({ ...userData, profile: newProfile });
    setIsEditing(false);
  };

  return (
    <>
      {isEditing && (
        <EditProfileModal 
            profile={userData.profile}
            onSave={handleProfileSave}
            onClose={() => setIsEditing(false)}
        />
      )}
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="text-center">
              <div className="relative w-32 h-32 mx-auto">
                  <img 
                      src={user.avatarUrl} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full mx-auto border-4 border-primary object-cover" 
                  />
                  <button 
                      onClick={handleAvatarClick}
                      className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 hover:bg-blue-600"
                      aria-label="Change profile picture"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
                      </svg>
                  </button>
                  <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      className="hidden"
                      accept="image/png, image/jpeg"
                  />
              </div>
              <h2 className="text-2xl font-bold mt-4 text-text-primary">{user.username}</h2>
              <p className="text-text-secondary">Computer Science Student</p>
              <p className="mt-4 text-sm text-text-secondary">{userData.profile.bio}</p>
              <Button onClick={() => setIsEditing(true)} className="mt-4 w-full">Edit Profile</Button>
            </Card>
            <Card title="Stats">
              <div className="space-y-2 text-text-primary">
                  <p><strong>Tasks Completed:</strong> {userData.tasks.filter(t=>t.completed_at).length}</p>
                  <p><strong>Topics Mastered:</strong> {userData.learningItems.filter(i=>i.mastery_score >= 90).length}</p>
                  <p><strong>Total Expenses Logged:</strong> {userData.expenses.length}</p>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
              <Card title="Projects">
                  <div className="space-y-4">
                      {userData.profile.projects.length > 0 ? (
                        userData.profile.projects.map((proj, i) => (
                           <div key={i}>
                              <h3 className="font-bold text-primary">{proj.title}</h3>
                              <p className="text-sm text-text-secondary">{proj.description}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-text-secondary text-center py-4">No projects added yet. Click 'Edit Profile' to add one.</p>
                      )}
                  </div>
              </Card>
               <Card title="Skills">
                  <div className="flex flex-wrap gap-2">
                      {userData.profile.skills.length > 0 ? (
                        userData.profile.skills.map(skill => (
                          <span key={skill} className="bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full">{skill}</span>
                        ))
                      ) : (
                        <p className="text-text-secondary">No skills added yet. Click 'Edit Profile' to add your skills.</p>
                      )}
                  </div>
              </Card>
          </div>
        </div>
      </div>
    </>
  );
};
