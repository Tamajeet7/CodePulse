import axiosInstance from "../../../lib/axios";

export const AnalyticsAPI = {
  fetchRepoData: async (repoPath: string) => {
    const res = await axiosInstance.get(`/analytics/repo`, { params: { name: repoPath } });
    return res.data.data;
  },
  
  analyzeRepo: async (repoData: any, commits: any[]) => {
    const res = await axiosInstance.post(`/analytics/analyze`, { repoData, commits });
    return res.data.data;
  }
};
