import { create } from 'zustand';
import { InvestigationResult } from '@/types/investigation';
import { primaryInvestigation } from '@/lib/mock-data/investigations';
import { GraphNodeData } from '@/types/cti';
import { ctiService } from '@/lib/api/cti-service';

interface CTIState {
  demoModeNotice: boolean;
  dismissDemoNotice: () => void;

  activeInvestigation: InvestigationResult;
  isInvestigating: boolean;
  currentStageIndex: number;
  investigationProgress: number; // 0 to 100
  startNewInvestigation: (query: string) => Promise<void>;
  pauseInvestigation: () => void;
  resetInvestigation: () => void;

  selectedGraphNode: GraphNodeData | null;
  setSelectedGraphNode: (node: GraphNodeData | null) => void;
  graphFilterTypes: string[];
  toggleGraphFilterType: (type: string) => void;
  minConfidenceFilter: number;
  setMinConfidenceFilter: (conf: number) => void;

  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  isNotificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;

  analystProfile: {
    name: string;
    role: string;
    clearance: string;
    badgeId: string;
  };
}

export const useCTIStore = create<CTIState>((set, get) => ({
  demoModeNotice: true, // Live CTI notification banner
  dismissDemoNotice: () => set({ demoModeNotice: false }),

  activeInvestigation: primaryInvestigation,
  isInvestigating: false,
  currentStageIndex: 8,
  investigationProgress: 100,

  startNewInvestigation: async (query: string) => {
    const q = query.trim() || '185.220.101.5, quantum-defense.org, CVE-2026-8912';

    // Set initial running state
    const initialStages = primaryInvestigation.stages.map((stage, idx) => ({
      ...stage,
      status: idx === 0 ? ('running' as const) : ('pending' as const)
    }));

    set({
      isInvestigating: true,
      currentStageIndex: 0,
      investigationProgress: 10,
      activeInvestigation: {
        ...primaryInvestigation,
        query: q,
        status: 'running',
        stages: initialStages
      }
    });

    // Start background real backend request
    const backendPromise = ctiService.startInvestigation(q);

    // Simulate progressive real-time agent execution pipeline
    let step = 0;
    const interval = setInterval(async () => {
      step++;
      if (step < 8) {
        const updatedStages = primaryInvestigation.stages.map((stage, idx) => {
          if (idx < step) return { ...stage, status: 'completed' as const };
          if (idx === step) return { ...stage, status: 'running' as const };
          return { ...stage, status: 'pending' as const };
        });

        set({
          currentStageIndex: step,
          investigationProgress: Math.round(((step + 1) / 9) * 100),
          activeInvestigation: {
            ...get().activeInvestigation,
            stages: updatedStages
          }
        });
      } else {
        clearInterval(interval);
        // Wait for real backend result
        const realResult = await backendPromise;
        set({
          isInvestigating: false,
          currentStageIndex: 8,
          investigationProgress: 100,
          activeInvestigation: realResult
        });
      }
    }, 450);
  },

  pauseInvestigation: () => set({ isInvestigating: false }),
  resetInvestigation: () =>
    set({
      isInvestigating: false,
      currentStageIndex: primaryInvestigation.stages.length - 1,
      investigationProgress: 100,
      activeInvestigation: primaryInvestigation
    }),

  selectedGraphNode: null,
  setSelectedGraphNode: (node: GraphNodeData | null) => set({ selectedGraphNode: node }),
  graphFilterTypes: ['actor', 'malware', 'campaign', 'ip', 'domain', 'cve', 'technique'],
  toggleGraphFilterType: (type: string) =>
    set(state => ({
      graphFilterTypes: state.graphFilterTypes.includes(type)
        ? state.graphFilterTypes.filter(t => t !== type)
        : [...state.graphFilterTypes, type]
    })),
  minConfidenceFilter: 0,
  setMinConfidenceFilter: (conf: number) => set({ minConfidenceFilter: conf }),

  isSearchOpen: false,
  setSearchOpen: (open: boolean) => set({ isSearchOpen: open }),

  isNotificationsOpen: false,
  setNotificationsOpen: (open: boolean) => set({ isNotificationsOpen: open }),

  analystProfile: {
    name: 'Sarah Vance',
    role: 'Tier-3 Threat Intel Lead',
    clearance: 'TOP SECRET // CTI-ORCON',
    badgeId: 'SOC-9042'
  }
}));
