
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, DollarSign, ExternalLink, Heart, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export interface ScholarshipProps {
  id: string;
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  eligibility: string[];
  description: string;
  url: string;
  isBookmarked?: boolean;
}

interface ScholarshipCardProps {
  scholarship: ScholarshipProps;
  onBookmark: (id: string) => void;
  onApply: () => void;
}

const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship, onBookmark, onApply }) => {
  const handleBookmark = () => {
    onBookmark(scholarship.id);
    if (!scholarship.isBookmarked) {
      toast.success("Scholarship saved to your bookmarks");
    }
  };

  const handleApply = () => {
    onApply();
    toast.success("Application initiated for " + scholarship.title);
    window.open(scholarship.url, '_blank');
  };

  return (
    <Card className="scholarship-card h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">
              <Link to={`/scholarship/${scholarship.id}`} className="hover:text-primary hover:underline">
                {scholarship.title}
              </Link>
            </CardTitle>
            <CardDescription className="mt-1">{scholarship.provider}</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBookmark}
            className={scholarship.isBookmarked ? "text-red-500" : "text-gray-400"}
          >
            <Heart className="h-5 w-5" fill={scholarship.isBookmarked ? "currentColor" : "none"} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center mb-3 text-primary">
          <DollarSign className="h-5 w-5 mr-1 flex-shrink-0" />
          <span className="font-semibold">{scholarship.amount}</span>
        </div>
        <div className="flex items-center mb-4 text-muted-foreground">
          <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm">Deadline: {scholarship.deadline}</span>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{scholarship.description}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {scholarship.eligibility.map((item, index) => (
            <Badge key={index} variant="secondary" className="text-xs">{item}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button onClick={handleApply} className="w-full gap-1">
          Apply Now <ExternalLink className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" asChild>
          <Link to={`/scholarship/${scholarship.id}`}>
            <Info className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScholarshipCard;
