"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Clock, Users, Search, Filter } from "lucide-react";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  description: string;
  smallDescription: string;
  slug: string;
  level: string;
  category: string;
  price: number;
  duration: number;
  status: string;
  _count?: {
    enrollments: number;
  };
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchPublicCourses();
  }, []);

  const fetchPublicCourses = async () => {
    try {
      const response = await fetch("/api/courses/public");
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const categories = [...new Set(courses.map(course => course.category))];
  const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

  if (loading) {
    return <div className="flex justify-center p-8">Loading courses...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Discover Courses</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Learn new skills with our VeriFayda-verified educational platform
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {levels.map(level => (
              <SelectItem key={level} value={level}>
                {level.charAt(0) + level.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedLevel !== "all" || selectedCategory !== "all"
              ? "Try adjusting your filters" 
              : "Check back soon for new courses!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline">
                    {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
                  </Badge>
                  <Badge variant="secondary">{course.category}</Badge>
                </div>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {course.smallDescription}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course._count?.enrollments || 0} students</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold">
                    {course.price > 0 ? `$${course.price}` : "Free"}
                  </div>
                  <Button asChild>
                    <Link href={`/courses/${course.slug}`}>
                      Learn More
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 