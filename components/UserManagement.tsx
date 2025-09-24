"use client";
import { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Save, X, UserPlus, Shield, Clock, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function UserManagement() {
  const { users, user: currentUser, addUser, deleteUser, updateUser } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    Email: '',
    Name: '',
    Role: 'user'
  });
  const [editData, setEditData] = useState({ name: '', role: '' });

  const pendingUsers = users.filter(u => u.status === 'pending');
  const internalUsers = users.filter(u => (u.role === 'admin' || u.role === 'Admin' || u.role === 'researcher') && u.status !== 'pending');
  const externalUsers = users.filter(u => u.role !== 'admin' && u.role !== 'Admin' && u.role !== 'researcher' && u.status !== 'pending');

  const handleAddUser = async () => {
    if (!newUser.Email.trim() || !newUser.Name.trim()) return;
    
    const success = await addUser({
      Email: newUser.Email,
      Name: newUser.Name,
      Role: newUser.Role,
      Status: 'approved'
    });

    if (success) {
      setNewUser({ Email: '', Name: '', Role: 'user' });
      setShowAddForm(false);
    } else {
      alert('Failed to add user. Email may already exist.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      if (userId === currentUser?.id) {
        alert("You cannot delete your own account.");
        return;
      }
      const success = await deleteUser(userId);
      if (!success) {
        alert('Failed to delete this user.');
      }
    }
  };

  const handleUpdateUser = async (userId: string) => {
    const { name, role } = editData;
    const payload: { Name?: string; Role?: string } = {};
    if (name) payload.Name = name;
    if (role) payload.Role = role;

    await updateUser(userId, payload);
    setEditingUser(null);
  };

  const handleUpdateUserStatus = async (userId: string, status: 'approved' | 'rejected') => {
    await updateUser(userId, { Status: status });
  };

  const startEditing = (user: typeof users[0]) => {
    setEditingUser(user.id);
    setEditData({ name: user.name, role: user.role });
  };


  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const getRoleColor = (role: string) => {
    const roleLower = role.toLowerCase();
    switch (roleLower) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'researcher': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'user': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const UserListSection = ({ title, userList }: { title: string, userList: typeof users }) => (
    <div className="academic-card-elevated p-8">
        <h3 className="text-xl font-bold text-primary mb-6">{title} ({userList.length})</h3>
        <div className="space-y-6">
            {userList.map((u) => (
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
                                    {u.status && u.status !== 'approved' && (
                                      <span className={`px-3 py-1 rounded-full text-sm font-medium border capitalize ${getStatusColor(u.status)}`}>
                                        {u.status}
                                      </span>
                                    )}
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
                                onClick={() => startEditing(u)}
                                className="p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                                title="Edit User"
                            >
                                <Edit2 className="w-5 h-5" />
                            </button>
                            {u.id !== currentUser?.id && (
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
                    {editingUser === u.id && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                <div>
                                    <label className="block text-gray-600 text-sm font-medium mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={editData.name}
                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                        className="academic-input w-full text-base"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm font-medium mb-2">Role</label>
                                    <select
                                        value={editData.role}
                                        onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                                        className="academic-input w-full text-base"
                                        disabled={u.email === 'admin@rmgd.org'}
                                    >
                                        <option value="Admin">Administrator</option>
                                        <option value="researcher">Researcher</option>
                                        <option value="user">User</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end mt-4 space-x-2">
                                <button onClick={() => setEditingUser(null)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"><X className="w-5 h-5" /></button>
                                <button onClick={() => handleUpdateUser(u.id)} className="p-2 text-green-600 hover:bg-green-100 rounded-md"><Save className="w-5 h-5" /></button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
  );

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
                <p className="text-blue-700 text-sm font-medium">Internal Users</p>
                <p className="text-blue-900 text-2xl font-bold">{internalUsers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-green-700 text-sm font-medium">External Users</p>
                <p className="text-green-900 text-2xl font-bold">{externalUsers.length}</p>
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
                value={newUser.Name}
                onChange={(e) => setNewUser({...newUser, Name: e.target.value})}
                className="academic-input w-full text-base"
                placeholder="Enter full name"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-base font-medium mb-3">Email Address</label>
              <input
                type="email"
                value={newUser.Email}
                onChange={(e) => setNewUser({...newUser, Email: e.target.value})}
                className="academic-input w-full text-base"
                placeholder="user@rmgd.org"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-base font-medium mb-3">Role</label>
              <select
                value={newUser.Role}
                onChange={(e) => setNewUser({...newUser, Role: e.target.value})}
                className="academic-input w-full text-base"
              >
                <option value="user">User (External)</option>
                <option value="researcher">Researcher (Internal)</option>
                <option value="Admin">Administrator (Internal)</option>
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
              disabled={!newUser.Name.trim() || !newUser.Email.trim()}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              <Save className="w-5 h-5" />
              <span>Add User</span>
            </button>
          </div>
        </div>
      )}

      {/* Approval Queue */}
      {pendingUsers.length > 0 && (
        <div className="academic-card-elevated p-8">
            <h3 className="text-xl font-bold text-primary mb-6">Approval Queue ({pendingUsers.length})</h3>
            <div className="space-y-4">
                {pendingUsers.map((u) => (
                    <div key={u.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-yellow-800">{u.name}</p>
                            <p className="text-sm text-yellow-700">{u.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => handleUpdateUserStatus(u.id, 'approved')} className="p-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200">
                                <Check className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleUpdateUserStatus(u.id, 'rejected')} className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* Users Lists */}
      <UserListSection title="Internal Users" userList={internalUsers} />
      <UserListSection title="External Users" userList={externalUsers} />
    </div>
  );
}