import Image from 'next/image';
import Link from 'next/link';
import { Card, CardBody, Button, Tooltip } from "@heroui/react";
import { LuGithub, LuLinkedin, LuGlobe } from 'react-icons/lu';

const TeamMemberProfile = ({ person }) => {
  return (
    <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/3 bg-gradient-to-r from-warning/10 dark:from-warning/20 to-danger/10 p-6 flex items-center justify-center">
          <div className="relative w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56">
            <img
              src={person.image}
              alt={`Profile picture of ${person.name}`}
              fill
              className="rounded-full object-cover border-4 border-background"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>

        {/* Content Section */}
        <CardBody className="md:w-2/3 p-4 md:p-6 space-y-4">
          {/* Header with Name and Social Links */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-warning">{person.name}</h2>
              <p className="text-sm md:text-base font-medium text-foreground/80">{person.role}</p>
            </div>
            
            <div className="flex gap-3 justify-start sm:justify-end">
              {person.github && (
                <Link href={person.github} aria-label={`${person.name}'s GitHub`} target="_blank" rel="noopener noreferrer">
                  <LuGithub size={20} className="text-foreground hover:text-warning transition-colors" />
                </Link>
              )}
              {person.linkedin && (
                <Link href={person.linkedin} aria-label={`${person.name}'s LinkedIn`} target="_blank" rel="noopener noreferrer">
                  <LuLinkedin size={20} className="text-info hover:text-warning transition-colors" />
                </Link>
              )}
              {person.portfolio && (
                <Link href={person.portfolio} aria-label={`${person.name}'s Portfolio`} target="_blank" rel="noopener noreferrer">
                  <LuGlobe size={20} className="text-foreground hover:text-warning transition-colors" />
                </Link>
              )}
            </div>
          </div>

          {/* About Section */}
          <p className="text-foreground text-pretty text-sm md:text-base leading-relaxed">
            {person.about}
          </p>

          {/* Skills Section */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {person.skills?.map((skill, index) => (
                <Tooltip 
                  key={index} 
                  content={skill.name} 
                  placement="bottom" 
                  color="warning" 
                  className="text-primary"
                >
                  <Button 
                    isIconOnly 
                    variant="light" 
                    className="p-2 rounded-full hover:bg-warning/20 text-xl md:text-2xl transition-all"
                    aria-label={skill.name}
                  >
                    {skill.Icon}
                  </Button>
                </Tooltip>
              ))}
            </div>
          </div>
        </CardBody>
      </div>
    </Card>
  );
};

export default TeamMemberProfile;