import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { setSelectedChessSet, hideChessSetSelector } from '../store/preferencesSlice'
import { chessSets, getChessSetById } from '../config/chessSets'
import { ChessSet } from '../types/chessTypes'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Palette, Crown, Smartphone, Smile, Type } from 'lucide-react'

const ChessSetSelector: React.FC = () => {
  const dispatch = useDispatch()
  const { showChessSetSelector, selectedChessSetId } = useSelector((state: RootState) => state.preferences)
  
  const handleClose = () => {
    dispatch(hideChessSetSelector())
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleChessSetSelect = (chessSetId: string) => {
    dispatch(setSelectedChessSet(chessSetId))
    // Auto-close after selection for better UX
    setTimeout(() => {
      handleClose()
    }, 300)
  }

  const getCategoryIcon = (category: ChessSet['category']) => {
    switch (category) {
      case 'classic': return <Crown className="w-5 h-5" />
      case 'modern': return <Smartphone className="w-5 h-5" />
      case 'fun': return <Smile className="w-5 h-5" />
      case 'unicode': return <Type className="w-5 h-5" />
      default: return <Palette className="w-5 h-5" />
    }
  }

  const getCategoryColor = (category: ChessSet['category']) => {
    switch (category) {
      case 'classic': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'modern': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'fun': return 'text-pink-600 bg-pink-50 border-pink-200'
      case 'unicode': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-purple-600 bg-purple-50 border-purple-200'
    }
  }

  const ChessSetPreview: React.FC<{ chessSet: ChessSet; isSelected: boolean }> = ({ chessSet, isSelected }) => {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
          ${isSelected 
            ? 'border-blue-500 bg-blue-50 shadow-lg' 
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
          }
        `}
        onClick={() => handleChessSetSelect(chessSet.id)}
      >
        {/* Category Badge */}
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border mb-3 ${getCategoryColor(chessSet.category)}`}>
          {getCategoryIcon(chessSet.category)}
          {chessSet.category.charAt(0).toUpperCase() + chessSet.category.slice(1)}
        </div>

                 {/* Preview */}
         <div className="flex justify-center mb-3 h-16 items-center">
           {chessSet.isUnicode ? (
             <div className="text-4xl space-x-1">
               <span>{chessSet.white.king}</span>
               <span>{chessSet.white.queen}</span>
               <span>{chessSet.white.rook}</span>
               <span>{chessSet.black.king}</span>
               <span>{chessSet.black.queen}</span>
               <span>{chessSet.black.rook}</span>
             </div>
           ) : (
             <div className="flex space-x-1 items-center">
               <img 
                 src={chessSet.white.king} 
                 alt="White King" 
                 className="w-8 h-8 object-contain"
                 draggable={false}
               />
               <img 
                 src={chessSet.white.queen} 
                 alt="White Queen" 
                 className="w-8 h-8 object-contain"
                 draggable={false}
               />
               <img 
                 src={chessSet.white.rook} 
                 alt="White Rook" 
                 className="w-8 h-8 object-contain"
                 draggable={false}
               />
               <img 
                 src={chessSet.black.king} 
                 alt="Black King" 
                 className="w-8 h-8 object-contain"
                 draggable={false}
               />
               <img 
                 src={chessSet.black.queen} 
                 alt="Black Queen" 
                 className="w-8 h-8 object-contain"
                 draggable={false}
               />
               <img 
                 src={chessSet.black.rook} 
                 alt="Black Rook" 
                 className="w-8 h-8 object-contain"
                 draggable={false}
               />
             </div>
           )}
         </div>

        {/* Name and Description */}
        <div className="text-center">
          <h3 className={`font-semibold mb-1 ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
            {chessSet.name}
          </h3>
          <p className="text-sm text-gray-600 leading-tight">
            {chessSet.description}
          </p>
        </div>

        {/* Selected Indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </motion.div>
    )
  }

  if (!showChessSetSelector) {
    return null
  }

  const selectedSet = getChessSetById(selectedChessSetId)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Choose Chess Set
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Current: {selectedSet?.name || 'Unknown'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Chess Sets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chessSets.map((chessSet) => (
              <div key={chessSet.id} className="relative">
                <ChessSetPreview 
                  chessSet={chessSet} 
                  isSelected={chessSet.id === selectedChessSetId}
                />
              </div>
            ))}
          </div>

          {/* Info Footer */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p className="font-medium mb-1">How to add your own chess sets:</p>
                <p>Place your SVG files in <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">src/assets/chess-sets/[set-name]/</code> and update the configuration in <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">src/config/chessSets.ts</code></p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ChessSetSelector 