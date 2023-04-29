import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import ms from "ms";

export default class UseAPI<T, R extends T> {
  service: APIClient<T, R>;
  cacheKey: string[];

  constructor(service: APIClient<T, R>, cacheKey: string[]) {
    this.service = service;
    this.cacheKey = cacheKey;
  }

  useData = () =>
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
        queryClient.setQueryData<R[]>(this.cacheKey, (data = []) => [
          newData,
          ...data,
        ]);
        if (onAdd) onAdd();
        return { prevData };
      },
      onSuccess: (savedData, newData) => {
        queryClient.setQueryData<R[]>(this.cacheKey, (data) =>
          data?.map((data) => (data === newData ? savedData : data))
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
      prevData: R[];
    }
    const queryClient = useQueryClient();
    const udpateData = useMutation<R, Error, R, UpdateDataContext>({
      // @ts-ignore
      mutationFn: (data: R) => this.service.put(data.id, data),
      onMutate: (newData: R) => {
        const prevData = queryClient.getQueryData<R[]>(this.cacheKey) || [];
        queryClient.setQueryData<R[]>(this.cacheKey, (data = []) =>
          // @ts-ignore
          data.map((s) => (s.id === newData.id ? newData : s))
        );
        if (onUpdate) onUpdate();
        return { prevData };
      },
      onError: (error, newData, context) => {
        if (!context) return;
        queryClient.setQueryData<R[]>(this.cacheKey, () => context.prevData);
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
        queryClient.setQueryData<R[]>(this.cacheKey, (data = []) =>
          // @ts-ignore
          data.filter((s) => s.id !== dataId)
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
