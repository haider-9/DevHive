import Image from 'next/image';
import Link from 'next/link';
import { Card, CardBody, Button, Tooltip } from "@heroui/react";
import { LuGithub, LuLinkedin, LuGlobe } from 'react-icons/lu';

const TeamMemberProfile = ({ person }) => {
  return (
    <Card className="w-full">
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/3 bg-gradient-to-r from-warning dark:from-warning/20 to-danger p-6 flex items-center justify-center">
        <Image
          width={350}
          height={350}
          src={person.image}
          alt={person.name}
          className="rounded-full max-w-40 aspect-square border-4 border-background object-cover"
        />
      </div>
      <CardBody className="md:w-2/3 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-warning">{person.name}</h2>
            <p className="text-sm font-medium text-foreground">{person.role}</p>
          </div>
          <div className="flex gap-4">
            <Link href={person.github} isExternal target='_blank'>
              <LuGithub size={24} className="text-foreground hover:text-warning" />
            </Link>
            <Link href={person.linkedin} isExternal target='_blank'>
              <LuLinkedin size={24} className="text-info hover:text-warning" />
            </Link>
            <Link href={person.portfolio} isExternal target='_blank'>
              <LuGlobe size={24} className="text-foreground hover:text-warning" />
            </Link>
          </div>
        </div>
        <p className="text-foreground text-balance">{person.about}</p>
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {person.skills.map((skill, index) => (
              <Tooltip key={index} content={skill.name} placement="bottom" color="warning" className='text-primary'>
                <Button isIconOnly variant="light" className="p-2 rounded-full hover:bg-warning text-3xl">
                  {skill.Icon}
                </Button>
              </Tooltip>
            ))}
          </div>
        </div>
      </CardBody>
    </div>
  </Card>
  )
}

export default TeamMemberProfile