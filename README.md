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
