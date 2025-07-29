import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { moduleSchema } from "@/lib/zodSchemas";

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

    // Get the module with lessons
    const module = await prisma.module.findUnique({
      where: {
        id: moduleId,
        courseId,
      },
      include: {
        lessons: {
          orderBy: { order: "asc" }
        },
        _count: {
          select: { lessons: true }
        }
      },
    });

    if (!module) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ module });

  } catch (error) {
    console.error("Error fetching module:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const existingModule = await prisma.module.findUnique({
      where: {
        id: moduleId,
        courseId,
      },
    });

    if (!existingModule) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = moduleSchema.parse(body);

    // Update the module
    const updatedModule = await prisma.module.update({
      where: { id: moduleId },
      data: validatedData,
      include: {
        _count: {
          select: { lessons: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      module: updatedModule,
      message: "Module updated successfully"
    });

  } catch (error) {
    console.error("Module update error:", error);
    
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
    const existingModule = await prisma.module.findUnique({
      where: {
        id: moduleId,
        courseId,
      },
    });

    if (!existingModule) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }

    // Delete the module (cascade will delete lessons)
    await prisma.module.delete({
      where: { id: moduleId },
    });

    return NextResponse.json({
      success: true,
      message: "Module deleted successfully"
    });

  } catch (error) {
    console.error("Module deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 