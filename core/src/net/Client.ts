import {
  Character, DelaySyncer, LobbyCreate, LobbyJoin, NetClientSystem,
  NetMessageTypes, Player, stringify, RequestData, RequestTypes,
  Syncer, World, genPlayerId, SoundManager, genHash, AuthLogin,
  FriendsList,
  Friend,
  Safe
} from "@piggo-gg/core"

const servers = {
  dev: "ws://localhost:3000",
  // dev: "wss://piggo-api-staging.up.railway.app",
  production: "wss://api.piggo.gg"
} as const
const env = location.hostname === "localhost" ? "dev" : "production"

type Callback<R extends RequestTypes = RequestTypes> = (response: R["response"]) => void

export type Client = {
  connected: boolean
  lastLatency: number
  lastMessageTick: number
  lobbyId: string | undefined
  ms: number
  player: Player
  soundManager: SoundManager
  token: string | undefined
  ws: WebSocket
  playerId: () => string
  playerName: () => string
  playerCharacter: () => Character | undefined
  lobbyCreate: (callback: Callback<LobbyCreate>) => void
  lobbyJoin: (lobbyId: string, callback: Callback<LobbyJoin>) => void
  authLogin: (address: string, message: string, signature: string) => void
  friendsList: (callback: Callback<FriendsList>) => void
}

export type ClientProps = {
  world: World
}

export const Client = ({ world }: ClientProps): Client => {

  let syncer: Syncer = DelaySyncer
  let requestBuffer: Record<string, Callback> = {}

  const player = Player({ id: genPlayerId() })
  world.addEntity(player)

  const request = <R extends RequestTypes>(data: Omit<R, "response">, callback: Callback<R>) => {
    const requestData: RequestData = { type: "request", data }
    client.ws.send(stringify(requestData))
    requestBuffer[requestData.data.id] = callback
    // TODO handle timeout
  }

  const client: Client = {
    connected: false,
    lastLatency: 0,
    lastMessageTick: 0,
    lobbyId: undefined,
    ms: 0,
    player,
    soundManager: SoundManager(world),
    token: undefined,
    ws: new WebSocket(servers[env]),
    playerId: () => {
      return client.player.id
    },
    playerName: () => {
      return client.player.components.pc.data.name
    },
    playerCharacter: () => {
      return client.player.components.controlling.getControlledEntity(world)
    },
    lobbyCreate: (callback) => {
      request<LobbyCreate>({ route: "lobby/create", type: "request", id: genHash() }, (response) => {
        if ("error" in response) {
          console.error("Client: failed to create lobby", response.error)
        } else {
          client.lobbyId = response.lobbyId
          world.addSystemBuilders([NetClientSystem(syncer)])
        }
        callback(response)
      })
    },
    lobbyJoin: (lobbyId, callback) => {
      request<LobbyJoin>({ route: "lobby/join", type: "request", id: genHash(), join: lobbyId }, (response) => {
        if ("error" in response) {
          console.error("Client: failed to join lobby", response.error)
        } else {
          client.lobbyId = lobbyId
          callback(response)
          world.addSystemBuilders([NetClientSystem(syncer)])
        }
      })
    },
    authLogin: (address, message, signature) => {
      request<AuthLogin>({ route: "auth/login", type: "request", id: genHash(), message, signature, address }, (response) => {
        console.log("authLogin response", response)
        if ("error" in response) {
          console.error("Client: failed to login", response.error)
        } else {
          client.player.components.pc.data.name = response.name
          client.token = response.token
        }
      })
    },
    friendsList: (callback) => {
      if (!client.token) return
      request<FriendsList>({ route: "friends/list", type: "request", id: genHash(), token: client.token }, (response) => {
        console.log("friendsList response", response)
        callback(response)
      })
    }
  }

  setInterval(() => {
    client.connected = Boolean(client.lastMessageTick && ((world.tick - client.lastMessageTick) < 60))
  }, 200)

  client.ws.addEventListener("close", () => {
    console.error("websocket closed")
    world.removeSystem(NetClientSystem(syncer).id)
  })

  client.ws.addEventListener("message", (event) => {
    try {
      const message = JSON.parse(event.data) as NetMessageTypes
      if (message.type !== "response") return

      if (message.data.id in requestBuffer) {
        const callback = requestBuffer[message.data.id]

        callback(message.data)
        delete requestBuffer[message.data.id]
      }
    } catch (error) {
      console.error("Client: failed to parse message", error)
    }
  })

  client.ws.onopen = () => {
    // client.connected = true
    console.log("Client: connected to server")

    // const joinString: string = new URLSearchParams(window.location.search).get("join") ?? "hub"
    const joinString: string | null = new URLSearchParams(window.location.search).get("join")
    if (joinString) client.lobbyJoin(joinString, () => { })
  }

  client.ws.onclose = () => {
    // client.connected = false
    console.error("Client: disconnected from server") // TODO reconnect
  }

  return client
}
