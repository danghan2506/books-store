import Title from "@/components/title";
import { ShoppingCart } from "lucide-react";
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
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ut perspiciatis necessitatibus amet aperiam, quos id maxime sint consequatur molestias qui corrupti distinctio ducimus voluptate. Ipsa, sapiente aliquam? Ea, nisi! Iste.</p>
              </div>
            </div>
            <div className="flex justify-center items-center gap-x-4">
              <div className="h-16 w-16 min-w-16 bg-zinc-100 flex items-center justify-center rounded-md">
                <ShoppingCart className="text-2xl " />
              </div>
               <div>
                <h4 className="text-[18px] font-[500]">Secure Payment Options</h4>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ut perspiciatis necessitatibus amet aperiam, quos id maxime sint consequatur molestias qui corrupti distinctio ducimus voluptate. Ipsa, sapiente aliquam? Ea, nisi! Iste.</p>
              </div>
            </div>
            <div className="flex justify-center items-center gap-x-4">
              <div className="h-16 w-16 min-w-16 bg-zinc-100 flex items-center justify-center rounded-md">
                <ShoppingCart className="text-2xl " />
              </div>
               <div>
                <h4 className="text-[18px] font-[500]">Secure Payment Options</h4>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ut perspiciatis necessitatibus amet aperiam, quos id maxime sint consequatur molestias qui corrupti distinctio ducimus voluptate. Ipsa, sapiente aliquam? Ea, nisi! Iste.</p>
              </div>
            </div>
            <div className="flex justify-center items-center gap-x-4">
              <div className="h-16 w-16 min-w-16 bg-zinc-100 flex items-center justify-center rounded-md">
                <ShoppingCart className="text-2xl " />
              </div>
               <div>
                <h4 className="text-[18px] font-[500]">Secure Payment Options</h4>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ut perspiciatis necessitatibus amet aperiam, quos id maxime sint consequatur molestias qui corrupti distinctio ducimus voluptate. Ipsa, sapiente aliquam? Ea, nisi! Iste.</p>
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
