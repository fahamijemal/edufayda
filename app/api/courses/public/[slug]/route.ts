import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: {
        slug: params.slug,
        status: "PUBLISHED"
      },
      include: {
        modules: {
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: { order: "asc" }
            }
          },
          orderBy: { order: "asc" }
        }
      }
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Get enrollment count separately
    const enrollmentCount = await prisma.enrollment.count({
      where: { courseId: course.id }
    });

    return NextResponse.json({ 
      course: {
        ...course,
        _count: {
          enrollments: enrollmentCount
        }
      }
    });

  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 