import { DependencyList, useEffect, useState } from 'react';

export interface IUseFetchInput<T = unknown, P = unknown, H = T> {
  dependencies?: DependencyList | false;
  initialValue?: H;
  payload?: P;
  fetcher: (payload: P) => Promise<T>;
  handleError?: (error: unknown) => void;
  handleResponse?: ((newRes: T, oldRes: H) => H) | ((newRes: T) => H);
}

export const useFetch = <
  TypeOfResponse = unknown,
  TypeOfPayload = unknown,
  TypeOfData = TypeOfResponse
>({
  dependencies = [],
  initialValue = {} as TypeOfData,
  payload = null as TypeOfPayload,
  fetcher,
  handleError,
  handleResponse = (newRes: TypeOfResponse) => newRes as unknown as TypeOfData,
}: IUseFetchInput<TypeOfResponse, TypeOfPayload, TypeOfData>) => {
  const [data, setData] = useState(initialValue as TypeOfData);
  const [isFetching, setIsFetching] = useState(false);
  const [isErrorFetching, setIsErrorFetching] = useState<boolean>();

  let isSubscribed = true;

  const fetch = async (payloadData: TypeOfPayload | undefined = undefined) => {
    // Reset isErrorFetching=false when retry request
    setIsErrorFetching(false);

    setIsFetching(true);

    try {
      const response = await fetcher(payloadData as TypeOfPayload);

      const fetchedData = handleResponse(response, data);

      if (isSubscribed) {
        setData(fetchedData);
      }

      return fetchedData;
    } catch (error) {
      setIsErrorFetching(true);
      handleError?.(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!dependencies) return;

    fetch(payload);

    return () => {
      isSubscribed = false;
    };
  }, dependencies || []);

  return { data, isFetching, isErrorFetching, fetch };
};
