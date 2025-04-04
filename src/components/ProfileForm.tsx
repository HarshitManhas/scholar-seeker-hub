
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';

type ProfileData = {
  academicLevel: string;
  fieldOfStudy: string;
  gpa: string;
  state: string;
  ethnicity: string[];
  citizenship: string;
  gender: string;
  financialNeed: boolean;
  disabilities: boolean;
  firstGeneration: boolean;
};

interface ProfileFormProps {
  onSubmit: (data: ProfileData) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ProfileData>({
    academicLevel: '',
    fieldOfStudy: '',
    gpa: '',
    state: '',
    ethnicity: [],
    citizenship: '',
    gender: '',
    financialNeed: false,
    disabilities: false,
    firstGeneration: false,
  });

  const handleChange = (field: keyof ProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof ProfileData) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleEthnicityChange = (ethnicity: string) => {
    setFormData(prev => {
      if (prev.ethnicity.includes(ethnicity)) {
        return { ...prev, ethnicity: prev.ethnicity.filter(e => e !== ethnicity) };
      } else {
        return { ...prev, ethnicity: [...prev.ethnicity, ethnicity] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.academicLevel) {
      toast.error("Please select your academic level");
      return;
    }
    onSubmit(formData);
    toast.success("Profile updated! Finding scholarships for you...");
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Your Scholarship Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="academicLevel">Academic Level</Label>
              <Select 
                value={formData.academicLevel} 
                onValueChange={(value) => handleChange('academicLevel', value)}
              >
                <SelectTrigger id="academicLevel">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high_school">High School</SelectItem>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="graduate">Graduate</SelectItem>
                  <SelectItem value="doctoral">Doctoral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fieldOfStudy">Field of Study</Label>
              <Select 
                value={formData.fieldOfStudy} 
                onValueChange={(value) => handleChange('fieldOfStudy', value)}
              >
                <SelectTrigger id="fieldOfStudy">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="computer_science">Computer Science</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="health_sciences">Health Sciences</SelectItem>
                  <SelectItem value="humanities">Humanities</SelectItem>
                  <SelectItem value="social_sciences">Social Sciences</SelectItem>
                  <SelectItem value="natural_sciences">Natural Sciences</SelectItem>
                  <SelectItem value="arts">Arts</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpa">GPA</Label>
              <Input 
                id="gpa" 
                placeholder="e.g., 3.5" 
                value={formData.gpa} 
                onChange={(e) => handleChange('gpa', e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select 
                value={formData.state} 
                onValueChange={(value) => handleChange('state', value)}
              >
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="citizenship">Citizenship</Label>
              <Select 
                value={formData.citizenship} 
                onValueChange={(value) => handleChange('citizenship', value)}
              >
                <SelectTrigger id="citizenship">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us_citizen">U.S. Citizen</SelectItem>
                  <SelectItem value="permanent_resident">Permanent Resident</SelectItem>
                  <SelectItem value="international">International Student</SelectItem>
                  <SelectItem value="daca">DACA Recipient</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
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
                  <SelectItem value="non_binary">Non-binary</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Ethnicity (select all that apply)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {['Asian', 'Black/African American', 'Hispanic/Latino', 'Native American', 'White/Caucasian', 'Pacific Islander', 'Other'].map((ethnicity) => (
                <div key={ethnicity} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`ethnicity-${ethnicity}`} 
                    checked={formData.ethnicity.includes(ethnicity)}
                    onCheckedChange={() => handleEthnicityChange(ethnicity)}
                  />
                  <label htmlFor={`ethnicity-${ethnicity}`} className="text-sm cursor-pointer">
                    {ethnicity}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Additional Qualifications</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="financial-need" 
                  checked={formData.financialNeed}
                  onCheckedChange={() => handleCheckboxChange('financialNeed')}
                />
                <label htmlFor="financial-need" className="text-sm cursor-pointer">
                  Demonstrated Financial Need
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="disabilities" 
                  checked={formData.disabilities}
                  onCheckedChange={() => handleCheckboxChange('disabilities')}
                />
                <label htmlFor="disabilities" className="text-sm cursor-pointer">
                  Have Disabilities
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="first-generation" 
                  checked={formData.firstGeneration}
                  onCheckedChange={() => handleCheckboxChange('firstGeneration')}
                />
                <label htmlFor="first-generation" className="text-sm cursor-pointer">
                  First-Generation College Student
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button type="submit" className="w-full md:w-auto">Find My Scholarships</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
