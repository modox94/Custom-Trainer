import { noop } from "lodash";

export const getBuilderQueryOpt = (getEvent, watchEvent) => {
  return {
    queryFn: async () => {
      const data = await window.electron.ipcRenderer.invoke(getEvent);
      return { data };
    },
    async onCacheEntryAdded(
      arg,
      { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
    ) {
      let removeListener = noop;
      try {
        await cacheDataLoaded;
        const listener = storeData => updateCachedData(() => storeData);
        removeListener = window.electron.ipcRenderer.on(watchEvent, listener);
      } catch (error) {
        console.log("ipc error", error);
      }

      await cacheEntryRemoved;
      removeListener();
    },
  };
};
