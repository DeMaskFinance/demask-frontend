import React from "react";

const Guidelines = () => {
  return (
    <div>
      <h2 className="title text-whitet">Logo Guidelines</h2>
      <div className="font-normal">
        <p className="my-6">
          To ensure the logo remains clear and legible in all uses, there is to
          be clear space surrounding the logo that should be kept free of text
          and other elements. This area is to be equivalent to the full height
          and width of the logomark. Always use more where possible.
        </p>
        <p className="text-white font-semibold">
          To maintain consistency in the logo usage, do not do any of the
          following with the logo:
        </p>
        <ul>
          <li>1. Do not stretch, rotate, or distort the logo</li>
          <li>2. Do not use unapproved colors</li>
          <li>3. Do not decrease the opacity of the logo</li>
          <li>4. Do not disassemble logo</li>
          <li>5. Do not use text or image effects</li>
          <li>6. Do not outline the logo</li>
        </ul>
      </div>
    </div>
  );
};

export default Guidelines;
