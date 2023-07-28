import Image from "next/image";
import Link from "next/link";
import React from "react";

function Creators() {
  return (
    <div className="border border-dark4 rounded-lg px-2 mt-4">
      <h4 className="text-2xl font-semibold px-2 pt-4 pb-2">
        Creators to follow
      </h4>

      <div className="w-full border rounded-lg p-2 mt-2">
        <div className="flex flex-col">
          <div className="flex gap-2 justify-between w-full">
            <h2 className="flex">
              <div className="w-[24px] mr-2 flex-shrink-0 h-[24px] overflow-hidden rounded-lg">
                <Image
                  src={"/images/avtUser3.png"}
                  alt=""
                  width={24}
                  height={24}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 items-baseline">
                <span className="text-base font-semibold block">Johhny</span>

                <span className="text-xs flex item-center"> 3 Collections</span>
              </div>

              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M17.3199 1.91H7.67995C5.55995 1.91 3.81995 3.65 3.81995 5.77V19.86C3.81995 21.66 5.10995 22.42 6.68995 21.55L11.5699 18.84C12.0899 18.55 12.9299 18.55 13.4399 18.84L18.3199 21.55C19.8999 22.43 21.1899 21.67 21.1899 19.86V5.77C21.1799 3.65 19.4499 1.91 17.3199 1.91Z"
                  fill="#9075FE"
                />
                <path
                  d="M11.59 13.251C11.4 13.251 11.21 13.181 11.06 13.031L9.55999 11.531C9.42051 11.3899 9.34229 11.1994 9.34229 11.001C9.34229 10.8026 9.42051 10.6121 9.55999 10.471C9.84999 10.181 10.33 10.181 10.62 10.471L11.59 11.441L15.06 7.97099C15.35 7.68099 15.83 7.68099 16.12 7.97099C16.41 8.26099 16.41 8.74099 16.12 9.03099L12.12 13.031C11.97 13.181 11.78 13.251 11.59 13.251Z"
                  fill="#9075FE"
                />
              </svg>
            </h2>

            <Link
              className="bg-dark4 text-sm py-1 px-2 flex items-center rounded-lg"
              href="/"
            >
              ART
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full border rounded-lg p-2 mt-2">
        <div className="flex flex-col">
          <div className="flex gap-2 justify-between w-full">
            <h2 className="flex">
              <div className="w-[24px] mr-2 flex-shrink-0 h-[24px] overflow-hidden rounded-lg">
                <Image
                  src={"/images/avtUser3.png"}
                  alt=""
                  width={24}
                  height={24}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 items-baseline">
                <span className="text-base font-semibold block">Johhny</span>

                <span className="text-xs flex item-center"> 3 Collections</span>
              </div>

              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M17.3199 1.91H7.67995C5.55995 1.91 3.81995 3.65 3.81995 5.77V19.86C3.81995 21.66 5.10995 22.42 6.68995 21.55L11.5699 18.84C12.0899 18.55 12.9299 18.55 13.4399 18.84L18.3199 21.55C19.8999 22.43 21.1899 21.67 21.1899 19.86V5.77C21.1799 3.65 19.4499 1.91 17.3199 1.91Z"
                  fill="#9075FE"
                />
                <path
                  d="M11.59 13.251C11.4 13.251 11.21 13.181 11.06 13.031L9.55999 11.531C9.42051 11.3899 9.34229 11.1994 9.34229 11.001C9.34229 10.8026 9.42051 10.6121 9.55999 10.471C9.84999 10.181 10.33 10.181 10.62 10.471L11.59 11.441L15.06 7.97099C15.35 7.68099 15.83 7.68099 16.12 7.97099C16.41 8.26099 16.41 8.74099 16.12 9.03099L12.12 13.031C11.97 13.181 11.78 13.251 11.59 13.251Z"
                  fill="#9075FE"
                />
              </svg>
            </h2>

            <Link
              className="bg-dark4 text-sm py-1 px-2 flex items-center rounded-lg"
              href="/"
            >
              ART
            </Link>
          </div>
        </div>
      </div>
      <button className="text-secondary2 font-semibold px-2 pt-2 pb-2">
        See more
      </button>
    </div>
  );
}

export default Creators;
