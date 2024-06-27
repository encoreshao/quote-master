const getStorage = (
  keys: string | string[] | PlainObjectType,
  callback: (v: any) => any
) => {
  if (chrome.storage) {
    chrome.storage.local.get(keys, (result: any) => callback(result));
  } else {
    callback(keys);
  }
};

const setStorage = (obj: PlainObjectType, callback?: () => any) => {
  if (chrome.storage) {
    chrome.storage.local.set(obj, callback ?? (() => {}));
  } else {
    callback?.();
  }
};

export { getStorage, setStorage };
