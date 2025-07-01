import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { toggleChessSetSelector } from '../store/preferencesSlice'
import { getChessSetById } from '../config/chessSets'
import { Palette } from 'lucide-react'

const ChessSetButton: React.FC = () => {
  const dispatch = useDispatch()
  const { selectedChessSetId } = useSelector((state: RootState) => state.preferences)
  
  const selectedSet = getChessSetById(selectedChessSetId)
  
  const handleClick = () => {
    dispatch(toggleChessSetSelector())
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium text-gray-700 dark:text-gray-300"
      title={`Current chess set: ${selectedSet?.name || 'Unknown'}`}
    >
      <Palette className="w-4 h-4" />
      <span className="hidden sm:inline">Chess Set</span>
      <span className="sm:hidden">Set</span>
    </button>
  )
}

export default ChessSetButton 