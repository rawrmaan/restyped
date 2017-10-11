export interface FoodDeliveryAPI {
  '/login': {
    POST: {
      body: {
        username: string
        password: string
      }
      response: {
        token: {
          id: string
          expires: string
        }
        user: {
          id: string
          name: string
          defaultAddress: string
          hasPaymentMethod: boolean
        }
      }
    }
  }

  '/restaurants': {
    GET: {
      query: {
        nearLocation: string
        cuisineType?: string
      }
      response: any[] // recommended: Restaurent[], imported from another file
    }
  }

  '/me/orders': {
    POST: {
      body: {
        foodItemIds: string[]
        address: string
        paymentMethod: 'card' | 'cash'
        paymentCardId?: string
      }
      response: {
        success: boolean
        eta?: string
      }
    }
    GET: {
      query: {
        createdAfter?: string
      }
      response: any[] // recommended: Order[], imported from another file
    }
  }

  '/me/orders/:id': {
    DELETE: {
      params: {
        id: string
      }
      response: {
        success: boolean
        refundAmount?: string
      }
    }
  }
}
