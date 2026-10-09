# Orbit API

All endpoints require a signed-in Sites visitor. Requests are JSON and use the same origin as the dashboard. Error responses contain an `error` message. The API is designed for the browser workflow; it is not a public third-party API.

## GET /api/orbit

Returns `profile` and `rides`. Riders see their own trips. Drivers see trips assigned to them and currently unassigned requests. Ride responses may include the relevant rider and driver name/phone.

## POST /api/orbit

| Action    | Fields                            | Authorization and behavior                                                                                    |
| --------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `profile` | `name`, `phone`, `role`, `avatar` | Update the current account. Name required; role is rider or driver. Mode cannot change during an active ride. |
| `book`    | `pickup`, `destination`, `type`   | Rider only. Locations must be supported and distinct; type is go, comfort or xl. Server computes fare.        |
| `accept`  | `id`                              | Driver only. Conditional assignment of an unassigned requested ride; cannot accept one's own ride.            |
| `cancel`  | `id`                              | Owning rider only; requested, accepted or arrived states.                                                     |
| `advance` | `id`                              | Assigned driver only; accepted → arrived → in_progress → completed. Completion records cash collection.       |
| `review`  | `id`, `rating`, `review`          | Owning rider only, completed rides only. Rating is an integer from 1 to 5.                                    |

Successful mutations return `{ "ok": true }`. Unauthenticated access returns HTTP 401; invalid or unauthorized mutations return HTTP 400 in the current implementation.

## Sample booking

```json
{
  "action": "book",
  "pickup": "Indiranagar",
  "destination": "MG Road",
  "type": "go"
}
```

Supported locations: Indiranagar, MG Road, Koramangala, Bengaluru Airport, Whitefield and Cubbon Park. Distances are samples. Fare is `round(45 + sampleDistance × classRate)` in INR; rates are 14, 19 and 25 for go, comfort and xl.
