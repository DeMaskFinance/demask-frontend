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
              <span className="text-sm font-normal text-shader_900">
                {Number(data).toLocaleString("en")}
              </span>
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
