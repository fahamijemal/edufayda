"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, Users, Play, CheckCircle, Lock } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  price: number;
  duration: number;
  modules: Array<{
    id: string;
    title: string;
    description: string;
    order: number;
    lessons: Array<{
      id: string;
      title: string;
      duration: number;
      order: number;
      isPublished: boolean;
    }>;
  }>;
  _count: {
    enrollments: number;
  };
}

interface Enrollment {
  id: string;
  progress: number;
  enrolledAt: string;
  completedAt: string | null;
}

export default function CourseDetailPage() {
  const params = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchCourse(params.slug as string);
      checkEnrollment(params.slug as string);
    }
  }, [params.slug]);

  const fetchCourse = async (slug: string) => {
    try {
      const response = await fetch(`/api/courses/public/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data.course);
      } else {
        toast.error("Course not found");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async (slug: string) => {
    try {
      const response = await fetch(`/api/enrollments/check/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setEnrollment(data.enrollment);
      }
    } catch (error) {
      console.error("Error checking enrollment:", error);
    }
  };

  const handleEnroll = async () => {
    if (!course) return;
    
    setEnrolling(true);
    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id })
      });

      if (response.ok) {
        const data = await response.json();
        setEnrollment(data.enrollment);
        toast.success("Successfully enrolled in course!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to enroll");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error("Failed to enroll in course");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading course...</div>;
  }

  if (!course) {
    return <div className="text-center p-8">Course not found</div>;
  }

  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const publishedLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.filter(lesson => lesson.isPublished).length, 
    0
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Course Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">
              {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
            </Badge>
            <Badge variant="secondary">{course.category}</Badge>
          </div>
          
          <h1 className="text-4xl font-bold">{course.title}</h1>
          
          <div className="flex items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration} hours</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{course._count.enrollments} students</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{publishedLessons} lessons</span>
            </div>
          </div>

          {enrollment && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Your Progress</span>
                <span className="text-sm">{enrollment.progress}%</span>
              </div>
              <Progress value={enrollment.progress} className="h-2" />
              {enrollment.completedAt && (
                <div className="flex items-center gap-1 mt-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Completed on {new Date(enrollment.completedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enrollment Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-2xl">
                {course.price > 0 ? `$${course.price}` : "Free"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrollment ? (
                <div className="space-y-3">
                  <Button asChild className="w-full" size="lg">
                    <Link href={`/courses/${params.slug}/learn`}>
                      {enrollment.progress > 0 ? "Continue Learning" : "Start Course"}
                    </Link>
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <Button 
                  onClick={handleEnroll} 
                  disabled={enrolling}
                  className="w-full" 
                  size="lg"
                >
                  {enrolling ? "Enrolling..." : "Enroll Now"}
                </Button>
              )}
              
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{course.duration} hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Lessons:</span>
                  <span>{publishedLessons}</span>
                </div>
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span>{course.level.charAt(0) + course.level.slice(1).toLowerCase()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Course Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About This Course</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="curriculum" className="space-y-4">
          {course.modules.map((module, moduleIndex) => (
            <Card key={module.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Module {moduleIndex + 1}: {module.title}</span>
                  <Badge variant="outline">
                    {module.lessons.filter(l => l.isPublished).length} lessons
                  </Badge>
                </CardTitle>
                {module.description && (
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {module.lessons
                    .filter(lesson => lesson.isPublished)
                    .map((lesson, lessonIndex) => (
                    <div key={lesson.id} className="flex items-center justify-between p-3 rounded border">
                      <div className="flex items-center gap-3">
                        {enrollment ? (
                          <Play className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="font-medium">{lesson.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{lesson.duration}min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
} 