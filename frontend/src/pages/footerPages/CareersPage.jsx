import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronDown, Zap, Coffee, Heart } from "lucide-react";

const CareersPage = () => {
  const [filter, setFilter] = useState("");
  const [expandedJob, setExpandedJob] = useState(null);
  const [animatedHeader, setAnimatedHeader] = useState(false);
  const openPositionsRef = useRef(null);

  useEffect(() => {
    setAnimatedHeader(true);
  }, []);

  const scrollToOpenPositions = () => {
    openPositionsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const jobOpenings = [
    {
      title: "Software Engineer",
      location: "Istanbul, Turkey",
      type: "Full-Time",
      description: "Develop and maintain scalable software solutions.",
      requirements: [
        "3+ years of experience in software development",
        "Proficiency in React and Node.js",
        "Strong problem-solving skills",
      ],
    },
    {
      title: "Product Manager",
      location: "Remote",
      type: "Full-Time",
      description:
        "Lead cross-functional teams to deliver outstanding products.",
      requirements: [
        "5+ years of product management experience",
        "Excellent communication and leadership skills",
        "Experience with agile methodologies",
      ],
    },
    {
      title: "Marketing Specialist",
      location: "Ankara, Turkey",
      type: "Part-Time",
      description:
        "Develop and execute marketing strategies to grow brand awareness.",
      requirements: [
        "3+ years of experience in digital marketing",
        "Proficiency in social media management and content creation",
        "Strong analytical skills",
      ],
    },
    {
      title: "UX/UI Designer",
      location: "Istanbul, Turkey",
      type: "Full-Time",
      description:
        "Create intuitive and visually appealing user interfaces for our products.",
      requirements: [
        "4+ years of experience in UX/UI design",
        "Proficiency in design tools like Figma and Adobe Creative Suite",
        "Strong portfolio demonstrating user-centered design approach",
      ],
    },
    {
      title: "Data Scientist",
      location: "Remote",
      type: "Full-Time",
      description:
        "Analyze large datasets to derive meaningful insights and drive decision-making.",
      requirements: [
        "3+ years of experience in data science or analytics",
        "Proficiency in Python, R, and SQL",
        "Experience with machine learning and statistical models",
      ],
    },
    {
      title: "Customer Support Specialist",
      location: "Istanbul, Turkey",
      type: "Part-Time",
      description:
        "Assist customers with inquiries and ensure a high level of satisfaction.",
      requirements: [
        "2+ years of experience in customer service",
        "Excellent communication and problem-solving skills",
        "Proficiency in English and Turkish",
      ],
    },
  ];

  const filteredJobs = jobOpenings.filter(
    (job) =>
      job.title.toLowerCase().includes(filter.toLowerCase()) ||
      job.location.toLowerCase().includes(filter.toLowerCase()) ||
      job.type.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
      <div className="container mx-auto px-6">
        <Header
          scrollToOpenPositions={scrollToOpenPositions}
          animatedHeader={animatedHeader}
        />
        <WhyWorkWithUs />
        <JobSearch filter={filter} setFilter={setFilter} />
        <OpenPositions
          ref={openPositionsRef}
          jobs={filteredJobs}
          expandedJob={expandedJob}
          setExpandedJob={setExpandedJob}
        />
        <TeamTestimonials />
        <CallToAction scrollToOpenPositions={scrollToOpenPositions} />
      </div>
    </div>
  );
};

const Header = ({ scrollToOpenPositions, animatedHeader }) => (
  <header
    className={`text-center mb-16 transition-all duration-1000 ease-in-out ${
      animatedHeader
        ? "opacity-100 transform translate-y-0"
        : "opacity-0 transform -translate-y-10"
    }`}
  >
    <h1 className="text-5xl font-bold text-[#65aa92] mb-4">
      Join Our Team at Chapter 0
    </h1>
    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
      Be part of a passionate team shaping the future of books and knowledge.
      Discover your next career opportunity with us.
    </p>
    <div className="mt-8">
      <button
        onClick={scrollToOpenPositions}
        className="bg-[#65aa92] text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#4a886e] transition-colors duration-300 shadow-lg hover:shadow-xl"
      >
        Explore Opportunities
      </button>
    </div>
  </header>
);

const WhyWorkWithUs = () => (
  <section className="mb-16">
    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
      Why Work With Us?
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <FeatureCard
        icon={<Zap className="h-10 w-10 text-[#65aa92]" />}
        title="Growth Opportunities"
        description="Develop your skills and grow your career in a supportive environment."
      />
      <FeatureCard
        icon={<Coffee className="h-10 w-10 text-[#65aa92]" />}
        title="Work-Life Balance"
        description="We prioritize flexibility and a balanced work environment."
      />
      <FeatureCard
        icon={<Heart className="h-10 w-10 text-[#65aa92]" />}
        title="Inclusive Culture"
        description="Join a diverse team where every voice is valued and respected."
      />
    </div>
  </section>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex items-center justify-center mb-4 bg-[#e6f3f0] w-20 h-20 rounded-full mx-auto">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const JobSearch = ({ filter, setFilter }) => (
  <div className="mb-8 relative">
    <input
      type="text"
      placeholder="Search for jobs..."
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      className="w-full max-w-md mx-auto p-3 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#65aa92] transition-all duration-300"
    />
  </div>
);

const OpenPositions = React.forwardRef(
  ({ jobs, expandedJob, setExpandedJob }, ref) => (
    <section className="mb-16" ref={ref}>
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Open Positions
      </h2>
      {jobs.map((job, index) => (
        <JobCard
          key={index}
          job={job}
          isExpanded={expandedJob === index}
          onToggle={() => setExpandedJob(expandedJob === index ? null : index)}
        />
      ))}
    </section>
  )
);

const JobCard = ({ job, isExpanded, onToggle }) => (
  <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden transition-all duration-300 hover:shadow-lg">
    <div className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-[#65aa92]">{job.title}</h3>
          <p className="text-gray-600">
            <strong>Location:</strong> {job.location} | <strong>Type:</strong>{" "}
            {job.type}
          </p>
        </div>
        <button
          onClick={onToggle}
          className="text-[#65aa92] hover:text-[#4a886e] focus:outline-none transition-colors duration-300"
        >
          <ChevronDown
            className={`w-6 h-6 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
      <p className="mt-2 text-gray-700">{job.description}</p>
      <div
        className={`mt-4 overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-96" : "max-h-0"
        }`}
      >
        <h4 className="font-bold mb-2">Requirements:</h4>
        <ul className="list-disc list-inside text-gray-700">
          {job.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
        <button className="mt-4 px-6 py-2 bg-[#65aa92] text-white rounded-full hover:bg-[#4a886e] transition-colors duration-300 flex items-center shadow-md hover:shadow-lg">
          Apply Now <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

const TeamTestimonials = () => (
  <section className="mt-16 mb-16">
    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
      Meet Our Team
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <TestimonialCard
        name="Arda Çulhacı"
        role="Scrum Master"
        quote="Leading this dynamic team as Scrum Master has been a rewarding experience."
      />
      <TestimonialCard
        name="Baran Özcan"
        role="Product Owner"
        quote="I ensure we prioritize our goals effectively to deliver the best results."
      />
      <TestimonialCard
        name="Hüseyin Samed Dağcı"
        role="Lead Developer"
        quote="Driving technical excellence and solving challenges are my passions."
      />
      <TestimonialCard
        name="İlayda Kaytaran"
        role="QA Engineer"
        quote="My focus is on maintaining quality and ensuring user satisfaction."
      />
      <TestimonialCard
        name="Zeynep Şahin"
        role="UX Designer"
        quote="Designing user-friendly experiences inspires me every day."
      />
      <TestimonialCard
        name="Mehmet Hakan Özgül"
        role="Junior Developer"
        quote="I'm constantly learning and contributing to our innovative projects."
      />
    </div>
  </section>
);

const TestimonialCard = ({ name, role, quote }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F06292",
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div
        className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold transition-all duration-300 hover:scale-110"
        style={{ backgroundColor: randomColor }}
      >
        {initials}
      </div>
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-gray-600 mb-4">{role}</p>
      <p className="italic text-gray-700">"{quote}"</p>
    </div>
  );
};

const CallToAction = ({ scrollToOpenPositions }) => (
  <section className="bg-[#65aa92] text-white py-16 px-4 rounded-lg shadow-xl">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4">Ready to Join Our Team?</h2>
      <p className="text-xl mb-8">
        We're always looking for talented individuals to help us shape the
        future of knowledge sharing.
      </p>
      <button
        onClick={scrollToOpenPositions}
        className="bg-white text-[#65aa92] px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-md hover:shadow-lg"
      >
        View All Positions
      </button>
    </div>
  </section>
);

export default CareersPage;
