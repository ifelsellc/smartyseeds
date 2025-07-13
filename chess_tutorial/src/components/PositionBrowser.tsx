import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import {
  closePositionBrowser,
  previewPosition,
  confirmReplayFromPreview,
  saveCurrentPosition,
  loadSavedPosition,
  deleteSavedPosition,
  renameSavedPosition,
  refreshSavedPositions
} from '../store/gameSlice'
import { resetAI } from '../store/aiSlice'

interface PositionBrowserProps {}

export const PositionBrowser: React.FC<PositionBrowserProps> = () => {
  const dispatch = useDispatch()
  const { 
    positionBrowser, 
    gameHistory, 
    savedPositions, 
    currentMoveIndex 
  } = useSelector((state: RootState) => state.game)

  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState<string | null>(null)
  const [saveForm, setSaveForm] = useState({ name: '', description: '' })
  const [renameForm, setRenameForm] = useState({ name: '', description: '' })
  const [activeTab, setActiveTab] = useState<'history' | 'saved'>('history')

  // Load saved positions on mount
  React.useEffect(() => {
    dispatch(refreshSavedPositions())
  }, [dispatch])

  const handleClose = () => {
    dispatch(closePositionBrowser())
  }

  const handlePreviewPosition = (moveIndex: number, positionId?: string) => {
    dispatch(previewPosition({ moveIndex, positionId }))
  }

  const handleConfirmReplay = () => {
    dispatch(confirmReplayFromPreview())
    dispatch(resetAI())
  }

  const handleSavePosition = () => {
    if (saveForm.name.trim()) {
      dispatch(saveCurrentPosition({
        name: saveForm.name.trim(),
        description: saveForm.description.trim() || undefined
      }))
      setSaveForm({ name: '', description: '' })
      setShowSaveDialog(false)
    }
  }

  const handleLoadSavedPosition = (positionId: string) => {
    dispatch(loadSavedPosition(positionId))
    dispatch(closePositionBrowser())
  }

  const handleDeleteSavedPosition = (positionId: string) => {
    if (confirm('Are you sure you want to delete this saved position?')) {
      dispatch(deleteSavedPosition(positionId))
    }
  }

  const handleRenamePosition = (positionId: string) => {
    if (renameForm.name.trim()) {
      dispatch(renameSavedPosition({
        id: positionId,
        name: renameForm.name.trim(),
        description: renameForm.description.trim() || undefined
      }))
      setShowRenameDialog(null)
      setRenameForm({ name: '', description: '' })
    }
  }

  const startRename = (position: any) => {
    setRenameForm({ 
      name: position.name, 
      description: position.description || '' 
    })
    setShowRenameDialog(position.id)
  }

  const formatMoveNumber = (index: number) => {
    if (index === -1) return 'Start'
    const moveNum = Math.floor(index / 2) + 1
    const isWhite = index % 2 === 0
    return `${moveNum}${isWhite ? '.' : '...'}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString() + ' ' + 
           new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!positionBrowser.isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Position Browser</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'history'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Game History ({gameHistory.length + 1} positions)
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'saved'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Saved Positions ({savedPositions.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="text-sm text-gray-600 mb-4">
                Select a position to preview it, then click "Start Playing from Here" to begin.
              </div>
              
              {/* Starting position */}
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  positionBrowser.selectedPositionId === null && currentMoveIndex === -1
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePreviewPosition(-1)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Starting Position</div>
                    <div className="text-sm text-gray-500">Initial board setup</div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePreviewPosition(-1)
                      }}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </div>

              {/* Game moves */}
              {gameHistory.map((move, index) => (
                <div 
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    positionBrowser.selectedPositionId === null && currentMoveIndex === index
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePreviewPosition(index)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">
                        {formatMoveNumber(index)} {move.san}
                      </div>
                      <div className="text-sm text-gray-500">
                        Position after move {index + 1}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePreviewPosition(index)
                        }}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Preview
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSaveForm({ 
                            name: `Position after ${formatMoveNumber(index)} ${move.san}`,
                            description: ''
                          })
                          setShowSaveDialog(true)
                          handlePreviewPosition(index)
                        }}
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                  Your saved positions for quick access and practice.
                </div>
                <button
                  onClick={() => {
                    setSaveForm({ 
                      name: `Position ${savedPositions.length + 1}`,
                      description: ''
                    })
                    setShowSaveDialog(true)
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save Current Position
                </button>
              </div>

              {savedPositions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No saved positions yet. Save interesting positions to practice them later!
                </div>
              ) : (
                savedPositions.map((position) => (
                  <div 
                    key={position.id}
                    className={`p-4 border rounded-lg ${
                      positionBrowser.selectedPositionId === position.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{position.name}</div>
                        {position.description && (
                          <div className="text-sm text-gray-600 mt-1">
                            {position.description}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-2">
                          Saved: {formatDate(position.createdAt)}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => {
                            handlePreviewPosition(position.moveIndex, position.id)
                          }}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => handleLoadSavedPosition(position.id)}
                          className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => startRename(position)}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSavedPosition(position.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {positionBrowser.isPreviewMode ? (
              <span className="text-purple-600 font-medium">
                Previewing position - click "Start Playing" to continue from here
              </span>
            ) : (
              'Select a position to preview it'
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            {positionBrowser.isPreviewMode && (
              <button
                onClick={handleConfirmReplay}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Start Playing from Here
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Save Position Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">Save Position</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={saveForm.name}
                    onChange={(e) => setSaveForm({ ...saveForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter position name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={saveForm.description}
                    onChange={(e) => setSaveForm({ ...saveForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    placeholder="Optional description"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePosition}
                  disabled={!saveForm.name.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Position
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rename Position Dialog */}
      {showRenameDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">Edit Position</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={renameForm.name}
                    onChange={(e) => setRenameForm({ ...renameForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter position name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={renameForm.description}
                    onChange={(e) => setRenameForm({ ...renameForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    placeholder="Optional description"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowRenameDialog(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRenamePosition(showRenameDialog)}
                  disabled={!renameForm.name.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 