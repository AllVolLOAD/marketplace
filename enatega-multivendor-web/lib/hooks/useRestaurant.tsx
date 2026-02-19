export default function useRestaurant() {
  return {
    data: null,
    refetch: async () => null,
    networkStatus: 7,
    loading: false,
    error: undefined,
  };
}
