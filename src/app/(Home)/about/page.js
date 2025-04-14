import { account } from '@/appwrite';
import TeamMemberProfile from '@/components/about-page/TeamMemberProfile';
import { TEAM_MEMBERS, TECHNOLOGIES_USED } from '@/constants';



const AboutPage = () => {
  return (
    <div className="min-h-screen px-14 py-10 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 py-16 space-y-8 text-foreground">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-warning">Our Mission</h2>
          <p className='text-lg leading-relaxed text-balance max-w-3xl'>
            We've created this platform to challenge ourselves in Next.js and backend development, preparing for the dynamic tech industry ahead. This project serves as our playground for exploring cutting-edge concepts, enhancing problem-solving skills, and staying at the forefront of web development trends.
          </p>
        </div>

        <div className='space-y-4'>
          <h1 className="text-5xl font-bold text-warning/80">
            Meet Our Team
          </h1>

          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
            {TEAM_MEMBERS.map((person, index) => (
              <div key={index}>
                <TeamMemberProfile person={person} />
              </div>
            ))}
          </div>
        </div>

        <div className='space-y-6'>
          <h2 className="text-3xl font-semibold">Technologies We Used</h2>
          <div className="flex flex-wrap justify-center gap-10">
            {TECHNOLOGIES_USED.map((tech, index) => (
              <div key={index} className="group">
                <div className="flex flex-col items-center transition-all duration-300 transform hover:scale-110">
                  <div className="text-4xl mb-2 text-warning group-hover:text-primary">
                    {tech.icon}
                  </div>
                  <span className="text-sm font-medium text-foreground group-hover:text-warning transition-colors">
                    {tech.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;