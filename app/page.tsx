'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';

// 3D Floating Orbs Component
const FloatingOrbs = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const orbs: any[] = [];
    const orbCount = 15;
    
    for (let i = 0; i < orbCount; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
    
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      orbs.forEach(orb => {
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${orb.opacity})`;
        ctx.fill();
        
        orb.x += orb.dx;
        orb.y += orb.dy;
        
        if (orb.x < 0 || orb.x > canvas.width) orb.dx *= -1;
        if (orb.y < 0 || orb.y > canvas.height) orb.dy *= -1;
      });
      
      // Draw connections
      orbs.forEach((orb1, i) => {
        orbs.slice(i + 1).forEach(orb2 => {
          const distance = Math.sqrt((orb1.x - orb2.x) ** 2 + (orb1.y - orb2.y) ** 2);
          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * (1 - distance / 150)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(orb1.x, orb1.y);
            ctx.lineTo(orb2.x, orb2.y);
            ctx.stroke();
          }
        });
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};

// 3D Project Card Component
const ProjectCard = ({ project, index }: any) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="perspective-1000 h-80"
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg border border-blue-100">
          <h3 className="text-xl font-bold text-slate-900 mb-3">{project.title}</h3>
          <p className="text-slate-600 mb-4 line-clamp-3">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag: string) => (
              <span key={tag} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* Back */}
        <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-white"
             style={{ transform: "rotateY(180deg)" }}>
          <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
          <a href={project.link} target="_blank" rel="noopener noreferrer"
             className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:scale-105 transition">
            View on GitHub →
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Magnetic Button Component
const MagneticButton = ({ children, href, className }: any) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };
  
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };
  
  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.a>
  );
};

export default function Portfolio() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  
  const projects = [
    {
      title: 'F1 Race Prediction',
      description: 'Deep learning model predicting F1 race outcomes using LSTM neural networks with historical race data, weather conditions, and driver statistics. Achieved 78% accuracy.',
      tags: ['Python', 'LSTM', 'TensorFlow', 'Pandas'],
      link: 'https://github.com/Na4Sh11/f1-race-predictor',
    },
    {
      title: 'RAG Chatbot System',
      description: 'Built intelligent chatbot using LangChain and vector embeddings for semantic search and context-aware responses.',
      tags: ['Python', 'LangChain', 'Neo4j', 'OpenAI'],
      link: 'https://github.com/aichatbot07/SellerCenteral-ChatBot-System'
    },
    {
      title: 'Credit Card Fraud Detection',
      description: 'ML system with 98% accuracy using ensemble methods. Implemented feature engineering and model optimization pipelines.',
      tags: ['Python', 'Scikit-learn', 'Pandas', 'XGBoost'],
      link: 'https://github.com/Na4Sh11/creditcard-fraud-detection'
    },
    {
      title: 'BERT Sentiment Analysis',
      description: 'Fine-tuned BERT model for sentiment classification achieving 94% F1 score on customer reviews dataset.',
      tags: ['Python', 'PyTorch', 'Transformers', 'BERT'],
      link: 'https://github.com/Na4Sh11/Sentiment-Analysis-and-modeling-using-BERT-on-Amazon-reviews'
    },
    {
      title: 'London Bike Dashboard',
      description: 'Interactive Tableau dashboard analyzing London biking patterns using Kaggle dataset. Visualized usage trends, weather correlations, and peak hours.',
      tags: ['Tableau', 'Data Visualization', 'Kaggle', 'Analytics'],
      link: 'https://github.com/Na4Sh11/London_Bike_Tableau_Project'
    },
    {
      title: 'Indian Election EDA',
      description: 'Exploratory data analysis on Indian Lok Sabha election dataset. Analyzed voting patterns, constituency demographics, and electoral trends across states.',
      tags: ['Python', 'Pandas', 'Matplotlib', 'Seaborn'],
      link: 'https://github.com/Na4Sh11/Election-2024-EDA'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md shadow-lg z-50 border-b border-blue-500/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            Priyadharshan
          </motion.div>
          <div className="flex gap-6">
            {['About', 'Projects', 'Experience', 'Resumes', 'Contact'].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-slate-300 hover:text-white transition relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with 3D Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <FloatingOrbs />
        
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 animate-gradient" />
        
        <motion.div 
          className="relative z-10 max-w-6xl mx-auto px-6 text-center"
          style={{ opacity, scale }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <motion.h1 
              className="text-7xl md:text-8xl font-bold mb-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Hi, I'm{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
                Priyadharshan
              </span>
            </motion.h1>
            
            <motion.h2 
              className="text-3xl md:text-4xl text-slate-300 mb-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              AI/ML Engineer | Full-Stack Developer | Data Scientist
            </motion.h2>
            
            <motion.p 
              className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Master's student at Northeastern University building production ML systems and financial platforms.
              Intern at AriesView, working on real estate investment dashboards and RAG powered chatbot.
            </motion.p>
            
            <motion.div 
              className="flex gap-4 justify-center mb-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <MagneticButton 
                href="#contact" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition"
              >
                Get in Touch
              </MagneticButton>
              <MagneticButton 
                href="#resumes" 
                className="px-8 py-4 bg-slate-800 text-white rounded-lg font-semibold border border-blue-500/50 hover:bg-slate-700 transition flex items-center gap-2"
              >
                <FaDownload /> View Resumes
              </MagneticButton>
            </motion.div>
            
            <motion.div 
              className="flex gap-6 justify-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[
                { icon: FaGithub, href: 'https://github.com/Na4sh11' },
                { icon: FaLinkedin, href: 'https://linkedin.com/in/priyadharshan-sengutuvan' },
                { icon: FaEnvelope, href: 'mailto:priyadharshansenguttuvan@gmail.com' }
              ].map(({ icon: Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-4xl text-slate-400 hover:text-blue-400 transition"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-blue-500 rounded-full p-1">
            <div className="w-1 h-3 bg-blue-500 rounded-full mx-auto" />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-5xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            About Me
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 p-6 rounded-lg"
            >
              <h3 className="text-2xl font-semibold text-blue-400 mb-4">Education</h3>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-bold text-white text-lg">Northeastern University</h4>
                <p className="text-slate-300">Master's in Data Science</p>
                <p className="text-slate-400">May 2026</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 p-6 rounded-lg"
            >
              <h3 className="text-2xl font-semibold text-blue-400 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['Python', 'TypeScript', 'React', 'Next.js', 'Machine Learning', 'PyTorch', 'TensorFlow', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git'].map((skill) => (
                  <motion.span 
                    key={skill} 
                    className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm border border-blue-500/30"
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.3)' }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects with 3D Cards */}
      <section id="projects" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.h2 
            className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Featured Projects
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <ProjectCard key={i} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-5xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Experience
          </motion.h2>
          <div className="space-y-8">
            {[
              {
                role: 'AI/ML Engineer Intern',
                company: 'AriesView',
                period: 'Present',
                achievements: [
                  'Built investor-grade visualizations achieving 70% user adoption',
                  'Integrated Firebase authentication with dynamic POST endpoints',
                  'Developed Neo4j-powered chatbot with OCR using MuPDF',
                  'Implemented multi-property comparison and fund-based filtering'
                ]
              },
              {
                role: 'Software Development Intern',
                company: 'Psiog Digital',
                period: '2023',
                achievements: [
                  'Developed responsive web applications using React and Node.js',
                  'Collaborated with cross-functional teams on feature implementation',
                  'Optimized application performance and user experience'
                ]
              }
            ].map((exp, i) => (
              <motion.div
                key={i}
                className="border-l-4 border-blue-500 pl-6 bg-slate-800/50 p-6 rounded-r-lg hover:bg-slate-800 transition"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ x: 10 }}
              >
                <h3 className="text-2xl font-bold">{exp.role}</h3>
                <p className="text-lg text-blue-400 mb-3">{exp.company} • {exp.period}</p>
                <ul className="space-y-2">
                  {exp.achievements.map((achievement, j) => (
                    <motion.li 
                      key={j}
                      className="text-slate-300 flex items-start gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: j * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <span className="text-blue-400 mt-1">▹</span>
                      {achievement}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resumes Section */}
      <section id="resumes" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Resumes
          </motion.h2>
          <motion.p 
            className="text-slate-300 mb-12 text-center text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Choose the version that matches your needs:
          </motion.p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Software Engineer', 
                desc: 'Full-stack development & system design', 
                file: 'Priyadharshan_SWE_Resume.pdf',
                gradient: 'from-blue-600 to-cyan-500'
              },
              { 
                title: 'Data Engineer', 
                desc: 'ETL pipelines & data infrastructure', 
                file: 'Priyadharshan_DE_Resume.pdf',
                gradient: 'from-purple-600 to-pink-500'
              },
              { 
                title: 'Data Scientist', 
                desc: 'ML models & statistical analysis', 
                file: 'Priyadharshan_DS_Resume.pdf',
                gradient: 'from-green-600 to-teal-500'
              }
            ].map((resume, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${resume.gradient} opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300 blur-xl`} />
                <div className="relative bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-blue-500 transition-all duration-300 text-center h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">{resume.title}</h3>
                    <p className="text-slate-400 mb-6">{resume.desc}</p>
                  </div>
                  <motion.a
                    href={`/resumes/${resume.file}`}
                    download
                    className={`inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${resume.gradient} text-white rounded-lg font-semibold hover:shadow-2xl transition-all duration-300`}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaDownload /> Download
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/50 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h2 
            className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
          >
            Let's Connect
          </motion.h2>
          <p className="text-xl text-slate-300 mb-8">
            I'm currently seeking full-time opportunities post-graduation (May 2026)
          </p>
          <div className="flex justify-center gap-6">
            <MagneticButton
              href="mailto:priyadharshansenguttuvan@gmail.com"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition flex items-center gap-2"
            >
              <FaEnvelope /> Email Me
            </MagneticButton>
            <MagneticButton
              href="https://linkedin.com/in/priyadharshan-sengutuvan"
              className="px-8 py-4 bg-slate-800 text-white rounded-lg font-semibold border border-blue-500/50 hover:bg-slate-700 transition flex items-center gap-2"
            >
              <FaLinkedin /> LinkedIn
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-8 px-6 border-t border-blue-500/20">
        <div className="max-w-6xl mx-auto text-center text-slate-400">
          <p>© 2025 Priyadharshan</p>
        </div>
      </footer>

      <style jsx>{`
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
}