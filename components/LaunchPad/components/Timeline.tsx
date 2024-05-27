import React from "react";

const Timeline = () => {
  return (
    <div>
      <div className="mx-auto mt-6 mb-10 text-sm font-light leading-6 font-casual">
        <div className="flex flex-col justify-center ml-8 lg:flex-row lg:ml-2 lg:mt-12">
          <div className="relative flex lg:block Timeline_timeline__6x1Eh Timeline_lineBright__iam07 Timeline_active__5x_Px Timeline_lineBrightActive__UU57x">
            <div className="relative z-10 w-fit">
              <span className="flex items-center justify-center font-bold text-white rounded-full bg-primary_400 w-9 h-9 bg-gamefiGreen-700">
                01
              </span>
            </div>
            <div className="ml-8 lg:mt-10 lg:ml-0">
              <h3 className="mb-2 text-base font-semibold /70">INTRODUCTION</h3>
              <div className="pr-10 desc">Stay tuned and prepare to BUY.</div>
            </div>
          </div>

          <div className="relative flex lg:block Timeline_timeline__6x1Eh Timeline_lineBright__iam07 Timeline_active__5x_Px Timeline_lineBrightActive__UU57x">
            <div className="relative z-10 w-fit">
              <span className="flex items-center justify-center font-bold text-white rounded-full bg-primary_400 w-9 h-9 bg-gamefiGreen-700">
                02
              </span>
            </div>
            <div className="ml-8 lg:mt-10 lg:ml-0">
              <h3 className="mb-2 text-base font-semibold /70">
                BUYING - PHASE 1
              </h3>
              <div className="pr-10  desc w-[270px]">
                You can buy Mystery Box before the Buy Phase ends
              </div>
            </div>
          </div>

          <div className="relative flex lg:block Timeline_timeline__6x1Eh Timeline_lineBright__iam07 Timeline_active__5x_Px Timeline_lineBrightActive__UU57x">
            <div className="relative z-10 w-fit">
              <span className="flex items-center justify-center font-bold text-white rounded-full bg-primary_400 w-9 h-9 bg-gamefiGreen-700">
                03
              </span>
            </div>
            <div className="ml-8 lg:mt-10 lg:ml-0">
              <h3 className="mb-2 text-base font-semibold /70">
                BUYING - PHASE 2
              </h3>
              <div className="pr-10  desc w-[270px]">
                Phase 2 will start right after Phase 1 ends. Remaining boxes in
                Phase 1 will be transferred to Phase 2.
              </div>
            </div>
          </div>

          <div className="flex lg:block Timeline_timeline__6x1Eh Timeline_lineBright__iam07 Timeline_active__5x_Px">
            <div className="relative z-10 w-fit">
              <span className="flex items-center justify-center font-bold text-white rounded-full bg-primary_400 w-9 h-9 bg-gamefiGreen-700 Timeline_circleLight__X_ZC0">
                04
              </span>
            </div>
            <div className="ml-8 lg:mt-10 lg:ml-0">
              <h3 className="mb-2 text-base font-semibold text-gamefiGreen-700">
                END
              </h3>
              <div className="pr-10  desc w-[270px]">
                Thank you for your participation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
