import SingletonRouter, { Router } from 'next/router';
import { useEffect } from 'react';

export function usePreventUserFromErasingContent(shouldPreventLeaving:boolean) {
  const stringToDisplay = 'Do you want to save before leaving the page ?';

  useEffect(() => {
    // Prevents tab quit / tab refresh
    if (shouldPreventLeaving) {
      // Adding window alert if the shop quits without saving
      window.onbeforeunload = function () {
        return stringToDisplay;
      };
    } else {
      window.onbeforeunload = () => {};
    }

    if (shouldPreventLeaving) {
      // Prevents next routing
      // @ts-ignore
      SingletonRouter.router.change = (...args:any) => {
        if (confirm(stringToDisplay)) {
            // @ts-ignore
          return Router.prototype.change.apply(SingletonRouter.router, args);
        } else {
          return new Promise((resolve, reject) => resolve(false));
        }
      };
    }
    return () => {
        // @ts-ignore
      delete SingletonRouter.router.change;
    };
  }, [shouldPreventLeaving]);
}