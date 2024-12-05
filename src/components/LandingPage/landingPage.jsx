import React from "react";
import LoginForm from "./loginForm";

export default function LandingPage() {
  return (
    <div className="landingpage-wrapper h-dvh flex flex-row">
      <div className="w-1/2 bg-primary p-8 flex flex-col justify-between">
        <div>
          <p className="font-bold text-3xl text-white">Sun Homeocare</p>
          <p className="font-light text-base text-white">A Multi speciality & Advanced Homeo clinic</p>
        </div>
        <div>
          <p className="font-bold text-xl text-white">"The Best Possible & Trusted Care"</p>
        </div>
      </div>
      <div className="w-1/2 flex justify-center items-center">
        <div className="w-1/2 bg-background flex flex-col gap-y-4">
          <div className="flex justify-center">
            <p className="text-foreground font-bold text-2xl">Sign In</p>
          </div>
          <div className="flex justify-center">
            <p className="text-foreground font-light text-center">Enter your username and password to log in</p>
          </div>

          <LoginForm />

          <div className="mt-12">
            <p className="text-sm font-extralight text-center">By clicking SignIn, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
