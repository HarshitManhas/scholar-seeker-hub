
import React, { useState } from 'react';
import Header from '@/components/Header';
import ProfileForm from '@/components/ProfileForm';
import ScholarshipList from '@/components/ScholarshipList';
import { mockScholarships } from '@/data/mockScholarships';
import { ScholarshipProps } from '@/components/ScholarshipCard';
import { GraduationCap } from 'lucide-react';

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [filteredScholarships, setFilteredScholarships] = useState<ScholarshipProps[]>([]);

  const handleProfileSubmit = (profileData: any) => {
    console.log("Profile data submitted:", profileData);
    
    // In a real application, you would use this data to filter scholarships from the database
    // For now, we'll simulate filtering with our mock data
    let filtered = [...mockScholarships];
    
    // Simple filtering logic based on academic level (this would be much more complex in a real app)
    if (profileData.academicLevel) {
      if (profileData.academicLevel === 'high_school') {
        filtered = filtered.filter(s => 
          s.eligibility.some(e => e.includes('High School'))
        );
      } else if (profileData.academicLevel === 'undergraduate') {
        filtered = filtered.filter(s => 
          s.eligibility.some(e => e.includes('Undergraduate'))
        );
      } else if (profileData.academicLevel === 'graduate' || profileData.academicLevel === 'doctoral') {
        filtered = filtered.filter(s => 
          s.eligibility.some(e => e.includes('Graduate'))
        );
      }
    }
    
    // If we have a field of study filter
    if (profileData.fieldOfStudy) {
      // Example for computer science or engineering
      if (profileData.fieldOfStudy === 'computer_science' || profileData.fieldOfStudy === 'engineering') {
        filtered = filtered.filter(s => 
          s.eligibility.some(e => 
            e.includes('Computer Science') || 
            e.includes('Engineering') || 
            e.includes('STEM')
          ) || s.title.includes('STEM')
        );
      }
    }
    
    // Financial need filtering
    if (profileData.financialNeed) {
      filtered = filtered.filter(s => 
        s.eligibility.some(e => e.includes('Financial Need'))
      );
    }
    
    // Gender filtering (example for female scholarships)
    if (profileData.gender === 'female') {
      filtered = filtered.filter(s => 
        s.eligibility.some(e => e.includes('Female')) || s.title.includes('Women')
      );
    }
    
    // Ethnicity filtering (simple example)
    if (profileData.ethnicity.includes('Hispanic/Latino')) {
      const hispanicScholarships = mockScholarships.filter(s => 
        s.eligibility.some(e => e.includes('Hispanic')) || 
        s.eligibility.some(e => e.includes('Latino')) ||
        s.title.includes('Hispanic')
      );
      
      // If we found specific scholarships for this ethnicity, add them to results
      if (hispanicScholarships.length > 0) {
        const existingIds = filtered.map(s => s.id);
        hispanicScholarships.forEach(s => {
          if (!existingIds.includes(s.id)) {
            filtered.push(s);
          }
        });
      }
    }
    
    // First-generation filtering
    if (profileData.firstGeneration) {
      // Prioritize first-generation scholarships by adding them if we find any
      const firstGenScholarships = mockScholarships.filter(s => 
        s.description.includes('first-generation') || 
        s.title.includes('First Generation')
      );
      
      if (firstGenScholarships.length > 0) {
        const existingIds = filtered.map(s => s.id);
        firstGenScholarships.forEach(s => {
          if (!existingIds.includes(s.id)) {
            filtered.push(s);
          }
        });
      }
    }
    
    setFilteredScholarships(filtered);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!showResults ? (
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
            </div>
            
            <ProfileForm onSubmit={handleProfileSubmit} />
          </>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Your Matching Scholarships</h2>
                <button 
                  onClick={() => setShowResults(false)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Edit Profile
                </button>
              </div>
              <p className="text-muted-foreground mt-2">
                We found {filteredScholarships.length} scholarships that match your profile.
              </p>
            </div>
            
            <ScholarshipList scholarships={filteredScholarships} />
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
