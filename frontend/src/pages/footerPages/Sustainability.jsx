import React from "react";
import { motion } from "framer-motion";
import { Leaf, Recycle, BookOpen, TreePine, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SustainabilityPage = () => {
  // Simple Button component
  const Button = ({ children, className, ...props }) => (
    <button
      className={`px-6 py-3 rounded-full bg-[#5A8D6A] hover:bg-[#7BA88E] text-white font-semibold transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  // Simple Card component
  const Card = ({ children, className, ...props }) => (
    <motion.div
      className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      {...props}
    >
      {children}
    </motion.div>
  );

  const CardContent = ({ children, className, ...props }) => (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7BA88E] to-[#5A8D6A]">
      {/* Hero Section */}
      <div className="relative h-[600px] bg-[url('/placeholder.svg?height=600&width=1920')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-white"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-6">
            Sustainable Reading
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl mx-auto px-4 mb-8">
            Join our eco-friendly journey in the world of books and make a
            positive impact on our planet
          </p>
          <Button className="flex items-center">
            Explore Our Initiatives <ArrowRight className="ml-2" />
          </Button>
        </motion.div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-24 bg-white -mt-20 rounded-t-3xl shadow-xl">
        {/* Mission Statement */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto text-center mb-24"
        >
          <h2 className="text-4xl font-bold mb-8 text-[#5A8D6A]">
            Our Green Commitment
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            At Chapter 0, we're dedicated to providing great reads while
            minimizing our environmental impact. Discover how we're making
            reading more sustainable for our planet, one page at a time.
          </p>
        </motion.section>

        {/* Initiatives Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {[
            {
              icon: Leaf,
              title: "Eco-Friendly Packaging",
              description: "100% recyclable materials for all our shipments",
            },
            {
              icon: Recycle,
              title: "Book Recycling Program",
              description: "Trade old books for credit, promoting reuse",
            },
            {
              icon: BookOpen,
              title: "Digital Library",
              description:
                "Expanding our e-book collection to reduce paper use",
            },
            {
              icon: TreePine,
              title: "Tree Planting Initiative",
              description: "We plant a tree for every 50 books sold",
            },
          ].map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-gradient-to-br from-[#7BA88E]/10 to-[#5A8D6A]/10">
                <CardContent>
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="h-16 w-16 bg-gradient-to-br from-[#7BA88E] to-[#5A8D6A] rounded-full flex items-center justify-center mb-6">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-2xl mb-4 text-[#5A8D6A]">
                      {title}
                    </h3>
                    <p className="text-gray-700 flex-grow">{description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* Impact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-[#7BA88E]/20 to-[#5A8D6A]/20 rounded-3xl p-12 md:p-16 mb-24"
        >
          <h2 className="text-4xl font-bold text-center mb-16 text-[#5A8D6A]">
            Our Environmental Impact
          </h2>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { number: "50K+", label: "Trees Planted" },
              { number: "100K+", label: "Books Recycled" },
              { number: "75%", label: "Reduced Packaging Waste" },
            ].map(({ number, label }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="text-6xl font-bold text-[#5A8D6A] mb-4">
                  {number}
                </div>
                <p className="text-xl text-gray-700">{label}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-8 text-[#5A8D6A]">
            Join Our Green Reading Movement
          </h2>
          <p className="text-xl text-gray-700 mb-12 leading-relaxed">
            Every book you purchase contributes to our sustainable practices and
            environmental conservation efforts. Be part of the change and help
            us create a greener future, one page at a time.
          </p>
          <Button className="flex items-center">
            Explore Eco-Friendly Books <ArrowRight className="ml-2" />
          </Button>
        </motion.section>
      </main>
    </div>
  );
};

export default SustainabilityPage;
