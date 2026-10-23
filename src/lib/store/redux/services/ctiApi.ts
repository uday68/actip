import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SearchResponse } from '@/server/search/fallback';
import { InvestigationResult } from '@/types/investigation';
import {
  IOCRecord,
  ThreatActor,
  MalwareFamily,
  ThreatCampaign,
  CVERecord,
  AttackTechnique,
  GraphEdgeData
} from '@/types/cti';
import { ThreatReport } from '@/lib/mock-data/reports';
import { GraphNodeItem } from '@/lib/mock-data/graph';
import { SourceConnector, PipelineStageMetric } from '@/types/pipeline';

export interface SearchQueryArgs {
  q: string;
  type?: string;
  limit?: number;
}

export const ctiApi = createApi({
  reducerPath: 'ctiApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: [
    'Search',
    'Investigations',
    'IOCs',
    'ThreatActors',
    'Malware',
    'CVEs',
    'Campaigns',
    'Graph',
    'Reports',
    'Sources'
  ],
  endpoints: (builder) => ({
    search: builder.query<SearchResponse, SearchQueryArgs>({
      query: ({ q, type, limit = 20 }) => {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (type) params.set('type', type);
        if (limit) params.set('limit', String(limit));
        return `api/search?${params.toString()}`;
      },
      providesTags: ['Search']
    }),

    getInvestigations: builder.query<{ success: boolean; data: InvestigationResult[] }, void>({
      query: () => 'api/investigations',
      providesTags: ['Investigations']
    }),

    getInvestigationById: builder.query<{ success: boolean; data: InvestigationResult }, string>({
      query: (id) => `api/investigations/${id}`,
      providesTags: (result, error, id) => [{ type: 'Investigations', id }]
    }),

    getIocs: builder.query<{ success: boolean; data: IOCRecord[] }, void>({
      query: () => 'api/iocs',
      providesTags: ['IOCs']
    }),

    getThreatActors: builder.query<{ success: boolean; data: ThreatActor[] }, void>({
      query: () => 'api/threat-actors',
      providesTags: ['ThreatActors']
    }),

    getMalware: builder.query<{ success: boolean; data: MalwareFamily[] }, void>({
      query: () => 'api/malware',
      providesTags: ['Malware']
    }),

    getCves: builder.query<{ success: boolean; data: CVERecord[] }, void>({
      query: () => 'api/cves',
      providesTags: ['CVEs']
    }),

    getCampaigns: builder.query<{ success: boolean; data: ThreatCampaign[] }, void>({
      query: () => 'api/campaigns',
      providesTags: ['Campaigns']
    }),

    getAttackMatrix: builder.query<{ success: boolean; data: Record<string, AttackTechnique[]> }, void>({
      query: () => 'api/attack',
      providesTags: ['Investigations']
    }),

    getGraph: builder.query<{ success: boolean; nodes: GraphNodeItem[]; edges: GraphEdgeData[] }, void>({
      query: () => 'api/graph',
      providesTags: ['Graph']
    }),

    getEvidence: builder.query<{ success: boolean; data: unknown[] }, void>({
      query: () => 'api/evidence',
      providesTags: ['Investigations']
    }),

    getReports: builder.query<{ success: boolean; data: ThreatReport[] }, void>({
      query: () => 'api/reports',
      providesTags: ['Reports']
    }),

    getSources: builder.query<{ success: boolean; data: SourceConnector[]; stages: PipelineStageMetric[] }, void>({
      query: () => 'api/sources',
      providesTags: ['Sources']
    })
  })
});

export const {
  useSearchQuery,
  useLazySearchQuery,
  useGetInvestigationsQuery,
  useGetInvestigationByIdQuery,
  useGetIocsQuery,
  useGetThreatActorsQuery,
  useGetMalwareQuery,
  useGetCvesQuery,
  useGetCampaignsQuery,
  useGetAttackMatrixQuery,
  useGetGraphQuery,
  useGetEvidenceQuery,
  useGetReportsQuery,
  useGetSourcesQuery
} = ctiApi;
