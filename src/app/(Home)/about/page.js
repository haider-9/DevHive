import TeamMemberProfile from '@/components/about-page/TeamMemberProfile';
import { TEAM_MEMBERS, TECHNOLOGIES_USED } from '@/constants';
import { motion } from 'framer-motion';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-secondary/20">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-warning to-primary mb-6">
            About DevHive
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Where innovation meets collaboration in the digital landscape
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-32 flex flex-col md:flex-row items-center gap-12"
        >
          <div className="md:w-1/2">
            <div className="h-80 w-full rounded-2xl bg-gradient-to-tr from-warning/20 to-primary/20 shadow-lg flex items-center justify-center">
              <div className="w-3/4 h-3/4 rounded-xl bg-background/40 backdrop-blur-sm flex items-center justify-center p-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-4xl font-bold text-warning">Our Mission</h2>
            <p className="text-lg leading-relaxed text-foreground/90">
              We've created this platform to challenge ourselves in Next.js and backend development, preparing for the dynamic tech industry ahead. This project serves as our playground for exploring cutting-edge concepts, enhancing problem-solving skills, and staying at the forefront of web development trends.
            </p>
            <div className="pt-4">
              <a href="#team" className="px-6 py-3 bg-warning/10 hover:bg-warning/20 text-warning rounded-full font-medium transition-all inline-flex items-center gap-2">
                Learn more about us
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section 
          id="team"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-warning/80 to-primary/80 inline-block">
              Meet Our Team
            </h2>
            <div className="h-1 w-20 bg-warning/50 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-10">
            {TEAM_MEMBERS.map((person, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <TeamMemberProfile person={person} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Technologies Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="pt-10 pb-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Technologies We Used</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Our tech stack is carefully selected to provide the best performance, developer experience, and user satisfaction.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-12 gap-y-16">
            {TECHNOLOGIES_USED.map((tech, index) => (
              <motion.div 
                key={index} 
                className="group"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="flex flex-col items-center">
                  <div className="text-5xl mb-3 text-warning group-hover:text-primary transition-all duration-300">
                    {tech.icon}
                  </div>
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-warning transition-colors">
                    {tech.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;
