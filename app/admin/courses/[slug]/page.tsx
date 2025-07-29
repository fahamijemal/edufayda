"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2, Copy, Eye, FileText } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Course {
  id: string;
  title: string;
  description: string;
  fileKey: string;
  price: number;
  duration: number;
  level: string;
  category: string;
  status: string;
  slug: string;
  smallDescription: string;
  createdAt: string;
  updatedAt: string;
}

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchCourseBySlug(params.slug as string);
    }
  }, [params.slug]);

  const fetchCourseBySlug = async (slug: string) => {
    try {
      // First get all courses, then find by slug (since we don't have a slug-based API endpoint yet)
      const response = await fetch("/api/courses");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch courses");
      }

      const foundCourse = result.courses.find((c: Course) => c.slug === slug);
      
      if (!foundCourse) {
        throw new Error("Course not found");
      }

      setCourse(foundCourse);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load course");
      router.push("/admin/courses");
    } finally {
      setIsLoading(false);
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

  const handleDelete = async () => {
    if (!course) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/courses/${course.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to delete course");
      }

      toast.success("Course deleted successfully!");
      router.push("/admin/courses");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete course");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleDuplicate = async () => {
    if (!course) return;

    try {
      const duplicateData = {
        title: `${course.title} (Copy)`,
        description: course.description,
        fileKey: course.fileKey,
        price: course.price,
        duration: course.duration,
        level: course.level,
        category: course.category,
        smallDescription: course.smallDescription,
        slug: `${course.slug}-copy-${Date.now()}`,
        status: "DRAFT" as const
      };

      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(duplicateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to duplicate course");
      }

      toast.success("Course duplicated successfully!");
      router.push("/admin/courses");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to duplicate course");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Course not found.</p>
        <Link href="/admin/courses" className={buttonVariants({ className: "mt-4" })}>
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/courses"
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground">Course Details</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(course.status)}>
            {course.status}
          </Badge>
          <Link
            href={`/admin/courses/${course.slug}/content`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <FileText className="mr-2 h-4 w-4" />
            Manage Content
          </Link>
          <Button variant="outline" size="sm" onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </Button>
          <Link
            href={`/admin/courses/${course.slug}/edit`}
            className={buttonVariants({ size: "sm" })}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Course
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Course Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Course Overview</CardTitle>
            <CardDescription>Basic course information</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p className="text-sm">{course.category}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Level</p>
                <p className="text-sm">{course.level}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                <p className="text-sm">{course.duration} hours</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Price</p>
                <p className="text-sm">${course.price}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Short Description</p>
              <p className="text-sm">{course.smallDescription}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Full Description</p>
              <div className="prose prose-sm max-w-none">
                <p className="text-sm whitespace-pre-wrap">{course.description}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div>
                <span className="font-medium">Created:</span> {new Date(course.createdAt).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span> {new Date(course.updatedAt).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Slug:</span> {course.slug}
              </div>
              <div>
                <span className="font-medium">Course ID:</span> {course.id}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Media */}
        <Card>
          <CardHeader>
            <CardTitle>Course Media</CardTitle>
            <CardDescription>Thumbnail and media assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Thumbnail URL</p>
              <p className="text-sm font-mono bg-muted px-2 py-1 rounded">{course.fileKey}</p>
              {course.fileKey && (
                <div className="mt-2">
                  <img 
                    src={course.fileKey} 
                    alt={course.title}
                    className="max-w-sm rounded-lg border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{course.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Course"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 