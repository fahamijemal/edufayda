import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const enrollmentSchema = z.object({
  courseId: z.string().uuid(),
});

// GET /api/enrollments - Get user's enrollments
export async function GET(req: NextRequest) {
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

    const enrollments = await prisma.enrollment.findMany({
      where: { 
        userId: session.user.id,
        isActive: true 
      },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: true
              }
            }
          }
        }
      },
      orderBy: { enrolledAt: "desc" }
    });

    return NextResponse.json({ enrollments });

  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/enrollments - Enroll in a course
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
    const validatedData = enrollmentSchema.parse(body);

    // Check if course exists and is published
    const course = await prisma.course.findUnique({
      where: { 
        id: validatedData.courseId,
        status: "PUBLISHED"
      }
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found or not available" },
        { status: 404 }
      );
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: validatedData.courseId
        }
      }
    });

    if (existingEnrollment) {
      if (existingEnrollment.isActive) {
        return NextResponse.json(
          { error: "Already enrolled in this course" },
          { status: 400 }
        );
      } else {
        // Reactivate enrollment
        const enrollment = await prisma.enrollment.update({
          where: { id: existingEnrollment.id },
          data: { isActive: true },
          include: { course: true }
        });
        
        return NextResponse.json({ 
          message: "Re-enrolled successfully", 
          enrollment 
        });
      }
    }

    // Create new enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId: validatedData.courseId,
      },
      include: { course: true }
    });

    return NextResponse.json({ 
      message: "Enrolled successfully", 
      enrollment 
    }, { status: 201 });

  } catch (error) {
    console.error("Enrollment error:", error);
    
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