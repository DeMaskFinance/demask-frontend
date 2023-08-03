export const getCookie = (name: string): string | undefined => {
    if (typeof window === "undefined") return undefined;
    const cookieStr = document.cookie;
    const cookies = cookieStr.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    }, {} as { [key: string]: string });
    return cookies[name];
  };
  
  export const setCookie = (
    name: string,
    value: string,
    options?: { [key: string]: string | number | boolean }
  ): void => {
    if (typeof window === "undefined") return;
  
    let cookieStr = `${name}=${value}`;
  
    if (options) {
      for (const optionKey in options) {
        cookieStr += `; ${optionKey}`;
        const optionValue = options[optionKey];
        if (optionValue !== true) {
          cookieStr += `=${optionValue}`;
        }
      }
    }
  
    document.cookie = cookieStr;
  };
  