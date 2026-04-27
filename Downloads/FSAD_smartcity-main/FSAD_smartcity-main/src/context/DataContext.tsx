import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CityInfo {
  overview: string;
  population: string;
  area: string;
  emergencyContacts: { name: string; number: string }[];
}

export interface Service {
  id: string;
  name: string;
  category: 'Hospital' | 'Police' | 'Fire' | 'Transport' | 'School';
  address: string;
  contact: string;
  status: 'Active' | 'Maintenance';
}

export interface Infrastructure {
  id: string;
  name: string;
  type: 'Road' | 'Water' | 'Electricity' | 'Waste';
  details: string;
  status: 'Operational' | 'Under Repair';
}

export interface Report {
  id: string;
  userId: string;
  serviceId: string;
  issueTitle: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  createdAt: string;
}

export interface Feedback {
  id: string;
  userId: string;
  message: string;
  rating: number;
  createdAt: string;
}

interface DataContextType {
  cityInfo: CityInfo;
  services: Service[];
  infrastructure: Infrastructure[];
  reports: Report[];
  feedbacks: Feedback[];
  updateCityInfo: (info: CityInfo) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
  addInfrastructure: (infra: Omit<Infrastructure, 'id'>) => void;
  updateInfrastructure: (infra: Infrastructure) => void;
  deleteInfrastructure: (id: string) => void;
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'status'>) => void;
  updateReportStatus: (id: string, status: Report['status']) => void;
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialCityInfo: CityInfo = {
  overview: "SmartCity is a leading-edge urban center focused on sustainability and technology.",
  population: "1.2 Million",
  area: "450 sq km",
  emergencyContacts: [
    { name: "Emergency", number: "911" },
    { name: "Police", number: "100" },
    { name: "Fire", number: "101" }
  ]
};

const initialServices: Service[] = [
  { id: '1', name: 'City General Hospital', category: 'Hospital', address: '123 Health Ave', contact: '555-0101', status: 'Active' },
  { id: '2', name: 'Central Police Station', category: 'Police', address: '456 Safety St', contact: '555-0102', status: 'Active' },
  { id: '3', name: 'Metro Transit Hub', category: 'Transport', address: '789 Move Blvd', contact: '555-0103', status: 'Maintenance' },
];

const initialInfrastructure: Infrastructure[] = [
  { id: '1', name: 'Main Power Grid', type: 'Electricity', details: 'Supplies 80% of city power.', status: 'Operational' },
  { id: '2', name: 'North Water Treatment', type: 'Water', details: 'Filtering 500k gallons/day.', status: 'Operational' },
  { id: '3', name: 'West Highway Bridge', type: 'Road', details: 'Structural inspection ongoing.', status: 'Under Repair' },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [cityInfo, setCityInfo] = useState<CityInfo>(() => {
    const saved = localStorage.getItem('cityInfo');
    return saved ? JSON.parse(saved) : initialCityInfo;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('services');
    return saved ? JSON.parse(saved) : initialServices;
  });

  const [infrastructure, setInfrastructure] = useState<Infrastructure[]>(() => {
    const saved = localStorage.getItem('infrastructure');
    return saved ? JSON.parse(saved) : initialInfrastructure;
  });

  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => {
    const saved = localStorage.getItem('feedback');
    return saved ? JSON.parse(saved) : [];
  });

  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  };

  useEffect(() => {
    localStorage.setItem('cityInfo', JSON.stringify(cityInfo));
    localStorage.setItem('services', JSON.stringify(services));
    localStorage.setItem('infrastructure', JSON.stringify(infrastructure));
    localStorage.setItem('reports', JSON.stringify(reports));
    localStorage.setItem('feedback', JSON.stringify(feedbacks));
  }, [cityInfo, services, infrastructure, reports, feedbacks]);

  const updateCityInfo = (info: CityInfo) => setCityInfo(info);

  const addService = (service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: generateId() };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (updated: Service) => {
    setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const addInfrastructure = (infra: Omit<Infrastructure, 'id'>) => {
    const newInfra = { ...infra, id: generateId() };
    setInfrastructure(prev => [...prev, newInfra]);
  };

  const updateInfrastructure = (updated: Infrastructure) => {
    setInfrastructure(prev => prev.map(i => i.id === updated.id ? updated : i));
  };

  const deleteInfrastructure = (id: string) => {
    setInfrastructure(prev => prev.filter(i => i.id !== id));
  };

  const addReport = (report: Omit<Report, 'id' | 'createdAt' | 'status'>) => {
    const newReport: Report = {
      ...report,
      id: generateId(),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    setReports(prev => [...prev, newReport]);
  };

  const updateReportStatus = (id: string, status: Report['status']) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const addFeedback = (feedback: Omit<Feedback, 'id' | 'createdAt'>) => {
    const newFeedback: Feedback = {
      ...feedback,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setFeedbacks(prev => [...prev, newFeedback]);
  };

  return (
    <DataContext.Provider value={{
      cityInfo, services, infrastructure, reports, feedbacks,
      updateCityInfo, addService, updateService, deleteService,
      addInfrastructure, updateInfrastructure, deleteInfrastructure,
      addReport, updateReportStatus, addFeedback
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
