import Image from 'next/image';

const CoverPhotoBanner = () => {
  return (
    <section className="relative w-full h-96">
      <Image
        src="/cover-photo.png"
        alt="Cover Banner"
        fill
        style={{objectFit: "cover"}}
        quality={100}
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold">Welcome to BabyAGES</h1>
          <p className="mt-4 text-lg md:text-2xl">Find the best products for your little one</p>
        </div>
      </div>
    </section>
  );
};

export default CoverPhotoBanner;