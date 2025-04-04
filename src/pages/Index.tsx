import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ProfileForm from '@/components/ProfileForm';
import ScholarshipList from '@/components/ScholarshipList';
import Dashboard from '@/components/Dashboard';
import { mockScholarships } from '@/data/mockScholarships';
import { ScholarshipProps } from '@/components/ScholarshipCard';
import { GraduationCap, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import { toast } from 'sonner';

const Index = () => {
  const { isAuthenticated, user, updateProfile, hasProfile } = useAuth();
  const [showResults, setShowResults] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [filteredScholarships, setFilteredScholarships] = useState<ScholarshipProps[]>([]);
  const [bookmarkedScholarships, setBookmarkedScholarships] = useState<ScholarshipProps[]>([]);
  const [appliedScholarships, setAppliedScholarships] = useState<ScholarshipProps[]>([]);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (hasProfile && user.profile) {
        handleProfileSubmit(user.profile);
      }
      
      const savedBookmarks = localStorage.getItem(`bookmarks_${user.email}`);
      const savedApplied = localStorage.getItem(`applied_${user.email}`);
      
      if (savedBookmarks) {
        try {
          setBookmarkedScholarships(JSON.parse(savedBookmarks));
        } catch (e) {
          console.error("Error loading bookmarks:", e);
        }
      }
      
      if (savedApplied) {
        try {
          setAppliedScholarships(JSON.parse(savedApplied));
        } catch (e) {
          console.error("Error loading applied scholarships:", e);
        }
      }
    }
  }, [isAuthenticated, user, hasProfile]);

  const handleProfileSubmit = (profileData: any) => {
    console.log("Profile data submitted:", profileData);
    
    if (isAuthenticated) {
      updateProfile(profileData);
    }
    
    let filtered = [...mockScholarships];
    
    if (profileData.educationLevel) {
      if (profileData.educationLevel === 'secondary' || profileData.educationLevel === 'senior_secondary') {
        filtered = filtered.filter(s => 
          s.eligibility.some(e => e.includes('High School'))
        );
      } else if (profileData.educationLevel === 'under_graduate') {
        filtered = filtered.filter(s => 
          s.eligibility.some(e => e.includes('Undergraduate'))
        );
      } else if (profileData.educationLevel === 'post_graduate' || profileData.educationLevel === 'phd') {
        filtered = filtered.filter(s => 
          s.eligibility.some(e => e.includes('Graduate'))
        );
      }
    }
    
    if (profileData.course) {
      if (profileData.course === 'science' || profileData.course === 'engineering') {
        filtered = filtered.filter(s => 
          s.eligibility.some(e => 
            e.includes('Science') || 
            e.includes('Engineering') || 
            e.includes('STEM')
          ) || s.title.includes('STEM')
        );
      } else if (profileData.course === 'medical') {
        filtered = filtered.filter(s => 
          s.eligibility.some(e => 
            e.includes('Medical') || 
            e.includes('Health Sciences')
          )
        );
      } else if (profileData.course === 'business') {
        filtered = filtered.filter(s => 
          s.eligibility.some(e => 
            e.includes('Business') || 
            e.includes('Management')
          )
        );
      } else if (profileData.course === 'arts') {
        filtered = filtered.filter(s => 
          s.eligibility.some(e => 
            e.includes('Arts') || 
            e.includes('Humanities')
          )
        );
      }
    }
    
    if (profileData.familyIncome === 'below_1lakh' || profileData.familyIncome === '1_3lakh') {
      filtered = filtered.filter(s => 
        s.eligibility.some(e => e.includes('Financial Need'))
      );
    }
    
    if (profileData.gender === 'female') {
      filtered = filtered.filter(s => 
        s.eligibility.some(e => e.includes('Female')) || s.title.includes('Women')
      );
    }
    
    if (profileData.category === 'sc' || profileData.category === 'st') {
      filtered = filtered.filter(s => 
        s.eligibility.some(e => 
          e.includes('SC') || e.includes('ST') || 
          e.includes('Scheduled Caste') || e.includes('Scheduled Tribe')
        )
      );
    } else if (profileData.category === 'obc') {
      filtered = filtered.filter(s => 
        s.eligibility.some(e => e.includes('OBC') || e.includes('Other Backward Classes'))
      );
    }
    
    if (profileData.isDisabled) {
      const disabilityScholarships = mockScholarships.filter(s => 
        s.eligibility.some(e => 
          e.includes('Disability') || e.includes('Differently Abled') || 
          e.includes('Special Needs')
        )
      );
      
      if (disabilityScholarships.length > 0) {
        const existingIds = filtered.map(s => s.id);
        disabilityScholarships.forEach(s => {
          if (!existingIds.includes(s.id)) {
            filtered.push(s);
          }
        });
      }
    }
    
    if (profileData.isOrphan || profileData.hasSingleParent) {
      const specialCaseScholarships = mockScholarships.filter(s => 
        s.eligibility.some(e => 
          e.includes('Orphan') || e.includes('Single Parent')
        )
      );
      
      if (specialCaseScholarships.length > 0) {
        const existingIds = filtered.map(s => s.id);
        specialCaseScholarships.forEach(s => {
          if (!existingIds.includes(s.id)) {
            filtered.push(s);
          }
        });
      }
    }
    
    if (profileData.state) {
      const stateScholarships = mockScholarships.filter(s => 
        s.eligibility.some(e => e.includes(profileData.state.replace('_', ' ')))
      );
      
      if (stateScholarships.length > 0) {
        const existingIds = filtered.map(s => s.id);
        stateScholarships.forEach(s => {
          if (!existingIds.includes(s.id)) {
            filtered.push(s);
          }
        });
      }
    }
    
    setFilteredScholarships(filtered);
    setShowResults(true);
  };

  const handleBookmarkToggle = (id: string) => {
    const scholarship = [...mockScholarships, ...filteredScholarships]
      .find(s => s.id === id);
    
    if (scholarship) {
      let newBookmarks;
      
      if (bookmarkedScholarships.some(s => s.id === id)) {
        newBookmarks = bookmarkedScholarships.filter(s => s.id !== id);
        setBookmarkedScholarships(newBookmarks);
      } else {
        newBookmarks = [...bookmarkedScholarships, scholarship];
        setBookmarkedScholarships(newBookmarks);
      }
      
      if (isAuthenticated && user) {
        localStorage.setItem(`bookmarks_${user.email}`, JSON.stringify(newBookmarks));
      }
    }
  };

  const handleApplyScholarship = (id: string) => {
    const scholarship = [...mockScholarships, ...filteredScholarships]
      .find(s => s.id === id);
    
    if (scholarship && !appliedScholarships.some(s => s.id === id)) {
      const newApplied = [...appliedScholarships, scholarship];
      setAppliedScholarships(newApplied);
      
      if (isAuthenticated && user) {
        localStorage.setItem(`applied_${user.email}`, JSON.stringify(newApplied));
      }
    }
  };

  const handleAuthSuccess = () => {
    setAuthDialogOpen(false);
    toast.success("Welcome! Please complete your scholarship profile.");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto gap-8">
            <div className="inline-flex items-center justify-center p-6 bg-primary/10 rounded-full">
              <GraduationCap className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Find Scholarships That Match Your Profile</h1>
            <p className="text-xl text-muted-foreground">
              Log in to discover scholarships tailored to your academic profile, financial needs, and personal background.
            </p>
            <Button 
              size="lg" 
              className="mt-4 text-lg"
              onClick={() => setAuthDialogOpen(true)}
            >
              <LogIn className="mr-2 h-5 w-5" />
              Sign In to Continue
            </Button>
          </div>
        </main>
        
        <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
          <DialogContent className="sm:max-w-md">
            {isLoginView ? (
              <LoginForm 
                onSuccess={handleAuthSuccess}
                onRegisterClick={() => setIsLoginView(false)}
              />
            ) : (
              <RegisterForm 
                onSuccess={() => {
                  setAuthDialogOpen(false);
                  setIsLoginView(true);
                }}
                onLoginClick={() => setIsLoginView(true)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!showResults && !showDashboard ? (
          <>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
                <GraduationCap className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Find Scholarships That Match Your Profile</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Answer a few questions about yourself, and we'll help you discover scholarships 
                you're eligible for, saving you time and maximizing your opportunities.
              </p>
              <div className="flex justify-center mt-6 gap-4">
                <button 
                  onClick={() => setShowDashboard(true)}
                  className="text-sm font-medium bg-primary/10 text-primary px-4 py-2 rounded-md hover:bg-primary/20"
                >
                  View Dashboard
                </button>
              </div>
            </div>
            
            <ProfileForm 
              onSubmit={handleProfileSubmit} 
              initialData={user?.profile} 
            />
          </>
        ) : showDashboard ? (
          <Dashboard 
            savedScholarships={bookmarkedScholarships} 
            appliedScholarships={appliedScholarships} 
          />
        ) : (
          <>
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Your Matching Scholarships</h2>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowResults(false)}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => setShowDashboard(true)}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View Dashboard
                  </button>
                </div>
              </div>
              <p className="text-muted-foreground mt-2">
                We found {filteredScholarships.length} scholarships that match your profile.
              </p>
            </div>
            
            <ScholarshipList 
              scholarships={filteredScholarships}
              onBookmark={handleBookmarkToggle}
              onApply={handleApplyScholarship}
              bookmarkedIds={bookmarkedScholarships.map(s => s.id)}
            />
          </>
        )}
      </main>
      
      <footer className="bg-muted py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
            <div className="md:w-1/3">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">ScholarSeeker</h2>
              </div>
              <p className="text-muted-foreground text-sm">
                Connecting students with scholarship opportunities to help fund their education 
                and achieve their academic dreams.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Home</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Find Scholarships</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Resources</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">About Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-sm text-muted-foreground">support@scholarseeker.com</li>
                <li className="text-sm text-muted-foreground">1-800-SCHOLAR</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-muted-foreground/20 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ScholarSeeker. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
