import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const courses = await prisma.course.findMany({
      where: {
        status: "PUBLISHED"
      },
      include: {
        modules: {
          include: {
            lessons: {
              where: { isPublished: true }
            }
          }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({ courses });

  } catch (error) {
    console.error("Error fetching public courses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}