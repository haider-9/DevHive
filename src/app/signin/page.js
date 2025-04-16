'use client';
import SigninForm from '@/components/SigninForm';
import { Card, CardBody, Image } from "@heroui/react";
import { LuCoffee, LuBrain, LuRocket } from 'react-icons/lu';

export default function SigninPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4 sm:p-8 md:p-12 lg:p-20">
      <Card className="w-full max-w-5xl bg-primary/95 shadow-2xl shadow-primary overflow-hidden">
        <CardBody className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Left side - branding and info (hidden on mobile) */}
            <div className="hidden w-full flex-col justify-center p-8 md:p-12 lg:p-16 md:flex md:w-1/2">
              <Image
                src="/images/devhive-logo.png"
                alt="DevHive Logo"
                width={64}
                height={64}
                className="mb-6"
              />
              <h1 className="mb-4 text-2xl lg:text-3xl font-bold text-warning">
                Welcome Back, Developer!
              </h1>
              <p className="mb-6 text-sm lg:text-base text-foreground/80">
                Ready to dive back into the hive of innovation?
              </p>
              <ul className="space-y-3 lg:space-y-4 text-xs lg:text-sm text-foreground/70">
                <li className="flex items-center">
                  <LuCoffee className="mr-3 text-warning" />
                  Brew some code and ideas
                </li>
                <li className="flex items-center">
                  <LuBrain className="mr-3 text-warning" />
                  Engage in mind-bending tech discussions
                </li>
                <li className="flex items-center">
                  <LuRocket className="mr-3 text-warning" />
                  Propel your projects to new heights
                </li>
              </ul>
            </div>
            
            {/* Mobile branding - only visible on small screens */}
            <div className="flex flex-col items-center p-4 md:hidden">
              <Image
                src="/images/devhive-logo.png"
                alt="DevHive Logo"
                width={48}
                height={48}
                className="mb-2"
              />
              <h1 className="text-xl font-bold text-warning mb-1">
                Welcome Back!
              </h1>
              <p className="text-xs text-foreground/80 text-center mb-2">
                Ready to dive back into the hive?
              </p>
            </div>
            
            {/* Right side - form */}
            <div className="w-full py-4 sm:py-6 md:py-8 px-2 sm:px-4 md:w-1/2">
              <SigninForm />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
