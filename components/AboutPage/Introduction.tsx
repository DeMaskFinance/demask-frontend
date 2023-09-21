import Image from "next/image";
import React from "react";

function Introduction() {
  const amountList = [
    {
      title: "CRYPTO COLLECTIBLES",
      amount: "300+"
    },
    {
      title: "CREATOR",
      amount: "13+"
    },
    {
      title: "TVL",
      amount: "300+"
    },
    {
      title: "VOLUME",
      amount: "20K+"
    },
  ]
  return (
    <>
      <div className="pt-8 pb-6 ">
        <div>
          <div className="flex flex-col-reverse w-full mb-10 gap-x-8 lg:flex-row">
            <div className="relative w-full lg:w-[45%]">
              <div className="h-[260px] lg:h-[480px]  z-10 relative mt-[10px]" data-aos="fade-right"
                data-aos-duration="800"
                data-aos-easing="ease-in-sine">
                <video
                  src='https://demask.infura-ipfs.io/ipfs/QmS8qqgQdnkMfmU821amXEZMt8eU5XNDTAxyCJuUb2tj8S'
                  autoPlay
                  loop
                  muted
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
              <div data-aos="fade-right"
                data-aos-duration="100"
                data-aos-easing="ease-in-sine"
                className="absolute w-[700px] bg-gradient-to-r from-secondary5 to-[#C8BAFF] h-[280px] lg:h-[500px] -left-[98%] lg:-left-[60%] top-0 rounded-lg"></div>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="pb-2 text-3xl font-semibold text-secondary5">DeMask Protocol</h2>
              <p className="text-dark2">
                Trading crypto collectibles is easier than ever and monetizes the
                liquidity and referral program.
              </p>
            </div>
          </div>
        </div>
        <article className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {amountList.map((item, index) => (
            <div key={index} className="p-4 border flex flex-col justify-between lg:gap-y-4 rounded-lg group bg-gradient-to-r hover:from-secondary5 hover:to-[#C8BAFF] transition-all ease-out duration-1000">
              <p className=" text-dark2 group-hover:text-white">{item.title}</p>
              <span className="text-xl font-semibold lg:text-6xl text-dark1 group-hover:text-white">{item.amount}</span>
            </div>
          ))}
        </article>
      </div>
    </>
  );
}

export default Introduction;
