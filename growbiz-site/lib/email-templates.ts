function shell(bodyHtml: string) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#FCFBFE;font-family:Arial,Helvetica,sans-serif;color:#211C29;">
  <div style="max-width:480px;margin:0 auto;padding:32px 24px;">
    <p style="font-size:18px;font-weight:bold;color:#5B2A82;margin:0 0 24px;">Grow Biz Jobs</p>
    ${bodyHtml}
    <p style="margin-top:32px;font-size:12px;color:#6E6479;">
      You're receiving this because of activity on your Grow Biz Jobs account.
    </p>
  </div>
</body>
</html>`;
}

const stageLabels: Record<string, string> = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
  rejected: "Not selected",
};

const verificationLabels: Record<string, string> = {
  verified: "verified",
  rejected: "rejected",
  needs_review: "flagged for review",
};

export function newApplicantEmail(jobTitle: string) {
  return {
    subject: `New applicant for ${jobTitle}`,
    html: shell(
      `<p style="font-size:15px;line-height:1.6;">You have a new applicant for <strong>${jobTitle}</strong>. Log in to your employer dashboard to review them.</p>`
    ),
  };
}

export function stageChangedEmail(jobTitle: string, stage: string) {
  return {
    subject: `Update on your application for ${jobTitle}`,
    html: shell(
      `<p style="font-size:15px;line-height:1.6;">Your application for <strong>${jobTitle}</strong> has moved to: <strong>${
        stageLabels[stage] ?? stage
      }</strong>.</p>`
    ),
  };
}

export function verificationDecisionEmail(companyName: string, status: string) {
  return {
    subject: `Verification update for ${companyName}`,
    html: shell(
      `<p style="font-size:15px;line-height:1.6;"><strong>${companyName}</strong> has been <strong>${
        verificationLabels[status] ?? status
      }</strong>.</p>`
    ),
  };
}

export function placementCandidateEmail(jobTitle: string, companyName: string) {
  return {
    subject: "Congratulations on your new role!",
    html: shell(
      `<p style="font-size:15px;line-height:1.6;">You've been placed at <strong>${companyName}</strong> for the role of <strong>${jobTitle}</strong>. Congratulations!</p>`
    ),
  };
}

export function placementEmployerEmail(jobTitle: string) {
  return {
    subject: `Placement recorded for ${jobTitle}`,
    html: shell(
      `<p style="font-size:15px;line-height:1.6;">A placement has been recorded for <strong>${jobTitle}</strong>.</p>`
    ),
  };
}
