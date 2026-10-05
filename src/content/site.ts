// Site-wide content: name, navigation, contact links, homepage intro, and skills
export const site = {
  name: "Aly Ahmed",
  logo: { src: "/images/site/logo.png", width: 1024, height: 1024 },
  // Both scroll to their homepage section
  nav: [
    { label: "Experience", href: "/#experience" },
    { label: "Projects", href: "/#projects" },
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
    "Mechatronics Engineering student at the University of Waterloo with an option in Artificial Intelligence. Experienced in robot software across the board. Interested in understanding how physical systems work, modelling and controlling them, as well as in perception and ML.",
};

// Keep in sync with the Skills section of resume/resume.tex
export const skills = [
  { label: "Languages", value: "C, C++, Python, Bash" },
  { label: "Frameworks & OS", value: "ROS/ROS2, FreeRTOS, QNX, Linux, OpenCV, GTSAM" },
  { label: "Tools & Architecture", value: "Git, Docker, AWS, Networking (TCP, UDP, CAN, SPI, I2C, UART)" },
  { label: "Hardware & CAD", value: "Altium Designer, SolidWorks, Fusion 360, Oscilloscopes, Soldering, Wire Harnessing" },
];
