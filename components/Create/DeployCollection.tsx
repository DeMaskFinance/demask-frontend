import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React from "react";
import WithAuth from "../Common/WithAuth";
import { SEO } from "@/next-seo.config";
import { BackIcon, CreateIcon } from "../Icons";
const updateMeta = {
  ...SEO,
  title: "Mint NFTs",
};
const DeployCollection = () => {
  const router = useRouter();
  return (
    <>
      <NextSeo {...updateMeta} />
      <WithAuth>
        <div className="flex flex-col gap-6 py-8 pb-24 mx-auto lg:flex-row md:flex-row container-main lg:pb-8 ">
          {/* UpLoad File */}
          <div className="w-full lg:w-2/4 md:w-2/4 shrink-0">
            <div className="sticky top-16">
              <div className="flex items-center gap-x-2">
                <div onClick={() => router.back()}>
                  <BackIcon width={20} height={20} />
                </div>
                <h2 className="flex items-center text-2xl font-semibold text_gradient gap-x-1">
                  <CreateIcon width={22} height={22} />
                  Create New NFTs
                </h2>
              </div>
              <h3 className="my-2 font-normal text-dark2">
                Mint additional NFTs to grow your collection.
              </h3>
              <p className="mt-2 mb-6 text-xs text-red">* Required fields</p>
              {/* <div
                className="flex flex-col items-center w-full"
                ref={uploadRef}
              >
                <div
                  className={`flex flex-col items-center w-full text-center border border-dashed group h-fit justify-center border-1 border-dark2 rounded-2xl`}
                  ref={itemRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleLeave}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <div>
                      {fileType?.startsWith("image/") && (
                        <Image
                          src={selectedFile}
                          alt="pictureframe"
                          width={504}
                          height={160}
                          sizes="100vw"
                          quality={100}
                          className="object-cover max-w-[504px] max-h-[590px] rounded-2xl"
                        />
                      )}
                      {fileType?.startsWith("audio/") && (
                        <div className="flex flex-col items-center">
                          <Image
                            src="/images/audio.svg"
                            alt="audioImage"
                            width={360}
                            height={360}
                            className="object-cover mt-6 mb-4 w-[540px] h-[360px] rounded-[2rem] mx-auto"
                          />
                          <audio
                            autoPlay
                            loop
                            muted
                            controls
                            src={selectedFile}
                          >
                            Your browser does not support the
                            <code>audio</code> element.
                          </audio>
                        </div>
                      )}
                      {fileType?.startsWith("video/") && (
                        <video
                          src={selectedFile}
                          autoPlay
                          loop
                          muted
                          controls
                          width={504}
                          height={288}
                          className="rounded-2xl"
                        />
                      )}
                      {fileType === "application/pdf" && (
                        <embed
                          src={selectedFile}
                          width={504}
                          height={500}
                          type="application/pdf"
                        />
                      )}
                      <input
                        ref={inputRef}
                        type="file"
                        hidden
                        onChange={handleChangeFile}
                        accept="image/jpg, image/jpeg, image/png, image/svg+xml, image/gif, text/html, video/mp4, video/quicktime, audio/mpeg, audio/mp3, audio/x-m4a, audio/vnd.wav, audio/vnd.wave, audio/wav, audio/wave, audio/x-wav, audio/aiff, application/pdf, application/zip"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={handleClickFile}
                      className="cursor-pointer h-fit lg:h-[60vh] flex flex-col justify-center"
                    >
                      <PictureMint
                        width={160}
                        height={160}
                        className="mx-auto transition-all duration-200 group-hover:fill-dark2"
                      />
                      <p className="font-semibold text-dark1">Upload</p>
                      <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpg, image/jpeg, image/png, image/svg+xml, image/gif, video/mp4, video/quicktime, audio/mpeg, audio/mp3, audio/x-m4a, audio/vnd.wav, audio/vnd.wave, audio/wav, audio/wave, audio/x-wav, audio/aiff, application/pdf"
                        hidden
                        onChange={handleChangeFile}
                      />
                      <div className="text-sm w-[254px] text-dark3 mb-6 transition-all duration-200 group-hover:text-dark2">
                        <span>
                          Video, audio, gif, pdf, and images supported.
                        </span>{" "}
                        <span className="text-dark2">Max size: 1GB.</span>
                      </div>
                    </div>
                  )}
                </div>
                {selectedFile && (
                  <Button
                    onClick={handleClickFile}
                    className="mt-6 w-[160px] h-[34px]"
                    primary
                  >
                    Edit file
                  </Button>
                )}
              </div> */}
            </div>
          </div>
          <div className="w-full lg:w-2/4 md:w-2/4"></div>
        </div>
      </WithAuth>
    </>
  );
};

export default DeployCollection;
