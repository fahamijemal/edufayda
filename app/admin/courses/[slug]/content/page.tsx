"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Play, 
  Clock, 
  BookOpen,
  FileText 
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  isPublished: boolean;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  slug: string;
  status: string;
  modules: Module[];
}

export default function CourseContentPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetchCourseContent(params.slug as string);
    }
  }, [params.slug]);

  const fetchCourseContent = async (slug: string) => {
    try {
      // First get the course by slug to get the ID
      const coursesResponse = await fetch("/api/courses");
      const coursesResult = await coursesResponse.json();
      
      if (!coursesResponse.ok) {
        throw new Error("Failed to fetch courses");
      }

      const foundCourse = coursesResult.courses.find((c: any) => c.slug === slug);
      if (!foundCourse) {
        throw new Error("Course not found");
      }

      // Now get the detailed course content using the API route we created
      const contentResponse = await fetch(`/api/courses/${foundCourse.id}/content`);
      const contentResult = await contentResponse.json();

      if (!contentResponse.ok) {
        throw new Error(contentResult.error || "Failed to fetch course content");
      }

      setCourse(contentResult.course);
    } catch (error) {
      console.error("Error fetching course content:", error);
      toast.error("Failed to load course content");
      router.push("/admin/courses");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED": return "bg-green-100 text-green-800";
      case "DRAFT": return "bg-yellow-100 text-yellow-800";
      case "ARCHIVED": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading course content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <Link href="/admin/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const publishedLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.filter(lesson => lesson.isPublished).length, 
    0
  );

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href={`/admin/courses/${course.slug}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Course Content</h1>
            <p className="text-muted-foreground">{course.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(course.status)}>
            {course.status}
          </Badge>
          <Link href={`/admin/courses/${course.slug}/lessons`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Manage Lessons
            </Button>
          </Link>
        </div>
      </div>

      {/* Content Overview */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{course.modules.length}</p>
                <p className="text-sm text-muted-foreground">Modules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{totalLessons}</p>
                <p className="text-sm text-muted-foreground">Total Lessons</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{publishedLessons}</p>
                <p className="text-sm text-muted-foreground">Published Lessons</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Structure */}
      <div className="space-y-6">
        {course.modules.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No modules yet</h3>
              <p className="text-muted-foreground mb-4">
                Start building your course by creating modules and lessons.
              </p>
              <Link href={`/admin/courses/${course.slug}/lessons`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Module
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          course.modules
            .sort((a, b) => a.order - b.order)
            .map((module, moduleIndex) => (
              <Card key={module.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Module {moduleIndex + 1}: {module.title}
                        <Badge variant="secondary">
                          {module.lessons.length} lessons
                        </Badge>
                      </CardTitle>
                      {module.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {module.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {module.lessons.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                      <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No lessons in this module</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {module.lessons
                        .sort((a, b) => a.order - b.order)
                        .map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                          >
                            <div className="flex items-start gap-3 flex-1">
                              <div className="mt-1">
                                {lesson.isPublished ? (
                                  <Play className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Clock className="h-4 w-4 text-yellow-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">
                                  Lesson {lessonIndex + 1}: {lesson.title}
                                </h4>
                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                  {lesson.duration && <span>{lesson.duration} min</span>}
                                  {lesson.videoUrl && <span>Video included</span>}
                                  <Badge 
                                    variant={lesson.isPublished ? "default" : "secondary"}
                                    className="text-xs"
                                  >
                                    {lesson.isPublished ? "Published" : "Draft"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
        )}
      </div>

      {course.modules.length > 0 && (
        <div className="mt-8 text-center">
          <Link href={`/admin/courses/${course.slug}/lessons`}>
            <Button size="lg">
              <Edit className="h-4 w-4 mr-2" />
              Manage Lessons & Modules
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
} 