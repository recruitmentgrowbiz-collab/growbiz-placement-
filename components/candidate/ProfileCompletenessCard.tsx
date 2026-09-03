export function ProfileCompletenessCard({ score, missing }: { score: number; missing: string[] }) {
  return (
    <article className="rounded-card border border-line bg-white p-5">
      <p className="text-[13px] font-medium text-mist">Profile completeness</p>
      <div className="mt-3 h-2 rounded-pill bg-plum-50">
        <div className="h-2 rounded-pill bg-plum-600" style={{ width: `${score}%` }} />
      </div>
      <p className="mt-3 font-display text-[22px] font-bold text-ink">{score}% complete</p>
      <p className="mt-1 text-[13px] leading-relaxed text-mist">This helps you track missing profile details. It does not control employer hiring decisions.</p>
      {missing.length > 0 && <ul className="mt-4 space-y-2 text-[13.5px] text-ink/80">{missing.map((item) => <li key={item}>- {item}</li>)}</ul>}
    </article>
  );
}
