import { useState, useCallback } from 'react';
import { Event } from '../types';
import { getFilteredEvents } from '../utils/eventUtils';

export const useSearch = (events: Event[], currentDate: Date, view: 'week' | 'month') => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = useCallback(() => {
    return getFilteredEvents(events, searchTerm, currentDate, view);
  }, [events, searchTerm, currentDate, view]);

  return {
    searchTerm,
    setSearchTerm,
    filteredEvents: filteredEvents()
  };
};
