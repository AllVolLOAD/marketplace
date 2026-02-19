const useGetCuisines = (_enabled?: boolean, _shopType?: string) => {
  void _enabled;
  void _shopType;
  const empty: any[] = [];
  return {
    queryData: empty,
    loading: false,
    error: undefined,
    networkStatus: 7,
    restaurantCuisinesData: empty,
    groceryCuisinesData: empty,
  };
};

export default useGetCuisines;
