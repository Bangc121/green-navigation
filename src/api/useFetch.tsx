import { useEffect, useState } from 'react';

const useFetch = (endpointFn, payload) => {
  const [state, setState] = useState({ data: null, loading: true });

  useEffect(() => {
    setState(state => ({ data: state.data, loading: true }));
    endpointFn(payload).then(res => {
      setState({ data: res, loading: false });
    });
  }, [endpointFn, payload, setState]);

  return state;
};

export default useFetch;
