import React, { useState } from 'react';
import { useData, Infrastructure as InfraType } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X,
  Zap,
  Droplets,
  Map as Road,
  Trash
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Infrastructure() {
  const { user } = useAuth();
  const { infrastructure, addInfrastructure, updateInfrastructure, deleteInfrastructure } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInfra, setEditingInfra] = useState<InfraType | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getIcon = (type: InfraType['type']) => {
    switch (type) {
      case 'Electricity': return Zap;
      case 'Water': return Droplets;
      case 'Road': return Road;
      case 'Waste': return Trash;
      default: return Road;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const infraData = {
      name: formData.get('name') as string,
      type: formData.get('type') as InfraType['type'],
      details: formData.get('details') as string,
      status: formData.get('status') as InfraType['status'],
    };

    if (editingInfra) {
      updateInfrastructure({ ...infraData, id: editingInfra.id });
      toast.success('Infrastructure updated');
    } else {
      addInfrastructure(infraData);
      toast.success('Infrastructure added');
    }
    setIsModalOpen(false);
    setEditingInfra(null);
  };

  const handleDelete = (id: string) => {
    deleteInfrastructure(id);
    toast.success('Infrastructure deleted successfully');
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">City Infrastructure</h1>
          <p className="text-slate-600 dark:text-slate-400">Monitoring and managing essential city systems.</p>
        </div>
        {user?.role === 'Admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center space-x-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Infrastructure</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {infrastructure.map((item) => {
          const Icon = getIcon(item.type);
          return (
            <div key={item.id} className="group relative rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-slate-800">
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700">
                  <Icon className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                </div>
                {user?.role === 'Admin' && (
                  <div className="flex space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
                    {deletingId === item.id ? (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="rounded-lg bg-rose-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-rose-500"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="rounded-lg bg-slate-200 px-2 py-1 text-[10px] font-bold text-slate-600 hover:bg-slate-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingInfra(item);
                            setIsModalOpen(true);
                          }}
                          className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-slate-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(item.id)}
                          className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.name}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    item.status === 'Operational' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-500">{item.type}</p>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{item.details}</p>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingInfra ? 'Edit Infrastructure' : 'Add Infrastructure'}
              </h2>
              <button onClick={() => { setIsModalOpen(false); setEditingInfra(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                <input
                  name="name"
                  required
                  defaultValue={editingInfra?.name}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
                <select
                  name="type"
                  defaultValue={editingInfra?.type || 'Road'}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="Road">Road</option>
                  <option value="Water">Water Supply</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Waste">Waste Management</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Details</label>
                <textarea
                  name="details"
                  required
                  rows={3}
                  defaultValue={editingInfra?.details}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                <select
                  name="status"
                  defaultValue={editingInfra?.status || 'Operational'}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="Operational">Operational</option>
                  <option value="Under Repair">Under Repair</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
              >
                {editingInfra ? 'Update Infrastructure' : 'Add Infrastructure'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
