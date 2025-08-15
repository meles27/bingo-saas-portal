// src/components/auth/auth-image-panel.tsx

export function AuthImagePanel() {
  return (
    <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=2831&auto=format&fit=crop"
        alt="Authentication background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-zinc-900/60" />

      {/* Content */}
      <div className="relative z-20 mt-auto">
        <blockquote className="space-y-2">
          <p className="text-lg">
            “This platform has saved us countless hours of work and helped us
            deliver stunning results for our clients faster than ever before.”
          </p>
          <footer className="text-sm font-medium">
            Sofia Davis, CEO of Tech Innovators
          </footer>
        </blockquote>
      </div>
    </div>
  );
}
