import React, { useEffect, useRef } from "react";
import {
  X,
  ShieldCheck,
  ArrowUpRight,
  Link2,
  Heart,
  Coins,
} from "lucide-react";
import { types } from "../mock/data";
export function Protected({ children }) {
  return (
    <div className="protection">
      <ShieldCheck size={18} />
      <span>
        {children || "Identidade protegida · O valor está na contribuição."}
      </span>
    </div>
  );
}
export function Modal({ title, close, children }) {
  const ref = useRef();
  useEffect(() => {
    const prev = document.activeElement;
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
      prev?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={close}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
    >
      <div className="modal-head">
        <h2>{title}</h2>
        <button className="icon-btn" aria-label="Fechar" onClick={close}>
          <X />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function PostCard({ post, onOpen, onSupport }) {
  return (
    <article className={"post-card " + types[post.type].color}>
      <div className="post-top">
        <span className={"badge " + types[post.type].color}>
          {types[post.type].label}
        </span>
        <span className="date">{post.date}</span>
      </div>
      <button className="card-title" onClick={() => onOpen(post)}>
        {post.title}
        <ArrowUpRight size={19} />
      </button>
      <p>{post.description}</p>
      <div className="tags">
        {post.tags.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div className="post-meta">
        <span>{post.category}</span>
        <span className="status-dot">{post.status}</span>
      </div>
      <div className="post-bottom">
        <span>
          <ShieldCheck size={14} /> Participante protegido
        </span>
        {post.type === "idea" ? (
          <button
            className="small-link"
            onClick={() => onSupport(post)}
            aria-label={"Apoiar " + post.title}
          >
            <Heart size={15} />
            {post.supports}
          </button>
        ) : (
          <span>
            <Link2 size={14} />
            {post.matches} matches
          </span>
        )}
      </div>
      {post.reward > 0 && (
        <div className="reward">
          <Coins size={15} />
          {post.reward} créditos de recompensa
        </div>
      )}
    </article>
  );
}
export function Empty({ text = "Ainda não há itens por aqui." }) {
  return (
    <div className="empty">
      <Link2 size={28} />
      <p>{text}</p>
    </div>
  );
}
