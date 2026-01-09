'use client'

import { useRef } from 'react'
import { useStore } from '@/store/useStore'

export function ConfigPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const {
    bodyColor,
    setBodyColor,
    decalMode,
    toggleDecalMode,
    selectedDecalTexture,
    setSelectedDecalTexture,
    presetColors,
    presetDecals,
    decals,
    clearDecals,
    decalScale,
    setDecalScale,
    decalRotation,
    setDecalRotation,
  } = useStore()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setSelectedDecalTexture(url)
    }
  }

  return (
    <div className="fixed right-4 top-4 bottom-4 w-80 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col z-10">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-white">Car Configurator</h1>
        <p className="text-slate-400 text-sm mt-1">Customize your ride</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Body Color Section */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            Body Color
          </h2>
          
          {/* Color Picker */}
          <div className="mb-3">
            <label className="block text-white/70 text-sm mb-2">Custom Color</label>
            <input
              type="color"
              value={bodyColor}
              onChange={(e) => setBodyColor(e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer border-2 border-white/20 bg-transparent"
            />
          </div>

          {/* Preset Colors */}
          <div>
            <label className="block text-white/70 text-sm mb-2">Presets</label>
            <div className="grid grid-cols-6 gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setBodyColor(color)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                    bodyColor === color
                      ? 'border-white shadow-lg shadow-white/30'
                      : 'border-white/20'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Decal Section */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            Decals
          </h2>

          {/* Decal Mode Toggle */}
          <button
            onClick={toggleDecalMode}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all mb-4 ${
              decalMode
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {decalMode ? '✓ Decal Mode Active' : 'Enable Decal Mode'}
          </button>

          {decalMode && (
            <>
              {/* Instructions */}
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3 mb-4">
                <p className="text-purple-200 text-sm">
                  Select a decal below, then click on the car to place it.
                </p>
              </div>

              {/* Upload Custom Decal */}
              <div className="mb-4">
                <label className="block text-white/70 text-sm mb-2">Upload Custom</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 text-white/70 rounded-lg border border-dashed border-white/30 transition-all"
                >
                  📁 Choose Image
                </button>
              </div>

              {/* Preset Decals */}
              <div>
                <label className="block text-white/70 text-sm mb-2">Preset Decals</label>
                <div className="grid grid-cols-3 gap-2">
                  {presetDecals.map((decal) => (
                    <button
                      key={decal.name}
                      onClick={() => setSelectedDecalTexture(decal.url)}
                      className={`aspect-square rounded-lg border-2 transition-all hover:scale-105 bg-white/10 p-2 ${
                        selectedDecalTexture === decal.url
                          ? 'border-purple-400 shadow-lg shadow-purple-500/30'
                          : 'border-white/20'
                      }`}
                      title={decal.name}
                    >
                      <img
                        src={decal.url}
                        alt={decal.name}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Decal Preview */}
              {selectedDecalTexture && (
                <div className="mt-4 p-3 bg-slate-800/50 rounded-lg space-y-4">
                  <p className="text-slate-400 text-xs mb-2">Selected Decal:</p>
                  <div className="w-16 h-16 mx-auto bg-slate-700/50 rounded-lg p-2" style={{ transform: `rotate(${decalRotation}deg) scale(${decalScale / 0.5})` }}>
                    <img
                      src={selectedDecalTexture}
                      alt="Selected decal"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Scale Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-400 text-xs">Scale</label>
                      <span className="text-slate-300 text-xs font-medium">{decalScale.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="2"
                      step="0.05"
                      value={decalScale}
                      onChange={(e) => setDecalScale(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                  
                  {/* Rotation Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-400 text-xs">Rotation</label>
                      <span className="text-slate-300 text-xs font-medium">{decalRotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="5"
                      value={decalRotation}
                      onChange={(e) => setDecalRotation(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                  
                  {/* Quick rotation buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDecalRotation(0)}
                      className="flex-1 py-1 px-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded transition-all"
                    >
                      0°
                    </button>
                    <button
                      onClick={() => setDecalRotation(90)}
                      className="flex-1 py-1 px-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded transition-all"
                    >
                      90°
                    </button>
                    <button
                      onClick={() => setDecalRotation(180)}
                      className="flex-1 py-1 px-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded transition-all"
                    >
                      180°
                    </button>
                    <button
                      onClick={() => setDecalRotation(270)}
                      className="flex-1 py-1 px-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded transition-all"
                    >
                      270°
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* Placed Decals Info */}
        {decals.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Placed Decals
              </h2>
              <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs">
                {decals.length}
              </span>
            </div>
            <button
              onClick={clearDecals}
              className="w-full py-2 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all border border-red-500/30"
            >
              🗑️ Clear All Decals
            </button>
          </section>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 bg-slate-950/50">
        <p className="text-slate-500 text-xs text-center">
          Drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  )
}

export default ConfigPanel
