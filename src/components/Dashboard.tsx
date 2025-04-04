
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, BellIcon, CheckCircle, ClockIcon, FileText } from 'lucide-react';
import { ScholarshipProps } from './ScholarshipCard';

interface DashboardProps {
  savedScholarships: ScholarshipProps[];
  appliedScholarships: ScholarshipProps[];
}

const Dashboard: React.FC<DashboardProps> = ({ 
  savedScholarships = [], 
  appliedScholarships = [] 
}) => {
  const upcomingDeadlines = savedScholarships
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Scholarship Dashboard</h1>
        <p className="text-muted-foreground">
          Track your scholarship applications and deadlines all in one place
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{savedScholarships.length}</CardTitle>
            <CardDescription>Saved Scholarships</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Scholarships you've bookmarked for later
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{appliedScholarships.length}</CardTitle>
            <CardDescription>Applied Scholarships</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Scholarships you've submitted applications for
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              {upcomingDeadlines.length > 0 ? 
                new Date(upcomingDeadlines[0].deadline).toLocaleDateString() : 
                "No deadlines"}
            </CardTitle>
            <CardDescription>Next Deadline</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {upcomingDeadlines.length > 0 ? 
                `For ${upcomingDeadlines[0].title}` : 
                "You have no upcoming deadlines"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="upcoming">Upcoming Deadlines</TabsTrigger>
          <TabsTrigger value="saved">Saved Scholarships</TabsTrigger>
          <TabsTrigger value="applied">Applied Scholarships</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-0">
          {upcomingDeadlines.length > 0 ? (
            <div className="space-y-4">
              {upcomingDeadlines.map((scholarship) => (
                <Card key={scholarship.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold truncate">{scholarship.title}</h3>
                        <Badge className="ml-2 bg-yellow-500">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          Upcoming
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{scholarship.provider}</p>
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Deadline: {scholarship.deadline}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" className="gap-1">
                          <FileText className="h-4 w-4" />
                          Apply Now
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <BellIcon className="h-4 w-4" />
                          Set Reminder
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {savedScholarships.length > upcomingDeadlines.length && (
                <div className="text-center mt-4">
                  <Button variant="outline">View All Deadlines</Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground mb-4">You have no upcoming deadlines</p>
              <Button>Find Scholarships</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="saved" className="mt-0">
          {savedScholarships.length > 0 ? (
            <div className="space-y-4">
              {savedScholarships.map((scholarship) => (
                <Card key={scholarship.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-grow">
                      <h3 className="font-semibold mb-2">{scholarship.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{scholarship.provider}</p>
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Deadline: {scholarship.deadline}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm">Apply Now</Button>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground mb-4">You haven't saved any scholarships yet</p>
              <Button>Find Scholarships</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="applied" className="mt-0">
          {appliedScholarships.length > 0 ? (
            <div className="space-y-4">
              {appliedScholarships.map((scholarship) => (
                <Card key={scholarship.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{scholarship.title}</h3>
                        <Badge className="ml-2">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Applied
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{scholarship.provider}</p>
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Applied on: {new Date().toLocaleDateString()}
                      </div>
                      <Button size="sm" variant="outline">Check Status</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground mb-4">You haven't applied to any scholarships yet</p>
              <Button>Find Scholarships</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
