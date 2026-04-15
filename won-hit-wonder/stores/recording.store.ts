import { create } from "zustand";

interface RecordingState {
  songId: string | null;
  songTitle: string | null;
  videoUri: string | null;
  trimStart: number;
  trimEnd: number;
  setSong: (id: string, title: string) => void;
  setVideoUri: (uri: string) => void;
  setTrim: (start: number, end: number) => void;
  reset: () => void;
}

export const useRecordingStore = create<RecordingState>((set) => ({
  songId: null,
  songTitle: null,
  videoUri: null,
  trimStart: 0,
  trimEnd: 0,
  setSong: (id, title) => set({ songId: id, songTitle: title }),
  setVideoUri: (uri) => set({ videoUri: uri }),
  setTrim: (start, end) => set({ trimStart: start, trimEnd: end }),
  reset: () =>
    set({
      songId: null,
      songTitle: null,
      videoUri: null,
      trimStart: 0,
      trimEnd: 0,
    }),
}));
