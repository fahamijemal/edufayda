import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { courseSchema } from "@/lib/zodSchemas";

export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } } // changed from id to courseId
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

    const { courseId } = params; // changed from id

    // Get the course
    const course = await prisma.course.findUnique({
      where: { 
        id: courseId, // changed from id
        userId: session.user.id, // Ensure user can only access their own courses
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ course });

  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { courseId: string } } // changed from id to courseId
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

    const { courseId } = params; // changed from id

    // Parse and validate request body
    const body = await req.json();
    const validatedData = courseSchema.parse(body);

    // Check if course exists and belongs to user
    const existingCourse = await prisma.course.findUnique({
      where: {
        id: courseId, // changed from id
        userId: session.user.id,
      },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check if slug is being changed and if new slug already exists
    if (validatedData.slug !== existingCourse.slug) {
      const slugExists = await prisma.course.findUnique({
        where: { slug: validatedData.slug }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "A course with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update the course
    const updatedCourse = await prisma.course.update({
      where: { id: courseId }, // changed from id
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      course: updatedCourse,
      message: "Course updated successfully"
    });

  } catch (error) {
    console.error("Course update error:", error);
    
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
  { params }: { params: { courseId: string } } // changed from id to courseId
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

    const { courseId } = params; // changed from id

    // Check if course exists and belongs to user
    const existingCourse = await prisma.course.findUnique({
      where: {
        id: courseId, // changed from id
        userId: session.user.id,
      },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Delete the course
    await prisma.course.delete({
      where: { id: courseId }, // changed from id
    });

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully"
    });

  } catch (error) {
    console.error("Course deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 