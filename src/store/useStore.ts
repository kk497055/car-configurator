import { create } from 'zustand'

export interface Decal {
  id: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  textureUrl: string
}

interface CarConfiguratorState {
  // Body color state
  bodyColor: string
  setBodyColor: (color: string) => void

  // Decal mode state
  decalMode: boolean
  toggleDecalMode: () => void
  setDecalMode: (mode: boolean) => void

  // Selected decal texture
  selectedDecalTexture: string | null
  setSelectedDecalTexture: (url: string | null) => void

  // Decal scale and rotation controls
  decalScale: number
  setDecalScale: (scale: number) => void
  decalRotation: number
  setDecalRotation: (rotation: number) => void

  // Decals array
  decals: Decal[]
  addDecal: (decal: Omit<Decal, 'id'>) => void
  removeDecal: (id: string) => void
  clearDecals: () => void

  // Preset colors
  presetColors: string[]

  // Preset decal textures
  presetDecals: { name: string; url: string }[]
}

export const useStore = create<CarConfiguratorState>((set) => ({
  // Body color
  bodyColor: '#e63946',
  setBodyColor: (color) => set({ bodyColor: color }),

  // Decal mode
  decalMode: false,
  toggleDecalMode: () => set((state) => ({ decalMode: !state.decalMode })),
  setDecalMode: (mode) => set({ decalMode: mode }),

  // Selected decal texture
  selectedDecalTexture: null,
  setSelectedDecalTexture: (url) => set({ selectedDecalTexture: url }),

  // Decal scale and rotation (scale: 0.1-2.0, rotation: 0-360 degrees)
  decalScale: 0.5,
  setDecalScale: (scale) => set({ decalScale: scale }),
  decalRotation: 0,
  setDecalRotation: (rotation) => set({ decalRotation: rotation }),

  // Decals
  decals: [],
  addDecal: (decal) =>
    set((state) => ({
      decals: [...state.decals, { ...decal, id: crypto.randomUUID() }],
    })),
  removeDecal: (id) =>
    set((state) => ({
      decals: state.decals.filter((d) => d.id !== id),
    })),
  clearDecals: () => set({ decals: [] }),

  // Preset colors for car body
  presetColors: [
    '#e63946', // Red
    '#f4a261', // Orange
    '#e9c46a', // Yellow
    '#2a9d8f', // Teal
    '#264653', // Dark Blue
    '#1d3557', // Navy
    '#457b9d', // Steel Blue
    '#a8dadc', // Light Blue
    '#f1faee', // Off White
    '#000000', // Black
    '#ffffff', // White
    '#6b705c', // Olive
  ],

  // Preset decal textures (using reliable CDN URLs)
  presetDecals: [
    {
      name: 'Flame',
      url: 'https://cdn-icons-png.flaticon.com/512/785/785116.png',
    },
    {
      name: 'Star',
      url: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png',
    },
    {
      name: 'Lightning',
      url: 'https://cdn-icons-png.flaticon.com/512/1146/1146869.png',
    },
  ],
}))
