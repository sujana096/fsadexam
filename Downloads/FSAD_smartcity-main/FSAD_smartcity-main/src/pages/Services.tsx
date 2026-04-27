import React, { useState, useMemo } from 'react';
import { useData, Service } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Phone, 
  MapPin,
  Building2,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Services() {
  const { user } = useAuth();
  const { services, addService, updateService, deleteService } = useData();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase()) ||
                          service.address.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || service.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || service.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [services, search, categoryFilter, statusFilter]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const serviceData = {
      name: formData.get('name') as string,
      category: formData.get('category') as Service['category'],
      address: formData.get('address') as string,
      contact: formData.get('contact') as string,
      status: formData.get('status') as Service['status'],
    };

    if (editingService) {
      updateService({ ...serviceData, id: editingService.id });
      toast.success('Service updated successfully');
    } else {
      addService(serviceData);
      toast.success('Service added successfully');
    }
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleDelete = (id: string) => {
    deleteService(id);
    toast.success('Service deleted successfully');
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Public Services</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage and discover city facilities and services.</p>
        </div>
        {user?.role === 'Admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center space-x-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Service</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800 lg:grid-cols-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="All">All Categories</option>
          <option value="Hospital">Hospitals</option>
          <option value="Police">Police Stations</option>
          <option value="Fire">Fire Stations</option>
          <option value="Transport">Public Transport</option>
          <option value="School">Schools</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Maintenance">Maintenance</option>
        </select>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredServices.map((service) => (
          <div key={service.id} className="group relative rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-slate-800">
            <div className="flex items-start justify-between">
              <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                <Building2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              {user?.role === 'Admin' && (
                <div className="flex space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
                  {deletingId === service.id ? (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleDelete(service.id)}
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
                          setEditingService(service);
                          setIsModalOpen(true);
                        }}
                        className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-slate-700"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(service.id)}
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
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{service.name}</h3>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  service.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {service.status}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">{service.category}</p>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{service.address}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                  <Phone className="mr-2 h-4 w-4" />
                  <span>{service.contact}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button onClick={() => { setIsModalOpen(false); setEditingService(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Service Name</label>
                <input
                  name="name"
                  required
                  defaultValue={editingService?.name}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                <select
                  name="category"
                  defaultValue={editingService?.category || 'Hospital'}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="Hospital">Hospital</option>
                  <option value="Police">Police Station</option>
                  <option value="Fire">Fire Station</option>
                  <option value="Transport">Public Transport</option>
                  <option value="School">School</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                <input
                  name="address"
                  required
                  defaultValue={editingService?.address}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Contact</label>
                <input
                  name="contact"
                  required
                  defaultValue={editingService?.contact}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                <select
                  name="status"
                  defaultValue={editingService?.status || 'Active'}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
              >
                {editingService ? 'Update Service' : 'Add Service'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
