import FormatNumber from "@/components/Common/FormatNumber";
import { formatToUnit } from "@/libs/utils/formatComon";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
const ModalNumber = ({ data }: { data: string }) => {
  return (
    <div>
      {Number(data) >= 1000 || Number(data) < 0.001 ? (
        <Tippy
          content={
            <div>
              <FormatNumber number={data} />
            </div>
          }
          theme="dark"
        >
          <div className="">{formatToUnit(data)}</div>
        </Tippy>
      ) : (
        <div className="">{formatToUnit(data)}</div>
      )}
    </div>
  );
};

export default ModalNumber;
