import React, { useState } from 'react';

const ProfileSelector = ({ 
  profiles, 
  activeProfileId, 
  onSelectProfile, 
  onCreateProfile,
  onDeleteProfile 
}) => {
  const [newProfileName, setNewProfileName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newProfileName.trim()) {
      onCreateProfile(newProfileName);
      setNewProfileName('');
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setNewProfileName('');
    setIsCreating(false);
  };

  return (
    <div className="profile-selector">
      <h2>Your Lists</h2>
      
      <div className="profiles-list">
        {profiles.map(profile => (
          <div 
            key={profile.id} 
            className={`profile-item ${profile.id === activeProfileId ? 'active' : ''}`}
            onClick={() => onSelectProfile(profile.id)}
          >
            <span className="profile-name">{profile.name}</span>
            <span className="profile-count">({profile.items.length})</span>
            
            {profile.id !== 'default' && (
              <button 
                className="profile-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteProfile(profile.id);
                }}
                title="Delete list"
              >
                <span className="material-icons">delete</span>
              </button>
            )}
          </div>
        ))}
      </div>
      
      {isCreating ? (
        <form onSubmit={handleSubmit} className="new-profile-form">
          <input
            type="text"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="List name"
            autoFocus
            className="new-profile-input"
          />
          <div className="form-buttons">
            <button type="submit" className="btn-create">Create</button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      ) : (
        <button 
          className="new-profile-btn" 
          onClick={() => setIsCreating(true)}
        >
          <span className="material-icons">add</span>
          New List
        </button>
      )}
    </div>
  );
};

export default ProfileSelector; 