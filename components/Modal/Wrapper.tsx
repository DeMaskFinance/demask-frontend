interface WrapperProps {
  isOpen?: boolean;
  children: any;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  isTransaction?: boolean;
}

const Wrapper: React.FunctionComponent<WrapperProps> = ({
  isOpen,
  children,
  onClick,
  isTransaction,
}) => {
  return (
    <div
      className={`fixed top-0 bottom-0 left-0 flex right-0 z-50 ease-in-out transition-all duration-500 justify-center items-center w-full h-full cursor-pointer ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div
        className={`fixed top-0 bottom-0 left-0 right-0 w-screen h-screen ${
          isTransaction ? "bg-[#000D34] opacity-50" : "bg-[rgba(0,0,0,0.3)]"
        }`}
        onClick={onClick}
      ></div>
      {children}
    </div>
  );
};

export default Wrapper;
