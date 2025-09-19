import Title from "@/components/title";
import { BookOpen, ShoppingCart, Star, Truck } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import about from "../../assets/about.jpg"

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const features = [
    {
      icon: ShoppingCart,
      title: "Secure Payment Options",
      description: "Multiple safe and convenient payment methods to ensure your transactions are always secure and protected"
    },
    {
      icon: BookOpen,
      title: "Vast Collection of Books",
      description: "Thousands of titles across literature, science, business, and self-growth, catering to every reading taste and passion."
    },
    {
      icon: Truck,
      title: "Fast & Reliable Delivery",
      description: "Carefully packaged books delivered to your doorstep quickly, so you can enjoy your favorite stories without delay."
    },
    {
      icon: Star,
      title: "Trusted by Thousands of Readers",
      description: "Loved by a growing community of book lovers who appreciate our quality service, curated selection, and reader-first approach."
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1
    }
  };

  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-12 py-12 xl:py-24">
      <div className="flex justify-center items-center flex-col gap-16 xl:gap-8 xl:flex-row">
        <div className="flex-1">
          <Title
            title1={"Unveiling Our Store's key features"}
            title2={"Store's key features!"}
            titleStyles={"pb-10"}
            paraStyles={"!block"}
          />
          
          <motion.div 
            ref={ref}
            className="flex flex-col items-start gap-y-6"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              
              return (
                <motion.div
                  key={index}
                  className="group flex justify-center items-center gap-x-4 p-4 rounded-xl hover:bg-gray-50/80 transition-all duration-300 cursor-pointer w-full"
                  variants={itemVariants}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut",
                    delay: index * 0.1
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: {
                      duration: 0.3,
                      ease: "easeOut"
                    }
                  }}
                >
                  <motion.div 
                    className="h-16 w-16 min-w-16 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center rounded-xl shadow-md border border-gray-200 group-hover:shadow-lg group-hover:border-[#ec8c3e]/30"
                    initial={{ 
                      scale: 0,
                      rotate: -180,
                      backgroundColor: "#f9fafb"
                    }}
                    animate={isInView ? { 
                      scale: 1,
                      rotate: 0,
                      backgroundColor: "#f9fafb"
                    } : { 
                      scale: 0,
                      rotate: -180,
                      backgroundColor: "#f9fafb"
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "backOut",
                      delay: 0.3 + index * 0.1
                    }}
                    whileHover={{
                      scale: 1.15,
                      rotate: 10,
                      backgroundColor: "#fef7f0",
                      borderColor: "#ec8c3e",
                      transition: {
                        duration: 0.3,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    <Icon 
                      className="text-2xl text-gray-600 group-hover:text-[#ec8c3e] transition-colors duration-300" 
                      size={24}
                    />
                  </motion.div>
                  
                  <motion.div
                    className="flex-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      delay: 0.4 + index * 0.1
                    }}
                  >
                    <motion.h4 
                      className="text-[18px] font-[500] text-gray-900 group-hover:text-[#ec8c3e] transition-colors duration-300 mb-2"
                      whileHover={{
                        x: 5,
                        transition: {
                          duration: 0.2,
                          ease: "easeOut"
                        }
                      }}
                    >
                      {feature.title}
                    </motion.h4>
                    
                    <motion.div
                      className="h-0.5 w-0 bg-[#ec8c3e] rounded-full mb-2 group-hover:w-12 transition-all duration-500"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: "1.5rem" } : { width: 0 }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: 0.6 + index * 0.1
                      }}
                    />
                    
                    <motion.p 
                      className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 leading-relaxed"
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        delay: 0.5 + index * 0.1
                      }}
                    >
                      {feature.description}
                    </motion.p>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
        
        {/* right side */}
        <motion.div 
          className="flex-1 flex items-center justify-center"
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            delay: 0.3
          }}
        >
          <motion.div 
            className="bg-gradient-to-br from-gray-100 to-gray-50/30 flex items-center justify-center p-24 max-h-[33rem] max-w-[33rem] rounded-3xl shadow-lg border border-gray-200"
            whileHover={{
              scale: 1.05,
              rotate: 2,
              transition: {
                duration: 0.4,
                ease: "easeOut"
              }
            }}
          >
            <motion.img 
              src={about} 
              alt="About image" 
              height={244} 
              className="shadow-2xl shadow-slate-900/50 rounded-lg w-full h-auto object-cover"
              initial={{ 
                scale: 0.8,
                opacity: 0,
                rotate: -5
              }}
              whileInView={{ 
                scale: 1,
                opacity: 1,
                rotate: 0
              }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8, 
                ease: "backOut",
                delay: 0.5
              }}
              whileHover={{
                scale: 1.1,
                rotate: 3,
                transition: {
                  duration: 0.3,
                  ease: "easeOut"
                }
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;