import { createApi } from '@reduxjs/toolkit/query/react';
import { noop } from 'lodash';

export const api = createApi({
  reducerPath: 'ipcApi',
  endpoints: (build) => ({
    getCadence: build.query({
      queryFn: () => 0,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let removeListener = noop;
        try {
          await cacheDataLoaded;
          const listener = (rpmValue) => {
            updateCachedData(() => {
              return rpmValue;
            });
          };
          removeListener = window.electron.ipcRenderer.on(
            'ipc-example',
            listener
          );
        } catch (error) {
          console.log('ipc error', error);
        }

        await cacheEntryRemoved;
        removeListener();
      },
    }),
  }),
});

export const { useGetCadenceQuery } = api;
