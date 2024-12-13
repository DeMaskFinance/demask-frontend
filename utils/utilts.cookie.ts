export const getCookie = (key: string) => {
  const match =
    typeof window !== "undefined"
      ? document.cookie.match(new RegExp(`(^| )${key}=([^;]+)`))
      : undefined;

  return match?.[2];
};

export const setCookie = ({
  expires,
  key,
  value,
}: {
  expires?: string | number | Date;
  key: string;
  value: string;
}) => {
  return (document.cookie = `${key}=${value}; expires=${expires}; path=/`);
};

export const deleteCookie = (key: string) => {
  document.cookie = `${key}=; expires=${new Date(1)}; path=/`;

  return key;
};
