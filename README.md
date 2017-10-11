<p align="center">
  <img src="/images/logo.png" width="350"/>
</p>
<p align="center">
  End-to-end typing for REST APIs with TypeScript
</p>

## Motivation
Read the [blog post](https://blog.falcross.com/)

Typescript is a one-way street: Once you start using it, it's hard to go back to plain JS. In fact, you'll probably want to write your entire application in TypeScript.

After happily typing all of your models, you notice that there's a disconnect: Your types don't make it over the wire! The server doesn't check types before it sends an HTTP response, and the client doesn't know what types it's receiving. Conversely, the server doesn't know what types it should receive, and the client doesn't know what to send.

RESTyped was designed to brige the gap by creating an easy way to share types across your API server and any public or private clients.

## Benefits

- **End to end typing.** Share request and response types between your client and server for ease of use and peace of mind
- **Unopinionated.** Works with any new or existing REST API
- **Universal.** Can support any server framework or REST client
- **Lightweight.** Most server and client implementations don't even add any code--just types
- **Use existing syntax.** Declare and call your HTTP routes the same way you always have
- **Great for private APIs.** Keep API clients across your organization in sync with the latest changes
- **Great for public APIs.** Create an API definition so TypeScript users can consume your API fully typed
- **Easy to learn and use.** Start using RESTyped in typically less than one minute per route

## How to use it
RESTyped is a specification. Once you spend a few minutes typing your API using the specification below, you can use these server and client wrappers to declare and consume your API in a type-safe manner:

- [restyped-axios](https://github.com/rawrmaan/restyped-axios) - Client wrapper for Axios to consume RESTyped APIs
- [restyped-express](https://github.com/rawrmaan/restyped-express) - Server wrapper for express to deliver RESTyped APIs

You can help make RESTyped more useful by typing your favorite server framework or HTTP client!

***RESTyped requires TypeScript 2.4 or higher.***

## Specification

It's very easy to get started with RESTyped. Just follow a few steps to type your existing API or create a new typed API:

- Your API should be defined in one interface, exported as `{my_api_name}API` from a file ending in `.d.ts`
- Each route is a top level key in the interface. You should exclude any prefixes like `/api/`.
- Each route can have up to one key per valid HTTP method:
  - `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, or `HEAD`
- Each HTTP method can have one or more of the following keys:
  - `params`: Route params in the URL (e.g. `/users/:id` would have `id` as a param)
  - `query`: Query string params, typically used in `GET` requests (e.g. `req.query` in express)
  - `body`: JSON body object (e.g. `req.body` in express or `data` object in an axios request)
  - `response`: The route's JSON response


Example: `my-social-api.d.ts`
```typescript
interface User { // Model inteface--could be imported from another file
  email: string
  name: string
  gender: 'Male' | 'Female' | 'Other'
}

export interface MySocialAPI {
  '/users': { // Route name (wihout prefix, if you have one)
    GET: { // Any valid HTTP method
      query: { // Query string params (e.g. /me?includeProfilePics=true)
        includeProfilePics?: boolean
      }
      response: User[] // JSON response
    }
  }

  '/user/:id/send-message': {
    POST: {
      params: { // Inline route params
        id: string
      }
      body: { // JSON request body
        message: string
      }
      response: { // JSON response
        success: boolean
      }
    }
  }
}
```

## Full-Stack Example

### 1. Define your API (`api.d.ts`)
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
  // Will not compile if you attempt to access an invalid body property
  const {foodItemId, address} = req.body
  const success = await OrderModel.order(foodItemId, address)

  // Will not compile if returned value is not of type {success: boolean}
  return {success}
})
```

### 3. Consume the API via axios

```typescript
import axios from 'restyped-axios'
import {FoodDeliveryAPI} from './api.d.ts'

const api = axios.create({baseURL: 'https://fooddelivery.com/api/'})

async function order() {
  // Will not compile if you request an invlid route or pass incorrect body params
  const res = await api.post(
    '/order',
    {
      foodItemId: 123,
      address: '1601 Market St, Phiadelphia, PA 19103'
    }
  )

  // TypeScript knows that res.data is of type {success: boolean}
  const {success} = res.data
}
```

## What RESTyped isn't
- **A replacement for API docs.** A RESTyped spec will help you get the **routes** and **types** right, but doesn't provide the **context** or say anything about the **content** of API requests and responses.
