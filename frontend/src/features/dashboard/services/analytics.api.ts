import axiosInstance from "../../../lib/axios";

export const AnalyticsAPI = {
  fetchRepoData: async (repoPath: string) => {
    const res = await axiosInstance.get(`/analytics/repo`, { params: { name: repoPath } });
    return res.data.data;
  },
  
  analyzeRepo: async (repoData: any, commits: any[]) => {
    const res = await axiosInstance.post(`/analytics/analyze`, { repoData, commits });
    return res.data.data;
  },

  // Linked Repositories API
  getRepositories: async () => {
    const res = await axiosInstance.get(`/repos`);
    return res.data.data;
  },

  linkRepository: async (name: string) => {
    const res = await axiosInstance.post(`/repos`, { name });
    return res.data.data;
  },

  setPrimaryRepository: async (id: string) => {
    const res = await axiosInstance.put(`/repos/${id}/primary`);
    return res.data.data;
  },

  deleteRepository: async (id: string) => {
    const res = await axiosInstance.delete(`/repos/${id}`);
    return res.data;
  },

  // Dashboard Data
  getDashboardData: async (repo: string, repoId?: string, forceReanalyze: boolean = false) => {
    const res = await axiosInstance.get(`/analytics/dashboard`, { params: { repo, repoId, forceReanalyze } });
    return res.data.data;
  }
};
