import { Login, LoginProps } from "@piggo-gg/web"
import { FaDiscord, FaGithub } from "react-icons/fa"

export type TitleBarProps = LoginProps & {}

export const TitleBar = ({ world, netState, setNetState }: TitleBarProps) => (
  <div style={{
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    userSelect: "none",
    margin: 0,
    marginBottom: 5
  }}>
    <div style={{ position: 'absolute', left: 0, bottom: 0 }}>
      <Login netState={netState} setNetState={setNetState} world={world} />
    </div>
    <h1 style={{ textAlign: "center", fontFamily: "Courier New", fontSize: 38, margin: "0 10px" }}>
      Piggo
    </h1>
    <svg height="30" viewBox="0 0 170 170" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id="mask1">
          <rect width="200" height="200" fill="white" />
          <path d="M30 75 Q45 45 60 75" fill="none" stroke="black" strokeWidth="9" />
          <path d="M100 75 Q115 45 130 75" fill="none" stroke="black" strokeWidth="9" />
          <circle cx="70" cy="115" r="7" fill="black" />
          <circle cx="90" cy="115" r="7" fill="black" />
          <ellipse cx="80" cy="115" rx="30" ry="20" fill="none" stroke="black" strokeWidth="6" />
        </mask>
      </defs>
      <circle cx="80" cy="90" r="80" fill="#FFC0CB" mask="url(#mask1)" />
      <path d="M10 52 C10 -10, 20 0, 60 12" fill="#FFC0CB" mask="url(#mask1)" />
      <path d="M150 52 C150 -10, 140 0, 100 12" fill="#FFC0CB" mask="url(#mask1)" />
    </svg>

    <div style={{ position: 'absolute', right: 0, bottom: 0 }}>
      <span style={{ fontFamily: "sans-serif", fontSize: 14, marginRight: 5, verticalAlign: "-70%" }}>
        v<b>0.10.1</b>
      </span>
      <a style={{ margin: 0, color: "inherit", textDecoration: "none" }} target="_blank" href="https://discord.gg/VfFG9XqDpJ">
        <FaDiscord size={20} style={{ color: "white", verticalAlign: "-80%" }}></FaDiscord>
      </a>
      <a style={{ margin: 0, color: "inherit", textDecoration: "none" }} target="_blank" href="https://github.com/alexanderclarktx/piggo-gg">
        <FaGithub size={20} style={{ color: "white", verticalAlign: "-70%", marginLeft: 5 }}></FaGithub>
      </a>
    </div>
  </div>
)
