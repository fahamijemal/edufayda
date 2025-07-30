"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Trophy, Play } from "lucide-react";
import Link from "next/link";

interface Enrollment {
  id: string;
  progress: number;
  enrolledAt: string;
  completedAt: string | null;
  course: {
    id: string;
    title: string;
    description: string;
    slug: string;
    level: string;
    duration: number;
    modules: Array<{
      id: string;
      title: string;
      lessons: Array<{
        id: string;
        title: string;
        isPublished: boolean;
      }>;
    }>;
  };
}

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await fetch("/api/enrollments");
      if (response.ok) {
        const data = await response.json();
        setEnrollments(data.enrollments);
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (progress: number, completedAt: string | null) => {
    if (completedAt) {
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    } else if (progress > 0) {
      return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Not Started</Badge>;
    }
  };

  const calculateStats = () => {
    const total = enrollments.length;
    const completed = enrollments.filter(e => e.completedAt).length;
    const inProgress = enrollments.filter(e => e.progress > 0 && !e.completedAt).length;
    const totalTimeSpent = enrollments.reduce((acc, e) => acc + (e.course.duration * (e.progress / 100)), 0);

    return { total, completed, inProgress, totalTimeSpent };
  };

  const stats = calculateStats();

  if (loading) {
    return <div className="flex justify-center p-8">Loading your courses...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Studied</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.totalTimeSpent)}h</div>
          </CardContent>
        </Card>
      </div>

      {/* Course Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">My Courses</h2>
        
        {enrollments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No courses enrolled</h3>
              <p className="text-muted-foreground mb-4">
                Start your learning journey by enrolling in a course
              </p>
              <Button asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{enrollment.course.level}</Badge>
                    {getStatusBadge(enrollment.progress, enrollment.completedAt)}
                  </div>
                  <CardTitle className="line-clamp-2">
                    {enrollment.course.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {enrollment.course.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{enrollment.progress}%</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{enrollment.course.modules.length} modules</span>
                      <span>
                        {enrollment.course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
                      </span>
                    </div>
                    
                    <Button asChild className="w-full">
                      <Link href={`/courses/${enrollment.course.slug}`}>
                        {enrollment.progress > 0 ? "Continue Learning" : "Start Course"}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 