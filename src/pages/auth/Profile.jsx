import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import TouristNavigation from '../../components/ui/TouristNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Profile = () => {
  const { user, userProfile, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [imagePreview, setImagePreview] = useState(userProfile?.profile_image || null);
  const [imageFile, setImageFile] = useState(null);
  
  const [formData, setFormData] = useState({
    full_name: userProfile?.full_name || user?.user_metadata?.full_name || '',
    phone: userProfile?.phone || '',
    bio: userProfile?.bio || '',
    location: userProfile?.location || '',
    date_of_birth: userProfile?.date_of_birth || '',
    nationality: userProfile?.nationality || '',
    profile_image: userProfile?.profile_image || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage({ type: '', text: '' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please upload an image file' });
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setMessage({ type: '', text: '' });
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, profile_image: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // If there's a new image, convert to base64 for storage
      let updateData = { ...formData };
      
      if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          updateData.profile_image = reader.result;
          await saveProfile(updateData);
        };
        reader.readAsDataURL(imageFile);
      } else {
        await saveProfile(updateData);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
      setSaving(false);
    }
  };

  const saveProfile = async (data) => {
    const result = await updateProfile(data);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      setImageFile(null);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setFormData({
      full_name: userProfile?.full_name || user?.user_metadata?.full_name || '',
      phone: userProfile?.phone || '',
      bio: userProfile?.bio || '',
      location: userProfile?.location || '',
      date_of_birth: userProfile?.date_of_birth || '',
      nationality: userProfile?.nationality || '',
      profile_image: userProfile?.profile_image || ''
    });
    setImagePreview(userProfile?.profile_image || null);
    setImageFile(null);
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const getUserRole = () => {
    return userProfile?.role || user?.user_metadata?.role || 'tourist';
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'agent': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return 'Shield';
      case 'agent': return 'Briefcase';
      default: return 'User';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader" size={40} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const userRole = getUserRole();

  return (
    <div className="min-h-screen bg-background">
      <TouristNavigation />
      
      <main className="pt-20 pb-24 md:pt-24 md:pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <Icon name="ArrowLeft" size={20} />
            <span className="font-body">Back</span>
          </button>

          {/* Profile Header */}
          <div className="bg-card rounded-xl shadow-tourism p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex items-start space-x-4">
                {/* Avatar with Upload */}
                <div className="relative group">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-2xl font-bold">
                      {(formData.full_name || user?.email)?.[0]?.toUpperCase()}
                    </div>
                  )}
                  
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <label htmlFor="profile-image" className="cursor-pointer flex items-center justify-center w-full h-full">
                        <Icon name="Camera" size={24} color="white" />
                        <input
                          id="profile-image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                  
                  {isEditing && imagePreview && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/80 transition-colors z-10"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  )}
                </div>
                
                <div>
                  <h1 className="font-heading text-2xl font-bold text-foreground mb-1">
                    {formData.full_name || 'User'}
                  </h1>
                  <p className="text-muted-foreground text-sm mb-3">{user?.email}</p>
                  
                  {/* Role Badge */}
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getRoleColor(userRole)}`}>
                    <Icon name={getRoleIcon(userRole)} size={14} />
                    <span className="text-xs font-medium capitalize">{userRole}</span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="self-start"
                >
                  <Icon name="Edit" size={18} className="mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Success/Error Messages */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <div className="flex items-start">
                <Icon 
                  name={message.type === 'success' ? 'CheckCircle' : 'AlertCircle'} 
                  size={20} 
                  className="mr-2 flex-shrink-0 mt-0.5"
                />
                <span className="text-sm font-body">{message.text}</span>
              </div>
            </div>
          )}

          {/* Profile Form */}
          <div className="bg-card rounded-xl shadow-tourism p-6">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-6">
              Personal Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="full_name" className="block font-body text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label htmlFor="email" className="block font-body text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block font-body text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="+254 700 000000"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block font-body text-sm font-medium text-foreground mb-2">
                  Location
                </label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="City, Country"
                />
              </div>

              {/* Nationality */}
              <div>
                <label htmlFor="nationality" className="block font-body text-sm font-medium text-foreground mb-2">
                  Nationality
                </label>
                <select
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition disabled:bg-muted disabled:cursor-not-allowed font-body text-foreground bg-background"
                >
                  <option value="">Select your nationality</option>
                  <option value="Kenyan">Kenyan</option>
                  <option value="American">American</option>
                  <option value="British">British</option>
                  <option value="Canadian">Canadian</option>
                  <option value="Australian">Australian</option>
                  <option value="South African">South African</option>
                  <option value="Nigerian">Nigerian</option>
                  <option value="Ghanaian">Ghanaian</option>
                  <option value="Tanzanian">Tanzanian</option>
                  <option value="Ugandan">Ugandan</option>
                  <option value="Ethiopian">Ethiopian</option>
                  <option value="Rwandan">Rwandan</option>
                  <option value="Indian">Indian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Japanese">Japanese</option>
                  <option value="German">German</option>
                  <option value="French">French</option>
                  <option value="Italian">Italian</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Brazilian">Brazilian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Dutch">Dutch</option>
                  <option value="Swedish">Swedish</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="date_of_birth" className="block font-body text-sm font-medium text-foreground mb-2">
                  Date of Birth
                </label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block font-body text-sm font-medium text-foreground mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition disabled:bg-muted disabled:cursor-not-allowed font-body text-foreground"
                />
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex items-center space-x-4 pt-4">
                  <Button
                    type="submit"
                    variant="default"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Icon name="Loader" size={18} className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Icon name="Save" size={18} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </div>

          {/* Account Information */}
          <div className="bg-card rounded-xl shadow-tourism p-6 mt-6">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
              Account Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center space-x-3">
                  <Icon name="Calendar" size={20} className="text-muted-foreground" />
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">Member Since</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(user?.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center space-x-3">
                  <Icon name="Shield" size={20} className="text-muted-foreground" />
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">Account Status</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email_confirmed_at ? 'Verified' : 'Unverified'}
                    </p>
                  </div>
                </div>
                {user?.email_confirmed_at && (
                  <Icon name="CheckCircle" size={20} className="text-green-500" />
                )}
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <Icon name="Key" size={20} className="text-muted-foreground" />
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">Password</p>
                    <p className="text-xs text-muted-foreground">Last changed recently</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;