
import React, { useState } from 'react';
import { GraduationCap, User, LogIn, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">ScholarSeeker</h1>
          </div>
          
          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
                  Find Scholarships
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
                  Resources
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
                  Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Sign In</h4>
                    <p className="text-sm text-muted-foreground">
                      Access your ScholarSeeker account
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid gap-1">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <input
                        id="email"
                        className="w-full p-2 border rounded-md text-sm"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="grid gap-1">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        className="w-full p-2 border rounded-md text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                    <Button className="mt-2">Sign In</Button>
                    <p className="text-sm text-center text-muted-foreground mt-2">
                      Don't have an account? 
                      <Button variant="link" className="p-0 ml-1 h-auto">Register</Button>
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button className="hidden md:flex items-center gap-2" size="sm">
              <User className="h-4 w-4" />
              Register
            </Button>
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <nav className="flex flex-col space-y-3">
              <a href="#" className="text-sm font-medium hover:text-primary px-2 py-1">Home</a>
              <a href="#" className="text-sm font-medium hover:text-primary px-2 py-1">Find Scholarships</a>
              <a href="#" className="text-sm font-medium hover:text-primary px-2 py-1">Resources</a>
              <a href="#" className="text-sm font-medium hover:text-primary px-2 py-1">Dashboard</a>
              <a href="#" className="text-sm font-medium hover:text-primary px-2 py-1">About</a>
            </nav>
            <div className="flex flex-col space-y-2 pt-2 border-t">
              <Button variant="outline" className="justify-center">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button className="justify-center">
                <User className="h-4 w-4 mr-2" />
                Register
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
