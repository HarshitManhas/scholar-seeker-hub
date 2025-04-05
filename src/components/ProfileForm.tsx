import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { toast } from 'sonner';
import { ProfileData } from '@/utils/profileAdapter';

interface ProfileFormProps {
  onSubmit: (data: ProfileData) => void;
  initialData?: ProfileData;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    dateOfBirth: undefined,
    gender: '',
    category: '',
    email: '',
    phone: '',
    educationLevel: '',
    course: '',
    board: '',
    yearOfStudy: '',
    marks: '',
    familyIncome: '',
    parentsOccupation: '',
    state: '',
    district: '',
    pincode: '',
    isDisabled: false,
    isOrphan: false,
    hasSingleParent: false,
  });

  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    if (initialData) {
      let updatedData = {...initialData};
      
      if (typeof initialData.dateOfBirth === 'string') {
        updatedData.dateOfBirth = new Date(initialData.dateOfBirth);
      }
      
      setFormData(updatedData);
    }
  }, [initialData]);

  const handleChange = (field: keyof ProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof ProfileData) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.dateOfBirth || !formData.gender || !formData.category) {
      toast.error("Please complete all required personal details");
      setActiveTab('personal');
      return;
    }

    if (!formData.educationLevel || !formData.course) {
      toast.error("Please complete all required academic details");
      setActiveTab('academic');
      return;
    }

    if (!formData.state) {
      toast.error("Please select your state");
      setActiveTab('location');
      return;
    }

    onSubmit(formData);
    toast.success("Profile updated! Finding scholarships for you...");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {initialData ? "Update Your Scholarship Profile" : "Your Scholarship Profile"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your full name" 
                    value={formData.name} 
                    onChange={(e) => handleChange('name', e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth <span className="text-red-500">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="dob"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.dateOfBirth && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.dateOfBirth}
                        onSelect={(date) => handleChange('dateOfBirth', date)}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(value) => handleChange('gender', value)}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleChange('category', value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="obc">OBC</SelectItem>
                      <SelectItem value="sc">SC</SelectItem>
                      <SelectItem value="st">ST</SelectItem>
                      <SelectItem value="ews">EWS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="your@email.com" 
                    value={formData.email} 
                    onChange={(e) => handleChange('email', e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="Enter your phone number" 
                    value={formData.phone} 
                    onChange={(e) => handleChange('phone', e.target.value)} 
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="academic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="educationLevel">Education Level <span className="text-red-500">*</span></Label>
                  <Select 
                    value={formData.educationLevel} 
                    onValueChange={(value) => handleChange('educationLevel', value)}
                  >
                    <SelectTrigger id="educationLevel">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="secondary">Secondary (10th)</SelectItem>
                      <SelectItem value="senior_secondary">Senior Secondary (12th)</SelectItem>
                      <SelectItem value="under_graduate">Under Graduate</SelectItem>
                      <SelectItem value="post_graduate">Post Graduate</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Course/Stream <span className="text-red-500">*</span></Label>
                  <Select 
                    value={formData.course} 
                    onValueChange={(value) => handleChange('course', value)}
                  >
                    <SelectTrigger id="course">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="commerce">Commerce</SelectItem>
                      <SelectItem value="arts">Arts</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="law">Law</SelectItem>
                      <SelectItem value="business">Business/Management</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="board">Board/University</Label>
                  <Input 
                    id="board" 
                    placeholder="Enter your board or university" 
                    value={formData.board} 
                    onChange={(e) => handleChange('board', e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearOfStudy">Year of Study/Graduation</Label>
                  <Select 
                    value={formData.yearOfStudy} 
                    onValueChange={(value) => handleChange('yearOfStudy', value)}
                  >
                    <SelectTrigger id="yearOfStudy">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                      <SelectItem value="5">5th Year</SelectItem>
                      <SelectItem value="graduated">Graduated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marks">Percentage/CGPA</Label>
                  <Input 
                    id="marks" 
                    placeholder="Enter your marks or CGPA" 
                    value={formData.marks} 
                    onChange={(e) => handleChange('marks', e.target.value)} 
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="financial" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="familyIncome">Annual Family Income</Label>
                  <Select 
                    value={formData.familyIncome} 
                    onValueChange={(value) => handleChange('familyIncome', value)}
                  >
                    <SelectTrigger id="familyIncome">
                      <SelectValue placeholder="Select income range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="below_1lakh">Below 1 Lakh</SelectItem>
                      <SelectItem value="1_3lakh">1-3 Lakh</SelectItem>
                      <SelectItem value="3_6lakh">3-6 Lakh</SelectItem>
                      <SelectItem value="6_8lakh">6-8 Lakh</SelectItem>
                      <SelectItem value="above_8lakh">Above 8 Lakh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentsOccupation">Parent's Occupation</Label>
                  <Input 
                    id="parentsOccupation" 
                    placeholder="Enter parent's occupation" 
                    value={formData.parentsOccupation} 
                    onChange={(e) => handleChange('parentsOccupation', e.target.value)} 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Special Categories</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isDisabled" 
                      checked={formData.isDisabled}
                      onCheckedChange={() => handleCheckboxChange('isDisabled')}
                    />
                    <label htmlFor="isDisabled" className="text-sm cursor-pointer">
                      Person with Disability
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isOrphan" 
                      checked={formData.isOrphan}
                      onCheckedChange={() => handleCheckboxChange('isOrphan')}
                    />
                    <label htmlFor="isOrphan" className="text-sm cursor-pointer">
                      Orphan
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hasSingleParent" 
                      checked={formData.hasSingleParent}
                      onCheckedChange={() => handleCheckboxChange('hasSingleParent')}
                    />
                    <label htmlFor="hasSingleParent" className="text-sm cursor-pointer">
                      Single Parent
                    </label>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="location" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                  <Select 
                    value={formData.state} 
                    onValueChange={(value) => handleChange('state', value)}
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="andhra_pradesh">Andhra Pradesh</SelectItem>
                      <SelectItem value="assam">Assam</SelectItem>
                      <SelectItem value="bihar">Bihar</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="kerala">Kerala</SelectItem>
                      <SelectItem value="madhya_pradesh">Madhya Pradesh</SelectItem>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="punjab">Punjab</SelectItem>
                      <SelectItem value="rajasthan">Rajasthan</SelectItem>
                      <SelectItem value="tamil_nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="telangana">Telangana</SelectItem>
                      <SelectItem value="uttar_pradesh">Uttar Pradesh</SelectItem>
                      <SelectItem value="west_bengal">West Bengal</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input 
                    id="district" 
                    placeholder="Enter your district" 
                    value={formData.district} 
                    onChange={(e) => handleChange('district', e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input 
                    id="pincode" 
                    placeholder="Enter your pincode" 
                    value={formData.pincode} 
                    onChange={(e) => handleChange('pincode', e.target.value)} 
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-4 border-t">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                const tabs = ['personal', 'academic', 'financial', 'location'];
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1]);
                }
              }}
              disabled={activeTab === 'personal'}
            >
              Previous
            </Button>
            
            {activeTab !== 'location' ? (
              <Button 
                type="button"
                onClick={() => {
                  const tabs = ['personal', 'academic', 'financial', 'location'];
                  const currentIndex = tabs.indexOf(activeTab);
                  if (currentIndex < tabs.length - 1) {
                    setActiveTab(tabs[currentIndex + 1]);
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button type="submit">Find My Scholarships</Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
