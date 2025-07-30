"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Play, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

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
  modules: Module[];
}

interface LessonProgress {
  lessonId: string;
  isCompleted: boolean;
  timeSpent: number;
}

export default function LearnPage() {
  const params = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetchCourseForLearning(params.slug as string);
      fetchProgress(params.slug as string);
    }
  }, [params.slug]);

  const fetchCourseForLearning = async (slug: string) => {
    try {
      const response = await fetch(`/api/courses/learn/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data.course);
      } else {
        toast.error("Course not found or not enrolled");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async (slug: string) => {
    try {
      const response = await fetch(`/api/progress/course/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setProgress(data.progress);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    try {
      const response = await fetch("/api/progress/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          isCompleted: true,
          timeSpent: getCurrentLesson()?.duration || 0
        })
      });

      if (response.ok) {
        setProgress(prev => 
          prev.map(p => 
            p.lessonId === lessonId 
              ? { ...p, isCompleted: true }
              : p
          )
        );
        toast.success("Lesson completed!");
        
        // Auto-advance to next lesson
        if (hasNextLesson()) {
          setTimeout(() => nextLesson(), 1500);
        }
      }
    } catch (error) {
      console.error("Error marking lesson complete:", error);
      toast.error("Failed to update progress");
    }
  };

  const getCurrentLesson = () => {
    if (!course) return null;
    return course.modules[currentModuleIndex]?.lessons[currentLessonIndex];
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress.some(p => p.lessonId === lessonId && p.isCompleted);
  };

  const hasNextLesson = () => {
    if (!course) return false;
    const currentModule = course.modules[currentModuleIndex];
    
    // Check if there's a next lesson in current module
    if (currentLessonIndex < currentModule.lessons.length - 1) return true;
    
    // Check if there's a next module
    return currentModuleIndex < course.modules.length - 1;
  };

  const hasPrevLesson = () => {
    return currentModuleIndex > 0 || currentLessonIndex > 0;
  };

  const nextLesson = () => {
    if (!course) return;
    
    const currentModule = course.modules[currentModuleIndex];
    
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
    } else if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(prev => prev + 1);
      setCurrentLessonIndex(0);
    }
  };

  const prevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(prev => prev - 1);
      const prevModule = course?.modules[currentModuleIndex - 1];
      if (prevModule) {
        setCurrentLessonIndex(prevModule.lessons.length - 1);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading course...</div>;
  }

  if (!course) {
    return <div className="text-center p-8">Course not found or not enrolled</div>;
  }

  const currentLesson = getCurrentLesson();
  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = progress.filter(p => p.isCompleted).length;
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <Badge variant="secondary">
            {completedLessons}/{totalLessons} lessons completed
          </Badge>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Course Content */}
        <div className="lg:col-span-3 space-y-6">
          {currentLesson && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {currentLesson.title}
                      {isLessonCompleted(currentLesson.id) && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Module {currentModuleIndex + 1}: {course.modules[currentModuleIndex].title}
                    </p>
                  </div>
                  {currentLesson.duration && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{currentLesson.duration}min</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Video Player */}
                {currentLesson.videoUrl && (
                  <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                    <Play className="h-12 w-12 text-white" />
                    <p className="text-white ml-2">Video Player Placeholder</p>
                  </div>
                )}

                {/* Lesson Content */}
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                </div>

                {/* Lesson Controls */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={prevLesson}
                    disabled={!hasPrevLesson()}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    {!isLessonCompleted(currentLesson.id) && (
                      <Button onClick={() => markLessonComplete(currentLesson.id)}>
                        Mark Complete
                      </Button>
                    )}
                    
                    <Button
                      onClick={nextLesson}
                      disabled={!hasNextLesson()}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Course Navigation Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Course Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {course.modules.map((module, moduleIdx) => (
                  <div key={module.id}>
                    <h4 className="font-medium text-sm mb-2">
                      Module {moduleIdx + 1}: {module.title}
                    </h4>
                    <div className="space-y-1">
                      {module.lessons.map((lesson, lessonIdx) => (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            setCurrentModuleIndex(moduleIdx);
                            setCurrentLessonIndex(lessonIdx);
                          }}
                          className={`w-full text-left p-2 rounded text-sm transition-colors ${
                            moduleIdx === currentModuleIndex && lessonIdx === currentLessonIndex
                              ? "bg-blue-100 text-blue-700"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isLessonCompleted(lesson.id) ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <div className="h-4 w-4 border border-gray-300 rounded-full" />
                            )}
                            <span className="line-clamp-2">{lesson.title}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 