"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Eye,
  Plus,
  BarChart3,
  Award
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface DashboardStats {
  totalCourses: number;
  publishedCourses: number;
  totalEnrollments: number;
  totalStudents: number;
  completedCourses: number;
  recentEnrollments: Array<{
    id: string;
    user: { name: string; email: string };
    course: { title: string; slug: string };
    enrolledAt: string;
  }>;
  topCourses: Array<{
    id: string;
    title: string;
    slug: string;
    enrollmentCount: number;
    status: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to load dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">EduFayda Dashboard</h1>
            <p className="text-muted-foreground">Loading your LMS overview...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded w-16 mb-2"></div>
                <div className="h-3 bg-muted animate-pulse rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Dashboard Error</h2>
        <p className="text-muted-foreground mb-4">Failed to load dashboard data</p>
        <Button onClick={fetchDashboardStats}>Try Again</Button>
      </div>
    );
  }

  const enrollmentRate = stats.totalCourses > 0 ? 
    ((stats.totalEnrollments / stats.totalCourses) * 100).toFixed(1) : "0";
  
  const completionRate = stats.totalEnrollments > 0 ? 
    ((stats.completedCourses / stats.totalEnrollments) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">EduFayda Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your learning management system overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/courses/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedCourses} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              {enrollmentRate}% avg per course
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topCourses.length}</div>
            <p className="text-xs text-muted-foreground">
              Active courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentEnrollments.length}</div>
            <p className="text-xs text-muted-foreground">
              Recent enrollments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Your Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Courses</CardTitle>
            <CardDescription>
              Recent courses you've created
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.topCourses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by creating your first course
                </p>
                <Link href="/admin/courses/create">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Course
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.topCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <Link 
                        href={`/admin/courses/${course.slug}`}
                        className="font-medium hover:underline line-clamp-1"
                      >
                        {course.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={course.status === "PUBLISHED" ? "default" : "secondary"}>
                          {course.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {course.enrollmentCount} students
                        </span>
                      </div>
                    </div>
                    <Link href={`/admin/courses/${course.slug}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Enrollments</CardTitle>
            <CardDescription>
              Latest student course enrollments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentEnrollments.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No enrollments yet</h3>
                <p className="text-muted-foreground">
                  Students will appear here when they enroll in your courses
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{enrollment.user.name}</p>
                      <Link 
                        href={`/admin/courses/${enrollment.course.slug}`}
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        {enrollment.course.title}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Link href="/admin/courses">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Manage Courses
              </Button>
            </Link>
            <Link href="/admin/courses/create">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Create New Course
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start" disabled>
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled>
              <Users className="mr-2 h-4 w-4" />
              Manage Students
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
