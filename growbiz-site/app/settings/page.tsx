import { redirect } from "next/navigation";
import { Container, Kicker } from "@/components/ui";
import { SettingsForm, DeleteAccountSection } from "@/components/SettingsForm";
import { PhoneVerification } from "@/components/PhoneVerification";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Notification Settings" };

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: prefs }] = await Promise.all([
    supabase.from("profiles").select("phone, role").eq("id", user.id).single(),
    supabase.from("notification_preferences").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  return (
    <section className="py-12 md:py-16">
      <Container className="max-w-lg">
        <Kicker>Settings</Kicker>
        <h1 className="mt-3 font-display text-[26px] font-bold text-ink">Notification preferences</h1>
        <p className="mt-2 text-[14px] text-mist">
          Control how Grow Biz Jobs reaches you outside the app.
        </p>

        <div className="mt-8">
          <SettingsForm
            initialPhone={profile?.phone ?? ""}
            initialEmailEnabled={prefs?.email_enabled ?? true}
            initialSmsEnabled={prefs?.sms_enabled ?? false}
          />
        </div>

        {/* TEMPORARY diagnostic — remove once the phone-verification-not-showing issue is resolved */}
        {profile?.role === "candidate" && (
          <div className="mt-6">
            <PhoneVerification initialVerifiedPhone={user.phone || null} />
          </div>
        )}

        <div className="mt-6 rounded-card border border-line p-6">
          <h2 className="font-display text-[16px] font-semibold text-ink">Your data</h2>
          <p className="mt-1.5 text-[13.5px] text-mist">
            Download everything tied to your account — profile, applications, saved jobs, and
            more — as a JSON file.
          </p>
          <a
            href="/api/account/export"
            download
            className="mt-4 inline-block rounded-pill border border-plum-600 px-4 py-2 text-[13.5px] font-medium text-plum-600 hover:bg-plum-50"
          >
            Download my data
          </a>
        </div>

        <DeleteAccountSection />
      </Container>
    </section>
  );
}
