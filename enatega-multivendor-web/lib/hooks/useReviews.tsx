export default function useReviews(restaurantId?: string) {
  void restaurantId;
  return {
    data: {
      reviewsByRestaurant: {
        reviews: [],
        ratings: 0,
        total: 0,
      },
    } as any,
    loading: false,
    error: undefined,
  };
}
