import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Lecture } from './types';

interface ScheduleContextType {
  lectures: Lecture[];
  setLectures: React.Dispatch<React.SetStateAction<Lecture[]>>;
  selectedLectures: Lecture[];
  setSelectedLectures: React.Dispatch<React.SetStateAction<Lecture[]>>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedLectures, setSelectedLectures] = useState<Lecture[]>([]);

  useEffect(() => {
    const fetchLectures = async () => {
      const results = await Promise.all([
        axios.get<Lecture[]>('/schedules-majors.json'),
        axios.get<Lecture[]>('/schedules-liberal-arts.json'),
      ]);

      setLectures(results.flatMap(result => result.data).slice(0, 10));
    };

    fetchLectures();
  }, []);

  return (
    <ScheduleContext.Provider value={{ lectures, setLectures, selectedLectures, setSelectedLectures }}>
      {children}
    </ScheduleContext.Provider>
  );
};
