
import React, { useState } from 'react';
import ScholarshipCard, { ScholarshipProps } from './ScholarshipCard';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface ScholarshipListProps {
  scholarships: ScholarshipProps[];
  onBookmark: (id: string) => void;
  onApply?: (id: string) => void;
  bookmarkedIds: string[];
}

const ScholarshipList: React.FC<ScholarshipListProps> = ({ 
  scholarships, 
  onBookmark, 
  onApply,
  bookmarkedIds = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [amountFilter, setAmountFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const handleBookmark = (id: string) => {
    onBookmark(id);
  };

  const handleApply = (id: string) => {
    if (onApply) {
      onApply(id);
    }
  };

  const filteredScholarships = scholarships.filter(scholarship => {
    // Text search filter
    const matchesSearch = scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          scholarship.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Amount filter
    let matchesAmount = true;
    if (amountFilter === 'below5k') {
      matchesAmount = parseInt(scholarship.amount.replace(/[^0-9]/g, '')) < 5000;
    } else if (amountFilter === '5kto10k') {
      const amount = parseInt(scholarship.amount.replace(/[^0-9]/g, ''));
      matchesAmount = amount >= 5000 && amount <= 10000;
    } else if (amountFilter === 'above10k') {
      matchesAmount = parseInt(scholarship.amount.replace(/[^0-9]/g, '')) > 10000;
    }

    return matchesSearch && matchesAmount;
  });

  // Filter further based on active tab
  const displayedScholarships = activeTab === 'saved' 
    ? filteredScholarships.filter(s => bookmarkedIds.includes(s.id))
    : filteredScholarships;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scholarships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7" 
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button 
            variant="outline" 
            className="md:w-auto w-full flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 border rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Award Amount</label>
              <Select value={amountFilter} onValueChange={setAmountFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All amounts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All amounts</SelectItem>
                  <SelectItem value="below5k">Below ₹5,000</SelectItem>
                  <SelectItem value="5kto10k">₹5,000 - ₹10,000</SelectItem>
                  <SelectItem value="above10k">Above ₹10,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <Tabs defaultValue="all" className="mt-6" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="all">All Scholarships</TabsTrigger>
            <TabsTrigger value="saved">Saved ({bookmarkedIds.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {displayedScholarships.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">No scholarships match your current filters</p>
                <Button variant="secondary" onClick={() => {
                  setSearchQuery('');
                  setAmountFilter('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedScholarships.map((scholarship) => (
                  <ScholarshipCard 
                    key={scholarship.id}
                    scholarship={{
                      ...scholarship,
                      isBookmarked: bookmarkedIds.includes(scholarship.id)
                    }}
                    onBookmark={handleBookmark}
                    onApply={() => handleApply(scholarship.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved" className="mt-0">
            {displayedScholarships.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">No saved scholarships yet</p>
                <Button variant="secondary" onClick={() => setActiveTab('all')}>
                  Browse All Scholarships
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedScholarships.map((scholarship) => (
                  <ScholarshipCard 
                    key={scholarship.id}
                    scholarship={{
                      ...scholarship,
                      isBookmarked: true
                    }}
                    onBookmark={handleBookmark}
                    onApply={() => handleApply(scholarship.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScholarshipList;
