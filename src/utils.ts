const getStorage = (
  keys: string | string[] | PlainObjectType,
  callback: (v: any) => any
) => {
  if (chrome.storage) {
    chrome.storage.local.get(keys, (result: any) => callback(result));
  } else {
    console.log("Local storage is not available in this browser.");

    callback(keys);
  }
};

const setStorage = (obj: PlainObjectType, callback?: () => any) => {
  if (chrome.storage) {
    chrome.storage.local.set(obj, callback ?? (() => {}));
  } else {
    console.log("Local storage is not available in this browser.");

    callback?.();
  }
};

const getDomainFromURL = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch (error) {
    console.error("Invalid URL:", error);
    return "";
  }
};

export { getStorage, setStorage, getDomainFromURL };
