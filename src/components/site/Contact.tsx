import { identity } from "@/data/portfolio";

/** The last screen: one line and the three ways to reach me. */
export const Contact = () => (
  <section
    aria-labelledby="contact-title"
    className="mx-auto flex min-h-[70svh] max-w-xl flex-col justify-center px-6 py-20"
  >
    <h2 id="contact-title">Get in touch</h2>
    <p className="em">The fastest way to reach me is email.</p>

    <ul className="mt-6 flex flex-wrap gap-2">
      {identity.links.map((link, index) => (
        <li key={link.href}>
          <a
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            className={index === 0 ? "btn" : "btn btn-ghost"}
          >
            {link.short}
          </a>
        </li>
      ))}
    </ul>

    <p className="em mt-20">
      © {new Date().getFullYear()} {identity.name}
    </p>
  </section>
);
