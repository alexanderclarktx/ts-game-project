import { InvokedAction, SerializedEntity, World } from "@piggo-gg/core"

// netcode

export type Syncer = {
  handleMessage: (world: World, gameData: GameData) => void
  writeMessage: (world: World) => GameData
}

export type NetMessageTypes = GameData | RequestData | ResponseData

export type GameData = {
  type: "game"
  actions: Record<string, InvokedAction[]>
  chats: Record<string, string[]>
  game: string
  latency?: number
  player: string
  serializedEntities: Record<string, SerializedEntity>
  tick: number
  timestamp: number
}

export type RollbackTickData = {
  type: "game"
  actions: Record<number, Record<string, InvokedAction[]>>
  chats: Record<number, Record<string, string[]>>
  latency?: number
  player: string
  serializedEntities: Record<string, SerializedEntity>
  tick: number
  timestamp: number
}

// API

export type Safe<T extends Request<string>> = Omit<T, "response"> & { response: Exclude<T["response"], { error: string, id: string }> }

export type Request<Route extends string, Response extends {} = {}> = {
  type: "request"
  id: string
  route: Route
  response: { id: string, error: string } | { id: string } & Response
}

export type RequestTypes =
  LobbyList | LobbyCreate | LobbyJoin | LobbyExit |
  FriendsList | FriendsAdd | FriendsRemove |
  AuthLogin

export type ExtractedRequestTypes<T extends RequestTypes['route']> = Extract<RequestTypes, { route: T }>

export type RequestData = {
  type: "request"
  data: Omit<RequestTypes, "response">
}

export type ResponseData = {
  type: "response"
  data: RequestTypes["response"]
}

// lobby endpoints
export type LobbyList = Request<"lobby/list">
export type LobbyCreate = Request<"lobby/create", { lobbyId: string }>
export type LobbyJoin = Request<"lobby/join"> & { join: string }
export type LobbyExit = Request<"lobby/exit">

export type LobbyListRequest = Omit<LobbyList, "response">
export type LobbyCreateRequest = Omit<LobbyCreate, "response">
export type LobbyJoinRequest = Omit<LobbyJoin, "response">
export type LobbyExitRequest = Omit<LobbyExit, "response">

// friends endpoints
export type Friend = { address: string, name: string, online: boolean }
export type FriendsList = Request<"friends/list", { friends: Friend[] }> & { token: string }
export type FriendsAdd = Request<"friends/add"> & { addUserId: string }
export type FriendsRemove = Request<"friends/remove"> & { removeUserId: string }

// auth endpoints
export type AuthLogin = Request<"auth/login", { token: string, name: string }> & {
  address: string, message: string, signature: string
}
