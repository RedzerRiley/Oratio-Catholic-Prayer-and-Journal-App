import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { Navigation } from '../components/Navigation';
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  ChevronRight,
  UserCircle,
  Camera,
  LogOut,
  Lock,
  User,
  Mail,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function Profile() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  // Display name
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.displayName ?? '');
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState('');

  // Password
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Photo
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Loading states
  const [savingName, setSavingName] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image must be under 5MB.');
      return;
    }

    setUploading(true);
    setPhotoError('');
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      await updateProfile(auth.currentUser!, { photoURL: downloadURL });
      // Force re-render by reloading
      window.location.reload();
    } catch {
      setPhotoError('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveName = async () => {
    if (!newName.trim() || !user) return;
    setSavingName(true);
    setNameError('');
    try {
      await updateProfile(auth.currentUser!, { displayName: newName.trim() });
      setEditingName(false);
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch {
      setNameError('Failed to update name. Please try again.');
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }

    setSavingPassword(true);
    setPasswordError('');
    try {
      // Re-authenticate first
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser!, credential);
      await updatePassword(auth.currentUser!, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordSection(false);
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setPasswordError('Current password is incorrect.');
      } else {
        setPasswordError('Failed to update password. Please try again.');
      }
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogOut = async () => {
    await logOut();
    navigate('/auth');
  };

  const isGoogleUser = user?.providerData?.[0]?.providerId === 'google.com';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 pt-12 pb-16 rounded-b-3xl shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/')} className="bg-white/20 rounded-full p-2">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h1 className="text-2xl font-serif">My Profile</h1>
        </div>
      </div>

      {/* Avatar */}
      <div className="max-w-md mx-auto px-6 -mt-10 mb-6 flex flex-col items-center">
        <div className="relative">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl bg-blue-100 flex items-center justify-center">
              <UserCircle className="w-14 h-14 text-blue-400" />
            </div>
          )}

          {/* Camera button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow-lg border-2 border-white hover:bg-blue-700 transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>

        {uploading && <p className="text-sm text-blue-600 mt-2">Uploading photo...</p>}
        {photoError && (
          <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> {photoError}
          </p>
        )}

        <h2 className="text-xl font-serif text-gray-800 mt-3">{user?.displayName ?? 'No name set'}</h2>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>

      <div className="max-w-md mx-auto px-6 space-y-4">

        {/* Success banners */}
        {nameSuccess && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
            <CheckCircle className="w-4 h-4" /> Display name updated!
          </div>
        )}
        {passwordSuccess && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
            <CheckCircle className="w-4 h-4" /> Password changed successfully!
          </div>
        )}

        {/* Account Info */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Account</p>
          </div>

          {/* Display Name */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-1">
              <User className="w-4 h-4 text-gray-400" />
              <p className="text-xs text-gray-500">Display Name</p>
            </div>
            {editingName ? (
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter your name"
                />
                {nameError && <p className="text-xs text-red-500">{nameError}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveName}
                    disabled={savingName || !newName.trim()}
                    className="flex-1 bg-blue-600 text-white rounded-xl py-2 text-sm font-medium disabled:opacity-50"
                  >
                    {savingName ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => { setEditingName(false); setNameError(''); setNewName(user?.displayName ?? ''); }}
                    className="flex-1 bg-gray-100 text-gray-700 rounded-xl py-2 text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between mt-1">
                <p className="text-gray-800 font-medium">{user?.displayName ?? '—'}</p>
                <button
                  onClick={() => setEditingName(true)}
                  className="text-xs text-blue-600 font-medium"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-3 mb-1">
              <Mail className="w-4 h-4 text-gray-400" />
              <p className="text-xs text-gray-500">Email</p>
            </div>
            <p className="text-gray-800 font-medium mt-1">{user?.email}</p>
          </div>
        </div>

        {/* Security */}
        {!isGoogleUser && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Security</p>
            </div>

            <button
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="w-full flex items-center justify-between px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-800 font-medium text-sm">Change Password</span>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showPasswordSection ? 'rotate-90' : ''}`} />
            </button>

            {showPasswordSection && (
              <div className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-4">
                {/* Current password */}
                <div className="relative">
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* New password */}
                <div className="relative">
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Confirm password */}
                <input
                  type={showNewPw ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />

                {passwordError && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {passwordError}
                  </p>
                )}

                <button
                  onClick={handleChangePassword}
                  disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
                  className="w-full bg-blue-600 text-white rounded-xl py-2.5 text-sm font-medium disabled:opacity-50 transition-colors hover:bg-blue-700"
                >
                  {savingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            )}
          </div>
        )}

        {isGoogleUser && (
          <div className="bg-blue-50 rounded-2xl p-4 text-sm text-blue-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            You signed in with Google. Password changes are managed through your Google account.
          </div>
        )}

        {/* Sign Out */}
        <button
          onClick={handleLogOut}
          className="w-full bg-white rounded-2xl shadow-md px-5 py-4 flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>

        <p className="text-center text-xs text-gray-400 pb-4">
          Oratio v1.0 · Made with 🙏
        </p>
      </div>

      <Navigation />
    </div>
  );
}