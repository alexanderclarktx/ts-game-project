import { Animals, Lobby, Flappy, Sandbox, Dungeon, Home, Strike, ARAM, Soccer, Legends } from "@piggo-gg/games"

export const games = [Lobby, Flappy, Animals, Sandbox, Dungeon, Home, Strike, ARAM, Soccer, Legends]

export * from "./animals/Animals"
export * from "./aram/ARAM"
export * from "./dungeon/Dungeon"
export * from "./flappy/Flappy"
export * from "./home/Home"
export * from "./legends/entities"
export * from "./legends/Legends"
export * from "./lobby/Lobby"
export * from "./sandbox/Sandbox"
export * from "./soccer/entities"
export * from "./soccer/Soccer"
export * from "./strike/Strike"
export * from "./strike/StrikeSystem"
