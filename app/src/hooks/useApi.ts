import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import APIClient from "../services/api-client";
import ms from "ms";

// TODO: see if you can get rid of the @ts-ignore in this file
// Problem: R extends T and adds an id
// I thought useMutation would be able to take R and T separately, but for some reason, that doesn't work out

export default class UseAPI<T, R extends T> {
  service: APIClient<T, R>;
  cacheKey: (string | number)[];

  constructor(service: APIClient<T, R>, cacheKey: string[]) {
    this.service = service;
    this.cacheKey = cacheKey;
  }

  useData = (id?: number) => {
    if (!id) return {} as UseQueryResult<R, Error>;
    const singleCacheKey = [...this.cacheKey];
    // @ts-ignore
    singleCacheKey.push(id);
    return useQuery<R, Error>({
      queryKey: singleCacheKey,
      queryFn: () => this.service.get(id),
      staleTime: ms("24h"),
    });
  };

  useDataList = () =>
    useQuery<R[], Error>({
      queryKey: this.cacheKey,
      queryFn: this.service.getAll,
      staleTime: ms("24h"),
    });

  useAdd = (onAdd?: () => void) => {
    interface AddDataContext {
      prevData: R[];
    }
    const queryClient = useQueryClient();

    const addData = useMutation<R, Error, R, AddDataContext>({
      mutationFn: (data: T) => this.service.post(data),
      onMutate: (newData: R) => {
        const prevData = queryClient.getQueryData<R[]>(this.cacheKey) || [];
        queryClient.setQueryData<R[]>(this.cacheKey, (dataList = []) => [
          newData,
          ...dataList,
        ]);
        if (onAdd) onAdd();
        return { prevData };
      },
      onSuccess: (savedData, newData) => {
        queryClient.setQueryData<R[]>(this.cacheKey, (dataList) =>
          // @ts-ignore
          dataList?.map((data) => (data.id === 0 ? savedData : data))
        );
      },
      onError: (error, newData, context) => {
        if (!context) return;
        queryClient.setQueryData<R[]>(this.cacheKey, () => context.prevData);
      },
    });

    return addData;
  };

  useUpdate = (onUpdate?: () => void) => {
    interface UpdateDataContext {
      prevDataList: R[];
      prevData?: R;
    }
    const queryClient = useQueryClient();

    const udpateData = useMutation<R, Error, R, UpdateDataContext>({
      // @ts-ignore
      mutationFn: (data: R) => this.service.put(data.id, data),
      onMutate: (newData: R) => {
        // Update in list
        const prevDataList = queryClient.getQueryData<R[]>(this.cacheKey) || [];
        queryClient.setQueryData<R[]>(this.cacheKey, (dataList = []) =>
          // @ts-ignore
          dataList.map((data) => (data.id === newData.id ? newData : data))
        );

        // Also update individual data cache
        const singleCacheKey = [...this.cacheKey];
        // @ts-ignore
        singleCacheKey.push(newData.id);
        const prevData = queryClient.getQueryData<R[]>(singleCacheKey);
        if (prevData) queryClient.setQueryData<R>(singleCacheKey, newData);

        if (onUpdate) onUpdate();
        return { prevDataList, prevData } as UpdateDataContext;
      },
      onError: (error, newData, context) => {
        if (!context) return;
        queryClient.setQueryData<R[]>(
          this.cacheKey,
          () => context.prevDataList
        );

        if (context.prevData) {
          const singleCacheKey = [...this.cacheKey];
          // @ts-ignore
          singleCacheKey.push(context.prevData.id);
          queryClient.setQueryData<R>(singleCacheKey, () => context.prevData);
        }
      },
    });

    return udpateData;
  };

  useDelete = (onDelete?: () => void) => {
    interface DeleteDataContext {
      prevData: R[];
    }
    const queryClient = useQueryClient();

    const deleteData = useMutation<any, Error, any, DeleteDataContext>({
      mutationFn: (dataId: number) => this.service.delete(dataId),
      onMutate: (dataId: number) => {
        const prevData = queryClient.getQueryData<R[]>(this.cacheKey) || [];
        queryClient.setQueryData<R[]>(this.cacheKey, (dataList = []) =>
          // @ts-ignore
          dataList.filter((data) => data.id !== dataId)
        );
        if (onDelete) onDelete();
        return { prevData };
      },
      onError: (error, newData, context) => {
        if (!context) return;
        queryClient.setQueryData<R[]>(this.cacheKey, () => context.prevData);
      },
    });

    return deleteData;
  };
}
