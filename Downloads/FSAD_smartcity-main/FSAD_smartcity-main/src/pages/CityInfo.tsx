import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Info, 
  Users, 
  Map, 
  Phone, 
  Edit2, 
  Save, 
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CityInfoPage() {
  const { user } = useAuth();
  const { cityInfo, updateCityInfo } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(cityInfo);

  const handleSave = () => {
    updateCityInfo(editData);
    setIsEditing(false);
    toast.success('City information updated');
  };

  const addContact = () => {
    setEditData({
      ...editData,
      emergencyContacts: [...editData.emergencyContacts, { name: '', number: '' }]
    });
  };

  const removeContact = (index: number) => {
    setEditData({
      ...editData,
      emergencyContacts: editData.emergencyContacts.filter((_, i) => i !== index)
    });
  };

  const updateContact = (index: number, field: 'name' | 'number', value: string) => {
    const newContacts = [...editData.emergencyContacts];
    newContacts[index][field] = value;
    setEditData({ ...editData, emergencyContacts: newContacts });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">City Overview</h1>
          <p className="text-slate-600 dark:text-slate-400">General information and emergency contacts for SmartCity.</p>
        </div>
        {user?.role === 'Admin' && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            <span>Edit Info</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-800">
            <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-400">
              <Info className="h-6 w-6" />
              <h3 className="text-lg font-bold">About SmartCity</h3>
            </div>
            {isEditing ? (
              <textarea
                value={editData.overview}
                onChange={(e) => setEditData({ ...editData, overview: e.target.value })}
                rows={6}
                className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            ) : (
              <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">
                {cityInfo.overview}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
              <div className="flex items-center space-x-3 text-blue-600">
                <Users className="h-6 w-6" />
                <h3 className="font-bold">Population</h3>
              </div>
              {isEditing ? (
                <input
                  value={editData.population}
                  onChange={(e) => setEditData({ ...editData, population: e.target.value })}
                  className="mt-4 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              ) : (
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{cityInfo.population}</p>
              )}
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
              <div className="flex items-center space-x-3 text-amber-600">
                <Map className="h-6 w-6" />
                <h3 className="font-bold">Total Area</h3>
              </div>
              {isEditing ? (
                <input
                  value={editData.area}
                  onChange={(e) => setEditData({ ...editData, area: e.target.value })}
                  className="mt-4 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              ) : (
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{cityInfo.area}</p>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-800">
          <div className="flex items-center justify-between text-rose-600">
            <div className="flex items-center space-x-3">
              <Phone className="h-6 w-6" />
              <h3 className="text-lg font-bold">Emergency</h3>
            </div>
            {isEditing && (
              <button onClick={addContact} className="rounded-full bg-rose-50 p-1 hover:bg-rose-100 dark:bg-rose-900/20">
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="mt-6 space-y-4">
            {(isEditing ? editData.emergencyContacts : cityInfo.emergencyContacts).map((contact, index) => (
              <div key={index} className="group relative rounded-xl border border-slate-100 p-4 dark:border-slate-700">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      value={contact.name}
                      onChange={(e) => updateContact(index, 'name', e.target.value)}
                      placeholder="Agency Name"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                    <input
                      value={contact.number}
                      onChange={(e) => updateContact(index, 'number', e.target.value)}
                      placeholder="Phone Number"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                    <button
                      onClick={() => removeContact(index)}
                      className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{contact.name}</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{contact.number}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed bottom-8 right-8 flex space-x-4">
          <button
            onClick={() => { setIsEditing(false); setEditData(cityInfo); }}
            className="flex items-center space-x-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-600 shadow-lg hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-300"
          >
            <X className="h-5 w-5" />
            <span>Cancel</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 rounded-full bg-emerald-600 px-8 py-3 font-semibold text-white shadow-lg hover:bg-emerald-500"
          >
            <Save className="h-5 w-5" />
            <span>Save Changes</span>
          </button>
        </div>
      )}
    </div>
  );
}
