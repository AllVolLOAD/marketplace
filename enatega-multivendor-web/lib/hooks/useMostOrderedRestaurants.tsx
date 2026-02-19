const useMostOrderedRestaurants = (
  _enabled?: boolean,
  _page?: number,
  _limit?: number,
  _shopType?: "restaurant" | "grocery" | null
) => {
  void _enabled;
  void _page;
  void _limit;
  void _shopType;
  const empty: any[] = [];
  const fetchMore = async () => ({
    data: { mostOrderedRestaurantsPreview: [] },
  });

  return {
    queryData: empty,
    restaurantsData: empty,
    loading: false,
    error: undefined,
    fetchMore,
  };
};

export default useMostOrderedRestaurants;
