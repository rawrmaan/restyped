# RESTyped

## Motivation
Typescript is a one-way street: Once you start using it, it's hard to go back to plain JS. In fact, you'll probably want to write your entire application in TypeScript.

After happily typing all of your models, you notice that there's a disconnect: Your types don't make it over the wire! The server doesn't check types before it sends an HTTP response, and the client doesn't know what types it's receiving. Conversely, the server doesn't know what types it should receive, and the client doesn't know what to send.

RESTyped was designed to brige the gap by creating an easy way to share types across your API server and any public or private clients.

## How to use it
RESTyped is a specification. Once you spend a few minutes typing your API, you can use these server and client wrappers to serve and consume your API in a type-safe manner:

- [restyped-axios](https://githob.com/rawrmaan/restyped-axios) - Client wrapper for Axios to consume RESType-specced APIs
- [restyped-express](https://github.com/rawrmaan/restyped-express) - Server wrapper for express to deliver RESTyped-specced APIs

You can help make RESTyped more useful by typing your favorite server framework or HTTP client!

## Specification

It's very easy to get started with RESTyped. It should take you less than one minute per route.

## Example

### 1. API Definition (`api.d.ts`)
```typescript
export interface FoodDeliveryAPI {
  '/order': {
    POST: {
      body: {
        foodItemId: string
        address: string
      }
      response: {
        success: boolean
      }
    }
  }
}
```

### 2. Serve the API via express

```typescript
import {AsyncRouter} from 'restyped-express'
import {FoodDeliveryAPI} from './api.d.ts'

import OrderModel from './controllers/order'

const route = AsyncRouter<FoodDeliveryAPI>('/api/')

route.post('/order', async (req) => {
  const {foodItemId, address} = req.body
  const success = await OrderModel.order(foodItemId, address)
  return {success}
})
```

### 3. Consume the API via axios

```typescript
import axios from 'restyped-axios'
import {FoodDeliveryAPI} from './api.d.ts'

const api = axios.create({baseURL: 'https://fooddelivery.com/api/'})

async function order() {
  const res = await api.post(
    '/order',
    {
      foodItemId: 123,
      address: '1601 Market St, Phiadelphia, PA 19103'
    }
  )
}
```