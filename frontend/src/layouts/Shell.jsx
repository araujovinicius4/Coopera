import React, { useState } from "react";
import Logo from "../components/Logo";
import {
  LayoutGrid,
  Link2,
  Handshake,
  Lightbulb,
  ChartNoAxesCombined,
  Wallet,
  ChevronDown,
  Bell,
  Search,
  Menu,
  X,
  ArrowUpRight,
  ShieldCheck,
  Layers,
} from "lucide-react";
const navigation = [
  ["home", "Urna Coopera", LayoutGrid],
  ["matches", "Matches", Link2],
  ["cooperations", "Cooperações", Handshake],
  ["ideas", "Urna de ideias", Lightbulb],
  ["dashboard", "Impacto coletivo", ChartNoAxesCombined],
];
export default function Shell({
  page,
  go,
  state,
  children,
  login,
  logout,
  onSearch,
}) {
  const [menu, setMenu] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [notifications, setNotifications] = useState(false);
  return (
    <div className="app-shell">
      <aside className={mobile ? "sidebar open" : "sidebar"}>
        <a
          className="brand"
          href="#home"
          onClick={() => {
            go("home");
            setMobile(false);
          }}
        >
          <Logo />
        </a>
        <div className="workspace">
          <span className="workspace-logo">C</span>
          <div>
            Comunidade Coopera<small>Um espaço de possibilidades</small>
          </div>
          <ChevronDown size={14} />
        </div>
        <div className="nav-label">CONECTAR & COOPERAR</div>
        <nav>
          {navigation.map(([id, label, Icon]) => (
            <button
              key={id}
              className={page === id ? "nav-item active" : "nav-item"}
              onClick={() => {
                go(id);
                setMobile(false);
              }}
            >
              <Icon size={19} />
              {label}
              {id === "matches" && (
                <span className="nav-count">{state.matches.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="nav-label second">MEU ESPAÇO</div>
        <button
          className={"nav-item " + (page === "publications" ? "active" : "")}
          onClick={() => go("publications")}
        >
          <Layers size={19} />
          Minhas publicações
        </button>
        <button
          className={"nav-item " + (page === "wallet" ? "active" : "")}
          onClick={() => go("wallet")}
        >
          <Wallet size={19} />
          Carteira Coopera
        </button>
        <button className="nav-item" onClick={() => go("ombudsman")}>
          <ArrowUpRight size={19} />
          Aplicações
        </button>
        <div className="sidebar-bottom">
          <div className="privacy-note">
            <ShieldCheck size={23} />
            <strong>Contribua com liberdade.</strong>
            <p>
              Sua identidade é protegida.
              <br />
              Sua contribuição faz a diferença.
            </p>
            <button onClick={() => go("privacy")}>
              Entenda a proteção <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="sidebar-footer">
            <span className="live-dot" /> Juntos, fazemos acontecer.
          </div>
        </div>
      </aside>
      {mobile && (
        <button
          className="backdrop"
          aria-label="Fechar navegação"
          onClick={() => setMobile(false)}
        />
      )}
      <div className="main-shell">
        <header className="topbar">
          <button
            className="icon-btn mobile-menu"
            aria-label="Abrir navegação"
            onClick={() => setMobile(!mobile)}
          >
            {mobile ? <X /> : <Menu />}
          </button>
          <a
            className="header-brand"
            href="#home"
            onClick={() => go("home")}
            aria-label="COOPERA — início"
          >
            <Logo compact />
          </a>
          <div className="breadcrumb">
            Comunidade <span>/</span>{" "}
            <b>
              {navigation.find((n) => n[0] === page)?.[1] ||
                {
                  wallet: "Carteira Coopera",
                  publications: "Minhas publicações",
                  privacy: "Privacidade e identidade",
                  profile: "Meu perfil",
                  settings: "Configurações",
                  reviews: "Minhas avaliações",
                  votes: "Minhas votações",
                  ombudsman: "Ouvidoria",
                }[page] ||
                "Cooperação"}
            </b>
          </div>
          <div className="header-actions">
            <span className="demo-label">AMBIENTE DEMO</span>
            <button
              className="icon-btn notification-button"
              aria-label="Notificações"
              onClick={() => setNotifications(!notifications)}
            >
              <Bell size={20} />
              {!state.notificationsRead && <i />}
            </button>
            <div className="user-wrap">
              <button
                className="user-button"
                aria-label={state.authenticated ? "Usuário demo" : "Visitante"}
                aria-expanded={menu}
                onClick={() => setMenu(!menu)}
              >
                <span className="avatar">
                  {state.authenticated ? "UD" : "V"}
                </span>
                <span>
                  {state.authenticated ? "Usuário demo" : "Visitante"}
                </span>
                <ChevronDown size={14} />
              </button>
              {menu && (
                <div className="dropdown">
                  {state.authenticated ? (
                    <>
                      {[
                        ["profile", "Meu perfil"],
                        ["publications", "Minhas publicações"],
                        ["matches", "Meus matches"],
                        ["cooperations", "Minhas cooperações"],
                        ["ideas", "Minhas ideias"],
                        ["reviews", "Minhas avaliações"],
                        ["votes", "Minhas votações"],
                        ["wallet", "Carteira Coopera"],
                        ["privacy", "Privacidade e identidade"],
                        ["settings", "Configurações"],
                      ].map(([id, label]) => (
                        <button
                          key={id}
                          onClick={() => {
                            go(id);
                            setMenu(false);
                          }}
                        >
                          {label}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          logout();
                          setMenu(false);
                        }}
                      >
                        Sair
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        login();
                        setMenu(false);
                      }}
                    >
                      Entrar como usuário demo
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          {notifications && (
            <div className="notification-panel">
              <strong>Suas notificações</strong>
              {state.notifications.map((n, i) => (
                <button
                  key={n}
                  onClick={() => {
                    go(
                      [
                        "matches",
                        "cooperations",
                        "cooperations",
                        "cooperations",
                        "ideas",
                        "votes",
                        "reviews",
                        "wallet",
                        "dashboard",
                      ][i],
                    );
                    setNotifications(false);
                  }}
                >
                  <span className="live-dot" />
                  {n}
                </button>
              ))}
            </div>
          )}
        </header>
        <main>{children}</main>
        <footer className="main-footer">
          <span>COOPERA · Conexões que transformam.</span>
          <button onClick={() => go("privacy")}>
            <ShieldCheck size={14} />
            Privacidade por princípio
          </button>
          <span>Protótipo demonstrativo</span>
        </footer>
      </div>
    </div>
  );
}
