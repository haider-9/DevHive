import { FaReact, FaNodeJs } from 'react-icons/fa';
import { SiAppwrite, SiMongodb, SiExpress, SiNextdotjs, SiAdobexd } from 'react-icons/si';
import { RiNextjsFill, RiUserSearchLine } from "react-icons/ri";
import { LuFigma } from 'react-icons/lu';
import { MdDesignServices } from 'react-icons/md';

export const HUMOR_LINE_SWITCH_INTERVAL = 8000; // 8 seconds

export const SIGNUP_HUMOR_LINES = [
    "Join us and turn your 404 life into a 200 OK!",
    "Sign up now and let's git commit to your future!",
    "Ready to push your limits? Pull yourself into our community!",
    "Don't be null, be a part of something greater!",
    "Join now and let's debug your social life!",
    "Time to upgrade your life from version 0.1 to 1.0!",
    "Sign up and let's compile a great future together!",
    "Stop being a lone programmer, join our array of developers!",
    "Escape the infinite loop of loneliness, join our community!",
    "sudo apt-get install awesome-developer-community",
    "while (!registered) { signUp(); }",
    "Break out of your shell and bash into our world!",
    "Don't float alone, join our string of developers!",
    "Error 404: Social life not found. Solution: Sign up here!",
    "Join now and increase your happiness by 127.0.0.1%",
    "console.log('Welcome to the best dev community!')",
];

export const SIGNIN_HUMOR_LINES = [
    "Welcome back, code whisperer!",
    "Ready to decrypt your day?",
    "Time to sudo your way back in!",
    "Initiating login sequence...",
    "Authenticating awesome developer...",
    "Buffering brilliance...",
    "Loading your code sanctuary...",
    "Syncing with the matrix...",
    "Defragmenting your digital existence...",
    "Reticulating splines of your codebase...",
    "Initializing your dev environment...",
    "Bypassing the firewall of mediocrity...",
    "Optimizing your algorithm for success...",
    "Reconnecting to the DevHive mainframe...",
    "Dusting off your virtual keyboard...",
    "Warming up your coding fingers...",
    "Preparing to unleash your inner geek...",
    "Rebooting your developer superpowers...",
];


export const TECHNOLOGIES_USED = [
    { name: 'Next.js', icon: <RiNextjsFill size={48} className='text-foreground' /> },
    { name: 'Appwrite', icon: <SiAppwrite size={48} className='text-[#fd366e]' /> },
    { name: 'React', icon: <FaReact size={48} className='text-blue-400' /> },
    { name: 'Node.js', icon: <FaNodeJs size={48} className='text-green-600' /> },
  ];
  
export const TEAM_MEMBERS = [
    {
      name: 'Sharoon Shaleem',
      role: 'Full Stack Developer',
      about: 'Experienced full-stack developer with a passion for creating efficient, scalable web applications. Specializes in modern JavaScript frameworks and cloud technologies.',
      linkedin: 'https://www.linkedin.com/in/sharoon-shaleem-0a7a85226/',
      github: 'https://github.com/Sharoon166',
      portfolio: 'https://sharoon.vercel.app',
      image: 'https://github.com/Sharoon166.png',
      skills: [
        { name: 'MongoDB', Icon: <SiMongodb className="text-green-500" /> },
        { name: 'Express', Icon: <SiExpress className="text-foreground" /> },
        { name: 'React', Icon: <FaReact className="text-blue-400" /> },
        { name: 'Node.js', Icon: <FaNodeJs className="text-green-600" /> },
        { name: 'Next.js', Icon: <SiNextdotjs className="text-foregound" /> },
      ],
    },
    {
      name: 'Raja Zubair',
      role: 'UI/UX Designer',
      about: 'Creative UI/UX designer focused on crafting intuitive and visually appealing user interfaces. Skilled in user research, wireframing, and prototyping.',
      linkedin: 'https://www.linkedin.com/in/raja-zubair-664066294',
      github: 'https://github.com/RajaZubair573',
      portfolio: 'https://rajazubair.vercel.app/',
      image: 'https://github.com/RajaZubair573.png',
      skills: [
        { name: 'Figma', Icon: <LuFigma className="text-foreground " /> },
        { name: 'UI Design', Icon: <MdDesignServices className="text-info" /> },
        { name: 'UX Research', Icon: <RiUserSearchLine className="text-violet-500" /> },
        { name: 'Prototyping', Icon: <MdDesignServices className="text-purple-500" /> },
        { name: 'Adobe XD', Icon: <SiAdobexd className="text-danger" /> },
      ],
    },
    {
      name: 'Haider Ahmad',
      role: 'Full Stack Developer',
      about: 'Versatile full-stack developer with expertise in building robust web applications. Proficient in both front-end and back-end technologies, with a focus on creating seamless user experiences.',
      linkedin: 'https://www.linkedin.com/in/haider-ahmad-439317164/',
      github: 'https://github.com/haider-9',
      portfolio: 'https://haiderahmad.vercel.app/',
      image: 'https://github.com/haider-9.png',
      skills: [
        { name: 'MongoDB', Icon: <SiMongodb className="text-green-500" /> },
        { name: 'Express', Icon: <SiExpress className="text-foreground" /> },
        { name: 'React', Icon: <FaReact className="text-blue-400" /> },
        { name: 'Node.js', Icon: <FaNodeJs className="text-green-600" /> },
        { name: 'Next.js', Icon: <SiNextdotjs className="text-foreground" /> },
      ],
    },
  ];