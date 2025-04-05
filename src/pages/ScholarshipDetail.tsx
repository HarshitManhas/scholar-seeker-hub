
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, ExternalLink, GraduationCap, Heart, Info, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockScholarships } from '@/data/mockScholarships';
import { useAuth } from '@/hooks/useAuth';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { toast } from 'sonner';

const ScholarshipDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  
  // Find the scholarship by ID
  const scholarship = mockScholarships.find(s => s.id === id);
  
  if (!scholarship) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Scholarship Not Found</h1>
        <p className="text-muted-foreground mb-8">The scholarship you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link to="/">Back to Scholarships</Link>
        </Button>
      </div>
    );
  }
  
  const handleBookmark = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to bookmark scholarships");
      return;
    }
    
    const savedBookmarks = localStorage.getItem(`bookmarks_${user?.email}`);
    let bookmarks = savedBookmarks ? JSON.parse(savedBookmarks) : [];
    
    const isBookmarked = bookmarks.some((b: any) => b.id === scholarship.id);
    
    if (isBookmarked) {
      bookmarks = bookmarks.filter((b: any) => b.id !== scholarship.id);
      toast.success("Removed from bookmarks");
    } else {
      bookmarks.push(scholarship);
      toast.success("Added to bookmarks");
    }
    
    localStorage.setItem(`bookmarks_${user?.email}`, JSON.stringify(bookmarks));
  };
  
  const handleApply = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to apply for scholarships");
      return;
    }
    
    const savedApplied = localStorage.getItem(`applied_${user?.email}`);
    let applied = savedApplied ? JSON.parse(savedApplied) : [];
    
    if (!applied.some((a: any) => a.id === scholarship.id)) {
      applied.push(scholarship);
      localStorage.setItem(`applied_${user?.email}`, JSON.stringify(applied));
    }
    
    toast.success("Application initiated for " + scholarship.title);
    window.open(scholarship.url, '_blank');
  };
  
  // Check if scholarship is bookmarked
  const isBookmarked = isAuthenticated && user ? 
    JSON.parse(localStorage.getItem(`bookmarks_${user.email}`) || '[]')
    .some((b: any) => b.id === scholarship.id) : false;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link to="/" className="transition-colors hover:text-foreground">
              Scholarships
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{scholarship.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <Button variant="ghost" className="mb-4" asChild>
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Scholarships
        </Link>
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold">{scholarship.title}</h1>
                <p className="text-lg text-muted-foreground">{scholarship.provider}</p>
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleBookmark}
                className={isBookmarked ? "text-red-500" : "text-gray-400"}
              >
                <Heart className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {scholarship.eligibility.map((item, index) => (
                <Badge key={index} variant="secondary">{item}</Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Award Amount</p>
                    <p className="font-semibold">{scholarship.amount}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Application Deadline</p>
                    <p className="font-semibold">{scholarship.deadline}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground">{scholarship.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Eligibility</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 pl-4">
                {scholarship.eligibility.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-card rounded-lg border p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Info className="h-5 w-5 mr-2 text-primary" />
              Application Info
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <GraduationCap className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Provider</p>
                  <p className="text-sm text-muted-foreground">{scholarship.provider}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <LinkIcon className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Official Website</p>
                  <a 
                    href={scholarship.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Deadline</p>
                  <p className="text-sm text-muted-foreground">{scholarship.deadline}</p>
                </div>
              </div>
            </div>
            
            <Button className="w-full mb-3" onClick={handleApply}>
              Apply Now <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            
            <Button variant="outline" className="w-full" onClick={handleBookmark}>
              {isBookmarked ? "Remove from Bookmarks" : "Save for Later"}
              <Heart 
                className="ml-2 h-4 w-4" 
                fill={isBookmarked ? "currentColor" : "none"} 
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipDetail;

