import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { lessonSchema } from "@/lib/zodSchemas";

export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string; moduleId: string; lessonId: string } }
) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { courseId, moduleId, lessonId } = params;

    // Check if course exists and belongs to user
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId: session.user.id,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Get the lesson
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
        moduleId,
      },
      include: {
        module: {
          select: { title: true, courseId: true }
        }
      }
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ lesson });

  } catch (error) {
    console.error("Error fetching lesson:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { courseId: string; moduleId: string; lessonId: string } }
) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { courseId, moduleId, lessonId } = params;

    // Check if course exists and belongs to user
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId: session.user.id,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check if lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
        moduleId,
      },
    });

    if (!existingLesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = lessonSchema.parse(body);

    // Update the lesson
    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      lesson: updatedLesson,
      message: "Lesson updated successfully"
    });

  } catch (error) {
    console.error("Lesson update error:", error);
    
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string; moduleId: string; lessonId: string } }
) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { courseId, moduleId, lessonId } = params;

    // Check if course exists and belongs to user
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId: session.user.id,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check if lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
        moduleId,
      },
    });

    if (!existingLesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    // Delete the lesson
    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    return NextResponse.json({
      success: true,
      message: "Lesson deleted successfully"
    });

  } catch (error) {
    console.error("Lesson deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 