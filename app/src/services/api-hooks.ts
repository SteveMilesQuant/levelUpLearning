import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import APIClient from "./api-client";

// TODO: see if you can get rid of the @ts-ignore in this file
// Problem: R extends T and adds an id
// I thought useMutation would be able to take R and T separately, but for some reason, that doesn't work out

export default class APIHooks<T, R extends T> {
  client: APIClient<T, R>;
  cacheKey: (string | number)[];
  staleTime: number;

  constructor(client: APIClient<T, R>, cacheKey: string[], staleTime: number) {
    this.client = client;
    this.cacheKey = cacheKey;
    this.staleTime = staleTime;
  }

  useData = (id?: number) => {
    if (!id) return {} as UseQueryResult<R, Error>;
    const singleCacheKey = [...this.cacheKey];
    // @ts-ignore
    singleCacheKey.push(id);
    return useQuery<R, Error>({
      queryKey: singleCacheKey,
      queryFn: () => this.client.get(id),
      staleTime: this.staleTime,
    });
  };

  useDataList = () =>
    useQuery<R[], Error>({
      queryKey: this.cacheKey,
      queryFn: this.client.getAll,
      staleTime: this.staleTime,
    });

  useAdd = (onAdd?: () => void) => {
    interface AddDataContext {
      prevData: R[];
    }
    const queryClient = useQueryClient();

    const addData = useMutation<R, Error, R, AddDataContext>({
      mutationFn: (data: T) => this.client.post(data),
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
      mutationFn: (data: R) => this.client.put(data.id, data),
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
      mutationFn: (dataId: number) => this.client.delete(dataId),
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
