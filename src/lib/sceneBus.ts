"use client";

export type ScenePhase = "boot" | "settle" | "idle";

interface SceneState {
  progress: number;
  phase: ScenePhase;
  introDone: boolean;
}

type Listener = (state: SceneState) => void;

const state: SceneState = { progress: 0, phase: "boot", introDone: false };
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l({ ...state }));
}

export const sceneBus = {
  getState: () => ({ ...state }),
  setProgress(p: number) {
    state.progress = Math.min(1, Math.max(0, p));
    if (state.progress >= 1 && !state.introDone) {
      state.introDone = true;
      state.phase = "settle";
    }
    emit();
  },
  setPhase(phase: ScenePhase) {
    if (state.phase === phase) return;
    state.phase = phase;
    emit();
  },
  markIntroDone() {
    if (state.introDone) return;
    state.introDone = true;
    state.phase = "settle";
    emit();
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    listener({ ...state });
    return () => listeners.delete(listener);
  },
};
