import Image from "next/image";
import React from "react";

function Introduction() {
  return (
    <>
      <div className="flex lg:flex-row flex-col gap-4 pt-8">
        <div className="lg:w-3/5 w-full">
          <h2 className="text-3xl font-medium pb-2">What is DEMASK</h2>
          <p className="text-dark2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
        </div>

        <div className="lg:w-2/5">
          <Image
            src="/images/about.svg"
            alt="about.svg"
            width={504}
            height={504}
          />
        </div>
      </div>

      <article className="py-6 border-b-2  grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-4">
        <div>
          <p className="pb-6 text-dark2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
          <span className="font-medium text-4xl">300+</span>
        </div>
        <div>
          <p className="pb-6 text-dark2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
          <span className="font-medium text-4xl">13+</span>
        </div>
        <div>
          <p className="pb-6 text-dark2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
          <span className="font-medium text-4xl">20k+</span>
        </div>
      </article>
    </>
  );
}

export default Introduction;
