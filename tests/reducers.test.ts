import { describe, it } from 'node:test';
import assert from 'node:assert';
import uiReducer, {
  setTheme,
  toggleTheme,
  dismissDemoNotice,
  setSearchOpen,
  setNotificationsOpen
} from '../src/lib/store/redux/slices/uiSlice';
import investigationReducer, {
  setInvestigating,
  setCurrentStageIndex,
  setInvestigationProgress,
  resetInvestigation
} from '../src/lib/store/redux/slices/investigationSlice';
import graphReducer, {
  setSelectedGraphNode,
  toggleGraphFilterType,
  setMinConfidenceFilter,
  resetGraphFilters
} from '../src/lib/store/redux/slices/graphSlice';

describe('UI Reducer', () => {
  const getInitialState = () => uiReducer(undefined, { type: '@@INIT' });

  it('toggles theme between light and dark', () => {
    let state = getInitialState();
    assert.strictEqual(state.theme, 'light');

    state = uiReducer(state, toggleTheme());
    assert.strictEqual(state.theme, 'dark');

    state = uiReducer(state, toggleTheme());
    assert.strictEqual(state.theme, 'light');
  });

  it('sets theme explicitly', () => {
    let state = getInitialState();
    state = uiReducer(state, setTheme('dark'));
    assert.strictEqual(state.theme, 'dark');
  });

  it('dismisses demo mode notice', () => {
    let state = getInitialState();
    assert.strictEqual(state.demoModeNotice, true);

    state = uiReducer(state, dismissDemoNotice());
    assert.strictEqual(state.demoModeNotice, false);
  });

  it('toggles search and notification modals', () => {
    let state = getInitialState();
    assert.strictEqual(state.isSearchOpen, false);
    assert.strictEqual(state.isNotificationsOpen, false);

    state = uiReducer(state, setSearchOpen(true));
    assert.strictEqual(state.isSearchOpen, true);

    state = uiReducer(state, setNotificationsOpen(true));
    assert.strictEqual(state.isNotificationsOpen, true);
  });
});

describe('Investigation Reducer', () => {
  const getInitialState = () => investigationReducer(undefined, { type: '@@INIT' });

  it('updates investigation status, progress and stage index', () => {
    let state = getInitialState();
    state = uiReducer(state as any, { type: 'unknown' }) as any; // sanity

    state = investigationReducer(state, setInvestigating(true));
    assert.strictEqual(state.isInvestigating, true);

    state = investigationReducer(state, setCurrentStageIndex(3));
    assert.strictEqual(state.currentStageIndex, 3);

    state = investigationReducer(state, setInvestigationProgress(45));
    assert.strictEqual(state.investigationProgress, 45);
  });

  it('resets investigation back to default completed state', () => {
    let state = getInitialState();
    state = investigationReducer(state, setInvestigating(true));
    state = investigationReducer(state, setCurrentStageIndex(2));

    state = investigationReducer(state, resetInvestigation());
    assert.strictEqual(state.isInvestigating, false);
    assert.strictEqual(state.investigationProgress, 100);
    assert.strictEqual(state.currentStageIndex, 8);
  });
});

describe('Graph Reducer', () => {
  const getInitialState = () => graphReducer(undefined, { type: '@@INIT' });

  it('selects and deselects graph nodes', () => {
    let state = getInitialState();
    assert.strictEqual(state.selectedGraphNode, null);

    const mockNode: any = { id: 'node-1', label: '185.220.101.5', type: 'ip' };
    state = graphReducer(state, setSelectedGraphNode(mockNode));
    assert.strictEqual(state.selectedGraphNode?.id, 'node-1');

    state = graphReducer(state, setSelectedGraphNode(null));
    assert.strictEqual(state.selectedGraphNode, null);
  });

  it('toggles graph filter types on and off', () => {
    let state = getInitialState();
    assert.ok(state.graphFilterTypes.includes('malware'));

    // Toggle off
    state = graphReducer(state, toggleGraphFilterType('malware'));
    assert.ok(!state.graphFilterTypes.includes('malware'));

    // Toggle back on
    state = graphReducer(state, toggleGraphFilterType('malware'));
    assert.ok(state.graphFilterTypes.includes('malware'));
  });

  it('updates and resets confidence filter', () => {
    let state = getInitialState();
    state = graphReducer(state, setMinConfidenceFilter(85));
    assert.strictEqual(state.minConfidenceFilter, 85);

    state = graphReducer(state, resetGraphFilters());
    assert.strictEqual(state.minConfidenceFilter, 0);
    assert.strictEqual(state.selectedGraphNode, null);
  });
});
