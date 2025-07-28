import Hero from "@/components/hero"
import NewArrivals from "@/components/new-arrivals"
import About from "./about"
import PopularBooks from "@/components/popular-books"
import Features from "@/components/features"
import Footer from "@/components/footer"
const Home = () => {
  return (
    <>
      <Hero/>
      <NewArrivals/>
      <About/>
      <PopularBooks/>
      <Features/>
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 bg-white">
        <Footer/>
      </div>

    </>
  )
}

export default Home