import { useState } from 'react';
import { ArrowUp, ArrowUpRight, Check, Copy, MapPin } from 'lucide-react';
import { profile } from '../data';
import { useLocalTime } from '../hooks';
import { ExternalLink, Magnetic, SectionLabel } from './UI';

function ChessKnight() {
  return (
    <svg viewBox="0 0 90 100" fill="none" aria-hidden="true">
      <defs>
        <linearGradient
          id="knightMetal"
          x1="20"
          y1="10"
          x2="78"
          y2="92"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f1edff" />
          <stop offset=".25" stopColor="#9c8bbd" />
          <stop offset=".48" stopColor="#e6dcff" />
          <stop offset=".65" stopColor="#615477" />
          <stop offset="1" stopColor="#c0addc" />
        </linearGradient>
      </defs>
      <path
        d="M25 77c0-18 20-20 16-34l-13 9-12-9 10-23 14-5 4-12 10 10c23 9 27 39 11 64H25z"
        fill="url(#knightMetal)"
        stroke="#ddd0f5"
        strokeWidth=".6"
      />
      <path
        d="M44 17c13 4 21 15 19 31-1 10-8 17-8 28M28 38l17-14"
        stroke="#4e405f"
        strokeWidth="2"
      />
      <circle cx="36" cy="28" r="2.5" fill="#231b2d" />
      <path
        d="M24 77h42l5 8H19l5-8zm-6 10h54l5 8H13l5-8z"
        fill="url(#knightMetal)"
        stroke="#e2d4f6"
        strokeWidth=".6"
      />
    </svg>
  );
}

export default function Contact() {
  const time = useLocalTime();
  const [copyState, setCopyState] = useState('');
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyState('Email copied to clipboard.');
    } catch {
      setCopyState('Copy the address: ' + profile.email);
    }
  }
  return (
    <footer id="contact" className="contact section-shell" aria-labelledby="contact-title">
      <div className="contact-top" data-reveal>
        <SectionLabel number="05">GREAT THINGS START WITH A CONVERSATION</SectionLabel>
        <span className="availability">
          <i /> LET’S BUILD SOMETHING
        </span>
      </div>
      <div className="contact-heading" data-reveal>
        <h2 id="contact-title">
          Have something
          <br />
          in <span className="serif-accent">mind?</span>
        </h2>
        <Magnetic
          className="contact-orb"
          href={`mailto:${profile.email}`}
          aria-label="Start a conversation by email"
        >
          <ArrowUpRight strokeWidth={1} />
        </Magnetic>
      </div>
      <div className="contact-middle" data-reveal>
        <div className="email-block">
          <span className="mono">I’D LOVE TO HEAR ABOUT IT.</span>
          <div>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <button
              className="copy-email"
              onClick={copyEmail}
              aria-label="Copy email address"
              title="Copy email address"
            >
              {copyState.startsWith('Email copied') ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
          <p className="copy-status" role="status">
            {copyState}
          </p>
        </div>
        <div className="contact-socials">
          {[
            ['GitHub', profile.github],
            ['LinkedIn', profile.linkedin],
            ['LeetCode', profile.leetcode],
            ['Call me', `tel:${profile.phone}`],
          ].map(([name, url]) => (
            <ExternalLink key={name} href={url}>
              {name}
              <ArrowUpRight size={16} />
            </ExternalLink>
          ))}
        </div>
      </div>
      <div className="footer-personal">
        <div className="footer-location">
          <MapPin size={16} />
          <div>
            <span>BASED IN KANPUR, INDIA</span>
            <span>
              {time} IST <span className="location-divider">/</span> OPEN TO THE WORLD
            </span>
          </div>
        </div>
        <ExternalLink className="chess-link" href={profile.chess}>
          <div className="chess-piece">
            <ChessKnight />
          </div>
          <span>
            OFF THE KEYBOARD?
            <br />
            <b>Let’s play a game.</b>
          </span>
          <ArrowUpRight size={15} />
        </ExternalLink>
      </div>
      <div className="footer-bottom">
        <a className="footer-signature" href="#home">
          dhruv<span>.</span>
        </a>
        <span className="mono">© {new Date().getFullYear()} DHRUV SINGH</span>
        <span className="footer-crafted mono">BUILT WITH INTENTION. ALWAYS ITERATING.</span>
        <a className="back-top" href="#home" aria-label="Back to top">
          <ArrowUp size={17} />
        </a>
      </div>
    </footer>
  );
}
