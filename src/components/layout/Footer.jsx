"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Github, Twitter, Linkedin, Mail, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const Footer = ({ className, ...props }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = {
    Product: [
      { label: "Discover Projects", href: "/discover" },
      { label: "Create Project", href: "/create" },
      { label: "How it Works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
    ],
    Company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
    ],
    Support: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "Status", href: "/status" },
      { label: "Community", href: "/community" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "GDPR", href: "/gdpr" },
    ],
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Mail, href: "mailto:hello@fundideas.com", label: "Email" },
  ];

  return (
    <footer
      className={cn("border-t border-white/10 bg-zinc-950", className)}
      {...props}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand Section */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center space-x-2">
              <Icon container size="lg" variant="violet">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500">
                  <span className="text-sm font-bold text-white">F</span>
                </div>
              </Icon>
              <span className="text-xl font-semibold text-zinc-100">
                Fund Ideas
              </span>
            </div>
            <p className="max-w-md leading-relaxed text-zinc-400">
              Empowering technical creators to bring their innovative ideas to
              life through community-driven funding and support.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-2xl p-2 text-zinc-400 transition-colors hover:bg-zinc-900/30 hover:text-zinc-100"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h3 className="text-sm font-semibold tracking-wider text-zinc-100 uppercase">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-zinc-400 transition-colors duration-200 hover:text-zinc-100"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-zinc-400">
              <span>© 2024 Fund Ideas. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">
                Made with ❤️ for creators
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className="text-zinc-400 hover:text-zinc-100"
              >
                <ArrowUp className="mr-2 h-4 w-4" />
                Back to top
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
