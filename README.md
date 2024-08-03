# use-react-api-request

Package that allows to easily process simple requests

## Setup

```shell
npm i use-react-api-request
```

```tsx
import axios from 'axios';
import { setupGlobals } from 'use-react-api-request';

setupGlobals({
  // or any other API-client that you use
  isCancel: axios.isCancel,
  // you can throw errors here
  // I use it to handle { data: {}, error: string } results, etc.
  resultMiddleware: result => console.log(result),
});
```

```tsx
import { useRequest } from 'use-react-api-request';

const Component = () => {
  const [handleRequest, loading] = useRequest(
    (signal: AbortSignal, addition: string) =>
      callApi(signal, { params: 'test', addition }),
    {
      onError: () => {},
      onFinally: () => {},
      onSuccess: () => {},
      resultMiddleware: (result: object) => {
      }
      deps: ['will cancel out if this changes'],
    }
  );

  const onClick = () => handleRequest('Addition');
};
```

## Cancelable Promise

If your request is cancelable Promise - return it with 'cancel' function attached
