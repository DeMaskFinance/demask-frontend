interface WrapperProps {
  isOpen?: boolean;
  children: any;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  isTransaction?: boolean;
}

const Wrapper: React.FunctionComponent<WrapperProps> = ({ isOpen, children, onClick, isTransaction }) => {
  return (
    <div
      className={`fixed top-0 bottom-0 left-0 right-0 z-50 justify-center items-center w-screen h-screen cursor-pointer ${isOpen ? "flex" : "hidden"
        }`}
    >
      <div
        className={`fixed top-0 bottom-0 left-0 right-0 w-screen h-screen ${isTransaction ? 'bg-[#000D34] opacity-50' : 'bg-[rgba(0,0,0,0.3)]'}`}
        onClick={onClick}
      ></div>
      {children}
    </div>
  );
};

export default Wrapper;
