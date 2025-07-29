import {SlidersHorizontal, UserStar,  FolderHeart, CreditCard} from "lucide-react"
const Features = () => {
  return (
    <section className='mx-auto max-w-[1440px] px-6 lg:px-12 py-16'>
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 gap-y-12">
        <div className="flex items-center justify-center flex-col gap-3">
          <SlidersHorizontal height={44} width={44}/>
          <div className="flex justify-center items-center flex-col">
            <h5 className="text-[14px] md:text-[15px] mb-1 font-bold">Advanced Search and Filters</h5>
            <hr className="w-8 bg-zinc-400 h-1 rounded-full border-none"/>
          </div>
          <p className="text-center">Quickly find what you need by title, author, or publishing house.</p>
        </div>
        <div className="flex items-center justify-center flex-col gap-3">
          <UserStar height={44} width={44}/>
          <div className="flex justify-center items-center flex-col">
            <h5 className="text-[14px] md:text-[15px] mb-1 font-bold">User Reviews and Ratings</h5>
            <hr className="w-8 bg-zinc-400 h-1 rounded-full border-none"/>
          </div>
          <p className="text-center">User feedback to help you choose better.</p>
        </div>
        <div className="flex items-center justify-center flex-col gap-3">
          <FolderHeart height={44} width={44}/>
          <div className="flex justify-center items-center flex-col">
            <h5 className="text-[14px] md:text-[15px] mb-1 font-bold">Wishlist and Favourites</h5>
            <hr className="w-8 bg-zinc-400 h-1 rounded-full border-none"/>
          </div>
          <p className="text-center">Save items you love for later.</p>
        </div>
        <div className="flex items-center justify-center flex-col gap-3">
          <CreditCard height={44} width={44}/>
          <div className="flex justify-center items-center flex-col">
            <h5 className="text-[14px] md:text-[15px] mb-1 font-bold">Secure Online Payment</h5>
            <hr className="w-8 bg-zinc-400 h-1 rounded-full border-none"/>
          </div>
          <p className="text-center">Fast, easy, and secure checkout.</p>
        </div>
        
      </div>
    </section>
  )
}

export default Features