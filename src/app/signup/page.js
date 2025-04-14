'use client';

import SignUpForm from '@/components/SignUpForm';
import { Card, CardBody, Image } from "@heroui/react";
import { LuBook, LuShare2, LuCode } from 'react-icons/lu';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-8 md:p-20">
      <Card className="w-full max-w-5xl bg-primary shadow-2xl shadow-primary">
        <CardBody className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="hidden w-full flex-col justify-center p-16 md:flex md:w-1/2">
              <Image
                src="/images/devhive-logo.png"
                alt="DevHive Logo"
                width={64}
                height={64}
                className="mb-6"
              />
              <h1 className="mb-4 text-3xl font-bold text-warning">
                Join DevHive
              </h1>
              <p className="mb-6 text-foreground/80">
                Your hub for developer insights and knowledge sharing.
              </p>
              <ul className="space-y-4 text-sm text-foreground/70">
                <li className="flex items-center">
                  <LuBook className="mr-3 text-warning" />
                  Access a wealth of developer blogs
                </li>
                <li className="flex items-center">
                  <LuShare2 className="mr-3 text-warning" />
                  Share your coding experiences
                </li>
                <li className="flex items-center">
                  <LuCode className="mr-3 text-warning" />
                  Learn from diverse programming perspectives
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/2">
              <SignUpForm />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
