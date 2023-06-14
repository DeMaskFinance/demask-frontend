interface WrapperProps {
    ref?: React.LegacyRef<HTMLDivElement> | undefined;
    isOpen?:boolean;
    children:any;
    onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
}

const Wrapper: React.FunctionComponent<WrapperProps> = ({ref,isOpen,children,onClick}) => {
  return (
    <div
      ref={ref}
      className={`fixed top-0 bottom-0 left-0 right-0 z-50 justify-center w-screen h-screen ${
        isOpen ? "flex" : "hidden"
      }`}
    >
      <div
        className="fixed top-0 bottom-0 left-0 right-0 w-screen h-screen bg-[rgba(0,0,0,0.3)]"
        onClick={onClick}
      ></div>
      {children}
    </div>
  );
};

export default Wrapper;
