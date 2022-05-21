import React, { useEffect, useState } from 'react';
import {loadingService} from "../services/loading";
import Spinner from "./Spinner";

const Loading = () => {
  const [show, setShow] = useState(false);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    setSubscription(loadingService.init().subscribe((data) => {
      setShow(data);
    }));

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <div className={`loading-content ${show ? 'd-flex' : ''}`}>
    <Spinner color="white"/>
  </div>
};

export default Loading;
