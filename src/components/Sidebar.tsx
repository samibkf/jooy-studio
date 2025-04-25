import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Region } from '@/types/regions';
import { X, PanelRight } from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";

interface SidebarProps {
  selectedRegion: Region | null;
  regions: Region[];
  onRegionUpdate: (updatedRegion: Region) => void;
  onRegionDelete: (regionId: string) => void;
  onRegionSelect: (regionId: string) => void;
}

const Sidebar = ({ 
  selectedRegion, 
  regions, 
  onRegionUpdate, 
  onRegionDelete,
  onRegionSelect
}: SidebarProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
    field: keyof Region
  ) => {
    if (!selectedRegion) return;
    
    const updatedRegion = { 
      ...selectedRegion, 
      [field]: e.target.value 
    };
    onRegionUpdate(updatedRegion);
  };

  const handleDelete = (regionId: string) => {
    onRegionDelete(regionId);
    toast.success('Region deleted');
  };

  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Regions</h2>
      </div>
      
      {regions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No regions defined yet.</p>
          <p className="text-sm mt-2">Draw a region on the PDF to get started.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto mb-6">
          <div className="space-y-3">
            {regions.map((region) => (
              <div 
                key={region.id} 
                className={`p-4 rounded-md border cursor-pointer transition-colors ${
                  selectedRegion?.id === region.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => onRegionSelect(region.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium truncate">{region.name || 'Unnamed Region'}</div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleDelete(region.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Page {region.page}, {region.type}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <Separator />
      
      {selectedRegion && (
        <div className="space-y-4 mt-4">
          <h3 className="font-medium">Region Details</h3>
          
          <div className="space-y-2">
            <Label htmlFor="region-name">Name</Label>
            <Input
              id="region-name"
              value={selectedRegion.name}
              onChange={(e) => handleChange(e, 'name')}
              placeholder="Region name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={selectedRegion.description}
              onChange={(e) => handleChange(e, 'description')}
              placeholder="Optional description"
              rows={3}
            />
          </div>
          
          <div className="text-xs text-muted-foreground">
            <div>Page: {selectedRegion.page}</div>
            <div>Position: {Math.round(selectedRegion.x)}, {Math.round(selectedRegion.y)}</div>
            <div>Size: {Math.round(selectedRegion.width)} × {Math.round(selectedRegion.height)}</div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="fixed right-4 top-24 z-50"  // Increased top position and z-index
          >
            <PanelRight className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px] p-6 overflow-y-auto">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
