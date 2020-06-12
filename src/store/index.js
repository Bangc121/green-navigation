import {useCallback, useState} from 'react';
import {createContainer} from 'unstated-next';

const useStoreContainer = () => {
  const [userInfo, setUserInfo] = useState({
    email: null,
    username: null,
    isSNSSignIn: false,
    snsType: null,
    uniqId: null,
  });

  const _handleUserInfo = useCallback(
    (userProp, value) =>
      setUserInfo((prevState) => ({
        ...prevState,
        [userProp]: value,
      })),
    [],
  );

  return {
    userInfo,
    _handleUserInfo,
  };
};

const StoreState = createContainer(useStoreContainer);

export default StoreState;
