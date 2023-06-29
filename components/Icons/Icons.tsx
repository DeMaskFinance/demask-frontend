interface IconProps {
  className?: string;
  width?: number;
  height?: number;
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
export const BscIcon: React.FunctionComponent<IconProps> = ({
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
      fill="#636977"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1425_1315)">
        <path d="M14.8661 19.345C14.9987 19.5747 15.0346 19.8476 14.966 20.1038C14.8973 20.36 14.7297 20.5784 14.5001 20.711L13.2501 21.433C12.87 21.6524 12.4389 21.7679 12.0001 21.7679C11.5612 21.7679 11.1301 21.6524 10.7501 21.433L9.50005 20.71C9.27225 20.5764 9.10651 20.3582 9.03902 20.1029C8.97152 19.8476 9.00774 19.576 9.13978 19.3473C9.27182 19.1186 9.48895 18.9514 9.74379 18.8822C9.99863 18.8131 10.2705 18.8475 10.5001 18.978L11.7501 19.7C11.8261 19.7439 11.9123 19.767 12.0001 19.767C12.0878 19.767 12.174 19.7439 12.2501 19.7L13.5001 18.978C13.7297 18.8454 14.0027 18.8095 14.2589 18.8781C14.515 18.9467 14.7334 19.1153 14.8661 19.345ZM19.7941 11.119C20.0593 11.119 20.3136 11.2243 20.5012 11.4119C20.6887 11.5994 20.7941 11.8538 20.7941 12.119V15.634C20.794 16.0728 20.6785 16.5039 20.4591 16.884C20.2397 17.264 19.9241 17.5796 19.5441 17.799L16.5001 19.557C16.3863 19.6227 16.2607 19.6653 16.1304 19.6824C16.0001 19.6995 15.8678 19.6908 15.7409 19.6568C15.614 19.6227 15.4951 19.564 15.3909 19.484C15.2866 19.404 15.1992 19.3043 15.1336 19.1905C15.0679 19.0767 15.0253 18.9511 15.0082 18.8208C14.9911 18.6906 14.9998 18.5582 15.0338 18.4313C15.0678 18.3044 15.1265 18.1855 15.2065 18.0813C15.2865 17.9771 15.3863 17.8897 15.5001 17.824L18.5441 16.067C18.6201 16.0231 18.6832 15.96 18.7271 15.884C18.7709 15.808 18.7941 15.7218 18.7941 15.634V12.119C18.7941 11.8538 18.8994 11.5994 19.0869 11.4119C19.2745 11.2243 19.5288 11.119 19.7941 11.119ZM4.20605 11.119C4.47127 11.119 4.72563 11.2243 4.91316 11.4119C5.1007 11.5994 5.20605 11.8538 5.20605 12.119V15.634C5.20606 15.7218 5.22916 15.808 5.27305 15.884C5.31693 15.96 5.38005 16.0231 5.45605 16.067L8.50005 17.824C8.72786 17.9575 8.8936 18.1758 8.96109 18.4311C9.02859 18.6864 8.99237 18.958 8.86033 19.1867C8.72829 19.4154 8.51116 19.5826 8.25632 19.6517C8.00148 19.7209 7.72961 19.6865 7.50005 19.556L4.45605 17.8C4.07602 17.5806 3.76043 17.265 3.54101 16.885C3.32159 16.5049 3.20607 16.0738 3.20605 15.635V12.12C3.20605 11.8548 3.31141 11.6004 3.49895 11.4129C3.68648 11.2253 3.94084 11.119 4.20605 11.119ZM15.6251 7.46499L15.7441 7.52199L17.2571 8.37999C17.3943 8.45792 17.5111 8.56722 17.5981 8.69897C17.685 8.83071 17.7394 8.98115 17.7571 9.13799L17.7631 9.25799L17.7501 10.998C17.7487 11.1522 17.7118 11.3041 17.642 11.4416C17.5723 11.5792 17.4717 11.6988 17.3481 11.791L17.2501 11.856L14.5001 13.444V16.62C14.5001 16.7744 14.4643 16.9267 14.3956 17.065C14.3269 17.2032 14.2271 17.3237 14.1041 17.417L14.0061 17.483L12.5061 18.363C12.3722 18.4415 12.222 18.4878 12.0671 18.4982C11.9123 18.5086 11.7572 18.4829 11.6141 18.423L11.4941 18.363L9.99406 17.483C9.86075 17.4047 9.74739 17.2967 9.66289 17.1672C9.57839 17.0378 9.52505 16.8905 9.50705 16.737L9.50005 16.62V13.443L6.75005 11.856C6.61631 11.7787 6.50229 11.6715 6.41693 11.5428C6.33156 11.414 6.27719 11.2673 6.25805 11.114L6.25005 10.997L6.23705 9.25699C6.23603 9.09938 6.27227 8.94376 6.34283 8.80282C6.41338 8.66188 6.51626 8.53961 6.64305 8.44599L6.74305 8.37999L8.25705 7.52199C8.38915 7.44697 8.53659 7.40302 8.68821 7.39349C8.83982 7.38396 8.99161 7.4091 9.13205 7.46699L9.25005 7.52599L12.0001 9.11299L14.7501 7.52599C14.8817 7.45 15.0289 7.40501 15.1805 7.39444C15.3321 7.38387 15.4842 7.408 15.6251 7.46499ZM17.6291 13.27V14.673C17.629 14.8485 17.5828 15.021 17.4951 15.173C17.4073 15.325 17.2811 15.4512 17.1291 15.539L15.9141 16.24C15.8684 16.2663 15.8167 16.2802 15.764 16.2802C15.7113 16.2802 15.6596 16.2663 15.614 16.2399C15.5684 16.2136 15.5305 16.1757 15.5042 16.1301C15.4779 16.0844 15.464 16.0327 15.4641 15.98V14.577C15.4641 14.4015 15.5103 14.229 15.598 14.077C15.6858 13.925 15.812 13.7988 15.9641 13.711L17.1791 13.01C17.2247 12.9837 17.2764 12.9698 17.3291 12.9698C17.3818 12.9698 17.4335 12.9837 17.4791 13.01C17.5247 13.0364 17.5626 13.0743 17.5889 13.1199C17.6153 13.1656 17.6291 13.2173 17.6291 13.27ZM6.75905 12.983L6.82105 13.01L8.03606 13.711C8.17086 13.7889 8.28562 13.8971 8.37121 14.0271C8.4568 14.1572 8.51085 14.3054 8.52906 14.46L8.53606 14.577V15.98C8.53613 16.027 8.52514 16.0735 8.50397 16.1155C8.48279 16.1575 8.45203 16.194 8.41416 16.2219C8.3763 16.2498 8.33239 16.2685 8.28599 16.2763C8.23959 16.2841 8.19199 16.281 8.14706 16.267L8.08606 16.24L6.87105 15.539C6.73638 15.4612 6.62169 15.3531 6.53611 15.2233C6.45053 15.0934 6.39641 14.9454 6.37805 14.791L6.37105 14.673V13.27C6.3709 13.2283 6.37943 13.1871 6.3961 13.1488C6.41278 13.1106 6.43723 13.0763 6.46791 13.0481C6.49858 13.0199 6.5348 12.9984 6.57425 12.9849C6.6137 12.9715 6.65553 12.9664 6.69705 12.97L6.76006 12.983H6.75905ZM18.2491 5.45299L19.5441 6.20099C19.9241 6.42041 20.2397 6.73599 20.4591 7.11603C20.6785 7.49606 20.794 7.92716 20.7941 8.36599V9.80899C20.7941 10.0742 20.6887 10.3286 20.5012 10.5161C20.3136 10.7036 20.0593 10.809 19.7941 10.809C19.5288 10.809 19.2745 10.7036 19.0869 10.5161C18.8994 10.3286 18.7941 10.0742 18.7941 9.80899V8.36599C18.7941 8.27823 18.7709 8.19201 18.7271 8.116C18.6832 8.03999 18.6201 7.97688 18.5441 7.93299L17.2491 7.18499C17.0212 7.05144 16.8555 6.83321 16.788 6.57791C16.7205 6.32261 16.7567 6.05099 16.8888 5.8223C17.0208 5.59361 17.2379 5.42643 17.4928 5.35724C17.7476 5.28806 18.0195 5.32248 18.2491 5.45299ZM7.07205 5.84499C7.20466 6.07467 7.24059 6.34762 7.17195 6.60379C7.10332 6.85996 6.93573 7.07838 6.70605 7.21099L5.45605 7.93299C5.38005 7.97688 5.31693 8.03999 5.27305 8.116C5.22916 8.19201 5.20606 8.27823 5.20605 8.36599V9.80899C5.20605 10.0742 5.1007 10.3286 4.91316 10.5161C4.72563 10.7036 4.47127 10.809 4.20605 10.809C3.94084 10.809 3.68648 10.7036 3.49895 10.5161C3.31141 10.3286 3.20605 10.0742 3.20605 9.80899V8.36599C3.20589 7.92699 3.32133 7.49569 3.54076 7.11546C3.76019 6.73523 4.07587 6.41949 4.45605 6.19999L5.70605 5.47799C5.93573 5.34539 6.20868 5.30946 6.46485 5.37809C6.72103 5.44673 6.93944 5.61532 7.07205 5.84499ZM12.5001 5.78999L13.7151 6.49099C13.7608 6.5173 13.7987 6.55518 13.8251 6.60083C13.8515 6.64647 13.8654 6.69827 13.8654 6.75099C13.8654 6.80372 13.8515 6.85551 13.8251 6.90116C13.7987 6.9468 13.7608 6.98469 13.7151 7.01099L12.5001 7.70999C12.348 7.79776 12.1756 7.84397 12.0001 7.84397C11.8245 7.84397 11.6521 7.79776 11.5001 7.70999L10.2851 7.00899C10.2394 6.98269 10.2014 6.9448 10.175 6.89916C10.1486 6.85351 10.1347 6.80172 10.1347 6.74899C10.1347 6.69627 10.1486 6.64447 10.175 6.59883C10.2014 6.55318 10.2394 6.5153 10.2851 6.48899L11.5001 5.78999C11.6521 5.70222 11.8245 5.65602 12.0001 5.65602C12.1756 5.65602 12.348 5.70222 12.5001 5.78999ZM13.2501 2.56799L16.2941 4.32499C16.5239 4.4576 16.6916 4.67607 16.7603 4.93234C16.829 5.18861 16.7932 5.46168 16.6606 5.69149C16.5279 5.9213 16.3095 6.08902 16.0532 6.15775C15.7969 6.22649 15.5239 6.1906 15.2941 6.05799L12.2501 4.29899C12.174 4.25511 12.0878 4.232 12.0001 4.232C11.9123 4.232 11.8261 4.25511 11.7501 4.29899L8.70606 6.05599C8.59228 6.12269 8.46644 6.16622 8.33578 6.18409C8.20512 6.20196 8.07221 6.1938 7.94471 6.16009C7.81721 6.12638 7.69764 6.06779 7.59288 5.98768C7.48811 5.90757 7.40023 5.80753 7.33429 5.69332C7.26835 5.57911 7.22565 5.45298 7.20865 5.3222C7.19165 5.19142 7.20069 5.05857 7.23524 4.9313C7.2698 4.80403 7.32919 4.68485 7.40999 4.58062C7.49079 4.47639 7.59141 4.38917 7.70605 4.32399L10.7501 2.56699C11.1301 2.34757 11.5612 2.23206 12.0001 2.23206C12.4389 2.23206 12.87 2.34757 13.2501 2.56699V2.56799Z" />
      </g>
      <defs>
        <clipPath id="clip0_1425_1315">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
export const PolygonIcon: React.FunctionComponent<IconProps> = ({
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
      fill="#636977"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16.3608 9.06714C16.0509 8.88804 15.6524 8.88804 15.2983 9.06714L12.8191 10.5448L11.1368 11.4851L8.7019 12.9627C8.39201 13.1418 7.99357 13.1418 7.6394 12.9627L5.73576 11.7985C5.42586 11.6194 5.20451 11.2612 5.20451 10.8582V8.61938C5.20451 8.26117 5.38159 7.90296 5.73576 7.67908L7.6394 6.55968C7.9493 6.38057 8.34774 6.38057 8.7019 6.55968L10.6055 7.72386C10.9154 7.90296 11.1368 8.26117 11.1368 8.66416V10.1418L12.8191 9.15669V7.6343C12.8191 7.2761 12.642 6.91789 12.2878 6.69401L8.74617 4.58953C8.43628 4.41042 8.03784 4.41042 7.68367 4.58953L4.05347 6.73878C3.6993 6.91789 3.52222 7.2761 3.52222 7.6343V11.8433C3.52222 12.2015 3.6993 12.5597 4.05347 12.7836L7.6394 14.888C7.9493 15.0671 8.34774 15.0671 8.7019 14.888L11.1368 13.4552L12.8191 12.4701L15.254 11.0373C15.5639 10.8582 15.9623 10.8582 16.3165 11.0373L18.2201 12.1567C18.53 12.3358 18.7514 12.694 18.7514 13.097V15.3358C18.7514 15.694 18.5743 16.0522 18.2201 16.2761L16.3608 17.3955C16.0509 17.5746 15.6524 17.5746 15.2983 17.3955L13.3946 16.2761C13.0847 16.097 12.8634 15.7388 12.8634 15.3358V13.903L11.1811 14.888V16.3656C11.1811 16.7239 11.3582 17.0821 11.7123 17.3059L15.2983 19.4104C15.6082 19.5895 16.0066 19.5895 16.3608 19.4104L19.9467 17.3059C20.2566 17.1268 20.4779 16.7686 20.4779 16.3656V12.1119C20.4779 11.7537 20.3009 11.3955 19.9467 11.1716L16.3608 9.06714Z" />
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
      <g clipPath="url(#clip0_1498_2147)">
        <path
          d="M11.5 12.5C12.8807 12.5 14 11.3807 14 10C14 8.61929 12.8807 7.5 11.5 7.5C10.1193 7.5 9 8.61929 9 10C9 11.3807 10.1193 12.5 11.5 12.5Z"
          stroke="#9075FE"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.81 15.25C13.8963 14.4429 12.7191 13.9975 11.5 13.9975C10.2809 13.9975 9.10374 14.4429 8.19 15.25M18 15V17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18H15M15 5H17C17.2652 5 17.5196 5.10536 17.7071 5.29289C17.8946 5.48043 18 5.73478 18 6V8M5 8V6C5 5.73478 5.10536 5.48043 5.29289 5.29289C5.48043 5.10536 5.73478 5 6 5H8M8 18H6C5.73478 18 5.48043 17.8946 5.29289 17.7071C5.10536 17.5196 5 17.2652 5 17V15"
          stroke="#9075FE"
          strokeLinecap="round"
          strokeLinejoin="round"
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
export const BackIcon: React.FunctionComponent<IconProps> = ({
  className,
  width,
  height,
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 11.5L5 15.5M5 15.5L9 19.5M5 15.5H16C17.0609 15.5 18.0783 15.0786 18.8284 14.3284C19.5786 13.5783 20 12.5609 20 11.5C20 10.4391 19.5786 9.42172 18.8284 8.67157C18.0783 7.92143 17.0609 7.5 16 7.5H15"
        stroke="#9075FE"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const NFTIcon: React.FunctionComponent<IconProps> = ({
  className,
  width,
  height,
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 20"
      fill="#A3A9B9"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.2088 1.97872C2.3213 1.74997 2.5688 1.61872 2.82005 1.65247L12.0001 2.79997L21.1801 1.65247C21.4313 1.62247 21.6788 1.75372 21.7913 1.97872L23.3551 5.10622C23.6926 5.77747 23.3326 6.59122 22.6126 6.79747L16.4851 8.54872C15.9638 8.69872 15.4051 8.47747 15.1276 8.01247L12.0001 2.79997L8.87255 8.01247C8.59505 8.47747 8.0363 8.69872 7.51505 8.54872L1.3913 6.79747C0.667551 6.59122 0.311301 5.77747 0.648801 5.10622L2.2088 1.97872ZM12.0413 5.19997L14.1001 8.62747C14.6588 9.55747 15.7726 9.99997 16.8188 9.69997L21.6001 8.33497V14.5975C21.6001 15.4225 21.0376 16.1425 20.2351 16.345L12.5813 18.2575C12.1988 18.355 11.7976 18.355 11.4188 18.2575L3.76505 16.345C2.96255 16.1387 2.40005 15.4187 2.40005 14.5937V8.33122L7.18505 9.69997C8.22755 9.99997 9.34505 9.55747 9.9038 8.62747L11.9588 5.19997H12.0413Z"
        
      />
    </svg>
  );
};
export const DownIcon: React.FunctionComponent<IconProps> = ({
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
      fill="#A3A9B9"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.375 6.21991L12 9.71791L7.625 6.21791C7.47784 6.10009 7.30037 6.02626 7.11306 6.00495C6.92576 5.98363 6.73624 6.0157 6.56637 6.09745C6.3965 6.17919 6.25319 6.30729 6.15298 6.46697C6.05277 6.62664 5.99974 6.8114 6 6.99991V12.9999C6.00009 13.1497 6.03384 13.2976 6.09875 13.4326C6.16366 13.5676 6.25806 13.6863 6.375 13.7799L11.375 17.7799C11.5524 17.9219 11.7728 17.9993 12 17.9993C12.2272 17.9993 12.4476 17.9219 12.625 17.7799L17.625 13.7799C17.7419 13.6863 17.8363 13.5676 17.9013 13.4326C17.9662 13.2976 17.9999 13.1497 18 12.9999V6.99991C17.9999 6.81157 17.9466 6.62708 17.8462 6.4677C17.7459 6.30832 17.6025 6.18052 17.4327 6.09901C17.2629 6.01751 17.0736 5.98562 16.8864 6.00701C16.6993 6.02839 16.522 6.10219 16.375 6.21991Z"
        
      />
    </svg>
  );
};
export const TokenIcon: React.FunctionComponent<IconProps> = ({
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
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.4 2.35001L6.25999 7.50001C6.05999 7.70001 6.05999 8.01001 6.25999 8.21001L7.98998 9.94001C8.18998 10.14 8.49998 10.14 8.69999 9.94001L13.85 4.79001C14.05 4.59001 14.05 4.28001 13.85 4.08001L12.12 2.35001C12.0225 2.25847 11.8937 2.20752 11.76 2.20752C11.6262 2.20752 11.4975 2.25847 11.4 2.35001Z"
        fill="#A3A9B9"
      />
      <path
        opacity="0.4"
        d="M15.3 6.26004L6.25999 15.3C6.05999 15.5 6.05999 15.81 6.25999 16.01L7.98998 17.74C8.18998 17.94 8.49998 17.94 8.69999 17.74L17.75 8.69004C17.95 8.49004 17.95 8.18004 17.75 7.98004L16.02 6.25004C15.9223 6.15754 15.7924 6.10682 15.658 6.10869C15.5235 6.11056 15.395 6.16487 15.3 6.26004Z"
        fill="#A3A9B9"
      />
      <path
        d="M19.21 10.162L10.16 19.212C9.96001 19.412 9.96001 19.722 10.16 19.922L11.89 21.652C12.09 21.852 12.4 21.852 12.6 21.652L21.65 12.602C21.85 12.402 21.85 12.092 21.65 11.892L19.92 10.162C19.72 9.96196 19.4 9.96196 19.21 10.162Z"
        fill="#A3A9B9"
      />
      <path
        opacity="0.4"
        d="M4.08996 13.84L2.35996 12.11C2.15996 11.91 2.15996 11.6 2.35996 11.4L4.08996 9.67002C4.28996 9.47002 4.59996 9.47002 4.79996 9.67002L6.52996 11.4C6.72996 11.6 6.72996 11.91 6.52996 12.11L4.79996 13.84C4.59996 14.04 4.27996 14.04 4.08996 13.84Z"
        fill="#A3A9B9"
      />
    </svg>
  );
};
export const TeleIcon: React.FunctionComponent<IconProps> = ({
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
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1425_4349)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.777 4.42997C20.0241 4.32596 20.2946 4.29008 20.5603 4.32608C20.826 4.36208 21.0772 4.46863 21.2877 4.63465C21.4982 4.80067 21.6604 5.02008 21.7574 5.27005C21.8543 5.52002 21.8825 5.79141 21.839 6.05597L19.571 19.813C19.351 21.14 17.895 21.901 16.678 21.24C15.66 20.687 14.148 19.835 12.788 18.946C12.108 18.501 10.025 17.076 10.281 16.062C10.501 15.195 14.001 11.937 16.001 9.99997C16.786 9.23897 16.428 8.79997 15.501 9.49997C13.198 11.238 9.50302 13.881 8.28102 14.625C7.20302 15.281 6.64102 15.393 5.96902 15.281C4.74302 15.077 3.60602 14.761 2.67802 14.376C1.42402 13.856 1.48502 12.132 2.67702 11.63L19.777 4.42997Z"
        />
      </g>
      <defs>
        <clipPath id="clip0_1425_4349">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
export const TwitterIcon: React.FunctionComponent<IconProps> = ({
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
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1425_4348)">
        <path d="M14.058 3.40989C12.251 4.17689 11.063 5.86289 11.002 7.78989L11 7.97189L10.757 7.94889C8.36496 7.67989 6.25896 6.43689 4.81296 4.41789C4.71504 4.28105 4.58418 4.17114 4.4325 4.09832C4.28082 4.0255 4.11321 3.99213 3.9452 4.00131C3.77719 4.01048 3.61422 4.0619 3.47136 4.1508C3.32851 4.2397 3.21039 4.36321 3.12796 4.50989L3.03096 4.69589L2.98196 4.79489C2.26296 6.27989 1.79196 8.08489 1.96496 9.99789L1.99496 10.2709C2.27796 12.5339 3.49496 14.4859 5.77396 15.9499L5.94696 16.0569L5.86596 16.0999C4.55096 16.7629 3.34796 17.0519 2.03896 16.9999C0.982958 16.9599 0.592958 18.3719 1.52096 18.8779C5.11896 20.8389 8.98196 21.4439 12.313 20.4779C16.373 19.2979 19.465 16.2549 20.648 12.0449L20.775 11.5499C21.013 10.5569 21.147 9.54389 21.176 8.52589L21.179 8.19389L21.572 7.41489L22.012 6.55289L22.226 6.11889L22.344 5.87189C22.609 5.30689 22.8 4.83889 22.918 4.44189L22.932 4.38589L22.94 4.36789C23.16 3.77489 22.774 3.00989 21.999 3.00989L21.877 3.01689C21.798 3.0266 21.7204 3.04574 21.646 3.07389L21.56 3.11189C21.2746 3.25048 20.9806 3.37072 20.68 3.47189L20.324 3.58689L20.053 3.66689L19.281 3.88089C17.945 2.76289 16.137 2.62689 14.269 3.32689L14.058 3.40989Z" />
      </g>
      <defs>
        <clipPath id="clip0_1425_4348">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
export const USDCIcon: React.FunctionComponent<IconProps> = ({
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
      fill="#636977"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1788_2862)">
        <path d="M9.421 3.31698C9.52411 3.56125 9.52599 3.83647 9.42623 4.08213C9.32646 4.32778 9.13323 4.52377 8.889 4.62698C7.43922 5.23898 6.20204 6.26481 5.33218 7.5762C4.46232 8.88759 3.99838 10.4263 3.99838 12C3.99838 13.5736 4.46232 15.1124 5.33218 16.4238C6.20204 17.7351 7.43922 18.761 8.889 19.373C9.01265 19.4222 9.12524 19.4956 9.22017 19.5889C9.31509 19.6821 9.39044 19.7934 9.4418 19.9162C9.49317 20.039 9.5195 20.1707 9.51928 20.3038C9.51905 20.4369 9.49226 20.5686 9.44048 20.6912C9.3887 20.8138 9.31297 20.9248 9.21773 21.0178C9.12249 21.1107 9.00965 21.1837 8.88583 21.2325C8.76201 21.2813 8.62969 21.3049 8.49664 21.3019C8.3636 21.2989 8.23249 21.2693 8.111 21.215C6.29934 20.4498 4.75343 19.1676 3.66653 17.5286C2.57962 15.8896 1.99996 13.9666 2 12C2 7.85498 4.522 4.29998 8.11 2.78498C8.23101 2.73377 8.36092 2.70691 8.49231 2.70594C8.6237 2.70496 8.754 2.72989 8.87575 2.7793C8.9975 2.8287 9.10832 2.90162 9.20188 2.99388C9.29544 3.08614 9.3699 3.19593 9.421 3.31698ZM15.889 2.78498C17.7007 3.55005 19.2467 4.83226 20.3336 6.47126C21.4206 8.11026 22.0002 10.0333 22 12C22 16.145 19.478 19.699 15.89 21.215C15.6457 21.3184 15.3704 21.3206 15.1245 21.221C14.8787 21.1214 14.6824 20.9282 14.579 20.684C14.4756 20.4397 14.4734 20.1644 14.573 19.9185C14.6726 19.6726 14.8657 19.4764 15.11 19.373C16.5598 18.761 17.797 17.7351 18.6668 16.4238C19.5367 15.1124 20.0006 13.5736 20.0006 12C20.0006 10.4263 19.5367 8.88759 18.6668 7.5762C17.797 6.26481 16.5598 5.23898 15.11 4.62698C14.8657 4.52355 14.6726 4.32731 14.573 4.08145C14.4734 3.83559 14.4756 3.56025 14.579 3.31598C14.6824 3.07172 14.8787 2.87855 15.1245 2.77896C15.3704 2.67938 15.6457 2.68155 15.89 2.78498H15.889ZM12 5.99998C12.2652 5.99998 12.5196 6.10534 12.7071 6.29287C12.8946 6.48041 13 6.73476 13 6.99998V7.99998H15C15.2652 7.99998 15.5196 8.10534 15.7071 8.29287C15.8946 8.48041 16 8.73476 16 8.99998C16 9.2652 15.8946 9.51955 15.7071 9.70709C15.5196 9.89462 15.2652 9.99998 15 9.99998H13V11H14C14.663 11 15.2989 11.2634 15.7678 11.7322C16.2366 12.2011 16.5 12.8369 16.5 13.5C16.5 14.163 16.2366 14.7989 15.7678 15.2677C15.2989 15.7366 14.663 16 14 16H13V17C13 17.2652 12.8946 17.5196 12.7071 17.7071C12.5196 17.8946 12.2652 18 12 18C11.7348 18 11.4804 17.8946 11.2929 17.7071C11.1054 17.5196 11 17.2652 11 17V16H9C8.73478 16 8.48043 15.8946 8.29289 15.7071C8.10536 15.5196 8 15.2652 8 15C8 14.7348 8.10536 14.4804 8.29289 14.2929C8.48043 14.1053 8.73478 14 9 14H11V13H10C9.33696 13 8.70107 12.7366 8.23223 12.2677C7.76339 11.7989 7.5 11.163 7.5 10.5C7.5 9.83694 7.76339 9.20105 8.23223 8.73221C8.70107 8.26337 9.33696 7.99998 10 7.99998H11V6.99998C11 6.73476 11.1054 6.48041 11.2929 6.29287C11.4804 6.10534 11.7348 5.99998 12 5.99998ZM14 13H13V14H14C14.1326 14 14.2598 13.9473 14.3536 13.8535C14.4473 13.7598 14.5 13.6326 14.5 13.5C14.5 13.3674 14.4473 13.2402 14.3536 13.1464C14.2598 13.0527 14.1326 13 14 13ZM11 9.99998H10C9.86739 9.99998 9.74021 10.0527 9.64645 10.1464C9.55268 10.2402 9.5 10.3674 9.5 10.5C9.5 10.6326 9.55268 10.7598 9.64645 10.8535C9.74021 10.9473 9.86739 11 10 11H11V9.99998Z" />
      </g>
      <defs>
        <clipPath id="clip0_1788_2862">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
export const USDTIcon: React.FunctionComponent<IconProps> = ({
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
      fill="#636977"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1788_2866)">
        <path d="M17.42 3C17.7725 3.00011 18.1187 3.09341 18.4236 3.27042C18.7285 3.44744 18.9811 3.70189 19.156 4.008L22.49 9.84C22.7076 10.2209 22.7939 10.6627 22.7357 11.0974C22.6775 11.5322 22.4781 11.9358 22.168 12.246L12.885 21.529C12.7689 21.6451 12.6311 21.7372 12.4794 21.8001C12.3277 21.8629 12.1652 21.8952 12.001 21.8952C11.8368 21.8952 11.6742 21.8629 11.5225 21.8001C11.3709 21.7372 11.233 21.6451 11.117 21.529L1.83397 12.246C1.52389 11.9358 1.3244 11.5322 1.26621 11.0974C1.20803 10.6627 1.29438 10.2209 1.51197 9.84L4.84497 4.007C5.01987 3.70123 5.27242 3.44707 5.57709 3.27024C5.88175 3.09341 6.22771 3.00019 6.57997 3H17.42ZM15 6H8.99997C8.74509 6.00028 8.49994 6.09788 8.3146 6.27285C8.12927 6.44782 8.01774 6.68695 8.0028 6.94139C7.98786 7.19584 8.07065 7.44638 8.23424 7.64183C8.39783 7.83729 8.62988 7.9629 8.88297 7.993L8.99997 8H11V9.545C10.242 9.615 9.55297 9.762 8.99597 9.971C8.60097 10.119 8.24697 10.307 7.98297 10.542C7.71897 10.776 7.49997 11.099 7.49997 11.5C7.49997 11.901 7.71897 12.224 7.98297 12.458C8.24697 12.693 8.60097 12.881 8.99597 13.028C9.58997 13.251 10.334 13.405 11.153 13.468C11.0738 13.594 11.0239 13.7362 11.007 13.884L11 14V16C11.0003 16.2549 11.0979 16.5 11.2728 16.6854C11.4478 16.8707 11.6869 16.9822 11.9414 16.9972C12.1958 17.0121 12.4464 16.9293 12.6418 16.7657C12.8373 16.6021 12.9629 16.3701 12.993 16.117L13 16V14C13.0003 13.8118 12.9473 13.6273 12.847 13.468C13.666 13.405 14.41 13.252 15.004 13.028C15.399 12.881 15.753 12.693 16.017 12.458C16.281 12.224 16.5 11.901 16.5 11.5C16.5 11.099 16.281 10.776 16.017 10.542C15.753 10.307 15.399 10.119 15.004 9.972C14.46 9.77687 13.8952 9.64533 13.321 9.58L13 9.545V8H15C15.2549 7.99972 15.5 7.90212 15.6853 7.72715C15.8707 7.55218 15.9822 7.31305 15.9971 7.05861C16.0121 6.80416 15.9293 6.55362 15.7657 6.35817C15.6021 6.16271 15.3701 6.0371 15.117 6.007L15 6ZM12.999 10.55C13.563 10.5996 14.1187 10.7195 14.653 10.907C14.982 11.031 15.213 11.166 15.353 11.29C15.4137 11.3367 15.4619 11.3979 15.493 11.468L15.5 11.5L15.493 11.532C15.4619 11.6021 15.4137 11.6633 15.353 11.71C15.213 11.834 14.982 11.97 14.653 12.092C13.998 12.338 13.06 12.5 12 12.5C10.94 12.5 10.002 12.338 9.34697 12.092C9.01797 11.969 8.78697 11.834 8.64597 11.71C8.5852 11.6633 8.53708 11.6021 8.50597 11.532L8.49997 11.5C8.49997 11.487 8.50497 11.415 8.64597 11.29C8.78597 11.166 9.01797 11.03 9.34697 10.908C9.78697 10.743 10.354 10.615 11.001 10.55C11.0125 10.8072 11.1228 11.0501 11.3089 11.228C11.4949 11.406 11.7425 11.5053 12 11.5053C12.2574 11.5053 12.505 11.406 12.6911 11.228C12.8772 11.0501 12.9875 10.8072 12.999 10.55Z" />
      </g>
      <defs>
        <clipPath id="clip0_1788_2866">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
export const MaticIcon: React.FunctionComponent<IconProps> = ({
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
      fill="#636977"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16.3605 9.06714C16.0506 8.88804 15.6522 8.88804 15.298 9.06714L12.8188 10.5448L11.1366 11.4851L8.70166 12.9627C8.39176 13.1418 7.99333 13.1418 7.63916 12.9627L5.73551 11.7985C5.42562 11.6194 5.20426 11.2612 5.20426 10.8582V8.61938C5.20426 8.26117 5.38135 7.90296 5.73551 7.67908L7.63916 6.55968C7.94906 6.38057 8.34749 6.38057 8.70166 6.55968L10.6053 7.72386C10.9152 7.90296 11.1366 8.26117 11.1366 8.66416V10.1418L12.8188 9.15669V7.6343C12.8188 7.2761 12.6418 6.91789 12.2876 6.69401L8.74593 4.58953C8.43604 4.41042 8.0376 4.41042 7.68343 4.58953L4.05322 6.73878C3.69906 6.91789 3.52197 7.2761 3.52197 7.6343V11.8433C3.52197 12.2015 3.69906 12.5597 4.05322 12.7836L7.63916 14.888C7.94906 15.0671 8.34749 15.0671 8.70166 14.888L11.1366 13.4552L12.8188 12.4701L15.2537 11.0373C15.5636 10.8582 15.9621 10.8582 16.3162 11.0373L18.2199 12.1567C18.5298 12.3358 18.7511 12.694 18.7511 13.097V15.3358C18.7511 15.694 18.5741 16.0522 18.2199 16.2761L16.3605 17.3955C16.0506 17.5746 15.6522 17.5746 15.298 17.3955L13.3944 16.2761C13.0845 16.097 12.8631 15.7388 12.8631 15.3358V13.903L11.1808 14.888V16.3656C11.1808 16.7239 11.3579 17.0821 11.7121 17.3059L15.298 19.4104C15.6079 19.5895 16.0063 19.5895 16.3605 19.4104L19.9465 17.3059C20.2563 17.1268 20.4777 16.7686 20.4777 16.3656V12.1119C20.4777 11.7537 20.3006 11.3955 19.9465 11.1716L16.3605 9.06714Z" />
    </svg>
  );
};
export const PoolIcon: React.FunctionComponent<IconProps> = ({
  className,
  width,
  height,
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 25"
      fill="#636977"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M20.36 13.232C19.99 13.232 19.68 12.952 19.64 12.582C19.5219 11.4959 19.1714 10.4479 18.6123 9.50926C18.0532 8.5706 17.2987 7.76324 16.4 7.14203C16.3216 7.08774 16.2547 7.01848 16.2032 6.93824C16.1517 6.858 16.1166 6.76836 16.0998 6.67448C16.0831 6.58061 16.0851 6.48435 16.1057 6.39125C16.1263 6.29815 16.1652 6.21005 16.22 6.13203C16.45 5.80203 16.9 5.72203 17.23 5.95203C18.2986 6.69411 19.1959 7.65633 19.8617 8.77404C20.5275 9.89174 20.9463 11.139 21.09 12.432C21.13 12.832 20.84 13.192 20.44 13.232H20.36ZM3.74 13.281H3.67C3.47784 13.2608 3.30152 13.1653 3.17967 13.0154C3.05783 12.8654 3.00041 12.6732 3.02 12.481C3.1532 11.1906 3.56127 9.94373 4.21674 8.82426C4.87221 7.70478 5.75988 6.7387 6.82 5.99103C7.14 5.76103 7.6 5.84103 7.83 6.16103C8.06 6.49103 7.98 6.94103 7.66 7.17103C6.77016 7.79921 6.0251 8.61058 5.47487 9.55061C4.92465 10.4907 4.58202 11.5376 4.47 12.621C4.43 13.001 4.11 13.281 3.74 13.281ZM15.99 21.6C14.76 22.19 13.44 22.49 12.06 22.49C10.62 22.49 9.25 22.17 7.97 21.52C7.88462 21.4781 7.80846 21.4195 7.746 21.3478C7.68353 21.2761 7.636 21.1926 7.6062 21.1023C7.5764 21.0119 7.56492 20.9166 7.57244 20.8217C7.57996 20.7269 7.60633 20.6345 7.65 20.55C7.82 20.19 8.26 20.05 8.62 20.22C9.25 20.54 9.92 20.76 10.6 20.89C11.52 21.07 12.46 21.08 13.38 20.92C14.06 20.8 14.73 20.59 15.35 20.29C15.72 20.12 16.16 20.26 16.32 20.63C16.5 20.99 16.36 21.43 15.99 21.6Z"

      />
      <path
        d="M12.05 2.51196C10.5 2.51196 9.22998 3.77196 9.22998 5.33196C9.22998 6.89196 10.49 8.15196 12.05 8.15196C13.61 8.15196 14.87 6.89196 14.87 5.33196C14.87 3.77196 13.61 2.51196 12.05 2.51196ZM5.04998 14.371C3.49998 14.371 2.22998 15.631 2.22998 17.191C2.22998 18.751 3.48998 20.011 5.04998 20.011C6.60998 20.011 7.86998 18.751 7.86998 17.191C7.86998 15.631 6.59998 14.371 5.04998 14.371ZM18.95 14.371C17.4 14.371 16.13 15.631 16.13 17.191C16.13 18.751 17.39 20.011 18.95 20.011C20.51 20.011 21.77 18.751 21.77 17.191C21.77 15.631 20.51 14.371 18.95 14.371Z"

      />
    </svg>
  );
};
