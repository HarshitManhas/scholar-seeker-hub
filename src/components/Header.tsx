
import React, { useState } from 'react';
import { GraduationCap, User, LogIn, Menu, X, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { useAuth } from '@/hooks/useAuth';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { toast } from 'sonner';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out");
    setMobileMenuOpen(false);
  };

  const handleAuthClose = () => {
    setAuthDialogOpen(false);
    // Reset to login view for next time dialog opens
    setIsLoginView(true);
  };

  const openLogin = () => {
    setIsLoginView(true);
    setAuthDialogOpen(true);
    setMobileMenuOpen(false);
  };

  const openRegister = () => {
    setIsLoginView(false);
    setAuthDialogOpen(true);
    setMobileMenuOpen(false);
  };

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
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {user?.email}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={openLogin}
                  className="hidden md:flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
                
                <Button 
                  className="hidden md:flex items-center gap-2" 
                  size="sm"
                  onClick={openRegister}
                >
                  <User className="h-4 w-4" />
                  Register
                </Button>
              </>
            )}
            
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
              {isAuthenticated ? (
                <>
                  <div className="text-sm font-medium py-1 px-2">{user?.email}</div>
                  <Button variant="outline" className="justify-center" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="justify-center" onClick={openLogin}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                  <Button className="justify-center" onClick={openRegister}>
                    <User className="h-4 w-4 mr-2" />
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Authentication Dialog */}
      <Dialog open={authDialogOpen} onOpenChange={handleAuthClose}>
        <DialogContent className="sm:max-w-md">
          {isLoginView ? (
            <LoginForm 
              onSuccess={handleAuthClose}
              onRegisterClick={() => setIsLoginView(false)}
            />
          ) : (
            <RegisterForm 
              onSuccess={() => {
                handleAuthClose();
                setIsLoginView(true);
              }}
              onLoginClick={() => setIsLoginView(true)}
            />
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
