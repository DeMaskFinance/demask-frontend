import FormatNumber from "@/components/Common/FormatNumber";
import { LogoIconCard } from "@/components/Logo/Logo";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import SwiperCustom from "@/components/SwiperCustom";
import AccountContext from "@/context/AccountContext";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { SwiperSlide } from "swiper/react";

const Created = () => {
  const { account, chainId, demask } = useContext(AccountContext);
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-center">Created</h1>
      <SwiperCustom>
        <ul className="grid grid-cols-1 gap-6 lg:grid-cols-5 md:grid-cols-2 text-dark2">
          <SwiperSlide className="text-sm lg:text-base text-dark2">
            <Link href={`created/123123`}>
              <li className="items-center p-3 transition-all border rounded-md cursor-pointer hover:-translate-y-1 hover:shadow-home ">
                <div className="h-[127px]">
                  <Image
                    src="/images/test.png"
                    width={620}
                    height={620}
                    className="object-cover w-full h-full rounded-lg"
                    alt="1"
                  />
                </div>
                <div className="w-full">
                  <div className="flex w-full mt-2">
                    <div className="w-full">
                      <h6 className="flex items-start gap-2 font-medium uppercase">
                        <span className="flex-wrap max-w-full text-xl line-clamp-1">
                          <ModalDocument data={"WINWIN MAKER"} />
                        </span>
                      </h6>
                    </div>
                  </div>
                  <LogoIconCard chainId={chainId} />
                  <div className="flex justify-between text-sm">
                    <p>Total Volume</p>
                    <p>Total Items</p>
                  </div>
                  <div className="flex justify-between font-semibold text-dark2">
                    <div>
                      <FormatNumber number={"123"} />
                    </div>
                    <div>789</div>
                  </div>
                </div>
              </li>
            </Link>
          </SwiperSlide>
        </ul>
      </SwiperCustom>
    </div>
  );
};

export default Created;
