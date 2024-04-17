# use-react-api-request

Package that allows to easily process simple requests

## Setup

```shell
npm i use-react-api-request
```

```tsx
import axios from 'axios';
import { setupGlobals } from 'use-react-api-request';

// or any other API-client that you use
setupGlobals({ isCancel: axios.isCancel });
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
      deps: ['will trigger if this changes'],
    }
  );

  const onClick = () => handleRequest('Addition');
};
```
