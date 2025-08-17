import { Link } from 'react-router'
import bg from "../assets/bg.jpg"
import pencil from "../assets/pencil.png"
const Hero = () => {
  return (
    <section className='mx-auto max-w-[1440px] px-6 lg:px-12 py-12 xl:py-20'>
      <div className='flex items-center justify-center gap-12 flex-col xl:flex-row'>
        {/* left side */}
        <div className='flex flex-1 flex-col pt-12 xl:pt-32'>
          <h1 className='text-[45px] leading-tight md:text-[55px] md:leading-[1.3] mb-4 font-bold max-w-[46rem]'>Find Your Next Favourite 
            <span className='inline-flex'><span className='inline-flex items-center justify-center p-5 h-16 w-16 bg-red-600 text-white -rotate-[31deg] rounded-full'>
              B</span>ooks</span> <img src={pencil} height={49} width={49} className='inline-flex relative bottom-2'></img>From Anywhere
            </h1>
          <p>
            Step into a world where stories breathe, and every page sparks wonder. From quiet nights to curious minds, discover books that stir your soul, awaken dreams, and stay with you long after the last word. Your next escape is just a chapter away.
          </p>
          <div className='mt-6'>
            <Link to={'/store'} className='btn text-[14px] font-[500] bg-red-600 hover:bg-red-700 text-white px-7 py-2.5 rounded-full'>Explore now</Link>
          </div>
        </div>
        {/* right side */}
        <div className='flex flex-1 relative z-10 top-12'>
          <div>
            <img src={bg} alt="" height={588} width={588}></img>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero