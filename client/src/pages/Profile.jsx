import React, { useState } from 'react';
import { User, Upload, Globe, Subtitles, Sparkles } from 'lucide-react';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null,
    language: 'English',
    subtitles: 'English',
  });

  const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Korean'];
  const subtitleOptions = ['Off', 'English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Korean'];

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 min-h-screen pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Your Profile
          </h1>
          <p className="text-gray-400 text-lg">Manage your account preferences</p>
        </div>

        {/* Profile Management Section */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center">
            <User className="w-8 h-8 text-brand-red mr-3" />
            Profile Settings
          </h2>

          <div className="bg-rich-gray border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Avatar Upload */}
              <div className="md:col-span-2 flex flex-col items-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-red to-brand-dark-red flex items-center justify-center overflow-hidden border-4 border-white/10 shadow-2xl">
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-white" />
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-brand-red hover:bg-brand-dark-red text-white p-3 rounded-full cursor-pointer transition-all transform hover:scale-110 shadow-lg"
                  >
                    <Upload className="w-5 h-5" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-gray-400 text-sm mt-4">Click the icon to upload a new avatar</p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-white font-semibold mb-3 flex items-center">
                  <User className="w-5 h-5 text-brand-red mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full bg-deep-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-red transition-all"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-white font-semibold mb-3 flex items-center">
                  <Sparkles className="w-5 h-5 text-brand-red mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  readOnly
                  className="w-full bg-deep-black/50 border border-white/10 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed"
                />
              </div>

              {/* Language Preference */}
              <div>
                <label className="block text-white font-semibold mb-3 flex items-center">
                  <Globe className="w-5 h-5 text-brand-red mr-2" />
                  Preferred Language
                </label>
                <select
                  value={profileData.language}
                  onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
                  className="w-full bg-deep-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-red transition-all cursor-pointer"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang} className="bg-rich-gray">
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subtitle Preference */}
              <div>
                <label className="block text-white font-semibold mb-3 flex items-center">
                  <Subtitles className="w-5 h-5 text-brand-red mr-2" />
                  Subtitle Preference
                </label>
                <select
                  value={profileData.subtitles}
                  onChange={(e) => setProfileData({ ...profileData, subtitles: e.target.value })}
                  className="w-full bg-deep-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-red transition-all cursor-pointer"
                >
                  {subtitleOptions.map((option) => (
                    <option key={option} value={option} className="bg-rich-gray">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button className="bg-brand-red hover:bg-brand-dark-red text-white font-bold px-8 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
