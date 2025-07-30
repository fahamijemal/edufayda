"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
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
import { Plus, Edit, Trash2, Play, Clock, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonSchema, lessonSchemaType } from "@/lib/zodSchemas";
import { toast } from "sonner";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";

interface Module {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  isPublished: boolean;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  modules: Module[];
}

export default function LessonManagementPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; lesson: Lesson | null }>({
    open: false,
    lesson: null
  });

  const form = useForm<lessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      content: "",
      videoUrl: "",
      duration: undefined,
      order: 0,
      isPublished: false,
    },
  });

  useEffect(() => {
    if (params.slug) {
      fetchCourseData(params.slug as string);
    }
  }, [params.slug]);

  const fetchCourseData = async (slug: string) => {
    try {
      const response = await fetch(`/api/courses/learn/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data.course);
      } else {
        toast.error("Failed to load course data");
        router.push("/admin/courses");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = (module: Module) => {
    setSelectedModule(module);
    setEditingLesson(null);
    form.reset({
      title: "",
      content: "",
      videoUrl: "",
      duration: undefined,
      order: module.lessons.length,
      isPublished: false,
    });
    setDialogOpen(true);
  };

  const handleEditLesson = (lesson: Lesson, module: Module) => {
    setSelectedModule(module);
    setEditingLesson(lesson);
    form.reset({
      title: lesson.title,
      content: lesson.content,
      videoUrl: lesson.videoUrl || "",
      duration: lesson.duration,
      order: lesson.order,
      isPublished: lesson.isPublished,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: lessonSchemaType) => {
    if (!selectedModule || !course) return;

    try {
      const url = editingLesson 
        ? `/api/courses/${course.id}/modules/${selectedModule.id}/lessons/${editingLesson.id}`
        : `/api/courses/${course.id}/modules/${selectedModule.id}/lessons`;
      
      const method = editingLesson ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(`Lesson ${editingLesson ? 'updated' : 'created'} successfully!`);
        setDialogOpen(false);
        fetchCourseData(params.slug as string);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save lesson');
      }
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast.error('Failed to save lesson');
    }
  };

  const handleDeleteLesson = async () => {
    if (!deleteDialog.lesson || !selectedModule || !course) return;

    try {
      const response = await fetch(
        `/api/courses/${course.id}/modules/${selectedModule.id}/lessons/${deleteDialog.lesson.id}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        toast.success('Lesson deleted successfully!');
        setDeleteDialog({ open: false, lesson: null });
        fetchCourseData(params.slug as string);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete lesson');
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Failed to delete lesson');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href={`/admin/courses/${course.slug}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Manage Lessons</h1>
            <p className="text-muted-foreground">{course.title}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {course.modules.map((module) => (
          <Card key={module.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {module.title}
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
                <Button onClick={() => handleCreateLesson(module)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {module.lessons.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No lessons yet. Click "Add Lesson" to create the first one.
                </p>
              ) : (
                <div className="space-y-3">
                  {module.lessons
                    .sort((a, b) => a.order - b.order)
                    .map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
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
                            <h4 className="font-medium">{lesson.title}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span>Order: {lesson.order}</span>
                              {lesson.duration && <span>{lesson.duration}min</span>}
                              <Badge variant={lesson.isPublished ? "default" : "secondary"}>
                                {lesson.isPublished ? "Published" : "Draft"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditLesson(lesson, module)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedModule(module);
                              setDeleteDialog({ open: true, lesson });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Lesson Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
            </DialogTitle>
            <DialogDescription>
              {selectedModule && `Adding lesson to: ${selectedModule.title}`}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter lesson title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter lesson content..." 
                        rows={8}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="30" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Published
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Make this lesson visible to students
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingLesson ? 'Update Lesson' : 'Create Lesson'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, lesson: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog.lesson?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLesson} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 