import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"])
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
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
    const { status } = statusSchema.parse(body);

    // Check if course exists and belongs to user
    const course = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId: session.user.id,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Update course status
    const updatedCourse = await prisma.course.update({
      where: { id: params.courseId },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      course: updatedCourse,
      message: `Course ${status.toLowerCase()} successfully`
    });

  } catch (error) {
    console.error("Course status update error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid status", details: error,
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 