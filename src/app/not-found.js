'use client';
import Link from 'next/link';
import { LuCompass, LuWifi, LuCpu, LuBug } from 'react-icons/lu';

export default function NotFound() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">
        <div
          className="glitch mb-6 text-8xl font-bold text-warning"
          data-text="404"
        >
          404
        </div>
        <h1 className="mb-4 text-center text-3xl font-semibold">
          Oops! You've stumbled into the digital void
        </h1>
        <p className="mb-8 text-center text-xl">
          Our AI couldn't compute this page's existence.
        </p>
        <div className="mb-8 flex items-center justify-center space-x-8">
          <LuWifi className="animate-pulse text-5xl text-info" />
          <LuCpu className="animate-bounce text-5xl text-success" />
          <LuBug className="animate-spin text-5xl text-danger" />
        </div>
        <p className="mb-8 text-center text-lg">
          Even with our advanced algorithms, we're as lost as a certain
          green-haired navigator...
        </p>
        <div className="group relative">
          <div className="animate-tilt absolute -inset-0.5 rounded-lg bg-gradient-to-r from-warning to-info opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
          <Link
            href="/"
            className="relative rounded-lg bg-background px-6 py-3 text-foreground transition-colors duration-300 group-hover:text-warning"
          >
            Teleport Back to Homepage
          </Link>
        </div>
      </div>

      <style jsx global>
        {`
          .glitch {
            position: relative;
          }
          .glitch::before,
          .glitch::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          .glitch::before {
            left: 2px;
            text-shadow: -2px 0 #ff00c1;
            clip: rect(44px, 450px, 56px, 0);
            animation: glitch-anim 5s infinite linear alternate-reverse;
          }
          .glitch::after {
            left: -2px;
            text-shadow:
              -2px 0 #00fff9,
              2px 2px #ff00c1;
            animation: glitch-anim2 1s infinite linear alternate-reverse;
          }
          @keyframes glitch-anim {
            0% {
              clip: rect(31px, 9999px, 94px, 0);
            }
            4.166666667% {
              clip: rect(91px, 9999px, 43px, 0);
            }
            8.333333333% {
              clip: rect(65px, 9999px, 59px, 0);
            }
            12.5% {
              clip: rect(30px, 9999px, 67px, 0);
            }
            16.66666667% {
              clip: rect(75px, 9999px, 67px, 0);
            }
            20.83333333% {
              clip: rect(82px, 9999px, 54px, 0);
            }
            25% {
              clip: rect(93px, 9999px, 91px, 0);
            }
            29.16666667% {
              clip: rect(2px, 9999px, 24px, 0);
            }
            33.33333333% {
              clip: rect(16px, 9999px, 69px, 0);
            }
            37.5% {
              clip: rect(70px, 9999px, 5px, 0);
            }
            41.66666667% {
              clip: rect(80px, 9999px, 58px, 0);
            }
            45.83333333% {
              clip: rect(25px, 9999px, 31px, 0);
            }
            50% {
              clip: rect(88px, 9999px, 40px, 0);
            }
            54.16666667% {
              clip: rect(62px, 9999px, 87px, 0);
            }
            58.33333333% {
              clip: rect(68px, 9999px, 4px, 0);
            }
            62.5% {
              clip: rect(15px, 9999px, 56px, 0);
            }
            66.66666667% {
              clip: rect(68px, 9999px, 93px, 0);
            }
            70.83333333% {
              clip: rect(89px, 9999px, 67px, 0);
            }
            75% {
              clip: rect(76px, 9999px, 91px, 0);
            }
            79.16666667% {
              clip: rect(44px, 9999px, 35px, 0);
            }
            83.33333333% {
              clip: rect(41px, 9999px, 74px, 0);
            }
            87.5% {
              clip: rect(37px, 9999px, 52px, 0);
            }
            91.66666667% {
              clip: rect(83px, 9999px, 38px, 0);
            }
            95.83333333% {
              clip: rect(35px, 9999px, 68px, 0);
            }
            100% {
              clip: rect(92px, 9999px, 70px, 0);
            }
          }
          @keyframes glitch-anim2 {
            0% {
              clip: rect(65px, 9999px, 100px, 0);
            }
            100% {
              clip: rect(48px, 9999px, 30px, 0);
            }
          }
          @keyframes tilt {
            0%,
            50%,
            100% {
              transform: rotate(0deg);
            }
            25% {
              transform: rotate(0.5deg);
            }
            75% {
              transform: rotate(-0.5deg);
            }
          }
        `}
      </style>
    </>
  );
}
