const gitlabAPIURLs = {
  user: "user",
  users:
    "users?active=true&without_project_bots=true&exclude_external=true&order_by=name&sort=asc&per_page=60",
  projects:
    "users/:user_id/contributed_projects?order_by=name&sort=asc&per_page=60",
  issues:
    "issues?assignee_id=:user_id&order_by=updated_at&sort=desc&state=opened&per_page=60",
  events: "users/:user_id/events?per_page=100",
};

const fetchFromGitlab = async (url: string, token: string) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Private-Token": token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
    return null;
  }
};

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

const chunkArray = (array: any, size: number) => {
  return array.reduce((acc: any, item: any, index: number) => {
    const chunkIndex = Math.floor(index / size);

    if (!acc[chunkIndex]) {
      acc[chunkIndex] = []; // Start a new chunk
    }

    acc[chunkIndex].push(item); // Add item to the chunk

    return acc;
  }, []);
};

export {
  getStorage,
  setStorage,
  getDomainFromURL,
  gitlabAPIURLs,
  chunkArray,
  fetchFromGitlab,
};
