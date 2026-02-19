type QueryBySlugResult = {
  data: any[];
  loading: boolean;
  error?: Error;
  fetchMore: (_options?: any) => Promise<any[]>;
};

export default function useQueryBySlug(
  _slug?: string,
  _page?: number,
  _limit?: number
): QueryBySlugResult {
  void _slug;
  void _page;
  void _limit;
  return {
    data: [],
    loading: false,
    error: undefined,
    fetchMore: async () => [],
  };
}
