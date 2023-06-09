interface IconProps {
  className?: string;
  width?: string;
  height?: string;
}
export const EtherIcon: React.FunctionComponent<IconProps> = ({
  className,
  width,
  height,
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="#9075FE"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M11.9441 17.97L4.58008 13.62L11.9431 24L19.3131 13.62L11.9411 17.97H11.9441ZM12.0561 0L4.69008 12.223L12.0551 16.577L19.4201 12.227L12.0561 0Z" />
    </svg>
  );
};
export const ProfileIcon: React.FunctionComponent<IconProps> = ({
  className,
  width,
  height,
}) => {
  return (
    <svg
    className={className}
    width={width}
    height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_1498_2147)">
        <path
          d="M11.5 12.5C12.8807 12.5 14 11.3807 14 10C14 8.61929 12.8807 7.5 11.5 7.5C10.1193 7.5 9 8.61929 9 10C9 11.3807 10.1193 12.5 11.5 12.5Z"
          stroke="#9075FE"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M14.81 15.25C13.8963 14.4429 12.7191 13.9975 11.5 13.9975C10.2809 13.9975 9.10374 14.4429 8.19 15.25M18 15V17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18H15M15 5H17C17.2652 5 17.5196 5.10536 17.7071 5.29289C17.8946 5.48043 18 5.73478 18 6V8M5 8V6C5 5.73478 5.10536 5.48043 5.29289 5.29289C5.48043 5.10536 5.73478 5 6 5H8M8 18H6C5.73478 18 5.48043 17.8946 5.29289 17.7071C5.10536 17.5196 5 17.2652 5 17V15"
          stroke="#9075FE"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1498_2147">
          <rect
            width="15"
            height="15"
            fill="white"
            transform="translate(4 4)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
