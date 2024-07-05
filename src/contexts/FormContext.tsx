/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useEffect, useContext, ReactNode, ChangeEvent } from 'react';
import { getStorage, setStorage } from '../utils';

interface FormData {
  username: string;
  telphone: string;
  backgroundUrl: string;
  defaultTab: string;
  github: string;
  gitlab: string;
  bamboohr: string;
  overview: string;
  pinBookmarks: string[];
  tasks: string[];
  enabledDashboard: boolean;
  enabledTasks: boolean;
  enabledQuotes: boolean;
  enabledBookmarks: boolean;
  enabledDownloads: boolean;
  enabledExtensions: boolean;
}

interface FormContextType {
  formData: FormData;
  handleChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    telphone: '',
    backgroundUrl: 'https://picsum.photos/id/381/1920/1080',
    defaultTab: 'overview',
    github: 'https://github.com/',
    gitlab: '',
    bamboohr: '',
    overview: '',
    pinBookmarks: [],
    tasks: [],
    enabledDashboard: false,
    enabledTasks: true,
    enabledQuotes: true,
    enabledBookmarks: true,
    enabledDownloads: false,
    enabledExtensions: true,
  });

  useEffect(() => {
    getStorage(Object.keys(formData), result => {
      setFormData(prevFormData => ({
        ...prevFormData,
        ...result
      }));
    });
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    const updatedValue = type === 'checkbox' ? (event.target as HTMLInputElement).checked : value;

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: updatedValue,
    }));

    setStorage({ [name]: updatedValue }, () => {});
  };

  return (
    <FormContext.Provider value={{ formData, handleChange }}>
      {children}
    </FormContext.Provider>
  );
};

const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

export { FormProvider, useFormContext };
