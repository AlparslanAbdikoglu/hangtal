import { Navbar } from "./Navbar";

export const Hero = () => {
  return (
    <>
      <Navbar />
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/lovable-uploads/8538687f-9e29-4beb-9a97-1b97579cc051.png')",
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative container h-full flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            MEINL SONIC ENERGY... Your Sound Journey
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8">
            Step into a journey with us. A journey to find more calmness, focus and relaxation. 
            A journey to discover fresh, energizing sounds through instruments designed for anyone to explore, create and feel.
          </p>
          <p className="text-base md:text-lg max-w-xl opacity-90">
            Experience the transformative power of sound with our carefully curated collection of musical instruments.
          </p>
        </div>
      </div>
    </>
  );
};