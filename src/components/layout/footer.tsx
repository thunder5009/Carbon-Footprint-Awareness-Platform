/**
 * Footer — Site-wide footer with 4-column layout.
 *
 * Columns: Brand, Product, Resources, Legal.
 * Responsive: 4-col → 2-col on tablet → single column on mobile.
 * Uses semantic `<footer>` element with `role="contentinfo"`.
 */
import Link from "next/link";
import { Leaf } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Calculator", href: "/calculator" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Tips", href: "/api/tips" },
  ],
  resources: [
    { label: "API", href: "/api/footprint/calc" },
    { label: "Documentation", href: "#" },
    { label: "GitHub", href: "https://github.com" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Contact", href: "#" },
  ],
} as const;

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-border/50 mt-16"
    >
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              <span className="text-lg font-bold">CarbonTrack</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Calculate, understand, and reduce your carbon footprint.
              Built for a sustainable future.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/70">
              Product
            </h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/70">
              Resources
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/70">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CarbonTrack. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Data sources: EPA, IEA, DEFRA. Estimates ±20-30% uncertainty.
          </p>
        </div>
      </div>
    </footer>
  );
}
