// Site-wide content: name, navigation, contact links, homepage intro, and skills
export const site = {
  name: "Aly Ahmed",
  logo: { src: "/images/site/logo.png", width: 1024, height: 1024 },
  // Both scroll to their homepage section; `activePrefix` highlights the item on that section's detail pages
  nav: [
    { label: "Experience", href: "/#experience", activePrefix: "/experience" },
    { label: "Projects", href: "/#projects", activePrefix: "/projects" },
  ],
  resume: { label: "resume", href: "/resume.pdf" },
  email: { label: "email", href: "mailto:anwaahme@uwaterloo.ca" },
  github: "https://github.com/alynader001",
  linkedin: "https://www.linkedin.com/in/aly-nwa-ahmed/",
};

export const hero = {
  firstName: "Aly",
  lastName: "Ahmed",
  tagLine: "Mechatronics Engineer",
  intro:
    "Mechatronics Engineering student at the University of Waterloo (AI option) with hands-on experience in robot control, vision, and perception. I'm especially interested in modelling systems, from robot dynamics to the objects robots interact with, and turning those models into software that runs on real hardware.",
};

// Keep in sync with the Skills section of resume/resume.tex
export const skills = [
  { label: "Languages", value: "C, C++, Python, Bash" },
  { label: "Frameworks & OS", value: "ROS/ROS2, FreeRTOS, QNX, Linux, OpenCV, GTSAM" },
  { label: "Tools & Architecture", value: "Git, Docker, AWS, Networking (TCP, UDP, CAN, SPI, I2C, UART)" },
  { label: "Hardware & CAD", value: "Altium Designer, SolidWorks, Fusion 360, Oscilloscopes, Soldering, Wire Harnessing" },
];
