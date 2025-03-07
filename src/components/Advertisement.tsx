
import React from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, LineChart, BarChart3, Wallet, Lock, UserPlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Advertisement: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row gap-10 items-center">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Take Control of Your <span className="text-primary">Finances</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Track expenses, monitor income, and visualize your financial journey with our intuitive dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => navigate("/login")}>
              <UserPlus className="mr-2 h-5 w-5" />
              Sign Up Now
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/login?tab=login")}>
              Already have an account? Log In
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <img
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
            alt="Person tracking finances on laptop"
            className="rounded-xl shadow-lg w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Features to <span className="text-primary">Manage Your Money</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="finance-card hover-scale">
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-center">
                <div className="p-3 bg-primary/10 rounded-full">
                  <PieChart className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Expense Tracking</h3>
              <p className="text-muted-foreground text-center">
                Categorize and monitor all your expenses in one place with intuitive interfaces.
              </p>
            </CardContent>
          </Card>
          
          <Card className="finance-card hover-scale">
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-center">
                <div className="p-3 bg-secondary/10 rounded-full">
                  <BarChart3 className="h-8 w-8 text-secondary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Income Management</h3>
              <p className="text-muted-foreground text-center">
                Track multiple income sources and understand your earning patterns.
              </p>
            </CardContent>
          </Card>
          
          <Card className="finance-card hover-scale">
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-center">
                <div className="p-3 bg-accent/10 rounded-full">
                  <LineChart className="h-8 w-8 text-accent" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Visual Reports</h3>
              <p className="text-muted-foreground text-center">
                Beautiful charts and analytics to visualize your financial health at a glance.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-10">
        <h2 className="text-3xl font-bold text-center mb-6">
          See Your <span className="text-primary">Financial Dashboard</span>
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
          Get a complete overview of your financial situation with our intuitive dashboard. Track expenses, monitor income, and make informed decisions.
        </p>
        <div className="rounded-xl overflow-hidden shadow-xl border">
          <img
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
            alt="Finance Dashboard Preview"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Testimonials/Benefits Section */}
      <section className="py-10 bg-muted/30 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Users <span className="text-primary">Love Our App</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4">
            <div className="shrink-0">
              <Wallet className="h-10 w-10 text-secondary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Save More Money</h3>
              <p className="text-muted-foreground">
                By tracking your expenses, users report saving an average of 15% more each month.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="shrink-0">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Secure Data</h3>
              <p className="text-muted-foreground">
                Your financial data stays on your device with our secure local storage approach.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="shrink-0">
              <Sparkles className="h-10 w-10 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Intuitive Design</h3>
              <p className="text-muted-foreground">
                Easy to use interface designed to make financial tracking simple and accessible.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="shrink-0">
              <PieChart className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Detailed Reports</h3>
              <p className="text-muted-foreground">
                Gain insights into your spending patterns with customizable charts and reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-10 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Your <span className="text-primary">Financial Journey</span>?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of users who have transformed their financial habits with our tracking tools.
        </p>
        <Button size="lg" onClick={() => navigate("/login")} className="px-8">
          <UserPlus className="mr-2 h-5 w-5" />
          Create Your Free Account
        </Button>
      </section>
    </div>
  );
};

export default Advertisement;
