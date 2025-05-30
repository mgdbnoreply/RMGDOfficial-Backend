"use client";
import { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Save, X, UserPlus, Shield, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NewUser {
  email: string;
  name: string;
  role: string;
}

export default function UserManagement() {
  const { users, user: currentUser, addUser, deleteUser, updateUser } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<NewUser>({
    email: '',
    name: '',
    role: 'researcher'
  });

  const handleAddUser = () => {
    if (!newUser.email.trim() || !newUser.name.trim()) return;
    
    const success = addUser({
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    });

    if (success) {
      setNewUser({ email: '', name: '', role: 'researcher' });
      setShowAddForm(false);
    } else {
      alert('Failed to add user. Email may already exist.');
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const success = deleteUser(userId);
      if (!success) {
        alert('Cannot delete this user.');
      }
    }
  };

  const handleUpdateUser = (userId: string, field: string, value: string) => {
    updateUser(userId, { [field]: value });
    setEditingUser(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'researcher': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'curator': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="academic-card-elevated p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">User Management</h2>
              <p className="text-secondary text-lg">Manage RMGD portal access and permissions</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium text-base shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add User</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 rounded-xl p-6 border border-red-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-red-700 text-sm font-medium">Total Users</p>
                <p className="text-red-900 text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-blue-700 text-sm font-medium">Administrators</p>
                <p className="text-blue-900 text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-purple-700 text-sm font-medium">Researchers</p>
                <p className="text-purple-900 text-2xl font-bold">{users.filter(u => u.role === 'researcher').length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className="academic-card-elevated p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-primary">Add New User</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-base font-medium mb-3">Full Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                className="academic-input w-full text-base"
                placeholder="Enter full name"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-base font-medium mb-3">Email Address</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="academic-input w-full text-base"
                placeholder="user@rmgd.org"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-base font-medium mb-3">Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="academic-input w-full text-base"
              >
                <option value="researcher">Researcher</option>
                <option value="curator">Curator</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-8 space-x-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              disabled={!newUser.name.trim() || !newUser.email.trim()}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              <Save className="w-5 h-5" />
              <span>Add User</span>
            </button>
          </div>
          
          <div className="mt-6 p-6 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-amber-800 text-base font-medium mb-2">Default Password</p>
            <p className="text-amber-700 text-base">New users will have the password: <code className="bg-amber-100 px-2 py-1 rounded">changeMe123</code></p>
            <p className="text-amber-600 text-sm mt-2">Users should change this password after first login.</p>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="academic-card-elevated p-8">
        <h3 className="text-xl font-bold text-primary mb-6">Current Users</h3>
        
        <div className="space-y-6">
          {users.map((u) => (
            <div key={u.id} className="academic-card p-6 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className="text-lg font-semibold text-primary">{u.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(u.role)}`}>
                        {u.role}
                      </span>
                      {u.id === currentUser?.id && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200">
                          Current User
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 text-base mb-2">{u.email}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Created: {formatDate(u.createdAt)}</span>
                      {u.lastLogin && (
                        <span>Last Login: {formatDate(u.lastLogin)}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingUser(editingUser === u.id ? null : u.id)}
                    className="p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                    title="Edit User"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  
                  {u.email !== 'admin@rmgd.org' && u.id !== currentUser?.id && (
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete User"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Edit Form */}
              {editingUser === u.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-2">Name</label>
                      <input
                        type="text"
                        defaultValue={u.name}
                        onBlur={(e) => handleUpdateUser(u.id, 'name', e.target.value)}
                        className="academic-input w-full text-base"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-2">Role</label>
                      <select
                        defaultValue={u.role}
                        onChange={(e) => handleUpdateUser(u.id, 'role', e.target.value)}
                        className="academic-input w-full text-base"
                        disabled={u.email === 'admin@rmgd.org'}
                      >
                        <option value="researcher">Researcher</option>
                        <option value="curator">Curator</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}