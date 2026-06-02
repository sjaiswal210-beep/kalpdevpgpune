import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Phone, Mail, MapPin, Camera, Save, CheckCircle2, FileText, Briefcase, AlertCircle
} from 'lucide-react';
import { getLoggedInStudent, updateTenantProfile } from '../data/store';
import { uploadFile } from '../data/firebase';

export default function StudentProfile({ onSaved }) {
  const [tenant, setTenant] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const t = getLoggedInStudent();
    if (t) {
      setTenant(t);
      setForm({
        name: t.name || '',
        phone: t.phone || '',
        email: t.email || '',
        address: t.address || '',
        emergency: t.emergency || '',
        occupation: t.occupation || '',
        aadhaar: t.aadhaar || '',
        bloodGroup: t.bloodGroup || '',
        parentName: t.parentName || '',
        parentPhone: t.parentPhone || '',
        profileImage: t.profileImage || '',
      });
      setImagePreview(t.profileImage || '');
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    let profileImageUrl = form.profileImage;

    // Upload image to Firebase Storage if a new file was selected
    if (imageFile) {
      try {
        setUploading(true);
        const path = `profile-images/${tenant.id}_${Date.now()}.${imageFile.name.split('.').pop()}`;
        profileImageUrl = await uploadFile(path, imageFile);
        setUploading(false);
      } catch (err) {
        console.error('Image upload failed:', err);
        setUploading(false);
        setSaving(false);
        alert('Image upload failed. Please try a smaller image or check your internet connection.');
        return;
      }
    }

    const updatedForm = { ...form, profileImage: profileImageUrl };
    await updateTenantProfile(tenant.id, updatedForm);
    setForm(updatedForm);
    setImageFile(null);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    // Update local session
    const updated = { ...tenant, ...updatedForm };
    setTenant(updated);
    if (onSaved) onSaved();
  };

  if (!tenant) return null;

  return (
    <div className="space-y-6">
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <p className="text-sm font-medium text-green-700 dark:text-green-400">Profile updated successfully! Changes are visible to admin.</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-purple-600" />
            Profile Photo
          </h3>
          <div className="flex items-center gap-6">
            <div className="relative">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-24 h-24 rounded-2xl object-cover border-2 border-purple-200" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <User className="w-10 h-10 text-purple-400" />
                </div>
              )}
              <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition shadow-lg">
                <Camera className="w-4 h-4 text-white" />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{tenant.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Room {tenant.roomNumber} • Bed {tenant.bed}</p>
              <p className="text-xs text-gray-400 mt-1">Upload a clear photo of yourself</p>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            Personal Details
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Full Name</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="input-field"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone Number</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                disabled
                className="input-field opacity-60 cursor-not-allowed"
                title="Phone number cannot be changed (used for login)"
              />
              <p className="text-xs text-gray-400 mt-0.5">Phone is used for login and cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> Occupation</span>
              </label>
              <input
                type="text"
                value={form.occupation}
                onChange={e => setForm({ ...form, occupation: e.target.value })}
                className="input-field"
                placeholder="Student / Working Professional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Aadhaar Number</span>
              </label>
              <input
                type="text"
                value={form.aadhaar}
                onChange={e => setForm({ ...form, aadhaar: e.target.value })}
                maxLength={12}
                className="input-field"
                placeholder="12-digit Aadhaar"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Emergency Contact</span>
              </label>
              <input
                type="tel"
                value={form.emergency}
                onChange={e => setForm({ ...form, emergency: e.target.value })}
                className="input-field"
                placeholder="Emergency phone number"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <span className="flex items-center gap-1">🩸 Blood Group</span>
              </label>
              <select
                value={form.bloodGroup}
                onChange={e => setForm({ ...form, bloodGroup: e.target.value })}
                className="input-field"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Parent/Guardian Name</span>
              </label>
              <input
                type="text"
                value={form.parentName}
                onChange={e => setForm({ ...form, parentName: e.target.value })}
                className="input-field"
                placeholder="Father/Mother name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Parent Phone</span>
              </label>
              <input
                type="tel"
                maxLength={10}
                value={form.parentPhone}
                onChange={e => setForm({ ...form, parentPhone: e.target.value })}
                className="input-field"
                placeholder="Parent's phone number"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Home Address</span>
            </label>
            <textarea
              rows={2}
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="input-field resize-none"
              placeholder="Your permanent home address"
            />
          </div>
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-400">
            <p className="font-medium">About profile updates</p>
            <p className="text-xs mt-1">Your changes are saved immediately and visible to the admin. Room and bed assignments can only be changed by the admin.</p>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              {uploading ? 'Uploading image...' : 'Saving...'}
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Profile
            </>
          )}
        </button>
      </form>
    </div>
  );
}
