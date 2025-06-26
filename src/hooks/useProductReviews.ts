
import { UserContext } from '@/Contexts/UserContext';
import { useState, useEffect, useContext } from 'react';

export interface ReviewData {
  id: number;
  userId: number;
  userName: string;
  userImage: string | null;
  createdDate: string;
  rate: number;
  comment: string;
}

export interface ApiResponse {
  success: boolean;
  status: number;
  data: {
    content: ReviewData[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        empty: boolean;
        unsorted: boolean;
        sorted: boolean;
      };
      offset: number;
      unpaged: boolean;
      paged: boolean;
    };
    totalElements: number;
    totalPages: number;
    last: boolean;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
  };
}

export const useProductReviews = (productId: number) => {
        const userContext = useContext(UserContext)
        if (!userContext) {
          throw new Error("UserContext must be used within a UserContextProvider")
        }
        const { pathUrl , userToken} = userContext

  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [filterStars, setFilterStars] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'top' | 'newest'>('top');

  const fetchReviews = async (page: number = 0, stars?: number | null, reset: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        pageNumber: page,
        pageSize: 12,
        searchCriteria: {
          productId: productId,
          stars: stars || null,
          isTopRated: sortBy === 'top'
        }
      };

      console.log('Fetching reviews with payload:', payload);

      // Replace this URL with your actual API endpoint
      const response = await fetch(`${pathUrl}/api/v1/product-ratings/filter`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        const newReviews = data.data.content;
        console.log('Fetched reviews:', newReviews);
        
        if (reset) {
          setReviews(newReviews);
        } else {
          setReviews(prev => [...prev, ...newReviews]);
        }
        
        setTotalElements(data.data.totalElements);
        setCurrentPage(data.data.number);
        setHasMore(!data.data.last);
      } else {
        throw new Error('Failed to fetch reviews');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchReviews(currentPage + 1, filterStars, false);
    }
  };

  const applyFilter = (stars: number | null) => {
    setFilterStars(stars);
    setCurrentPage(0);
    fetchReviews(0, stars, true);
  };

  const changeSortBy = (newSortBy: 'top' | 'newest') => {
    setSortBy(newSortBy);
    setCurrentPage(0);
    fetchReviews(0, filterStars, true);
  };

  useEffect(() => {
    fetchReviews(0, filterStars, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, sortBy]);

  return {
    reviews,
    loading,
    error,
    totalElements,
    hasMore,
    filterStars,
    sortBy,
    loadMore,
    applyFilter,
    changeSortBy,
  };
};
