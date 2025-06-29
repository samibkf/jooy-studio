import React, { useState, useEffect } from 'react';
import { useTextAssignment, TitledText } from '@/contexts/TextAssignmentContext';
import { Region } from '@/types/regions';
import { Undo2 } from 'lucide-react';
import { Button } from './ui/button';

interface DraggableTextProps {
  region: Region;
  onRegionUpdate: (region: Region) => void;
  documentId: string;
}

const DraggableText = ({ region, onRegionUpdate, documentId }: DraggableTextProps) => {
  const { 
    getCurrentDocumentTexts,
    undoRegionAssignment,
    isRegionAssigned,
    isReady,
    isLoading
  } = useTextAssignment();

  const [assignedText, setAssignedText] = useState<TitledText | undefined>(undefined);
  const [regionAssigned, setRegionAssigned] = useState(false);

  useEffect(() => {
    if (isReady && documentId) {
      const titledTexts = getCurrentDocumentTexts(documentId);
      const foundText = titledTexts.find(text => text.assignedRegionId === region.id);
      const isAssigned = isRegionAssigned(region.id, documentId);
      
      setAssignedText(foundText);
      setRegionAssigned(isAssigned);
    }
  }, [isReady, region.id, documentId, getCurrentDocumentTexts, isRegionAssigned]);

  if (isLoading) {
    return (
      <div className="mt-2 p-2 border border-dashed rounded-md bg-gray-50 transition-colors">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium">Loading assignments...</span>
        </div>
        <div className="text-xs text-gray-500">
          Checking text assignments...
        </div>
      </div>
    );
  }

  const handleUndoText = () => {
    console.log(`Undoing text assignment for region ${region.id}`);
    undoRegionAssignment(region.id, documentId);
    onRegionUpdate({
      ...region,
      description: null
    });
  };

  return (
    <div 
      className="mt-2 p-2 border border-dashed rounded-md bg-gray-50 transition-colors"
      style={{ borderColor: regionAssigned ? '#10b981' : '#e5e7eb' }}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium">
          {regionAssigned ? 'Assigned Text' : 'No Text Assigned'}
        </span>
        {regionAssigned && (
          <Button
            onClick={handleUndoText}
            size="sm"
            variant="ghost"
            className="h-6 px-1.5 text-xs text-blue-500 hover:text-blue-700"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      
      {assignedText ? (
        <div className="mt-1 text-xs text-gray-700">
          <span className="font-medium">{assignedText.title}:</span> {assignedText.content.substring(0, 50)}...
        </div>
      ) : (
        <div className="text-xs text-gray-500">
          Assign text using the "Insert Text" tab
        </div>
      )}
    </div>
  );
};

export default DraggableText;
