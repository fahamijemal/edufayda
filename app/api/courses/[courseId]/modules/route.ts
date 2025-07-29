import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { moduleSchema } from "@/lib/zodSchemas";

export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
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

    const { courseId } = params;

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

    // Get all modules for the course with lessons count
    const modules = await prisma.module.findMany({
      where: { courseId },
      include: {
        _count: {
          select: { lessons: true }
        }
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ modules });

  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
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

    const { courseId } = params;

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

    // Parse and validate request body
    const body = await req.json();
    
    // If order is not provided, set it to the next available order
    if (body.order === undefined) {
      const maxOrder = await prisma.module.findFirst({
        where: { courseId },
        orderBy: { order: "desc" },
        select: { order: true }
      });
      body.order = (maxOrder?.order ?? -1) + 1;
    }

    const validatedData = moduleSchema.parse(body);

    // Create the module
    const module = await prisma.module.create({
      data: {
        ...validatedData,
        courseId,
      },
      include: {
        _count: {
          select: { lessons: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      module,
      message: "Module created successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Module creation error:", error);
    
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