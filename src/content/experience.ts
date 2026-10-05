// Work experience shown on the homepage, newest first. Keep roles and dates in sync with resume/resume.tex.
// `slug` means there's a write-up at src/content/experience/<slug>.mdx (shown at /experience/<slug>).
// `relatedHref` links the row somewhere else instead, e.g. a project page about that work.
export type Job = {
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  dates: string;
  summary: string;
  stack: string[];
  slug?: string;
  relatedHref?: string;
};

export const jobs: Job[] = [
  {
    role: "Robotics Software Engineer",
    company: "Red Rabbit Robotics",
    companyUrl: "https://www.redrabbitrobotics.ai",
    location: "Burnaby, BC",
    dates: "Jan 2026 – Aug 2026",
    summary:
      "Core software for a robot built from scratch: actuator control libraries, vision and calibration, teleoperation, and Bayesian-optimized PID tuning. The robot was demoed to customers across the U.S.",
    stack: ["C++", "Python", "ROS2", "Computer Vision", "Controls"],
    slug: "red-rabbit-robotics",
  },
  {
    role: "Robotics Research Assistant",
    company: "Active & Interactive Robotics Lab, University of Waterloo",
    companyUrl: "https://uwaterloo.ca/active-and-interactive-robotics-lab/",
    location: "Waterloo, ON",
    dates: "Sep 2025 – Dec 2025",
    summary: "Explored methods for implementing impedance control on PAL Robotics' TIAGo Pro.",
    stack: ["Impedance Control"],
  },
  {
    role: "Robotics Perception and Control R&D",
    company: "Robotic Interaction, Perception and Learning Lab, University of Waterloo",
    companyUrl: "https://www.ripl-lab.com/home",
    location: "Waterloo, ON",
    dates: "May 2025 – Aug 2025",
    summary:
      "Factor-graph (GTSAM) estimation of how articulated and flexible objects move, plus joint and Cartesian impedance control with time-optimal trajectory tracking on a Franka Emika Panda.",
    stack: ["C++", "Python", "ROS2", "GTSAM", "Eigen"],
    relatedHref: "/projects/articulation-estimation",
  },
  {
    role: "Platform Software Developer",
    company: "Ford Motor Company",
    location: "Kanata, ON",
    dates: "Sep 2024 – Dec 2024",
    summary: "Embedded cryptography improvements: resolved 1000+ code issues and added unit tests with Google Test.",
    stack: ["C++", "Google Test"],
  },
  {
    role: "Software Test Developer",
    company: "BlackBerry QNX",
    location: "Kanata, ON",
    dates: "Jan 2024 – Apr 2024",
    summary:
      "Automated and manual testing on Qualcomm, Bosch, and NXP ECUs running QNX and Android Automotive, supporting proof-of-concept demos for OEMs like Nissan and Ford.",
    stack: ["QNX", "Android Automotive", "Testing"],
  },
];
