"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/context/AuthContext";
import { toast } from "sonner";

const EDUCATION_LEVELS = [
  { value: "school-9-10", label: "Class 9-10" },
  { value: "school-11-12", label: "Class 11-12" },
  { value: "undergraduate", label: "Undergraduate (Bachelor's)" },
  { value: "postgraduate", label: "Postgraduate (Master's)" },
  { value: "phd", label: "PhD / Doctoral" },
];

const STREAMS = {
  "school-9-10": [
    { value: "science", label: "Science" },
    { value: "all", label: "All Subjects" },
  ],
  "school-11-12": [
    { value: "science", label: "Science (PCM/PCB)" },
    { value: "commerce", label: "Commerce" },
    { value: "arts", label: "Arts/Humanities" },
  ],
  undergraduate: [
    { value: "engineering", label: "Engineering" },
    { value: "medical", label: "Medical (MBBS/BDS/Nursing)" },
    { value: "science", label: "B.Sc (Physics/Chemistry/Biology)" },
    { value: "commerce", label: "B.Com / CA" },
    { value: "arts", label: "BA (Arts/Humanities)" },
    { value: "law", label: "LLB (Law)" },
    { value: "management", label: "BBA / Management" },
  ],
  postgraduate: [
    { value: "mtech", label: "M.Tech / MS" },
    { value: "msc", label: "M.Sc" },
    { value: "mba", label: "MBA" },
    { value: "mcom", label: "M.Com" },
    { value: "ma", label: "MA" },
    { value: "llm", label: "LLM" },
  ],
  phd: [
    { value: "science", label: "Science & Technology" },
    { value: "engineering", label: "Engineering" },
    { value: "medical", label: "Medical Science" },
    { value: "social", label: "Social Sciences" },
    { value: "law", label: "Law" },
  ],
};

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    educationLevel: "",
    stream: "",
    course: "",
    language: "english",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully!");
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Education Level</Label>
              <Select
                value={formData.educationLevel}
                onValueChange={(value) => setFormData({ ...formData, educationLevel: value, stream: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your education level" />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.educationLevel && (
              <div className="space-y-2">
                <Label>Stream / Field</Label>
                <Select
                  value={formData.stream}
                  onValueChange={(value) => setFormData({ ...formData, stream: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your stream" />
                  </SelectTrigger>
                  <SelectContent>
                    {STREAMS[formData.educationLevel as keyof typeof STREAMS]?.map((stream) => (
                      <SelectItem key={stream.value} value={stream.value}>
                        {stream.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.stream && (
              <div className="space-y-2">
                <Label htmlFor="course">Specific Course (Optional)</Label>
                <Input
                  id="course"
                  placeholder="e.g., Computer Science, Mechanical Engineering"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Preferred Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="gujarati">ગુજરાતી (Gujarati)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-muted p-4 space-y-2">
              <h4 className="font-semibold">Summary</h4>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Level:</strong> {EDUCATION_LEVELS.find(l => l.value === formData.educationLevel)?.label}</p>
                {formData.stream && (
                  <p><strong>Stream:</strong> {STREAMS[formData.educationLevel as keyof typeof STREAMS]?.find(s => s.value === formData.stream)?.label}</p>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="border-0 shadow-2xl">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600">
            <span className="text-white font-bold text-3xl">L</span>
          </div>
        </div>
        <CardTitle className="text-3xl text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Step {step} of 3
        </CardDescription>
      </CardHeader>

      {/* Step Indicator */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  s < step
                    ? "bg-primary border-primary text-primary-foreground"
                    : s === step
                    ? "border-primary text-primary"
                    : "border-muted text-muted-foreground"
                )}
              >
                {s < step ? <CheckCircle2 className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={cn(
                    "h-0.5 w-16 mx-2 transition-colors",
                    s < step ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <CardContent>{renderStep()}</CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="flex gap-2 w-full">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              className={cn(
                "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
                step === 1 ? "w-full" : "flex-1"
              )}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {step === 3 ? "Create Account" : "Continue"}
            </Button>
          </div>

          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
