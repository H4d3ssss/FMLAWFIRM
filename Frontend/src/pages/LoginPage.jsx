import React from "react";
import { LoginForm, Footer } from "../components";
import bgImage from "../assets/bg.jpeg"; // Import the image

function LoginPage() {
  return (
    <div className=" min-h-screen">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      />

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 backdrop-brightness-50 z-10"></div>

      {/* Main Content */}
      <main className="relative z-20 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md mx-auto px-4">
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LoginPage;
