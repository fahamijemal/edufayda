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

    // Find course and verify enrollment
    const course = await prisma.course.findUnique({
      where: { slug: params.slug },
      include: {
        modules: {
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: { order: "asc" }
            }
          },
          orderBy: { order: "asc" }
        },
        enrollments: {
          where: {
            userId: session.user.id,
            isActive: true
          }
        }
      }
    });

    if (!course || course.enrollments.length === 0) {
      return NextResponse.json(
        { error: "Course not found or not enrolled" },
        { status: 403 }
      );
    }

    return NextResponse.json({ course });

  } catch (error) {
    console.error("Error fetching course for learning:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 