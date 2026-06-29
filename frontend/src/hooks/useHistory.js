import { useState, useCallback } from 'react';
import { api } from '../utils/api';

export default function useHistory() {
  const [historyList, setHistoryList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    sport: 'All',
    search: '',
    sort: 'newest'
  });

  const fetchHistory = useCallback(async (pageParam = 1, currentFilters = filters) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.getHistory({
        page: pageParam,
        limit: 6, // Show 6 items per page for better layout and density
        sport: currentFilters.sport,
        search: currentFilters.search,
        sort: currentFilters.sort
      });

      if (result.success) {
        setHistoryList(result.data || []);
        setTotal(result.total || 0);
        setPage(result.page || 1);
        setPages(result.pages || 1);
      } else {
        throw new Error(result.message || 'Failed to fetch history');
      }
    } catch (err) {
      console.error('History hook fetch error:', err);
      setError(err.message || 'Could not load generation history');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const updateFilters = (newFilters) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    // Fetch immediately for the first page with new filters
    fetchHistory(1, updated);
  };

  const deleteItem = async (id) => {
    try {
      await api.deleteHistory(id);
      // Re-fetch current page, or if page has only 1 item and page > 1, go to previous page
      const isLastItemOnPage = historyList.length === 1 && page > 1;
      const targetPage = isLastItemOnPage ? page - 1 : page;
      await fetchHistory(targetPage, filters);
      return true;
    } catch (err) {
      console.error('History hook delete error:', err);
      alert(err.message || 'Failed to delete history item');
      return false;
    }
  };

  return {
    historyList,
    total,
    page,
    pages,
    isLoading,
    error,
    filters,
    fetchHistory,
    updateFilters,
    deleteItem
  };
}
