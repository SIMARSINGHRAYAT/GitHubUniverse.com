import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | GitHub Universe",
  description: "Privacy Policy for GitHub Universe.",
};

const lastUpdated = "September 4, 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#050508] px-6 py-12 text-[#f3f4f6] sm:px-10 lg:px-20">
      <article className="mx-auto max-w-4xl border-2 border-[#00ff66] bg-black/70 p-6 shadow-[8px_8px_0_#000,0_0_24px_rgba(0,255,102,0.16)] sm:p-10">
        <header className="border-b-2 border-[#1f2937] pb-8">
          <p className="font-pixel-terminal text-lg tracking-[0.12em] text-[#00e5ff]">GITHUB UNIVERSE / LEGAL</p>
          <h1 className="mt-5 font-pixel-heading text-2xl leading-relaxed text-[#00ff66] sm:text-3xl">Privacy Policy</h1>
          <p className="mt-5 font-pixel-terminal text-xl leading-relaxed text-[#cbd5e1]">Last updated: {lastUpdated}</p>
        </header>

        <div className="space-y-9 pt-8 font-pixel-terminal text-xl leading-relaxed text-[#e5e7eb]">
          <section>
            <h2 className="font-pixel-heading text-base leading-loose text-[#ffcc00]">1. About This Policy</h2>
            <p className="mt-3">This Privacy Policy explains how GitHub Universe collects, uses, and protects information when you use the GitHub Universe website or desktop application.</p>
          </section>

          <section>
            <h2 className="font-pixel-heading text-base leading-loose text-[#ffcc00]">2. Information We Collect</h2>
            <p className="mt-3">When you use the optional GitHub sign-in flow, we receive information that GitHub makes available through authorization, such as your GitHub account identifier, username, display name, avatar, and public profile details. We do not receive your GitHub password.</p>
            <p className="mt-3">We also store information you create in the app, including saved repositories, collections, application settings, and support actions associated with your account or guest session.</p>
          </section>

          <section>
            <h2 className="font-pixel-heading text-base leading-loose text-[#ffcc00]">3. How We Use Information</h2>
            <p className="mt-3">We use this information to authenticate you, maintain your session, show your profile, save your repository discoveries and preferences, provide app features, and respond to support requests. We may use repository information retrieved from GitHub to provide search and discovery features.</p>
          </section>

          <section>
            <h2 className="font-pixel-heading text-base leading-loose text-[#ffcc00]">4. Cookies and Similar Technologies</h2>
            <p className="mt-3">GitHub Universe uses a session cookie to keep you signed in. The application may also use essential browser or platform storage needed to remember settings and provide the service. We do not use this information for cross-site advertising.</p>
          </section>

          <section>
            <h2 className="font-pixel-heading text-base leading-loose text-[#ffcc00]">5. Third-Party Services</h2>
            <p className="mt-3">GitHub Universe connects to GitHub for authentication and repository data. GitHub processes information under its own policies and terms. The service may also be hosted by infrastructure providers that process data to operate the application, database, security, and network services.</p>
          </section>

          <section>
            <h2 className="font-pixel-heading text-base leading-loose text-[#ffcc00]">6. Retention and Security</h2>
            <p className="mt-3">We retain account and app data while it is needed to provide the service or while your account remains active. We use reasonable technical and organizational measures to protect stored information, but no internet or storage system can be guaranteed completely secure.</p>
          </section>

          <section>
            <h2 className="font-pixel-heading text-base leading-loose text-[#ffcc00]">7. Your Choices</h2>
            <p className="mt-3">You can stop using GitHub Universe at any time and revoke its access from your GitHub account settings. You can request correction or deletion of information associated with your account by contacting us. Some records may need to be retained where required for security, legal, or operational reasons.</p>
          </section>

          <section>
            <h2 className="font-pixel-heading text-base leading-loose text-[#ffcc00]">8. Children&apos;s Privacy</h2>
            <p className="mt-3">GitHub Universe is not directed to children under 13, and we do not knowingly collect personal information from children under 13.</p>
          </section>

          <section>
            <h2 className="font-pixel-heading text-base leading-loose text-[#ffcc00]">9. Changes to This Policy</h2>
            <p className="mt-3">We may update this policy when the service or applicable requirements change. The updated policy will be published at this URL with a new revision date.</p>
          </section>

          <section className="border-t-2 border-[#1f2937] pt-8">
            <h2 className="font-pixel-heading text-base leading-loose text-[#ffcc00]">10. Contact</h2>
            <p className="mt-3">For privacy questions or requests, contact the GitHub Universe maintainer through <a className="text-[#00e5ff] underline decoration-[#00e5ff] underline-offset-4 hover:text-[#00ff66]" href="https://github.com/SIMARSINGHRAYAT">GitHub</a>.</p>
          </section>
        </div>
      </article>
    </main>
  );
}