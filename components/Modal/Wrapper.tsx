interface WrapperProps {
  isOpen?: boolean;
  children: any;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
}

const Wrapper: React.FunctionComponent<WrapperProps> = ({
  isOpen,
  children,
  onClick,
}) => {
  return (
    <div
      className={`fixed top-0 bottom-0 left-0 flex right-0 z-50 ease-in-out transition-all duration-500 justify-center items-center w-full h-full cursor-pointer ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div
        className="fixed top-0 bottom-0 left-0 right-0 w-full h-full bg-[rgba(0,0,0,0.3)]"
        onClick={onClick}
      ></div>
      {children}
    </div>
  );
};

export default Wrapper;
