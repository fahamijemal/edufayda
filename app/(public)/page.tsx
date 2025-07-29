"use client"
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
// Removed unused import
import { toast } from "sonner";
interface featureProps{

}
const features=[
  {
    title: "VeriFayda-Verified Enrollment",
    description: "Instant course enrollment using your Ethiopian National Digital ID. No fake registrations, only verified students.",
    icon: "🔐"
  },
  {
    title: "Government-Backed Credentials",
    description: "Earn tamper-proof certificates linked to your national identity. Your achievements are secure and verifiable.",
    icon: "🏛️"
  },
  {
    title: "Fraud-Free Learning",
    description: "Zero document fraud with blockchain-secured academic records. Your education journey is completely transparent.",
    icon: "🛡️"
  },
  {
    title: "Inclusive Access",
    description: "Rural and urban students unite on one platform. Geographic barriers eliminated through digital identity verification.",
    icon: "🌍"
  }
]

export default function Home() {
  const { data: session} = authClient.useSession() 
  return (
    <>
    <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
            <Badge variant="outline">VeriFayda-Powered Education Platform</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Trusted Learning for Every Ethiopian</h1>
            <p className="max-w-[700px] text-muted-foreground text-xl">Transform Ethiopian education with EduFayda - the first VeriFayda-integrated Learning Management System. Experience instant enrollment, fraud-free credentials, and inclusive access to quality education for every Ethiopian, everywhere.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link 
             href="/courses" 
             className={buttonVariants({
              size:"lg",
            })}
             >
             Explore Courses
            </Link>
            <Link 
             href="/login" 
             className={buttonVariants({
              size:"lg",
              variant: "outline",
              })}>
             Sign in
            </Link>
        </div>
    </section>
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-">
      {features.map((feature, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="text-4xl mb-4">{feature.icon}</div>
            <CardTitle>{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </section>
    </>
  );
}
