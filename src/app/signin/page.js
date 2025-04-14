'use client';
import SigninForm from '@/components/SigninForm';
import { Card, CardBody, Image } from "@heroui/react";
import { LuCoffee, LuBrain, LuRocket } from 'react-icons/lu';

export default function SigninPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-20">
      <Card className="w-full max-w-5xl bg-primary/95 shadow-2xl shadow-primary">
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
                Welcome Back, Developer!
              </h1>
              <p className="mb-6 text-foreground/80">
                Ready to dive back into the hive of innovation?
              </p>
              <ul className="space-y-4 text-sm text-foreground/70">
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
            <div className="w-full py-8 px-4 md:w-1/2">
              <SigninForm />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
