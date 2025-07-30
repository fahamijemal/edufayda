import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

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

    // Start with basic queries first
    const totalCourses = await prisma.course.count({
      where: { userId: session.user.id }
    });

    const publishedCourses = await prisma.course.count({
      where: { 
        userId: session.user.id,
        status: "PUBLISHED"
      }
    });

    // Basic enrollment count (simplified)
    const totalEnrollments = await prisma.enrollment.count({
      where: {
        course: { userId: session.user.id }
      }
    });

    // Get recent enrollments (simplified)
    const recentEnrollments = await prisma.enrollment.findMany({
      where: {
        course: { userId: session.user.id }
      },
      include: {
        user: {
          select: { name: true, email: true }
        },
        course: {
          select: { title: true, slug: true }
        }
      },
      orderBy: { enrolledAt: 'desc' },
      take: 5
    });

    // Get courses with enrollment count using separate query
    const coursesWithCounts = await prisma.course.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Get enrollment counts for each course
    const topCourses = await Promise.all(
      coursesWithCounts.map(async (course) => {
        const enrollmentCount = await prisma.enrollment.count({
          where: { courseId: course.id }
        });
        return {
          ...course,
          enrollmentCount
        };
      })
    );

    return NextResponse.json({
      totalCourses,
      publishedCourses,
      totalEnrollments,
      totalStudents: 0, // Will calculate later
      completedCourses: 0, // Will calculate later
      recentEnrollments,
      topCourses
    });

  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
} 