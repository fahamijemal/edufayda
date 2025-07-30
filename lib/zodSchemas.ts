export const CourseStatus = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
export const CourseLevel = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
export const CourseCategory = ["Development","IT & Software" ,"Design", "Marketing", "Business", "Finance", "Health", "Lifestyle", "Education" ,"Personal Development","Teaching & Academics"] as const;
import { z } from "zod";

export const courseSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title is required and must be at least 2 characters long." })
    .max(100, { message: "Title must be less than 100 characters." }),

  description: z
    .string()
    .min(3, { message: "Description is required and must be at least 3 characters long." })
    .max(1000, { message: "Description must be less than 1000 characters." }),

  fileKey: z
    .string()
    .min(2, { message: "A valid file key is required." }),

  price: z
    .number()
    .min(1, { message: "Price must be a positive number greater than zero." }),

  duration: z
    .number()
    .int({ message: "Duration must be a whole number." })
    .min(1, { message: "Duration must be a positive integer (in minutes or hours)." }),

  level: z.enum(CourseLevel, {
    message: "Please select a valid course level (BEGINNER, INTERMEDIATE, ADVANCED).",
  }),

  category: z
    .enum(CourseCategory, {
        message: "Please select a valid course category."
    }),
  smallDescription: z
    .string()
    .min(3, { message: "Small description is required and must be at least 3 characters long." })
    .max(200, { message: "Small description must be less than 200 characters." }),

  slug: z
    .string()
    .min(3, { message: "Slug is required and must be at least 3 characters long." }),

  status: z.enum(CourseStatus, {
    message: "Please select a valid course status (DRAFT, PUBLISHED, ARCHIVED).",
  }),
});

export type courseSchemaType = z.infer<typeof courseSchema>;

// Module Schema
export const moduleSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Module title is required and must be at least 2 characters long." })
    .max(100, { message: "Module title must be less than 100 characters." }),

  description: z
    .string()
    .max(500, { message: "Module description must be less than 500 characters." })
    .optional(),

  order: z
    .number()
    .int({ message: "Order must be a whole number." })
    .min(0, { message: "Order must be a non-negative integer." }),
});

export type moduleSchemaType = z.infer<typeof moduleSchema>;

// Lesson Schema
export const lessonSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Lesson title is required and must be at least 2 characters long." })
    .max(100, { message: "Lesson title must be less than 100 characters." }),

  content: z
    .string()
    .min(10, { message: "Lesson content is required and must be at least 10 characters long." })
    .max(10000, { message: "Lesson content must be less than 10,000 characters." }),

  videoUrl: z
    .string()
    .url({ message: "Please enter a valid video URL." })
    .optional()
    .or(z.literal("")),

  duration: z
    .number()
    .int({ message: "Duration must be a whole number." })
    .min(1, { message: "Duration must be at least 1 minute." })
    .optional(),

  order: z
    .number()
    .int({ message: "Order must be a whole number." })
    .min(0, { message: "Order must be a non-negative integer." }),

  isPublished: z.boolean(), // ✅ Fixed: Removed .default() to make it explicit
});

export type lessonSchemaType = z.infer<typeof lessonSchema>;