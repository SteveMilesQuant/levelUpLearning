import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import APIClient from "./api-client";

export interface AddDataContext<S> {
  prevData: S[];
}

export interface UpdateDataContext<S> {
  prevDataList: S[];
  prevData?: S;
}

export interface DeleteDataContext<S> {
  prevData: S[];
}

interface A {
  id: number;
}

// Typical API hooks (S: response body; Q: request body)
export default class APIHooks<S extends A, Q = S> {
  client: APIClient<S, Q>;
  cacheKey: (string | number)[];
  staleTime: number;

  constructor(client: APIClient<S, Q>, cacheKey: string[], staleTime: number) {
    this.client = client;
    this.cacheKey = cacheKey;
    this.staleTime = staleTime;
  }

  useData = (id?: number) => {
    if (!id) return {} as UseQueryResult<S, Error>;
    const singleCacheKey = [...this.cacheKey];
    singleCacheKey.push(id);
    return useQuery<S, Error>({
      queryKey: singleCacheKey,
      queryFn: () => this.client.get(id),
      staleTime: this.staleTime,
    });
  };

  useDataList = () =>
    useQuery<S[], Error>({
      queryKey: this.cacheKey,
      queryFn: this.client.getAll,
      staleTime: this.staleTime,
    });

  useAdd = (
    onAdd?: () => void,
    queryMutation?: (newData: Q, dataList: S[]) => S[]
  ) => {
    const queryClient = useQueryClient();

    const addData = useMutation<S, Error, Q, AddDataContext<S>>({
      mutationFn: (data: Q) => this.client.post(data),
      onMutate: (newData: Q) => {
        const prevData = queryClient.getQueryData<S[]>(this.cacheKey) || [];
        queryClient.setQueryData<S[]>(this.cacheKey, (dataList = []) => {
          if (queryMutation) {
            return queryMutation(newData, dataList);
          } else {
            return [{ id: 0, ...newData } as unknown as S, ...dataList];
          }
        });
        if (onAdd) onAdd();
        return { prevData };
      },
      onSuccess: (savedData, newData) => {
        queryClient.setQueryData<S[]>(this.cacheKey, (dataList) =>
          dataList?.map((data) => (data.id === 0 ? savedData : data))
        );
      },
      onError: (error, newData, context) => {
        if (!context) return;
        queryClient.setQueryData<S[]>(this.cacheKey, () => context.prevData);
      },
    });

    return addData;
  };

  useUpdate = (onUpdate?: () => void) => {
    const queryClient = useQueryClient();

    const udpateData = useMutation<S, Error, S, UpdateDataContext<S>>({
      mutationFn: (data: S) =>
        this.client.put(data.id, { ...data } as unknown as Q),
      onMutate: (newData: S) => {
        // Update in list
        const prevDataList = queryClient.getQueryData<S[]>(this.cacheKey) || [];
        queryClient.setQueryData<S[]>(this.cacheKey, (dataList = []) =>
          dataList.map((data) => (data.id === newData.id ? newData : data))
        );

        // Also update individual data cache
        const singleCacheKey = [...this.cacheKey];
        singleCacheKey.push(newData.id);
        const prevData = queryClient.getQueryData<S[]>(singleCacheKey);
        if (prevData) queryClient.setQueryData<S>(singleCacheKey, newData);

        if (onUpdate) onUpdate();
        return { prevDataList, prevData } as UpdateDataContext<S>;
      },
      onError: (error, newData, context) => {
        if (!context) return;
        queryClient.setQueryData<S[]>(
          this.cacheKey,
          () => context.prevDataList
        );

        if (context.prevData) {
          const singleCacheKey = [...this.cacheKey];
          singleCacheKey.push(context.prevData.id);
          queryClient.setQueryData<S>(singleCacheKey, () => context.prevData);
        }
      },
    });

    return udpateData;
  };

  useDelete = (onDelete?: () => void) => {
    const queryClient = useQueryClient();

    const deleteData = useMutation<any, Error, any, DeleteDataContext<S>>({
      mutationFn: (dataId: number) => this.client.delete(dataId),
      onMutate: (dataId: number) => {
        const prevData = queryClient.getQueryData<S[]>(this.cacheKey) || [];
        queryClient.setQueryData<S[]>(this.cacheKey, (dataList = []) =>
          dataList.filter((data) => data.id !== dataId)
        );
        if (onDelete) onDelete();
        return { prevData };
      },
      onError: (error, newData, context) => {
        if (!context) return;
        queryClient.setQueryData<S[]>(this.cacheKey, () => context.prevData);
      },
    });

    return deleteData;
  };
}
