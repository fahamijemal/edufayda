import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
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

    // Find course
    const course = await prisma.course.findUnique({
      where: { slug: params.slug }
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Get user's progress for all lessons in this course
    const progress = await prisma.lessonProgress.findMany({
      where: {
        userId: session.user.id,
        lesson: {
          module: {
            courseId: course.id
          }
        }
      },
      select: {
        lessonId: true,
        isCompleted: true,
        timeSpent: true
      }
    });

    return NextResponse.json({ progress });

  } catch (error) {
    console.error("Error fetching course progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 