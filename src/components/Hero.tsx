
export const Hero = () => {
  return (
    <div className="relative min-h-[500px] w-full bg-background py-12">
      <div className="container grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            MEINL SONIC ENERGY... Your Sound Journey
          </h1>
          <p className="text-lg text-secondary-foreground max-w-xl">
            Step into a journey with us. A journey to find more calmness, focus and relaxation. 
            A journey to discover fresh, energizing sounds through instruments designed for anyone to explore, create and feel.
          </p>
          <p className="text-base text-muted-foreground max-w-lg">
            Experience the transformative power of sound with our carefully curated collection of musical instruments.
          </p>
        </div>
        
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <img 
            src="/placeholder.svg"
            alt="Meinl Sonic Energy Instruments"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
