
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, DollarSign, ExternalLink, Heart, ArrowLeft, CheckCircle, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ScholarshipProps } from '@/components/ScholarshipCard';
import { Bookmark, Application } from '@/types/supabase';

const ScholarshipDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [scholarship, setScholarship] = useState<ScholarshipProps | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  
  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        if (!id) return;
        
        setLoading(true);
        
        const { data, error } = await supabase
          .from('scholarships')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          console.error('Error fetching scholarship:', error);
          toast.error('Failed to load scholarship details');
          return;
        }
        
        setScholarship(data as ScholarshipProps);
      } catch (error) {
        console.error('Unexpected error fetching scholarship:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchScholarship();
  }, [id]);
  
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        if (!user?.id || !id) return;
        
        const { data, error } = await supabase
          .from('bookmarks')
          .select('*')
          .eq('user_id', user.id)
          .eq('scholarship_id', id);
          
        if (error) {
          console.error('Error checking bookmark status:', error);
          return;
        }
        
        setIsBookmarked(data.length > 0);
      } catch (error) {
        console.error('Unexpected error checking bookmark status:', error);
      }
    };

    const checkApplicationStatus = async () => {
      try {
        if (!user?.id || !id) return;
        
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', user.id)
          .eq('scholarship_id', id);
          
        if (error) {
          console.error('Error checking application status:', error);
          return;
        }
        
        setHasApplied(data.length > 0);
      } catch (error) {
        console.error('Unexpected error checking application status:', error);
      }
    };

    if (isAuthenticated) {
      checkBookmarkStatus();
      checkApplicationStatus();
    }
  }, [user, id, isAuthenticated]);
  
  const handleBookmark = async () => {
    try {
      if (!isAuthenticated) {
        toast.error('Please login to bookmark scholarships');
        return;
      }
      
      setBookmarkLoading(true);
      
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user!.id)
          .eq('scholarship_id', id!);
          
        if (error) {
          console.error('Error removing bookmark:', error);
          toast.error('Failed to remove bookmark');
          return;
        }
        
        setIsBookmarked(false);
        toast.success('Scholarship removed from bookmarks');
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: user!.id,
            scholarship_id: id!
          });
          
        if (error) {
          console.error('Error adding bookmark:', error);
          toast.error('Failed to bookmark scholarship');
          return;
        }
        
        setIsBookmarked(true);
        toast.success('Scholarship saved to your bookmarks');
      }
    } catch (error) {
      console.error('Unexpected error handling bookmark:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setBookmarkLoading(false);
    }
  };
  
  const handleApply = async () => {
    try {
      if (!isAuthenticated) {
        toast.error('Please login to apply for scholarships');
        return;
      }
      
      if (hasApplied) {
        // Open the external scholarship URL
        if (scholarship?.url) {
          window.open(scholarship.url, '_blank');
        }
        return;
      }
      
      setApplyLoading(true);
      
      // Create an application record
      const { error } = await supabase
        .from('applications')
        .insert({
          user_id: user!.id,
          scholarship_id: id!,
          status: 'applied'
        });
        
      if (error) {
        console.error('Error creating application:', error);
        toast.error('Failed to apply for scholarship');
        return;
      }
      
      setHasApplied(true);
      toast.success('Application initiated for ' + scholarship?.title);
      
      // Open the external scholarship URL
      if (scholarship?.url) {
        window.open(scholarship.url, '_blank');
      }
    } catch (error) {
      console.error('Unexpected error applying for scholarship:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setApplyLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-96 mb-4" />
          <Skeleton className="h-4 w-64 mb-8" />
          <Skeleton className="h-64 w-full mb-6" />
          <div className="flex flex-wrap gap-2 mb-6">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!scholarship) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert>
          <AlertDescription>
            Scholarship not found. It may have been removed or the URL is incorrect.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Scholarships
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Scholarships</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="truncate max-w-[200px] inline-block">{scholarship.title}</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl">{scholarship.title}</CardTitle>
                <CardDescription className="mt-2 text-base">Provided by {scholarship.provider}</CardDescription>
              </div>
              <Button 
                variant={isBookmarked ? "secondary" : "outline"} 
                size="sm" 
                className={`flex items-center gap-2 ${isBookmarked ? "text-red-500" : ""}`}
                onClick={handleBookmark}
                disabled={bookmarkLoading}
              >
                <Heart className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
                {isBookmarked ? "Saved" : "Save"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex gap-2 items-center bg-primary/10 text-primary rounded-full px-4 py-2">
                <DollarSign className="h-5 w-5" />
                <span className="font-semibold text-lg">{scholarship.amount}</span>
              </div>
              
              <div className="flex gap-2 items-center bg-muted rounded-full px-4 py-2">
                <CalendarIcon className="h-4 w-4" />
                <span>Deadline: {scholarship.deadline}</span>
              </div>
              
              {hasApplied && (
                <div className="flex gap-2 items-center bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full px-4 py-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Applied</span>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{scholarship.description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Eligibility</h3>
              <div className="flex flex-wrap gap-2">
                {scholarship.eligibility.map((item, index) => (
                  <Badge key={index} variant="outline" className="text-xs py-1">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="flex-1 gap-2" 
              onClick={handleApply}
              disabled={applyLoading}
            >
              {hasApplied ? (
                <>View Application <ExternalLink className="h-4 w-4" /></>
              ) : (
                <>Apply Now <UserCheck className="h-4 w-4" /></>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 gap-2" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4" /> Back to Scholarships
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ScholarshipDetail;
