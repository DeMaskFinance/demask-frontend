import Image from "next/image";
import Link from "next/link";
import React from "react";

function InterestItem() {
  return (
    <div className="px-2 border rounded-lg border-dark4">
      <h4 className="px-2 pt-4 text-xl font-semibold">You may be interested</h4>

      <div className="flex items-center gap-4 p-2 mt-4 overflow-hidden transition-all border rounded-lg cursor-pointer group hover:text-secondary3 hover:border-secondary3">
        <div className="w-[88px] group-hover:w-[35%]  group-hover:h-[100%] transition-all flex-shrink-0 h-[88px] overflow-hidden rounded-lg">
          <Image
            src={"images/about/features.svg"}
            alt=""
            width={88}
            height={88}
            className="w-full group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex flex-wrap justify-between w-full gap-2 pb-2">
            <h2 className="flex">
              <span className="block text-xl font-semibold">Johhny</span>
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
              className="flex items-center px-2 py-1 text-sm rounded-lg bg-dark4"
              href="/"
            >
              ART
            </Link>
          </div>
          <p className="text-sm line-clamp-2">
            On May 2nd 2023, artist Jeremy Cowart created his historic AURAS
            project ...
          </p>

          <span className="hidden px-6 py-2 mt-1 border rounded-lg group-hover:border-secondary3 w-max group-hover:block ">
            1,000.125 USD
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 p-2 mt-4 overflow-hidden transition-all border rounded-lg cursor-pointer group hover:text-secondary3 hover:border-secondary3">
        <div className="w-[88px] group-hover:w-[35%]  group-hover:h-[100%] transition-all flex-shrink-0 h-[88px] overflow-hidden rounded-lg">
          <Image
            src={"images/about/features.svg"}
            alt=""
            width={88}
            height={88}
            className="w-full group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex flex-wrap justify-between w-full gap-2 pb-2">
            <h2 className="flex">
              <span className="block text-xl font-semibold">Johhny</span>
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
              className="flex items-center px-2 py-1 text-sm rounded-lg bg-dark4"
              href="/"
            >
              ART
            </Link>
          </div>
          <p className="text-sm line-clamp-2">
            On May 2nd 2023, artist Jeremy Cowart created his historic AURAS
            project ...
          </p>

          <span className="hidden px-6 py-2 mt-1 border rounded-lg group-hover:border-secondary3 w-max group-hover:block ">
            1,000.125 USD
          </span>
        </div>
      </div>
      <button className="px-2 py-2 font-semibold text-secondary2">
        See more
      </button>
    </div>
  );
}

export default InterestItem;
