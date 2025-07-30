import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const lessonProgressSchema = z.object({
  lessonId: z.string().uuid(),
  isCompleted: z.boolean().optional(),
  timeSpent: z.number().min(0).optional(),
});

// POST /api/progress/lesson - Update lesson progress
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = lessonProgressSchema.parse(body);

    // Alternative approach - first find the lesson, then check enrollment separately
    const lesson = await prisma.lesson.findUnique({
      where: { id: validatedData.lessonId },
      include: {
        module: {
          include: {
            course: true
          }
        }
      }
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    // Check if user is enrolled in this course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: lesson.module.courseId
        }
      }
    });

    if (!enrollment || !enrollment.isActive) {
      return NextResponse.json(
        { error: "Not enrolled in this course or enrollment inactive" },
        { status: 403 }
      );
    }

    // Update or create lesson progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: validatedData.lessonId
        }
      },
      update: {
        isCompleted: validatedData.isCompleted ?? undefined,
        timeSpent: validatedData.timeSpent ? {
          increment: validatedData.timeSpent
        } : undefined,
        completedAt: validatedData.isCompleted ? new Date() : undefined,
      },
      create: {
        userId: session.user.id,
        lessonId: validatedData.lessonId,
        isCompleted: validatedData.isCompleted ?? false,
        timeSpent: validatedData.timeSpent ?? 0,
        completedAt: validatedData.isCompleted ? new Date() : null,
      }
    });

    // Calculate and update course progress
    await updateCourseProgress(session.user.id, lesson.module.courseId);

    return NextResponse.json({ 
      message: "Progress updated successfully", 
      progress 
    });

  } catch (error) {
    console.error("Progress update error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to calculate and update course progress
async function updateCourseProgress(userId: string, courseId: string) {
  // Get total lessons in the course
  const totalLessons = await prisma.lesson.count({
    where: {
      module: {
        courseId: courseId
      },
      isPublished: true
    }
  });

  // Get completed lessons by user
  const completedLessons = await prisma.lessonProgress.count({
    where: {
      userId: userId,
      isCompleted: true,
      lesson: {
        module: {
          courseId: courseId
        },
        isPublished: true
      }
    }
  });

  // Calculate progress percentage
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const isCompleted = progressPercentage === 100;

  // Update enrollment progress
  await prisma.enrollment.update({
    where: {
      userId_courseId: {
        userId: userId,
        courseId: courseId
      }
    },
    data: {
      progress: Math.round(progressPercentage),
      completedAt: isCompleted ? new Date() : null
    }
  });

  // Create certificate if course is completed
  if (isCompleted) {
    await prisma.certificate.upsert({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: courseId
        }
      },
      update: {},
      create: {
        userId: userId,
        courseId: courseId
      }
    });
  }
} 