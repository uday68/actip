'use client';

import { useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector, store } from './redux/store';
import {
  setTheme,
  toggleTheme,
  dismissDemoNotice,
  setSearchOpen,
  setNotificationsOpen,
  setAnalystProfile,
  AnalystProfile
} from './redux/slices/uiSlice';
import {
  setActiveInvestigation,
  setInvestigating,
  setCurrentStageIndex,
  setInvestigationProgress,
  pauseInvestigation,
  resetInvestigation
} from './redux/slices/investigationSlice';
import {
  setSelectedGraphNode,
  toggleGraphFilterType,
  setMinConfidenceFilter,
  resetGraphFilters
} from './redux/slices/graphSlice';
import { InvestigationResult } from '@/types/investigation';
import { GraphNodeData } from '@/types/cti';
import { ctiService } from '@/lib/api/cti-service';
import { primaryInvestigation } from '@/lib/mock-data/investigations';

export interface CTIStoreState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  demoModeNotice: boolean;
  dismissDemoNotice: () => void;

  activeInvestigation: InvestigationResult;
  isInvestigating: boolean;
  currentStageIndex: number;
  investigationProgress: number;
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

  analystProfile: AnalystProfile;
}

export function useCTIStore<T = CTIStoreState>(selector?: (state: CTIStoreState) => T): T {
  const dispatch = useAppDispatch();
  const ui = useAppSelector(state => state.ui);
  const investigation = useAppSelector(state => state.investigation);
  const graph = useAppSelector(state => state.graph);

  const startNewInvestigation = useCallback(async (query: string) => {
    const q = query.trim() || '185.220.101.5, quantum-defense.org, CVE-2026-8912';

    const initialStages = primaryInvestigation.stages.map((stage, idx) => ({
      ...stage,
      status: idx === 0 ? ('running' as const) : ('pending' as const)
    }));

    dispatch(setInvestigating(true));
    dispatch(setCurrentStageIndex(0));
    dispatch(setInvestigationProgress(10));
    dispatch(
      setActiveInvestigation({
        ...primaryInvestigation,
        query: q,
        status: 'running',
        stages: initialStages
      })
    );

    const backendPromise = ctiService.startInvestigation(q);

    let step = 0;
    const interval = setInterval(async () => {
      step++;
      if (step < 8) {
        const updatedStages = primaryInvestigation.stages.map((stage, idx) => {
          if (idx < step) return { ...stage, status: 'completed' as const };
          if (idx === step) return { ...stage, status: 'running' as const };
          return { ...stage, status: 'pending' as const };
        });

        dispatch(setCurrentStageIndex(step));
        dispatch(setInvestigationProgress(Math.round(((step + 1) / 9) * 100)));
        dispatch(
          setActiveInvestigation({
            ...store.getState().investigation.activeInvestigation,
            stages: updatedStages
          })
        );
      } else {
        clearInterval(interval);
        const realResult = await backendPromise;
        dispatch(setInvestigating(false));
        dispatch(setCurrentStageIndex(8));
        dispatch(setInvestigationProgress(100));
        dispatch(setActiveInvestigation(realResult));
      }
    }, 450);
  }, [dispatch]);

  const compositeState: CTIStoreState = useMemo(() => ({
    theme: ui.theme,
    setTheme: (t: 'light' | 'dark') => dispatch(setTheme(t)),
    toggleTheme: () => dispatch(toggleTheme()),

    demoModeNotice: ui.demoModeNotice,
    dismissDemoNotice: () => dispatch(dismissDemoNotice()),

    activeInvestigation: investigation.activeInvestigation,
    isInvestigating: investigation.isInvestigating,
    currentStageIndex: investigation.currentStageIndex,
    investigationProgress: investigation.investigationProgress,
    startNewInvestigation,
    pauseInvestigation: () => dispatch(pauseInvestigation()),
    resetInvestigation: () => dispatch(resetInvestigation()),

    selectedGraphNode: graph.selectedGraphNode,
    setSelectedGraphNode: (n: GraphNodeData | null) => dispatch(setSelectedGraphNode(n)),
    graphFilterTypes: graph.graphFilterTypes,
    toggleGraphFilterType: (t: string) => dispatch(toggleGraphFilterType(t)),
    minConfidenceFilter: graph.minConfidenceFilter,
    setMinConfidenceFilter: (c: number) => dispatch(setMinConfidenceFilter(c)),

    isSearchOpen: ui.isSearchOpen,
    setSearchOpen: (o: boolean) => dispatch(setSearchOpen(o)),

    isNotificationsOpen: ui.isNotificationsOpen,
    setNotificationsOpen: (o: boolean) => dispatch(setNotificationsOpen(o)),

    analystProfile: ui.analystProfile
  }), [ui, investigation, graph, dispatch, startNewInvestigation]);

  if (selector) {
    return selector(compositeState);
  }
  return compositeState as unknown as T;
}
