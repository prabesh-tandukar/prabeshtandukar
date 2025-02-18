export interface PortfolioData {
  name: string;
  title: string;
  level: string;
  about: string;
  skills: {
    name: string;
    level: number;
  }[];
  projects: {
    title: string;
    description: string;
    tech: string[];
    link: string;
    xp: number;
  }[];
  education: {
    degree: string;
    school: string;
    year: string;
    achievements: string[];
  };
}
