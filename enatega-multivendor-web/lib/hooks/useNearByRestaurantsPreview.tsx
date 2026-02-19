const useNearByRestaurantsPreview = (
  _enabled?: boolean,
  _page?: number,
  _limit?: number,
  _shopType?: string | null
) => {
  void _enabled;
  void _page;
  void _limit;
  void _shopType;
  const empty: any[] = [];
  const fetchMore = async () => ({
    data: { nearByRestaurantsPreview: { restaurants: [] } },
  });

  return {
    queryData: empty,
    loading: false,
    error: undefined,
    networkStatus: 7,
    groceriesData: empty,
    restaurantsData: empty,
    fetchMore,
  };
};

export default useNearByRestaurantsPreview;
