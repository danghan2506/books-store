import Title from "@/components/title";
import { BookOpen, ShoppingCart, Star, Truck } from "lucide-react";
import about from "../../assets/about.jpg"
const About = () => {
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
          <div className="flex flex-col items-start gap-y-4">
            <div className="flex justify-center items-center gap-x-4">
              <div className="h-16 w-16 min-w-16 bg-zinc-100 flex items-center justify-center rounded-md">
                <ShoppingCart className="text-2xl " />
              </div>
              <div>
                <h4 className="text-[18px] font-[500]">Secure Payment Options</h4>
                <p>Multiple safe and conveinent payment methods to ensure your transactions are always secure and protected</p>
              </div>
            </div>
            <div className="flex justify-center items-center gap-x-4">
              <div className="h-16 w-16 min-w-16 bg-zinc-100 flex items-center justify-center rounded-md">
                <BookOpen className="text-2xl " />
              </div>
               <div>
                <h4 className="text-[18px] font-[500]">Vast Collection of Books</h4>
                <p>Thousands of titles across literature, science, business, and self-growth,
                  catering to every reading taste and passion.</p>
              </div>
            </div>
            <div className="flex justify-center items-center gap-x-4">
              <div className="h-16 w-16 min-w-16 bg-zinc-100 flex items-center justify-center rounded-md">
                <Truck className="text-2xl " />
              </div>
               <div>
                <h4 className="text-[18px] font-[500]">Fast & Reliable Delivery</h4>
                <p>Carefully packaged books delivered to your doorstep quickly,
                  so you can enjoy your favorite stories without delay.</p>
              </div>
            </div>
            <div className="flex justify-center items-center gap-x-4">
              <div className="h-16 w-16 min-w-16 bg-zinc-100 flex items-center justify-center rounded-md">
                <Star className="text-2xl " />
              </div>
               <div>
                <h4 className="text-[18px] font-[500]">Trusted by Thousands of Readers</h4>
                <p>Loved by a growing community of book lovers who appreciate our
                  quality service, curated selection, and reader-first approach.</p>
              </div>
            </div>
          </div>
        </div>
        {/* right side */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-zinc-50 flex items-center justify-center p-24 max-h-[33rem] max-w-[33rem] rounded-3xl">
            <img src={about} alt="About image" height={244} className="shadow-2xl shadow-slate-900/50 rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
