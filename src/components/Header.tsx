
import React from 'react';
import { GraduationCap } from 'lucide-react';

const Header = () => {
  return (
    <header className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">ScholarSeeker</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium hover:text-primary">Home</a>
          <a href="#" className="text-sm font-medium hover:text-primary">Find Scholarships</a>
          <a href="#" className="text-sm font-medium hover:text-primary">Resources</a>
          <a href="#" className="text-sm font-medium hover:text-primary">About</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium hover:text-primary">Sign In</button>
          <button className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">Sign Up</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
