export interface MockCalendarLink {
  id: string
  url: string
}

export interface MockListing {
  id: string
  nickname: string
  streetAddress: string
  city: string
  state: string
  zip: string
  country: string
  createdAt: string
  updatedAt: string
  userId: string
  calendarLinks: MockCalendarLink[]
}

export const mockListings: MockListing[] = [
  {
    id: "6b2e2c0a-0d6d-4c9e-8d71-1f9f0b1a1a11",
    nickname: "Beach Bungalow",
    streetAddress: "123 Ocean Ave",
    city: "Santa Monica",
    state: "CA",
    zip: "90401",
    country: "USA",
    createdAt: new Date("2024-06-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2024-07-10T15:30:00Z").toISOString(),
    userId: "e9d2c9b8-7a64-4a1f-bf1c-2f3a6d8e5c44",
    calendarLinks: [
      { id: "1", url: "https://calendar.example.com/beach-bungalow/airbnb.ics" },
      { id: "2", url: "https://calendar.example.com/beach-bungalow/vrbo.ics" },
    ],
  },
  {
    id: "c1f8b5f0-2b9a-4d77-9a38-3d6b7e2a5f22",
    nickname: "Mountain Cabin",
    streetAddress: "456 Pine Road",
    city: "Aspen",
    state: "CO",
    zip: "81611",
    country: "USA",
    createdAt: new Date("2024-05-15T09:00:00Z").toISOString(),
    updatedAt: new Date("2024-07-01T12:00:00Z").toISOString(),
    userId: "e9d2c9b8-7a64-4a1f-bf1c-2f3a6d8e5c44",
    calendarLinks: [{ id: "3", url: "https://calendar.example.com/mountain-cabin/airbnb.ics" }],
  },
  {
    id: "a4e7d2b1-3c5d-4e2f-8a1b-2c3d4e5f6a33",
    nickname: "City Loft",
    streetAddress: "789 Market St",
    city: "San Francisco",
    state: "CA",
    zip: "94103",
    country: "USA",
    createdAt: new Date("2024-04-20T14:00:00Z").toISOString(),
    updatedAt: new Date("2024-07-15T08:45:00Z").toISOString(),
    userId: "e9d2c9b8-7a64-4a1f-bf1c-2f3a6d8e5c44",
    calendarLinks: [],
  },
]; 