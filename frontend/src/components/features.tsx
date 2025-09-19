import { SlidersHorizontal, Star, FolderHeart, CreditCard } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: SlidersHorizontal,
      title: "Advanced Search and Filters",
      description: "Quickly find what you need by title, author, or publishing house."
    },
    {
      icon: Star,
      title: "User Reviews and Ratings",
      description: "User feedback to help you choose better."
    },
    {
      icon: FolderHeart,
      title: "Wishlist and Favourites",
      description: "Save items you love for later."
    },
    {
      icon: CreditCard,
      title: "Secure Online Payment",
      description: "Fast, easy, and secure checkout."
    }
  ];

  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-12 py-16 bg-gradient-to-b from-white to-gray-50/50">
      <motion.div 
        ref={ref}
        className="mx-auto max-w-[1440px] px-6 lg:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15
            }
          }
        }}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          
          return (
            <motion.div
              key={index}
              className="group flex items-center justify-center flex-col gap-6 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#ec8e41]/30 transition-all duration-500 cursor-pointer"
              variants={{
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
              }}
              transition={{
                duration: 0.7,
                ease: "easeOut"
              }}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: {
                  duration: 0.3,
                  ease: "easeOut"
                }
              }}
            >
              <motion.div
                className="relative"
                initial={{ scale: 0, rotate: -180 }}
                animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                transition={{
                  duration: 0.6,
                  ease: "backOut",
                  delay: 0.2 + index * 0.1
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  transition: {
                    duration: 0.3,
                    ease: "easeInOut"
                  }
                }}
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-[#ec8e41]/20 to-[#ec8e41]/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-gradient-to-br from-[#ec8e41] to-[#d67830] p-3 rounded-xl shadow-lg">
                  <Icon 
                    height={32} 
                    width={32} 
                    className="text-white"
                  />
                </div>
              </motion.div>

              <div className="flex justify-center items-center flex-col gap-3">
                <motion.h5 
                  className="text-sm md:text-base font-bold text-center text-gray-900 group-hover:text-[#ec8e41] transition-colors duration-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                >
                  {feature.title}
                </motion.h5>
                
                <motion.hr 
                  className="h-1 bg-[#ec8e41] rounded-full border-none"
                  initial={{ width: 0, opacity: 0 }}
                  animate={isInView ? { width: "2rem", opacity: 1 } : { width: 0, opacity: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    delay: 0.4 + index * 0.1
                  }}
                  whileHover={{
                    width: "3rem",
                    transition: {
                      duration: 0.3,
                      ease: "easeOut"
                    }
                  }}
                />
              </div>

              <motion.p 
                className="text-center text-gray-600 text-sm leading-relaxed group-hover:text-gray-800 transition-colors duration-300"
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
              >
                {feature.description}
              </motion.p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

export default Features