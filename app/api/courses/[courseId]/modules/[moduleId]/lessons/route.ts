import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { lessonSchema } from "@/lib/zodSchemas";

export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string; moduleId: string } }
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

    const { courseId, moduleId } = params;

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

    // Check if module exists
    const module = await prisma.module.findUnique({
      where: {
        id: moduleId,
        courseId,
      },
    });

    if (!module) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }

    // Get all lessons for the module
    const lessons = await prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ lessons });

  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string; moduleId: string } }
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

    const { courseId, moduleId } = params;

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

    // Check if module exists
    const module = await prisma.module.findUnique({
      where: {
        id: moduleId,
        courseId,
      },
    });

    if (!module) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    
    // If order is not provided, set it to the next available order
    if (body.order === undefined) {
      const maxOrder = await prisma.lesson.findFirst({
        where: { moduleId },
        orderBy: { order: "desc" },
        select: { order: true }
      });
      body.order = (maxOrder?.order ?? -1) + 1;
    }

    const validatedData = lessonSchema.parse(body);

    // Create the lesson
    const lesson = await prisma.lesson.create({
      data: {
        ...validatedData,
        moduleId,
      },
    });

    return NextResponse.json({
      success: true,
      lesson,
      message: "Lesson created successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Lesson creation error:", error);
    
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